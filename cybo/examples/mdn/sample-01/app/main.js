function main() {
    //
    "use strict";

    var scene;
    var renderingContext;

    try {
        scene = new Cybo.Xcene();
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
