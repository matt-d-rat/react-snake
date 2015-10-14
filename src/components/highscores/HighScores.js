import React from 'react/addons';
import ReactMixin from 'react-mixin';
//import LocalStorageMixin from 'react-localstorage';

// Import stores
import ScoreStore from 'stores/ScoreStore';

import styles from './HighScores.scss';

class HighScores extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            highscores: []
        };
    }

    componentWillMount() {
        // Setup store listeners
        this.unsubscribeScoreStore = ScoreStore.listen( this.onUpdate.bind(this) );
    }

    componentWillUnmount() {
        // Unsubscribe the store listeners
        this.unsubscribeScoreStore();
    }

    onUpdate(newScore) {
        this.setState({
            highscores: newScore.highscores
        });
    }

    render() {
        let highscores = this.state.highscores.map(function(score) {
            return (
                <li>
                    <span className={styles['score-name']}>{score.name}</span>
                    <span className={styles['score-total']}>{score.total}</span>
                </li>
            )
        });

        return (
            <ol className={styles.list}>
                {highscores}    
            </ol>
        );
    }
}

HighScores.defaultProps = {};

// Plug in localstorage mixin
//ReactMixin.onClass(HighScores, LocalStorageMixin);

export default HighScores;
