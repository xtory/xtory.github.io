import { Loader }   from '../loaders/loader';
import { Renderer } from '../graphics/renderer';

//
// Constructor.
//
function Xcene(_settings) {
    //
    // Note:
    // 'settings' include...
    // - canvas
    // - usesDefaultStyles
    // - handlesHDDpiDisplay

    try {
        //
        Object.defineProperty(this, 'settings', {
            get: function() { return _settings; }
        });
        
        var _renderer;
        var _loader;

        _renderer = new Renderer(this);
        Object.defineProperty(this, 'renderer', {
            get: function() { return _renderer; }
        });
        
        _loader = new Loader(this);
        Object.defineProperty(this, 'loader', {
            get: function() { return _loader; }
        });

        // Sets up the timers.
        setUpTimers();

        // Hooks the events.        
        hookEvents();
        
    } catch (e) {
        //
        console.error('g2l.Xcene: ' + e);
        
        throw e;
    }

    //
    // Private methods.
    //
    function setUpTimers() {
        //
        // Note:
        // Provides requestAnimationFrame in a cross browser way.
        // @author paulirish / http://paulirish.com/

        if (window.requestAnimationFrame === undefined) {
            //
            window.requestAnimationFrame = (function() {
                //
                return (
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (
                        callback, // function FrameRequestCallback
                        element   // DOMElement Element
                    ){
                        window.setTimeout(callback, 1000/60);
                    }
                );
            })();
        }
    }

    function hookEvents() {
        //
        // window.addEventListener('error', onError)
        // window.addEventListener('beforeunload', onBeforeUnload);
    }

    //
    // Event handlers.
    //
    // function onError(errorMsg, url, lineNumber) {
    //     //
    //     alert (
    //         'Error: ' + errorMsg +
    //         ', Script: ' + url +
    //         ', Line: ' + lineNumber
    //     );
    // }

    // function onBeforeUnload() {
    //     // No contents.
    // }

    //
    // Privileged methods.
    //
    this.run = function(update, draw) {
        //
        render();

        function render() {
            //
            requestAnimationFrame(render);

            if (update !== undefined) {
                update();
            }

            if (draw !== undefined) {
                draw();
            }
        }
    };
}

Object.freeze(Xcene);

export { Xcene };
