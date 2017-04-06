import { AssetManager }    from '../assets/asset-manager';
import { GraphicsManager } from '../graphics/graphics-manager';

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
        
        var _graphicsManager;
        var _assetManager;

        _graphicsManager = new GraphicsManager(this);
        Object.defineProperty(this, 'graphicsManager', {
            get: function() { return _graphicsManager; }
        });
        
        _assetManager = new AssetManager(this);
        Object.defineProperty(this, 'assetManager', {
            get: function() { return _assetManager; }
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