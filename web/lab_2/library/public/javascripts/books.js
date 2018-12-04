function saveBook(book_update_info){
    const xhttp = new XMLHttpRequest();
    const url = "/book";
    xhttp.open("PUT", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            res = JSON.parse(this.responseText);
            if (res.ok)
                window.open('/index', '_self');
            else
                showErrorDialog(res.message);
        }

    };
    const data = JSON.stringify(book_update_info);
    xhttp.send(data);
}

function deleteBook(id){
    const xhttp = new XMLHttpRequest();
    const url = "/book/" + id;
    xhttp.open("DELETE", url, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            res = JSON.parse(this.responseText);
            if (res.ok)
                window.open('/index', '_self');
            else
                showErrorDialog(res.message);
        }

    };
    xhttp.send(null);
}

function deleteReader(id_book, id_reader){
    const xhttp = new XMLHttpRequest();
    const url = "/book/" + id_book + "/" + id_reader;
    xhttp.open("DELETE", url, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            res = JSON.parse(this.responseText);
            if (res.ok)
                location.reload();
            else
                showErrorDialog(res.message);
        }

    };
    xhttp.send(null);
}

function addReader(id_book, reader){
    const xhttp = new XMLHttpRequest();
    const url = "book/" + id_book + "/reader";
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            res = JSON.parse(this.responseText);
            if (res.ok) {
                location.reload();
            }
            else{
                showErrorDialog(res.message);
            }
        }

    };
    let reader_info = {
        "id": id_book,
        "reader": reader
    };
    const data = JSON.stringify(reader_info);
    xhttp.send(data);
}