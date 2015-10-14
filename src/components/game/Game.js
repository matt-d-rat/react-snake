'use strict';

// Import libraries
import React from 'react/addons';
import Q from 'Q';
import keycode from 'keycode';

// Import actions
import GameActions from 'actions/GameActions';
import SnakeActions from 'actions/SnakeActions';
import ScoreActions from 'actions/ScoreActions';

// Import stores
import GameStore from 'stores/GameStore';
import SnakeStore from 'stores/SnakeStore';

// Import styles
import styles from './Game.scss';

const TILE_EMPTY = 0;
const TILE_SNAKE = 1;
const TILE_FOOD = 2;

const DIRECTION_UP = 'UP';
const DIRECTION_DOWN = 'DOWN';
const DIRECTION_LEFT = 'LEFT';
const DIRECTION_RIGHT = 'RIGHT';

const FPS = 10;

let frames = 0;

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: [],
            score: 0,
            snake: {
                head: null,
                _queue: [],
                direction: null
            }
        };
    }

    componentWillMount() {
        // Setup store listeners
        this.unsubscribeGameStore = GameStore.listen( this.onGridUpdate.bind(this) );
        this.unsubscribeSnakeStore = SnakeStore.listen( this.onSnakeUpdate.bind(this) );
    }

    componentDidMount() {
        // Attach keyboard event listener to document
        document.body.addEventListener('keydown', this.onKeyDown.bind(this), false);

        this.start();
    }

    componentWillUnmount() {
        // Unsubscribe the store listeners
        this.unsubscribeGameStore();
        this.unsubscribeSnakeStore();

        // Detach the keyboard event listener from the document
        document.body.removeEventListener('keydown', this.onKeyDown.bind(this), false);
    }

    onSnakeUpdate(newSnake) {
        this.setState({
            snake: newSnake
        })
    }

    onGridUpdate(newGrid) {
        this.setState({
            grid: newGrid
        });
    }

    getValueFromGridPos(xPos, yPos) {
        return this.state.grid[xPos][yPos];
    }

    onKeyDown(e) {
        let newDirection = null;

        switch( keycode(e) ) {
            case 'a':
            case 'left':
                newDirection = DIRECTION_LEFT;
                break;

            case 'w':
            case 'up':
                newDirection = DIRECTION_UP;
                break;

            case 's':
            case 'down':
                newDirection = DIRECTION_DOWN;
                break;

            case 'd':
            case 'right':
                newDirection = DIRECTION_RIGHT;
                break;
        }

        // Check that the direction change is not invalid. If it is invalid return and do nothing.
        if( this.state.snake.direction === newDirection ) return;
        if( this.state.snake.direction === DIRECTION_LEFT && newDirection === DIRECTION_RIGHT) return;
        if( this.state.snake.direction === DIRECTION_RIGHT && newDirection === DIRECTION_LEFT) return;
        if( this.state.snake.direction === DIRECTION_UP && newDirection === DIRECTION_DOWN) return;
        if( this.state.snake.direction === DIRECTION_DOWN && newDirection === DIRECTION_UP) return;

        SnakeActions.changeDirection(newDirection);
    }

    didCollideWithWall(posX, posY) {
        let gridWidth = this.props.cols;
        let gridHeight = this.props.rows;

        return posX < 0 || posX > (gridWidth - 1) || posY < 0 || posY > (gridHeight - 1);
    }

    didCollideWithSnake(posX, posY) {
        return this.getValueFromGridPos(posX, posY) === TILE_SNAKE;
    }

    didEatFood(posX, posY) {
        return this.getValueFromGridPos(posX, posY) === TILE_FOOD; 
    }

    init() {
        this.clearCanvas();

        let snakePos = {
            x: 1,
            y: Math.floor(this.props.rows / 3)
        };       

        return Q.all([
            GameActions.createGrid(TILE_EMPTY, this.props.cols, this.props.rows),
            GameActions.setPos( TILE_SNAKE, snakePos.x, snakePos.y ),
            GameActions.createFood(this.props.cols, this.props.rows, this.props.tileSize),
            SnakeActions.createSnake(DIRECTION_RIGHT, snakePos.x, snakePos.y)
        ]).then(function(result) {
            this.requestId = this.gameLoop();
        }.bind(this));
    }

    start() {
        frames = 0;

        if (!this.requestId) {
            this.init();
        }
    }

    stop() {
        if (this.requestId) {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = undefined;
        }
    }

    restart() {
        ScoreActions.resetCurrentScore();
        this.stop();
        this.start();
    }

    gameLoop() {
        let node = React.findDOMNode(this._gameSurface);

        this.update();
        this.paint(node.getContext('2d'));

        this.requestId = window.requestAnimationFrame(this.gameLoop.bind(this), node);
    }

    update() {
        frames++;

        //console.log(this.state.snake.head);

        if(frames % FPS === 0) {
            // Index 0 is the head of the snake
            let moveX = this.state.snake.head.x;
            let moveY = this.state.snake.head.y;

            switch (this.state.snake.direction) {
                case DIRECTION_LEFT:
                    moveX--;
                    break;

                case DIRECTION_UP:
                    moveY--;
                    break;

                case DIRECTION_RIGHT:
                    moveX++;
                    break;

                case DIRECTION_DOWN:
                    moveY++;
                    break;
            }

            // Collision detection - Game Over
            if ( this.didCollideWithWall(moveX, moveY) || this.didCollideWithSnake(moveX, moveY) ) {
                this.restart();
            }
            // Continue
            else {
                if( this.didEatFood(moveX, moveY) ) {
                    ScoreActions.updateCurrentScore(1);
                    GameActions.createFood(this.props.cols, this.props.rows, this.props.tileSize);
                }
                else {
                    let tail = this.state.snake._queue.pop();

                    SnakeActions.update(this.state.snake);
                    GameActions.setPos(TILE_EMPTY, tail.x, tail.y);
                }

                GameActions.setPos(TILE_SNAKE, moveX, moveY);
                SnakeActions.insert(moveX, moveY);
            }
        }
    }

    clearCanvas() {
        let context = React.findDOMNode(this._gameSurface).getContext('2d');
        context.clearRect(0, 0, this.props.cols * this.props.tileSize, this.props.rows  * this.props.tileSize);
    }

    paint(context) {
        let that = this;

        // Draw the empty tiles, snake and food
        this.state.grid.forEach(function(row, xPos) {
            row.forEach(function(value, yPos) {
                switch( that.getValueFromGridPos(xPos, yPos) ) {
                    case TILE_EMPTY:
                        that.paintEmpty(context, xPos, yPos);
                        break;
                    case TILE_SNAKE:
                        that.paintSnake(context, xPos, yPos);
                        break;
                    case TILE_FOOD:
                        that.paintFood(context, xPos, yPos);
                        break;
                }
            })
        });
    }

    paintEmpty(context, xPos, yPos) {
        context.fillStyle = "#bfc800";
        context.fillRect(xPos * this.props.tileSize, yPos * this.props.tileSize, this.props.tileSize, this.props.tileSize);
    }

    paintSnake(context, xPos, yPos) {
        context.fillStyle = "#656d00";
        context.fillRect(xPos * this.props.tileSize, yPos * this.props.tileSize, this.props.tileSize, this.props.tileSize);
    }

    paintFood(context, xPos, yPos) {
        context.fillStyle = "#656d00";
        context.beginPath();

        let radius = this.props.tileSize / 2;
        let nx = xPos * this.props.tileSize + radius;
        let ny = yPos * this.props.tileSize + radius;
        
        context.arc(nx, ny, radius, 0, Math.PI * 2, true);
        context.fill();
    }

    render() {
        let canvasWidth = this.props.cols * this.props.tileSize;
        let canvasHeight = this.props.rows  * this.props.tileSize;

        let sizingStyle = {
            width: canvasWidth / 2,
            height: canvasHeight / 2
        };

        return (
            <canvas ref={(c) => this._gameSurface = c} 
                    className={styles.surface}
                    style={sizingStyle}
                    width={canvasWidth} 
                    height={canvasHeight} />
        );
    }
}

// Uncomment properties you need
// Game.propTypes = {};
Game.defaultProps = {
    cols: 22,
    rows: 12,
    tileSize: 15
};

export default Game;
