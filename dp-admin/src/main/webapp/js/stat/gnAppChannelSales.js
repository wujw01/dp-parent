$(function(){
//	var flag = $("#flag_h").val();
	var appName = $("#appName_h").val() ? $("#appName_h").val() : "";
	var channels = $("#channels_h").val() ? $("#channels_h").val() : "";
	var apkVersions = $("#apkVersions_h").val() ? $("#apkVersions_h").val() : "";
	var beginDate = $("#beginDate_h").val() ? $("#beginDate_h").val() : "";
	var endDate = $("#endDate_h").val() ? $("#endDate_h").val() : "";
	
	var params = "&statParams['appName']=" + appName + "&statParams['channels']=" + channels 
		+ "&statParams['apkVersions']=" + apkVersions
		+ "&statParams['beginDate']=" + beginDate + "&statParams['endDate']=" + endDate;
	
	actionManager.initDialog();
	actionManager.initLink(params);
	actionManager.initButton(params);
});

var actionManager = {
	initLink : function(params) {
		$.each($("a[name='navi_a']"), function(index, val){
			$(this).click(function(){
				var curPage = $(this).attr("relval");
				window.location.href = basePath+"dp/stat/gnAppChannelSalesView.action?page.currentPage=" + curPage + params;
			});
		});
	},
	initDialog : function(){
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
		
		var apkVersion_dialogOpts = {
				autoOpen:false,  
		        title:'App版本列表',  
		        width:700,
		        height:500, 
		        modal:true,  
		        buttons: [{
		        	text:"确定",
		        	id:"apkVersions_ok",
		        	style:"margin-right:90px;width:100px;",
		        	click:function(){
		        		var apkVersionsArr = $("input:checkbox[name='apkVersions']:checked");
		        		var apkVersions = new Array();
		        		var apkVersionsStr = "";
		        		$.each(apkVersionsArr, function(key,val){
		        			var arrVal = $(val).val();
		        			apkVersions.push(arrVal);
		        			if(key < apkVersionsArr.length-1) {
		        				apkVersionsStr += arrVal + " , ";
 		        			} else {
 		        				apkVersionsStr += arrVal;
		        			}
		        		});
		        		$("#apkVersions").attr("value", apkVersions);
			        	$("#apkVersionNames").attr("value", apkVersionsStr);
			            $(this).dialog('close');
		        	}
		        },{
		        	text:"取消",
		        	id:"apkVersions_cancel",
		        	style:"margin-right:190px;width:100px;",
		        	click:function(){
		        		$(this).dialog('close');
		        	}
		        }]
			};
				
		$("#apkVersion_dialog").dialog(apkVersion_dialogOpts);
	},
	initButton : function(params){
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
		
		$("#btn_apkVersions").click(function(){
			var apk_params = "?statParams['appName']=" + $("#appName option:selected").val();
			$.getJSON(basePath+"dp/stat/getApkVersionListByJSON.action" + apk_params, function(data,status,xhr){
				$("#apkVersion_data").empty();
				var strHtml = "";
				var count = 0;
				$.each(data, function(infoIndex, info){
					count++;
					strHtml += "<tr class='ui-widget-content'>";  
					strHtml += "<td class='mytd'>"+count+"</td>";
					strHtml += "<td class='mytd'>"+info['apkVersion']+"</td>";  
					strHtml += "<td class='mytd'> <input type='checkbox' name='apkVersions' value='"+info["apkVersion"]+"'> </td>";
					strHtml += "</tr>";
				});
				$("#apkVersion_data").html(strHtml);
			});
			$("#apkVersion_dialog").dialog('open');
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
			$("#queryFrm").attr("action",basePath+"dp/stat/gnAppChannelSalesView.action");
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
			$("#queryFrm").attr("action",basePath+"dp/stat/gnAppChannelSales2Excel.action");
			$("#queryFrm").submit();
		});
		
		var totalPage = parseInt($("#totalPage").val(), 10);
		$("#goPageBtn").click(function(){
			var page = parseInt($("#gotoPage").val(), 10);
			var url_pre = basePath+"dp/stat/gnAppChannelSalesView.action?page.currentPage=";
			if(page < 1) {
				window.location.href = url_pre + 1 + params;
			} else if(page > totalPage) {
				window.location.href = url_pre + totalPage + params;
			} else {
				window.location.href = url_pre + page + params;
			}
		});
	}
	
};