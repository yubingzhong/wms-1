package edu.whu.models.ecom;

import edu.umn.gis.mapscript.imageObj;
import edu.umn.gis.mapscript.mapObj;
import junit.framework.TestCase;

/**
 * User: hushan
 */
public class EcomRenderTest extends TestCase {
    EcomRender render = new EcomRender();
    mapObj map;



    public void test_render() throws Exception {

        map = new mapObj("D:\\open-source\\data\\map\\dh1.map");
        map.setWidth(2000);
        map.setHeight(2000);
        render.renderLayer(map.getLayer(0),"1");

        imageObj imageObj = map.draw();
        imageObj.save("E:\\test1.png",map);
    }

}