import { JSHelper }            from '../../helpers/js-helper';
import { LineSegment2D }       from '../2d-line-segment';
import { LineSegment2DHelper } from '../helpers/2d-line-segment-helper';
import { Vector2D }            from '../../math/2d-vector';
import { Vector3D }            from '../../math/3d-vector';
import { World2DImage }        from './2d-world-image';
import { World2DItem }         from './2d-world-item';

//
// Constructor.
//
function World2DLineSegment (
    _world,
    _startPosition,
    _finishPosition,
    _thickness,
    _color
){
    World2DItem.call(this, _world);

    var _self;
    var _startScreenPosition;
    var _finishScreenPosition;
    var _screenThickness;

    // Styles.
    var _boundsScreenThickness;
    var _minScreenThickness;
    var _maxScreenThickness;

    try {
        //
        _self = this;

        if (_thickness < 0) {
            throw 'An invalid-length exception raised.';
        }

        // Styles.
        _boundsScreenThickness = false;
        _minScreenThickness = 0; // Thickness can't be < 0.
        _maxScreenThickness = Number.MAX_VALUE;

        // Note:
        // Define properties before continuing.

        // Note:
        // The start position in world space.
        Object.defineProperty(_self, 'startPosition', {
            //
            'get': function() {
                return _startPosition;
            },

            'set': function(value) {
                //
                if (Vector2D.areEqual(value, _startPosition) === true) {
                    return;
                }

                _startPosition = value;

                _startScreenPosition =
                    _world.convertPositionFromWorldToScreenSpace(_startPosition);

                // Test:
                _self.invalidateBounds();
                // :Test
            }
        });

        // Note:
        // The finish position in world space.
        Object.defineProperty(_self, 'finishPosition', {
            //
            'get': function() {
                return _finishPosition;
            },

            'set': function(value) {
                //
                if (Vector2D.areEqual(value, _finishPosition) === true) {
                    return;
                }

                _finishPosition = value;

                _finishScreenPosition =
                    _world.convertPositionFromWorldToScreenSpace(_finishPosition);

                // Test:
                _self.InvalidateBounds();
                // :Test
            }
        });

        Object.defineProperty(_self, 'startScreenPosition', {
            'get': function() { return _startScreenPosition },
            // Test:
            'set': function(value) { _startScreenPosition = value; }
            // :Test
        });

        Object.defineProperty(_self, 'finishScreenPosition', {
            'get': function() { return _finishScreenPosition },
            // Test:
            'set': function(value) { _finishScreenPosition = value; }
            // :Test
        });

        // Note:
        // The thickness in world space.
        Object.defineProperty(_self, 'thickness', {
            //
            'get': function() {
                return _thickness;
            },

            'set': function(value) {
                //
                if (value === _thickness) {
                    return;
                }

                _thickness = value;

                update();
            }
        });

        Object.defineProperty(_self, 'screenThickness', {
            'get': function() { return _screenThickness },
            // Test:
            'set': function(value) { _screenThickness = value; }
            // :Test
        });

        Object.defineProperty(_self, 'color', {
            'get': function() { return _color },
            'set': function(value) { _color = value; }
        });

        // Styles
        Object.defineProperty(_self, 'boundsScreenThickness', {
            //
            'get': function() {
                //
                return _boundsScreenThickness
            },

            'set': function(value) {
                //
                if (value === _boundsScreenThickness) {
                    return;
                }

                _boundsScreenThickness = value;

                update();
            }
        });

        Object.defineProperty(_self, 'minScreenThickness', {
            //
            'get': function() {
                //
                return _minScreenThickness
            },

            'set': function(value) {
                //
                if (value === _minScreenThickness) {
                    return;
                }

                _minScreenThickness = value;

                update();
            }
        });

        Object.defineProperty(_self, 'maxScreenThickness', {
            //
            'get': function() {
                //
                return _maxScreenThickness
            },

            'set': function(value) {
                //
                if (value === _maxScreenThickness) {
                    return;
                }

                _maxScreenThickness = value;

                update();
            }
        });

        // Calls Update() to calculate the positions and thickness in screen space.
        this.update();

    } catch (e) {
        //
        console.log('g2l.World2DLineSegment: ' + e);

        throw e;
    }
}

