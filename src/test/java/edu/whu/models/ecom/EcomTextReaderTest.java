package edu.whu.models.ecom;

import junit.framework.TestCase;
import org.apache.commons.io.FileUtils;

import java.io.File;

/**
 */
public class EcomTextReaderTest extends TestCase {
    EcomTextReader reader;
    private File file;

    @Override
    public void setUp() throws Exception {
        reader = new EcomTextReader();

        String data = "          2          3           2\n" +
                "  6.2500000E-02\n" +
                "1  2\n" +
                "2  1\n" +
                "3  3\n" +

                "1  2\n" +
                "2  1\n" +
                "3  3\n" +

                "1  2\n" +
                "2  1\n" +
                "3  3\n" +

                "1  2\n" +
                "2  1\n" +
                "3  3\n" +


                "  7.2500000E-02\n" +
                "1  2\n" +
                "2  1\n" +
                "3  3\n" +

                "4  2\n" +
                "5  1\n" +
                "6  3\n" +

                "7  2\n" +
                "8  1\n" +
                "9  3\n" +

                "10  2\n" +
                "11  1\n" +
                "12  3";

        file = new File("test-data.txt");
        FileUtils.writeStringToFile(file, data);
        reader.setFilePath("test-data.txt");


    }



    public void test_get_line_num() throws Exception {

        assertEquals(1.0, reader.readVar(1, 1, 0, 0, 1));
        assertEquals(0.0, reader.read(1, 1, 0, 0).getAngle());
        assertEquals(10.0, reader.readVar(2, 2, 0, 0, 2));
    }

    @Override
    public void tearDown() throws Exception {
        file.deleteOnExit();
    }
}
