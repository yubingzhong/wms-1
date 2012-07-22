package edu.whu.action;

import com.google.common.base.Joiner;
import edu.umn.gis.mapscript.OWSRequest;
import edu.whu.models.ModelRender;
import edu.whu.models.ecom.AngelReader;
import edu.whu.models.ecom.EcomRender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.Map;

/**
 * User: hushan
 * Date: 11-10-25
 * Time: 下午10:44
 */
@SuppressWarnings("unchecked")
@Controller
public class EcomRenderAction {
    private static Logger logger = LoggerFactory.getLogger(AngelReader.class);
    private static ModelRender modelRender = new EcomRender();

    @RequestMapping("/ecom.do")
    public void list(HttpServletRequest request, HttpServletResponse response) throws IOException {

        logger.info("receive a ecom request {}", request.getQueryString());
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

        byte[] data = modelRender.render(req);

        response.setContentType("image/png");


        response.getOutputStream().write(data);


    }
}
