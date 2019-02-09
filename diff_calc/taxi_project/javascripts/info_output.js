export function send_info(st_point, cost){
    let nm = $("#name").val();
    let tl = $("#tel").val();
    if(nm === ""){
        $('#notice_name').text("Введите имя").css('display', 'block');
        $("#name").addClass('input_error');
        return;
    }
    $('#name').removeClass('input_error');
    $('#notice_name').text("Введите номер телефона").css('display', 'none');
    if(tl === ""){
        $('#notice_tel').text("Введите номер телефона").css('display', 'block');
        $("#tel").addClass('input_error');
        return;
    }
    $('#tel').removeClass('input_error');
    $('#notice_tel').text("Введите номер телефона").css('display', 'block');
    let info = {};
    info.name = nm;
    info.tel = tl;
    info.start_point = st_point;
    info.dest_point = $("#dest_point").val();
    info.cost = cost;
    $.ajax({
        url: "/info",
        method: "PUT",
        data: info,
        success: () =>{
            location.reload();
        }
    })
}