JSHelper.inherit(World2DLineSegment, World2DItem);

World2DLineSegment.prototype.update = function() {
    //
    // Note:
    // See the note in World2DImage.update()

    if (this.isEnabled === false) {
        return;
    }

    // 1. Calculates the start/finish positions and thickness in screen space.
    this.startScreenPosition =
        this.world.convertPositionFromWorldToScreenSpace(this.startPosition);

    this.finishScreenPosition =
        this.world.convertPositionFromWorldToScreenSpace(this.finishPosition);

    this.screenThickness =
        this.thickness * this.world.worldToScreenScaleFactor;

    // 2. Bounds the thickness in screen space (if necessary).
    this.boundScreenThickness();
};

World2DLineSegment.prototype.draw = function() {
    //
    var world = this.world;
    if (world.drawsItem(this) === false) {
        return;
    }
    
    if (world.lastDrawnItem === null) {
        //
        world.lineSegmentBatch.begin();

    } else if (
        (world.lastDrawnItem instanceof World2DImage) === true
    ){
        if (world.spriteBatch.IsBegun === true) {
            world.endSpriteBatch();
        }

        world.lineSegmentBatch.begin();

    } else if (
       (world.lastDrawnItem instanceof World2DLineSegment) === true &&
        world.lineSegmentBatch.isBegun === false
    ){
        // Note:
        // This situation shouldn't happen. But if it does, begin the line-segment
        // batch.

        //Debug.Fail(new InvalidOperationException().ToString());
        console.log('An invalid-operation exception raised.');

        world.lineSegmentBatch.begin();
    }

    // Draws this line segment.
    world.lineSegmentBatch.drawLineSegment (
        new Vector3D (
            this.startScreenPosition.x,
            this.startScreenPosition.y,
            LineSegment2D.DEFAULT_SCREEN_POSITION_DEPTH
        ),
        new Vector3D (
            this.finishScreenPosition.x,
            this.finishScreenPosition.y,
            LineSegment2D.DEFAULT_SCREEN_POSITION_DEPTH
        ),
        this.screenThickness,
        this.color
    );

    // Sets the canvas' last drawn item to this line segment.
    world.lastDrawnItem = this;

    // Increases the canvas' drawn line-segment count by 1.
    world.drawnLineSegmentCount++;
};

World2DLineSegment.prototype.boundScreenThickness = function() {
    //
    if (this.boundsScreenThickness === false) {
        return;
    }

    if (this.minScreenThickness < 0 ||
        this.maxScreenThickness < 0) {
        //
        throw 'An invalid-operation exception raised.';
    }

    if (this.screenThickness < this.minScreenThickness) {
        //
        this.screenThickness = this.minScreenThickness;

        // Note:
        // Sets the line segment's thickness in screen space to min, but keeps the
        // thickness in world space unchanged.
        /*
        this.thickness =
            this.screenThickness / this.world.worldToScreenScaleFactor;
        */

    } else if (
        this.maxScreenThickness < this.screenThickness
    ){
        this.screenThickness = this.maxScreenThickness;

        // Note:
        // See the note above.
    }
};

//
// Helpers
//
World2DLineSegment.prototype.checkIfOutOfBounds = function() {
    //
    var centerPosition = this.world.centerPosition;
    var size = this.world.size;

    if (LineSegment2DHelper.lineSegmentIntersectsBounds (
            // Part 1.
            this.startPosition, this.finishPosition,
            // Part 2.
            centerPosition, size
            //
        ) === true) {
        //
        this.isOutOfBounds = false;

    } else {
        //
        this.isOutOfBounds = true;
    }
};

Object.freeze(World2DLineSegment);

export { World2DLineSegment };
