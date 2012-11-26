package edu.whu.service;

import com.google.common.collect.Lists;
import edu.umn.gis.mapscript.*;
import edu.whu.action.BaseLayerAction;
import edu.whu.models.Layer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Hill.Hu
 */
@Service
public class MapService {
    @Value("${map.basicMapFile}")
    private String basicMapFile;
    private static Logger logger = LoggerFactory.getLogger(BaseLayerAction.class);

    public List<Layer> findBasicLayers(){
         List<Layer> layers= Lists.newArrayList();
        try {
            mapObj map = new mapObj(basicMapFile);

            for( int i=0;i<map.getNumlayers();i++) {
                Layer layer=new Layer(map.getLayer(i).getName(),map.getLayer(i).getMetaData("ows_title"));
                layers.add(layer);
            }
        } catch (Throwable e) {
            logger.error("load map fail ,map file={}",basicMapFile,e);
        }

        return layers;
    }
    public imageObj drawMap(OWSRequest req) {
        String mapFile = req.getValueByName("MAP");
        if(mapFile==null)
            mapFile=basicMapFile;
        mapObj map = new mapObj(mapFile);
        String width = req.getValueByName("WIDTH");
        String height = req.getValueByName("HEIGHT");
        map.setWidth(Integer.parseInt(width));
        map.setHeight(Integer.parseInt(height));
        String[] bbox = req.getValueByName("BBOX").split(",");
        map.setExtent(Double.parseDouble(bbox[0]), Double.parseDouble(bbox[1]), Double.parseDouble(bbox[2]), Double.parseDouble(bbox[3]));

        String layerName = req.getValueByName("LAYERS");
        layerObj layerObj = map.getLayerByName(layerName);
        if (layerObj != null) {
            layerObj.setStatus(mapscript.MS_ON);

        } else {
            logger.warn("can't find layer by layer name={}", layerName);
        }
        imageObj imageObj = map.draw();
        return imageObj;
    }
    public void setBasicMapFile(String basicMapFile) {
        this.basicMapFile = basicMapFile;
    }
}
