package edu.whu.models;

import java.util.List;

/**
 * @author Hill.Hu
 */
public class Job {
    List<Task>  tasks;

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
