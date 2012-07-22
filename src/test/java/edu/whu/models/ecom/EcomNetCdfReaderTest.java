package edu.whu.models.ecom;

import junit.framework.TestCase;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ucar.ma2.Array;
import ucar.nc2.NetcdfFile;
import ucar.nc2.Variable;

import java.io.IOException;

/**
 * Created by IntelliJ IDEA.
 * User: hushan
 * Date: 11-7-25
 * Time: 下午9:28
 */
public class EcomNetCdfReaderTest extends TestCase {

    private static Logger logger = LoggerFactory.getLogger(EcomNetCdfReaderTest.class);

    EcomNetCdfReader reader;

    public void test_read_ecom() throws Exception {
        reader= new EcomNetCdfReader("E:\\water-resource\\ecomdata\\DONGHU\\ecom.nc");
        reader.read(1,1,1,1);
    }

    public void test_read() throws Exception {
        String filename = "E:\\c#\\netcdf\\netcdf-c#\\测试数据\\test.nc";
        NetcdfFile ncfile = null;
        try {
            ncfile = NetcdfFile.open(filename);
            String varName = "data";
            Variable v = ncfile.findVariable(varName);
            assertNotNull(v);
            int[] origin = new int[]{ 1, 1};
            int[] size = new int[]{ 1, 1};
            Array data = v.read(origin, size);
            int value = data.getInt(0);
            assertEquals(13,value);
            logger.debug(data.toString());
        } catch (IOException ioe) {
            logger.debug("trying to open " + filename, ioe);
        } finally {
            if (null != ncfile) try {
                ncfile.close();
            } catch (IOException ioe) {
                logger.debug("trying to close " + filename, ioe);
            }
        }
    }
}
