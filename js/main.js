
var month_olympic = [31,29,31,30,31,30,31,31,30,31,30,31];
var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
var month_name = ["1","2","3","4","5","6","7","8","9","10","11","12"];

var holder = document.getElementById("days");
var prev = document.getElementById("prev");
var next = document.getElementById("next");
var ctitle = document.getElementById("calendar-title");

var my_date = new Date();
var my_year = my_date.getFullYear();
var my_month = my_date.getMonth();
var my_day = my_date.getDate();

var monthData;
getData();
function getData(){
    $.ajax({
        type: 'GET',
        url: 'https://threeya.azurewebsites.net/linebot/sheetapi/api_get.php?month='+my_year+"-"+(my_month+1),
        dataType: 'json',
        success: function(data){
            if(data != null){
                monthData = data;
                creatCalendar();

                $(".body-list a").each(function( index ) {
                    var date = $(this).data("date");
                    for(key in monthData){
                        if(key == date){
                            $(this).next().attr('style','display:block');
                        }
                    }
                });
                var timeoutId = 0;

                $("#noonList a").on('mousedown', function() {
                    timeoutId = setTimeout(showdel, 2000);
                }).on('mouseup mouseleave', function() {
                    clearTimeout(timeoutId);
                });

                $("#days a").click(function(e){
                    if( e.target.tagName == "A"){
                        var a = e.target;
                        $("#days a").attr("class","darkgrey");
                        a.classList = "green greenbox";
                        var date = e.target.dataset.date;
                        adddaysList(date);
                    }
                });
            }
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

    if( typeof(monthData[date]) != "undefined" ){
        data = monthData[date];
        var html = '';

        if( data['noon'].length > 0 ){
            for( var i = 0; i < data['noon'].length; i++ ){
                var tables = new Array();
                if( data['noon'][i]['table'] !=""){
                     tables = data['noon'][i]['table'].split(".");
                }

                html += `
                <li class="list-group-item">
                    <a href="Edit.html?id=${data['noon'][i]['id']}">
                        <div class="row no-gutters">
                            <div class="col-2 time">${data['noon'][i]['time']}</div>
                            <div class="col-7">
                                <div class="tableNO">`
                                if(tables.length > 0){
                                    for( var j = 0; j < tables.length; j++ ){
                                        html += `    <span class="badge badge-primary">${tables[j]}</span>`
                                    }
                                }
                        html += `</div>
                                <div class="name">${data['noon'][i]['name']}</div>
                                <div class="phone">${data['noon'][i]['cellphone']}</div>
                            </div>
                            <div class="col-3 price">${data['noon'][i]['price']}</div>
                        </div>`
                if( data['noon'][i]['note'] != "" ){
                    html +=  `<div class="note">備註：${data['noon'][i]['note']}</div>`
                }       
                html += `    </a>
                </li>`;
            }
            $("#noonList").html(html);
            $("#noonlabel").show();
            $(".empty-datas").hide();
        }
        
        var html = '';
        if( data['night'].length > 0 ){
            for( var i = 0; i < data['night'].length; i++ ){
                var tables = new Array();
                if( data['night'][i]['table'] !=""){
                     tables = data['night'][i]['table'].split(".");
                }

                html += `
                <li class="list-group-item">
                    <a href="Edit.html?id=${data['night'][i]['id']}">
                        <div class="row no-gutters">
                            <div class="col-2 time">${data['night'][i]['time']}</div>
                            <div class="col-7">
                                <div class="tableNO">`
                                if(tables.length > 0){
                                    for( var j = 0; j < tables.length; j++ ){
                                        html += `    <span class="badge badge-primary">${tables[j]}</span>`
                                    }
                                }
                        html += `</div>
                                <div class="name">${data['night'][i]['name']}</div>
                                <div class="phone">${data['night'][i]['cellphone']}</div>
                            </div>
                            <div class="col-3 price">${data['night'][i]['price']}</div>
                        </div>`
                if( data['night'][i]['note'] != "" ){
                    html +=  `<div class="note">備註：${data['night'][i]['note']}</div>`
                }       
                html += `    </a>
                </li>`;
            }
            
            $("#nightList").html(html);
            $("#nightlabel").show();
            $(".empty-datas").hide();
        }
    }else{
        $(".empty-datas").show();
    }
}
$("#addBtn").click(function(){
    var date = "";
    if( typeof( $(".greenbox").data("date")) !="undefined" ){
        date = "&date="+$(".greenbox").data("date");
    }
    window.location = "edit.html?id=-1"+date;
})
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
            adddaysList(my_year+"/"+(my_month+1)+"/"+my_day);
		}else{
			myclass = " class='darkgrey'"; //当该日期在今天之后时，以深灰字体显示
		}
		str += "<li><a"+myclass+" data-date="+my_year+"/"+month_name[my_month]+"/"+i+">"+i+"</a><i class='dot'></i></li>"; //创建日期节点
	}
	holder.innerHTML = str; //设置日期显示
	ctitle.innerHTML = my_year+"年"+month_name[my_month]+"月";
}

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

