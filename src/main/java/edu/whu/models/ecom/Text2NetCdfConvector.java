package edu.whu.models.ecom;

import com.google.common.collect.Lists;
import edu.whu.models.ModelUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ucar.ma2.ArrayDouble;
import ucar.ma2.DataType;
import ucar.ma2.Index;
import ucar.ma2.InvalidRangeException;
import ucar.nc2.Dimension;
import ucar.nc2.NetcdfFileWriteable;

import java.io.FileReader;
import java.io.IOException;
import java.io.LineNumberReader;
import java.util.List;

/**
 * 将ecom的十进制文件转换为netcdf文件
 * User: hushan
 * Date: 11-7-25
 * Time: 下午10:15
 */
public class Text2NetCdfConvector {
    private static Logger logger = LoggerFactory.getLogger(Text2NetCdfConvector.class);

    private LineNumberReader lineNumberReader;
    private NetcdfFileWriteable ncfile;

    public void convert(String ecomTextFile, String ecomNcFile) throws IOException {
        FileReader fileReader = new FileReader(ecomTextFile);
        lineNumberReader = new LineNumberReader(fileReader);
//        Assert.assertEquals(lineNumberReader.getLineNumber(), 0);
        String firstLine = lineNumberReader.readLine();
        String[] desc = ModelUtils.splitFields(firstLine);
        int gridColSize = Integer.parseInt(desc[0]);
        int gridRowSize = Integer.parseInt(desc[1]);
        int layerNum = Integer.parseInt(desc[2]);

        ncfile = NetcdfFileWriteable.createNew(ecomNcFile, false);

        Dimension timeDim = ncfile.addUnlimitedDimension("time");
        Dimension layerDim = ncfile.addDimension("layer", layerNum);
        Dimension iDim = ncfile.addDimension("i", gridColSize);
        Dimension jDim = ncfile.addDimension("j", gridRowSize);
        List<Dimension> dims = Lists.newArrayList(timeDim, layerDim, iDim, jDim);

        ncfile.addVariable("x", DataType.DOUBLE, dims);
        ncfile.addVariable("y", DataType.DOUBLE, dims);
        ncfile.create();

        int time = 0;
        String timeTag;
        while ((timeTag = lineNumberReader.readLine()) != null) {
            logger.debug("current time " + timeTag);

            writeVar(gridColSize, layerDim, iDim, jDim, time, "x");
            writeVar(gridColSize, layerDim, iDim, jDim, time, "y");
            time++;
        }


        ncfile.close();

    }

    private void writeVar(int gridColSize, Dimension layerDim, Dimension iDim, Dimension jDim, int time, String var) throws IOException {
        ArrayDouble xData = new ArrayDouble.D4(1, layerDim.getLength(), iDim.getLength(), jDim.getLength());
        int i, j, layer;
        Index ima = xData.getIndex();
        int valueCount = 0, totalCount = 0;
        for (layer = 0; layer < layerDim.getLength(); layer++) {
            for (j = 0; j < jDim.getLength(); j++) {
                String line = lineNumberReader.readLine();
                String[] values = ModelUtils.splitFields(line);
//                Assert.assertEquals("每行值的个数应该等于列的个数", gridColSize, values.length);
                for (i = 0; i < iDim.getLength(); i++) {
                    double value = Double.parseDouble(values[i]);
                    Index index = ima.set(0, layer, i, j);
                    xData.setDouble(index, value);
                    if (value != 0){
//                        logger.debug(String.format("var_%s_time_%s_layer_%s_i_%s_j_%s =%s",var,time,layer,i,j,value));
                        valueCount++;
                    }
                    totalCount++;
                }
            }
        }
        logger.info(String.format("var =%s ,valueCount=%s ,totalCount=%s", var, valueCount, totalCount));
        int[] origin = new int[]{time, 0, 0, 0};
        try {
            ncfile.write(var, origin, xData);
        } catch (InvalidRangeException e) {
            throw new IOException(e);
        }
    }
}

