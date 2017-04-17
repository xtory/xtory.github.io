import { SpriteBatch }      from '../sprite-batch';
import { Vector2D }         from '../../math/2d-vector';
import { World2DLayerName } from './2d-world-layer-name';

//
// Constructor.
//
function World2D(_renderer, _style) {
    //
    var _self;
    var _spriteBatch;

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

    var _hasToUpdateItems;
    var _drawnImageCount;
    var _drawnLineSegmentCount;
    var _lastDrawnItem;

    // Test:
    var _eventListeners;
    //var _boundsChangedEventHandlers; // event arg: (isCenterPositionChanged, isSizeChanged)
    // :Test

    try {
        //
        _self = this;

        _spriteBatch = new SpriteBatch(_renderer);

        _centerPosition = new Vector2D(0, 0);
        _worldToScreenScaleFactor = 1.0;

        resetSize();

        _hasToUpdateItems = false;

        //_boundsChangedEventHandlers = [];
        _eventListeners = {
            'boundsChanged': []
        };

    } catch (e) {
        //
        console.log('g2l.World2D: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        'get': function() { return _renderer; }
    });

    //
    // Private methods.
    //
    function setUpLayers() {
        //
        if (_layers !== null) {
            tearDownLayers();
        }

        //_layers = new List<List<ICanvasItem>>();
        _layers = [];

        // Sets the layer count.
        var layerCount = (
            World2DLayerName.NearestItems -
            World2DLayerName.FarthestItems +
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

    function addEventListener(type, listener) {
        //
        if (_eventListeners[type] === undefined) {
            //
            _eventListeners[type] = [ listener ];

        } else {
            //
            _eventListeners[type].push(listener);
        }
    }

    function removeEventListener(type, listener) {
        //
        var el = _eventListeners[type];
        if (el === undefined) {
            //
            return;

        } else {
            //
            for (var i=0; i<el.length; i++) {
                //
                if (el[i] === listener) {
                    el.splice(i, 1);
                    break;
                }
            }
        }
    }

    this.addBoundsChangedEventListener = function(listener) {
        //
        addEventListener('boundsChanged', listener);
    }

    this.removeBoundsChangedEventListener = function(listener) {
        //
        removeEventListener('boundsChanged', listener);
    }

    //
    // Priviledged methods.
    //
    this.resetSize = function() {
        //
        // Note:
        // This method could be called when window resizing occurs, that is,
        // viewport changes (and hence _size changes as well). But the world's
        // center position remains unchanged.

        var screenToWorldScaleFactor = 1.0 / _worldToScreenScaleFactor;

        // Test:
        /*
        var viewport = _scene.GraphicsDevice.Viewport;

        _size = new Size2D (
            viewport.Width  * screenToWorldScaleFactor,
            viewport.Height * screenToWorldScaleFactor
        );
        */

        _size = new Size2D (
            _renderer.canvas.clientWidth * screenToWorldScaleFactor,
            _renderer.canvas.clientHeight * screenToWorldScaleFactor
        );
        // :Test

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
        var el = _eventListeners['boundsChanged'];
        for (var i=0; i<el.length; i++) {
            el[i](false, true);
        }
        // :Test
    };

    this.invalidateItems = function() {
        //
        _hasToUpdateItems = true;
    };
}

//
// Static constants (after Object.freeze()).
//
World2D.DEFAULT_LINE_SEGMENT_LAYER_INDEX = World2DLayerName.LINE_SEGMENTS_BELOW_FAR_IMAGES;
World2D.DEFAULT_IMAGE_LAYER_INDEX = World2DLayerName.MIDDLE_IMAGES;

Object.freeze(World2D);

export { World2D };
