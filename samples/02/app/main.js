"use strict";

define ([
    "../../lib/xtory/vector-3d",
    "../../lib/xtory/matrix-4x4",
    "../../lib/xtory/xcene",
    "../../lib/xtory/graphics/color",
    "../../lib/xtory/graphics/fx/helpers/shader-helper",
    "../../lib/xtory/graphics/fx/shader-type",
    "../../lib/xtory/assets/shaders/position-only"
], function (
    Vector3D,
    Matrix4x4,
    Scene,
    Color,
    ShaderHelper,
    ShaderType,
    PositionOnly
){
    var mainCanvas;
    var scene;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttribute;
    var transformUniform;
    var vertexPositionBuffer;
    var modelViewMatrix;
    var projectionMatrix;

    mainCanvas = document.getElementById("mainCanvas");

    scene = new Scene(mainCanvas);
    
    shaderHelper = new ShaderHelper(scene.graphicsManager);

    // Set up the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    setUpShaders();

    // Here's where we call the routine that builds all the objects
    // we'll be drawing.
    setUpBuffers();

    // Set up to draw the scene periodically.
    setInterval(drawScene, 15);

    //
    // Functions.
    //
    function setUpShaders() {
        //
        var vertexShader = scene.assetManager.loadShader (
            ShaderType.vertexShader,
            PositionOnly.vertexShaderSource
        );
            
        var fragmentShader = scene.assetManager.loadShader (
            ShaderType.fragmentShader,
            PositionOnly.fragmentShaderSource
        );

        shaderProgram = shaderHelper.setUpShaderProgram (
            vertexShader,
            fragmentShader
        );

        scene.graphicsManager.shaderProgram = shaderProgram;

        vertexPositionAttribute = scene.graphicsManager.getAttributeLocation (
            shaderProgram,
            "vertexPosition"
        );
        
        scene.graphicsManager.enableVertexAttributeArray (
            vertexPositionAttribute
        );
        
        transformUniform = scene.graphicsManager.getUniformLocation (
            shaderProgram,
            "transform"
        );
    }

    function setUpBuffers() {
        //
        // Create a buffer for the square's vertex positions.
        
        var renderingContext =
            scene.graphicsManager.renderingContext;

        // Create an array of vertex positions for the square. Note that the Z
        // coordinate is always 0 here.

        var vertexPositions = [
            50.0,  50.0,  0.0,
           -50.0,  50.0,  0.0,
            50.0, -50.0,  0.0,
           -50.0, -50.0,  0.0
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
    }

    function drawScene() {
        //
        var renderingContext =
            scene.graphicsManager.renderingContext;

        // Clear the mainCanvas before we start drawing on it.

        scene.graphicsManager.clear (
            undefined,
            new Color(0.25, 0.25, 0.25, 1.0),
            undefined,
            undefined
        );

        // Draw the square by binding the array buffer to the square's vertices
        // array, setting attributes, and pushing it to GL.

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexPositionBuffer
        );
        
        renderingContext.vertexAttribPointer (
            vertexPositionAttribute,
            3,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );
        
        modelViewMatrix = Matrix4x4.createIdentityMatrix();

        var v = new Vector3D(0, 0, -250);

        modelViewMatrix = Matrix4x4.multiplyMatrices (
            modelViewMatrix,
            Matrix4x4.createTranslationMatrix(v)
        );

        projectionMatrix = Matrix4x4.createProjectionMatrix (
            Math.PI / 4,
            mainCanvas.clientWidth / mainCanvas.clientHeight,
            10,
            100000
        );

        setTransformUniform();
        
        renderingContext.drawArrays (
            WebGLRenderingContext.TRIANGLE_STRIP,
            0,
            4
        );
    }

    function setTransformUniform() {
        //
        var transform =
            projectionMatrix.multiply(modelViewMatrix);

        scene.graphicsManager.renderingContext.uniformMatrix4fv (
            transformUniform,
            false,
            new Float32Array(transform.elements)
        );
    }
});
