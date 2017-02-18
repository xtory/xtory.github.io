define ([
    "../../lib/" + xPaths["scene"],
    "../../lib/" + xPaths["color"]
], function (
    Scene,
    Color
){
    "use strict";
    
    var mainCanvas;
    var scene;

    mainCanvas = document.getElementById("mainCanvas");

    scene = new Scene(mainCanvas);

    scene.graphicsManager.clear (
        WebGLRenderingContext.COLOR_BUFFER_BIT,
        new Color(0.25, 0.25, 0.25, 1.0),
        undefined,
        undefined
    );
});
