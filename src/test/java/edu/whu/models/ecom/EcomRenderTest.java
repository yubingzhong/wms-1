package edu.whu.models.ecom;

import edu.umn.gis.mapscript.imageObj;
import edu.umn.gis.mapscript.mapObj;
import edu.whu.service.EcomService;
import junit.framework.TestCase;

/**
 * User: hushan
 */
public class EcomRenderTest extends TestCase {
    EcomService render = new EcomService();
    mapObj map;



    public void test_render() throws Exception {

        map = new mapObj("D:\\open-source\\data\\qsh\\qsh2.map");
       // map = new mapObj("D:\\open-source\\data\\map\\dh84.map");
        map.setWidth(2000);
        map.setHeight(2000);
       // render.renderLayer(map.getLayer(0),"1");

        imageObj imageObj = map.draw();
        imageObj.save("E:\\test1.png",map);
    }

}
