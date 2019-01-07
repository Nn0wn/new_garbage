//@flow


let info_t;
let sell_t;
let auc_timeout;
let current_picture;
let current_picture_id;
let current_stake;
let cur_price;
let _gallery;

function startSocketServer() {
    const io = require('socket.io').listen(3030);
    console.log("Socket started at http://localhost:3030");
    io.sockets.on('connection', (socket)=>{
        socket.on('connected', (msg)=>{
            socket.name = msg.name;
            socket.broadcast.json.emit('user_here', {"name": msg.name});
            send(socket, 'joined', `${msg.name} joined or reconnected`);
        });

        socket.on('picture_set', (msg)=>{
            setPictureParams(msg);
        });

        socket.on('start_auction', (msg)=>{
            clearTimeout(auc_timeout);
            startAuc();
        });

        socket.on('user_in', (msg)=>{
            send(socket, 'user_in_info', `${msg.name} is bidding`)
        });

        socket.on('user_stake', (msg)=>{
            cur_price = msg.price;
            current_picture.buyer = msg.name;
            current_picture.sold_price = cur_price;
            send(socket, 'user_stake_info', `${msg.name} raised price to ${msg.price}$`);
            socket.broadcast.json.emit('user_stake_price', msg);
            socket.json.emit('user_stake_price', msg);
        });


        function startAuc(){
            current_stake = "";
            send(socket, 'start_auc_info', `Auction started. Picture: "${current_picture.name}"`);
            setTimeout(stopAuc, sell_t * 300);
        }


        function stopAuc(){
            let msg = `Auction finished. Picture: "${current_picture.name}".`;
            current_picture.for_auction = 'false';
            if (current_picture.buyer) {
                msg = msg + ` Winner - ${current_picture.buyer}, price - ${current_picture.sold_price}$`;
                _gallery[current_picture._id] = current_picture;
            }
            else {
                msg = msg + ` Noone bought the picture`;
            }
            send(socket, 'stop_auc', msg);
            socket.json.emit('stop_auc_info', {"id": current_picture_id, "pic": current_picture});
            socket.broadcast.json.emit('stop_auc_info', {"id": current_picture_id, "pic": current_picture});
            socket.json.emit('gallery_changed', _gallery);
            socket.broadcast.json.emit('gallery_changed', _gallery);
        }

        function setPictureParams(pic) {
            current_picture = pic.gallery[pic.id];
            current_picture_id = pic.id;
            _gallery = pic.gallery;
            send(socket, 'picture_init', `Picture "${current_picture.name}" put up for auction`);
            socket.broadcast.json.emit('picture_id', {
                "id": pic.id,
                "start_price": _gallery[pic.id].start_price,
                "min_step": _gallery[pic.id].min_step,
                "max_step": _gallery[pic.id].max_step
            });

        info_t = pic.info_t;
        sell_t = pic.sell_t;
        auc_timeout = setTimeout(() => {
            startAuc()
        }, info_t * 1000)

        }
    })
}

function send(socket, type, msg){
    console.log(`Message: ${type} - ${msg}`);
    let time = (new Date()).toLocaleTimeString();
    let obj = {
        "time": time,
        "message": msg
    };
    socket.json.emit(type, obj);
    socket.broadcast.json.emit(type, obj);
}

module.exports = { startSocketServer };