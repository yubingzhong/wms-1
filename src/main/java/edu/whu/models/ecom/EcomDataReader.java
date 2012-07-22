package edu.whu.models.ecom;

import edu.whu.models.Current;

import java.io.IOException;

/**
 * User: hushan
 * Date: 11-7-20
 * Time: 下午8:45
 */
public interface EcomDataReader {
   public Current read(int time, int layer, int x, int y) throws IOException;
}
