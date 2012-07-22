package edu.whu.models.ecom;

import edu.whu.models.Current;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ucar.ma2.Array;
import ucar.ma2.InvalidRangeException;
import ucar.nc2.NetcdfFile;
import ucar.nc2.Variable;

import java.io.IOException;

/**
 * User: hushan
 * Date: 11-7-25
 * Time: 下午9:17
 * 读取netcdf格式的ecom数据
 */
public class EcomNetCdfReader implements EcomDataReader {
    private static Logger logger = LoggerFactory.getLogger(EcomNetCdfReader.class);

    private String sourceFile;
    private NetcdfFile netcdfFile;

    public EcomNetCdfReader(String sourceFile) {
        this.sourceFile = sourceFile;
        try {
            netcdfFile = NetcdfFile.open(sourceFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Current read(int time, int layer, int x, int y) throws IOException {

        Current current = new Current();

        current.setHorizontalStrength(readVar(time, layer, x, y, "x"));
        current.setVerticalStrength(readVar(time, layer, x, y, "y"));

        return current;
    }

    private double readVar(int time, int layer, int x, int y, String varName) throws IOException {

        double varValue = 0;
        Variable v = this.netcdfFile.findVariable(varName);
        int[] origin = new int[]{time, layer, x, y};
        int[] size = new int[]{1, 1, 1, 1};
        try {
            Array data4D = v.read(origin, size);
            Array data = data4D.reduce().reduce().reduce();
            varValue = data.getDouble(0);

            return varValue;
        } catch (InvalidRangeException e) {
            logger.error(String.format("error args var_%s_time_%s_layer_%s_i_%s_j_%s ",varName,time,layer,x,y));
            throw new IOException(e);
        }

    }

    public void setSourceFile(String sourceFile) {
        this.sourceFile = sourceFile;
    }
}
