package edu.whu.service;

import com.google.common.collect.Lists;
import edu.whu.models.Job;
import edu.whu.models.RainData;
import edu.whu.models.SWMMResult;
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
    Job job = new Job();
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
        job = new Job();
        swmmService.setRainDataDir(RAIN_DATA_DIR);

        job.setId("2");
        job.addProperty(SwmmService.INPUT_TEMPLATES,ResourceUtils.getFile("classpath:swmm/Shahu.inp"));
        job.setRainDataFile(ResourceUtils.getFile("classpath:swmm/ts_0708.csv").getPath());
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
        swmmService.execute(job, System.out);

    }

    @Test
    public void test_read_result() throws Exception {
        String path = ResourceUtils.getFile("classpath:swmm/swmm_output.out").getPath();

        SWMMResult swmmResult = swmmService.readResult(job);
        assertEquals(1068, swmmResult.getNodeNames().length);
        assertArrayEquals(new String[]{"INFLOW","Sanitary","Storm"}, swmmResult.getParamsList());

    }

    @Test
    public void test_config() throws Exception {

        swmmService.config(job);

        List<String> list = FileUtils.readLines(new File("..//jobs//2//swmm//Shahu.inp"));
        Assert.assertEquals("START_DATE           7/8/2006", list.get(7));
    }

    @Test
    public void test_read_rain_data() throws Exception {

        List<RainData> dataList = swmmService.readRainData(Lists.newArrayList(correctData.split("\\n")));
        Assert.assertEquals(3, dataList.size());
        Assert.assertEquals("7.2", dataList.get(2).getValue());
        swmmService.parseRainData(dataList, job);
        assertEquals("0", job.getProperty("DRY_DAYS"));
        assertEquals("7/8/2006", job.getProperty("SWEEP_START"));
        assertEquals("7/8/2006", job.getProperty("SWEEP_END"));
        assertEquals("20060708", job.getProperty("TIMESERIES"));
        assertEquals("20060708         7/8/2006   15:00      0         \n" +
                "20060708         7/8/2006   16:00      6.3       \n" +
                "20060708         7/8/2006   17:00      7.2       \n", job.getProperty("ALLTIMESERIES"));
    }


}
