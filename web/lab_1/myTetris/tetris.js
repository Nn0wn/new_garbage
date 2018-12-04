var start = document.getElementById("start-btn");
var columns = 12, rows = 20;
var score = 0;
var record = 0;
var lines = 0;
var lines_level = 0;
var level = 0;
var board = [];
var figure = null;
var next_figure = null;
var canvas = null;
var next_canvas = null;
var render_interval = null;
var user_name = null;

function updateInfo(){
    user_name = localStorage["tetris.username"]
    document.getElementById("info").innerHTML = "Login: " + user_name +
        "<br> Lines: " + lines + "<br>Level: " + level + "<br>Score: " + score +
        "<br> Record: " + record;
}

function keyListener(event) {
    const keyName = event.key;
    switch (keyName) {
        case 'ArrowLeft':
            moveFigure(-1, 0);
            break;
        case 'ArrowRight':
            moveFigure(1, 0);
            break;
        case 'ArrowDown':
        case ' ':
            moveFigure(0, 1);
            break;
        case 'ArrowUp':
            rotateFigure();
            break;
    }
}

function newFigure() {
    let fig = next_figure;
    //next_figure = Figure.makeFigure(3);
    next_figure = Figure.makeFigure(Math.floor(Math.random() * 7));
    //next_figure.color = "#" + Math.random().toString(16).slice(2, 8);
    next_canvas.render(null, next_figure);
    if (!fig) {
    	//fig =  Figure.makeFigure(3);
        fig = Figure.makeFigure(Math.floor(Math.random() * 7));
        //fig.color = "#" + Math.random().toString(16).slice(2, 8);
    }
    fig.x = Math.floor(Math.floor(Math.random() * (columns - 3)));
    success = true;
    matr = fig.makeMatr();
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if ((matr[i][j] == 1)){
                success = success && !board[i + fig.x][j + fig.y];
            }
        }
    }
    if (!success){
        gameOver();
    }
    return fig;
}

function moveFigure(x, y) {
    move = true;
    matr = figure.makeMatr();
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if ((matr[i][j] == 1)){
                move = move && (figure.x + i + x >=0) && (figure.x + i + x < columns);
                move = move && (figure.y + j + y >=0) && (figure.y + j + y < rows);
                move = move && (!board[figure.x + i + x][figure.y + j + y]);
                if (!move)
                    break;
            }
        }
    }
    if (move){
        figure.x += x;
        figure.y += y;
    }
    if ((!move) && (x === 0) && (y === 1)){
        saveFigure();
        figure = newFigure();
    }
    updateAll();
}

function rotateFigure() {
    figure.rotate();
    matr = figure.makeMatr();
    rotate = true;
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if ((matr[i][j] == 1)){
                rotate = rotate && (figure.x + i >=0) && (figure.x + i < columns);
                rotate = rotate && (figure.y + j >=0) && (figure.y + j < rows);
                rotate = rotate && (!board[figure.x + i][figure.y + j]);
                if (!rotate)
                    break;
            }
        }
    }
    if (rotate)
        figure.save();
    else
        figure.rotateClean();
    updateAll();
}

function saveFigure() {
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if ((matr[i][j] == 1)){
                board[i + figure.x][j + figure.y] = figure.color;
            }
        }
    }
}

function stopRender(){
    if (render_interval)
            clearInterval(render_interval);
    document.removeEventListener('keydown', keyListener);
}

function startRender(speed){
    if (speed <= 0)
        speed = 100;
    if (render_interval)
        clearInterval(render_interval);
    render_interval = setInterval(() => {moveFigure(0, 1)}, speed);
}

function updateAll(){
    checkLines();
    updateInfo();
    canvas.render(board, figure);
}

function newGame(){
    for (let i=0; i<columns; i++){
        board[i] = [];
        for (let j=0; j<rows; j++){
            board[i][j] = 0;
        }
    }
    score = 0;
    level = 1;
    lines_level = 0;
    updateInfo();
    figure = newFigure();
    updateAll();
    startRender(1000 - level*100);
}

function checkLines() {
    remove = false;
    for (let i = 0; i < rows; i++) {
        remove_here = true;
        for (let j = 0; j < columns; j++) {
            remove_here = remove_here && board[j][i];
            if (!remove_here)
                break;
        }
        if (remove_here) {
            remove = true;
            for (let j = 0; j < columns; j++) {
                board[j].splice(i, 1);
                board[j].unshift(0);
            }
            break;
        }
    }
    if (remove) {
        lines++;
        lines_level++;
        score = score + level * 100;
        if (lines_level > 4){
            lines_level = 0;
            level++;
            startRender(1000/level);
        }
        if (record < score)
            record = score;
        checkLines();
    }
}

function resetRecords(){
    localStorage.removeItem("tetris.records");
}

function init(){
    canvas = new Canvas(columns, rows, "tetrisfield");
    next_canvas = new Canvas(4, 4, "nextfigure");
    document.addEventListener('keydown', keyListener);
    newGame();
}

function gameOver(){
    alert("Game over! Score: " + score);
    let records = localStorage["tetris.records"];
    if (!records)
        records = "Records\n";
    records = records + user_name + ": " + score + "\n";
    let recs = records.split("\n");
    let rec_list = [];
    for (i=1; i<recs.length-1; i++){
        let name = recs[i].split(": ")[0];
        let score = recs[i].split(": ")[1]
        rec_list.push({name, score});
    }
    rec_list.sort((a,b) => b.score - a.score);
    records = "Records\n";
    for (i = 0; i < rec_list.length && i < 10; i++){
        records = records + rec_list[i].name + ": " + rec_list[i].score + "\n";
    }
    localStorage["tetris.records"] = records;
    alert(records);
    stopRender();
}

