define ([
    "../../../lib/cybo/xcene",
    "../../../lib/cybo/graphics/color",
    "../../../lib/cybo/helpers/exception-helper"
], function (
    Scene,
    Color,
    ExceptionHelper
){
    "use strict";

    var mainCanvas;
    var scene;
    var renderingContext;

    mainCanvas = document.getElementById("mainCanvas");

    try {
        scene = new Scene(mainCanvas);
    } catch (e) {
        ExceptionHelper.displayMessageOf(e);
        return;
    }
    
    renderingContext = scene.graphicsManager.renderingContext;
    
    scene.graphicsManager.clear (
        renderingContext.COLOR_BUFFER_BIT,
        undefined,
        undefined,
        undefined
    );
});
