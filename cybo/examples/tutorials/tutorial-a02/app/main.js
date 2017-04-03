function main() {
    //
    'use strict';

    var scene;
    var gl;
    var camera;
    var vertexBuffers;
    var program;
    var attributeLocations;
    var uniformLocations;
    var sineEase;
    var transform;
    var mainTexture;

    try {
        //
        scene = new Cybo.Xcene();
        gl = scene.graphicsManager.webGLContext;

        setUpCamera();

        setUpGeometries(0, 0, 500, 500);

        setUpTextures();

        setUpShaders();

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

    function setUpGeometries(x, y, w, h) {
        //
        vertexBuffers = {
            position: gl.createBuffer(),
            textureCoordinates: gl.createBuffer()
        };

        //
        // Vertex positions.
        //
        var halfWidth = w * 0.5;
        var halfHeight = h * 0.5;

        var vertexPositions = [
            x+halfWidth, y-halfHeight, 0,
            x+halfWidth, y+halfHeight, 0,
            x-halfWidth, y-halfHeight, 0,
            x-halfWidth, y+halfHeight, 0
        ];        

        scene.graphicsManager.setUpVertexBuffer (
            vertexBuffers.position,
            vertexPositions
        );

        //
        // Vertex texture coordinates.
        //
        var vertexTextureCoordinates = [
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 1.0
        ];

        scene.graphicsManager.setUpVertexBuffer (
            vertexBuffers.textureCoordinates,
            vertexTextureCoordinates
        );
    }

    function setUpTextures() {
        //
        var url = // which is relative to index.html, not main.js
            '../../assets/images/jeremy-mann/market-street.jpg';

        mainTexture = scene.assetManager.loadTexture2D(url);
    }

    function setUpShaders() {
        //
        program = scene.assetManager.setUpProgram (
            Cybo.PositionTextureCoordinates.VERTEX_SHADER_SOURCE,
            Cybo.PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexPosition: scene.graphicsManager.getAttributeLocation (
                program,
               'vertexPosition'
            ),

            vertexTextureCoordinates: scene.graphicsManager.getAttributeLocation (
                program,
               'vertexTextureCoordinates'
            )
        };

        uniformLocations = {
            //
            transform: scene.graphicsManager.getUniformLocation (
                program,
               'transform'
            ),

            sampler: scene.graphicsManager.getUniformLocation (
                program,
               'sampler'
            )
        };
    }

    function drawScene() {
        //
        scene.graphicsManager.clear();

        scene.graphicsManager.program = program;

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position,
            3
        );

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates,
            2
        );

        setUpTransform();

        scene.graphicsManager.setSampler (
            uniformLocations.sampler,
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

        scene.graphicsManager.setUniform (
            uniformLocations.transform,
            transform
        );
    } 
}
