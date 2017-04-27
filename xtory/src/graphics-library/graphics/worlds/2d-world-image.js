import { JSHelper }           from '../../helpers/js-helper';
import { Size2D }             from '../2d-size';
import { Sprite }             from '../sprite';
import { Vector2D }           from '../../math/2d-vector';
import { Vector3D }           from '../../math/3d-vector';
import { World2DImageStyle }  from './2d-world-image-style';
import { World2DItem }        from './2d-world-item';
import { World2DLineSegment } from './2d-world-line-segment';

//
// Constructor.
//
function World2DImage (
    _world,
    _texture,
    _centerPosition, // in world space.
    _size,           // in world space.
    _sourceRect,
    _color
){
    World2DItem.call(this, _world);

    var _self;
    var _centerScreenPosition;
    var _screenSize;
    var _style;

    try {
        //
        _self = this;

        if (_texture === null) {
            throw 'An argument-null exception raised.';
        }

        // Note:
        // Define properties before continuing.

        Object.defineProperty(_self, 'texture', {
            get: function() { return _texture; },
            set: function(value) { _texture = value; }
        });

        // Note:
        // 'centerPosition' here means the center position of this image "in world
        // space".
        Object.defineProperty(_self, 'centerPosition', {
            //
            get: function() {
                //
                return _centerPosition;
            },

            set: function(value) {
                //
                if (Vector2D.areEqual(value, _centerPosition) === true) {
                    return;
                }

                _centerPosition = value;

                // Calculates the center position in screen space as well.
                _centerScreenPosition =
                    _world.convertPositionFromWorldToScreenSpace(_centerPosition);

                // Test:
                _self.invalidateBounds();
                // :Test
            }
        });

        // Note:
        // 'Size' here means this image's size in world space.
        Object.defineProperty(_self, 'size', {
            //
            get: function() {
                //
                return _size;
            },

            set: function(value) {
                //
                if (Size2D.areEqual(value, _size) === true) {
                    return;
                }

                _size = value;

                // Calculates the size in screen space as well.
                _screenSize = //_size * base.Canvas.WorldToScreenScaleFactor;
                    Size2D.multiplySizeByScalar(_size, _world.worldToScreenScaleFactor);

                // Test:
                _self.invalidateBounds();
                // :Test
            }
        });

        // Note:
        // "CenterScreenPosition" here means this image's center position in screen
        // space, not the screen's center position.
        Object.defineProperty(_self, 'centerScreenPosition', {
            get: function() { return _centerScreenPosition; },
            // Test:
            set: function(value) { _centerScreenPosition = value; }
            // :Test
        });

        // Note:
        // "ScreenSize" here means this image's size in screen space, not the screen's
        // size.
        Object.defineProperty(_self, 'screenSize', {
            get: function() { return _screenSize; },
            // Test:
            set: function(value) { _screenSize = value; }
            // :Test
        });

        Object.defineProperty(_self, 'sourceRect', {
            get: function() { return _sourceRect; },
            set: function(value) { _sourceRect = value; }
        });

        Object.defineProperty(_self, 'color', {
            get: function() { return _color; },
            set: function(value) { _color = value; }
        });

        _style = new World2DImageStyle();

        Object.defineProperty(_self, 'style', {
            //
            get: function() {
                //
                return _style;
            },

            set: function(value) {
                //
                if (World2DImageStyle.areEqual(value,  _style) === true) {
                    return;
                }

                _style = value;

                update();
            }
        });

        // Note:
        // Be careful! Use property to set _size as well as _screenSize!
        //this.size = _size;
        var size = _size;
        _size = 0;
        this.size = size;

        // Calls Update() to calculate the center position and size in screen space.
        this.update();

    } catch (e) {
        //
        console.log('g2l.World2DImage: ' + e);

        throw e;
    }
}

JSHelper.inherit(World2DImage, World2DItem);

