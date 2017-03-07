function main() {
    //
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
    var indexBuffer;
    var sineEase;
    var sineEase2;
    var modelViewMatrix;
    var projectionMatrix;

    mainCanvas = document.getElementById("mainCanvas");

    try {
        scene = new Cybo.Xcene(mainCanvas);
    } catch (e) {
        Cybo.ExceptionHelper.displayMessageOf(e);
        return;
    }

    renderingContext =
        scene.graphicsManager.renderingContext;
    
    shaderHelper = new Cybo.ShaderHelper(scene.graphicsManager);

    // Set up the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    setUpShaders();

    // Here's where we call the routine that builds all the objects
    // we'll be drawing.
    setUpBuffers();

    sineEase = new Cybo.SineEase(Cybo.EaseMode.EASE_IN_OUT, 1500, true);
    sineEase.start();

    sineEase2 = new Cybo.SineEase(Cybo.EaseMode.EASE_IN_OUT, 3000, true);
    sineEase2.start();

    // Set up to draw the scene periodically.
    setInterval(drawScene, 15);

    //
    // Functions.
    //
    function setUpShaders() {
        //
        var vertexShader = scene.assetManager.loadShader (
            Cybo.ShaderType.VERTEX_SHADER,
            Cybo.PositionColor.VERTEX_SHADER_SOURCE
        );
            
        var fragmentShader = scene.assetManager.loadShader (
            Cybo.ShaderType.FRAGMENT_SHADER,
            Cybo.PositionColor.FRAGMENT_SHADER_SOURCE
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

        // Now set up the colors for the vertices

        var faceColors = [
            Cybo.Colors.PHOTOSHOP_DARK_RED.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_YELLOW_ORANGE.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_GREEN.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_GREEN_CYAN.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_BLUE.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_VIOLET.toArray(),
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

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

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

        // Set the colors attribute for the vertices.

        scene.graphicsManager.enableVertexAttribute (
            vertexColorAttributeLocation
        );

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
        modelViewMatrix = Cybo.Matrix4x4.createRotationMatrix (
            // Part 1.
            Cybo.CartesianAxis.Y,
            // Part 2.
            Cybo.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
            sineEase.ratioOfCurrentToTotalTimeOffset
        );

        modelViewMatrix = Cybo.Matrix4x4.multiplyMatrices (
            Cybo.Matrix4x4.createRotationMatrix (
                // Part 1.
                Cybo.CartesianAxis.X,
                // Part 2.
               -Cybo.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
                sineEase2.ratioOfCurrentToTotalTimeOffset
            ),
            modelViewMatrix
        );

        var v = new Cybo.Vector3D(0, 0, -325);

        modelViewMatrix = Cybo.Matrix4x4.multiplyMatrices (
            Cybo.Matrix4x4.createTranslationMatrix(v),
            modelViewMatrix
        );

        projectionMatrix = Cybo.Matrix4x4.createProjectionMatrix (
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
}
