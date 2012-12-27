package edu.whu.models;

/**
 * User: hushan
 * 向量，包括方向和大小
 */
public class Current {
    private double horizontalStrength;
    private double verticalStrength;
    private double angle;

    public Current() {
    }

    public Current(double horizontalStrength, double verticalStrength, double angle) {
        this.horizontalStrength = horizontalStrength;
        this.verticalStrength = verticalStrength;
        this.angle = angle;
    }

    public Current(double horizontalStrength, double verticalStrength) {
        this.horizontalStrength = horizontalStrength;
        this.verticalStrength = verticalStrength;
    }

    public double getHorizontalStrength() {
        return horizontalStrength;
    }

    public void setHorizontalStrength(double horizontalStrength) {
        this.horizontalStrength = horizontalStrength;
    }

    public double getVerticalStrength() {
        return verticalStrength;
    }

    public void setVerticalStrength(double verticalStrength) {
        this.verticalStrength = verticalStrength;
    }

    public double getAngle() {
        return angle;
    }

    public double getCurrentAngle() {

        double v = Math.toDegrees(Math.atan2(verticalStrength, horizontalStrength));
        return v + angle;
    }

    public void setAngle(double angle) {
        this.angle = angle;
    }

    public double getStrength() {
        return Math.sqrt(horizontalStrength * horizontalStrength + verticalStrength * verticalStrength);
    }

    public boolean hasValue() {
        return horizontalStrength * horizontalStrength + verticalStrength * verticalStrength > 0;
    }
}
