package edu.whu.action;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

/**
 * User: hill.hu
 * Date: 11-10-25
 * 系统管理员的权限
 */
@Controller
public class AdminAction {

    /**
     * 显示所有用户
     * @param map
     * @param name
     * @return
     * @throws IOException
     */
    @RequestMapping("/admin/list.do")
    public String list(ModelMap map, String name) throws IOException {

        map.put("name", name);
        return "index";

    }

    /**
     * 删除用户
     * @param map
     * @param name
     * @return
     * @throws IOException
     */
    @RequestMapping("/admin/destroy.do")
    public String destroy(ModelMap map, String name) throws IOException {

        map.put("name", name);
        return "index";

    }
}
