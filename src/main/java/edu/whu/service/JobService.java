package edu.whu.service;

import com.google.common.collect.Lists;
import com.google.common.collect.MapMaker;
import edu.whu.models.Job;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author Hill.Hu
 */
@Service
public class JobService {
    ConcurrentMap<String, Job> map = new MapMaker().makeMap();
    @Resource
    SwmmService taskService;
    ExecutorService executor = Executors.newSingleThreadExecutor();

    public void start(final Job job) {
        map.putIfAbsent(job.getId(), job);

        executor.execute(new Runnable() {
            @Override
            public void run() {
                taskService.execute(job);
                job.setStatus("SUCCESS");
            }
        });
    }

    public Job find(String jobId) {
        return map.get(jobId);
    }
    public List<Job> findAll() {
        return Lists.newArrayList(map.values());
    }
}
