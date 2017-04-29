// Note:
// OpenGL viewport's (X, Y) means the lower-left corner.
// DirectX viewport's (X, Y) means the upper-left corner.
//
// And screen space follows the viewport's rule, that is, (0, 0) means the lower-
// left corner, not the upper-left corner.
//
import { ArrayHelper }                         from '../../helpers/array-helper';
import { ClearOptions }                        from '../clear-options';
import { IndexHelper }                         from '../../helpers/index-helper';
import { MathHelper }                          from '../../math/helpers/math-helper';
import { Size2D }                              from '../2d-size';
import { SpriteBatch }                         from '../sprite-batch';
import { LineSegment2DBatch }                  from '../2d-line-segment-batch';
import { Vector2D }                            from '../../math/2d-vector';
import { World2DBoundsChangedEvent }           from './2d-world-bounds-changed-event';
import { World2DLayerName }                    from './2d-world-layer-name';
import { World2DStateNormal }                  from './states/2d-world-state-normal';
import { World2DStateZoomingAtScreenPosition } from './states/2d-world-state-zooming-at-screen-position';
import { World2DStyle }                        from './2d-world-style';

//
// Constructor.
//
function World2D(_renderer, _style) {
    //
    var _self;
    var _state;
    var _spriteBatch;
    var _lineSegmentBatch;

    //
    // Bounds.
    //
    // Note:
    // 'CenterPosition' here means: the center position of this canvas 'in world
    // space'.
    var _centerPosition; // which will be set before continuing.

    // Note:
    // 'Size' here means: the size of this canvas 'in world space'.
    var _size; // which will be set before continuing.

    // Note:
    // The scale factor of world to screen.
    var _worldToScreenScaleFactor;

    var _layers;

    // Helpers
    var _hasToUpdateItems;
    var _drawnImageCount;
    var _drawnLineSegmentCount;
    var _lastDrawnItem;

    // Test:
    var _lastCanvasClientSize;
    // :Test

    try {
        //
        _self = this;

        if (_style === undefined) {
            _style = new World2DStyle();
        }

        _state = new World2DStateNormal(_self);

        _spriteBatch = new SpriteBatch(_renderer);
        _lineSegmentBatch = new LineSegment2DBatch(_renderer);

        _centerPosition = new Vector2D(0, 0);
        _worldToScreenScaleFactor = 1.0;

        setUpLayers();

        // Test:
        /*
        this.resize();
        */
        _lastCanvasClientSize = new Size2D(0, 0);
        resize();
        // :Test

        _hasToUpdateItems = false;
        _drawnImageCount = 0;
        _drawnLineSegmentCount = 0;
        _lastDrawnItem = null;

    } catch (e) {
        //
        console.log('xtory.core.World2D: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        get: function() { return _renderer; }
    });

    Object.defineProperty(_self, 'style', {
        //
        get: function() {
            return _style;
        },

        set: function(value) {
            //
            if (World2DStyle.areEqual(value, _style) === true) {
                return;
            }

            // ...

            _style = value;
        }
    });

    Object.defineProperty(_self, 'state', {
        //
        get: function() {
            return _state;
        },

        set: function(value) {
            //
            if (value === _state) {
                return;
            }

            // ...

            _state = value;
        }
    });

    Object.defineProperty(_self, 'spriteBatch', {
        get: function() { return _spriteBatch; }
    });

    Object.defineProperty(_self, 'lineSegmentBatch', {
        get: function() { return _lineSegmentBatch; }
    });

    //
    // Extent.
    //
    Object.defineProperty(_self, 'centerPosition', {
        get: function() { return _centerPosition; }
    });

    Object.defineProperty(_self, 'size', {
        get: function() { return _size; }
    });

    Object.defineProperty(_self, 'worldToScreenScaleFactor', {
        get: function() { return _worldToScreenScaleFactor; }
    });

    Object.defineProperty(_self, 'drawnImageCount', {
        get: function() { return _drawnImageCount; },
        set: function(value) { _drawnImageCount = value; }
    });

    Object.defineProperty(_self, 'drawnLineSegmentCount', {
        get: function() { return _drawnLineSegmentCount; },
        set: function(value) { _drawnLineSegmentCount = value; }
    });

    Object.defineProperty(_self, 'lastDrawnItem', {
        get: function() { return _lastDrawnItem; },
        set: function(value) { _lastDrawnItem = value; }
    });

    //
    // Private methods.
    //
    function resize() {
        //
        var canvasClientSize = new Size2D (
            _renderer.canvas.clientWidth,
            _renderer.canvas.clientHeight
        );

        if (Size2D.areEqual(canvasClientSize, _lastCanvasClientSize) === true) {
            return;
        }

        _lastCanvasClientSize = canvasClientSize;
        
        // Note:
        // This method could be called when window resizing occurs, that is,
        // viewport changes (and hence _size changes as well). But the world's
        // center position remains unchanged.

        var screenToWorldScaleFactor = 1.0 / _worldToScreenScaleFactor;

        _size = Size2D.multiplySizeByScalar (
            canvasClientSize,
            screenToWorldScaleFactor
        );

        _hasToUpdateItems = true;

        // Test:
        /*
        if (this.boundsChanged !== null) {
            this.boundsChanged (
                this,
                new BoundsChangedEventArgs(false, true)
            );
        }
        */
        //onBoundsChanged(false, true);
        onBoundsChanged (
            new World2DBoundsChangedEvent(false, true)
        );
        // :Test
    };

    function setUpLayers() {
        //
        if (_layers !== null) {
            tearDownLayers();
        }

        _layers = [];

        // Sets the layer count.
        var layerCount = (
            World2DLayerName.NEAREST_ITEMS -
            World2DLayerName.FARTHEST_ITEMS +
            1
        );

        for (var i=0; i<layerCount; i++) {
            _layers.push([]);
        }
    }

    function tearDownLayers() {
        //
        if (_layers != null) {
            //
            for (var i=0; i<_layers.length; i++) {
                //
                var item1 = _layers[i];

                for (var j=0; j<item1.length; j++) {
                    //
                    var item2 = item1[j];
                    if (item2 !== null) {
                        item2.dispose();
                    }
                }

                // Test:
                /*
                item1.clear();
                */
                _layers[i] = null;
                // :Test
            }

            // Test:
            /*
            _layers.clear();
            */
            _layers = null;
        }
    }

    //
    // Event listeners.
    //
    function onBoundsChanged(event) {
        //
        // event: 
        // - isCenterPositionChanged
        // - isSizeChanged

        for (var i=0; i<_layers.length; i++) {
            //
            var item = _layers[i];

            for (var j=0; j<item.length; j++) {
                //
                var item2 = item[j];
                item2.invalidateBounds();
            }
        }
    }

    //
    // Privileged methods.
    //
    this.addItem = function(layerName, item) {
        //
        if (item === null) {
            throw 'An argument-null exception raised.';
        }

        var layerIndex = layerName;// (int)layerName;
        if (IndexHelper.isIndexValid(_layers.length, layerIndex) === false) {
            throw 'An index-out-of-range exception raised.';
        }

        //if (_layers[layerIndex].Contains(item) == true) {
        if (ArrayHelper.contains(_layers[layerIndex], item) === true) {
            //
            // throw new InvalidOperationException (
            //     string.Format (
            //         Messages.CanvasLayerItemAlreadyExists,
            //         layerName.ToString()
            //     )
            // );
            throw 'A world-layer-item-already-exists exception raised.';
        }

        _layers[layerIndex].push(item);

        _hasToUpdateItems = true;
    };

    this.removeItem = function(item) {
        //
        if (item === null) {
            throw 'An argument-null exception raised.';
        }

        var containsItem = false;

        for (var i=0; i<_layers.length; i++) {
            //
            var layer = _layers[i];

            if (ArrayHelper.contains(layer, item) === true) {
                //
                containsItem = true;

                var isSucceeded = ArrayHelper.remove(layer, item);
                if (isSucceeded === false) {
                    return false;
                }
            }
        }

        if (containsItem === false) {
            //
            return false;

        } else {
            //
            _hasToUpdateItems = true;
            
            return true;
        }
    };

    this.update = function() {
        //
        // Updates the state.
        _state.update();

        if (_hasToUpdateItems === true) {
            //
            for (var i=0; i<_layers.length; i++) {
                //
                var item = _layers[i];

                for (var j=0; j<item.length; j++) {
                    //
                    item[j].update();
                }
            }

            _hasToUpdateItems = false;
        }
    };

    this.draw = function() {
        //
        // Resizes (if necessary).
        resize();

        _drawnImageCount = 0;
        _drawnLineSegmentCount = 0;

        // 1. Draws the background.
        _renderer.clear (
            ClearOptions.COLOR_BUFFER,
            _style.backgroundColor
        );

        // 2. Draws the items in all layers.
        for (var i=0; i<_layers.length; i++) {
            //
            var item = _layers[i];

            for (var j=0; j<item.length; j++) {
                //
                item[j].draw();
            }
        }

        // 3. Ends the sprite batch (if necessary).
        this.endSpriteBatch();

        // Ends the line-segment batch (if necessary).
        this.endLineSegmentBatch();

        // 4. Sets the last drawn item to null.
        _lastDrawnItem = null;
    };

    this.move = function(screenPositionOffset) {
        //
        if (screenPositionOffset.x === 0 &&
            screenPositionOffset.y === 0) {
            return;
        }

        var s = 1.0 / _worldToScreenScaleFactor;

        var positionOffset = // in world space.
            Vector2D.multiplyVectorByScalar(screenPositionOffset, s);

        _centerPosition =
            Vector2D.addVectors(_centerPosition, positionOffset);

        _hasToUpdateItems = true;

        // Test:
        /*
        if (this.boundsChanged != null) {
            //
            this.boundsChanged (
                this,
                new BoundsChangedEventArgs(true, false)
            );
        }
        */
        onBoundsChanged (
            new World2DBoundsChangedEvent(true, false)
        );
        // :Test
    };

    this.zoomAt = function(screenPosition, delta, updatingCallback, finishingCallback) {
        //
        if (delta === 0) {
            return;
        }
        
        var size = (
            (delta < 0) ?
            Size2D.multiplySizeByScalar(_size, _style.zoomScaleFactor) :
            Size2D.multiplySizeByScalar(_size, 1.0/_style.zoomScaleFactor)
        );

        this.state = new World2DStateZoomingAtScreenPosition (
            this,
            screenPosition,
            size,
            _style.zoomDuration,
            updatingCallback,
            finishingCallback
        );

        // Note:
        // The Zooming state will set _hasToUpdateItems to true every time the state
        // is called, so we don't have to set it here.
    }

    this.resize = function() {
        resize();
    };

    this.invalidateItems = function() {
        //
        _hasToUpdateItems = true;
    };

    //
    // Accessors.
    //
    this.setBounds = function(centerPosition, size) {
        //
        // 1. Sets the new center position in world space.
        var isMoved;
        if (centerPosition === _centerPosition) {
            //
            isMoved = false;

        } else { // centerPosition !== _centerPosition
            //
            _centerPosition = centerPosition;
            isMoved = true;
        }

        var isResized;
        if (size === _size) {
            //
            isResized = false;

        } else { // size !== _size
            //
            // 2-1. Checks if the aspect ratios of before and after are the same.
            var oldAspectRatio = _size.width / _size.height;
            var newAspectRatio =  size.width /  size.height;

            // 2-2. Then zooms in or out with the same center world position.

            if (MathHelper.areEqual(oldAspectRatio, newAspectRatio) === true) {
                //
                _worldToScreenScaleFactor *= _size.width / size.width;

            } else {
                //
                // Note:
                // The difference between the old and new aspect ratios is
                // supposed to be smaller then the epsilon, or an exception
                // is thrown. But later, I found this insistence isn't nece-
                // ssary and the chart still works when those aspect ratio
                // are different. So I changed how to modify _worldToScreen-
                // ScaleFactor (as shown below) and kept going.
                /*
                throw 'An invalid-operation-exception raised.';
                */

                if (oldAspectRatio <= newAspectRatio) {
                    //
                    _worldToScreenScaleFactor *= _size.jeight / size.jeight;

                } else {
                    //
                    _worldToScreenScaleFactor *= _size.width / size.width;
                }
                // :Note
            }

            _size = size;

            isResized = true;
        }

        _hasToUpdateItems = true;

        // Test:
        /*
        if (this.BoundsChanged != null) {
            //
            this.BoundsChanged (
                this,
                new BoundsChangedEventArgs (
                    isCenterPositionChanged,
                    isSizeChanged
                )
            );
        }
        */
        onBoundsChanged (
            new World2DBoundsChangedEvent(isMoved, isResized)
        );
        // :Test
    };

    //
    // Helpers
    //
    this.drawsItem = function(item) {
        //
        if (item.isVisible === false ||
            item.isOutOfBounds === true) {
            //
            return false;
            
        } else {
            //
            return true;
        }
    };

    this.endSpriteBatch = function() {
        //
        if (_spriteBatch.isBegun === false) {
            return;
        }

        var gl = _renderer.gl;

        // Sets the graphics states.
        // _scene.GraphicsDevice.AlphaBlendState =
        //     AlphaBlendStates.Transparent;

        gl.enable(gl.BLEND);

        gl.blendFunc (
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA
        );

        // _scene.GraphicsDevice.DepthStencilState =
        //     DepthStencilStates.None;

        // _scene.GraphicsDevice.RasterizerState =
        //     RasterizerStates.CullCounterclockwise;

        // _scene.GraphicsDevice.TextureBlendState =
        //     TextureBlendStates.TextureColorOnly;

        // Ends the sprite batch.
        _spriteBatch.end();
    };

    this.endLineSegmentBatch = function() {
        //
        if (_lineSegmentBatch.isBegun === false) {
            return;
        }

        var gl = _renderer.gl;

        // Sets the graphics states.
        // _scene.GraphicsDevice.AlphaBlendState =
        //     AlphaBlendStates.Transparent;
        gl.enable(gl.BLEND);

        gl.blendFunc (
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA
        );

        // _scene.GraphicsDevice.DepthStencilState =
        //     DepthStencilStates.None;

        // _scene.GraphicsDevice.RasterizerState =
        //     RasterizerStates.CullCounterclockwise;

        // _scene.GraphicsDevice.TextureBlendState =
        //     TextureBlendStates.VertexColorOnly;

        // Ends the line-segment batch.
        _lineSegmentBatch.end();
    };

    this.convertPositionFromScreenToWorldSpace = function(screenPosition) {
        //
        // Note:
        // See the notes above this constructor function.
        /*
        var upperLeftPosition = new Vector2D (
            _centerPosition.x - _size.width*0.5,
            _centerPosition.y + _size.height*0.5
        );

        var screenToWorldScaleFactor = 1.0 / _worldToScreenScaleFactor;

        return new Vector2D (
            upperLeftPosition.x + screenPosition.x*screenToWorldScaleFactor,
            upperLeftPosition.y - screenPosition.y*screenToWorldScaleFactor
        );
        */

        var lowerLeftPosition = new Vector2D (
            _centerPosition.x - _size.width*0.5,
            _centerPosition.y - _size.height*0.5
        );

        var screenToWorldScaleFactor = 1.0 / _worldToScreenScaleFactor;

        return new Vector2D (
            lowerLeftPosition.x + screenPosition.x*screenToWorldScaleFactor,
            lowerLeftPosition.y + screenPosition.y*screenToWorldScaleFactor
        );
        // :Note
    };

    this.convertPositionFromWorldToScreenSpace = function(position) {
        //
        // Note:
        // See the notes above this constructor function.
        /*
        var upperLeftPosition = new Vector2D (
            _centerPosition.x - _size.width*0.5,
            _centerPosition.y + _size.height*0.5
        );

        return new Vector2D (
            (position.x - upperLeftPosition.x) * _worldToScreenScaleFactor,
            (upperLeftPosition.y - position.y) * _worldToScreenScaleFactor
        );
        */

        var lowerLeftPosition = new Vector2D (
            _centerPosition.x - _size.width*0.5,
            _centerPosition.y - _size.height*0.5
        );

        return new Vector2D (
            (position.x - lowerLeftPosition.x) * _worldToScreenScaleFactor,
            (position.y - lowerLeftPosition.y) * _worldToScreenScaleFactor
        );
        // :Note
    };

    this.convertLengthFromScreenToWorldSpace = function(screenLength) {
        //
        return screenLength / _worldToScreenScaleFactor;
    };

    this.convertLengthFromWorldToScreenSpace = function(length) {
        //
        return length * _worldToScreenScaleFactor;
    };
}

//
// Static constants.
//
World2D.DEFAULT_LINE_SEGMENT_LAYER_INDEX = World2DLayerName.LINE_SEGMENTS_BELOW_FAR_IMAGES;
World2D.DEFAULT_IMAGE_LAYER_INDEX = World2DLayerName.MIDDLE_IMAGES;

export { World2D };
