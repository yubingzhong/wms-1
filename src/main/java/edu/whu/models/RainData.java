package edu.whu.models;

/**
 * @author Hill.Hu
 */
public class RainData {
    private String name;
    private String date;
    private String time;
    private String value;

    public RainData(String name, String date, String time, String value) {
        this.name = name;
        this.date = date;
        this.time = time;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
