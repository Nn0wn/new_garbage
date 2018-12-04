let gallery;

function get_gallery() {
    $.get("/gallery", {parameters: "to", server: "side"})
        .done((data)=>{
            gallery = data;
            set_gallery(gallery)
        })
}

function set_gallery(gallery){
    let table = $('#gallery_table');
    for (let i = 0; i < gallery.length; i++){
        let row = $('<tr>').attr("scope", "row");
        let number = $('<th>').text(i);
        let name = $('<td>').text(gallery[i]["name"]);
        let author = $('<td>').text(gallery[i]["author"]);
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
        row.append(number).append(name).append(author).append(button);
        table.append(row);
    }
}

function show_info(i){
    $("#image_output").prop("src", gallery[i]["url"]).show();
    $("#name_input").val(gallery[i]["name"]);
    $("#url_input").val(gallery[i]["url"]);
    $("#author_input").val(gallery[i]["author"]);
    $("#description_input").text(gallery[i]["description"]);
    $("#price_input").val(gallery[i]["start_price"]);
    $("#min_step_input").val(gallery[i]["min_step"]);
    $("#max_step_input").val(gallery[i]["max_step"]);
    $("#forSaleCheckBox").prop('checked', gallery[i]["for_auction"]);
    $("#picture_info_title").text("Информация о картине: ");
    $("#picture_info_index").text(i.toString());
    $('#modal_content').width('1500');
    $('#right_content').addClass('w3-col s4 m4 l4');
    $("#picture_info").css('display', 'block');
}

function close_info() {
    $("#picture_info").css('display', 'none');
}

function show_add_image(){
    $("#image_output").prop("display", 'none').hide();
    $("#name_input").val("");
    $("#url_input").val("");
    $("#author_input").val("");
    $("#description_input").text("");
    $("#price_input").val(0);
    $("#min_step_input").val(0);
    $("#max_step_input").val(0);
    $("#picture_info_title").text("Добавить картину");
    $("#picture_info_index").text("");
    $('#modal_content').width('900');
    $('#form-container').width('900');
    $('#right_content').removeClass('w3-col s4 m4 l4');
    $("#picture_info").css('display', 'block');
}

function add_image(){
    let image = {};
    image.name = $("#name_input").val();
    image.url = $("#url_input").val();
    image.author = $("#author_input").val();
    image.description = $("#description_input").val();
    image.start_price = parseInt($("#price_input").val());
    image.min_step = parseInt($("#min_step_input").val());
    image.max_step = parseInt($("#max_step_input").val());
    image.for_auction = $("#forSaleCheckBox").is(":checked");
    let obj = {
        "img": image
    };
    let id = $("#picture_info_index").text();
    if (id !== "")
        obj.id = parseInt(id);
    else
        obj.id = -1;
    $.ajax({
        url: "/",
        method: "PUT",
        data: obj,
        success: () =>{
            location.reload();
        }
    })
}

function delete_image(){
    let id = $("#picture_info_index").text();
    $.ajax({
        url: "/" + id.toString(),
        method: "DELETE",
        success: () =>{
            location.reload();
        }
    })
}

get_gallery();