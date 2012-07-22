package edu.whu.models;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
* @author Hill.Hu
*/
@SuppressWarnings("unchecked")
public class SWMMResult
{
    public int colume;

    /// <summary>
    /// 结束的小时（相对年初）
    /// </summary>
    public int endTime;

    private List<String> nodeNames;
    public int nodesCount;
    private String[] paramsList;

    /// <summary>
    /// 结果，封装的是[节点][时间][参数]这样一个三层数组，希望没有让你紧张
    /// </summary>
    public List[] results;

    /// <summary>
    /// 开始的小时（相对年初）
    /// </summary>
    public int startTime = -1;

    /// <summary>
    /// 发生在那一年
    /// </summary>
//        public DateTime startYear;

    //参数列表

    public void read(String file) throws IOException {
        List<String> lines = FileUtils.readLines(new File(file), "gb2312");
        nodesCount = computeNodeCount(lines);
        nodeNames = new ArrayList(nodesCount);
        paramsList= readParamsList(lines.get(2));
        int recoder = (int) (lines.size()*1.0/nodesCount);
        results = new ArrayList[nodesCount];
        for (int i = 0; i < nodesCount; i++)
        {
            ArrayList node = new ArrayList(recoder);
            results[i] = node;
        }
        for (int i = 0; i < lines.size(); i++)
        {
            if (isStartRecord(lines.get(i)))
            {
                if (startTime == -1)

                    startTime = toHour(lines.get(i));

                //跳到数据那一行
                i += 2;
                for (int j = 0; j < nodesCount; j++)
                {
                    if (i >= lines.size())
                        break;
                    String s = lines.get(i);

                    if (isNotRecord(s))
                        break;

                    results[j].add(readLine(s));
                    i++;
                }
            }
        }
        endTime = startTime + results[0].size();
        for (int i = 0; i < nodesCount; i++)
        {
            nodeNames.add(((String[]) ((results[i]).get(0)))[0].trim());
        }
    }

    public int toHour(String line)
    {
        line = line.replace("<", "");
        line = line.replace(">", "");
        //todo:
//            DateTime dt = DateTime.Parse(line);
//            if (startTime == -1)
//                startYear = new DateTime(dt.Year, 1, 1);
//            TimeSpan be = dt - startYear;
//            return (int) be.TotalHours;
        return 0;
    }

    private String[] readParamsList(String line)
    {
        String[] _paramsList =line.replaceAll("\\s+", "\t").split("\t");

        return (String[]) ArrayUtils.subarray(_paramsList, 2,_paramsList.length);
    }

    /// <summary>
    /// 判断该行是不是一条合法的纪录
    /// </summary>
    /// <param name="line"></param>
    /// <returns></returns>
    private boolean isNotRecord(String line)
    {
        //这个4是随便取的
        return line.length() < 4;
    }

    private boolean isStartRecord(String line)
    {
        return line.contains("<<<");
    }

    public int computeNodeCount(List<String> lines)
    {
        boolean startCount = false;
        int endPix = 0;
        for (String line : lines)
        {
            if (isStartRecord(line))
            {
                startCount = true;
                continue;
            }
            if (startCount)
            {
                if (StringUtils.isNotEmpty(line))
                    endPix++;
                else
                {
                    break;
                }
            }
        }
        //要减去节点名那一行
        return endPix - 1;
    }

    private String[] readLine(String line)
    {
        String[] ss = line.split(":|\\t");

        return ss;
    }

    public String[]  getNodeNames() {
        String[] _array=new String[nodeNames.size()] ;
        return nodeNames.toArray(_array);
    }

    public String[] getParamsList() {
        return paramsList;
    }
    //
//        /// <summary>
//        /// 如果没有找到则返回-1
//        /// </summary>
//        /// <param name="nodeName"></param>
//        /// <returns></returns>
//        public int getNodeIndex(String nodeName)
//        {
//            int index = nodeNames.IndexOf(nodeName);
//            return index;
//        }
//
//        public double getNodeFlowAtTime(int index, int hour)
//        {
//            if (hour > endTime || index >= nodesCount)
//                return -1;
//            return Convert.ToDouble(((String[]) results[index][hour - startTime])[1]);
//        }


}
