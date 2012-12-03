package edu.whu.models;

import org.apache.commons.lang.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.text.ParseException;
import java.util.Date;

/**
 * swmm5 的结果解析类
 *
 * @author Hill.Hu
 */
public class Swmm5Result {
    private static Logger logger = LoggerFactory.getLogger(Swmm5Result.class);

    private int nperiods;                  // number of reporting periods
    private int flowUnits;                 // flow units code
    private int nsubcatch;                 // number of subcatchments
    private int nnodes;                    // number of drainage system nodes
    private int nlinks;                    // number of drainage system links
    private int npolluts;                  // number of pollutants tracked
    private double startDate;                 // start date of simulation
    private int reportStep;                // reporting time step (seconds)

    public final static int ITEM_SUBCATCH = 0;
    public final static int ITEM_NODE = 1;
    public final static int ITEM_LINK = 2;
    public final static int ITEM_SYS = 3;
    public final static int RECORDSIZE = 4;       // number of bytes per file record

    private int SubcatchVars;               // number of subcatch reporting variables
    private int nodeVars;                   // number of node reporting variables
    private int LinkVars;                   // number of link reporting variables
    private int SysVars;                    // number of system reporting variables

    private int StartPos;                // file position where results start
    private int bytesPerPeriod;          // bytes used for results in each period
    private RandomAccessFile reader;

    public int openSwmmOutFile(String filePath) throws IOException
//-----------------------------------------------------------------------------
    {
        int magic1, magic2, errCode, offset, offset0, version;
        int err;

        // --- open the output file

        reader = new RandomAccessFile(filePath, "r");
        // --- check that file contains at least 14 records

        long length = reader.length();
        if (length < 14 * RECORDSIZE) {
            reader.close();
            return 1;
        }

        // --- read parameters from end of file
        reader.seek(length - 5 * RECORDSIZE);
        long pointer = reader.getFilePointer();
        Assert.isTrue(length - pointer == 5 * RECORDSIZE);

        offset0 = (int) readInt();
        pointer = reader.getFilePointer();
        Assert.isTrue(length - pointer == 4 * RECORDSIZE);

        StartPos = readInt();

        nperiods = readInt();
        errCode = readInt();
        magic2 = readInt();
        Assert.isTrue(length == reader.getFilePointer());
        reader.seek(0);
        magic1 = readInt();
        Assert.isTrue(magic1 == magic2, "");
        Assert.isTrue(errCode == 0, "");
        Assert.isTrue(nperiods > 0);
        version = readInt();
        flowUnits = readInt();
        nsubcatch = readInt();
        nnodes = readInt();
        nlinks = readInt();
        npolluts = readInt();

        /*  Skip over saved subcatch/node/link input values */
        offset = (nsubcatch + 2) * RECORDSIZE  /*  Subcatchment area */
                + (3 * nnodes + 4) * RECORDSIZE  /*  Node type, invert & max depth */
                + (5 * nlinks + 6) * RECORDSIZE; /*  Link type, z1, z2, max depth & length */
        offset = offset0 + offset;
        reader.seek(offset);

        /*  Read number & codes of computed variables */
        SubcatchVars = readInt(); /*  # Subcatch variables */

        reader.skipBytes(SubcatchVars * RECORDSIZE);
        nodeVars = readInt();
        reader.skipBytes(nodeVars * RECORDSIZE);
        LinkVars = readInt(); /*  # Link variables */
        reader.skipBytes(LinkVars * RECORDSIZE);
        SysVars = readInt(); /*  # System variables */
        reader.skipBytes(SysVars * RECORDSIZE);

        /*  --- read data just before start of output results */
        offset = StartPos - 3 * RECORDSIZE;

        reader.seek(offset);
        startDate = readDouble();
        reportStep = readInt();

        /*  --- compute number of bytes of results values used per time period */
        bytesPerPeriod = 2 * RECORDSIZE +      /*  date value (a double) */
                (nsubcatch * SubcatchVars +
                        nnodes * nodeVars +
                        nlinks * LinkVars +
                        SysVars) * RECORDSIZE;

        return errCode;
    }

    private int readInt() throws IOException {
        byte[] bytes = new byte[RECORDSIZE];
        reader.read(bytes);
        ByteBuffer buffer = ByteBuffer.wrap(bytes);
        buffer.order(ByteOrder.LITTLE_ENDIAN);

        return buffer.getInt();
    }

    private float readFloat() throws IOException {
        byte[] bytes = new byte[RECORDSIZE];
        reader.read(bytes);
        ByteBuffer buffer = ByteBuffer.wrap(bytes);
        buffer.order(ByteOrder.LITTLE_ENDIAN);

        return buffer.getFloat();
    }

    private double readDouble() throws IOException {
        byte[] bytes = new byte[8];
        reader.read(bytes);
        ByteBuffer buffer = ByteBuffer.wrap(bytes);
        buffer.order(ByteOrder.LITTLE_ENDIAN);

        return buffer.getDouble();
    }

    /**
     * 从swmmResult中读取结果
     *
     * @param itemType  类型
     * @param itemIndex the index of the item being sought
     * @param varIndex  the index of the variable being sought
     * @param period    the index of the time period being sought, starting from 1
     * @return value
     * @throws IOException
     */
    public double getSwmmResult(int itemType, int itemIndex, int varIndex, int period) throws IOException {
        Assert.isTrue(period>=1,"period should be great than 1");
        int offset;

        /*  --- compute offset into output file */
        double value = 0.0;
        offset = StartPos + (period - 1) * bytesPerPeriod + 2 * RECORDSIZE;
        if (itemType == ITEM_SUBCATCH) {
            offset += RECORDSIZE * (itemIndex * SubcatchVars + varIndex);
        } else if (itemType == ITEM_NODE) {
            offset += RECORDSIZE * (nsubcatch * SubcatchVars +
                    itemIndex * nodeVars + varIndex);
        } else if (itemType == ITEM_LINK) {
            offset += RECORDSIZE * (nsubcatch * SubcatchVars +
                    nnodes * nodeVars +
                    itemIndex * LinkVars + varIndex);
        } else if (itemType == ITEM_SYS) {
            offset += RECORDSIZE * (nsubcatch * SubcatchVars +
                    nnodes * nodeVars +
                    nlinks * LinkVars + varIndex);
        } else {
            throw new IllegalArgumentException("err itemType=" + itemType + " ");
        }

        /*  --- re-position the file and read the result */
        try {
            reader.seek(offset);
            value = readFloat();
        } catch (IOException e) {
            logger.error("read data fail itemType={} itemIndex ={}  varIndex={}, period={}",new Object[]{itemType,itemIndex,varIndex,period});
            throw e;
        }

        return value;
    }

    public void close() {
        if (reader != null) {
            try {
                reader.close();
            } catch (IOException e) {
                logger.error("close swmm out file fail ", e);
            }
        }
    }

    public int getNperiods() {
        return nperiods;
    }

    public int getNnodes() {
        return nnodes;
    }

    public int getNpolluts() {
        return npolluts;
    }

    public int getNodeVars() {
        return nodeVars;
    }

    /**
     * 参见swmm文档：
     * start date of simulation (decimal days relative to 12 midnight on 12/31/1899)
     *
     * @return
     */
    public Date getStartDate() {
        try {
            Date relativeDate = DateUtils.parseDate("12/31/1899", new String[]{"MM/dd/yyyy"});
            return DateUtils.addDays(relativeDate, (int) startDate - 1);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

    }
}
