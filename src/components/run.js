require('./main.scss');

import React from 'react';
import Reflux from 'reflux';
import SnakeApp from 'snakeApp/SnakeApp';
import Q from 'Q';

// Swap out the promise library for Q
Reflux.setPromiseFactory(Q.Promise);

// Render the main component into the dom
React.render(<SnakeApp />, document.getElementById('app'));
