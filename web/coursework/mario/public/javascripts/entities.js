import {loadMario} from './entities/Mario.js';
import {loadMushroom} from './entities/Mushroom.js';


export function loadEntities() {
    const entityFactories = {};

    function addAs(name) {
        return factory => entityFactories[name] = factory;
    }


    return Promise.all([
        loadMario().then(addAs('mario')),
        loadMushroom().then(addAs('mushroom')),
    ])
    .then(() => entityFactories);
}