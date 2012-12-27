package edu.whu.action;

import com.google.common.base.Joiner;
import edu.umn.gis.mapscript.*;
import edu.whu.service.MapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
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
    @Resource
    MapService mapService;
    @RequestMapping("/layer.do")
    public void layer(HttpServletRequest request, HttpServletResponse response) throws IOException {

        logger.debug("receive a layer request {}", request.getQueryString());
        OWSRequest req = new OWSRequest();

//        req.setParameter("SERVICE", "WMS");
//        req.setParameter("VERSION", "1.1.1");
//
//        req.setParameter("REQUEST", "GetMap");

        Map<String, Object> parasMap = request.getParameterMap();
        for (String key : parasMap.keySet()) {
            Object values = parasMap.get(key);
            if (values instanceof String[]) {
                req.setParameter(key, Joiner.on(",").join((String[]) values));
            } else {
                req.setParameter(key, values + "");
            }

        }


//        mapscript.msIO_installStdoutToBuffer();
//
//        int owsResult = map.OWSDispatch(req);
        byte[] bytes = mapService. drawLayer(req);


        response.setContentType("image/png");


        response.getOutputStream().write(bytes);


    }

    @RequestMapping("/layer/features.do")
    public void getFeatures(HttpServletRequest request, HttpServletResponse response) {
        OWSRequest req = new OWSRequest();

        req.setParameter("SERVICE", "WMS");
        req.setParameter("VERSION", "1.1.1");

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


//        mapscript.msIO_installStdoutToBuffer();
//
//        int owsResult = map.OWSDispatch(req);

    }

    }
