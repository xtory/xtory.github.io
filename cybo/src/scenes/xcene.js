import { AssetManager }    from "../assets/asset-manager";
import { GraphicsManager } from "../graphics/graphics-manager";
import { JSHelper }        from "../helpers/js-helper";

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
function Xcene(_mainCanvas, _usesDefaultStyles) {
    //
    try {
        //
        if (document.body === undefined) {
            throw "document.body === undefined";
        }

        if (JSHelper.isUndefinedOrNull(_mainCanvas) === true) {
            //
            _mainCanvas = document.createElementNS (
                'http://www.w3.org/1999/xhtml',
                'canvas'
            );

            document.body.appendChild(_mainCanvas);
        }

        if (_usesDefaultStyles === undefined) {
            _usesDefaultStyles = true;
        }
        
        var _graphicsManager;
        var _assetManager;

        Object.defineProperty(this, 'mainCanvas', {
            get: function() { return _mainCanvas; }
        });

        _graphicsManager = new GraphicsManager(this);
        Object.defineProperty(this, 'graphicsManager', {
            get: function() { return _graphicsManager; }
        });

        _assetManager = new AssetManager(this);
        Object.defineProperty(this, 'assetManager', {
            get: function() { return _assetManager; }
        });

        // Sets up the styles (if necessary).
        if (_usesDefaultStyles === true) {
            setUpStyles();
        }

        // Sets up the timers.
        setUpTimers();

        // Hooks the events.        
        hookEvents();

        // Calls onResize() immediately at the end of Xcene's constructor.
        onResize();
    }
    catch (error) {
        //
        console.error('Cybo.Xcene: ' + error);
        
        throw error;
    }

    //
    // Private methods.
    //
    function setUpStyles() {
        //
        // Note:
        // This function is used to replace CSS below...
        //
        // body {
        //     margin: 0;
        //     background-color: #202020; /* = cybo.graphics.colors.DEFAULT_BACKGROUND*/
        // }
        //
        // canvas {
        //     width:   100vw;
        //     height:  100vh;
        //     display: block; /* prevents scrollbar */
        // }

        var style;

        style = document.body.style;
        style.margin = 0;
        style.backgroundColor = "#202020"; // = cybo.graphics.colors.DEFAULT_BACKGROUND

        style = _mainCanvas.style;
        style.width = "100vw";
        style.height = "100vh";
        style.display = "block";
    }

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
