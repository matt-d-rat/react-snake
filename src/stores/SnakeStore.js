'use strict';

import Reflux from 'reflux';
import SnakeActions from 'actions/SnakeActions';

let SnakeStore = Reflux.createStore({
    listenables: [SnakeActions],

    init: function() {
        this.snake = {
            head: null,
            _queue: [],
            direction: null
        };
    },

    getInitialState: function() {
        return this.snake;
    },

    onCreateSnake: function(direction, xPos, yPos) {
        this.snake = {
            head: null,
            _queue: [],
            direction: direction
        };

        SnakeActions.insert(xPos, yPos);
        this.trigger(this.snake);
    },

    onInsert: function(xPos, yPos) {
        this.snake._queue.unshift({ x: xPos, y: yPos });
        this.snake.head = this.snake._queue[0];

        this.trigger(this.snake);
    },

    onUpdate: function(newSnake) {
        this.snake = newSnake;
        this.trigger(this.snake);
    },

    onChangeDirection: function(newDirection) {
        this.snake.direction = newDirection;
        this.trigger(this.snake);
    }
});

export default SnakeStore;
