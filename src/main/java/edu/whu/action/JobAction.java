package edu.whu.action;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

/**
 * User: hill.hu
 * 任务控制
 */
@Controller
public class JobAction {


    @RequestMapping("/job/list")
    public String list(ModelMap map, String name) throws IOException {

        map.put("name", name);
        return "job/list";

    }

    @RequestMapping("/job/new")
    public String create(ModelMap map, String name) throws IOException {

        map.put("name", name);
        return "job/swmmConfig";

    }

    @RequestMapping("/job/new/ecom")
    public String configEcom(ModelMap map, String name) throws IOException {

        map.put("name", name);
        return "job/ecomConfig";

    }


    @RequestMapping("/job/new/rca")
    public String configRca(ModelMap map, String name) throws IOException {

        map.put("name", name);
        return "job/rcaConfig";

    }

    @RequestMapping("/job/new/commit")
    public String commit(ModelMap map, String name) throws IOException {

        map.put("name", name);
        return "redirect:/job/1/play";

    }
}
