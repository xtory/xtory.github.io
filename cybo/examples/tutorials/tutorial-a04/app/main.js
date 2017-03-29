function main() {
    //
    'use strict';

    var scene;
    var gl;
    var camera;
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
        gl = scene.graphicsManager.webGLContext;

        setUpCamera();

        setUpShaders();

        setUpGeometries(0, 0, 500, 500);

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
        shaderProgram = scene.assetManager.setUpShaderProgram (
            Multitexturing.VERTEX_SHADER_SOURCE,
            Multitexturing.FRAGMENT_SHADER_SOURCE
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

    function setUpGeometries(x, y, w, h) {
        //
        // Vertex positions.
        //
        vertexPositionBuffer =
            gl.createBuffer();
            
        var halfWidth = w * 0.5;
        var halfHeight = h * 0.5;

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
            gl.createBuffer();
            
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

    function setUpTextures() {
        //
        var url = '../../assets/images/jeremy-mann/market-street.jpg';
        mainTexture = scene.assetManager.loadTexture2D(url);

        url = '../../assets/images/starburst.jpg';
        starburstTexture = scene.assetManager.loadTexture2D(url);        
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
            Cybo.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
        );
    }
}
