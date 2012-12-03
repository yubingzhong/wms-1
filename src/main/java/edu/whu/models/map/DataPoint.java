package edu.whu.models.map;

import org.apache.commons.lang.math.NumberUtils;

/**
 * 可携带数据的点
 *
 * @author Hill.Hu
 */
public class DataPoint implements Comparable{
    private String id;
    private String name;
    private double lat;
    private double lng;
    private double value1;

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public double getValue1() {
        return value1;
    }

    public void setValue1(double value1) {
        this.value1 = value1;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "HeatMapData{" +
                "id='" + id + '\'' +
                ", lat=" + lat +
                ", lng=" + lng +
                ", value1=" + value1 +
                ",name=" + name +
                '}';
    }

    @Override
    public int compareTo(Object o) {
        return NumberUtils.toInt(id)-NumberUtils.toInt(((DataPoint)o).getId()) ;
    }
}
