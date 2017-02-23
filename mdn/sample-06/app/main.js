define ([
    "../../../lib/cybo/3d-vector",
    "../../../lib/cybo/4x4-matrix",
    "../../../lib/cybo/cartesian-axis",
    "../../../lib/cybo/xcene",
    "../../../lib/cybo/assets/shaders/position-texture-coordinates",
    "../../../lib/cybo/graphics/color",
    "../../../lib/cybo/graphics/colors",
    "../../../lib/cybo/graphics/fx/helpers/shader-helper",
    "../../../lib/cybo/graphics/fx/shader-type",
    "../../../lib/cybo/helpers/exception-helper"
], function (
    Vector3D,
    Matrix4x4,
    CartesianAxis,
    Scene,
    PositionTextureCoordinates,
    Color,
    Colors,
    ShaderHelper,
    ShaderType,
    ExceptionHelper
){
    "use strict";

    var mainCanvas;
    var scene;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var vertexTextureCoordinateAttributeLocation;
    var transformUniformLocation;
    var vertexPositionBuffer;
    var vertexTextureCoordinateBuffer
    var modelViewMatrix;
    var projectionMatrix;
    var mainImage;
    var mainTexture;
    var rotationY = 0;

    mainCanvas = document.getElementById("mainCanvas");

    try {
        scene = new Scene(mainCanvas);
    } catch (e) {
        ExceptionHelper.displayMessageOf(e);
        return;
    } 
    
    shaderHelper = new ShaderHelper(scene.graphicsManager);

    // Set up the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    setUpShaders();

    // Here's where we call the routine that builds all the objects
    // we'll be drawing.
    setUpBuffers();

    setUpTextures();

    // Set up to draw the scene periodically.
    setInterval(drawScene, 15);

    //
    // Functions.
    //
    function setUpShaders() {
        //
        var vertexShader = scene.assetManager.loadShader (
            ShaderType.VERTEX_SHADER,
            PositionTextureCoordinates.VERTEX_SHADER_SOURCE
        );
            
        var fragmentShader = scene.assetManager.loadShader (
            ShaderType.FRAGMENT_SHADER,
            PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE
        );

        shaderProgram = shaderHelper.setUpShaderProgram (
            vertexShader,
            fragmentShader
        );

        scene.graphicsManager.shaderProgram = shaderProgram;

        vertexPositionAttributeLocation =
            scene.graphicsManager.getAttributeLocation("vertexPosition");
        
        scene.graphicsManager.enableVertexAttribute (
            vertexPositionAttributeLocation
        );

        vertexTextureCoordinateAttributeLocation =
            scene.graphicsManager.getAttributeLocation("vertexTextureCoordinates");
        
        scene.graphicsManager.enableVertexAttribute (
            vertexTextureCoordinateAttributeLocation
        );

        transformUniformLocation =
            scene.graphicsManager.getUniformLocation("transform");
    }

    function setUpBuffers() {
        //
        // Create a buffer for the square's vertices.
        
        var renderingContext =
            scene.graphicsManager.renderingContext;

        // Create an array of vertex positions for the square. Note that the Z
        // coordinate is always 0 here.

        var vertexPositions = [
            50.0, -50.0,  0.0,
            50.0,  50.0,  0.0,
           -50.0, -50.0,  0.0,
           -50.0,  50.0,  0.0
        ];        

        vertexPositionBuffer =
            renderingContext.createBuffer();

        // Select the vertexPositionBuffer as the one to apply vertex
        // operations to from here out.

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexPositionBuffer
        );
        
        // Now pass the list of vertex positions into WebGL to build the shape.
        // We do this by creating a Float32Array from the JavaScript array, then
        // use it to fill the current vertex buffer.

        renderingContext.bufferData (
            WebGLRenderingContext.ARRAY_BUFFER,
            new Float32Array(vertexPositions),
            WebGLRenderingContext.STATIC_DRAW
        );

        // *Test*
        renderingContext.vertexAttribPointer (
            vertexPositionAttributeLocation,
            3,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );
        // *_Test*

        var textureCoordinates = [
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 1.0
        ];        

        vertexTextureCoordinateBuffer =
            renderingContext.createBuffer();

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexTextureCoordinateBuffer
        );

        renderingContext.bufferData (
            WebGLRenderingContext.ARRAY_BUFFER,
            new Float32Array(textureCoordinates),
            WebGLRenderingContext.STATIC_DRAW
        );

        renderingContext.vertexAttribPointer (
            vertexTextureCoordinateAttributeLocation,
            2,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );
    }

    //
    // initTextures
    //
    // Initialize the textures we'll be using, then initiate a load of
    // the texture images. The handleTextureLoaded() callback will finish
    // the job; it gets called each time a texture finishes loading.
    //
    function setUpTextures() {
        //
        // mainTexture =
        //     scene.graphicsManager.renderingContext.createTexture();

        // mainImage = new Image();

        // mainImage.addEventListener("load", function() {
        //     //
        //     handleTextureLoaded (
        //         scene.graphicsManager.renderingContext,
        //         mainImage,
        //         mainTexture
        //     );
        // });

        // mainImage.src = "assets/images/fujima.jpg";

        var url = "app/assets/images/fujima.jpg";
        mainTexture = scene.assetManager.loadTexture2D(url);

        // mainImage = new Image();

        // mainImage.addEventListener("load", function() {
        //     //
        //     handleTextureLoaded (
        //         scene.graphicsManager.renderingContext,
        //         mainImage,
        //         mainTexture
        //     );
        // });

        // mainImage.src = "assets/images/fujima.jpg";
    }

    // function handleTextureLoaded(renderingContext, image, texture) {
    //     //
    //     renderingContext.bindTexture (
    //         WebGLRenderingContext.TEXTURE_2D,
    //         texture
    //     );

    //     renderingContext.texImage2D (
    //         WebGLRenderingContext.TEXTURE_2D,    // target
    //         0,                                   // level
    //         WebGLRenderingContext.RGBA,          // internalformat
    //         WebGLRenderingContext.RGBA,          // format
    //         WebGLRenderingContext.UNSIGNED_BYTE, // type
    //         image                                // htmlImageElement
    //     );

    //     if (MathHelper.isPowerOfTwo(image.width) === true &&
    //         MathHelper.isPowerOfTwo(image.height) === true) {
    //         //
    //         renderingContext.generateMipmap (
    //             WebGLRenderingContext.TEXTURE_2D
    //         );
            
    //         renderingContext.texParameteri (
    //             WebGLRenderingContext.TEXTURE_2D,
    //             WebGLRenderingContext.TEXTURE_MIN_FILTER,
    //             WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
    //         );

    //         renderingContext.texParameteri (
    //             WebGLRenderingContext.TEXTURE_2D,
    //             WebGLRenderingContext.TEXTURE_MAG_FILTER,
    //             WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
    //         );

    //     } else {
    //         //
    //         renderingContext.texParameteri (
    //             WebGLRenderingContext.TEXTURE_2D,
    //             WebGLRenderingContext.TEXTURE_MIN_FILTER,
    //             WebGLRenderingContext.LINEAR
    //         );

    //         renderingContext.texParameteri (
    //             WebGLRenderingContext.TEXTURE_2D,
    //             WebGLRenderingContext.TEXTURE_MAG_FILTER,
    //             WebGLRenderingContext.LINEAR
    //         );
    //     }

    //     renderingContext.texParameteri (
    //         WebGLRenderingContext.TEXTURE_2D,
    //         WebGLRenderingContext.TEXTURE_WRAP_S,
    //         WebGLRenderingContext.CLAMP_TO_EDGE
    //     );

    //     renderingContext.texParameteri (
    //         WebGLRenderingContext.TEXTURE_2D,
    //         WebGLRenderingContext.TEXTURE_WRAP_T,
    //         WebGLRenderingContext.CLAMP_TO_EDGE
    //     );

    //     renderingContext.bindTexture (
    //         WebGLRenderingContext.TEXTURE_2D,
    //         null
    //     );
    // }

    function drawScene() {
        //
        var renderingContext =
            scene.graphicsManager.renderingContext;

        // Clear the mainCanvas before we start drawing on it.
        scene.graphicsManager.clear();

        // Draw the square by binding the array buffer to the square's vertices
        // array, setting attributes, and pushing it to GL.

        // *Test*
        /*
        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexPositionBuffer
        );
        
        renderingContext.vertexAttribPointer (
            vertexPositionAttributeLocation,
            3,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );

        // Set the colors attribute for the vertices.

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexColorBuffer
        );

        renderingContext.vertexAttribPointer (
            vertexColorAttributeLocation,
            4,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );
        */

        modelViewMatrix =
            Matrix4x4.createRotationMatrix(CartesianAxis.Y, rotationY);

        rotationY += 0.05;

        var v = new Vector3D(0, 0, -325);

        modelViewMatrix = Matrix4x4.multiplyMatrices (
            Matrix4x4.createTranslationMatrix(v),
            modelViewMatrix
        );

        projectionMatrix = Matrix4x4.createProjectionMatrix (
            undefined,
            mainCanvas.clientWidth / mainCanvas.clientHeight,
            undefined,
            undefined
        );
        
        var transform =
            projectionMatrix.multiply(modelViewMatrix);

        scene.graphicsManager.setMatrix4x4Uniform (
            transformUniformLocation,
            transform
        );

        renderingContext.activeTexture (
            WebGLRenderingContext.TEXTURE0
        );

        renderingContext.bindTexture (
            WebGLRenderingContext.TEXTURE_2D,
            mainTexture
        );

        renderingContext.uniform1i (
            renderingContext.getUniformLocation(shaderProgram, "sampler"),
            0
        );
        
        renderingContext.drawArrays (
            WebGLRenderingContext.TRIANGLE_STRIP,
            0,
            4
        );
    }
});
