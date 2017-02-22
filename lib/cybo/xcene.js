define ([
    "./graphics/graphics-manager",
    "./assets/asset-manager"
], function (
    GraphicsManager,
    AssetManager
){
    "use strict";
    
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

        // Hooks the events.        
        hookEvents();

        // Calls resize() immediately at tne end of Xcene's constructor.
        resize();

        //
        // Private methods.
        //
        function hookEvents() {
            window.addEventListener("resize", resize);
            window.addEventListener("beforeunload", beforeUnload);
        }

        function resize() {
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

        function beforeUnload() {
            // No contents.
        }
    }

    //
    // Prototype.
    //
    Xcene.prototype = {
        // No contents.
    };

    return Xcene;
});
