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
    var samplerUniformLocation;
    var vertexPositionBuffer;
    var vertexTextureCoordinateBuffer;
    var transform;
    var mainTexture;

    try {
        //
        scene = new Cybo.Xcene();

        renderingContext =
            scene.graphicsManager.renderingContext;

        setUpCamera();

        setUpShaders();

        setUpBuffers(-30, 30, 640, 560);

        setUpTextures();

        renderingContext.enable(WebGLRenderingContext.BLEND);

        renderingContext.blendFunc (
            WebGLRenderingContext.SRC_ALPHA,
            WebGLRenderingContext.ONE_MINUS_SRC_ALPHA
        );

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
        var p = new Cybo.Vector3D(0, 0, 1250);
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
            Cybo.PositionTextureCoordinates.VERTEX_SHADER_SOURCE
        );

        var fragmentShader = scene.assetManager.loadShader (
            Cybo.ShaderType.FRAGMENT_SHADER,
            Cybo.PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE
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

        samplerUniformLocation = (
            scene.graphicsManager.getShaderUniformLocation (
                shaderProgram,
                'sampler'
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
            '../../assets/images/tree.png';

        mainTexture = scene.assetManager.loadTexture2D(url);
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
            samplerUniformLocation,
            mainTexture
        );

        scene.graphicsManager.drawPrimitives (
            Cybo.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
        );
    }
}
