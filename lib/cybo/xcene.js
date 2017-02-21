var GLOBAL_TEST_TEST = "shoot!";

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
        
        window.onreize = this.resize();
        this.resize();
    }

    //
    // Prototype.
    //
    Xcene.prototype = {
        //
        // Public methods.
        //
        resize: function() {
            //
            // Lookup the size the browser is displaying the canvas.
            var displayWidth  = this.mainCanvas.clientWidth;
            var displayHeight = this.mainCanvas.clientHeight;

            // Check if the canvas is not the same size.
            if (this.mainCanvas.width  != displayWidth ||
                this.mainCanvas.height != displayHeight) {
                //
                // Make the canvas the same size
                this.mainCanvas.width  = displayWidth;
                this.mainCanvas.height = displayHeight;
                
                this.graphicsManager.renderingContext.viewport (
                    // Part 1.
                    0, 0,
                    // Part 2.
                    this.mainCanvas.width, this.mainCanvas.height
                );
            }
        }
    };

    return Xcene;
});