var map;
var displayControl;
function initialize() {
    var myOptions = {
        zoom:10,
        scaleControl: false,
        streetViewControl: false,
        panControl: false,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        center:new google.maps.LatLng(30.297018, 114.785156),
        mapTypeId:google.maps.MapTypeId.HYBRID
    };
    var myLayer = new google.maps.ImageMapType({
        getTileUrl:function (coord, zoom) {
            var proj = map.getProjection();
            var zfactor = Math.pow(2, zoom);
            var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
            var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));
            var url = "/wms/layer.do?MAP=D:\\open-source\\data\\map\\dh84.map&LYAERS=donghu&WIDTH=256&HEIGHT=256&BBOX=" + top.lng().toFixed(6) + "," + bot.lat().toFixed(6) + "," + bot.lng().toFixed(6) + "," + top.lat().toFixed(6) + "";
            return url;
        },

        tileSize:new google.maps.Size(256, 256),
        isPng:true,
        opacity:0.8
    });
    myLayer.play=function(time){

    };
    map = new google.maps.Map(document.getElementById('map_canvas'),
        myOptions);

    map.overlayMapTypes.insertAt(0, myLayer);

    var options = {
        map:map,
        position:new google.maps.LatLng(30.274089, 120.155069),
        content:''
    };

    var displayCtrlDiv = document.createElement('DIV');
      displayControl = new DisplayControl(displayCtrlDiv, map);

    displayControl.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(displayCtrlDiv);
    google.maps.event.addListener(displayControl, 'timer_changed', function() {
        var timer=this.get("timer");
        jQuery("#play_info_bord").html(timer);
        jQuery("#play_time_pointer").css("padding-left", displayControl.get("timer")*100/displayControl.get("total")+"%");
        var layers = map.overlayMapTypes;
        for(var i=0;i<layers.b.length;i++){
            if(layers.b[i].play!=undefined){
                layers.b[i].play(timer);
            }
        }
    });




}

DisplayControl.prototype=new google.maps.MVCObject();
DisplayControl.prototype.startPlay=function(){
    var cur = displayControl.get("timer") ;
    displayControl.set("timer",cur+1);

    if(displayControl.get("timer")>=displayControl.get("total")){
        window.clearInterval(displayControl.get("timeTick")) ;
    }
};

function DisplayControl(controlDiv, map) {
    var me = this;
    // Set CSS styles for the DIV containing the control
    // Setting padding to 5 px will offset the control
    // from the edge of the map
    controlDiv.style.padding = '5px';
    this.set("timer",0);
    this.set("position",map.getCenter());
    this.set("total",100);
    // Set CSS for the control border
    var controlUI = document.createElement('DIV');

    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'play';
    controlDiv.appendChild(controlUI);

    var startBtn = document.createElement('img');
    startBtn.src="/wms/static/images/play_start.png";
    startBtn.style.paddingTop="1mm";
    startBtn.style.zIndex=2;
    startBtn.id="play_start_btn";
    startBtn.title="play";
    controlUI.appendChild(startBtn);
    google.maps.event.addDomListener(startBtn, 'click', function () {
        if (startBtn.title  == "play") {
            startBtn.title  = "stop";
            me.set("timeTick",setInterval("displayControl.startPlay()",1000));

        } else {
            startBtn.title  = "play";
            window.clearInterval(me.get("timeTick")) ;
        }
    });

    var timePoint = document.createElement('img');
    timePoint.src="/wms/static/images/time_point.png";

    timePoint.id="play_time_pointer";
    controlUI.appendChild(timePoint);

    var bar = document.createElement('img');
    bar.src="/wms/static/images/time_bar.png";
    bar.id="play_bar";
    controlUI.appendChild(bar);

    google.maps.event.addDomListener(bar, 'click', function (e) {
             //*me.get("total")/bar.style.width
        var width=jQuery("#play_bar").css("width").replace("px","");
         me.set("timer", e.offsetX*me.get("total")/new Number(width));
    });


    var controlText = document.createElement('DIV');
    controlText.id="play_info_bord";
    controlUI.appendChild(controlText);


}






