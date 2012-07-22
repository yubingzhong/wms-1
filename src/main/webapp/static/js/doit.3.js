/*
 *
 * Welcome to view this js file. X_X
 * Name:Doit.im javascipt library
 * Site:http://www.doit.im/
 * Description:All javascript library used in doit.im
 *
 */
var Do = new Object();
var GTD = new Object();
var Time = new Object();
var Doit = new Object();
var CA = new Object();
var TASKS,TASKS_FILTER;
Doit.messages = "";
Doit.maxOrder = 0;
Doit.prioritys = [
    {_id:1,name:L.TASK_PRI1},
    {_id:2,name:L.TASK_PRI2},
    {_id:3,name:L.TASK_PRI3}
];
Doit.forwards = [
    {_id:"completed",name:L.i_group_forward_completed},
    {_id:"receive",name:L.i_group_forward_received},
    {_id:"send",name:L.i_group_forward_send}
];
Doit.waits = [
    {_id:"me",name:L.i_group_wait_me},
    {_id:"other",name:L.i_group_wait_other}
];
Doit.RestTime = "/v1/server_time";
Doit.RestTask = "/v1/tasks";
Doit.RestBoxes = "/v1/boxes";
Doit.RestCheckLength = "/v1";
Doit.RestTaskCount = "/tasks/count";
Doit.RestContext = "/v1/contexts";
Doit.RestProject = "/v1/projects";
Doit.RestSetting = "/v1/users/me";
Doit.RestSearch = "/v1/search";
Doit.RestMessage = "/v1/messages";
Doit.RestContact = "/v1/contacts";
Doit.RestSetting = "/v1/settings";
Doit.RestArchive = "/v1/archive";
Doit.RestCalendar = "/v1/tasks/calendar";
Doit.RestContactGroup = "/v1/groups";
Doit.ImportTaskFromAir = "/task_air";
Doit.Home = "/home";
Doit.RestTag = "/v1/tags";
Doit.isSearch = false;
Doit.schedules = [
    {_id:"repeat",name:L.i_group_schedule_repeat},
    {_id:"more",name:L.i_group_schedule_more},
    {_id:"nextmonth",name:L.i_group_schedule_nextmonth},
    {_id:"thismonth",name:L.i_group_schedule_thismonth},
    {_id:"nextweek",name:L.i_group_schedule_nextweek},
    {_id:"thisweek",name:L.i_group_schedule_thisweek},
    {_id:"tomorrow",name:L.i_group_schedule_tomorrow},
    {_id:"today",name:L.i_group_schedule_today}
];
Doit.detail = "/contact/detail";
Doit.addContacts = "/contact/add_contacts";
Do.cookie = function(b, j, m) {
    if (typeof j != "undefined") {
        m = m || {};
        if (j === null) {
            j = "";
            m.expires = -1
        }
        var e = "";
        if (m.expires && (typeof m.expires == "number" || m.expires.toUTCString)) {
            var f;
            if (typeof m.expires == "number") {
                f = new Date();
                f.setTime(f.getTime() + (m.expires * 24 * 60 * 60 * 1000))
            } else {
                f = m.expires
            }
            e = "; expires=" + f.toUTCString()
        }
        var l = m.path ? "; path=" + (m.path) : "";
        var g = m.domain ? "; domain=" + (m.domain) : "";
        var a = m.secure ? "; secure" : "";
        document.cookie = [b,"=",encodeURIComponent(j),e,l,g,a].join("")
    } else {
        var d = null;
        if (document.cookie && document.cookie != "") {
            var k = document.cookie.split(";");
            for (var h = 0; h < k.length; h++) {
                var c = jQuery.trim(k[h]);
                if (c.substring(0, b.length + 1) == (b + "=")) {
                    d = decodeURIComponent(c.substring(b.length + 1));
                    break
                }
            }
        }
        return d
    }
};
Do.weblang = Do.cookie("web_language");
var dateFormat = function() {
    var a = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,b = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,d = /[^-+\dA-Z]/g,c = function(f, e) {
        f = String(f);
        e = e || 2;
        while (f.length < e) {
            f = "0" + f
        }
        return f
    };
    return function(i, w, q) {
        var g = dateFormat;
        if (arguments.length == 1 && Object.prototype.toString.call(i) == "[object String]" && !/\d/.test(i)) {
            w = i;
            i = undefined
        }
        i = i ? new Date(i) : new Date;
        if (isNaN(i)) {
            throw SyntaxError("invalid date")
        }
        w = String(g.masks[w] || w || g.masks["default"]);
        if (w.slice(0, 4) == "UTC:") {
            w = w.slice(4);
            q = true
        }
        var u = q ? "getUTC" : "get",l = i[u + "Date"](),e = i[u + "Day"](),j = i[u + "Month"](),p = i[u + "FullYear"](),t = i[u + "Hours"](),k = i[u + "Minutes"](),v = i[u + "Seconds"](),n = i[u + "Milliseconds"](),f = q ? 0 : i.getTimezoneOffset(),h = {d:l,dd:c(l),ddd:g.i18n.dayNames[e],dddd:g.i18n.dayNames[e + 7],m:j + 1,mm:c(j + 1),mmm:g.i18n.monthNames[j],mmmm:g.i18n.monthNames[j + 12],yy:String(p).slice(2),yyyy:p,h:t % 12 || 12,hh:c(t % 12 || 12),H:t,HH:c(t),M:k,MM:c(k),s:v,ss:c(v),l:c(n, 3),L:c(n > 99 ? Math.round(n / 10) : n),t:t < 12 ? "a" : "p",tt:t < 12 ? "am" : "pm",T:t < 12 ? "A" : "P",TT:t < 12 ? "AM" : "PM",Z:q ? "UTC" : (String(i).match(b) || [""]).pop().replace(d, ""),o:(f > 0 ? "-" : "+") + c(Math.floor(Math.abs(f) / 60) * 100 + Math.abs(f) % 60, 4),S:["th","st","nd","rd"][l % 10 > 3 ? 0 : (l % 100 - l % 10 != 10) * l % 10]};
        return w.replace(a, function(m) {
            return m in h ? h[m] : m.slice(1, m.length - 1)
        })
    }
}();
dateFormat.masks = {"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",onlyMonth:"mmmm yyyy",isMonth:"mmmm",calendarTitle:"mmmm yyyy",calendarThisTitle:"mmmm",calendarMoreTitle:"dddd, mmmm d",isDay:"d",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"yyyy-mm-dd HH:MM:ss +0000",isTaskbarTime:"mmm d",taskbarStartatWeek:"ddd"};
dateFormat.i18n = {dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};
if (Do.weblang == "cn" || Do.weblang == "tw") {
    dateFormat.masks = {mediumDate:"yyyy.mmm.dd",onlyMonth:"yyyy.mmmm",isMonth:"mm月",isDay:"dd日",calendarTitle:"yyyy年mmmm月",calendarThisTitle:"mmmm月",calendarMoreTitle:"mm月 dd日 (dddd)",isTaskbarTime:"mm/dd",taskbarStartatWeek:"ddd"};
    dateFormat.i18n = {dayNames:["周日","周一","周二","周三","周四","周五","周六","星期日","星期一","星期二","星期三","星期四","星期五","星期六"],monthNames:["01","02","03","04","05","06","07","08","09","10","11","12","01","02","03","04","05","06","07","08","09","10","11","12"]}
}
Date.prototype.format = function(a, b) {
    return dateFormat(this, a, b)
};
(function(a) {
    a.widget("ui.slider", a.ui.mouse, {widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function() {
                var d = this,c = this.options;
                this._mouseSliding = this._keySliding = false;
                this._animateOff = true;
                this._handleIndex = null;
                this._detectOrientation();
                this._mouseInit();
                this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all");
                c.disabled && this.element.addClass("ui-slider-disabled ui-disabled");
                this.range = a([]);
                if (c.range) {
                    if (c.range === true) {
                        this.range = a("<div></div>");
                        if (!c.values) {
                            c.values = [this._valueMin(),this._valueMin()]
                        }
                        if (c.values.length && c.values.length !== 2) {
                            c.values = [c.values[0],c.values[0]]
                        }
                    } else {
                        this.range = a("<div></div>")
                    }
                    this.range.appendTo(this.element).addClass("ui-slider-range");
                    if (c.range === "min" || c.range === "max") {
                        this.range.addClass("ui-slider-range-" + c.range)
                    }
                    this.range.addClass("ui-widget-header")
                }
                a(".ui-slider-handle", this.element).length === 0 && a("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");
                if (c.values && c.values.length) {
                    for (; a(".ui-slider-handle", this.element).length < c.values.length;) {
                        a("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle")
                    }
                }
                this.handles = a(".ui-slider-handle", this.element).addClass("ui-state-default ui-corner-all");
                this.handle = this.handles.eq(0);
                this.handles.add(this.range).filter("a").click(
                        function(b) {
                            b.preventDefault()
                        }).hover(
                        function() {
                            c.disabled || a(this).addClass("ui-state-hover")
                        },
                        function() {
                            a(this).removeClass("ui-state-hover")
                        }).focus(
                        function() {
                            if (c.disabled) {
                                a(this).blur()
                            } else {
                                a(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
                                a(this).addClass("ui-state-focus")
                            }
                        }).blur(function() {
                    a(this).removeClass("ui-state-focus")
                });
                this.handles.each(function(b) {
                    a(this).data("index.ui-slider-handle", b)
                });
                this.handles.keydown(
                        function(n) {
                            var m = true,l = a(this).data("index.ui-slider-handle"),k,j,b;
                            if (!d.options.disabled) {
                                switch (n.keyCode) {
                                    case a.ui.keyCode.HOME:
                                    case a.ui.keyCode.END:
                                    case a.ui.keyCode.PAGE_UP:
                                    case a.ui.keyCode.PAGE_DOWN:
                                    case a.ui.keyCode.UP:
                                    case a.ui.keyCode.RIGHT:
                                    case a.ui.keyCode.DOWN:
                                    case a.ui.keyCode.LEFT:
                                        m = false;
                                        if (!d._keySliding) {
                                            d._keySliding = true;
                                            a(this).addClass("ui-state-active");
                                            k = d._start(n, l);
                                            if (k === false) {
                                                return
                                            }
                                        }
                                        break
                                }
                                b = d.options.step;
                                k = d.options.values && d.options.values.length ? (j = d.values(l)) : (j = d.value());
                                switch (n.keyCode) {
                                    case a.ui.keyCode.HOME:
                                        j = d._valueMin();
                                        break;
                                    case a.ui.keyCode.END:
                                        j = d._valueMax();
                                        break;
                                    case a.ui.keyCode.PAGE_UP:
                                        j = d._trimAlignValue(k + (d._valueMax() - d._valueMin()) / 5);
                                        break;
                                    case a.ui.keyCode.PAGE_DOWN:
                                        j = d._trimAlignValue(k - (d._valueMax() - d._valueMin()) / 5);
                                        break;
                                    case a.ui.keyCode.UP:
                                    case a.ui.keyCode.RIGHT:
                                        if (k === d._valueMax()) {
                                            return
                                        }
                                        j = d._trimAlignValue(k + b);
                                        break;
                                    case a.ui.keyCode.DOWN:
                                    case a.ui.keyCode.LEFT:
                                        if (k === d._valueMin()) {
                                            return
                                        }
                                        j = d._trimAlignValue(k - b);
                                        break
                                }
                                d._slide(n, l, j);
                                return m
                            }
                        }).keyup(function(f) {
                    var b = a(this).data("index.ui-slider-handle");
                    if (d._keySliding) {
                        d._keySliding = false;
                        d._stop(f, b);
                        d._change(f, b);
                        a(this).removeClass("ui-state-active")
                    }
                });
                this._refreshValue();
                this._animateOff = false
            },destroy:function() {
                this.handles.remove();
                this.range.remove();
                this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
                this._mouseDestroy();
                return this
            },_mouseCapture:function(j) {
                var d = this.options,p,o,n,m,l,k;
                if (d.disabled) {
                    return false
                }
                this.elementSize = {width:this.element.outerWidth(),height:this.element.outerHeight()};
                this.elementOffset = this.element.offset();
                p = {x:j.pageX,y:j.pageY};
                o = this._normValueFromMouse(p);
                n = this._valueMax() - this._valueMin() + 1;
                l = this;
                this.handles.each(function(c) {
                    var b = Math.abs(o - l.values(c));
                    if (n > b) {
                        n = b;
                        m = a(this);
                        k = c
                    }
                });
                if (d.range === true && this.values(1) === d.min) {
                    k += 1;
                    m = a(this.handles[k])
                }
                if (this._start(j, k) === false) {
                    return false
                }
                this._mouseSliding = true;
                l._handleIndex = k;
                m.addClass("ui-state-active").focus();
                d = m.offset();
                this._clickOffset = !a(j.target).parents().andSelf().is(".ui-slider-handle") ? {left:0,top:0} : {left:j.pageX - d.left - m.width() / 2,top:j.pageY - d.top - m.height() / 2 - (parseInt(m.css("borderTopWidth"), 10) || 0) - (parseInt(m.css("borderBottomWidth"), 10) || 0) + (parseInt(m.css("marginTop"), 10) || 0)};
                o = this._normValueFromMouse(p);
                this._slide(j, k, o);
                return this._animateOff = true
            },_mouseStart:function() {
                return true
            },_mouseDrag:function(d) {
                var c = this._normValueFromMouse({x:d.pageX,y:d.pageY});
                this._slide(d, this._handleIndex, c);
                return false
            },_mouseStop:function(b) {
                this.handles.removeClass("ui-state-active");
                this._mouseSliding = false;
                this._stop(b, this._handleIndex);
                this._change(b, this._handleIndex);
                this._clickOffset = this._handleIndex = null;
                return this._animateOff = false
            },_detectOrientation:function() {
                this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal"
            },_normValueFromMouse:function(d) {
                var c;
                if (this.orientation === "horizontal") {
                    c = this.elementSize.width;
                    d = d.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)
                } else {
                    c = this.elementSize.height;
                    d = d.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)
                }
                c = d / c;
                if (c > 1) {
                    c = 1
                }
                if (c < 0) {
                    c = 0
                }
                if (this.orientation === "vertical") {
                    c = 1 - c
                }
                d = this._valueMax() - this._valueMin();
                return this._trimAlignValue(this._valueMin() + c * d)
            },_start:function(e, d) {
                var f = {handle:this.handles[d],value:this.value()};
                if (this.options.values && this.options.values.length) {
                    f.value = this.values(d);
                    f.values = this.values()
                }
                return this._trigger("start", e, f)
            },_slide:function(f, d, h) {
                var g;
                if (this.options.values && this.options.values.length) {
                    g = this.values(d ? 0 : 1);
                    if (this.options.values.length === 2 && this.options.range === true && (d === 0 && h > g || d === 1 && h < g)) {
                        h = g
                    }
                    if (h !== this.values(d)) {
                        g = this.values();
                        g[d] = h;
                        f = this._trigger("slide", f, {handle:this.handles[d],value:h,values:g});
                        this.values(d ? 0 : 1);
                        f !== false && this.values(d, h, true)
                    }
                } else {
                    if (h !== this.value()) {
                        f = this._trigger("slide", f, {handle:this.handles[d],value:h});
                        f !== false && this.value(h)
                    }
                }
            },_stop:function(e, d) {
                var f = {handle:this.handles[d],value:this.value()};
                if (this.options.values && this.options.values.length) {
                    f.value = this.values(d);
                    f.values = this.values()
                }
                this._trigger("stop", e, f)
            },_change:function(e, d) {
                if (!this._keySliding && !this._mouseSliding) {
                    var f = {handle:this.handles[d],value:this.value()};
                    if (this.options.values && this.options.values.length) {
                        f.value = this.values(d);
                        f.values = this.values()
                    }
                    this._trigger("change", e, f)
                }
            },value:function(b) {
                if (arguments.length) {
                    this.options.value = this._trimAlignValue(b);
                    this._refreshValue();
                    this._change(null, 0)
                }
                return this._value()
            },values:function(g, d) {
                var j,i,h;
                if (arguments.length > 1) {
                    this.options.values[g] = this._trimAlignValue(d);
                    this._refreshValue();
                    this._change(null, g)
                }
                if (arguments.length) {
                    if (a.isArray(arguments[0])) {
                        j = this.options.values;
                        i = arguments[0];
                        for (h = 0; h < j.length; h += 1) {
                            j[h] = this._trimAlignValue(i[h]);
                            this._change(null, h)
                        }
                        this._refreshValue()
                    } else {
                        return this.options.values && this.options.values.length ? this._values(g) : this.value()
                    }
                } else {
                    return this._values()
                }
            },_setOption:function(f, d) {
                var h,g = 0;
                if (a.isArray(this.options.values)) {
                    g = this.options.values.length
                }
                a.Widget.prototype._setOption.apply(this, arguments);
                switch (f) {
                    case"disabled":
                        if (d) {
                            this.handles.filter(".ui-state-focus").blur();
                            this.handles.removeClass("ui-state-hover");
                            this.handles.attr("disabled", "disabled");
                            this.element.addClass("ui-disabled")
                        } else {
                            this.handles.removeAttr("disabled");
                            this.element.removeClass("ui-disabled")
                        }
                        break;
                    case"orientation":
                        this._detectOrientation();
                        this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                        this._refreshValue();
                        break;
                    case"value":
                        this._animateOff = true;
                        this._refreshValue();
                        this._change(null, 0);
                        this._animateOff = false;
                        break;
                    case"values":
                        this._animateOff = true;
                        this._refreshValue();
                        for (h = 0; h < g; h += 1) {
                            this._change(null, h)
                        }
                        this._animateOff = false;
                        break
                }
            },_value:function() {
                var b = this.options.value;
                return b = this._trimAlignValue(b)
            },_values:function(e) {
                var d,f;
                if (arguments.length) {
                    d = this.options.values[e];
                    return d = this._trimAlignValue(d)
                } else {
                    d = this.options.values.slice();
                    for (f = 0; f < d.length; f += 1) {
                        d[f] = this._trimAlignValue(d[f])
                    }
                    return d
                }
            },_trimAlignValue:function(e) {
                if (e < this._valueMin()) {
                    return this._valueMin()
                }
                if (e > this._valueMax()) {
                    return this._valueMax()
                }
                var d = this.options.step > 0 ? this.options.step : 1,f = e % d;
                e = e - f;
                if (Math.abs(f) * 2 >= d) {
                    e += f > 0 ? d : -d
                }
                return parseFloat(e.toFixed(5))
            },_valueMin:function() {
                return this.options.min
            },_valueMax:function() {
                return this.options.max
            },_refreshValue:function() {
                var u = this.options.range,t = this.options,s = this,q = !this._animateOff ? t.animate : false,p,o = {},n,m,l,d;
                if (this.options.values && this.options.values.length) {
                    this.handles.each(function(b) {
                        p = (s.values(b) - s._valueMin()) / (s._valueMax() - s._valueMin()) * 100;
                        o[s.orientation === "horizontal" ? "left" : "bottom"] = p + "%";
                        a(this).stop(1, 1)[q ? "animate" : "css"](o, t.animate);
                        if (s.options.range === true) {
                            if (s.orientation === "horizontal") {
                                if (b === 0) {
                                    s.range.stop(1, 1)[q ? "animate" : "css"]({left:p + "%"}, t.animate)
                                }
                                if (b === 1) {
                                    s.range[q ? "animate" : "css"]({width:p - n + "%"}, {queue:false,duration:t.animate})
                                }
                            } else {
                                if (b === 0) {
                                    s.range.stop(1, 1)[q ? "animate" : "css"]({bottom:p + "%"}, t.animate)
                                }
                                if (b === 1) {
                                    s.range[q ? "animate" : "css"]({height:p - n + "%"}, {queue:false,duration:t.animate})
                                }
                            }
                        }
                        n = p
                    })
                } else {
                    m = this.value();
                    l = this._valueMin();
                    d = this._valueMax();
                    p = d !== l ? (m - l) / (d - l) * 100 : 0;
                    o[s.orientation === "horizontal" ? "left" : "bottom"] = p + "%";
                    this.handle.stop(1, 1)[q ? "animate" : "css"](o, t.animate);
                    if (u === "min" && this.orientation === "horizontal") {
                        this.range.stop(1, 1)[q ? "animate" : "css"]({width:p + "%"}, t.animate)
                    }
                    if (u === "max" && this.orientation === "horizontal") {
                        this.range[q ? "animate" : "css"]({width:100 - p + "%"}, {queue:false,duration:t.animate})
                    }
                    if (u === "min" && this.orientation === "vertical") {
                        this.range.stop(1, 1)[q ? "animate" : "css"]({height:p + "%"}, t.animate)
                    }
                    if (u === "max" && this.orientation === "vertical") {
                        this.range[q ? "animate" : "css"]({height:100 - p + "%"}, {queue:false,duration:t.animate})
                    }
                }
            }});
    a.extend(a.ui.slider, {version:"1.8.2"})
})(jQuery);
(function(c) {
    function b(g, l, k, f) {
        var e = l - 1;
        --k;
        var h = g[k];
        var m;
        for (var d = l; d < k; ++d) {
            if (f == "desc") {
                if (c.parseInt(c(g[d]).attr("order")) > c.parseInt(c(h).attr("order"))) {
                    ++e;
                    m = g[e];
                    g[e] = g[d];
                    g[d] = m
                }
            } else {
                if (c.parseInt(c(g[d]).attr("order")) <= c.parseInt(c(h).attr("order"))) {
                    ++e;
                    m = g[e];
                    g[e] = g[d];
                    g[d] = m
                }
            }
        }
        ++e;
        g[k] = g[e];
        g[e] = h;
        return e
    }

    function a(f, h, g, e) {
        if (h >= g - 1) {
            return 1
        }
        var d = b(f, h, g, e);
        a(f, h, d, e);
        a(f, d + 1, g, e);
        return 1
    }

    c.QuickSort = function(e, d) {
        a(e, 0, e.length, d);
        return e
    }
})(jQuery);
(function(a) {
    a.fn.isDatepickerDiv = function() {
        this.css({position:"absolute"}).addClass("hidden ontop").datepicker({showOtherMonths:true,selectOtherMonths:true,changeMonth:true,changeYear:true,dateFormat:"yy-mm-dd",hasHours:true,onSelect:function(b) {
                    a.datepickdivoptiontask.select(a.datepickdivoptiontask.task, a.datepickdivoptiontask.item, a.datepickdivoptiontask.target, b.toDateTime())
                }})
    };
    a.fn.showDatepicker = function(d) {
        var b = this;
        var c = new Date();
        c = Time.userDay(c);
        c.setDate(c.getDate() + 2);
        a.datepickdivoptiontask = d;
        if (b.hasClass("hidden")) {
            b.datepicker("option", "minDate", c);
            a("html").bind("click", function(e) {
                if (a(e.target).is("#datepicker *")) {
                    return
                }
                b.hiddenDatepicker();
                a("html").unbind()
            });
            b.css({left:d.left,top:d.top}).removeClass("hidden")
        }
    };
    a.fn.hiddenDatepicker = function() {
        var b = this;
        b.addClass("hidden")
    }
})(jQuery);
jQuery.fn.extend({everyTime:function(a, b, c, d) {
            return this.each(function() {
                jQuery.timer.add(this, a, b, c, d)
            })
        },oneTime:function(a, b, c) {
            return this.each(function() {
                jQuery.timer.add(this, a, b, c, 1)
            })
        },stopTime:function(a, b) {
            return this.each(function() {
                jQuery.timer.remove(this, a, b)
            })
        }});
