function main() {
    //
    "use strict";

    var mainCanvas;
    var scene;
    var renderingContext;

    mainCanvas = document.getElementById("mainCanvas");

    try {
        scene = new Cybo.Xcene(mainCanvas);
    } catch (e) {
        Cybo.ExceptionHelper.displayMessageOf(e);
        return;
    }
    
    renderingContext = scene.graphicsManager.renderingContext;
    
    scene.graphicsManager.clear (
        WebGLRenderingContext.COLOR_BUFFER_BIT,
        undefined,
        undefined,
        undefined
    );
}
