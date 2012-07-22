package edu.whu.models;

import com.google.common.collect.Maps;

import java.util.Date;
import java.util.Map;

/**
 * author: Hill.Hu
 */
public class Task {
    private String id;
    private String title;
    private Date startTime;
    private Date endTime;
    private String createUsername;
    private String status;
    private Map<String,String> properties= Maps.newHashMap();
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getCreateUsername() {
        return createUsername;
    }

    public void setCreateUsername(String createUsername) {
        this.createUsername = createUsername;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void addProperty(String key, Object value) {
          properties.put(key,value.toString());
    }

    public Map<String, String> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, String> properties) {
        this.properties = properties;
    }

    public String getProperty(String key) {
        return this.getProperties().get(key);
    }
}