jQuery.extend({timer:{global:[],guid:1,dataKey:"jQuery.timer",regex:/^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,powers:{ms:1,cs:10,ds:100,s:1000,das:10000,hs:100000,ks:1000000},timeParse:function(c) {
            if (c == undefined || c == null) {
                return null
            }
            var a = this.regex.exec(jQuery.trim(c.toString()));
            if (a[2]) {
                var b = parseFloat(a[1]);
                var d = this.powers[a[2]] || 1;
                return b * d
            } else {
                return c
            }
        },add:function(d, b, c, f, h) {
            var a = 0;
            if (jQuery.isFunction(c)) {
                if (!h) {
                    h = f
                }
                f = c;
                c = b
            }
            b = jQuery.timer.timeParse(b);
            if (typeof b != "number" || isNaN(b) || b < 0) {
                return
            }
            if (typeof h != "number" || isNaN(h) || h < 0) {
                h = 0
            }
            h = h || 0;
            var g = jQuery.data(d, this.dataKey) || jQuery.data(d, this.dataKey, {});
            if (!g[c]) {
                g[c] = {}
            }
            f.timerID = f.timerID || this.guid++;
            var e = function() {
                if ((++a > h && h !== 0) || f.call(d, a) === false) {
                    jQuery.timer.remove(d, c, f)
                }
            };
            e.timerID = f.timerID;
            if (!g[c][f.timerID]) {
                g[c][f.timerID] = window.setInterval(e, b)
            }
            this.global.push(d)
        },remove:function(c, b, d) {
            var e = jQuery.data(c, this.dataKey),a;
            if (e) {
                if (!b) {
                    for (b in e) {
                        this.remove(c, b, d)
                    }
                } else {
                    if (e[b]) {
                        if (d) {
                            if (d.timerID) {
                                window.clearInterval(e[b][d.timerID]);
                                delete e[b][d.timerID]
                            }
                        } else {
                            for (var d in e[b]) {
                                window.clearInterval(e[b][d]);
                                delete e[b][d]
                            }
                        }
                        for (a in e[b]) {
                            break
                        }
                        if (!a) {
                            a = null;
                            delete e[b]
                        }
                    }
                }
                for (a in e) {
                    break
                }
                if (!a) {
                    jQuery.removeData(c, this.dataKey)
                }
            }
        }}});
