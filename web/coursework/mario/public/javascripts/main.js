import Camera from './Camera.js';
import Entity from './Entity.js';
import PlayerController from './behaviors/PlayerController.js';
import Timer from './Timer.js';
import {createLevelLoader, reloadLevel} from './loaders/level.js';
import {loadFont} from './loaders/font.js';
import {loadEntities} from './entities.js';
import {setupKeyboard} from './input.js';
import {createCollisionLayer} from './layers/collision.js';
import {createDashboardLayer} from './layers/dashboard.js';
import SoundManager from './soundManager.js'

function createPlayerEnv(entityFactory, loadLevel, level, playerEntity, level_num, canvas, time) {
    playerEnv = new Entity();
    const playerControl = new PlayerController(entityFactory, font, loadLevel, level,
        camera, playerEntity,  playerEnv, input, timer, canvas, level_num, time);
    playerControl.checkpoint.set(16, 176);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    return playerEnv;
}

export async function main(entityFactory, font, loadLevel, level,
camera, mario,  playerEnv, input, timer, canvas, js_level, time) {
    const context = canvas.getContext('2d');

    // [entityFactory, font] = await Promise.all([
    //     loadEntities(),
    //     loadFont(),
    // ]);
    entityFactory = await loadEntities();

    font = await loadFont();

    loadLevel = await createLevelLoader(entityFactory);

    level = await loadLevel(js_level);

    camera = new Camera();

    mario = entityFactory.mario();

    if(!playerEnv)
        playerEnv = createPlayerEnv(entityFactory, loadLevel, level, mario, js_level, canvas, time);
    level.entities.add(playerEnv);


    // level.comp.layers.push(createCollisionLayer(level));
    level.comp.layers.push(createDashboardLayer(font, playerEnv));

    input = setupKeyboard(mario);
    input.listenTo(window);

    timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        level.update(deltaTime);

        camera.pos.x = Math.max(0, mario.pos.x - 100);

        level.comp.draw(context, camera);
    };

    timer.start();
}

function setSound() {
    let sounds= [];
    sounds.push("sounds/WarmInMeAndColdONYou.mp3");
    var sm = new SoundManager();
    sm.loadArray(sounds);
    setTimeout(sm.play("sounds/WarmInMeAndColdONYou.mp3", {looping:true, volume:0.02}), 1000);

}

export function gameOver() {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    // document.getElementById('info').innerHTML="";
    // for( let i=0; i<10; ++i) {
    //     let name = localStorage['game.records']
    //     document.getElementById('info').innerHTML += localStorage['game.records'];
    // }
    $("#record").css('display', 'block');
    //document.getElementById('game-over-overlay').style.display = 'block';
    //isGameOver = true;
}

export function reload(level, entityFactory, playerEnv) {
    level = reloadLevel(level, entityFactory, playerEnv);
}

const canvas = document.getElementById('screen');
var level_num = 1;
var entityFactory;
var font;
var loadLevel;
var level;
var camera;
var mario;
var playerEnv;
var input;
var timer;
var time = 0;
setSound();
main(entityFactory, font, loadLevel, level,
    camera, mario,  playerEnv, input, timer, canvas, level_num, time);
