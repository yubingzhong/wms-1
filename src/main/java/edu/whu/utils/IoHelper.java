package edu.whu.utils;

import java.io.File;

/**
 * @author Hill.Hu
 */
public class IoHelper {
    public static String getFileNameWithoutExt(File file) {

        return file.getName().substring(0,file.getName().lastIndexOf("."));
    }
}
