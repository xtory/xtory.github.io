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
            Cybo.ClearOptions.COLOR_BUFFER,
            new Cybo.Color(0.75, 0.5, 0.5, 1)
        );

    } catch (e) {
        //
        Cybo.ExceptionHelper.displayMessageOf(e);

        return;
    }
}
