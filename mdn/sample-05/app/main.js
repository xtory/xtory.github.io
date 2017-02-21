define ([
    "../../../lib/3d-engine/3d-vector",
    "../../../lib/3d-engine/4x4-matrix",
    "../../../lib/3d-engine/cartesian-axis",
    "../../../lib/3d-engine/xcene",
    "../../../lib/3d-engine/graphics/color",
    "../../../lib/3d-engine/graphics/colors",
    "../../../lib/3d-engine/graphics/fx/helpers/shader-helper",
    "../../../lib/3d-engine/graphics/fx/shader-type",
    "../../../lib/3d-engine/assets/shaders/position-color"
], function (
    Vector3D,
    Matrix4x4,
    CartesianAxis,
    Scene,
    Color,
    Colors,
    ShaderHelper,
    ShaderType,
    PositionColor
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
    var indexBuffer;
    var modelViewMatrix;
    var projectionMatrix;

    var rotationX = 0; // in radians.
    var rotationY = 0; // in radians.

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
            //
            // Front face.
           -50, -50,  50,
            50, -50,  50,
            50,  50,  50,
           -50,  50,  50,
            
            // Back face.
           -50, -50, -50,
           -50,  50, -50,
            50,  50, -50,
            50, -50, -50,
            
            // Top face.
           -50,  50, -50,
           -50,  50,  50,
            50,  50,  50,
            50,  50, -50,
            
            // Bottom face.
           -50, -50, -50,
            50, -50, -50,
            50, -50,  50,
           -50, -50,  50,
            
            // Right face.
            50, -50, -50,
            50,  50, -50,
            50,  50,  50,
            50, -50,  50,
            
            // Left face.
           -50, -50, -50,
           -50, -50,  50,
           -50,  50,  50,
           -50,  50, -50
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

        // Now set up the colors for the vertices

        var faceColors = [
            Colors.PHOTOSHOP_DARK_RED.toArray(),
            Colors.PHOTOSHOP_DARK_YELLOW_ORANGE.toArray(),
            Colors.PHOTOSHOP_DARK_GREEN.toArray(),
            Colors.PHOTOSHOP_DARK_GREEN_CYAN.toArray(),
            Colors.PHOTOSHOP_DARK_BLUE.toArray(),
            Colors.PHOTOSHOP_DARK_VIOLET.toArray(),
        ];

        var vertexColors = [];

        for (var i=0; i<6; i++) {
            //
            var item = faceColors[i];

            // Repeat each color four times for the four vertices of the face

            for (var j=0; j<4; j++) {
                vertexColors = vertexColors.concat(item);
            }
        }

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

        // Build the element array buffer; this specifies the indices
        // into the vertex array for each face's vertices.

        indexBuffer =
            renderingContext.createBuffer();

        renderingContext.bindBuffer (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            indexBuffer
        );

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        var vertexIndices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23    // left
        ]

        // Now send the element array to GL

        renderingContext.bufferData (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(vertexIndices),
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

        // renderingContext.bindBuffer (
        //     WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
        //     indexBuffer
        // );

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

        setTransformUniform();

        renderingContext.bindBuffer (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            indexBuffer
        );
        
        // renderingContext.drawArrays (
        //     WebGLRenderingContext.TRIANGLE_STRIP,
        //     0,
        //     4
        // );
        renderingContext.drawElements (
            WebGLRenderingContext.TRIANGLES,
            36,
            WebGLRenderingContext.UNSIGNED_SHORT,
            0
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
