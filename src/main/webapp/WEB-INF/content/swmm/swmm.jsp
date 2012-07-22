<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<script type="text/javascript" src="<spring:url value="/static/js/jquery.jqGrid.js"/>"></script>
<script type="text/javascript" src="<spring:url value="/static/js/jquery.upload-1.0.2.js"/>"></script>
<script type='text/javascript' src="<spring:url value='/static/js/google-jsapi.js'/>"></script>
<script type='text/javascript' src="<spring:url value='/static/js/google-visualization-corechart.I.js'/>"></script>
<script type='text/javascript' src="<spring:url value='/static/js/google-visualization-table.I.js'/>"></script>
<script src="<spring:url value='/static/js/my97DatePicker/WdatePicker.js'/>" type="text/javascript"></script>

<script type="text/javascript">
    $(document).ready(function () {
//        $("#panelarrow2").click(function(){
//
//            $("#content").toggleClass('nosidebar');
//        });


        $("#swmm_run_btn").button().click(function () {

        });

        $("#swmm_dialog_btn").button().click(function () {
            $("#swmm_dialog").dialog("open");
        });
        $("#swmm_data_upload_btn").button().click(function () {
            $("#swmm_dialog").dialog("open");
        });
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'serial');
        dataTable.addColumn('string', 'Date');
        dataTable.addColumn('string', 'time');
        dataTable.addColumn('string', 'value');

        var chart = new google.visualization.Table(document.getElementById("rainDataTable"));
        chart.draw(dataTable, {showRowNumber:false});

            $('#swmm_data_upload_btn').change(function () {
                $(this).upload("<spring:url value="/swmm/data/upload?format=json"/>", function (res) {
                    var _data = res.data;
                    chart.clearChart();
                    dataTable.removeRows(0,dataTable.getNumberOfRows());
                    for (var i = 0; i <= _data.length; i++) {

                        if ($.isArray(_data[i]) && _data[i].length == 4)
                            dataTable.addRow([  _data[i][0],_data[i][1]  , _data[i][2],_data[i][3]]);
                    }
                    chart.draw(dataTable, {showRowNumber:false});
                }, 'json');
            });

    });

</script>

<div id="content" style="height: 600px">

    <div id="sidebar">

        <div class="tabs">
            <div class="in" style="height: 100%; ">

                <ul>
                    <li><a href="<spring:url value="/projects/$project.name/settings/info"/>" class="info-tab "
                           id="tab-info"
                            >图层</a></li>
                    <li>
                        <button
                                class="warning-tab"
                                id="swmm_dialog_btn"
                                >swmm
                        </button>
                    </li>
                    <li><a href="<spring:url value="/projects/$project.name/settings/members"/>" class="warning-tab"
                           id="tab-ecom">ECOM</a>
                    </li>
                    <li><a href="<spring:url value="/projects/$project.name/settings/members"/>" class="warning-tab"
                           id="tab-rca">RCA</a>
                    </li>
                </ul>

            </div>

            <!--in-->

        </div>

    </div>
    <div id="main_content">
        <div id="swmm_dialog">
            <label>降水数据 </label>
            <input type="file" name="file" id="swmm_data_upload_btn" title="上传"> <br/>
            <label>开始时间
                <input name="startTime" onClick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:false})">
            </label>
            <label>结束时间
                <input name="endTime"  onClick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:false})">
            </label>
            <button id="swmm_run_btn" type="button">下一步</button>

            <div id="rainDataTable"></div>

        </div>
    </div>


</div>
