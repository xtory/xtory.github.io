import { ChartStyle } from './chart-style';
import { Layout }     from '../graph-layouts/layout';

//
// Constructor.
//
function Chart(_renderer, _style) {
    //
    var xc = xtory.core;

    var _self;
    var _renderer;
    var _loader;
    var _world;
    var _layout;

    // Events.
    // this.updating = [];
    // this.updated  = [];
    // this.drawing  = [];
    // this.drew     = [];
    this.eventListeners = {};

    try {
        //
        _self = this;

        _renderer = new xc.Renderer();

        _loader = _renderer.loader;

        if (_style === undefined) {
            _style = new ChartStyle();
        }

        setUpWorld();

        _renderer.run(update, draw);

    } catch (e) {
        //
        console.log('xtory.linkAnalysis.CircularLayout: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        get: function() { return _renderer; }
    });

    Object.defineProperty(_self, 'world', {
        //get: function() { return _world; }
        get: function() {
            //
            if (_world === undefined) {
                //
                setUpWorld();
            }

            return _world;
        }
    });

    Object.defineProperty(_self, 'style', {
        //
        get: function() {
            return _style;
        },

        set: function(value) {
            //
            if (ChartStyle.areEqual(value, _style) === true) {
                return;
            }

            // ...
            
            _style = value;
        }
    });

    Object.defineProperty(_self, 'layout', {
        //
        get: function() {
            //
            if (_layout === undefined) {
                _layout = new Layout(_self);
            }

            return _layout;
        }
    });

    //
    // Private methods.
    //
    function setUpWorld() {
        //
        var style = new xc.World2DStyle();
        style.backgroundColor = xc.Colors.WHITE;

        _world = new xc.World2D(_renderer, style);
    }

    function update() {
        //
        var eventName = 'updating';
        if (xc.EventTargetHelper.checkIfHasEventListeners (
                _self,
                eventName
            ) === true) {
            //
            xc.EventTargetHelper.dispatchEvent (
                _self,
                new xc.Event(eventName)
            )
        }
        
        _world.update();

        eventName = 'updated';
        if (xc.EventTargetHelper.checkIfHasEventListeners (
                _self,
                eventName
            ) === true) {
            //
            var event = new xc.Event(eventName);
            xc.EventTargetHelper.dispatchEvent(_self, event);
        }
    }

    function draw() {
        //
        var eventName = 'drawing';
        if (xc.EventTargetHelper.checkIfHasEventListeners (
                _self,
                eventName
            ) === true) {
            //
            var event = new xc.Event(eventName);
            xc.EventTargetHelper.dispatchEvent(_self, event);
        }

        _world.draw();

        eventName = 'drew';
        if (xc.EventTargetHelper.checkIfHasEventListeners (
                _self,
                eventName
            ) === true) {
            //
            var event = new xc.Event(eventName);
            xc.EventTargetHelper.dispatchEvent(_self, event);
        }
    }

    //
    // Privileged methods.
    //
    this.move = function(screenPositionOffset) {
        //
        _world.move(screenPositionOffset);
    };

    this.zoomAt = function(screenPosition, delta, updatingCallback, finishingCallback) {
        //
        _world.zoomAt (
            screenPosition,
            delta,
            updatingCallback,
            finishingCallback
        );
    };
}

export { Chart };
