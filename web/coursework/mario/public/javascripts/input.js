import Keyboard from './KeyboardState.js';

export function setupKeyboard(mario) {
    const input = new Keyboard();

    input.addMapping('ArrowUp', keyState => {
        if (keyState) {
            mario.jump.start();
        } else {
            mario.jump.cancel();
        }
    });

    input.addMapping('Space', keyState => {
        mario.turbo(keyState);
    });

    input.addMapping('ArrowRight', keyState => {
        //mario.go.dir += keyState ? 1 : -1;
        if(keyState === 1)
            mario.go.dir = 1;
        else
            mario.go.dir = 0;
    });

    input.addMapping('ArrowLeft', keyState => {
        //mario.go.dir += keyState ? -1 : 1;
        if(keyState === 1)
            mario.go.dir = -1;
        else
            mario.go.dir = 0;
    });

    return input;
}
