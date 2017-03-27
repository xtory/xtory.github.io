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
    var modelMatrix;
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
            scene.graphicsManager.getShaderAttributeLocation (
                shaderProgram,
                'vertexPosition'
            )
        );
        
        vertexColorAttributeLocation = (
            scene.graphicsManager.getShaderAttributeLocation (
                shaderProgram,
                'vertexColor'
            )
        );
        
        transformUniformLocation = (
            scene.graphicsManager.getShaderUniformLocation (
                shaderProgram,
                'transform'
            )
        );
    }

    function setUpBuffers() {
        //
        // Vertex positions.
        //
        vertexPositionBuffer =
            renderingContext.createBuffer();

        var vertexPositions = [
            50.0, -50.0,  0.0,
            50.0,  50.0,  0.0,
           -50.0, -50.0,  0.0,
           -50.0,  50.0,  0.0
        ];

        scene.graphicsManager.setUpVertexBuffer (
            vertexPositionBuffer,
            vertexPositions
        );

        //
        // Vertex colors.
        //
        vertexColorBuffer =
            renderingContext.createBuffer();

        var vertexColors = [].concat (
            Cybo.Colors.PHOTOSHOP_DARK_RED.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_YELLOW_ORANGE.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_BLUE.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_GREEN.toArray()
        );

        scene.graphicsManager.setUpVertexBuffer (
            vertexColorBuffer,
            vertexColors
        );

        vertexColorBuffer2 =
            renderingContext.createBuffer();
            
        var vertexColors2 = [].concat (
            Cybo.Colors.PINK.toArray(),
            Cybo.Colors.PHOTOSHOP_PASTEL_YELLOW_ORANGE.toArray(),
            Cybo.Colors.PHOTOSHOP_PASTEL_BLUE.toArray(),
            Cybo.Colors.PHOTOSHOP_PASTEL_GREEN.toArray()
        );

        scene.graphicsManager.setUpVertexBuffer (
            vertexColorBuffer2,
            vertexColors2
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

        rotationY = (
            Cybo.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
            sineEase.ratioOfCurrentToTotalTimeOffset
        );

        modelMatrix = Cybo.Matrix4x4.createRotationMatrix (
            Cybo.CartesianAxis.Y,
            rotationY
        );

        camera.getTransform(transform);

        scene.graphicsManager.setShaderAttribute (
            vertexPositionAttributeLocation,
            vertexPositionBuffer,
            3
        );

        // Left square.
        scene.graphicsManager.setShaderAttribute (
            vertexColorAttributeLocation,
            vertexColorBuffer,
            4
        );

        setUpTransform(-75);
        
        scene.graphicsManager.drawPrimitives (
            WebGLRenderingContext.TRIANGLE_STRIP,
            0,
            4
        );

        // Right square.
        scene.graphicsManager.setShaderAttribute (
            vertexColorAttributeLocation,
            vertexColorBuffer2,
            4
        );

        setUpTransform(75);
        
        scene.graphicsManager.drawPrimitives (
            WebGLRenderingContext.TRIANGLE_STRIP,
            0,
            4
        );
    }

    function setUpTransform(offsetX) {
        //
        var v = new Cybo.Vector3D(offsetX, 0, 0);

        var modelMatrix2 = Cybo.Matrix4x4.multiplyMatrices (
            Cybo.Matrix4x4.createTranslationMatrix(v),
            modelMatrix
        );

        var transform2 = Cybo.Matrix4x4.multiplyMatrices (
            transform,
            modelMatrix2
        );

        scene.graphicsManager.setShaderUniform (
            transformUniformLocation,
            transform2
        );
    }
}
