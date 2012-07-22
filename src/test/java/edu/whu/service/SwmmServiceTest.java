package edu.whu.service;

import com.google.common.collect.Lists;
import edu.whu.models.RainData;
import edu.whu.models.SWMMResult;
import edu.whu.models.Task;
import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.util.List;
import java.util.zip.DataFormatException;

import static org.junit.Assert.*;

/**
 * author: Hill.Hu
 */
@SuppressWarnings("unchecked")
public class SwmmServiceTest {
    public static final String RAIN_DATA_DIR = "../swmm/data";
    Task task = new Task();
    SwmmService swmmService = new SwmmService();
    String correctData = ";;***************************************************************************************************************,,,\n" +
            "[TIMESERIES],,,\n" +
            ";;Name           Date       Time       Value     ,,,\n" +
            "20060708,7/8/2006,15:00,0\n" +
            "20060708,7/8/2006,16:00,6.3\n" +
            "20060708,7/8/2006,17:00,7.2\n" +
            " ";

    @Before
    public void setUp() throws Exception {
        task = new Task();
        swmmService.setRainDataDir(RAIN_DATA_DIR);

        task.setId("2");
        task.addProperty(SwmmService.INPUT_TEMPLATES,ResourceUtils.getFile("classpath:swmm/Shahu.inp"));
        task.addProperty(SwmmService.RAIN_DATA_FILE, ResourceUtils.getFile("classpath:swmm/ts_0708.csv"));
    }

    @Test
    public void test_save_rain_data() throws Exception {
        String filename = "ts_0708.csv";

        swmmService.saveRainData(filename, correctData);

        assertEquals(correctData, FileUtils.readFileToString(new File(RAIN_DATA_DIR, filename)));
        List<String[]> data = swmmService.loadRainData(filename);
        assertArrayEquals(new String[]{"20060708", "7/8/2006", "15:00", "0"}, data.get(0));
        String errorData = "20060708,7/8/2006";
        try {
            swmmService.saveRainData(filename, errorData);

        } catch (DataFormatException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void test_fix_file_name() throws Exception {
        Assert.assertEquals("ts_0708.csv", swmmService.getFileName("D:\\ts_0708.csv"));
        Assert.assertEquals("ts_0708.csv", swmmService.getFileName("ts_0708.csv"));
    }

    @Test
    public void test_execute() throws Exception {

        swmmService.setSwmmHome(ResourceUtils.getFile("classpath:swmm/SwmmConvert.exe").getPath());
        swmmService.execute(task, System.out);

    }

    @Test
    public void test_read_result() throws Exception {
        String path = ResourceUtils.getFile("classpath:swmm/swmm_output.out").getPath();
        task.addProperty(SwmmService.OUT_PATH,path);
        SWMMResult swmmResult = swmmService.readResult(task);
        assertEquals(1068, swmmResult.getNodeNames().length);
        assertArrayEquals(new String[]{"INFLOW","Sanitary","Storm"}, swmmResult.getParamsList());

    }

    @Test
    public void test_config() throws Exception {

        swmmService.config(task);

        List<String> list = FileUtils.readLines(new File("..//jobs//2//swmm//Shahu.inp"));
        Assert.assertEquals("START_DATE           7/8/2006", list.get(7));
    }

    @Test
    public void test_read_rain_data() throws Exception {

        List<RainData> dataList = swmmService.readRainData(Lists.newArrayList(correctData.split("\\n")));
        Assert.assertEquals(3, dataList.size());
        Assert.assertEquals("7.2", dataList.get(2).getValue());
        swmmService.parseRainData(dataList, task);
        assertEquals("0", task.getProperty("DRY_DAYS"));
        assertEquals("7/8/2006", task.getProperty("SWEEP_START"));
        assertEquals("7/8/2006", task.getProperty("SWEEP_END"));
        assertEquals("20060708", task.getProperty("TIMESERIES"));
        assertEquals("20060708         7/8/2006   15:00      0         \n" +
                "20060708         7/8/2006   16:00      6.3       \n" +
                "20060708         7/8/2006   17:00      7.2       \n", task.getProperty("ALLTIMESERIES"));
    }


}
