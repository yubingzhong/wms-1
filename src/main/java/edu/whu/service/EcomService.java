package edu.whu.service;

import edu.umn.gis.mapscript.*;
import edu.whu.models.*;

import edu.whu.models.ecom.*;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import javax.annotation.Resource;
import java.awt.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author  hushan
 */
@Service
public class EcomService   {
    private static Logger logger = LoggerFactory.getLogger(EcomService.class);

    private List<ClassTemplate> classList;
    private AtomicInteger timeCount = new AtomicInteger(0);
     @Resource
    private AngelReader angelReader;
    @Resource
    private   MapService mapService;
    public EcomService() {
        classList = new ArrayList<ClassTemplate>();
        classList.add(new ClassTemplate(0.02, 3, Color.BLUE));
        classList.add(new ClassTemplate(0.04,6, Color.green));
        classList.add(new ClassTemplate(0.06, 9,Color.yellow));
        classList.add(new ClassTemplate(0.08, 10,Color.RED));

    }

    public void renderLayer(layerObj layer, String time) {
        EcomDataReader ecomDataReader=null;

        try {
            Text2NetCdfConvector convector=new Text2NetCdfConvector();
            String ecomNcFile = ResourceUtils.getFile("classpath:ecom").getPath() + "/ecom.nc";
            if(!new File(ecomNcFile).exists()){
                logger.info("转换ecom结果文件为netcdf格式");
                convector.convert("E:\\wms\\src\\test\\resources\\ecom\\gcmdm",ecomNcFile);

            }
            ecomDataReader = new EcomNetCdfReader(ecomNcFile);
        } catch (IOException e) {
            e.printStackTrace();
        }

        layer.open();
        layer.setOpacity(50);
        mapObj map = layer.getMap();
        layerObj temp = new layerObj(map);

        temp.setName("overlay layer");
        temp.setStatus(0);
        temp.setType(MS_LAYER_TYPE.MS_LAYER_POINT);
        timeCount.compareAndSet(38, 0);
        int _time = timeCount.incrementAndGet();
        logger.info("rend ecom layer time=" + _time);

        int query = layer.whichShapes(map.getExtent());
        shapeObj shp;
        int count = 0;
        if (query == 0)
            while ((shp = layer.nextShape()) != null) {


                String ijString = shp.getValue(0);
                Grid grid = ModelUtils.getGrid(ijString);

                try {
                    Current current = ecomDataReader.read(_time, 1, grid.getColumn() - 1, grid.getRow() - 1);
                    if (current.hasValue()) {
                        shapeObj feature = new shapeObj(mapscriptConstants.MS_SHAPEFILE_POINT);
                        lineObj line = new lineObj();

                        line.add(shp.getCentroid());

                        feature.add(line);

                        createClass(map, temp, current);
                        feature.setClassindex(count);
                        int result = temp.addFeature(feature);
                        count++;
                    }
                    current.setAngle(angelReader.getAngel(grid.getColumn(), grid.getRow()));

                } catch (Exception e) {
                    logger.error("", e);
                }

            }

        layer.close();

    }

    private void createClass(mapObj map, layerObj temp, Current current) {
        classObj newclass = new classObj(temp);

        styleObj style = new styleObj(newclass);
        style.setSymbolByName(map, "arrow");
        ClassTemplate classTemplate = getTemplate(current.getStrength());
        style.setSize(classTemplate.getSize());

        Color color = classTemplate.getColor();
        style.setColor(new colorObj(color.getRed(), color.getGreen(), color.getBlue(), 1));
        style.setAngle(current.getCurrentAngle());
    }

    private ClassTemplate getTemplate(double strength) {
        ClassTemplate classTemplate = null;
        for (ClassTemplate template : classList) {
            if (strength <= template.getValue()) {
                classTemplate = template;
            } else {
                break;
            }
        }
        if (classTemplate == null)
            return classList.get(classList.size() - 1);
        return classTemplate;
    }


    public byte[] render(OWSRequest request) {
        mapObj map=mapService.getMap(request);
        layerObj layer = mapService.getLayer(request, map);

        renderLayer(layer,request.getValueByName("timeIndex"));
       imageObj imageObj = map.draw();
        return imageObj.getBytes();
    }
}
