'use strict';

import Reflux from 'reflux';

let GameActions = Reflux.createActions({
    'createGrid': ['completed', 'failed'],
    'setPos': ['completed', 'failed'],
    'createFood': ['completed', 'failed']
});

export default GameActions;