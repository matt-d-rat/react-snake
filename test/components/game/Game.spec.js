/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

// Import libraries
const React = require('react/addons');
const TestUtils = React.addons.TestUtils;
const sd = require('skin-deep');
const ReactCanvas = require('react-canvas');
const Surface = ReactCanvas.Surface;
const keycode = require('keycode');

// Import components
const Game = require('components/game/Game.js');

const DIRECTION_UP = 'UP';
const DIRECTION_DOWN = 'DOWN';
const DIRECTION_LEFT = 'LEFT';
const DIRECTION_RIGHT = 'RIGHT';

describe('Game Component', () => {
    let tree, 
        instance, 
        vdom,
        clock,
        component;

    beforeEach(() => {
        // Use renderIntoDocument instead of shallowRender because currently
        // componentDidMount lifecycle method does not fire as part of the shallowRender
        // @see https://github.com/facebook/react/issues/4056
        component = TestUtils.renderIntoDocument(<Game />);
    });

    afterEach((done) => {
        // Unmount the component from the document body
        React.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        
        done();
    });

    it('should create a new game area at the default size 600x600', () => {
        expect(component.props.cols).to.equal(40);
        expect(component.props.rows).to.equal(40);
        expect(component.props.tileSize).to.equal(15);
    });

    describe('Keyboard controls', () => {
        beforeEach(() => {
            // Reflux actions are async and tests are sync, so use a fake timer.
            clock = sinon.useFakeTimers();
        });

        afterEach((done) => {
            // Restore the timer
            clock.restore();
            done();
        });

        describe('AWSD keys', () => {
            it('should update the current direction to `LEFT` on a keydown event from the `a` key', (done) => {
                component.onKeyDown({key: 'a', keyCode: keycode('a'), which: keycode('a')});
                clock.tick(1);
                expect(component.state.currentDirection).to.equal(DIRECTION_LEFT);
                done();
            });

            it('should update the current direction to `UP` on a keydown event from the `w` key', (done) => {
                component.onKeyDown({key: 'w', keyCode: keycode('w'), which: keycode('w')});
                clock.tick(1);
                expect(component.state.currentDirection).to.equal(DIRECTION_UP);
                done();
            });

            it('should update the current direction to `DOWN` on a keydown event from the `s` key', (done) => {
                component.onKeyDown({key: 's', keyCode: keycode('s'), which: keycode('s')});
                clock.tick(1);
                expect(component.state.currentDirection).to.equal(DIRECTION_DOWN);
                done();
            });

            it('should update the current direction to `RIGHT` on a keydown event from the `d` key', (done) => {
                component.onKeyDown({key: 'd', keyCode: keycode('d'), shich: keycode('d')});
                clock.tick(1);
                expect(component.state.currentDirection).to.equal(DIRECTION_RIGHT);
                done();
            });
        });

        describe('Arrow keys', () => {
            it('should update the current direction to `LEFT` on a keydown event from the `left` key', (done) => {
                component.onKeyDown({key: 'a', keyCode: keycode('a'), which: keycode('a')});
                clock.tick(1);
                expect(component.state.currentDirection).to.equal(DIRECTION_LEFT);
                done();
            });

            it('should update the current direction to `UP` on a keydown event from the `up` key', (done) => {
                component.onKeyDown({key: 'w', keyCode: keycode('w'), which: keycode('w')});
                clock.tick(1);
                expect(component.state.currentDirection).to.equal(DIRECTION_UP);
                done();
            });

            it('should update the current direction to `DOWN` on a keydown event from the `down` key', (done) => {
                component.onKeyDown({key: 's', keyCode: keycode('s'), which: keycode('s')});
                clock.tick(1);
                expect(component.state.currentDirection).to.equal(DIRECTION_DOWN);
                done();
            });

            it('should update the current direction to `RIGHT` on a keydown event from the `right` key', (done) => {
                component.onKeyDown({key: 'd', keyCode: keycode('d'), shich: keycode('d')});
                clock.tick(1);
                expect(component.state.currentDirection).to.equal(DIRECTION_RIGHT);
                done();
            });
        });
    });

    it('should call move method every 4ms to maintain 60fps', () => {
        expect(false).to.equal(true);
    });

    it('should end the game if the snake collides with a wall', () => {
        expect(false).to.equal(true);
    });
});
