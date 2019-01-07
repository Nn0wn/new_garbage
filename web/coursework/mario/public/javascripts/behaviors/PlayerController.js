import {Trait} from '../Entity.js';
import {Vec2} from '../math.js';
import {main, reload, gameOver} from '../main.js';

export default class PlayerController extends Trait {
    constructor(entityFactory, font, loadLevel, level,
                camera, playerEntity,  playerEnv, input, timer, canvas, level_num, time) {
        super('playerController');
        this.entityFactory= entityFactory;
        this.font = font;
        this.loadLevel = loadLevel;
        this.level = level;
        this.camera= camera;
        this.mario = playerEntity;
        this.playerEnv = playerEnv;
        if(!this.input)
            this.input = input;
        this.timer = timer;
        this.canvas = canvas;
        this.level_num = level_num;
        this.checkpoint = new Vec2(0, 0);
        this.player = null;
        this.time = time;
        this.flag = false;
        this.stop = false;
    }

    setPlayer(entity) {
        this.player = entity;
    }

    saveRecord(){
        let records = localStorage["game.records"];
        let username = localStorage["game.name"];
        if (!records)
            records = "Records\n";
        records = records + username + ": " + this.time + "\n";
        let recs = records.split("\n");
        let rec_list = [];
        for (let i=1; i<recs.length-1; i++){
            let name = recs[i].split(": ")[0];
            let score = recs[i].split(": ")[1]
            rec_list.push({name, score});
        }
        rec_list.sort((a,b) => a.score - b.score);
        records = "Records\n";
        for (let i = 0; i < rec_list.length && i < 10; i++){
            document.getElementById('info').innerHTML += "\t" + (i+1) + ')' + rec_list[i].name + ": " + rec_list[i].score + "\n" + "<br />";
            records = records + rec_list[i].name + ": " + rec_list[i].score + "\n";
        }
        localStorage["game.records"] = records;
        return true;
    }

    update(entity, deltaTime, level, timer) {
        if(this.stop === true)
            deltaTime = 0;
        if(this.mario){
            if(this.mario.pos.x > 900 && this.level_num === 1) {
                this.flag = false;
                this.level_num += 1;
                delete this.entityFactory;
                delete this.font;
                delete this.loadLevel;
                delete this.level;
                delete this.camera;
                delete this.mario;
                delete this.playerEnv;
                delete this.input;
                delete this.timer;
                //this.mario.dead = true;
                main(this.entityFactory, this.font, this.loadLevel, this.level,
                    this.camera, this.mario, this.playerEnv, this.input, this.timer, this.canvas, this.level_num, this.time)
            } else if(this.mario.pos.x > 900 && this.level_num === 2 && this.stop === false) {
                this.saveRecord();
                this.stop = true;
                delete this.level;
                this.mario.dead = true;
                gameOver(this.canvas);
                deltaTime = 0;
            }
        }
        if (this.level && !this.level.entities.has(this.player)) {
            if(this.flag === false) {
                this.player.killable.revive();
                this.flag = true;
            } else {
                reload(this.level, this.entityFactory, this.playerEnv);
                this.player.killable.revive();
            }
            this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
        } else {
            this.time += deltaTime * 100;
        }
    }
}
