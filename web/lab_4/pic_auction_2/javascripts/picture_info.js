var info_t = 0;
var sell_t = 0;

$(document).ready(()=>{
    var countdown_timer = null;
    let socket = io.connect('http://localhost:3030');
    socket.on("picture_id", (info)=>{
        $.ajax({
            url: '/set/picture/' + info.id,
            method: 'GET',
            success: (picture)=>{
                $("#name_input_info").val(picture.name);
                $("#author_input_info").val(picture.author);
                $("#start_price_input_info").val(picture.start_price);
                $("#output_image").prop("src", picture.url);
                $("#name_input").val(picture.name);
                $("#author_input").val(picture.author);
                $("#descr_input").text(picture.description);
                $("#url_input").val(picture.url);
                $("#sprice_input").val(picture.start_price);
                $("#minstep_input").val(picture.min_step);
                $("#maxstep_input").val(picture.max_step);
                $("#for_input").prop('checked', picture.for_auction === 'true');
                //$("#buyer_input").val(picture.sold_price>0 ? picture.buyer : '-');
                //$("#sold_price_input").val(picture.sold_price);
                clearTimeout(countdown_timer);
                seconds = info_t;
                startTimer();
                countdown_timer = setInterval(startTimer, 300);
            }
        })
    });

    socket.on("start_auc_info", (info)=>{
        clearTimeout(countdown_timer);
        seconds = sell_t;
        startTimer();
        countdown_timer = setInterval(startTimer, 300);
    });
    socket.on("user_stake_price", (info)=>{
        $("#current_price_info").val(info.price);
    });
    getSettings();
});

function getSettings() {
    $.ajax({
        url: '/set/settings',
        method: 'GET',
        success: (settings)=>{
            info_t = (parseInt(settings.info_interval.slice(0,2))*60 +
                parseInt(settings.info_interval.slice(3,5)))*60;
            sell_t = (parseInt(settings.sell_timeout.slice(0,2))*60 +
                parseInt(settings.sell_timeout.slice(3,5)))*60;
        }
    })
}

var seconds = 0;

function startTimer(sec=-1){
    $("#timeout_info").val(seconds);
    if (seconds > 0)
        seconds--;
}