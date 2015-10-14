'use strict';

import Reflux from 'reflux';
import ScoreActions from 'actions/ScoreActions';

let ScoreStore = Reflux.createStore({
    listenables: [ScoreActions],

    init: function() {
        this.score = {
            currentScore: 0
        };
    },

    getInitialState: function() {
        return this.score;
    },

    onUpdateCurrentScore: function(points) {
        this.score.currentScore += points;
        this.trigger(this.score);
    },

    onResetCurrentScore: function() {
        this.score.currentScore = 0;
        this.trigger(this.score);
    }
});

export default ScoreStore;
