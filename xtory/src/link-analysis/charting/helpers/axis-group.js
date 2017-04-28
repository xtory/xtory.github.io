import { AxisGroupStyle } from './axis-group-style';

//
// Constructor.
//
function AxisGroup(_canvas, _style) {
    //
    //var g2l = gorilla.graphicsLibrary;

    var _self;
    var _isVisible;
    var _chartLineSegments;
    
    try {
        //
        _self = this;

        _isVisible = false;

        _chartLineSegments = [];

    } catch (e) {
        //
        console.log('gorilla.linkAnalysis.AxisGroup: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'canvas', {
        get: function() { return _canvas; }
    })

    Object.defineProperty(_self, 'style', {
        //
        get: function() {
            return _style;
        },

        set: function(value) {
            //
            if (AxisGroupStyle.areEqual(value, _style) === true) {
                return;
            }

            // ...

            _style = value;
        }
    })
}

export { AxisGroup };
