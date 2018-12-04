var darkLayer = null;
var modalWin = null;

function showModalWin() {
    darkLayer = document.createElement('div');
    darkLayer.id = 'shadow';
    document.body.appendChild(darkLayer);

    modalWin = document.getElementById('popupWin');
    modalWin.style.display = 'block';

    darkLayer.onclick = function () {
    darkLayer.parentNode.removeChild(darkLayer);
    modalWin.style.display = 'none';
    return false;
    }
}

function hide(){
    darkLayer.parentNode.removeChild(darkLayer);
    modalWin.style.display = 'none';
}

function saveName() {
    localStorage["tetris.username"] = document.getElementById("name").value;
}

document.getElementById('name').onkeypress=function(e){
    if(e.keyCode==13){
        event.preventDefault();
        document.getElementById('ok-btn').click();
    }
}