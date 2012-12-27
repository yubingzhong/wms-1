package edu.whu.service;

import edu.whu.models.Job;

import java.io.OutputStream;

/**
 * @author Hill.Hu
 */
public interface TaskService {
    /**
     * 执行一项任务
     * @param job
     */
    public void execute(Job job,OutputStream outputStream);
}
