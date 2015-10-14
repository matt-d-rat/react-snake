'use strict';

import Reflux from 'reflux';

let ScoreActions = Reflux.createActions({
    'updateCurrentScore': {
        asyncResult: false
    },
    'resetCurrentScore': {
        asyncResult: false
    }
});

export default ScoreActions;