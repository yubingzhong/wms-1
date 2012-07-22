package edu.whu.models.ecom;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * User: hushan
 * Date: 11-7-31
 * Time: 下午10:38
 * To change this template use File | Settings | File Templates.
 */
public class AngelReader {
    private String angelFile = "D:\\open-source\\data\\donghu.txt";
    private Map<String, Double> utmGrid;

    private static Logger logger = LoggerFactory.getLogger(AngelReader.class);

    public AngelReader() {
//        try {
//            readAngel();
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
    }

    @PostConstruct
    public void readAngel() throws IOException {
        logger.debug("init utm grid");
        utmGrid = new HashMap<String, Double>(100);
        List<String> lines = FileUtils.readLines(new File(angelFile));
        for (String line : lines) {
            if (StringUtils.isEmpty(line))
                continue;

            String first = line.replaceAll("\\s+|\\t", " ").trim();

            String[] fields = StringUtils.splitByWholeSeparator(first, " ");

            if (fields.length != 3)
                continue;
            utmGrid.put(buildOffsetKey(fields[0], fields[1]), Double.parseDouble(fields[2]));
        }
    }

    private String buildOffsetKey(Object x, Object y) {
        return "i_" + x + "j_" + y;
    }

    public double getAngel(int x, int y) {
        double angel = 0;
        if (utmGrid.containsKey(buildOffsetKey(x, y)))
            angel = utmGrid.get(buildOffsetKey(x, y));
        return angel;
    }
    public void setAngelFile(String angelFile) {
        this.angelFile = angelFile;
    }
}
