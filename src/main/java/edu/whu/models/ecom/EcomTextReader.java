package edu.whu.models.ecom;

import edu.whu.models.Current;
import edu.whu.models.ModelUtils;

import org.apache.commons.lang.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

import java.io.FileReader;
import java.io.IOException;
import java.io.LineNumberReader;

/**
 * User: hushan
 * Date: 11-7-20
 * Time: 下午8:46
 */
public class EcomTextReader implements EcomDataReader {
    private static Logger logger = LoggerFactory.getLogger(EcomTextReader.class);

    private int gridColSize = 47;
    private int gridRowSize = 62;
    private int layerNum = 6;
    private String filePath = "E:\\water-resource\\ecomdata\\DONGHU\\gcmdm.031";
    private AngelReader angelReader;
    public EcomTextReader() {

    }

    /**
     * 读取特定时间，点，水层的流场
     * param time  时间序列
     * param x
     * param y
     * param layer
     * return
     */
    public Current read(int time, int layer, int x, int y) throws IOException {
        double xStrength = readVar(time, layer, x, y, 1);
        double yStrength = readVar(time, layer, x, y, 2);

        Current current = new Current(xStrength, yStrength);
        return current;
    }





    public double readVar(int time, int layer, int x, int y, int varNum) throws IOException {

        FileReader in = new FileReader(filePath);
        LineNumberReader reader = new LineNumberReader(in);
//        Assert.assertEquals(reader.getLineNumber(), 0);
        String firstLine = reader.readLine();
        String[] desc = ModelUtils.splitFields(firstLine);
        gridColSize = Integer.parseInt(desc[0]);
        gridRowSize = Integer.parseInt(desc[1]);
        layerNum = Integer.parseInt(desc[2]);
        logger.debug(String.format("gridColSize =%s ,gridRowSize=%s gridColSize=%s", gridColSize, gridRowSize, layerNum));

        int start = layerNum * gridRowSize * (varNum - 1) + (layer - 1) * gridRowSize + y + 1;
        readToTime(time, reader);

        String curLine = readNextCountLine(start, reader);
        String[] data = StringUtils.splitByWholeSeparator(curLine, " ");
//        Assert.assertEquals("grid col not equal ,lineNum=" + reader.getLineNumber(), gridColSize, data.length);
        return Double.parseDouble(data[x]);
    }


    private String readNextCountLine(int count, LineNumberReader reader) throws IOException {
        String data = null;
        for (int i = 0; i < count; i++) {
            data = reader.readLine();
        }
        return data;
    }

    private void readToTime(int time, LineNumberReader reader) throws IOException {
        String timeTag;
        int currentTime = 0;
        do {
            timeTag = reader.readLine();
            if (timeTag.length() > 3 && timeTag.length() < 20) {
                currentTime++;
            }
        } while (currentTime < time);

        logger.debug("time = " + timeTag);
    }




    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }


}