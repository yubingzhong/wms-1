package edu.whu.models;

/**
 * User: hushan
 * Date: 11-8-1
 * Time: 下午9:11
 * 模型计算使用的网格
 * 行列对应i，j
 */
public class Grid {
    private int column, row;

    public Grid() {
    }

    public Grid(int column, int row) {
        this.column = column;
        this.row = row;
    }

    public int getColumn() {
        return column;
    }

    public void setColumn(int column) {
        this.column = column;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }
}
