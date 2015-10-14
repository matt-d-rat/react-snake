'use strict';

// Import libraries
import React from 'react/addons';
import Q from 'Q';
import {Surface} from 'react-canvas';
import keycode from 'keycode';

// Import actions
import GameActions from 'actions/GameActions';
import SnakeActions from 'actions/SnakeActions';

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

const FPS = 5;

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: [],
            score: 0,
            snake: null
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

    componentDidUpdate() {
        //this.clearCanvas();
    }

    onSnakeUpdate(newSnake) {
        // console.log('onSnakeUpdate', newSnake)
        this.setState({
            snake: newSnake
        })
    }

    onGridUpdate(newGrid) {
        // console.log('onGridUpdate', newGrid)
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

        Q.all([
            GameActions.createGrid(TILE_EMPTY, this.props.cols, this.props.rows),
            SnakeActions.createSnake(DIRECTION_RIGHT, snakePos.x, snakePos.y),
            GameActions.setPos( TILE_SNAKE, snakePos.x, snakePos.y ),
            GameActions.createFood(this.props.cols, this.props.rows, this.props.tileSize)
        ]).then(function(result) {
            this.requestId = this.gameLoop();
        }.bind(this));
    }

    start() {
        this.frames = 0;

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
        this.stop();
        this.start();
    }

    gameLoop() {
        this.update();
        
        let node = React.findDOMNode(this._gameSurface);
        this.paint(React.findDOMNode(this._gameSurface).getContext('2d'));

        this.requestId = window.requestAnimationFrame(this.gameLoop.bind(this), React.findDOMNode(this._gameSurface));
    }

    update() {
        this.frames++;

        //console.log(this.state.snake.head);

        if(this.frames % FPS === 0 && this.requestId) {
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

            // Check if snake has colided with a wall or itself
            if ( this.didCollideWithWall(moveX, moveY) || this.didCollideWithSnake(moveX, moveY) ) {
                this.restart();
            }
            
            if( this.didEatFood(moveX, moveY) ) {
                // update score here
                GameActions.createFood(this.props.cols, this.props.rows, this.props.tileSize);
            } else {
                let tail = this.state.snake.remove();
                GameActions.setPos(TILE_EMPTY, tail.x, tail.y);
            }

                GameActions.setPos(TILE_SNAKE, moveX, moveY);
                this.state.snake.insert(moveX, moveY);
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
        context.fillStyle = "#ccc";
        context.fillRect(xPos * this.props.tileSize, yPos * this.props.tileSize, this.props.tileSize, this.props.tileSize);
    }

    paintSnake(context, xPos, yPos) {
        context.fillStyle = "blue";
        context.strokeStyle = "white";
        context.fillRect(xPos * this.props.tileSize, yPos * this.props.tileSize, this.props.tileSize, this.props.tileSize);
        context.strokeRect(xPos * this.props.tileSize, yPos * this.props.tileSize, this.props.tileSize, this.props.tileSize);
    }

    paintFood(context, xPos, yPos) {
        context.fillStyle = "#0a0";
        context.beginPath();

        let radius = this.props.tileSize / 2;
        let nx = xPos * this.props.tileSize + radius;
        let ny = yPos * this.props.tileSize + radius;
        
        context.arc(nx, ny, radius, 0, Math.PI * 2, true);
        context.fill();
    }

    render() {
        return (
            <canvas ref={(c) => this._gameSurface = c} 
                    className={styles.surface}
                    width={this.props.cols * this.props.tileSize} 
                    height={this.props.rows  * this.props.tileSize} />
        );
    }
}

// Uncomment properties you need
// Game.propTypes = {};
Game.defaultProps = {
    cols: 40,
    rows: 40,
    tileSize: 15
};

export default Game;
