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
    renderingContext.clearColor(83/255, 71/255, 65/255, 1); // = cybo.graphics.colors.PHOTOSHOP_DARK_COOL_BROWN

    // Enable depth testing
    renderingContext.enable(renderingContext.DEPTH_TEST);

    // Near things obscure far things
    renderingContext.depthFunc(renderingContext.LEQUAL);

    // Clear the color as well as the depth buffer.
    renderingContext.clear (
        renderingContext.COLOR_BUFFER_BIT |
        renderingContext.DEPTH_BUFFER_BIT
    );    

    //
    // Functions.
    //
    function setUpWebGLRenderingContext() {
        //
        // Try to grab the standard context. If it fails, fallback to experimental.
        //
        // Note:
        // IE11 only supports "experimental-webgl".
        //
        renderingContext = mainCanvas.getContext("webgl");
        if (renderingContext === null) {
            //
            renderingContext =
                mainCanvas.getContext("experimental-webgl");
            
            if (renderingContext !== null) {
                //
                alert (
                    "Your browser supports WebGL. \n\n" +
                    "However, it indicates the support is experimental. " +
                    "That is, not all WebGL functionality may be supported, " +
                    "and content may not run as expected."
                );
            }
            else {
                //
                alert (
                    "Unable to initialize WebGL. Your browser may not support it."
                );

                throw "WebGL-not-supported excpetion raised.";
            }
        }
    }
}
