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
    var samplerUniformLocation;
    var vertexPositionBuffer;
    var vertexTextureCoordinateBuffer;
    var sineEase;
    var transform;
    var mainTexture;

    try {
        //
        scene = new Cybo.Xcene();
        gl = scene.graphicsManager.webGLContext;

        setUpCamera();

        setUpShaders();

        setUpGeometries(0, 0, 500, 500);

        setUpTextures();

        gl.disable(gl.CULL_FACE);

        transform = Cybo.Matrix4x4.createIdentityMatrix();

        sineEase = new Cybo.SineEase(Cybo.EaseMode.EASE_IN_OUT, 1500, true);
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
            Cybo.PositionTextureCoordinates.VERTEX_SHADER_SOURCE,
            Cybo.PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE
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

    function setUpGeometries(x, y, w, h) {
        //
        // Vertex positions.
        //
        vertexPositionBuffer = gl.createBuffer();
            
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
        vertexTextureCoordinateBuffer = gl.createBuffer();
            
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
        var url = // which is relative to index.html, not main.js
            '../../assets/images/jeremy-mann/market-street.jpg';

        mainTexture = scene.assetManager.loadTexture2D(url);
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

        setUpTransform();

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
