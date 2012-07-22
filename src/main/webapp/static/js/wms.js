 var map;
function initialize() {
    var myOptions = {
        zoom: 6,
        position: new google.maps.LatLng(60, 105),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map_canvas'),
            myOptions);
    var options = {
        map: map,
        position: new google.maps.LatLng(30.274089, 120.155069),
        content: ''
    };

    var displayCtrlDiv = document.createElement('DIV');
    var displayControl = new DisplayControl(displayCtrlDiv, map);

    displayControl.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(displayCtrlDiv);
    map.setCenter(options.position);

}
function DisplayControl(controlDiv, map) {

    // Set CSS styles for the DIV containing the control
    // Setting padding to 5 px will offset the control
    // from the edge of the map
    controlDiv.style.padding = '5px';

    // Set CSS for the control border
    var controlUI = document.createElement('DIV');
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '2px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'play';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('DIV');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = '<b>播放</b>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to
    // Chicago
    google.maps.event.addDomListener(controlUI, 'click', function() {

    });

}




