package edu.whu.service;

import com.google.common.collect.Lists;
import edu.whu.models.Job;
import edu.whu.models.RainData;
import edu.whu.models.SWMMResult;
import edu.whu.models.Swmm5Result;
import edu.whu.utils.IoHelper;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.io.*;
import java.util.List;
import java.util.Map;
import java.util.zip.DataFormatException;

/**
 * @author Hill.Hu
 */
@Service
@SuppressWarnings("unchecked")
public class SwmmService implements TaskService {
    private static Logger logger = LoggerFactory.getLogger(SwmmService.class);
    public static final String OUT_PATH = "OUT_PATH";
    public static final String INPUT_TEMPLATES = "INPUT_TEMPLATES";

    private String rainDataDir = "../swmm/data";
    public static final String RAIN_DATA_FILE = "RAIN_DATA_FILE";
    private String swmmHome = "D:\\open-source\\swmm\\SwmmConvert.exe";
    private String inputTemplates = "D:\\open-source\\swmm\\Shahu.inp";

    public String saveRainData(String filename, String data) throws DataFormatException, IOException {
        try {
            File file = new File(rainDataDir, getFileName(filename));
            FileUtils.writeStringToFile(file, data);
            return file.getAbsolutePath();
        } catch (IOException e) {
            logger.error("save rain data fail ", e);
            throw e;
        }
    }

    protected String getFileName(String filename) {
        File file = new File(filename);
        return file.getName();
    }

    public void setRainDataDir(String rainDataDir) {
        this.rainDataDir = rainDataDir;
    }

    public List<String[]> loadRainData(String filename) throws IOException {
        List<String[]> data = Lists.newArrayList();
        List<String> list = FileUtils.readLines(new File(rainDataDir, getFileName(filename)));

        for (int i = 3; i < list.size(); i++) {
            String[] fields = list.get(i).split(",");
            if (fields.length == 4)
                data.add(fields);
            else
                logger.warn("ignore error line '{}'", list.get(i));
        }
        logger.info("load rain data {} count {}", filename, data.size());
        return data;
    }

