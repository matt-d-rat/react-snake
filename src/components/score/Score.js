import React from 'react/addons';

// Import stores
import ScoreStore from 'stores/ScoreStore';

import styles from './Score.scss';

class Score extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            score: {
                currentScore: 0
            }
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
            score: newScore
        });
    }

    render() {
        return (
            <div className={styles.container}>
                <span className={styles['current-score']}>{this.state.score.currentScore}</span>
            </div>
        );
    }
}

Score.defaultProps = {
};

export default Score;
