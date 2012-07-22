package edu.whu.models;

import edu.umn.gis.mapscript.OWSRequest;
import edu.umn.gis.mapscript.imageObj;
import edu.umn.gis.mapscript.layerObj;
import edu.umn.gis.mapscript.mapObj;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * User: hushan
 */
public abstract class ModelRender {

   	private static Logger logger = LoggerFactory.getLogger(ModelRender.class);
    public abstract void renderLayer(layerObj layer,String time);

    public byte[] render(OWSRequest owsRequest) {
        String mapFile = owsRequest.getValueByName("MAP");
        logger.info("load map file = "+mapFile);
        mapObj map = new mapObj(mapFile);
        String time = owsRequest.getValueByName("time");
        String width=owsRequest.getValueByName("WIDTH");
        String height=owsRequest.getValueByName("HEIGHT");
        map.setWidth(Integer.parseInt(width));
        map.setHeight(Integer.parseInt(height));
        String[] bbox=owsRequest.getValueByName("BBOX").split(",");

//        mapscript.msIO_installStdoutToBuffer();
//
//        int owsResult = map.OWSDispatch(owsRequest);

        map.setExtent(Double.parseDouble(bbox[0]),Double.parseDouble(bbox[1]),Double.parseDouble(bbox[2]),Double.parseDouble(bbox[3]));
        renderLayer(map.getLayer(0 ),time);
        imageObj imageObj = map.draw();

//
//        byte[] bytes = mapscript.msIO_getStdoutBufferBytes();
//        mapscript.msIO_resetHandlers();
        logger.debug("render success");
        return imageObj.getBytes();
    }
}
