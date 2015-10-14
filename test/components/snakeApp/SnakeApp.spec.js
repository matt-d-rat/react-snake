/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

const sd = require('skin-deep');
const SnakeApp = require('components/snakeApp/SnakeApp');
const Game = require('components/game/Game');

describe('SnakeApp Component', () => {
    let tree,
        instance,
        vdom;

    beforeEach(() => {
        tree = sd.shallowRender(React.createElement(SnakeApp, {}));
        instance = tree.getMountedInstance();
        vdom = tree.getRenderOutput();
    });

    afterEach(function(done) {
        React.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        done();
    });

    it('should render the SnakeApp component', (done) => {
        expect(vdom.type).to.equal('div');
        done();
    });
});
