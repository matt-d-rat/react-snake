import React from 'react/addons';
import Game from 'components/game/Game';
import Score from 'components/score/Score';

import styles from './SnakeApp.scss';

class SnakeApp extends React.Component {
    render() {
        return (
            <div className={styles['nokia-3310']}>
                <div className={styles.screen}>
                    <Score />
                    <Game />
                </div>
            </div>
        );
    }
}

SnakeApp.defaultProps = {
};

export default SnakeApp;
