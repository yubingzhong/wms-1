package edu.whu.action;

import edu.whu.models.Job;
import edu.whu.service.JobService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * User: hill.hu
 * 任务控制
 */
@Controller
public class JobAction {
     public static final AtomicInteger counter=new AtomicInteger();
    @Resource
    private JobService jobService;

    @RequestMapping("/job/list")
    public String list(ModelMap map ) throws IOException {
        List<Job> jobs = jobService.findAll();
        map.put("jobs",jobs);
        return "job/list";

    }

    @RequestMapping("/job/new")
    public String create(ModelMap map, String name) throws IOException {

        map.put("name", name);
        return "job/new";

    }
    @RequestMapping("/job/{jobId}/console")
    public String console(ModelMap map, @PathVariable String jobId) throws IOException {

        return "job/console";

    }
    @RequestMapping("/job/{jobId}")
    public @ResponseBody
    Job query(ModelMap map, @PathVariable String jobId) throws IOException {
        Job job=jobService.find(jobId);
        return job;

    }
    @RequestMapping("/job/submit")
    public String submit(ModelMap map, Job job) throws IOException {
        job.setId(String.valueOf(counter.getAndIncrement()));
        jobService.start(job);

        return   "redirect:/job/"+ job.getId()+"/play";

    }


}
