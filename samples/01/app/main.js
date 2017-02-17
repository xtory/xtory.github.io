"use strict";

define ([
    "../../lib/xtory/xcene",
    "../../lib/xtory/graphics/color"
], function (
    Scene,
    Color
){
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
