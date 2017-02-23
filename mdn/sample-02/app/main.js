define ([
    "../../../lib/cybo/3d-vector",
    "../../../lib/cybo/4x4-matrix",
    "../../../lib/cybo/xcene",
    "../../../lib/cybo/assets/shaders/position-only",
    "../../../lib/cybo/graphics/color",
    "../../../lib/cybo/graphics/fx/helpers/shader-helper",
    "../../../lib/cybo/graphics/fx/shader-type",
    "../../../lib/cybo/helpers/exception-helper",
], function (
    Vector3D,
    Matrix4x4,
    Scene,
    PositionOnly,
    Color,
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
    var transformUniformLocation;
    var vertexPositionBuffer;
    var modelViewMatrix;
    var projectionMatrix;

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

        vertexPositionAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                shaderProgram,
                "vertexPosition"
            )
        );
        
        transformUniformLocation = (
            scene.graphicsManager.getUniformLocation (
                shaderProgram,
                "transform"
            )
        );
    }

    function setUpBuffers() {
        //
        // Create a buffer for the square's vertex positions.

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

        renderingContext.drawArrays (
            WebGLRenderingContext.TRIANGLE_STRIP,
            0,
            4
        );
    }

    function setUpTransform() {
        //
        var v = new Vector3D(0, 0, -275);
        modelViewMatrix = Matrix4x4.createTranslationMatrix(v);

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
