'use strict';

function Xcene(_mainCanvas) {
    //
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
    
    window.addEventListener('resize', resize);
    resize();

    //
    // Private methods.
    //
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
}

Xcene.prototype = {
    //
};
