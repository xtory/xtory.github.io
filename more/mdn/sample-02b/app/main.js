"use strict";

//
// main
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function main() {
    //
    var mainCanvas;
    var scene;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var transformUniformLocation;
    var squareVerticesBuffer;
    var modelViewMatrix;
    var projectionMatrix;

    mainCanvas = document.getElementById("mainCanvas");

    scene = new Xcene(mainCanvas);

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
    // Functions
    //
    //
    // setUpShaders
    //
    // Initialize the shaders, so WebGL knows how to light our scene.
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

        shaderProgram =
            shaderHelper.setUpShaderProgram(vertexShader, fragmentShader);

        scene.graphicsManager.shaderProgram = shaderProgram;

        vertexPositionAttributeLocation =
            scene.graphicsManager.getAttributeLocation(shaderProgram, "vertexPosition");

        scene.graphicsManager.enableVertexAttributeArray(vertexPositionAttributeLocation);

        transformUniformLocation =
            scene.graphicsManager.getUniformLocation(shaderProgram, "transform");
    }

    //
    // setUpBuffers
    //
    // Initialize the buffers we'll need. For this demo, we just have
    // one object -- a simple two-dimensional square.
    //
    function setUpBuffers() {
        //
        // Create a buffer for the square's vertices.

        var renderingContext = scene.graphicsManager.renderingContext;

        squareVerticesBuffer = renderingContext.createBuffer();

        // Select the squareVerticesBuffer as the one to apply vertex
        // operations to from here out.

        renderingContext.bindBuffer (
            renderingContext.ARRAY_BUFFER,
            squareVerticesBuffer
        );

        // Now create an array of vertices for the square. Note that the Z
        // coordinate is always 0 here.

        var vertices = [
            50.0,  50.0,  0.0,
           -50.0,  50.0,  0.0,
            50.0, -50.0,  0.0,
           -50.0, -50.0,  0.0
        ];

        // Now pass the list of vertices into WebGL to build the shape. We
        // do this by creating a Float32Array from the JavaScript array,
        // then use it to fill the current vertex buffer.

        renderingContext.bufferData (
            renderingContext.ARRAY_BUFFER,
            new Float32Array(vertices),
            renderingContext.STATIC_DRAW
        );
    }

    //
    // drawScene
    //
    // Draw the scene.
    //
    function drawScene() {
        //
        // Clear the mainCanvas before we start drawing on it.
        scene.graphicsManager.clear();

        // Establish the perspective with which we want to view the
        // scene. Our field of view is 45 degrees, with a width/height
        // ratio of 640:480, and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        projectionMatrix = makePerspective (
            45,
            mainCanvas.clientWidth / mainCanvas.clientHeight,
            10,
            100000
        );

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.

        modelViewMatrix = Matrix.I(4);

        // Now move the drawing position a bit to where we want to start
        // drawing the square.

        var v = Vector.create([-0.0, 0.0, -325.0]);

        modelViewMatrix = modelViewMatrix.multiply (
            Matrix.Translation(v).ensure4x4()
        );

        var renderingContext = scene.graphicsManager.renderingContext;

        // Draw the square by binding the array buffer to the square's vertices
        // array, setting attributes, and pushing it to GL.

        renderingContext.bindBuffer (
            renderingContext.ARRAY_BUFFER,
            squareVerticesBuffer
        );

        renderingContext.vertexAttribPointer (
            vertexPositionAttributeLocation,
            3,
            renderingContext.FLOAT,
            false,
            0,
            0
        );

        var transform = projectionMatrix.multiply(modelViewMatrix);

        renderingContext.uniformMatrix4fv (
            transformUniformLocation,
            false,
            new Float32Array(transform.flatten())
        );

        renderingContext.drawArrays(renderingContext.TRIANGLE_STRIP, 0, 4);
    }
}