jQuery(window).bind("unload", function() {
    jQuery.each(jQuery.timer.global, function(a, b) {
        jQuery.timer.remove(b)
    })
});
if (!this.JSON) {
    this.JSON = {}
}
(function() {
    function f(n) {
        return n < 10 ? "0" + n : n
    }

    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta = {"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }

    function str(key, holder) {
        var i,k,v,length,mind = gap,partial,value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
            case"string":
                return quote(value);
            case"number":
                return isFinite(value) ? String(value) : "null";
            case"boolean":
            case"null":
                return String(value);
            case"object":
                if (!value) {
                    return"null"
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null"
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === "string") {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v
        }
    }

    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {"":value})
        }
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k,v,value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return"\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({"":j}, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}());
(function() {
    $.Autocomplete = function(c, b) {
        var a = this;
        a.options = b;
        a.dom = {};
        a.dom.elem = c;
        a.dom.results = $('<div class="autocomplete"></div>').hide();
        a.dom.results.css("width", c.innerWidth());
        a.dom.elem.after(a.dom.results);
        a.position();
        var d = b.cantClass;
        c.bind("keyup.autocomplete text.autocomplete", function(j) {
            if (a.options.automove) {
                var f = $(this).position();
                var i = f.left + 2;
                var h = f.top + 20;
                a.dom.results.css({left:i,top:h})
            }
            var g;
            if ($.isFunction(a.options.valueFunction)) {
                g = a.options.valueFunction(this)
            } else {
                g = c.val()
            }
            switch (j.keyCode) {
                case 38:
                    if (a.active) {
                        a.selectPrev()
                    }
                    break;
                case 40:
                    if (a.active) {
                        a.selectNext()
                    }
                    break;
                case 13:
                    if (a.active) {
                        a.selectItem()
                    }
                    break;
                default:
                    if (!$(this).hasClass(d)) {
                        a.showAndFilterResults(g)
                    } else {
                        a.dom.results.hide()
                    }
            }
        });
        if (a.options.focusShow) {
            c.bind("focus.autocomplete", function() {
                if (a.options.automove) {
                    var e = $(this).position();
                    var h = e.left + 2;
                    var g = e.top + 20;
                    a.dom.results.css({left:h,top:g})
                }
                if (!$(this).hasClass(d)) {
                    var f;
                    if ($.isFunction(a.options.valueFunction)) {
                        f = a.options.valueFunction(this)
                    } else {
                        f = c.val()
                    }
                    a.showAndFilterResults(f)
                }
            })
        }
        a.destroy()
    };
    $.Autocomplete.prototype.position = function() {
        this.dom.results.css({"margin-top":this.dom.elem.outerHeight()})
    };
    $.Autocomplete.prototype.show = function() {
        var a;
        this.dom.results.find("li").each(function() {
            a = $(this).find("span");
            a.ellipsis()
        });
        this.active = true;
        this.dom.results.show()
    };
    $.Autocomplete.prototype.hide = function() {
        this.active = false;
        this.dom.results.hide()
    };
    $.Autocomplete.prototype.selectPrev = function() {
        if (!this.active) {
            return
        }
        var e,d,f,b,c;
        b = this.options.maxHeight;
        e = this.dom.results.find(".selected");
        c = this.dom.results.find("li").outerHeight(true);
        if (e.length) {
            e.removeClass("selected");
            d = e.next();
            f = e.prev();
            if (f.length) {
                var g = f.position().top;
                f.addClass("selected");
                if (g <= 0) {
                    var a = this.dom.results.scrollTop();
                    this.dom.results.scrollTop(a + g)
                }
            } else {
                this.dom.results.find("li:last").addClass("selected");
                this.dom.results.scrollTop(22222)
            }
        } else {
            this.dom.results.find("li:last").addClass("selected")
        }
    };
    $.Autocomplete.prototype.selectNext = function() {
        if (!this.active) {
            return
        }
        var f,e,g,a,d;
        a = this.options.maxHeight;
        f = this.dom.results.find(".selected");
        d = this.dom.results.find("li").outerHeight(true);
        if (f.length) {
            f.removeClass("selected");
            e = f.next();
            g = f.prev();
            var b = this.dom.results.find("li").index(e);
            var c = (b - a + 1) * d;
            if (e.length) {
                e.addClass("selected");
                if (b >= a) {
                    this.dom.results.scrollTop(c)
                }
            } else {
                this.dom.results.find("li:first").addClass("selected");
                this.dom.results.scrollTop(0)
            }
        } else {
            this.dom.results.find("li:first").addClass("selected")
        }
    };
    $.Autocomplete.prototype.selectItem = function() {
        var a = this.dom.results.find(".selected");
        if (a.length) {
            if ($.isFunction(this.options.selectFucntion)) {
                this.options.selectFucntion(a)
            } else {
                this.dom.elem.val(a.attr("name"))
            }
            this.dom.elem.attr("uuid", a.attr("uuid"));
            this.dom.elem.attr("name", a.attr("name"));
            this.dom.elem.attr("email", a.attr("email"));
            this.dom.elem.attr("data", a.attr("data"));
            if ($.isFunction(this.options.callbackFunction)) {
                this.options.callbackFunction()
            }
            this.hide()
        }
    };
    $.Autocomplete.prototype.showAndFilterResults = function(a) {
        this.showResults(this.filterResults(a))
    };
    $.Autocomplete.prototype.escapeSpecialCharactors = function(a) {
        if (Do.isEmptyStr(a)) {
            return a
        }
        a = a.replace(/^\++/, "");
        a = a.replace(/\[/g, "\\[");
        a = a.replace(/\\/g, "\\\\");
        a = a.replace(/\^/g, "\\^");
        a = a.replace(/\$/g, "\\$");
        a = a.replace(/\./g, "\\.");
        a = a.replace(/\?/g, "\\?");
        a = a.replace(/\*/g, "\\*");
        a = a.replace(/\(/g, "\\(");
        a = a.replace(/\)/g, "\\)");
        return a
    };
    $.Autocomplete.prototype.regTest = function(b, e, d, f) {
        var c,a;
        if (b.length != 0) {
            a = true;
            for (c = 0; c < b.length; c++) {
                if (!b[c].test(f) && a) {
                    a = false
                }
            }
            if (a) {
                return true
            }
        } else {
            if (e.length != 0) {
                var a = false;
                for (c = 0; c < e.length; c++) {
                    if (e[c].test(f) && !a) {
                        a = true
                    }
                }
                if (a) {
                    return true
                }
            } else {
                if (d && d.test(f)) {
                    return true
                }
            }
        }
        return false
    };
    $.Autocomplete.prototype.filterResults = function(f) {
        var m = [];
        var h,b,c = [],k = [];
        var n,s,a,d,o,q,p,l,t;
        var g,e;
        f = this.escapeSpecialCharactors(f);
        if ((new RegExp(/\+/g)).test(f)) {
            h = f.split("+")
        } else {
            if ((new RegExp(/\|/g)).test(f)) {
                b = f.split("|")
            }
        }
        if (h) {
            for (n = 0; n < h.length; n++) {
                s = h[n];
                c.push(new RegExp(s, "i"))
            }
        } else {
            if (b) {
                for (n = 0; n < b.length; n++) {
                    s = b[n];
                    k.push(new RegExp(s, "i"))
                }
            } else {
                g = new RegExp(f, "i")
            }
        }
        if ($.isEmptyObject(this.options.data)) {
            this.hide();
            return m
        }
        for (n = 0; n < this.options.data.length; n++) {
            e = false;
            s = this.options.data[n];
            p = typeof s;
            if (p == "string") {
                a = "";
                d = s;
                o = s;
                q = s
            } else {
                if (p == "array") {
                } else {
                    if (p == "number") {
                        a = "";
                        d = s;
                        o = "";
                        q = s
                    } else {
                        if (p == "object") {
                            a = s._id;
                            d = s.name;
                            o = s.email;
                            q = s.value;
                            for (l = 0; l < this.options.filters.length; l++) {
                                t = this.options.filters[l];
                                if (this.regTest(c, k, g, s[t]) && !e) {
                                    m.push({uuid:a,name:d,email:o,value:q});
                                    e = true
                                }
                            }
                        }
                    }
                }
            }
            if (!this.options.filters.length) {
                if (this.regTest(c, k, g, d)) {
                    m.push({uuid:a,name:d,email:o,value:q})
                }
            }
        }
        if (m.length == 0) {
            this.hide();
            return m
        }
        return m
    };
    $.Autocomplete.prototype.createLi = function(c) {
        var b = this;
        var a;
        if ($.isFunction(this.options.showFunction)) {
            a = this.options.showFunction(c)
        } else {
            a = $("<li>" + c.name + "</li>")
        }
        a.attr("uuid", c.uuid);
        a.attr("name", c.name);
        a.attr("email", c.email);
        a.attr("value", c.value);
        a.bind("click", function() {
            b.dom.results.find("li.selected").removeClass("selected");
            a.addClass("selected");
            b.selectItem();
            return false
        });
        return a
    };
    $.Autocomplete.prototype.showResults = function(e) {
        this.dom.results.empty();
        var d = $("<ul></ul>");
        var c,f,a,b;
        if (this.options.showSize == null || this.options.showSize > e.length) {
            var b = e.length
        } else {
            var b = this.options.showSize
        }
        for (c = 0; c < b; c++) {
            f = e[c];
            a = this.createLi(f);
            if (c == 0) {
                a.addClass("selected")
            }
            d.append(a)
        }
        this.dom.results.append(d);
        if (e.length == 0) {
            if ($.isFunction(this.options.noResult)) {
                $noresult = this.options.noResult();
                this.dom.results.empty().append($noresult)
            } else {
                this.dom.results.empty().html('<div class="noresult">' + L.TASKFORM_NO_RESULTS + "</div>")
            }
        } else {
            if ($.isFunction(this.options.append)) {
                $addnew = this.options.append();
                this.dom.results.find("ul").append($addnew)
            }
        }
        this.show()
    };
    $.Autocomplete.prototype.sortResults = function() {
    };
    $.Autocomplete.prototype.destroy = function() {
        var a = this;
        if ($.isFunction(this.options.destroyFunction)) {
            if (this.options.destroyFunction()) {
                this.hide()
            }
        } else {
            $("body").bind("click", function(b) {
                if ($(b.target).is(".autocomplete")) {
                    return
                }
                a.hide()
            })
        }
    };
    $.fn.doitAutocomplete = function(b) {
        var a = $(this);
        b = $.extend({data:new Object(),filters:new Object()}, b);
        var c = new $.Autocomplete(a, b)
    }
})(jQuery);
(function(c) {
    var a = ["DOMMouseScroll","mousewheel"];
    c.event.special.mousewheel = {setup:function() {
        if (this.addEventListener) {
            for (var d = a.length; d;) {
                this.addEventListener(a[--d], b, false)
            }
        } else {
            this.onmousewheel = b
        }
    },teardown:function() {
        if (this.removeEventListener) {
            for (var d = a.length; d;) {
                this.removeEventListener(a[--d], b, false)
            }
        } else {
            this.onmousewheel = null
        }
    }};
    c.fn.extend({mousewheel:function(d) {
                return d ? this.bind("mousewheel", d) : this.trigger("mousewheel")
            },unmousewheel:function(d) {
                return this.unbind("mousewheel", d)
            }});
    function b(i) {
        var g = i || window.event,f = [].slice.call(arguments, 1),j = 0,h = true,e = 0,d = 0;
        i = c.event.fix(g);
        i.type = "mousewheel";
        if (i.wheelDelta) {
            j = i.wheelDelta / 120
        }
        if (i.detail) {
            j = -i.detail / 3
        }
        d = j;
        if (g.axis != undefined && g.axis === g.HORIZONTAL_AXIS) {
            d = 0;
            e = -1 * j
        }
        if (g.wheelDeltaY != undefined) {
            d = g.wheelDeltaY / 120
        }
        if (g.wheelDeltaX != undefined) {
            e = -1 * g.wheelDeltaX / 120
        }
        f.unshift(i, j, e, d);
        return c.event.handle.apply(this, f)
    }
})(jQuery);
(function(d) {
    var f = {put:function(h, g) {
        (g || window).location.hash = this.encoder(h)
    },get:function(i) {
        var h = ((i || window).location.hash).replace(/^#\//, "");
        try {
            return d.browser.mozilla ? h : decodeURIComponent(h)
        } catch(g) {
            return h
        }
    },encoder:encodeURIComponent};
    var c = {id:"__jQuery_history",init:function() {
        var g = '<iframe id="' + this.id + '" style="display:none" src="javascript:false;" />';
        d("body").prepend(g);
        return this
    },_document:function() {
        return d("#" + this.id)[0].contentWindow.document
    },put:function(h) {
        var g = this._document();
        g.open();
        g.close();
        f.put(h, g)
    },get:function() {
        return f.get(this._document())
    }};

    function e(h) {
        h = d.extend({unescape:false}, h || {});
        f.encoder = i(h.unescape);
        function i(j) {
            if (j === true) {
                return function(k) {
                    return k
                }
            }
            if (typeof j == "string" && (j = g(j.split(""))) || typeof j == "function") {
                return function(k) {
                    return j(encodeURIComponent(k))
                }
            }
            return encodeURIComponent
        }

        function g(k) {
            var j = new RegExp(d.map(k, encodeURIComponent).join("|"), "ig");
            return function(l) {
                return l.replace(j, decodeURIComponent)
            }
        }
    }

    var b = {};
    b.base = {callback:undefined,type:undefined,check:function() {
    },load:function(g) {
    },init:function(h, g) {
        e(g);
        a.callback = h;
        a._options = g;
        a._init()
    },_init:function() {
    },_options:{}};
    b.timer = {_appState:undefined,_init:function() {
        var g = f.get();
        a._appState = g;
        a.callback(g);
        setInterval(a.check, 100)
    },check:function() {
        var g = f.get();
        if (g != a._appState) {
            a._appState = g;
            a.callback(g)
        }
    },load:function(g) {
        if (g != a._appState) {
            f.put(g);
            a._appState = g;
            a.callback(g)
        }
    }};
    b.iframeTimer = {_appState:undefined,_init:function() {
        var g = f.get();
        a._appState = g;
        c.init().put(g);
        a.callback(g);
        setInterval(a.check, 100)
    },check:function() {
        var h = c.get(),g = f.get();
        if (g != h) {
            if (g == a._appState) {
                a._appState = h;
                f.put(h);
                a.callback(h)
            } else {
                a._appState = g;
                c.put(g);
                a.callback(g)
            }
        }
    },load:function(g) {
        if (g != a._appState) {
            f.put(g);
            c.put(g);
            a._appState = g;
            a.callback(g)
        }
    }};
    b.hashchangeEvent = {_init:function() {
        a.callback(f.get());
        d(window).bind("hashchange", a.check)
    },check:function() {
        a.callback(f.get())
    },load:function(g) {
        f.put(g)
    }};
    var a = d.extend({}, b.base);
    if (d.browser.msie && (d.browser.version < 8 || document.documentMode < 8)) {
        a.type = "iframeTimer"
    } else {
        if ("onhashchange" in window) {
            a.type = "hashchangeEvent"
        } else {
            a.type = "timer"
        }
    }
    d.extend(a, b[a.type]);
    d.history = a
})(jQuery);
Date.CultureInfo = {name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|aft(er)?|from|hence)/i,subtract:/^(\-|bef(ore)?|ago)/i,yesterday:/^yes(terday)?/i,today:/^t(od(ay)?)?/i,tomorrow:/^tom(orrow)?/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^mn|min(ute)?s?/i,hour:/^h(our)?s?/i,week:/^w(eek)?s?/i,month:/^m(onth)?s?/i,day:/^d(ay)?s?/i,year:/^y(ear)?s?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a(?!u|p)|p)/i},timezones:[
    {name:"UTC",offset:"-000"},
    {name:"GMT",offset:"-000"},
    {name:"EST",offset:"-0500"},
    {name:"EDT",offset:"-0400"},
    {name:"CST",offset:"-0600"},
    {name:"CDT",offset:"-0500"},
    {name:"MST",offset:"-0700"},
    {name:"MDT",offset:"-0600"},
    {name:"PST",offset:"-0800"},
    {name:"PDT",offset:"-0700"}
]};
(function() {
    var b = Date,a = b.prototype,d = b.CultureInfo,g = function(i, h) {
        if (!h) {
            h = 2
        }
        return("000" + i).slice(h * -1)
    };
    a.clearTime = function() {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
        return this
    };
    a.setTimeToNow = function() {
        var h = new Date();
        this.setHours(h.getHours());
        this.setMinutes(h.getMinutes());
        this.setSeconds(h.getSeconds());
        this.setMilliseconds(h.getMilliseconds());
        return this
    };
    b.today = function() {
        return new Date().clearTime()
    };
    b.compare = function(i, h) {
        if (isNaN(i) || isNaN(h)) {
            throw new Error(i + " - " + h)
        } else {
            if (i instanceof Date && h instanceof Date) {
                return(i < h) ? -1 : (i > h) ? 1 : 0
            } else {
                throw new TypeError(i + " - " + h)
            }
        }
    };
    b.equals = function(i, h) {
        return(i.compareTo(h) === 0)
    };
    b.getDayNumberFromName = function(j) {
        var q = d.dayNames,h = d.abbreviatedDayNames,p = d.shortestDayNames,l = j.toLowerCase();
        for (var k = 0; k < q.length; k++) {
            if (q[k].toLowerCase() == l || h[k].toLowerCase() == l || p[k].toLowerCase() == l) {
                return k
            }
        }
        return -1
    };
    b.getMonthNumberFromName = function(j) {
        var o = d.monthNames,h = d.abbreviatedMonthNames,l = j.toLowerCase();
        for (var k = 0; k < o.length; k++) {
            if (o[k].toLowerCase() == l || h[k].toLowerCase() == l) {
                return k
            }
        }
        return -1
    };
    b.isLeapYear = function(h) {
        return((h % 4 === 0 && h % 100 !== 0) || h % 400 === 0)
    };
    b.getDaysInMonth = function(h, i) {
        return[31,(b.isLeapYear(h) ? 29 : 28),31,30,31,30,31,31,30,31,30,31][i]
    };
    b.getTimezoneAbbreviation = function(l) {
        var k = d.timezones,j;
        for (var h = 0; h < k.length; h++) {
            if (k[h].offset === l) {
                return k[h].name
            }
        }
        return null
    };
    b.getTimezoneOffset = function(h) {
        var l = d.timezones,k;
        for (var j = 0; j < l.length; j++) {
            if (l[j].name === h.toUpperCase()) {
                return l[j].offset
            }
        }
        return null
    };
    a.clone = function() {
        return new Date(this.getTime())
    };
    a.compareTo = function(h) {
        return Date.compare(this, h)
    };
    a.equals = function(h) {
        return Date.equals(this, h || new Date())
    };
    a.between = function(i, h) {
        return this.getTime() >= i.getTime() && this.getTime() <= h.getTime()
    };
    a.isAfter = function(h) {
        return this.compareTo(h || new Date()) === 1
    };
    a.isBefore = function(h) {
        return(this.compareTo(h || new Date()) === -1)
    };
    a.isToday = function() {
        return this.isSameDay(new Date())
    };
    a.isSameDay = function(h) {
        return this.clone().clearTime().equals(h.clone().clearTime())
    };
    a.addMilliseconds = function(h) {
        this.setMilliseconds(this.getMilliseconds() + h);
        return this
    };
    a.addSeconds = function(h) {
        return this.addMilliseconds(h * 1000)
    };
    a.addMinutes = function(h) {
        return this.addMilliseconds(h * 60000)
    };
    a.addHours = function(h) {
        return this.addMilliseconds(h * 3600000)
    };
    a.addDays = function(h) {
        this.setDate(this.getDate() + h);
        return this
    };
    a.addWeeks = function(h) {
        return this.addDays(h * 7)
    };
    a.addMonths = function(h) {
        var i = this.getDate();
        this.setDate(1);
        this.setMonth(this.getMonth() + h);
        this.setDate(Math.min(i, b.getDaysInMonth(this.getFullYear(), this.getMonth())));
        return this
    };
    a.addYears = function(h) {
        return this.addMonths(h * 12)
    };
    a.add = function(i) {
        if (typeof i == "number") {
            this._orient = i;
            return this
        }
        var h = i;
        if (h.milliseconds) {
            this.addMilliseconds(h.milliseconds)
        }
        if (h.seconds) {
            this.addSeconds(h.seconds)
        }
        if (h.minutes) {
            this.addMinutes(h.minutes)
        }
        if (h.hours) {
            this.addHours(h.hours)
        }
        if (h.weeks) {
            this.addWeeks(h.weeks)
        }
        if (h.months) {
            this.addMonths(h.months)
        }
        if (h.years) {
            this.addYears(h.years)
        }
        if (h.days) {
            this.addDays(h.days)
        }
        return this
    };
    var e,f,c;
    a.getWeek = function() {
        var p,o,m,l,k,j,i,h,t,q;
        e = (!e) ? this.getFullYear() : e;
        f = (!f) ? this.getMonth() + 1 : f;
        c = (!c) ? this.getDate() : c;
        if (f <= 2) {
            p = e - 1;
            o = (p / 4 | 0) - (p / 100 | 0) + (p / 400 | 0);
            m = ((p - 1) / 4 | 0) - ((p - 1) / 100 | 0) + ((p - 1) / 400 | 0);
            t = o - m;
            k = 0;
            j = c - 1 + (31 * (f - 1))
        } else {
            p = e;
            o = (p / 4 | 0) - (p / 100 | 0) + (p / 400 | 0);
            m = ((p - 1) / 4 | 0) - ((p - 1) / 100 | 0) + ((p - 1) / 400 | 0);
            t = o - m;
            k = t + 1;
            j = c + ((153 * (f - 3) + 2) / 5) + 58 + t
        }
        i = (p + o) % 7;
        l = (j + i - k) % 7;
        h = (j + 3 - l) | 0;
        if (h < 0) {
            q = 53 - ((i - t) / 5 | 0)
        } else {
            if (h > 364 + t) {
                q = 1
            } else {
                q = (h / 7 | 0) + 1
            }
        }
        e = f = c = null;
        return q
    };
    a.getISOWeek = function() {
        e = this.getUTCFullYear();
        f = this.getUTCMonth() + 1;
        c = this.getUTCDate();
        return g(this.getWeek())
    };
    a.setWeek = function(h) {
        return this.moveToDayOfWeek(1).addWeeks(h - this.getWeek())
    };
    b._validate = function(k, j, h, i) {
        if (typeof k == "undefined") {
            return false
        } else {
            if (typeof k != "number") {
                throw new TypeError(k + " is not a Number.")
            } else {
                if (k < j || k > h) {
                    throw new RangeError(k + " is not a valid value for " + i + ".")
                }
            }
        }
        return true
    };
    b.validateMillisecond = function(h) {
        return b._validate(h, 0, 999, "millisecond")
    };
    b.validateSecond = function(h) {
        return b._validate(h, 0, 59, "second")
    };
    b.validateMinute = function(h) {
        return b._validate(h, 0, 59, "minute")
    };
    b.validateHour = function(h) {
        return b._validate(h, 0, 23, "hour")
    };
    b.validateDay = function(i, h, j) {
        return b._validate(i, 1, b.getDaysInMonth(h, j), "day")
    };
    b.validateMonth = function(h) {
        return b._validate(h, 0, 11, "month")
    };
    b.validateYear = function(h) {
        return b._validate(h, 0, 9999, "year")
    };
    a.set = function(h) {
        if (b.validateMillisecond(h.millisecond)) {
            this.addMilliseconds(h.millisecond - this.getMilliseconds())
        }
        if (b.validateSecond(h.second)) {
            this.addSeconds(h.second - this.getSeconds())
        }
        if (b.validateMinute(h.minute)) {
            this.addMinutes(h.minute - this.getMinutes())
        }
        if (b.validateHour(h.hour)) {
            this.addHours(h.hour - this.getHours())
        }
        if (b.validateMonth(h.month)) {
            this.addMonths(h.month - this.getMonth())
        }
        if (b.validateYear(h.year)) {
            this.addYears(h.year - this.getFullYear())
        }
        if (b.validateDay(h.day, this.getFullYear(), this.getMonth())) {
            this.addDays(h.day - this.getDate())
        }
        if (h.timezone) {
            this.setTimezone(h.timezone)
        }
        if (h.timezoneOffset) {
            this.setTimezoneOffset(h.timezoneOffset)
        }
        if (h.week && b._validate(h.week, 0, 53, "week")) {
            this.setWeek(h.week)
        }
        return this
    };
    a.moveToFirstDayOfMonth = function() {
        return this.set({day:1})
    };
    a.moveToLastDayOfMonth = function() {
        return this.set({day:b.getDaysInMonth(this.getFullYear(), this.getMonth())})
    };
    a.moveToNthOccurrence = function(i, j) {
        var h = 0;
        if (j > 0) {
            h = j - 1
        } else {
            if (j === -1) {
                this.moveToLastDayOfMonth();
                if (this.getDay() !== i) {
                    this.moveToDayOfWeek(i, -1)
                }
                return this
            }
        }
        return this.moveToFirstDayOfMonth().addDays(-1).moveToDayOfWeek(i, +1).addWeeks(h)
    };
    a.moveToDayOfWeek = function(h, i) {
        var j = (h - this.getDay() + 7 * (i || +1)) % 7;
        return this.addDays((j === 0) ? j += 7 * (i || +1) : j)
    };
    a.moveToMonth = function(j, h) {
        var i = (j - this.getMonth() + 12 * (h || +1)) % 12;
        return this.addMonths((i === 0) ? i += 12 * (h || +1) : i)
    };
    a.getOrdinalNumber = function() {
        return Math.ceil((this.clone().clearTime() - new Date(this.getFullYear(), 0, 1)) / 86400000) + 1
    };
    a.getTimezone = function() {
        return b.getTimezoneAbbreviation(this.getUTCOffset())
    };
    a.setTimezoneOffset = function(j) {
        var h = this.getTimezoneOffset(),i = Number(j) * -6 / 10;
        return this.addMinutes(i - h)
    };
    a.setTimezone = function(h) {
        return this.setTimezoneOffset(b.getTimezoneOffset(h))
    };
    a.hasDaylightSavingTime = function() {
        return(Date.today().set({month:0,day:1}).getTimezoneOffset() !== Date.today().set({month:6,day:1}).getTimezoneOffset())
    };
    a.isDaylightSavingTime = function() {
        return(this.hasDaylightSavingTime() && new Date().getTimezoneOffset() === Date.today().set({month:6,day:1}).getTimezoneOffset())
    };
    a.getUTCOffset = function() {
        var i = this.getTimezoneOffset() * -10 / 6,h;
        if (i < 0) {
            h = (i - 10000).toString();
            return h.charAt(0) + h.substr(2)
        } else {
            h = (i + 10000).toString();
            return"+" + h.substr(1)
        }
    };
    a.getElapsed = function(h) {
        return(h || new Date()) - this
    };
    if (!a.toISOString) {
        a.toISOString = function() {
            function h(i) {
                return i < 10 ? "0" + i : i
            }

            return'"' + this.getUTCFullYear() + "-" + h(this.getUTCMonth() + 1) + "-" + h(this.getUTCDate()) + "T" + h(this.getUTCHours()) + ":" + h(this.getUTCMinutes()) + ":" + h(this.getUTCSeconds()) + 'Z"'
        }
    }
    a._toString = a.toString;
    a.toString = function(j) {
        var h = this;
        if (j && j.length == 1) {
            var k = d.formatPatterns;
            h.t = h.toString;
            switch (j) {
                case"d":
                    return h.t(k.shortDate);
                case"D":
                    return h.t(k.longDate);
                case"F":
                    return h.t(k.fullDateTime);
                case"m":
                    return h.t(k.monthDay);
                case"r":
                    return h.t(k.rfc1123);
                case"s":
                    return h.t(k.sortableDateTime);
                case"t":
                    return h.t(k.shortTime);
                case"T":
                    return h.t(k.longTime);
                case"u":
                    return h.t(k.universalSortableDateTime);
                case"y":
                    return h.t(k.yearMonth)
            }
        }
        var i = function(l) {
            switch (l * 1) {
                case 1:
                case 21:
                case 31:
                    return"st";
                case 2:
                case 22:
                    return"nd";
                case 3:
                case 23:
                    return"rd";
                default:
                    return"th"
            }
        };
        return j ? j.replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g, function(l) {
            if (l.charAt(0) === "\\") {
                return l.replace("\\", "")
            }
            h.h = h.getHours;
            switch (l) {
                case"hh":
                    return g(h.h() < 13 ? (h.h() === 0 ? 12 : h.h()) : (h.h() - 12));
                case"h":
                    return h.h() < 13 ? (h.h() === 0 ? 12 : h.h()) : (h.h() - 12);
                case"HH":
                    return g(h.h());
                case"H":
                    return h.h();
                case"mm":
                    return g(h.getMinutes());
                case"m":
                    return h.getMinutes();
                case"ss":
                    return g(h.getSeconds());
                case"s":
                    return h.getSeconds();
                case"yyyy":
                    return g(h.getFullYear(), 4);
                case"yy":
                    return g(h.getFullYear());
                case"dddd":
                    return d.dayNames[h.getDay()];
                case"ddd":
                    return d.abbreviatedDayNames[h.getDay()];
                case"dd":
                    return g(h.getDate());
                case"d":
                    return h.getDate();
                case"MMMM":
                    return d.monthNames[h.getMonth()];
                case"MMM":
                    return d.abbreviatedMonthNames[h.getMonth()];
                case"MM":
                    return g((h.getMonth() + 1));
                case"M":
                    return h.getMonth() + 1;
                case"t":
                    return h.h() < 12 ? d.amDesignator.substring(0, 1) : d.pmDesignator.substring(0, 1);
                case"tt":
                    return h.h() < 12 ? d.amDesignator : d.pmDesignator;
                case"S":
                    return i(h.getDate());
                default:
                    return l
            }
        }) : this._toString()
    }
}());
(function() {
    var v = Date,g = v.prototype,w = v.CultureInfo,o = Number.prototype;
    g._orient = +1;
    g._nth = null;
    g._is = false;
    g._same = false;
    g._isSecond = false;
    o._dateElement = "day";
    g.next = function() {
        this._orient = +1;
        return this
    };
    v.next = function() {
        return v.today().next()
    };
    g.last = g.prev = g.previous = function() {
        this._orient = -1;
        return this
    };
    v.last = v.prev = v.previous = function() {
        return v.today().last()
    };
    g.is = function() {
        this._is = true;
        return this
    };
    g.same = function() {
        this._same = true;
        this._isSecond = false;
        return this
    };
    g.today = function() {
        return this.same().day()
    };
    g.weekday = function() {
        if (this._is) {
            this._is = false;
            return(!this.is().sat() && !this.is().sun())
        }
        return false
    };
    g.at = function(i) {
        return(typeof i === "string") ? v.parse(this.toString("d") + " " + i) : this.set(i)
    };
    o.fromNow = o.after = function(i) {
        var j = {};
        j[this._dateElement] = this;
        return((!i) ? new Date() : i.clone()).add(j)
    };
    o.ago = o.before = function(i) {
        var j = {};
        j[this._dateElement] = this * -1;
        return((!i) ? new Date() : i.clone()).add(j)
    };
    var e = ("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),h = ("january february march april may june july august september october november december").split(/\s/),n = ("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),p = ("Milliseconds Seconds Minutes Hours Date Week Month FullYear").split(/\s/),b = ("final first second third fourth fifth").split(/\s/),y;
    g.toObject = function() {
        var k = {};
        for (var j = 0; j < n.length; j++) {
            k[n[j].toLowerCase()] = this["get" + p[j]]()
        }
        return k
    };
    v.fromObject = function(i) {
        i.week = null;
        return Date.today().set(i)
    };
    var x = function(i) {
        return function() {
            if (this._is) {
                this._is = false;
                return this.getDay() == i
            }
            if (this._nth !== null) {
                if (this._isSecond) {
                    this.addSeconds(this._orient * -1)
                }
                this._isSecond = false;
                var k = this._nth;
                this._nth = null;
                var j = this.clone().moveToLastDayOfMonth();
                this.moveToNthOccurrence(i, k);
                if (this > j) {
                    throw new RangeError(v.getDayName(i) + " does not occur " + k + " times in the month of " + v.getMonthName(j.getMonth()) + " " + j.getFullYear() + ".")
                }
                return this
            }
            return this.moveToDayOfWeek(i, this._orient)
        }
    };
    var f = function(i) {
        return function() {
            var k = v.today(),j = i - k.getDay();
            if (i === 0 && w.firstDayOfWeek === 1 && k.getDay() !== 0) {
                j = j + 7
            }
            return k.addDays(j)
        }
    };
    for (var u = 0; u < e.length; u++) {
        v[e[u].toUpperCase()] = v[e[u].toUpperCase().substring(0, 3)] = u;
        v[e[u]] = v[e[u].substring(0, 3)] = f(u);
        g[e[u]] = g[e[u].substring(0, 3)] = x(u)
    }
    var z = function(i) {
        return function() {
            if (this._is) {
                this._is = false;
                return this.getMonth() === i
            }
            return this.moveToMonth(i, this._orient)
        }
    };
    var m = function(i) {
        return function() {
            return v.today().set({month:i,day:1})
        }
    };
    for (var t = 0; t < h.length; t++) {
        v[h[t].toUpperCase()] = v[h[t].toUpperCase().substring(0, 3)] = t;
        v[h[t]] = v[h[t].substring(0, 3)] = m(t);
        g[h[t]] = g[h[t].substring(0, 3)] = z(t)
    }
    var c = function(i) {
        return function() {
            if (this._isSecond) {
                this._isSecond = false;
                return this
            }
            if (this._same) {
                this._same = this._is = false;
                var C = this.toObject(),B = (arguments[0] || new Date()).toObject(),A = "",l = i.toLowerCase();
                for (var j = (n.length - 1); j > -1; j--) {
                    A = n[j].toLowerCase();
                    if (C[A] != B[A]) {
                        return false
                    }
                    if (l == A) {
                        break
                    }
                }
                return true
            }
            if (i.substring(i.length - 1) != "s") {
                i += "s"
            }
            return this["add" + i](this._orient)
        }
    };
    var d = function(i) {
        return function() {
            this._dateElement = i;
            return this
        }
    };
    for (var s = 0; s < n.length; s++) {
        y = n[s].toLowerCase();
        g[y] = g[y + "s"] = c(n[s]);
        o[y] = o[y + "s"] = d(y)
    }
    g._ss = c("Second");
    var a = function(i) {
        return function(j) {
            if (this._same) {
                return this._ss(arguments[0])
            }
            if (j || j === 0) {
                return this.moveToNthOccurrence(j, i)
            }
            this._nth = i;
            if (i === 2 && (j === undefined || j === null)) {
                this._isSecond = true;
                return this.addSeconds(this._orient)
            }
            return this
        }
    };
    for (var q = 0; q < b.length; q++) {
        g[b[q]] = (q === 0) ? a(-1) : a(q)
    }
}());
(function() {
    Date.Parsing = {Exception:function(i) {
        this.message = "Parse error at '" + i.substring(0, 10) + " ...'"
    }};
    var a = Date.Parsing;
    var c = a.Operators = {rtoken:function(i) {
        return function(j) {
            var k = j.match(i);
            if (k) {
                return([k[0],j.substring(k[0].length)])
            } else {
                throw new a.Exception(j)
            }
        }
    },token:function(i) {
        return function(j) {
            return c.rtoken(new RegExp("^s*" + j + "s*"))(j)
        }
    },stoken:function(i) {
        return c.rtoken(new RegExp("^" + i))
    },until:function(i) {
        return function(j) {
            var k = [],m = null;
            while (j.length) {
                try {
                    m = i.call(this, j)
                } catch(l) {
                    k.push(m[0]);
                    j = m[1];
                    continue
                }
                break
            }
            return[k,j]
        }
    },many:function(i) {
        return function(j) {
            var m = [],k = null;
            while (j.length) {
                try {
                    k = i.call(this, j)
                } catch(l) {
                    return[m,j]
                }
                m.push(k[0]);
                j = k[1]
            }
            return[m,j]
        }
    },optional:function(i) {
        return function(j) {
            var k = null;
            try {
                k = i.call(this, j)
            } catch(l) {
                return[null,j]
            }
            return[k[0],k[1]]
        }
    },not:function(i) {
        return function(j) {
            try {
                i.call(this, j)
            } catch(k) {
                return[null,j]
            }
            throw new a.Exception(j)
        }
    },ignore:function(i) {
        return i ? function(j) {
            var k = null;
            k = i.call(this, j);
            return[null,k[1]]
        } : null
    },product:function() {
        var k = arguments[0],l = Array.prototype.slice.call(arguments, 1),m = [];
        for (var j = 0; j < k.length; j++) {
            m.push(c.each(k[j], l))
        }
        return m
    },cache:function(k) {
        var i = {},j = null;
        return function(l) {
            try {
                j = i[l] = (i[l] || k.call(this, l))
            } catch(m) {
                j = i[l] = m
            }
            if (j instanceof a.Exception) {
                throw j
            } else {
                return j
            }
        }
    },any:function() {
        var i = arguments;
        return function(k) {
            var l = null;
            for (var j = 0; j < i.length; j++) {
                if (i[j] == null) {
                    continue
                }
                try {
                    l = (i[j].call(this, k))
                } catch(m) {
                    l = null
                }
                if (l) {
                    return l
                }
            }
            throw new a.Exception(k)
        }
    },each:function() {
        var i = arguments;
        return function(k) {
            var n = [],l = null;
            for (var j = 0; j < i.length; j++) {
                if (i[j] == null) {
                    continue
                }
                try {
                    l = (i[j].call(this, k))
                } catch(m) {
                    throw new a.Exception(k)
                }
                n.push(l[0]);
                k = l[1]
            }
            return[n,k]
        }
    },all:function() {
        var j = arguments,i = i;
        return i.each(i.optional(j))
    },sequence:function(i, j, k) {
        j = j || c.rtoken(/^\s*/);
        k = k || null;
        if (i.length == 1) {
            return i[0]
        }
        return function(o) {
            var p = null,t = null;
            var v = [];
            for (var n = 0; n < i.length; n++) {
                try {
                    p = i[n].call(this, o)
                } catch(u) {
                    break
                }
                v.push(p[0]);
                try {
                    t = j.call(this, p[1])
                } catch(m) {
                    t = null;
                    break
                }
                o = t[1]
            }
            if (!p) {
                throw new a.Exception(o)
            }
            if (t) {
                throw new a.Exception(t[1])
            }
            if (k) {
                try {
                    p = k.call(this, p[1])
                } catch(l) {
                    throw new a.Exception(p[1])
                }
            }
            return[v,(p ? p[1] : o)]
        }
    },between:function(j, k, i) {
        i = i || j;
        var l = c.each(c.ignore(j), k, c.ignore(i));
        return function(m) {
            var n = l.call(this, m);
            return[
                [n[0][0],r[0][2]],
                n[1]
            ]
        }
    },list:function(i, j, k) {
        j = j || c.rtoken(/^\s*/);
        k = k || null;
        return(i instanceof Array ? c.each(c.product(i.slice(0, -1), c.ignore(j)), i.slice(-1), c.ignore(k)) : c.each(c.many(c.each(i, c.ignore(j))), px, c.ignore(k)))
    },set:function(i, j, k) {
        j = j || c.rtoken(/^\s*/);
        k = k || null;
        return function(B) {
            var l = null,n = null,m = null,o = null,t = [
                [],
                B
            ],A = false;
            for (var v = 0; v < i.length; v++) {
                m = null;
                n = null;
                l = null;
                A = (i.length == 1);
                try {
                    l = i[v].call(this, B)
                } catch(y) {
                    continue
                }
                o = [
                    [l[0]],
                    l[1]
                ];
                if (l[1].length > 0 && !A) {
                    try {
                        m = j.call(this, l[1])
                    } catch(z) {
                        A = true
                    }
                } else {
                    A = true
                }
                if (!A && m[1].length === 0) {
                    A = true
                }
                if (!A) {
                    var w = [];
                    for (var u = 0; u < i.length; u++) {
                        if (v != u) {
                            w.push(i[u])
                        }
                    }
                    n = c.set(w, j).call(this, m[1]);
                    if (n[0].length > 0) {
                        o[0] = o[0].concat(n[0]);
                        o[1] = n[1]
                    }
                }
                if (o[1].length < t[1].length) {
                    t = o
                }
                if (t[1].length === 0) {
                    break
                }
            }
            if (t[0].length === 0) {
                return t
            }
            if (k) {
                try {
                    m = k.call(this, t[1])
                } catch(x) {
                    throw new a.Exception(t[1])
                }
                t[1] = m[1]
            }
            return t
        }
    },forward:function(i, j) {
        return function(k) {
            return i[j].call(this, k)
        }
    },replace:function(j, i) {
        return function(k) {
            var l = j.call(this, k);
            return[i,l[1]]
        }
    },process:function(j, i) {
        return function(k) {
            var l = j.call(this, k);
            return[i.call(this, l[0]),l[1]]
        }
    },min:function(i, j) {
        return function(k) {
            var l = j.call(this, k);
            if (l[0].length < i) {
                throw new a.Exception(k)
            }
            return l
        }
    }};
    var h = function(i) {
        return function() {
            var j = null,m = [];
            if (arguments.length > 1) {
                j = Array.prototype.slice.call(arguments)
            } else {
                if (arguments[0] instanceof Array) {
                    j = arguments[0]
                }
            }
            if (j) {
                for (var l = 0,k = j.shift(); l < k.length; l++) {
                    j.unshift(k[l]);
                    m.push(i.apply(null, j));
                    j.shift();
                    return m
                }
            } else {
                return i.apply(null, arguments)
            }
        }
    };
    var g = "optional not ignore cache".split(/\s/);
    for (var d = 0; d < g.length; d++) {
        c[g[d]] = h(c[g[d]])
    }
    var f = function(i) {
        return function() {
            if (arguments[0] instanceof Array) {
                return i.apply(null, arguments[0])
            } else {
                return i.apply(null, arguments)
            }
        }
    };
    var e = "each any all".split(/\s/);
    for (var b = 0; b < e.length; b++) {
        c[e[b]] = f(c[e[b]])
    }
}());
(function() {
    var e = Date,l = e.prototype,f = e.CultureInfo;
    var h = function(m) {
        var n = [];
        for (var g = 0; g < m.length; g++) {
            if (m[g] instanceof Array) {
                n = n.concat(h(m[g]))
            } else {
                if (m[g]) {
                    n.push(m[g])
                }
            }
        }
        return n
    };
    e.Grammar = {};
    e.Translator = {hour:function(g) {
        return function() {
            this.hour = Number(g)
        }
    },minute:function(g) {
        return function() {
            this.minute = Number(g)
        }
    },second:function(g) {
        return function() {
            this.second = Number(g)
        }
    },meridian:function(g) {
        return function() {
            this.meridian = g.slice(0, 1).toLowerCase()
        }
    },timezone:function(g) {
        return function() {
            var m = g.replace(/[^\d\+\-]/g, "");
            if (m.length) {
                this.timezoneOffset = Number(m)
            } else {
                this.timezone = g.toLowerCase()
            }
        }
    },day:function(g) {
        var m = g[0];
        return function() {
            this.day = Number(m.match(/\d+/)[0])
        }
    },month:function(g) {
        return function() {
            this.month = (g.length == 3) ? "jan feb mar apr may jun jul aug sep oct nov dec".indexOf(g) / 4 : Number(g) - 1
        }
    },year:function(g) {
        return function() {
            var m = Number(g);
            this.year = ((g.length > 2) ? m : (m + (((m + 2000) < f.twoDigitYearMax) ? 2000 : 1900)))
        }
    },rday:function(g) {
        return function() {
            switch (g) {
                case"yesterday":
                    this.days = -1;
                    break;
                case"tomorrow":
                    this.days = 1;
                    break;
                case"today":
                    this.days = 0;
                    break;
                case"now":
                    this.days = 0;
                    this.now = true;
                    break
            }
        }
    },finishExact:function(g) {
        g = (g instanceof Array) ? g : [g];
        for (var n = 0; n < g.length; n++) {
            if (g[n]) {
                g[n].call(this)
            }
        }
        var m = new Date();
        if ((this.hour || this.minute) && (!this.month && !this.year && !this.day)) {
            this.day = m.getDate()
        }
        if (!this.year) {
            this.year = m.getFullYear()
        }
        if (!this.month && this.month !== 0) {
            this.month = m.getMonth()
        }
        if (!this.day) {
            this.day = 1
        }
        if (!this.hour) {
            this.hour = 0
        }
        if (!this.minute) {
            this.minute = 0
        }
        if (!this.second) {
            this.second = 0
        }
        if (this.meridian && this.hour) {
            if (this.meridian == "p" && this.hour < 12) {
                this.hour = this.hour + 12
            } else {
                if (this.meridian == "a" && this.hour == 12) {
                    this.hour = 0
                }
            }
        }
        if (this.day > e.getDaysInMonth(this.year, this.month)) {
            throw new RangeError(this.day + " is not a valid value for days.")
        }
        var o = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
        if (this.timezone) {
            o.set({timezone:this.timezone})
        } else {
            if (this.timezoneOffset) {
                o.set({timezoneOffset:this.timezoneOffset})
            }
        }
        return o
    },finish:function(g) {
        g = (g instanceof Array) ? h(g) : [g];
        if (g.length === 0) {
            return null
        }
        for (var q = 0; q < g.length; q++) {
            if (typeof g[q] == "function") {
                g[q].call(this)
            }
        }
        var n = e.today();
        if (this.now && !this.unit && !this.operator) {
            return new Date()
        } else {
            if (this.now) {
                n = new Date()
            }
        }
        var s = !!(this.days && this.days !== null || this.orient || this.operator);
        var t,p,o;
        o = ((this.orient == "past" || this.operator == "subtract") ? -1 : 1);
        if (!this.now && "hour minute second".indexOf(this.unit) != -1) {
            n.setTimeToNow()
        }
        if (this.month || this.month === 0) {
            if ("year day hour minute second".indexOf(this.unit) != -1) {
                this.value = this.month + 1;
                this.month = null;
                s = true
            }
        }
        if (!s && this.weekday && !this.day && !this.days) {
            var m = Date[this.weekday]();
            this.day = m.getDate();
            if (!this.month) {
                this.month = m.getMonth()
            }
            this.year = m.getFullYear()
        }
        if (s && this.weekday && this.unit != "month") {
            this.unit = "day";
            t = (e.getDayNumberFromName(this.weekday) - n.getDay());
            p = 7;
            this.days = t ? ((t + (o * p)) % p) : (o * p)
        }
        if (this.month && this.unit == "day" && this.operator) {
            this.value = (this.month + 1);
            this.month = null
        }
        if (this.value != null && this.month != null && this.year != null) {
            this.day = this.value * 1
        }
        if (this.month && !this.day && this.value) {
            n.set({day:this.value * 1});
            if (!s) {
                this.day = this.value * 1
            }
        }
        if (!this.month && this.value && this.unit == "month" && !this.now) {
            this.month = this.value;
            s = true
        }
        if (s && (this.month || this.month === 0) && this.unit != "year") {
            this.unit = "month";
            t = (this.month - n.getMonth());
            p = 12;
            this.months = t ? ((t + (o * p)) % p) : (o * p);
            this.month = null
        }
        if (!this.unit) {
            this.unit = "day"
        }
        if (!this.value && this.operator && this.operator !== null && this[this.unit + "s"] && this[this.unit + "s"] !== null) {
            this[this.unit + "s"] = this[this.unit + "s"] + ((this.operator == "add") ? 1 : -1) + (this.value || 0) * o
        } else {
            if (this[this.unit + "s"] == null || this.operator != null) {
                if (!this.value) {
                    this.value = 1
                }
                this[this.unit + "s"] = this.value * o
            }
        }
        if (this.meridian && this.hour) {
            if (this.meridian == "p" && this.hour < 12) {
                this.hour = this.hour + 12
            } else {
                if (this.meridian == "a" && this.hour == 12) {
                    this.hour = 0
                }
            }
        }
        if (this.weekday && !this.day && !this.days) {
            var m = Date[this.weekday]();
            this.day = m.getDate();
            if (m.getMonth() !== n.getMonth()) {
                this.month = m.getMonth()
            }
        }
        if ((this.month || this.month === 0) && !this.day) {
            this.day = 1
        }
        if (!this.orient && !this.operator && this.unit == "week" && this.value && !this.day && !this.month) {
            return Date.today().setWeek(this.value)
        }
        if (s && this.timezone && this.day && this.days) {
            this.day = this.days
        }
        return(s) ? n.add(this) : n.set(this)
    }};
    var i = e.Parsing.Operators,d = e.Grammar,k = e.Translator,b;
    d.datePartDelimiter = i.rtoken(/^([\s\-\.\,\/\x27]+)/);
    d.timePartDelimiter = i.stoken(":");
    d.whiteSpace = i.rtoken(/^\s*/);
    d.generalDelimiter = i.rtoken(/^(([\s\,]|at|@|on)+)/);
    var a = {};
    d.ctoken = function(p) {
        var o = a[p];
        if (!o) {
            var q = f.regexPatterns;
            var n = p.split(/\s+/),m = [];
            for (var g = 0; g < n.length; g++) {
                m.push(i.replace(i.rtoken(q[n[g]]), n[g]))
            }
            o = a[p] = i.any.apply(null, m)
        }
        return o
    };
    d.ctoken2 = function(g) {
        return i.rtoken(f.regexPatterns[g])
    };
    d.h = i.cache(i.process(i.rtoken(/^(0[0-9]|1[0-2]|[1-9])/), k.hour));
    d.hh = i.cache(i.process(i.rtoken(/^(0[0-9]|1[0-2])/), k.hour));
    d.H = i.cache(i.process(i.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/), k.hour));
    d.HH = i.cache(i.process(i.rtoken(/^([0-1][0-9]|2[0-3])/), k.hour));
    d.m = i.cache(i.process(i.rtoken(/^([0-5][0-9]|[0-9])/), k.minute));
    d.mm = i.cache(i.process(i.rtoken(/^[0-5][0-9]/), k.minute));
    d.s = i.cache(i.process(i.rtoken(/^([0-5][0-9]|[0-9])/), k.second));
    d.ss = i.cache(i.process(i.rtoken(/^[0-5][0-9]/), k.second));
    d.hms = i.cache(i.sequence([d.H,d.m,d.s], d.timePartDelimiter));
    d.t = i.cache(i.process(d.ctoken2("shortMeridian"), k.meridian));
    d.tt = i.cache(i.process(d.ctoken2("longMeridian"), k.meridian));
    d.z = i.cache(i.process(i.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/), k.timezone));
    d.zz = i.cache(i.process(i.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/), k.timezone));
    d.zzz = i.cache(i.process(d.ctoken2("timezone"), k.timezone));
    d.timeSuffix = i.each(i.ignore(d.whiteSpace), i.set([d.tt,d.zzz]));
    d.time = i.each(i.optional(i.ignore(i.stoken("T"))), d.hms, d.timeSuffix);
    d.d = i.cache(i.process(i.each(i.rtoken(/^([0-2]\d|3[0-1]|\d)/), i.optional(d.ctoken2("ordinalSuffix"))), k.day));
    d.dd = i.cache(i.process(i.each(i.rtoken(/^([0-2]\d|3[0-1])/), i.optional(d.ctoken2("ordinalSuffix"))), k.day));
    d.ddd = d.dddd = i.cache(i.process(d.ctoken("sun mon tue wed thu fri sat"), function(g) {
        return function() {
            this.weekday = g
        }
    }));
    d.M = i.cache(i.process(i.rtoken(/^(1[0-2]|0\d|\d)/), k.month));
    d.MM = i.cache(i.process(i.rtoken(/^(1[0-2]|0\d)/), k.month));
    d.MMM = d.MMMM = i.cache(i.process(d.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"), k.month));
    d.y = i.cache(i.process(i.rtoken(/^(\d\d?)/), k.year));
    d.yy = i.cache(i.process(i.rtoken(/^(\d\d)/), k.year));
    d.yyy = i.cache(i.process(i.rtoken(/^(\d\d?\d?\d?)/), k.year));
    d.yyyy = i.cache(i.process(i.rtoken(/^(\d\d\d\d)/), k.year));
    b = function() {
        return i.each(i.any.apply(null, arguments), i.not(d.ctoken2("timeContext")))
    };
    d.day = b(d.d, d.dd);
    d.month = b(d.M, d.MMM);
    d.year = b(d.yyyy, d.yy);
    d.orientation = i.process(d.ctoken("past future"), function(g) {
        return function() {
            this.orient = g
        }
    });
    d.operator = i.process(d.ctoken("add subtract"), function(g) {
        return function() {
            this.operator = g
        }
    });
    d.rday = i.process(d.ctoken("yesterday tomorrow today now"), k.rday);
    d.unit = i.process(d.ctoken("second minute hour day week month year"), function(g) {
        return function() {
            this.unit = g
        }
    });
    d.value = i.process(i.rtoken(/^\d\d?(st|nd|rd|th)?/), function(g) {
        return function() {
            this.value = g.replace(/\D/g, "")
        }
    });
    d.expression = i.set([d.rday,d.operator,d.value,d.unit,d.orientation,d.ddd,d.MMM]);
    b = function() {
        return i.set(arguments, d.datePartDelimiter)
    };
    d.mdy = b(d.ddd, d.month, d.day, d.year);
    d.ymd = b(d.ddd, d.year, d.month, d.day);
    d.dmy = b(d.ddd, d.day, d.month, d.year);
    d.date = function(g) {
        return((d[f.dateElementOrder] || d.mdy).call(this, g))
    };
    d.format = i.process(i.many(i.any(i.process(i.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/), function(g) {
        if (d[g]) {
            return d[g]
        } else {
            throw e.Parsing.Exception(g)
        }
    }), i.process(i.rtoken(/^[^dMyhHmstz]+/), function(g) {
        return i.ignore(i.stoken(g))
    }))), function(g) {
        return i.process(i.each.apply(null, g), k.finishExact)
    });
    var j = {};
    var c = function(g) {
        return j[g] = (j[g] || d.format(g)[0])
    };
    d.formats = function(m) {
        if (m instanceof Array) {
            var n = [];
            for (var g = 0; g < m.length; g++) {
                n.push(c(m[g]))
            }
            return i.any.apply(null, n)
        } else {
            return c(m)
        }
    };
    d._formats = d.formats(['"yyyy-MM-ddTHH:mm:ssZ"',"yyyy-MM-ddTHH:mm:ssZ","yyyy-MM-ddTHH:mm:ssz","yyyy-MM-ddTHH:mm:ss","yyyy-MM-ddTHH:mmZ","yyyy-MM-ddTHH:mmz","yyyy-MM-ddTHH:mm","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","MMddyyyy","ddMMyyyy","Mddyyyy","ddMyyyy","Mdyyyy","dMyyyy","yyyy","Mdyy","dMyy","d"]);
    d._start = i.process(i.set([d.date,d.time,d.expression], d.generalDelimiter, d.whiteSpace), k.finish);
    d.start = function(g) {
        try {
            var m = d._formats.call({}, g);
            if (m[1].length === 0) {
                return m
            }
        } catch(n) {
        }
        return d._start.call({}, g)
    };
    e._parse = e.parse;
    e.parse = function(g) {
        var m = null;
        if (!g) {
            return null
        }
        if (g instanceof Date) {
            return g
        }
        try {
            m = e.Grammar.start.call({}, g.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"))
        } catch(n) {
            return null
        }
        return((m[1].length === 0) ? m[0] : null)
    };
    e.getParseFunction = function(m) {
        var g = e.Grammar.formats(m);
        return function(n) {
            var o = null;
            try {
                o = g.call({}, n)
            } catch(p) {
                return null
            }
            return((o[1].length === 0) ? o[0] : null)
        }
    };
    e.parseExact = function(g, m) {
        return e.getParseFunction(m)(g)
    }
}());
jQuery.extend(jQuery.easing, {easeInQuad:function(e, f, a, h, g) {
            return h * (f /= g) * f + a
        },easeOutQuad:function(e, f, a, h, g) {
            return -h * (f /= g) * (f - 2) + a
        },easeInOutQuad:function(e, f, a, h, g) {
            if ((f /= g / 2) < 1) {
                return h / 2 * f * f + a
            }
            return -h / 2 * ((--f) * (f - 2) - 1) + a
        },easeInCubic:function(e, f, a, h, g) {
            return h * (f /= g) * f * f + a
        },easeOutCubic:function(e, f, a, h, g) {
            return h * ((f = f / g - 1) * f * f + 1) + a
        },easeInOutCubic:function(e, f, a, h, g) {
            if ((f /= g / 2) < 1) {
                return h / 2 * f * f * f + a
            }
            return h / 2 * ((f -= 2) * f * f + 2) + a
        },easeInQuart:function(e, f, a, h, g) {
            return h * (f /= g) * f * f * f + a
        },easeOutQuart:function(e, f, a, h, g) {
            return -h * ((f = f / g - 1) * f * f * f - 1) + a
        },easeInOutQuart:function(e, f, a, h, g) {
            if ((f /= g / 2) < 1) {
                return h / 2 * f * f * f * f + a
            }
            return -h / 2 * ((f -= 2) * f * f * f - 2) + a
        },easeInQuint:function(e, f, a, h, g) {
            return h * (f /= g) * f * f * f * f + a
        },easeOutQuint:function(e, f, a, h, g) {
            return h * ((f = f / g - 1) * f * f * f * f + 1) + a
        },easeInOutQuint:function(e, f, a, h, g) {
            if ((f /= g / 2) < 1) {
                return h / 2 * f * f * f * f * f + a
            }
            return h / 2 * ((f -= 2) * f * f * f * f + 2) + a
        },easeInSine:function(e, f, a, h, g) {
            return -h * Math.cos(f / g * (Math.PI / 2)) + h + a
        },easeOutSine:function(e, f, a, h, g) {
            return h * Math.sin(f / g * (Math.PI / 2)) + a
        },easeInOutSine:function(e, f, a, h, g) {
            return -h / 2 * (Math.cos(Math.PI * f / g) - 1) + a
        },easeInExpo:function(e, f, a, h, g) {
            return(f == 0) ? a : h * Math.pow(2, 10 * (f / g - 1)) + a
        },easeOutExpo:function(e, f, a, h, g) {
            return(f == g) ? a + h : h * (-Math.pow(2, -10 * f / g) + 1) + a
        },easeInOutExpo:function(e, f, a, h, g) {
            if (f == 0) {
                return a
            }
            if (f == g) {
                return a + h
            }
            if ((f /= g / 2) < 1) {
                return h / 2 * Math.pow(2, 10 * (f - 1)) + a
            }
            return h / 2 * (-Math.pow(2, -10 * --f) + 2) + a
        },easeInCirc:function(e, f, a, h, g) {
            return -h * (Math.sqrt(1 - (f /= g) * f) - 1) + a
        },easeOutCirc:function(e, f, a, h, g) {
            return h * Math.sqrt(1 - (f = f / g - 1) * f) + a
        },easeInOutCirc:function(e, f, a, h, g) {
            if ((f /= g / 2) < 1) {
                return -h / 2 * (Math.sqrt(1 - f * f) - 1) + a
            }
            return h / 2 * (Math.sqrt(1 - (f -= 2) * f) + 1) + a
        },easeInElastic:function(f, h, e, l, k) {
            var i = 1.70158;
            var j = 0;
            var g = l;
            if (h == 0) {
                return e
            }
            if ((h /= k) == 1) {
                return e + l
            }
            if (!j) {
                j = k * 0.3
            }
            if (g < Math.abs(l)) {
                g = l;
                var i = j / 4
            } else {
                var i = j / (2 * Math.PI) * Math.asin(l / g)
            }
            return -(g * Math.pow(2, 10 * (h -= 1)) * Math.sin((h * k - i) * (2 * Math.PI) / j)) + e
        },easeOutElastic:function(f, h, e, l, k) {
            var i = 1.70158;
            var j = 0;
            var g = l;
            if (h == 0) {
                return e
            }
            if ((h /= k) == 1) {
                return e + l
            }
            if (!j) {
                j = k * 0.3
            }
            if (g < Math.abs(l)) {
                g = l;
                var i = j / 4
            } else {
                var i = j / (2 * Math.PI) * Math.asin(l / g)
            }
            return g * Math.pow(2, -10 * h) * Math.sin((h * k - i) * (2 * Math.PI) / j) + l + e
        },easeInOutElastic:function(f, h, e, l, k) {
            var i = 1.70158;
            var j = 0;
            var g = l;
            if (h == 0) {
                return e
            }
            if ((h /= k / 2) == 2) {
                return e + l
            }
            if (!j) {
                j = k * (0.3 * 1.5)
            }
            if (g < Math.abs(l)) {
                g = l;
                var i = j / 4
            } else {
                var i = j / (2 * Math.PI) * Math.asin(l / g)
            }
            if (h < 1) {
                return -0.5 * (g * Math.pow(2, 10 * (h -= 1)) * Math.sin((h * k - i) * (2 * Math.PI) / j)) + e
            }
            return g * Math.pow(2, -10 * (h -= 1)) * Math.sin((h * k - i) * (2 * Math.PI) / j) * 0.5 + l + e
        },easeInBack:function(e, f, a, i, h, g) {
            if (g == undefined) {
                g = 1.70158
            }
            return i * (f /= h) * f * ((g + 1) * f - g) + a
        },easeOutBack:function(e, f, a, i, h, g) {
            if (g == undefined) {
                g = 1.70158
            }
            return i * ((f = f / h - 1) * f * ((g + 1) * f + g) + 1) + a
        },easeInOutBack:function(e, f, a, i, h, g) {
            if (g == undefined) {
                g = 1.70158
            }
            if ((f /= h / 2) < 1) {
                return i / 2 * (f * f * (((g *= (1.525)) + 1) * f - g)) + a
            }
            return i / 2 * ((f -= 2) * f * (((g *= (1.525)) + 1) * f + g) + 2) + a
        },easeInBounce:function(e, f, a, h, g) {
            return h - jQuery.easing.easeOutBounce(e, g - f, 0, h, g) + a
        },easeOutBounce:function(e, f, a, h, g) {
            if ((f /= g) < (1 / 2.75)) {
                return h * (7.5625 * f * f) + a
            } else {
                if (f < (2 / 2.75)) {
                    return h * (7.5625 * (f -= (1.5 / 2.75)) * f + 0.75) + a
                } else {
                    if (f < (2.5 / 2.75)) {
                        return h * (7.5625 * (f -= (2.25 / 2.75)) * f + 0.9375) + a
                    } else {
                        return h * (7.5625 * (f -= (2.625 / 2.75)) * f + 0.984375) + a
                    }
                }
            }
        },easeInOutBounce:function(e, f, a, h, g) {
            if (f < g / 2) {
                return jQuery.easing.easeInBounce(e, f * 2, 0, h, g) * 0.5 + a
            }
            return jQuery.easing.easeOutBounce(e, f * 2 - g, 0, h, g) * 0.5 + h * 0.5 + a
        }});