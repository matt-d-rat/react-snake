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

// Create an injector so we can overide the dependendies in Game component
let GameInjector = require('inject!components/game/Game');

const DIRECTION_UP = 'UP';
const DIRECTION_DOWN = 'DOWN';
const DIRECTION_LEFT = 'LEFT';
const DIRECTION_RIGHT = 'RIGHT';

describe('Game Component', () => {
    let Game,
        component,
        snakeActionsMock;

    before((done) => {
        snakeActionsMock = {
            createSnake: sinon.stub(),
            changeDirection: sinon.stub()
        }

        Game = GameInjector({
            'actions/SnakeActions': snakeActionsMock
        })

        done();
    })

    beforeEach((done) => {
        // Spies
        sinon.spy(Game.prototype, 'start');
        sinon.spy(Game.prototype, 'init');

        // Stubs
        sinon.stub(Game.prototype, 'gameLoop');

        // Use renderIntoDocument instead of shallowRender because currently
        // componentDidMount lifecycle method does not fire as part of the shallowRender
        // @see https://github.com/facebook/react/issues/4056
        component = TestUtils.renderIntoDocument(<Game />);

        done();
    });

    afterEach((done) => {
        // Restore spies
        Game.prototype.start.restore();
        Game.prototype.init.restore();

        // Restore stubs
        Game.prototype.gameLoop.restore();

        // Unmount the component from the document body
        React.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        
        done();
    });

    describe('Initialisation', () => {
        it('should create a new game area at the default size', () => {
            expect(component.props.cols).to.equal(22);
            expect(component.props.rows).to.equal(12);
            expect(component.props.tileSize).to.equal(15);
        });

        it('should initalise the game and start', () => {
            Game.prototype.start.should.have.been.called;
            Game.prototype.init.should.have.been.called;
            Game.prototype.init.should.have.been.calledAfter(Game.prototype.start);
        });
    })

    describe('Keyboard controls', () => {
        describe('AWSD keys', () => {
            it('should update the current direction to `LEFT` on a keydown event from the `a` key', (done) => {
                component.onKeyDown({key: 'a', keyCode: keycode('a'), which: keycode('a')});
                snakeActionsMock.changeDirection.should.have.been.calledWith(DIRECTION_LEFT)
                done();
            });

            it('should update the current direction to `UP` on a keydown event from the `w` key', (done) => {
                component.onKeyDown({key: 'w', keyCode: keycode('w'), which: keycode('w')});
                snakeActionsMock.changeDirection.should.have.been.calledWith(DIRECTION_UP)
                done();
            });

            it('should update the current direction to `DOWN` on a keydown event from the `s` key', (done) => {
                component.onKeyDown({key: 's', keyCode: keycode('s'), which: keycode('s')});
                snakeActionsMock.changeDirection.should.have.been.calledWith(DIRECTION_DOWN)
                done();
            });

            it('should update the current direction to `RIGHT` on a keydown event from the `d` key', (done) => {
                component.onKeyDown({key: 'd', keyCode: keycode('d'), which: keycode('d')});
                snakeActionsMock.changeDirection.should.have.been.calledWith(DIRECTION_RIGHT)
                done();
            });
        });

        describe('Arrow keys', () => {
            it('should update the current direction to `LEFT` on a keydown event from the `left` key', (done) => {
                component.onKeyDown({key: 'left', keyCode: keycode('left'), which: keycode('left')});
                snakeActionsMock.changeDirection.should.have.been.calledWith(DIRECTION_LEFT)
                done();
            });

            it('should update the current direction to `UP` on a keydown event from the `up` key', (done) => {
                component.onKeyDown({key: 'up', keyCode: keycode('up'), which: keycode('up')});
                snakeActionsMock.changeDirection.should.have.been.calledWith(DIRECTION_UP)
                done();
            });

            it('should update the current direction to `DOWN` on a keydown event from the `down` key', (done) => {
                component.onKeyDown({key: 'down', keyCode: keycode('down'), which: keycode('down')});
                snakeActionsMock.changeDirection.should.have.been.calledWith(DIRECTION_DOWN)
                done();
            });

            it('should update the current direction to `RIGHT` on a keydown event from the `right` key', (done) => {
                component.onKeyDown({key: 'right', keyCode: keycode('right'), which: keycode('right')});
                snakeActionsMock.changeDirection.should.have.been.calledWith(DIRECTION_RIGHT)
                done();
            });
        });
    });
});
