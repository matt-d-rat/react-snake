/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

// Import libraries
const React = require('react/addons');
const _ = require('lodash');
const TestUtils = React.addons.TestUtils;
const sd = require('skin-deep');
const ReactCanvas = require('react-canvas');
const Surface = ReactCanvas.Surface;
const keycode = require('keycode');

// Create an injector so we can overide the dependendies in Game component
const Game = require('components/game/Game');
const GameInjector = require('inject!components/game/Game');

const TILE_EMPTY = 0;
const TILE_SNAKE = 1;
const TILE_FOOD = 2;

const DIRECTION_UP = 'UP';
const DIRECTION_DOWN = 'DOWN';
const DIRECTION_LEFT = 'LEFT';
const DIRECTION_RIGHT = 'RIGHT';

describe('Game Component', () => {
    let GameWithInjectedDeps,
        component,
        clock,
        snakeActionsMock,
        gameActionsMock;

    before((done) => {
        // Mock out the actions
        snakeActionsMock = {
            createSnake: sinon.stub(),
            changeDirection: sinon.stub(),
            insert: sinon.stub(),
            update: sinon.stub()
        };

        gameActionsMock = {
            createGrid: sinon.stub(),
            setPos: sinon.stub(),
            createFood: sinon.stub()
        };

        GameWithInjectedDeps = GameInjector({
            'actions/GameActions': gameActionsMock,
            'actions/SnakeActions': snakeActionsMock
        });

        done();
    })

    beforeEach((done) => {
        // Stubs
        sinon.stub(Game.prototype, 'gameLoop');

        done();
    });

    afterEach((done) => {
        // Restore stubs
        Game.prototype.gameLoop.restore();

        // Unmount the component from the document body
        React.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        
        done();
    });

    describe('Initialisation', () => {
        beforeEach((done) => {
            // Spies
            sinon.spy(Game.prototype, 'start');
            sinon.spy(Game.prototype, 'init');

            // Stubs
            sinon.stub(Game.prototype, 'update');

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
            Game.prototype.update.restore();
            done();
        });

        it('should create a new game area at the default size', (done) => {
            let expectedWidth = component.props.cols * component.props.tileSize;
            let expectedHeight = component.props.rows * component.props.tileSize;

            expect(component._gameSurface.props.width).to.equal( expectedWidth );
            expect(component._gameSurface.props.height).to.equal( expectedHeight );

            expect(component._gameSurface.props.style.width).to.equal( expectedWidth / 2 );
            expect(component._gameSurface.props.style.height).to.equal( expectedHeight / 2 );

            expect(component.props.tileSize).to.equal(15);
            done();
        });

        it('should initalise the game and start', (done) => {
            Game.prototype.start.should.have.been.called;
            Game.prototype.init.should.have.been.called;
            Game.prototype.init.should.have.been.calledAfter(Game.prototype.start);
            done();
        });
    })

    describe('Keyboard controls', () => {
        beforeEach((done) => {
            // Spies
            sinon.spy(Game.prototype, 'start');
            sinon.spy(Game.prototype, 'init');

            // Stubs
            sinon.stub(Game.prototype, 'update');

            // Use mocked injected dependencies
            component = TestUtils.renderIntoDocument(<GameWithInjectedDeps />);
            done();
        });

        afterEach((done) => {
            // Restore spies
            Game.prototype.start.restore();
            Game.prototype.init.restore();

            // Restore stubs
            Game.prototype.update.restore();
            done();
        });

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

    describe('Gameplay', () => {
        let snakePosition = {x: 0, y: 0};
        let foodPosition =  {x: 1, y: 0};

        function resetGrid() {
            component.state.grid.forEach((row, xPos) => {
                row.forEach(function(col, yPos) {
                    component.state.grid[xPos][yPos] = TILE_EMPTY;
                });
            });
        }

        beforeEach((done) => {
            // Stubs
            sinon.stub(Game.prototype, 'start');

            // Spies
            sinon.spy(Game.prototype, 'didEatFood');
            sinon.spy(Game.prototype, 'didCollideWithWall');
            sinon.spy(Game.prototype, 'didCollideWithSnake');
            sinon.spy(Game.prototype, 'restart');

            // Use renderIntoDocument instead of shallowRender because currently
            // componentDidMount lifecycle method does not fire as part of the shallowRender
            // @see https://github.com/facebook/react/issues/4056
            component = TestUtils.renderIntoDocument(<Game cols={4} rows={1} tileSize={1} />);

            // Init the component then find the snake position and food position on the grid
            // Note: food position is always random
            component.init().then(() => {
                resetGrid();

                // Set the snake and food to a predetermined position for testing
                component.state.snake.head = snakePosition;
                component.state.grid[snakePosition.x][snakePosition.y] = TILE_EMPTY;
                component.state.grid[foodPosition.x][foodPosition.y] = TILE_FOOD;

                done();
            });
        });

        afterEach((done) => {
            component = undefined;

            // Restore stubs
            Game.prototype.start.restore();

            // Restore spies
            Game.prototype.didEatFood.restore();
            Game.prototype.didCollideWithWall.restore();
            Game.prototype.didCollideWithSnake.restore();
            Game.prototype.restart.restore();

            done();
        });

        it('should move the snake to the correct grid position based on it\'s current direction', (done) => {
            component.frames = 9; // Advance to the next frame (component.frames++ % FPS)
            component.update();

            expect(component.state.snake.direction).to.equal(DIRECTION_RIGHT)
            expect(component.state.snake.head.x).to.equal(snakePosition.x + 1);
            expect(component.state.snake.head.y).to.equal(snakePosition.y);

            done();
        });

        it('should detect when the snake \'eats\' food and increase the length of the snake by 1', (done) => {
            let beforeSnakeLength = component.state.snake._queue.length;

            // Advance to the next frame (component.frames++ % FPS)
            component.frames = 9;
            component.update();

            component.didEatFood.should.have.been.called;
            expect(component.didEatFood.returnValues[0]).to.equal(true);
            expect(component.state.snake._queue.length).to.equal(beforeSnakeLength + 1);

            done();
        });

        it('should detect when the snake collides with a wall and restart the game', (done) => {
            component.state.snake.direction = DIRECTION_UP;

            // Advance to the next frame (component.frames++ % FPS)
            component.frames = 9;
            component.update();

            component.didCollideWithWall.should.have.been.called;
            component.restart.should.have.been.called;
            done();
        });

        it('should detect when the snake collides with itself and restart the game', (done) => {
            // Snake is travelling right
            component.state.snake.direction = DIRECTION_RIGHT;

            // Advance to the next frame (component.frames++ % FPS)
            component.frames = 9;
            component.update();

            // Check the Snake has now eaten food and has a body length of 2
            expect(component.state.snake._queue.length).to.equal(2);

            // Change direction to back on itself
            component.state.snake.direction = DIRECTION_LEFT;

            // Advance to the next frame (component.frames++ % FPS)
            component.frames = 9;
            component.update();

            component.didCollideWithSnake.should.have.been.called;

            // Advance to the next frame (component.frames++ % FPS)
            component.frames = 9;
            component.update();

            component.restart.should.have.been.called;
            done();
        });
    });
});
