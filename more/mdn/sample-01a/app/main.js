"use strict";

function main() {
    //
    var mainCanvas;
    var renderingContext;

    mainCanvas = document.getElementById("mainCanvas");

    // Set up the GL context
    setUpWebGLRenderingContext(mainCanvas);

    // Only continue if WebGL is available and working
    if (renderingContext === null) {
        return;
    }

    // Set clear color to black, fully opaque
    renderingContext.clearColor(0.25, 0.25, 0.25, 1.0);

    // Enable depth testing
    renderingContext.enable(renderingContext.DEPTH_TEST);

    // Near things obscure far things
    renderingContext.depthFunc(renderingContext.LEQUAL);

    // Clear the color as well as the depth buffer.
    renderingContext.clear (
        WebGLRenderingContext.COLOR_BUFFER_BIT |
        WebGLRenderingContext.DEPTH_BUFFER_BIT
    );

    //
    // Functions.
    //
    function setUpWebGLRenderingContext(mainCanvas) {
        //
        // Try to grab the standard context.
        renderingContext = mainCanvas.getContext("webgl");

        // If we don't have a GL context, give up now
        if (renderingContext == null) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
        }
    }
}
