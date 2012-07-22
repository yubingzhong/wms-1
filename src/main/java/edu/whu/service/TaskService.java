package edu.whu.service;

import edu.whu.models.Task;

import java.io.OutputStream;
import java.util.List;

/**
 * @author Hill.Hu
 */
public interface TaskService {
    /**
     * 执行一项任务
     * @param task
     */
    public void execute(Task task,OutputStream outputStream);
}
