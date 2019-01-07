import Entity, {Sides, Trait} from '../Entity.js';
import Killable from '../behaviors/Killable.js';
import Walking from '../behaviors/Walking.js';
import Physics from '../behaviors/Physics.js';
import Solid from '../behaviors/Solid.js';
import {loadSpriteSheet} from '../loaders.js';

export function loadMushroom() {
    return loadSpriteSheet('mushroom')
    .then(createMushroomFactory);
}


class Behavior extends Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        if (us.killable.dead) {
            return;
        }

        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                us.killable.kill();
                us.walking.speed = 0;
            } else {
                them.killable.kill();
            }
        }
    }
}


function createMushroomFactory(sprite) {
    const walkAnim = sprite.animations.get('walk');

    function routeAnim(mushroom) {
        if (mushroom.killable.dead) {
            return 'flat';
        }

        return walkAnim(mushroom.lifetime);
    }

    function drawMushroom(context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    }

    return function createMushroom() {
        const mushroom = new Entity();
        mushroom.size.set(16, 16);

        mushroom.addTrait(new Physics());
        mushroom.addTrait(new Solid());
        mushroom.addTrait(new Walking());
        mushroom.addTrait(new Behavior());
        mushroom.addTrait(new Killable(mushroom.pos));

        mushroom.draw = drawMushroom;

        return mushroom;
    };
}
