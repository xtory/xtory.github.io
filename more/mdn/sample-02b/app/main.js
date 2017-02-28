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
    var renderingContext;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var transformUniformLocation;
    var squareVerticesBuffer;
    var modelViewMatrix;
    var projectionMatrix;

    mainCanvas = document.getElementById("mainCanvas");

    scene = new Xcene(mainCanvas);

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

        vertexPositionAttributeLocation =
            scene.graphicsManager.getAttributeLocation(shaderProgram, "vertexPosition");

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

        squareVerticesBuffer = renderingContext.createBuffer();

        // Select the squareVerticesBuffer as the one to apply vertex
        // operations to from here out.

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
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
            WebGLRenderingContext.ARRAY_BUFFER,
            new Float32Array(vertices),
            WebGLRenderingContext.STATIC_DRAW
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
        //scene.graphicsManager.clear();
        scene.graphicsManager.clear (
            // Part 1.
            WebGLRenderingContext.COLOR_BUFFER_BIT |
            WebGLRenderingContext.DEPTH_BUFFER_BIT,
            // Part 2.
            new Color(0/255, 52/255, 113/255, 1), // colors.PHOTOSHOP_DARK_BLUE
            undefined,
            undefined
        );

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
            squareVerticesBuffer
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
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        modelViewMatrix = Matrix.I(4);

        // Now move the drawing position a bit to where we want to start
        // drawing the square.

        var v = Vector.create([0.0, 0.0, -275.0]);

        modelViewMatrix = modelViewMatrix.multiply (
            Matrix.Translation(v).ensure4x4()
        );

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

        var transform =
            projectionMatrix.multiply(modelViewMatrix);

        renderingContext.uniformMatrix4fv (
            transformUniformLocation,
            false,
            new Float32Array(transform.flatten())
        );
    }
}
