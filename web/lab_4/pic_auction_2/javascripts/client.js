var socket;
var current_user;
var current_params;
var parts = false;

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$(document).ready(()=>{
    socket = io.connect('http://localhost:3030');
    current_user = getCookie('username');
    socket.on("picture_id", (msg)=>{
        $("#request_button").removeAttr('disabled');
        $("#new_price_input").val(msg.start_price);
        current_params = msg;
        current_params.price = msg.start_price;
        parts = false;
    });
    socket.on("connect", () => {
        socket.json.emit("connected", {"name": current_user});
    });
    socket.on('start_auc_info', ()=>{
        if (parts) {
            $("#set_button").removeAttr('disabled');
            $("#new_price_input").removeAttr('disabled');
        }
        else{
            $("#request_button").attr('disabled', 'disabled');
        }
    });
    socket.on('user_stake_price', (info)=>{
        current_params.price = parseInt(info.price);
    });
    socket.on('stop_auc_info',(info)=>{
        $("#set_button").attr('disabled', 'disabled');
        $("#new_price_input").attr('disabled', 'disabled');
        if (current_user === info.pic["buyer"]) {
            $.ajax({
                url: '/users/setaq/' + info.pic["buyer"],
                method: 'PUT',
                data: {"name": info.pic["name"], "price": info.pic["sold_price"]}
            });
        }
    });
});

function participate(){
    parts = true;
    socket.json.emit('user_in', {"name": current_user});
    $("#request_button").attr('disabled', 'disabled');
}

function newPrice(){
    $.ajax({
        url: '/users/budget/' + current_user,
        method: 'GET',
        success: (budget)=>{
            let price = parseInt($('#new_price_input').val());
            if ((price >= parseInt(current_params.price) + parseInt(current_params.min_step)) &&
                (price <= parseInt(current_params.price) + parseInt(current_params.max_step)) && (budget.money >= price)){
                socket.json.emit('user_stake', {
                    "name": current_user,
                    "price": price
                });
            }
            else{
                $('#dial').dialog('open');
            }
        }
    });

}