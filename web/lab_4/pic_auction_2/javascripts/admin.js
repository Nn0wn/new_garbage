var socket;
var _gallery;

$(document).ready(()=>{
    $.ajax({
        url: '/set/gallery',
        method: 'GET',
        success: (gallery)=>{
            let select =$("#pictures_select");
            _gallery = gallery;
            gallery.forEach((picture)=>{
                let option = $('<option>').val(picture._id).text(picture.name);
                if (picture.for_auction === 'true')
                    select.append(option);
            })
        }
    });
    socket = io.connect('http://localhost:3030');
    socket.on('start_auc_info', ()=>{
        $('#set_button').attr('disabled', 'disabled');
        $('#start_auc_button').attr('disabled', 'disabled');
        $('#info_pic_button').hide();
    });
    socket.on('stop_auc_info', (msg)=>{
        if (msg.pic["buyer"])
            $('#pictures_select option:selected').remove();
        $('#set_button').removeAttr('disabled');
        $("#pictures_select").removeAttr('disabled');
        $('#info_pic_button').show();
    });
    socket.on('gallery_changed', (gallery)=>{
        $.ajax({
            url: '/set',
            method: 'PUT',
            data: {"gal":gallery},
            success: (pictures)=>{console.log(pictures)}
        });
    });
});

function setPicture() {
    let select =  $('#pictures_select');
    let id = $('#pictures_select option:selected').val();

    $.ajax({
        url: '/set/settings',
        method: 'GET',
        success: (settings)=>{
            let info_t = (parseInt(settings.info_interval.slice(0, 2)) * 60 +
                parseInt(settings.info_interval.slice(3, 5))) * 60;
            let sell_t = (parseInt(settings.sell_timeout.slice(0, 2)) * 60 +
                parseInt(settings.sell_timeout.slice(3, 5))) * 60;
        }
    });


    socket.json.emit('picture_set', {"gallery": _gallery, "id": id, "info_t": info_t, "sell_t": sell_t});
    $('#start_auc_button').removeAttr('disabled');
    select.attr('disabled', 'disabled');
    $("#set_button").attr('disabled', 'disabled');
}

function startAuction(){
    let select =  $('#pictures_select');
    let id = select.val();
    socket.json.emit('start_auction', {"id": id});
}