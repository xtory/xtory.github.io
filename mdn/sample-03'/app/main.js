define ([
    "../../../lib/cybo/3d-vector",
    "../../../lib/cybo/4x4-matrix",
    "../../../lib/cybo/xcene",
    "../../../lib/cybo/assets/shaders/position-color",
    "../../../lib/cybo/graphics/color",
    "../../../lib/cybo/graphics/colors",
    "../../../lib/cybo/graphics/fx/helpers/shader-helper",
    "../../../lib/cybo/graphics/fx/shader-type",
    "../../../lib/cybo/helpers/exception-helper",
], function (
    Vector3D,
    Matrix4x4,
    Scene,
    PositionColor,
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
    var vertexColorAttributeLocation;
    var transformUniformLocation;
    var vertexPositionBuffer;
    var vertexColorBuffer;
    var vertexPositionBuffer2;
    var vertexColorBuffer2;
    var modelViewMatrix;
    var projectionMatrix;

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

    // Set up to draw the scene periodically.
    setInterval(drawScene, 15);

    //
    // Functions.
    //
    function setUpShaders() {
        //
        var vertexShader = scene.assetManager.loadShader (
            ShaderType.VERTEX_SHADER,
            PositionColor.VERTEX_SHADER_SOURCE
        );
            
        var fragmentShader = scene.assetManager.loadShader (
            ShaderType.FRAGMENT_SHADER,
            PositionColor.FRAGMENT_SHADER_SOURCE
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

        // *Test*
        var renderingContext =
            scene.graphicsManager.renderingContext;

        renderingContext.vertexAttribPointer (
            vertexPositionAttributeLocation,
            3,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );        
        // *_Test*

        vertexColorAttributeLocation =
            scene.graphicsManager.getAttributeLocation("vertexColor");
        
        scene.graphicsManager.enableVertexAttributeArray (
            vertexColorAttributeLocation
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
           -50.0,   50.0,  0.0,
           -150.0,  50.0,  0.0,
           -50.0,  -50.0,  0.0,
           -150.0, -50.0,  0.0
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

        var vertexPositions2 = [
            150.0,  50.0,  0.0,
            50.0,   50.0,  0.0,
            150.0, -50.0,  0.0,
            50.0,  -50.0,  0.0
        ];

        vertexPositionBuffer2 =
            renderingContext.createBuffer();

        // Select the vertexPositionBuffer as the one to apply vertex
        // operations to from here out.

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexPositionBuffer2
        );
        
        // Now pass the list of vertex positions into WebGL to build the shape.
        // We do this by creating a Float32Array from the JavaScript array, then
        // use it to fill the current vertex buffer.

        renderingContext.bufferData (
            WebGLRenderingContext.ARRAY_BUFFER,
            new Float32Array(vertexPositions2),
            WebGLRenderingContext.STATIC_DRAW
        );

        // Now set up the colors for the vertices

        var vertexColors = [].concat (
            Colors.PHOTOSHOP_DARK_RED.toArray(),
            Colors.PHOTOSHOP_DARK_YELLOW_ORANGE.toArray(),
            Colors.PHOTOSHOP_DARK_BLUE.toArray(),
            Colors.PHOTOSHOP_DARK_GREEN.toArray()
        );

        vertexColorBuffer =
            renderingContext.createBuffer();

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexColorBuffer
        );

        renderingContext.bufferData (
            WebGLRenderingContext.ARRAY_BUFFER,
            new Float32Array(vertexColors),
            WebGLRenderingContext.STATIC_DRAW
        );

        var vertexColors2 = [].concat (
            Colors.PINK.toArray(),
            Colors.PHOTOSHOP_PASTEL_YELLOW_ORANGE.toArray(),
            Colors.PHOTOSHOP_PASTEL_BLUE.toArray(),
            Colors.PHOTOSHOP_PASTEL_GREEN.toArray()
        );

        vertexColorBuffer2 =
            renderingContext.createBuffer();

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexColorBuffer2
        );

        renderingContext.bufferData (
            WebGLRenderingContext.ARRAY_BUFFER,
            new Float32Array(vertexColors2),
            WebGLRenderingContext.STATIC_DRAW
        );
    }

    function drawScene() {
        //
        var renderingContext =
            scene.graphicsManager.renderingContext;

        scene.graphicsManager.clear();

        var v = new Vector3D(0, 0, -325);

        modelViewMatrix = Matrix4x4.createTranslationMatrix(v);

        projectionMatrix = Matrix4x4.createProjectionMatrix (
            undefined,
            mainCanvas.clientWidth / mainCanvas.clientHeight,
            undefined,
            undefined
        );
        
        var transform =
            projectionMatrix.multiply(modelViewMatrix);

        scene.graphicsManager.renderingContext.uniformMatrix4fv (
            transformUniformLocation,
            false,
            new Float32Array(transform.elements)
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
        
        renderingContext.drawArrays (
            WebGLRenderingContext.TRIANGLE_STRIP,
            0,
            4
        );

        // Part 2.
        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexPositionBuffer2
        );
        
        renderingContext.vertexAttribPointer (
            vertexPositionAttributeLocation,
            3,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexColorBuffer2
        );

        renderingContext.vertexAttribPointer (
            vertexColorAttributeLocation,
            4,
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
});