    /**
     * 初始化swmm配置
     *
     * @param job
     */
    public void config(Job job) {
        try {
            File parent = new File("../jobs/" + job.getId() + "/swmm/");
            FileUtils.forceMkdir(parent);
            File rainDataFile = new File(rainDataDir, job.getRainDataFile());
            Assert.isTrue(rainDataFile.exists(), "file not exist  " + rainDataFile.getAbsolutePath());

            List<RainData> dataList = readRainData(FileUtils.readLines(rainDataFile));

            parseRainData(dataList, job);

            for (String inputTemplate : inputTemplates.split(",")) {

                File inputFile = makeInputFile(job, parent, inputTemplate);
                String inputFileName = IoHelper.getFileNameWithoutExt(inputFile);
                String outPath = new File(parent, inputFileName + ".out").getPath();
                job.addProperty(OUT_PATH, outPath);
                job.addProperty("EXE", swmmHome + " " + inputFile.getPath() + " " +
                        new File(parent, inputFileName + ".rpn").getPath() + " " + outPath);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    private File makeInputFile(Job job, File parent, String inputTemplate) throws IOException {
        File templateFile = new File(inputTemplate);
        String content = FileUtils.readFileToString(templateFile);
        Map<String, String> properties = job.getProperties();
        for (String key : properties.keySet()) {
            content = content.replaceAll("\\{\\$" + key + "\\}", properties.get(key));
        }
        String templateFileName = templateFile.getName();
        File inputFile = new File(parent, templateFileName);
        FileUtils.writeStringToFile(inputFile, content);
        return inputFile;
    }

    protected void parseRainData(List<RainData> dataList, Job job) {

        String wetStart = "";
        String wetEnd = "";
        String serials = "";
        List<String> dryDates = getAllDate(dataList);
        for (RainData rainData : dataList) {
            if (NumberUtils.toDouble(rainData.getValue()) > 0) {
                if (dryDates.contains(rainData.getDate()))
                    dryDates.remove(rainData.getDate());
                if (StringUtils.isBlank(wetStart)) {
                    wetStart = rainData.getDate();
                }
                wetEnd = rainData.getDate();
            }
            serials += String.format("%-17s%-11s%-11s%-10s\n", rainData.getName(),
                    rainData.getDate(), rainData.getTime(), rainData.getValue());
        }
        job.addProperty("DRY_DAYS", dryDates.size());
        job.addProperty("SWEEP_START", wetStart);
        job.addProperty("SWEEP_END", wetEnd);

        job.addProperty("TIMESERIES", dataList.get(0).getName());
        job.addProperty("ALLTIMESERIES", serials);
        job.addProperty("START_DATE", dataList.get(0).getDate());
        job.addProperty("END_DATE", dataList.get(dataList.size() - 1).getDate());
        job.addProperty("START_TIME", dataList.get(0).getTime());
        job.addProperty("END_TIME", dataList.get(dataList.size() - 1).getTime());
        //todo:
        job.addProperty("REPORT_START_DATE", job.getProperty("START_DATE"));
        job.addProperty("REPORT_START_TIME", job.getProperty("START_TIME"));
        job.addProperty("REPORT_STEP", "1:00:00");
    }

    private List<String> getAllDate(List<RainData> dataList) {
        List<String> allDate = Lists.newArrayList();
        for (RainData rainData : dataList) {
            String date = rainData.getDate();
            if (!allDate.contains(date)) {
                allDate.add(date);
            }
        }
        return allDate;
    }

    protected List<RainData> readRainData(List<String> lines) {
        List<RainData> dataList = Lists.newArrayList();
        for (String line : lines) {
            if (StringUtils.isBlank(line) || StringUtils.startsWithAny(line, new String[]{"[", ";"}))
                continue;
            String[] fields = line.split(",");
            dataList.add(new RainData(fields[0], fields[1], fields[2], fields[3]));
        }
        return dataList;
    }

    @Override
    public void execute(Job job, final OutputStream outputStream) {

        try {
            //1.config init data
            config(job);
            //2.execute
            String command = job.getProperty("EXE");
            logger.info("start command= {}", command);
            Process process = Runtime.getRuntime().exec(command);
            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream(), "gbk"));
            String line;
            //see StreamUtil
            while ((line = br.readLine()) != null) {

                outputStream.write(line.getBytes());
                outputStream.write('\n');
                if (line.contains("SWMM completed")) {
                    process.destroy();
                }
            }


        } catch (Exception e) {
            logger.error("", e);
        }
    }

    public void execute(Job job) {

        try {
            //1.config init data
            config(job);
            //2.execute
            String command = job.getProperty("EXE");
            logger.info("start command= {}", command);
            Process process = Runtime.getRuntime().exec(command);
            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream(), "gbk"));

            String line;
            //see StreamUtil
            while ((line = br.readLine()) != null) {
                logger.debug("{}", line);
                if (line.contains("SWMM completed")) {
                    process.destroy();
                }
            }


        } catch (Exception e) {
            logger.error("", e);
        }
    }

    public SWMMResult readResult(Job job) throws IOException {
        SWMMResult result = new SWMMResult();

        return result;
    }

    public void setSwmmHome(String swmmHome) {
        this.swmmHome = swmmHome;
    }


    public List<Double> readTimeResult(String jobId, String varName, int time) {
        Swmm5Result result = new Swmm5Result();
        List<Double> values = Lists.newArrayList();
        try {
            result.openSwmmOutFile(getOutPutFile(jobId));
            for (int i = 0; i < result.getNnodes(); i++) {
                double v = result.getSwmmResult(Swmm5Result.ITEM_NODE, i, getVarIndex(), time);
                values.add(v);
            }
        } catch (IOException e) {
            logger.error("", e);
        } finally {
            result.close();
        }
        return values;
    }

    /**
     * 读取指定节点变量 varNmae 的所有时刻数据
     * @param jobId
     * @param varName
     * @param nodeIndex
     * @return
     */
    public List<Double> readNodeResult(String jobId, String varName, int nodeIndex) {
        Swmm5Result result = new Swmm5Result();
        List<Double> values = Lists.newArrayList();
        try {
            result.openSwmmOutFile(getOutPutFile(jobId));
            for (int period = 1; period <= result.getNperiods(); period++) {
                double v = result.getSwmmResult(Swmm5Result.ITEM_NODE, nodeIndex, getVarIndex(), period);
                values.add(v);
            }
        } catch (IOException e) {
            logger.error("", e);
        } finally {
            result.close();
        }
        return values;
    }

    private int getVarIndex() {
        return 6;
    }

    private String getOutPutFile(String jobId) {
        return "D:\\open-source\\swmm\\SWMM_DAT02527.out";
    }
}
