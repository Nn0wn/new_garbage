$(document).ready(get_users(undefined));

socket = io.connect('http://localhost:3030');
socket.on('user_here', (msg)=> {
   get_users(msg);
});

function get_users(msg) {
    if (msg) {
        $.ajax({
            url: '/users/' + msg.name,
            method: 'PUT',
            success: (members) => {
                let table = $('#user_table').empty();
                for (let member of members) {
                    let row = $('<tr>').attr("scope", "row");
                    let name = $('<td>').text(member.name);
                    let money = $('<th>').text(member.money + '$');
                    let button = $('<td>').append(
                        $('<button>').addClass("w3-btn").addClass("w3-black").text("Show aquisitions")
                            .attr("onclick", "show_info('" + member.name + "')"));

                    row.append(name).append(money).append(button);
                    table.append(row);
                }
            }
        });
    }
    else{
        $.ajax({
            url: '/users/',
            method: 'GET',
            success: (members) => {
                let table = $('#user_table').empty();
                for (let member of members) {
                    let row = $('<tr>').attr("scope", "row");
                    let name = $('<td>').text(member.name);
                    let money = $('<th>').text(member.money + '$');
                    let button = $('<td>').append(
                        $('<button>').addClass("w3-btn").addClass("w3-black").text("Show aquisitions")
                            .attr("onclick", "show_info('" + member.name + "')"));

                    row.append(name).append(money).append(button);
                    table.append(row);
                }
            }
        });
    }
}

function show_info(name) {
    $.ajax({
        url: '/users/' + name,
        method: 'GET',
        success: (member) => {
            $('#aqu').empty();
            for (let paint of member.Aquisitions)
                $('#aqu').append("<p>" + '"' +paint.name + '"' + " for " + paint.price + "$" + "</p>");

            $('#umodal').show();
        }
    });
}