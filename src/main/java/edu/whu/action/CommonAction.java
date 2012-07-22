package edu.whu.action;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

/**
 * User: hill.hu
 * Date: 11-10-25
 * 浏览控制器
 */
@Controller
public class CommonAction {


    @RequestMapping(value = {"/index","/"})
    public String index(ModelMap map, String name) throws IOException {

        map.put("name", name);
        return "index";

    }
}
