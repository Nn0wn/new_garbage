let contacts;

function get_contacts() {
    $.get("/contacts", {parameters: "to", server: "side"})
        .done((data)=>{
            contacts = data;
            set_contacts(contacts);
        })
}

function set_contacts(contacts) {
    let table = $('#contacts_table');
    for (let i = 0; i < contacts.length; i++){
        let row = $('<tr>').attr("scope", "row");
        let name = $('<td>').text(contacts[i]["name"]);
        let surname = $('<td>').text(contacts[i]["surname"]);
        let phone = $('<td>').text(contacts[i]["phone"]);
        let button;
        if(i%2 === 1){
            button = $('<td>').append(
                $('<button>').addClass("w3-button").addClass("w3-red").addClass("w3-hover-white")
                    .addClass("w3-border").addClass("w3-border-black").text("Информация")
                    .attr("onclick", "show_info(" + i + ")")
            );
        }
        else{
            button = $('<td>').append(
                $('<button>').addClass("w3-button").addClass("w3-red").addClass("w3-hover-light-grey")
                    .addClass("w3-border").addClass("w3-border-black").text("Информация")
                    .attr("onclick", "show_info(" + i + ")")
            );
        }
        row.append(name).append(surname).append(phone).append(button);
        table.append(row);
    }
}

function show_info(i){
    $("#name_input").val(contacts[i]["name"]);
    $("#surname_input").val(contacts[i]["surname"]);
    $("#phone_input").val(contacts[i]["phone"]);
    $("#contact_info_title").text("Информация о контакте: ");
    $("#contact_info_index").text(i.toString());
    $("#contact_info").css('display', 'block');
}

function close_info() {
    $("#contact_info").css('display', 'none');
}

function show_add_member(){
    $("#name_input").val("");
    $("#surname_input").val("");
    $("#phone_input").val("");
    $("#contact_info_title").text("Добавить контакт");
    $("#contact_info_index").text("");
    $("#contact_info").css('display', 'block');
}

function add_member(){
    let member = {};
    member.name = $("#name_input").val();
    member.surname = $("#surname_input").val();
    member.phone = $("#phone_input").val();
    let obj = {
        "member": member
    };
    let id = $("#contact_info_index").text();
    if (id !== "")
        obj.id = parseInt(id);
    else
        obj.id = -1;
    $.ajax({
        url: "/members",
        method: "PUT",
        data: obj,
        success: () =>{
            location.reload();
        }
    })
}

function delete_member(){
    let id = $("#contact_info_index").text();
    $.ajax({
        url: "/members/" + id,
        method: "DELETE",
        success: () =>{
            location.reload();
        }
    })
}

get_contacts();