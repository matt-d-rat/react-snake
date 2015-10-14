'use strict';

import Reflux from 'reflux';

let GameActions = Reflux.createActions({
    'createGrid': {
        sync: true
    },
    'setPos': {
        sync: true
    },
    'createFood': {
        sync: true
    }
});

export default GameActions;