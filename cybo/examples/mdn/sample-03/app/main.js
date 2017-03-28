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
    var transform;

    try {
        //
        scene = new Cybo.Xcene();

        renderingContext =
            scene.graphicsManager.renderingContext;
        
        setUpCamera();

        setUpShaders();

        setUpBuffers();

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
    function setUpCamera() {
        //
        var p = new Cybo.Vector3D(0, 0, 275);
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
    }

    function drawScene() {
        //
        scene.graphicsManager.clear (
            undefined,
            new Cybo.Color(0.75, 0.5, 0.5, 1)
        );

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
        
        camera.getTransform(transform);

        scene.graphicsManager.setShaderUniform (
            transformUniformLocation,
            transform
        );
        
        scene.graphicsManager.drawPrimitives (
            Cybo.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
        );
    }
}
