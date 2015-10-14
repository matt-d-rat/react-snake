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

    onCreateSnake: function(direction, xPos, yPos) {
        this.snake = {
            head: null,
            _queue: [],
            direction: direction,
            insert: function(xPos, yPos) {
                this._queue.unshift({ x: xPos, y: yPos });
                this.head = this._queue[0];
            },
            remove: function() {
                return this._queue.pop();
            }
        };

        
        this.snake.insert(xPos, yPos);

        console.log(this.snake, xPos, yPos)

        // console.log('onCreateSnake', this.snake);
        this.trigger(this.snake);
    },

    onChangeDirection: function(newDirection) {
        this.snake.direction = newDirection;

        // console.log('onChangeDirection', this.snake.direction);
        this.trigger( this.snake );
    }
});

export default SnakeStore;
