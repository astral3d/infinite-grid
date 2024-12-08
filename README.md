infinite-grid
============================
An abstraction for working within a continuous, infinite grid

Usage
-----

```js
import { InfiniteGrid, InfiniteGridMarker } from 'infinite-grid';

const grid = new InfiniteGrid({
    radius: 1,
    cellSize: 16,
    x: 5,
    y: 5
});
const avatar = new InfiniteGridMarker({});
await grid.cellsLoaded();
grid.setAvatar(avatar, { x:0, y:0, z:0 });
// change the position of the avatar to be outside the cell
avatar.position.x = 17;
avatar.position.y = 17;
// check if there is a transition in the current state
const transition = grid.checkForTransition();
// if so, recenter
if(transition){
    grid.offset.x += transition.x;
    grid.offset.y += transition.y;
}
// rearrange the submeshes for the new center
grid.transitionCells();
//fill in any missing submeshes once complete
grid.loadEmptyCells();
//wait for the filled submeshes load to be complete
await grid.cellsLoaded();
```

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser:

```bash
npm run browser-test
```
to run the same test headless in chrome:
```bash
npm run headless-browser-test
```

to run the same test inside docker:
```bash
npm run container-test
```

Run the commonjs tests against the `/dist` commonjs source (generated with the `build-commonjs` target).
```bash
npm run require-test
```

Development
-----------
All work is done in the .mjs files and will be transpiled on commit to commonjs and tested.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

