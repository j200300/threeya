
var month_olympic = [31,29,31,30,31,30,31,31,30,31,30,31];
var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
var month_name = ["1","2","3","4","5","6","7","8","9","10","11","12"];

var curURL = location.href;
var url = new URL(curURL);
var showDate = url.searchParams.get("date");

var my_date = new Date();
if( showDate != null ) my_date = new Date(showDate);
var my_year = my_date.getFullYear();
var my_month = my_date.getMonth();
var my_day = my_date.getDate();

var monthData = null;

var holder = null;
var ctitle = null;
$(function(){
    holder = document.getElementById("days");
    var prev = document.getElementById("prev");
    var next = document.getElementById("next");
    ctitle = document.getElementById("calendar-title");

    $("#addBtn").click(function(){
        var date = "";
        if( typeof( $(".greenbox").data("date")) !="undefined" ){
            date = "&date="+$(".greenbox").data("date");
        }
        window.location = "edit.html?id=-1"+date;
    });
    prev.onclick = function(e){
        e.preventDefault();
        my_month--;
        if(my_month<0){
            my_year--;
            my_month = 11;
        }
        getData();
    }
    next.onclick = function(e){
        e.preventDefault();
        my_month++;
        if(my_month>11){
            my_year++;
            my_month = 0;
        }
        getData();
    }

    getData();
});

function getData(){
    $("#loadingmodal").modal('show');
    
    $.ajax({
        type: 'GET',
        url: 'https://threeya.azurewebsites.net/linebot/sheetapi/api_get.php?month='+my_year+"-"+(my_month+1),
        dataType: 'json',
        success: function(response){
            //如果有訂桌資料
            if(typeof(response['status']) == "undefined"){
                monthData = response;
            }
            creatCalendar();
            //點選月曆日期事件
            $("#days a").click(function(e){
                if( e.target.tagName == "A"){
                    var a = e.target;
                    $("#days a").attr("class","darkgrey");
                    a.classList = "green greenbox";
                    var date = e.target.dataset.date;
                    if( monthData != null ) adddaysList(date);
                }
            });
            
            $("#loadingmodal").modal('hide');
        }
     });
}
function showdel(){
    $('#delmodal').modal('show');
}
function adddaysList(date){
    $(".empty-datas").hide();
    $(".time-title").hide();
    $("#noonList").html('');
    $("#nightList").html('');
    $(".date-text").html(date);
    if( typeof(monthData[date]) != "undefined" ){
        data = monthData[date];
        
        $("#noonList").html('');
        if( data['noon'].length > 0 ){
            for( var i = 0; i < data['noon'].length; i++ ){
                $("#noonList").append( build_list_html(data['noon'][i]) );
            }
            
            $("#noonlabel").show();
            $(".empty-datas").hide();
        }
        
        $("#nightList").html('');
        if( data['night'].length > 0 ){
            for( var i = 0; i < data['night'].length; i++ ){
                $("#nightList").append( build_list_html(data['night'][i]) );
            }
            
            $("#nightlabel").show();
            $(".empty-datas").hide();
        }
    }else{
        $(".empty-datas").show();
    }
}

function build_list_html(data){
    let tables = new Array();
    if( data['table'] !=""){
        tables = data['table'].split(" ");
    }
    var cancelClass = "";
    var cancelbadgeClass= "";
    if( data['cancel'] == 1 ){
        cancelClass = "line-through";
        cancelbadgeClass = "line-through-badge";
    }

    let html = '';
        html += `
            <li class="list-group-item">
                <a href="edit.html?id=${data['id']}">
                    <div class="row no-gutters">
                        <div class="col-2 time ${cancelClass}">${data['time']}</div>
                        <div class="col-7">
                            <div class="tableNO">`
                            if(tables.length > 0){
                                for( var j = 0; j < tables.length; j++ ){
                                    html += `    <span class="badge badge-primary ${cancelbadgeClass}">${tables[j]}</span>`
                                }
                            }
                    html += `</div>
                            <div class="name ${cancelClass}">${data['name']}</div>
                            <div class="phone ${cancelClass}">${data['cellphone']}</div>
                        </div>
                        <div class="col-3 price ${cancelClass}">${data['price']}</div>
                    </div>`
                if( data['note'] != "" ){
                    html +=  `<div class="note ${cancelClass}">備註：${data['note']}</div>`
                }
        html += `</a>
        </li>`;
    
    return html;
}

//获取某年某月第一天是星期几
function dayStart(month, year) {
	var tmpDate = new Date(year, month, 1);
	return (tmpDate.getDay());
}

//计算某年是不是闰年，通过求年份除以4的余数即可
function daysMonth(month, year) {
	var tmp = year % 4;
	if (tmp == 0) {
		return (month_olympic[month]);
	} else {
		return (month_normal[month]);
	}
}

function creatCalendar(){
    $(".empty-datas").hide();
    $(".time-title").hide();
    $("#noonList").html('');
    $("#nightList").html('');

	var str = "";
	var totalDay = daysMonth(my_month, my_year); //获取该月总天数
	var firstDay = dayStart(my_month, my_year); //获取该月第一天是星期几
    var myclass;
	for(var i=1; i<firstDay; i++){ 
		str += "<li></li>"; //为起始日之前的日期创建空白节点
	}
	for(var i=1; i<=totalDay; i++){
		if((i<my_day && my_year==my_date.getFullYear() && my_month==my_date.getMonth()) || my_year<my_date.getFullYear() || ( my_year==my_date.getFullYear() && my_month<my_date.getMonth())){ 
			myclass = " class='lightgrey'"; //当该日期在今天之前时，以浅灰色字体显示
		}else if (i==my_day && my_year==my_date.getFullYear() && my_month==my_date.getMonth()){
            myclass = " class='green greenbox'"; //当天日期以绿色背景突出显示
            if( monthData != null ) adddaysList(my_year+"/"+(my_month+1)+"/"+my_day);
		}else{
			myclass = " class='darkgrey'"; //当该日期在今天之后时，以深灰字体显示
		}
		str += "<li><a"+myclass+" data-date="+my_year+"/"+month_name[my_month]+"/"+i+">"+i+"</a><i class='dot'></i></li>"; //创建日期节点
	}
	holder.innerHTML = str; //设置日期显示
    ctitle.innerHTML = my_year+"年"+month_name[my_month]+"月";
    
    //如果當日有資料顯示紅色底線
    if( monthData != null ){
        $(".body-list a").each(function( index ) {
            var date = $(this).data("date");
            for(key in monthData){
                if(key == date){
                    $(this).next().attr('style','display:block');
                }
            }
        });
    }
}