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
            Cybo.ClearOptions.COLOR_BUFFER
        );

    } catch (e) {
        //
        Cybo.ExceptionHelper.displayMessageOf(e);

        return;
    }
}
