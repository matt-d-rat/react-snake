'use strict';

import Reflux from 'reflux';

let GameActions = Reflux.createActions({
    'createGrid': {
        asyncResult: false
    },
    'setPos': {
        asyncResult: false
    },
    'createFood': {
        asyncResult: false
    }
});

export default GameActions;