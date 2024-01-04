$(function(){
	var flag = $("#flag_h").val();
	var beginDate = $("#beginDate_h").val() ? $("#beginDate_h").val() : "";
	var endDate = $("#endDate_h").val() ? $("#endDate_h").val() : "";
	var appName = $("#appName_h").val() ? $("#appName_h").val() : "";
	var channels = $("#channels_h").val() ? $("#channels_h").val() : "";
	
	actionManager.initDialog();
	actionManager.initButton();
	actionManager.renderChartData(flag,beginDate,endDate,appName,channels);
});

var actionManager = {
	initButton : function(){
		$("#flag_h").val(null);
		
		$("#beginDate").bind("click", function(){
			WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'});
		});
		$("#endDate").bind("click", function(){
			WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\'beginDate\',{M:0,d:0,m:1});}'});
		});
		
		$("#btn_channels").click(function(){
			var channels_params = "?statParams['appName']=" + $("#appName option:selected").val();
			$.getJSON(basePath+"dp/stat/getChannelListByJSON.action" + channels_params, function(data,status,xhr){
				$("#channel_data").empty();
				var strHtml = "";
				var count = 0;
				$.each(data, function(infoIndex, info){
					count++;
					strHtml += "<tr class='ui-widget-content'>";  
					strHtml += "<td class='mytd'>"+count+"</td>";
					strHtml += "<td class='mytd'>"+info['channelName']+"</td>";  
					strHtml += "<td class='mytd'> <input type='checkbox' name='channels' value='"+info["channelName"]+"'> </td>";
					strHtml += "</tr>";
				});
				$("#channel_data").html(strHtml);
			});
			$("#channel_dialog").dialog('open');
		});
		
		$("#btn_query").click(function(){
			var beginDate = $("#beginDate").val() ? $("#beginDate").val() : "";
			var endDate = $("#endDate").val() ? $("#endDate").val() : "";
			if(beginDate == "") {
				$("#qv_msg").html("统计开始日期不能为空");
				$("#qv_dialog").dialog("open");
				return false;
			}
			if(endDate == "") {
				$("#qv_msg").html("统计结束日期不能为空");
				$("#qv_dialog").dialog("open");
				return false;
			}
			$("#queryFrm").attr("action",basePath+"dp/stat/gnAppLaunchNumDistributeView.action");
			$("#queryFrm").submit();
		});
		
		$("#btn_exportExcel").click(function(){
			var beginDate = $("#beginDate").val() ? $("#beginDate").val() : "";
			var endDate = $("#endDate").val() ? $("#endDate").val() : "";
			if(beginDate == "") {
				$("#qv_msg").html("统计开始日期不能为空");
				$("#qv_dialog").dialog("open");
				return false;
			}
			if(endDate == "") {
				$("#qv_msg").html("统计结束日期不能为空");
				$("#qv_dialog").dialog("open");
				return false;
			}
			$("#queryFrm").attr("action",basePath+"dp/stat/gnAppLaunchNumDistribute2Excel.action");
			$("#queryFrm").submit();
		});
	},
	initDialog : function() {
		var qv_dailogOpts = {
				autoOpen:false,  
		        title:'报表查询参数提示',  
		        width:500,
		        height:150, 
		        modal:true,
		        buttons: [{
		        	text:"确定",
		        	id:"qv_ok",
		        	style:"margin-right:200px;width:60px;",
		        	click:function(){
			            $(this).dialog('close');
		        	}
		        }]
		};
		
		$("#qv_dialog").dialog(qv_dailogOpts);
		
		var channel_dialogOpts = {
				autoOpen:false,  
		        title:'渠道列表',  
		        width:700,
		        height:500, 
		        modal:true,  
		        buttons: [{
		        	text:"确定",
		        	id:"channels_ok",
		        	style:"margin-right:90px;width:100px;",
		        	click:function(){
		        		var channelsArr = $("input:checkbox[name='channels']:checked");
		        		var channelNames = new Array();
		        		var channelNameStr = "";
		        		$.each(channelsArr, function(key,val){
		        			var arrVal = $(val).val();
		        			channelNames.push(arrVal);
		        			if(key < channelsArr.length-1) {
		        				channelNameStr += arrVal + " , ";
 		        			} else {
 		        				channelNameStr += arrVal;
		        			}
		        		});
		        		$("#channels").attr("value", channelNames);
			        	$("#channelNames").attr("value", channelNameStr);
			            $(this).dialog('close');
		        	}
		        },{
		        	text:"取消",
		        	id:"channels_cancel",
		        	style:"margin-right:190px;width:100px;",
		        	click:function(){
		        		$(this).dialog('close');
		        	}
		        }]
			};
				
		$("#channel_dialog").dialog(channel_dialogOpts);
	},
	renderChartData : function(flag,beginDate,endDate,appName,channels){
		$.post(basePath+"dp/stat/getGnAppLaunchNumDistributeByJSON.action", 
			{
				"flag": flag,
				"statParams['beginDate']": beginDate,
				"statParams['endDate']": endDate,
				"statParams['appName']": appName,
				"statParams['channels']": channels
			}, 
			function(data){
				var scheduledChart = null;
				if(!FusionCharts("pieChartId")) {
					scheduledChart = new FusionCharts( basePath+"template/FusionCharts/swf/Pie3D.swf", 
							"snapshotChartId", "100%", "450", "0" );
					scheduledChart.setChartData(data, "json");
					scheduledChart.render("chartContainer");
				} else {
					scheduledChart = FusionCharts("pieChartId");
					scheduledChart.setChartData(data, "json");
				}
			},'json');
	}
	
};