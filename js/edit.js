const thisDate = new Date();
const thisyear = thisDate.getFullYear();
const thismonth = thisDate.getMonth();
const thisday = thisDate.getDate();

var curURL = location.href;
var url = new URL(curURL);
var id = url.searchParams.get("id");
var date = url.searchParams.get("date") || thisyear+"/"+(thismonth+1)+"/"+thisday;

getData(id);
$( function() {
    $('#date').datetimepicker({
        format: 'YYYY/M/D',
    });
    $('#time').datetimepicker({
        format: 'HH:mm',
    });

    if(id > 0){
        $(".navbar h1").html('修改訂席');
    }else{
        if(date!=""){
            $('#date').val(date);
            $('#time').val("12:00");
        }
    }

});
//點擊價格標籤
$(".price-group .badge").click(function(e){
    var value = $("#price").val();
    if( value != "" ){
        $("#price").val( value+e.target.innerText );
    }else{
        $("#price").val( e.target.innerText );
    }
    $("#price").focus();
});
//點擊桌位標籤
$(".table-group .badge").click(function(e){
    var value = $("#tableNo").val();
    if( value != "" ){
        $("#tableNo").val( value+' '+e.target.innerText );
    }else{
        $("#tableNo").val( e.target.innerText );
    }
    $("#tableNo").focus();
});
//點擊備註標籤
$(".note-group .badge").click(function(e){
    var value = $("#note").val();
    if( value != "" ){
        $("#note").val( value+' '+e.target.innerText );
    }else{
        $("#note").val( e.target.innerText );
    }
    $("#note").focus();
});
function getData(id){
    $.ajax({
        type: 'GET',
        url: 'https://threeya.azurewebsites.net/linebot/sheetapi/api_get.php?id='+id,
        dataType: 'json',
        success: function(data){
            if( id>0 ){
                $("#delBtn").attr('style','visibility:visible');
                $("#name").val(data['name']);
                $("#phone").val(data['cellphone']);
                $("#price").val(data['price']);
                $("#note").val(data['note']);
                $('#date').val(data['date']);
                $('#time').val(data['time']);
                var time = data['time'].split(":");

                //如果時間為15點以前為中午
                if( time[0] > 15 ){
                    $(".btn-group button").attr("class","btn btn-outline-primary");
                    $("#nightbtn").attr("class","btn btn-primary");
                }
                $('#tableNo').val(data['table']);
            }
        }
     });
}
function showdel(){
    $('#delmodal').modal('show');
}
$("#delBtn").click(showdel);
$("#delcomfrimBtn").click(function(){
    if(id > 0){
        $('#editmodal').on('show.bs.modal', function (e) {
            $("#editmodal_ok").attr("href", "index.html?date="+$("#date").val());
        })
        
        $.ajax({
            type: 'POST',
            url: 'https://threeya.azurewebsites.net/linebot/sheetapi/api_delete.php',
            data:{
                id:id,
            },
            dataType: 'json',
            success: function(data){
                $('#editmodal').modal('show');
            }
        });
    }
});

$(".btn-group button").click(function(e){
    $(".btn-group button").attr("class","btn btn-outline-primary");
    e.target.classList = "btn btn-primary";
    if( e.target.innerText == "中午"){
        $('#time').val("12:00");
    }else{
        $('#time').val("17:00");
    }
});
$("#editSave").click(function(){
    $(".name-error").hide();
    var name = $("#name").val();
    if( name == ""){
        $(".name-error").show();
        return;
    }
    //設定回首頁指定日期
    $('#editmodal').on('show.bs.modal', function (e) {
        $("#editmodal_ok").attr("href", "index.html?date="+$("#date").val());
    })
      
    var data = [
        $("#date").val(),
        $("#time").val(),
        $("#tableNo").val(),
        $("#name").val(),
        $("#price").val(),
        $("#phone").val(),
        $("#note").val(),
    ];

    if(id > 0){
        //修改
        $.ajax({
            type: 'POST',
            url: 'https://threeya.azurewebsites.net/linebot/sheetapi/api_modify.php',
            data:{
                id:id,
                newData:JSON.stringify(data)
            },
            dataType: 'json',
            success: function(data){
                $("#editmodal .modal-title").html('修改成功')
                $("#editmodal .modal-body").html('修改成功！');
                $('#editmodal').modal('show');
            }
        });
    }else{
        //新增
        $.ajax({
            type: 'POST',
            url: 'https://threeya.azurewebsites.net/linebot/sheetapi/api_add.php',
            data:{
                newData:JSON.stringify(data)
            },
            dataType: 'json',
            success: function(data){
                $('#editmodal').modal('show');
            }
        });  
    }
});