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
    var renderingContext;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var vertexTextureCoordinateAttributeLocation;
    var transformUniformLocation;
    var samplerUniformLocation;
    var vertexPositionBuffer;
    var vertexTextureCoordinateBuffer;
    var indexBuffer;
    var modelViewMatrix;
    var projectionMatrix;
    var mainTexture;

    var rotationX = 0; // in radians.
    var rotationY = 0; // in radians.

    mainCanvas = document.getElementById("mainCanvas");

    try {
        scene = new Scene(mainCanvas);
    } catch (e) {
        ExceptionHelper.displayMessageOf(e);
        return;
    }

    renderingContext =
        scene.graphicsManager.renderingContext;
    
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

        vertexPositionAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                shaderProgram,
                "vertexPosition"
            )
        );
        
        vertexTextureCoordinateAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                shaderProgram,
                "vertexTextureCoordinates"
            )
        );
        
        transformUniformLocation = (
            scene.graphicsManager.getUniformLocation (
                shaderProgram,
                "transform"
            )
        );

        samplerUniformLocation = (
            scene.graphicsManager.getUniformLocation (
                shaderProgram,
                "sampler"
            )
        );
    }

    function setUpBuffers() {
        //
        var vertexPositions = [
            //
            // Front face.
            50, -50,  50,
            50,  50,  50,
           -50,  50,  50,
           -50, -50,  50,
            
            // Back face.
           -50, -50, -50,
           -50,  50, -50,
            50,  50, -50,
            50, -50, -50,
            
            // Top face.
            50,  50,  50,
            50,  50, -50,
           -50,  50, -50,
           -50,  50,  50,
            
            // Bottom face.
            50, -50, -50,
            50, -50,  50,
           -50, -50,  50,
           -50, -50, -50,
            
            // Right face.
            50, -50, -50,
            50,  50, -50,
            50,  50,  50,
            50, -50,  50,
            
            // Left face.
           -50, -50,  50,
           -50,  50,  50,
           -50,  50, -50,
           -50, -50, -50
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

        var textureCoordinates = [
            //
            // Front face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,

            // Back face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,

            // Top face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,

            // Bottom face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,

            // Right face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,

            // Left face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,
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

        var vertexIndices = [
            //
            // Front face.
            0,  1,  2,
            0,  2,  3,

            // Back face.
            4,  5,  6,
            4,  6,  7,

            // Top face.
            8,  9,  10,
            8,  10, 11,

            // Bottom face.
            12, 13, 14,
            12, 14, 15,

            // Right face.
            16, 17, 18,
            16, 18, 19,

            // Left face.
            20, 21, 22,
            20, 22, 23
        ]
        
        indexBuffer =
            renderingContext.createBuffer();

        renderingContext.bindBuffer (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            indexBuffer
        );

        // Now send the element array to GL

        renderingContext.bufferData (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(vertexIndices),
            WebGLRenderingContext.STATIC_DRAW
        );
    }

    //
    // setUpTextures
    //
    // Initialize the textures we'll be using, then initiate a load of
    // the texture images. The handleTextureLoaded() callback will finish
    // the job; it gets called each time a texture finishes loading.
    //
    function setUpTextures() {
        //
        var url = // which is relative to index.html, not main.js
            "../assets/images/market-street.jpg";

        mainTexture = scene.assetManager.loadTexture2D(url);
    }

    function drawScene() {
        //
        // Clear the mainCanvas before we start drawing on it.
        scene.graphicsManager.clear();

        setUpTransform();

        scene.graphicsManager.shaderProgram =
            shaderProgram;

        scene.graphicsManager.enableVertexAttribute (
            vertexPositionAttributeLocation
        );

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

        scene.graphicsManager.enableVertexAttribute (
            vertexTextureCoordinateAttributeLocation
        );

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexTextureCoordinateBuffer
        );

        renderingContext.vertexAttribPointer (
            vertexTextureCoordinateAttributeLocation,
            2,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );        
        
        renderingContext.activeTexture (
            WebGLRenderingContext.TEXTURE0
        );
        
        renderingContext.bindTexture (
            WebGLRenderingContext.TEXTURE_2D,
            mainTexture
        );

        scene.graphicsManager.setSamplerUniform (
            samplerUniformLocation,
            0
        );
        
        // renderingContext.drawArrays (
        //     WebGLRenderingContext.TRIANGLE_STRIP,
        //     0,
        //     4
        // );

        renderingContext.bindBuffer (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            indexBuffer
        );
        
        renderingContext.drawElements (
            WebGLRenderingContext.TRIANGLES,
            36,
            WebGLRenderingContext.UNSIGNED_SHORT,
            0
        );
    }

    function setUpTransform() {
        //
        modelViewMatrix =
            Matrix4x4.createRotationMatrix(CartesianAxis.Y, rotationY);

        rotationY += 0.05;

        modelViewMatrix = Matrix4x4.multiplyMatrices (
            Matrix4x4.createRotationMatrix(CartesianAxis.X, rotationX),
            modelViewMatrix
        );

        rotationX -= 0.025;

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
    }
});
