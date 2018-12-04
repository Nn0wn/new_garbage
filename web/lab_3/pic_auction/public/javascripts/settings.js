let settings;

function save_settings() {
    let settings = {};
    settings.date = $("#date_input").val();
    settings.time = $("#time_input").val();
    settings.sell_timeout = $("#sell_timeout_input").val();
    settings.info_interval = $("#info_interval_input").val();
    $.ajax({
        url: "/settings",
        method: "PUT",
        data: settings,
        success: () =>{
            location.reload();
        }
    })
}

function get_settings() {
    $.get("/settings_json", {parameters: "to", server: "side"})
        .done((data)=>{
            settings = data;
            set_settings(settings)
        })
}

function set_settings(settings) {
    $("#date_input").val(settings.date);
    $("#time_input").val(settings.time);
    $("#sell_timeout_input").val(settings.sell_timeout);
    $("#info_interval_input").val(settings.info_interval);
}

get_settings();
