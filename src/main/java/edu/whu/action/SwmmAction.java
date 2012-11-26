package edu.whu.action;

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
import java.util.List;
import java.util.zip.DataFormatException;

/**
 * User: hushan
 */
@SuppressWarnings("unchecked")
@Controller
public class SwmmAction {
    private static Logger logger = LoggerFactory.getLogger(SwmmAction.class);
    @Resource
    private SwmmService swmmService;

    @RequestMapping("/swmm/data/upload")
    public @ResponseBody  ModelMap upload(HttpServletRequest request, HttpServletResponse response,ModelMap mm) throws IOException {
        try {

            ServletFileUpload fileUpload=new ServletFileUpload(new DiskFileItemFactory());
            List<FileItem> list = fileUpload.parseRequest(request);

            logger.info("upload files {}  ", list);
            FileItem fileItem = list.get(0);
            swmmService.saveRainData(fileItem.getName(),new String(fileItem.get(),"utf-8"));

            List<String[]> data=swmmService.loadRainData(fileItem.getName());

            mm.addAttribute("data",data);

        }catch (DataFormatException e){
          mm.addAttribute("msg","文件格式错误");
        }catch (Exception e) {
            logger.error("upload swmm rain data fail ",e);
            mm.addAttribute("msg", "系统未知错误");
        }
        return mm;
    }

        public void setSwmmService(SwmmService swmmService) {
        this.swmmService = swmmService;
    }
}
