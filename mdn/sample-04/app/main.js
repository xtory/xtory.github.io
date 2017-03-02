define ([
    "../../../lib/cybo/3d-vector",
    "../../../lib/cybo/4x4-matrix",
    "../../../lib/cybo/cartesian-axis",
    "../../../lib/cybo/xcene",
    "../../../lib/cybo/assets/shaders/position-color",
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
    var renderingContext;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var vertexColorAttributeLocation;
    var transformUniformLocation;
    var vertexPositionBuffer;
    var vertexColorBuffer;
    var vertexColorBuffer2;
    var modelViewMatrix;
    var projectionMatrix;
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

        vertexPositionAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                shaderProgram,
                "vertexPosition"
            )
        );
        
        vertexColorAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                shaderProgram,
                "vertexColor"
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
            renderingContext.ARRAY_BUFFER,
            vertexPositionBuffer
        );
        
        // Now pass the list of vertex positions into WebGL to build the shape.
        // We do this by creating a Float32Array from the JavaScript array, then
        // use it to fill the current vertex buffer.

        renderingContext.bufferData (
            renderingContext.ARRAY_BUFFER,
            new Float32Array(vertexPositions),
            renderingContext.STATIC_DRAW
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
            renderingContext.ARRAY_BUFFER,
            vertexColorBuffer
        );

        renderingContext.bufferData (
            renderingContext.ARRAY_BUFFER,
            new Float32Array(vertexColors),
            renderingContext.STATIC_DRAW
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
            renderingContext.ARRAY_BUFFER,
            vertexColorBuffer2
        );

        renderingContext.bufferData (
            renderingContext.ARRAY_BUFFER,
            new Float32Array(vertexColors2),
            renderingContext.STATIC_DRAW
        );
    }

    function drawScene() {
        //
        // Clear the mainCanvas before we start drawing on it.
        scene.graphicsManager.clear();

        scene.graphicsManager.shaderProgram =
            shaderProgram;

        scene.graphicsManager.enableVertexAttribute (
            vertexPositionAttributeLocation
        );

        // Draw the square by binding the array buffer to the square's vertices
        // array, setting attributes, and pushing it to GL.

        scene.graphicsManager.enableVertexAttribute (
            vertexColorAttributeLocation
        );

        renderingContext.bindBuffer (
            renderingContext.ARRAY_BUFFER,
            vertexPositionBuffer
        );
        
        renderingContext.vertexAttribPointer (
            vertexPositionAttributeLocation,
            3,
            renderingContext.FLOAT,
            false,
            0,
            0
        );

        // Set the colors attribute for the vertices.

        renderingContext.bindBuffer (
            renderingContext.ARRAY_BUFFER,
            vertexColorBuffer
        );

        renderingContext.vertexAttribPointer (
            vertexColorAttributeLocation,
            4,
            renderingContext.FLOAT,
            false,
            0,
            0
        );

        setUpTransform(-100);
        
        renderingContext.drawArrays (
            renderingContext.TRIANGLE_STRIP,
            0,
            4
        );

        renderingContext.bindBuffer (
            renderingContext.ARRAY_BUFFER,
            vertexColorBuffer2
        );

        renderingContext.vertexAttribPointer (
            vertexColorAttributeLocation,
            4,
            renderingContext.FLOAT,
            false,
            0,
            0
        );

        setUpTransform(100);
        
        renderingContext.drawArrays (
            renderingContext.TRIANGLE_STRIP,
            0,
            4
        );

        rotationY += 0.05;
    }

    function setUpTransform(offsetX) {
        //
        modelViewMatrix =
            Matrix4x4.createRotationMatrix(CartesianAxis.Y, rotationY);

        var v = new Vector3D(offsetX, 0, -300);

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
