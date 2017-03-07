import { AssetManager } from "../assets/asset-manager";
import { GraphicsManager } from "../graphics/graphics-manager";

// define ([
//     "../graphics/graphics-manager",
//     "../assets/asset-manager"
// ], function (
//     GraphicsManager,
//     AssetManager
// ){
//     "use strict";
    
//
// Constructor.
//
function Xcene(_mainCanvas) {
    //
    var _graphicsManager;
    var _assetManager;

    Object.defineProperty(this, "mainCanvas", {
        get: function() { return _mainCanvas; }
    });

    _graphicsManager = new GraphicsManager(this);
    Object.defineProperty(this, "graphicsManager", {
        get: function() { return _graphicsManager; }
    });

    _assetManager = new AssetManager(this);
    Object.defineProperty(this, "assetManager", {
        get: function() { return _assetManager; }
    });

    setUpTimers();

    // Hooks the events.        
    hookEvents();

    // Calls onResize() immediately at the end of Xcene's constructor.
    onResize();

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
        window.addEventListener("resize", onResize);

        // window.addEventListener("error", onError)
        // window.addEventListener("beforeunload", onBeforeUnload);
    }

    //
    // Event handlers.
    //
    function onResize() {
        //
        // Lookup the size the browser is displaying the canvas.
        var displayWidth  = _mainCanvas.clientWidth;
        var displayHeight = _mainCanvas.clientHeight;

        // Check if the canvas is not the same size.
        if (_mainCanvas.width  != displayWidth ||
            _mainCanvas.height != displayHeight) {
            //
            // Make the canvas the same size
            _mainCanvas.width  = displayWidth;
            _mainCanvas.height = displayHeight;
            
            _graphicsManager.renderingContext.viewport (
                // Part 1.
                0, 0,
                // Part 2.
                _mainCanvas.width, _mainCanvas.height
            );
        }
    }

    // function onError(errorMsg, url, lineNumber) {
    //     //
    //     alert (
    //         "Error: " + errorMsg +
    //         ", Script: " + url +
    //         ", Line: " + lineNumber
    //     );
    // }

    // function onBeforeUnload() {
    //     // No contents.
    // }
}

//
// Prototype.
//
Xcene.prototype = {
    //
    // Public methods.
    //
    render: function(update, draw) {
        //
        tick();

        function tick() {
            //
            requestAnimationFrame(tick);

            update();
            draw();
        }
    },
};

Object.freeze(Xcene);

//     return Xcene;
// });

export { Xcene };
