package edu.whu.action;

import edu.whu.service.JobService;
import edu.whu.service.MapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;

/**
 * author: Hill.Hu
 */
@Controller
public class PlayAction {
    private static Logger logger = LoggerFactory.getLogger(UserAction.class);
    @Resource
    private JobService jobService;

    @Resource
    MapService mapService;
    @Value("${map.baseMapUrl}")
    private String baseMapUrl;

    @RequestMapping(value = "/job/{jobId}/play", method = RequestMethod.GET)
    public String show(ModelMap map,@PathVariable String jobId) {
       map.put("job", jobService.find(jobId)) ;
        map.put("basicLayers",mapService.findBasicLayers());
        map.put("baseMapUrl",baseMapUrl);
        return "job/play";
    }

}
