'use strict';

import Reflux from 'reflux';

let SnakeActions = Reflux.createActions({
    'createSnake': ['completed', 'failed'],
    'changeDirection': ['completed', 'failed']
});

export default SnakeActions;