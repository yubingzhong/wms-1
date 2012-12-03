var map;
var displayControl;
/**
 * wms 方式图层
 * @param layerName
 * @return {*}
 */
function createWMSLayer(layerName) {
    return  new google.maps.ImageMapType({
        getTileUrl:function (coord, zoom) {
            var proj = map.getProjection();
            var zfactor = Math.pow(2, zoom);
            var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
            var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));
            var url = "/wms/layer.do?LAYERS="+layerName+"&WIDTH=256&HEIGHT=256&BBOX=" + top.lng().toFixed(8) + "," + bot.lat().toFixed(8) + "," + bot.lng().toFixed(8) + "," + top.lat().toFixed(8) + "";
            return url;
        },

        tileSize:new google.maps.Size(256, 256),
        isPng:true
    });
}
/**
 * gmap tile 方式图层
 * @param layerName
 * @return {*}
 */
function createTileLayer(layerName) {

    return  new google.maps.ImageMapType({
        getTileUrl:function (coord, zoom) {
            var urlTemplate = 'http://localhost/cgi-bin/mapserv.exe?';
            urlTemplate += 'map=D:/open-source/data/qsh/qsh.map&';
            urlTemplate += 'layers='+layerName ;
            urlTemplate += '&mode=tile&';
            urlTemplate += 'tilemode=gmap&';
            urlTemplate += 'tile='+coord.x+'+'+coord.y+'+'+zoom;
            return urlTemplate;
        },

        tileSize:new google.maps.Size(256, 256),
        isPng:true
    });
}
/**
 * gmap tile 方式图层
 * @param layerName
 * @return {*}
 */
function createPointLayer(layerName) {

    return  new google.maps.OverlayView({

        getTileUrl:function (coord, zoom) {
            var urlTemplate = 'http://localhost/cgi-bin/mapserv.exe?';
            urlTemplate += 'map=D:/open-source/data/qsh/qsh.map&';
            urlTemplate += 'layers='+layerName ;
            urlTemplate += '&mode=tile&';
            urlTemplate += 'tilemode=gmap&';
            urlTemplate += 'tile='+coord.x+'+'+coord.y+'+'+zoom;
            return urlTemplate;
        },

        onAdd :function(){},
        isPng:true
    });
}
function initializeMap() {
    var myOptions = {
        zoom:13,
        scaleControl: false,
        streetViewControl: false,
        panControl: false,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        center:new google.maps.LatLng(25.614286, 103.111393),
        mapTypeId:google.maps.MapTypeId.HYBRID
    };

    map = new google.maps.Map(document.getElementById('map_canvas'),
        myOptions);


//    var displayCtrlDiv = document.createElement('DIV');
//    displayCtrlDiv.id="displayCtrlDiv";
//      displayControl = new DisplayControl(displayCtrlDiv, map);
//
//    displayControl.index = 1;
//    displayCtrlDiv.appendChild(document.getElementById("play_control"));
//    map.controls[google.maps.ControlPosition.TOP_CENTER].push(displayCtrlDiv);
//    google.maps.event.addListener(displayControl, 'timer_changed', function() {
//        var timer=this.get("timer");
//        jQuery("#play_info_bord").html(timer);
//        jQuery("#play_time_pointer").css("left", displayControl.get("timer")*100/displayControl.get("total")+"%");
//        var layers = map.overlayMapTypes;
//        for(var i=0;i<layers.b.length;i++){
//            if(layers.b[i].play!=undefined){
//                layers.b[i].play(timer);
//            }
//        }
//    });
//
//}
//
//DisplayControl.prototype=new google.maps.MVCObject();
//DisplayControl.prototype.startPlay=function(){
//    var cur = displayControl.get("timer") ;
//    displayControl.set("timer",cur+1);
//
//    if(displayControl.get("timer")>=displayControl.get("total")){
//        window.clearInterval(displayControl.get("timeTick")) ;
//    }
//};


}
function DisplayControl(controlDiv, map) {
    var me = this;

    controlDiv.style.padding = '5px';
    this.set("timer",0);
    this.set("position",map.getCenter());
    this.set("total",100);

    var startBtn = document.getElementById('play_start_btn');

    google.maps.event.addDomListener(startBtn, 'click', function () {
        if (startBtn.title  == "play") {
            startBtn.title  = "stop";
            me.set("timeTick",setInterval("displayControl.startPlay()",1000));

        } else {
            startBtn.title  = "play";
            window.clearInterval(me.get("timeTick")) ;
        }
    });

    var bar = document.getElementById('play_bar');

    google.maps.event.addDomListener(bar, 'click', function (e) {
        //*me.get("total")/bar.style.width
        var width=jQuery("#play_bar").css("width").replace("px","");
        me.set("timer", e.offsetX*me.get("total")/new Number(width));
    });



}





