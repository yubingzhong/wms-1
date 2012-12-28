package edu.whu.models.ecom;

import junit.framework.TestCase;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ResourceUtils;

import java.io.File;

/**
 * Created by IntelliJ IDEA.
 * User: hushan
 * Date: 11-7-25
 * Time: 下午10:15
 */
public class Text2NetCdfConvectorTest extends TestCase {
    public static final String TEST_DATA_TXT = "test-data.txt";
    public static final String TEST_NC = "test.nc";
    Text2NetCdfConvector convector = new Text2NetCdfConvector();
    private File file;
    EcomNetCdfReader reader ;
    private static Logger logger = LoggerFactory.getLogger(Text2NetCdfConvectorTest.class);

    public void test_convert() throws Exception {
        convector.convert(TEST_DATA_TXT, TEST_NC);
        reader = new EcomNetCdfReader(TEST_NC);
        reader.setSourceFile(TEST_NC);
        assertEquals(1.0, reader.read(0, 0, 1, 1).getHorizontalStrength());
        assertEquals(2.0, reader.read(0, 0, 0, 1).getHorizontalStrength());

        assertEquals(2.0, reader.read(0, 0, 0, 1).getHorizontalStrength());
        assertEquals(5.0, reader.read(0, 0, 0, 1).getVerticalStrength());
    }

    @Override
    public void setUp() throws Exception {
        //列，行，层
        String data = "          2          3           2\n" +
                "  6.2500000E-02\n" +
                //x方向第一层
                "1  2\n" +
                "2  1\n" +
                "3  3\n" +
                //x方向第二层
                "1  2\n" +
                "2  1\n" +
                "3  3\n" +

                //y方向第一层
                "4  2\n" +
                "5  1\n" +
                "6  3\n" +
                //y方向第二层
                "7  2\n" +
                "8  1\n" +
                "9  3\n" +


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

        file = new File(TEST_DATA_TXT);
        FileUtils.writeStringToFile(file, data);

    }

    @Override
    public void tearDown() throws Exception {
        file.deleteOnExit();
    }

    public void test_convert_ecom() throws Exception {
        String ecomNcFile = ResourceUtils.getFile("classpath:ecom").getPath() + "/ecom.nc";
        logger.debug("output file {}",ecomNcFile);
        convector.convert(ResourceUtils.getFile("classpath:ecom/gcmdm").getPath(), ecomNcFile);
        reader=new EcomNetCdfReader(ecomNcFile);

        assertEquals(0.09,reader.read(2,4,6,47).getVerticalStrength());
    }
}
