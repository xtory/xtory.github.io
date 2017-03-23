function main() {
    //
    'use strict';

    var scene;
    var renderingContext;
    var camera;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var vertexColorAttributeLocation;
    var transformUniformLocation;
    var vertexPositionBuffer;
    var vertexColorBuffer;
    var vertexColorBuffer2;
    var sineEase;
    var transform;
    var rotationY = 0;

    try {
        //
        scene = new Cybo.Xcene();

        renderingContext =
            scene.graphicsManager.renderingContext;

        var p = new Cybo.Vector3D(0, 0, 300);
        var origin = new Cybo.Vector3D(0, 0, 0);

        camera = new Cybo.Camera (
            scene,
            p,
            Cybo.Vector3D.subtractVectors(origin, p)
        );
        
        shaderHelper =
            new Cybo.ShaderHelper(scene.graphicsManager);

        // Set up the shaders; this is where all the lighting for the
        // vertices and so forth is established.
        setUpShaders();

        // Here's where we call the routine that builds all the objects
        // we'll be drawing.
        setUpBuffers();

        sineEase = new Cybo.SineEase(Cybo.EaseMode.EASE_IN_OUT, 2000, true);
        sineEase.start();

        renderingContext.disable(WebGLRenderingContext.CULL_FACE);

        transform = Cybo.Matrix4x4.createIdentityMatrix();
            
        scene.run(undefined, drawScene);

    } catch (e) {
        //
        Cybo.ExceptionHelper.displayMessageOf(e);

        return;
    }

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
                'vertexPosition'
            )
        );
        
        vertexColorAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                shaderProgram,
                'vertexColor'
            )
        );
        
        transformUniformLocation = (
            scene.graphicsManager.getUniformLocation (
                shaderProgram,
                'transform'
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

        var vertexColors = [].concat (
            Cybo.Colors.PHOTOSHOP_DARK_RED.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_YELLOW_ORANGE.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_BLUE.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_GREEN.toArray()
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
            Cybo.Colors.PINK.toArray(),
            Cybo.Colors.PHOTOSHOP_PASTEL_YELLOW_ORANGE.toArray(),
            Cybo.Colors.PHOTOSHOP_PASTEL_BLUE.toArray(),
            Cybo.Colors.PHOTOSHOP_PASTEL_GREEN.toArray()
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
        scene.graphicsManager.clear (
            undefined,
            new Cybo.Color(0.75, 0.5, 0.5, 1)
        );

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

        rotationY = (
            Cybo.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
            sineEase.ratioOfCurrentToTotalTimeOffset
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

        // Set the colors attribute for the vertices.

        // Left square.
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

        setUpTransform(-75, true);
        
        renderingContext.drawArrays (
            WebGLRenderingContext.TRIANGLE_STRIP,
            0,
            4
        );

        // Right square.
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

        setUpTransform(75, false);
        
        renderingContext.drawArrays (
            WebGLRenderingContext.TRIANGLE_STRIP,
            0,
            4
        );
    }

    function setUpTransform(offsetX) {
        //
        var modelMatrix = Cybo.Matrix4x4.createRotationMatrix (
            Cybo.CartesianAxis.Y,
            rotationY
        );

        var v = new Cybo.Vector3D(offsetX, 0, 0);

        modelMatrix = Cybo.Matrix4x4.multiplyMatrices (
            Cybo.Matrix4x4.createTranslationMatrix(v),
            modelMatrix
        );

        camera.getTransform(transform);

        transform = Cybo.Matrix4x4.multiplyMatrices (
            transform,
            modelMatrix
        );

        scene.graphicsManager.setMatrix4x4Uniform (
            transformUniformLocation,
            transform
        );
    }
}
