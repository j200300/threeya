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
//取消badge的a動作
$("form a").click(function(){
    event.preventDefault();
})
//點擊姓名標籤
$(".name-group .badge").click(function(e){
    var value = $("#name").val();
    if( value != "" ){
        $("#name").val( value+e.target.innerText );
    }else{
        $("#name").val( e.target.innerText );
    }
    $("#name").focus();
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

//取得資料
function getData(id){
    $("#loadingmodal").modal('show');
    $.ajax({
        type: 'GET',
        url: 'https://threeya.azurewebsites.net/linebot/sheetapi/api_get.php?id='+id,
        dataType: 'json',
        success: function(data){
            $("#loadingmodal").modal('hide');
            if( id>0 ){
                $(".modify-show").attr('style','visibility:visible');
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

                //如果狀態為取消將表單設為disabled
                if(data['cancel'] == 1){
                    recoverStatus();
                }
            }
        }
     });
}
//刪除確認
$("#delcomfrimBtn").click(function(){
    if(id > 0){
        $('#editmodal').on('show.bs.modal', function (e) {
            $("#editmodal_ok").attr("href", "index.html?date="+$("#date").val());
        })
        //處理中
        $("#delmodal").modal('hide');
        $("#loadingmodal").modal('show');        
        $.ajax({
            type: 'POST',
            url: 'https://threeya.azurewebsites.net/linebot/sheetapi/api_delete.php',
            data:{
                id:id,
            },
            dataType: 'json',
            success: function(data){
                $("#loadingmodal").modal('hide');
                $("#editmodal .modal-title").html('刪除成功')
                $("#editmodal .modal-body").html('刪除成功');
                $('#editmodal').modal('show');
            }
        });
    }
});

//取消確認
$("#cancelcomfrimBtn").click(function(){
    $("#cancelmodal").modal('hide');
    $("#loadingmodal").modal('show');
    if(id > 0){
        $.ajax({
            type: 'POST',
            url: 'https://threeya.azurewebsites.net/linebot/sheetapi/api_cancel.php',
            data:{
                id:id,
            },
            dataType: 'json',
            success: function(response){
                $("#loadingmodal").modal('hide');
                if(response.cancel == 1){
                    recoverStatus();
                }else{
                    cancelStatus();
                }
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
  
    $("#loadingmodal").modal('show');
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
                $("#loadingmodal").modal('hide');
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
                $("#loadingmodal").modal('hide');
                $('#editmodal').modal('show');
            }
        });  
    }
});

function cancelStatus(){
    $("#cancelBtn").html('取消');
    $("#cancelBtn").attr('class','modify-show btn btn-outline-danger');
    $("#cancelmodal").modal('hide');
    $("fieldset").prop("disabled",false);
    $("#date").prop("disabled",false);
    $("#time").prop("disabled",false);
    $("#noonbtn").prop("disabled",false);
    $("#nightbtn").prop("disabled",false);
    $(".edit form .badge").show();

   //把取消modal改為回覆modal
   $("#cancelmodal .modal-title").html("取消訂位確認");
   $("#cancelmodal .modal-body").html("如果此桌訂位取消，請點選確認！<br>取消後，資料將不能修改，但可以恢復訂位。");
}

function recoverStatus(){
    $("#cancelBtn").html('恢復');
    $("#cancelBtn").attr('class','modify-show btn btn-danger');
    $("#cancelmodal").modal('hide');
    $("fieldset").prop("disabled",true);
    $("#date").prop("disabled",true);
    $("#time").prop("disabled",true);
    $("#noonbtn").prop("disabled",true);
    $("#nightbtn").prop("disabled",true);
   $(".edit form .badge").hide();

   //把取消modal改為回覆modal
   $("#cancelmodal .modal-title").html("恢復訂桌確認");
   $("#cancelmodal .modal-body").html("是否恢復此筆訂桌？");
}