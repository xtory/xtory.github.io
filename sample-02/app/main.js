define ([
    "../../lib/3d-engine/3d-vector",
    "../../lib/3d-engine/4x4-matrix",
    "../../lib/3d-engine/xcene",
    "../../lib/3d-engine/graphics/color",
    "../../lib/3d-engine/graphics/fx/helpers/shader-helper",
    "../../lib/3d-engine/graphics/fx/shader-type",
    "../../lib/3d-engine/assets/shaders/position-only"
], function (
    Vector3D,
    Matrix4x4,
    Scene,
    Color,
    ShaderHelper,
    ShaderType,
    PositionOnly
){
    "use strict";
    
    var mainCanvas;
    var scene;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var transformUniformLocation;
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
            ShaderType.VERTEX_SHADER,
            PositionOnly.VERTEX_SHADER_SOURCE
        );
            
        var fragmentShader = scene.assetManager.loadShader (
            ShaderType.FRAGMENT_SHADER,
            PositionOnly.FRAGMENT_SHADER_SOURCE
        );

        shaderProgram = shaderHelper.setUpShaderProgram (
            vertexShader,
            fragmentShader
        );

        scene.graphicsManager.shaderProgram = shaderProgram;

        vertexPositionAttributeLocation =
            scene.graphicsManager.getAttributeLocation("vertexPosition");
        
        scene.graphicsManager.enableVertexAttributeArray (
            vertexPositionAttributeLocation
        );

        transformUniformLocation =
            scene.graphicsManager.getUniformLocation("transform");
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
            vertexPositionAttributeLocation,
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
            undefined,
            mainCanvas.clientWidth / mainCanvas.clientHeight,
            undefined,
            undefined
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
            transformUniformLocation,
            false,
            new Float32Array(transform.elements)
        );
    }
});
