"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfiniteGridMarker = exports.InfiniteGridCell = exports.InfiniteGrid = void 0;
/*
import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
//*/

/**
 * A JSON object
 * @typedef { object } JSON
 */

// this allows a fixed tile window to slide around an infinite cellular world
class InfiniteGrid {
  constructor(options = {}) {
    this.options = options;
    this.size = {
      x: options.cellWidth || options.cellSize,
      y: options.cellHeight || options.cellSize
    };
    this.cellRadius = options.radius || 1;
    this.cells = [];
    this.offset = {
      x: options.x,
      y: options.y
    };
    this.recomputeLL();
    //batch until flushed
    this.markers = [];
    this.addedMarkers = [];
    this.markerRemovals = [];
    this.initialize();
  }
  recomputeLL() {
    this.ll = {
      x: this.offset.x - this.cellRadius,
      y: this.offset.y - this.cellRadius
    };
    this.ur = {
      x: this.offset.x + this.cellRadius,
      y: this.offset.y + this.cellRadius
    };
    this.coordinateLL = {
      x: this.ll.x * this.size.x,
      y: this.ll.y * this.size.y
    };
    this.bounds = [this.ll.x, this.ur.y, this.ur.x, this.ll.y];
    this.centerCoordinateBounds = [0, this.size.y, this.size.x, 0];
    this.coordinateBounds = [this.ll.x * this.size.x, this.ur.y * this.size.y, this.ur.x * this.size.x, this.ll.y * this.size.y];
  }
  initialize() {
    this.cells = [];
    this.loadEmptyCells();
  }
  loadEmptyCells() {
    let index = 0;
    for (let row = -1 * this.cellRadius; row <= this.cellRadius; row++) {
      for (let col = -1 * this.cellRadius; col <= this.cellRadius; col++) {
        if (!this.cells[index]) {
          this.cells[index] = new InfiniteGridCell({
            x: this.offset.x + row,
            y: this.offset.y + col
          });
        }
        index++;
      }
    }
  }
  transitionCells() {
    let cell = null;
    const oldCells = this.cells;
    this.cells = [];
    let index = 0;
    for (let row = -1 * this.cellRadius; row <= this.cellRadius; row++) {
      for (let col = -1 * this.cellRadius; col <= this.cellRadius; col++) {
        cell = oldCells.find(cell => {
          return cell.options.x === row + this.offset.x && cell.options.y === col + this.offset.y;
        });
        if (cell) {
          this.cells[index] = cell;
        }
        index++;
      }
    }
  }
  async cellsLoaded() {
    const readys = this.cells.map(cell => {
      return cell.ready;
    });
    await Promise.all(readys);
  }

  // set a particular marker to be tracked by the treadmill
  setAvatar(marker, position) {
    this.avatar = marker;
    this.addMarker(marker, position);
  }
  addMarker(marker, position) {
    marker.position = position;
    this.markers.push(marker);
    this.addedMarkers.push(marker);
  }
  addMarkerToWorld(marker, position) {
    this.addMarker(marker, this.worldToScene(position));
  }
  addMarkerToSubmesh(marker, submesh, position) {
    //coords are local to the submesh being added to
    this.addMarker(marker, this.worldToScene(position));
  }
  indexFor(x, y) {
    return (x - this.ll.x) * (this.cellRadius * 2 + 1) + (y - this.ll.y);
  }

  // relative position
  worldToLocal(position) {}
  worldToScene(position) {}
  sceneToLocal(position) {}
  sceneToWorld(position) {}
  localToScene(position) {}
  localToWorld(position) {}

  //

  cellAt(x, y) {
    const index = this.indexFor(x, y);
    if (index === null) return null;
    return this.cells[index];
  }
  cellAtPosition(position) {}
  checkForTransition() {
    // check if the avatar has move out of the center square
    if (this.avatar) {
      const transition = {
        x: 0,
        y: 0
      };
      if (this.avatar.position.x <= this.centerCoordinateBounds[0]) {
        transition.x--;
      }
      if (this.avatar.position.y >= this.centerCoordinateBounds[1]) {
        transition.y++;
      }
      if (this.avatar.position.x >= this.centerCoordinateBounds[2]) {
        transition.x++;
      }
      if (this.avatar.position.y >= this.centerCoordinateBounds[3]) {
        transition.y--;
      }
      return transition.x === 0 && transition.y === 0 ? null : transition;
    }
  }
  checkForMarkerRemoval() {
    // check if any markers need to transition to a new mesh or GC
    for (let lcv = 0; lcv < this.markers.length; lcv++) {
      if (this.avatar.position.x <= this.bounds[0] || this.avatar.position.y <= this.bounds[1] || this.avatar.position.x >= this.bounds[2] || this.avatar.position.y >= this.bounds[3]) {
        this.markerRemovals.push(this.markers[0]);
      }
    }
  }
}

// markers natively use scene coordinates
exports.InfiniteGrid = InfiniteGrid;
class InfiniteGridMarker {
  constructor(options = {}) {
    this.options = options;
  }
}
exports.InfiniteGridMarker = InfiniteGridMarker;
class InfiniteGridCell {
  constructor(options) {
    this.options = options;
  }
}
exports.InfiniteGridCell = InfiniteGridCell;