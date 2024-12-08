/* global describe:false */
import { chai } from '@environment-safe/chai';
import { it } from '@open-automaton/moka';
import { InfiniteGrid, InfiniteGridMarker } from '../src/index.mjs';
const should = chai.should();

describe('infinite-grid', ()=>{
    describe('performs a simple test suite', ()=>{
        it('loads a 3x3 grid, an avatar and transitions in 3 new submeshes', async ()=>{
            const grid = new InfiniteGrid({
                radius: 1,
                cellSize: 16,
                x: 5,
                y: 5
            });
            const avatar = new InfiniteGridMarker({});
            await grid.cellsLoaded();
            grid.setAvatar(avatar, { x:0, y:0, z:0 });
            const cell = grid.cellAt(5, 6);
            should.exist(cell);
            const cell2 = grid.cellAt(4, 4);
            should.exist(cell2);
            avatar.position.x = 17;
            avatar.position.y = 17;
            const transition = grid.checkForTransition();
            if(transition){
                grid.offset.x += transition.x;
                grid.offset.y += transition.y;
            }
            grid.transitionCells();
            grid.loadEmptyCells();
            await grid.cellsLoaded();
        });
    });
});