World2DImage.prototype.update = function() {
    //
    // Note:
    // No matter how canvas changes (maybe due to the window resizing, different
    // size viewport, etc.), every image's world-related data doesn't change, such
    // as: image's center position and size in world space. After canvas changed,
    // we should update image's canvas-related data using its own world-related
    // data and canvas' world-related data.

    if (this.isEnabled === false) {
        return;
    }

    // 1. Calculates the center position and size in screen space.
    this.centerScreenPosition =
        this.world.convertPositionFromWorldToScreenSpace(this.centerPosition);

    this.screenSize =
        Size2D.multiplySizeByScalar(this.size, this.world.worldToScreenScaleFactor);

    // 2. Bounds the size in screen space (if necessary).
    this.boundScreenSize();
};

World2DImage.prototype.draw = function() {
    //
    var world = this.world;
    if (world.drawsItem(this) === false) {
        return;
    }
    
    if (world.lastDrawnItem === null) {
        //
        this.beginSpriteBatch();

    } else if (
        (world.lastDrawnItem instanceof World2DLineSegment) === true
    ){
        if (world.lineSegmentBatch.isBegun === true) {
            //
            world.endLineSegmentBatch();
        }
        
        this.beginSpriteBatch();

    } else if (
        (world.lastDrawnItem instanceof World2DImage) === true &&
        world.spriteBatch.isBegun === false
    ){
        // Note:
        // This situation shouldn't happen. But if it does, begin the sprite batch.

        //Debug.Fail(new InvalidOperationException().ToString());
        console.log('An invalid-operation exception raised.');

        this.beginSpriteBatch();
    }
    
    world.spriteBatch.drawSprite (
        this.texture,
        this.flushingOptions,
        new Vector3D (
            this.centerScreenPosition.x,
            this.centerScreenPosition.y,
            Sprite.DEFAULT_SCREEN_POSITION_DEPTH
        ),
        this.screenSize,
        this.sourceRect,
        this.color
    );

    // Sets the canvas' last drawn item to this image.
    world.lastDrawnItem = this;

    // Increases the canvas' drawn image count by 1.
    world.drawnImageCount++;
};

World2DImage.prototype.boundScreenSize = function() {
    //
    var style = this.style;

    if (style.boundsScreenSize === false) {
        return;
    }

    if (style.maxScreenSize.width < style.minScreenSize.width ||
        style.maxScreenSize.height < style.minScreenSize.height) {
        throw new 'An invalid-operation exception raised.';
    }

    // 1. Minimum size in screen space.
    if (this.screenSize.width < style.minScreenSize.width) {
        //
        this.screenSize.width = style.minScreenSize.width;

        // Note:
        // Set the image's size in screen space to min, but keep the size in world
        // space unchanged.
        /*
        this.size.width =
            this.screenSize.width / this.world.worldToScreenScaleFactor;
        */
    }

    if (this.screenSize.height < style.minScreenSize.height) {
        //
        this.screenSize.height = style.minScreenSize.height;

        // Note:
        // See the notes above.
    }

    // 2. Maximum size in screen space.
    if (style.maxScreenSize.width < this.screenSize.width) {
        //
        this.screenSize.width = style.maxScreenSize.width;

        // Note:
        // See the notes above.
    }

    if (style.maxScreenSize.height < this.screenSize.height) {
        //
        this.screenSize.height = style.maxScreenSize.height;

        // Note:
        // See the notes above.
    }
};

//
// Helpers
//
World2DImage.prototype.checkIfOutOfBounds = function() {
    //
    var world = this.world;

    var centerPosition = world.centerPosition;
    var size = world.size;

    if (// Part 1.
        (this.size.width*0.5 + size.width*0.5) <
        Math.abs(this.centerPosition.x - centerPosition.x) ||
        // Part 2.
        (this.size.height*0.5 + size.height*0.5) <
        Math.abs(this.centerPosition.y - centerPosition.y)) {
        //
        this.isOutOfBounds = true;

    } else {
        //
        this.isOutOfBounds = false;
    }
};

World2DImage.prototype.beginSpriteBatch = function() {
    //
    this.world.spriteBatch.begin();
};

export { World2DImage };
