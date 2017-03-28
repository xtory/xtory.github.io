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
    var sineEase;
    var transform;

    try {
        //
        scene = new Cybo.Xcene();

        renderingContext =
            scene.graphicsManager.renderingContext;
        
        setUpCamera();

        setUpShaders();

        setUpBuffers();

        renderingContext.disable(WebGLRenderingContext.CULL_FACE);

        transform = Cybo.Matrix4x4.createIdentityMatrix();

        sineEase = new Cybo.SineEase(Cybo.EaseMode.EASE_IN_OUT, 1000, true);
        sineEase.start();
        
        scene.run(undefined, drawScene);

    } catch (e) {
        //
        Cybo.ExceptionHelper.displayMessageOf(e);

        return;
    }

    //
    // Functions.
    //
    function setUpCamera() {
        //
        var p = new Cybo.Vector3D(0, 0, 1750);
        var origin = new Cybo.Vector3D(0, 0, 0);

        camera = new Cybo.Camera (
            scene,
            p,
            Cybo.Vector3D.subtractVectors(origin, p)
        );
    }

    function setUpShaders() {
        //
        shaderHelper =
            new Cybo.ShaderHelper(scene.graphicsManager);

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
              0,  225, 0,
           -250, -150, 0,
            250, -150, 0
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
            Cybo.Colors.PHOTOSHOP_DARK_GREEN.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_BLUE.toArray()
        );

        scene.graphicsManager.setUpVertexBuffer (
            vertexColorBuffer,
            vertexColors
        );
    }

    function drawScene() {
        //
        scene.graphicsManager.clear();

        scene.graphicsManager.shaderProgram =
            shaderProgram;

        scene.graphicsManager.setShaderAttribute (
            vertexPositionAttributeLocation,
            vertexPositionBuffer,
            3
        );

        scene.graphicsManager.setShaderAttribute (
            vertexColorAttributeLocation,
            vertexColorBuffer,
            4
        );
        
        setUpTransform();

        renderingContext.drawArrays (
            Cybo.PrimitiveType.TRIANGLE_STRIP,
            0,
            3
        );
    }

    function setUpTransform() {
        //
        var rotation = Cybo.Quaternion.fromAxisAngle (
            // Part 1.
            Cybo.AxisGroup.Y_AXIS,
            // Part 2.
            Cybo.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
            sineEase.ratioOfCurrentToTotalTimeOffset
        );

        camera.getTransform(transform);

        transform = Cybo.Matrix4x4.multiplyMatrices (
            transform,
            rotation.toMatrix4x4()
        );

        scene.graphicsManager.setShaderUniform (
            transformUniformLocation,
            transform
        );
    }    
}
