package edu.whu.action;

import com.google.common.base.Joiner;
import edu.umn.gis.mapscript.OWSRequest;
import edu.umn.gis.mapscript.imageObj;
import edu.umn.gis.mapscript.mapObj;
import edu.whu.models.ModelRender;
import edu.whu.models.ecom.AngelReader;
import edu.whu.models.ecom.EcomRender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

/**
 * @author hill.hu
 */
@SuppressWarnings("unchecked")
@Controller
public class BaseLayerAction {
    private static Logger logger = LoggerFactory.getLogger(BaseLayerAction.class);

    @RequestMapping("/layer.do")
    public void layer(HttpServletRequest request, HttpServletResponse response) throws IOException {

        logger.debug("receive a ecom request {}", request.getQueryString());
        OWSRequest req = new OWSRequest();

        req.setParameter("SERVICE", "WMS");
        req.setParameter("VERSION", "1.1.1");

        req.setParameter("LAYERS", "donghu");
        req.setParameter("REQUEST", "GetMap");

        Map<String, Object> parasMap = request.getParameterMap();
        for (String key : parasMap.keySet()) {
            Object values = parasMap.get(key);
            if (values instanceof String[]) {
                req.setParameter(key, Joiner.on(",").join((String[]) values));
            } else {
                req.setParameter(key, values + "");
            }

        }

        String mapFile = req.getValueByName("MAP");

        mapObj map = new mapObj(mapFile);

        String width=req.getValueByName("WIDTH");
        String height=req.getValueByName("HEIGHT");
        map.setWidth(Integer.parseInt(width));
        map.setHeight(Integer.parseInt(height));
        String[] bbox=req.getValueByName("BBOX").split(",");

//        mapscript.msIO_installStdoutToBuffer();
//
//        int owsResult = map.OWSDispatch(req);

        map.setExtent(Double.parseDouble(bbox[0]),Double.parseDouble(bbox[1]),Double.parseDouble(bbox[2]),Double.parseDouble(bbox[3]));

        imageObj imageObj = map.draw();
        response.setContentType("image/png");


        response.getOutputStream().write(imageObj.getBytes());


    }
}
