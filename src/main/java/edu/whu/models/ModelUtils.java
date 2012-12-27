package edu.whu.models;


import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;

/**
 *@author hill.hu
 */
public class ModelUtils {
    public static String[] splitFields(String firstLine) {
        String first = firstLine.replaceAll("\\s+", " ").trim();

        return StringUtils.splitByWholeSeparator(first, " ");
    }

    /**
     * 从ij字符值中，分割出i，j
     *
     * @param ijString
     * @return
     */
    public static Grid getGrid(String ijString) {
//        while (ijString.length() < 6) {
//            ijString = "0" + ijString;
//        }
//        Assert.assertEquals(ijString.length(), 6);
        String[] ij= ijString.split("-");
        int i = NumberUtils.toInt(ij[0]);
        int j = NumberUtils.toInt(ij[1]);
        return new Grid(i, j);
    }
}
