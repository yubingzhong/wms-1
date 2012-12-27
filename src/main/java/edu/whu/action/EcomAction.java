package edu.whu.action;

import com.google.common.base.Joiner;
import edu.umn.gis.mapscript.OWSRequest;
import edu.whu.models.map.DataPoint;
import edu.whu.service.EcomService;
import edu.whu.service.MapService;
import edu.whu.service.SwmmService;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.zip.DataFormatException;

/**
 * User: hushan
 */
@SuppressWarnings("unchecked")
@Controller
public class EcomAction {
    private static Logger logger = LoggerFactory.getLogger(EcomAction.class);
    @Resource
    private EcomService ecomService;
    @Resource
    MapService mapService;

    @RequestMapping("/ecom/renderTime")
    public void renderTime(HttpServletRequest request, HttpServletResponse response) throws IOException {
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
        byte[] bytes = ecomService. render(req);


        response.setContentType("image/png");


        response.getOutputStream().write(bytes);
    }



}
