'use strict';

import Reflux from 'reflux';

let SnakeActions = Reflux.createActions({
    'createSnake': {
        asyncResult: false
    },
    'changeDirection': {
        asyncResult: true
    },
    'insert': {
        asyncResult: false
    },
    'update': {
        asyncResult: false
    }
});

export default SnakeActions;