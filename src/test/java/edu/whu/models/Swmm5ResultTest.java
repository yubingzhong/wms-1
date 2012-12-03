package edu.whu.models;

import junit.framework.TestCase;
import org.springframework.util.ResourceUtils;

import java.text.SimpleDateFormat;

/**
 * @author Hill.Hu
 */
public class Swmm5ResultTest extends TestCase {
    Swmm5Result result =new Swmm5Result();

    @Override
    public void tearDown() throws Exception {
        result.close();
    }

    public void test_helper() throws Exception {
        result.openSwmmOutFile(ResourceUtils.getFile("classpath:swmm/swmm_test.out").getPath());
        assertEquals(48, result.getNperiods());
        assertEquals(148, result.getNnodes());
        assertEquals(11,result.getNodeVars());
        assertEquals(5, result.getNpolluts());
        assertEquals("2010-01-01 00:00:00",
                new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(result.getStartDate()));
         assertEquals(0.05328984931111336, result.getSwmmResult(Swmm5Result.ITEM_NODE, 0, 0, 1));
    }
}
