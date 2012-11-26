package edu.whu.service;

import edu.umn.gis.mapscript.OWSRequest;
import edu.whu.models.Layer;
import junit.framework.TestCase;
import org.springframework.util.ResourceUtils;

import java.util.List;

/**
 * @author Hill.Hu
 */
public class MapServiceTest extends TestCase {
    MapService mapService=new MapService();


    @Override
    public void setUp() throws Exception {
        mapService.setBasicMapFile(ResourceUtils.getFile("classpath:map/dh84.map").getPath());
    }

    public void test_draw() throws Exception {
        OWSRequest req=new OWSRequest();
        req.setPostrequest("LAYERS=big_water_area&WIDTH=256&HEIGHT=256&BBOX=103.007813,25.562265,103.051758,25.601902");

        mapService.drawMap(req)        ;
    }

    public void test_find_layers() throws Exception {
        List<Layer> layers = mapService.findBasicLayers();
        assertEquals("大型水域",layers.get(0).getName());
    }
}
