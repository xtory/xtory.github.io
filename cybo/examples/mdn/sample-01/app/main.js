function main() {
    //
    'use strict';

    var scene;
    var renderingContext;

    try {
        //
        scene = new Cybo.Xcene();

        renderingContext = scene.graphicsManager.renderingContext;
        
        scene.graphicsManager.clear (
            WebGLRenderingContext.COLOR_BUFFER_BIT,
            undefined,
            undefined,
            undefined
        );

    } catch (e) {
        //
        Cybo.ExceptionHelper.displayMessageOf(e);

        return;
    }
}
