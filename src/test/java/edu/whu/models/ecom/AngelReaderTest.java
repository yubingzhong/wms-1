package edu.whu.models.ecom;

import junit.framework.TestCase;
import org.apache.commons.io.FileUtils;

import java.io.File;

/**
 * User: hushan
 * Date: 11-7-31
 * Time: 下午10:42

 */
public class AngelReaderTest extends TestCase {
    AngelReader reader = new AngelReader();
    private File angelFile;

    @Override
    public void setUp() throws Exception {
        String angelData = "17\t2\t338.88\n" +
                "21\t2\t308.49\n" +
                "22\t2\t311.92\n" +
                "23\t2\t308.25\n" +
                "24\t2\t313.17\n" +
                "25\t2\t313.64\n" +
                "26\t2\t311.09\n" +
                "17\t3\t345.29\n" +
                "18\t3\t349.32\n" +
                "19\t3\t347.01";
        angelFile = new File("angelData.txt");
        FileUtils.writeStringToFile(angelFile, angelData);
        reader.setAngelFile("angelData.txt");
        reader.readAngel();
    }

    public void test_angel() throws Exception {
        assertEquals(338.88, reader.getAngel(17, 2));
    }

    @Override
    public void tearDown() throws Exception {
        angelFile.deleteOnExit();

    }
}
