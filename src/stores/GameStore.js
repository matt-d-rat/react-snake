'use strict';

import Reflux from 'reflux';
import GameActions from 'actions/GameActions';
import _ from 'lodash';

const TILE_EMPTY = 0;
const TILE_SNAKE = 1;
const TILE_FOOD = 2;

let GameStore = Reflux.createStore({
    listenables: [GameActions],

    init: function() {
        this._grid = [];
    },

    /**
     * @param content {Number}, a number representing the cells content. 0 = empty, 1 = snake, 2 = food.
     * @param cols {Number} the number of cols in the grid
     * @param rows {Number} the number of rows in the grid
     */
    onCreateGrid: function(content, cols, rows) {
        this._grid = [];
        
        // Construct the grid co-ordinates
        for (var x = 0; x < cols; x++) {
            this._grid.push([]);

            for (var y = 0; y < rows; y++) {
                this._grid[x].push(content);
            }
        }

        //console.log('onCreateGrid', this._grid);
        this.trigger(this._grid);
    },

    onSetPos: function(value, xPos, yPos) {
        this._grid[xPos][yPos] = value;

        //console.log('onSetPos', value, xPos, yPos);
        this.trigger(this._grid);
    },

    onCreateFood: function(cols, rows, tileSize) {
        let gridWidth = cols * tileSize;
        let gridHeight = rows  * tileSize;
        let emptyGridPositions = [];

        this._grid.forEach(function(row, xPos) {

            row.forEach(function(value, yPos) {
                if(value === TILE_EMPTY) {
                    emptyGridPositions.push({
                        x: xPos,
                        y: yPos
                    });
                }
            })
        });

        let randomFoodPos = emptyGridPositions[Math.floor(Math.random() * emptyGridPositions.length)];

        //console.log('onCreateFood', randomFoodPos.x, randomFoodPos.y);
        GameActions.setPos(TILE_FOOD, randomFoodPos.x, randomFoodPos.y);
    }
});

export default GameStore;
