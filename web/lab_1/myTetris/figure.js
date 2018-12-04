class Figure {
    constructor(arr, type, clr) {
        this.current = arr;
        this.rotated = "";
        this.type = type;
        this.x = 0;
        this.y = 0;
        this.color = clr;
    }

    rotate(){
        let cur = [];
        let newCur = [];
        while (this.current.length < 16){
            this.current += '0';
        }
        for (let i = 0; i < 16; i+=4){
            cur.push(this.current.substring(i, i+4).split(""));
        }
        if(this.type == 0){
            let i = 3, temp = 0;
            while (i > -1){
                temp = cur[2][i];
                cur[2][i] = cur[3-i][1];
                cur[3-i][1] = temp;
                i--;
            }
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++)
                    this.rotated += cur[x][y].toString();
            }
        }
        else if (this.type != 3){
            for (let y = 0; y < 3; y++) {
            newCur[y] = ["0" ,"0", "0", "0"];
            for (let x = 0; x < 3; x++)
                newCur[y][x] = cur[x][2-y];
            }
            newCur[3] = ["0" ,"0", "0", "0"];
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++)
                    this.rotated += newCur[x][y].toString();
            }
        }
        else{
            this.rotated = this.current;
        }
        return this.rotated;
    }

    save(){
        this.current = this.rotated;
        this.rotated = "";
    }

    rotateClean(){
        this.rotated = "";
    }

    makeMatr(){
        let res = [];
        if(this.rotated == ""){
            while (this.current.length < 16){
                this.current += '0';
            }
            for (let i = 0; i < 16; i+=4){
                res.push(this.current.substring(i, i+4).split(""));
            }
        }
        else{
            for (let i = 0; i < 16; i+=4){
                res.push(this.rotated.substring(i, i+4).split(""));
            }
        }
        return res;
    }

    static makeFigure(number) {
        switch (number) {
            case 0:
                return new Figure("000000001111", 0, "#FF4500");
            case 1:
                return new Figure("000011101", 1, "#000080");
            case 2:
                return new Figure("00001110001", 2, "#D2691E");
            case 3:
                return new Figure("0000110011", 3, "#FFD700");
            case 4:
                return new Figure("00001100011", 4, "#000000");
            case 5:
                return new Figure("0000011011", 5, "#556B2F");
            case 6:
                return new Figure("00000100111", 6, "#800000");
        }
    }
}