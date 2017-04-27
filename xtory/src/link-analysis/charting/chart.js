import { ChartStyle } from './chart-style';
import { Layout }     from '../graph-layouts/layout';

//
// Constructor.
//
function Chart(_renderer, _style) {
    //
    var _self;
    var _layout;

    try {
        //
        _self = this;

        if (_style === undefined) {
            _style = new ChartStyle();
        }

    } catch (e) {
        //
        console.log('g2l.CircularLayout: ' + e);

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
    })
}

export { Chart };
