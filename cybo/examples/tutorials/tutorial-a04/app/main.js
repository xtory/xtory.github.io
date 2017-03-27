function main() {
    //
    'use strict';

    var scene;
    var renderingContext;
    var camera;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var vertexTextureCoordinateAttributeLocation;
    var transformUniformLocation;
    var sampler1UniformLocation;
    var sampler2UniformLocation;
    var vertexPositionBuffer;
    var vertexTextureCoordinateBuffer;
    var transform;
    var mainTexture;
    var starburstTexture;

    try {
        //
        scene = new Cybo.Xcene();

        renderingContext =
            scene.graphicsManager.renderingContext;

        var p = new Cybo.Vector3D(0, 0, 1250);
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
        setUpBuffers(0, 0, 500, 500);

        // Sets up the textures.
        setUpTextures();

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
            Multitexturing.VERTEX_SHADER_SOURCE
        );

        var fragmentShader = scene.assetManager.loadShader (
            Cybo.ShaderType.FRAGMENT_SHADER,
            Multitexturing.FRAGMENT_SHADER_SOURCE
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

        vertexTextureCoordinateAttributeLocation = (
            scene.graphicsManager.getShaderAttributeLocation (
                shaderProgram,
                'vertexTextureCoordinates'
            )
        );

        transformUniformLocation = (
            scene.graphicsManager.getShaderUniformLocation (
                shaderProgram,
                'transform'
            )
        );

        sampler1UniformLocation = (
            scene.graphicsManager.getShaderUniformLocation (
                shaderProgram,
                'sampler1'
            )
        );

        sampler2UniformLocation = (
            scene.graphicsManager.getShaderUniformLocation (
                shaderProgram,
                'sampler2'
            )
        );
    }

    function setUpBuffers(x, y, w, h) {
        //
        // Vertex positions.
        //
        vertexPositionBuffer =
            renderingContext.createBuffer();
            
        var halfWidth = w / 2;
        var halfHeight = h / 2;

        var vertexPositions = [
            x+halfWidth, y-halfHeight, 0,
            x+halfWidth, y+halfHeight, 0,
            x-halfWidth, y-halfHeight, 0,
            x-halfWidth, y+halfHeight, 0
        ];        

        scene.graphicsManager.setUpVertexBuffer (
            vertexPositionBuffer,
            vertexPositions
        );

        //
        // Vertex texture coordinates.
        //
        vertexTextureCoordinateBuffer =
            renderingContext.createBuffer();
            
        var vertexTextureCoordinates = [
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 1.0
        ];

        scene.graphicsManager.setUpVertexBuffer (
            vertexTextureCoordinateBuffer,
            vertexTextureCoordinates
        );
    }

    //
    // setUpTextures
    //
    // Initialize the textures we'll be using, then initiate a load of
    // the texture images. The handleTextureLoaded() callback will finish
    // the job; it gets called each time a texture finishes loading.
    //
    function setUpTextures() {
        //
        var url = // which is relative to index.html, not main.js
            //'../../assets/images/mier.jpg';
            '../../assets/images/jeremy-mann/cat.jpg';

        mainTexture = scene.assetManager.loadTexture2D(url);

        url = '../../assets/images/starburst.jpg';

        starburstTexture = scene.assetManager.loadTexture2D(url);        
    }

    function drawScene() {
        //
        scene.graphicsManager.clear (
            undefined,
            Cybo.Colors.CADET_BLUE
        );

        scene.graphicsManager.shaderProgram =
            shaderProgram;

        scene.graphicsManager.setShaderAttribute (
            vertexPositionAttributeLocation,
            vertexPositionBuffer,
            3
        );

        scene.graphicsManager.setShaderAttribute (
            vertexTextureCoordinateAttributeLocation,
            vertexTextureCoordinateBuffer,
            2
        );

        camera.getTransform(transform);

        scene.graphicsManager.setShaderUniform (
            transformUniformLocation,
            transform
        );
        
        scene.graphicsManager.setShaderSampler (
            sampler1UniformLocation,
            mainTexture,
            0
        );

        scene.graphicsManager.setShaderSampler (
            sampler2UniformLocation,
            starburstTexture,
            1
        );

        scene.graphicsManager.drawPrimitives (
            WebGLRenderingContext.TRIANGLE_STRIP,
            0,
            4
        );
    }
}
