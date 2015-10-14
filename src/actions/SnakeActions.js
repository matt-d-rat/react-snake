'use strict';

import Reflux from 'reflux';

let SnakeActions = Reflux.createActions({
    'createSnake': {
        sync: true
    },
    'changeDirection': {
        sync: true
    },
    'insert': {
        sync: true
    },
    'update': {
        sync: true
    }
});

export default SnakeActions;