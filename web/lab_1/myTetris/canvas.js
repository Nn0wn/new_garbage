class Canvas {
    constructor(columns, rows, id) {
        this.cnv = document.getElementById(id);
        this.ctx = this.cnv.getContext('2d');
        this.columns = columns; this.rows = rows;
        let dpi = window.devicePixelRatio;
        let style_height = +getComputedStyle(this.cnv).getPropertyValue("height").slice(0, -2);
        let style_width = +getComputedStyle(this.cnv).getPropertyValue("width").slice(0, -2);
        this.cnv.setAttribute('height', style_height * dpi);
        this.cnv.setAttribute('width', style_width * dpi);
        this.width = this.cnv.width;
        this.height = this.cnv.height;
        this.blockWidth = Math.floor(this.width/this.columns);
        this.blockHeight = Math.floor(this.height/this.rows);
    }

    drawRect(column, row, color){
        let x1 = column*this.blockWidth;
        let y1 = row*this.blockHeight;
        let border = 3;
        this.ctx.fillStyle="#000000";
        this.ctx.fillRect(x1, y1, this.blockWidth + border, this.blockHeight + border);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x1 + border, y1 + border, this.blockWidth - border, this.blockHeight - border);
    }

    render(board, figure){
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (board) {
            for (let i = 0; i < this.columns; i++) {
                for (let j = 0; j < this.rows; j++) {
                    if (board[i][j])
                        this.drawRect(i, j, board[i][j]);
                }
            }
        }
        if (figure){
            let matr = figure.makeMatr();
            for (let i = 0; i < 4; i++){
                for (let j = 0; j < 4; j++){
                    if (matr[i][j] == 1)
                        this.drawRect(i + figure.x, j + figure.y, figure.color);
                }
            }
        }
    }
}
