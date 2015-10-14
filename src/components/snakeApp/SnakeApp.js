import React from 'react/addons';
import Game from 'components/game/Game';

class SnakeApp extends React.Component {
    render() {
        return (
            <Game />
        );
    }
}

SnakeApp.defaultProps = {
};

export default SnakeApp;
