package edu.whu.models;

import java.awt.*;

/**
 * Created by IntelliJ IDEA.
 * User: hushan
 * Date: 11-7-23
 * Time: 下午10:48
 */
public class ClassTemplate implements Comparable{
    private double value;
    private int size;
    private Color color;

    public ClassTemplate(double value, int size, Color color) {
        this.value = value;
        this.size = size;
        this.color = color;
    }

    public ClassTemplate(double value, int size) {
        this.value=value;

        this.size = size;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int compareTo(Object o) {

        return Double.compare(value, (Double) o);
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }
}
