package edu.whu.utils;

import junit.framework.TestCase;

import java.io.File;

/**
 * @author Hill.Hu
 */
public class IoHelperTest extends TestCase {
    public void test_file_name() throws Exception {
        assertEquals("test", IoHelper.getFileNameWithoutExt(new File("test.rpn")));
        assertEquals("test.rpn", IoHelper.getFileNameWithoutExt(new File("test.rpn.jsp")));
    }
}
