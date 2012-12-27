package edu.whu.action;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * User: hill.hu
 * Date: 11-10-25
 * 数据管理控制器
 */
@Controller()
public class DataAction {

    @RequestMapping("/data/index.do")
    public String index(ModelMap map, String name) throws IOException {

        map.put("name", name);
        return "index";

    }
}
