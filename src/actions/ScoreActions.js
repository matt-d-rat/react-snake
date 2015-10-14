'use strict';

import Reflux from 'reflux';

let ScoreActions = Reflux.createActions({
    'updateCurrentScore': {
       sync: true
    },
    'resetCurrentScore': {
        sync: true
    },
    'addHighScore': {
        sync: true
    }
});

export default ScoreActions;