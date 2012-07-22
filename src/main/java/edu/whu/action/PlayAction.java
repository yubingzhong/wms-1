package edu.whu.action;

import edu.whu.models.User;
import edu.whu.service.UserManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import java.util.List;

/**
 * author: Hill.Hu
 */
@Controller
public class PlayAction {
    private static Logger logger = LoggerFactory.getLogger(UserAction.class);

    @RequestMapping(value = "/job/{jobId}/play", method = RequestMethod.GET)
    public String show(ModelMap map,@PathVariable String jobId) {

        return "job/play";
    }

}
