package edu.whu.models;

/**
 * @author Hill.Hu
 */
public class Layer {
    private   String name;
    private   String title;

    public Layer(String name, String title) {

        this.name = name;
        this.title = title;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
