function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var scene;
    var gl;
    var camera;
    var vertexBuffers;
    var program;
    var attributeLocations;
    var uniformLocations;
    var transform;
    var mainTexture;

    try {
        //
        scene = new g2l.Xcene();
        gl = scene.graphicsManager.webGLContext;

        setUpCamera();

        setUpGeometries(0, 0, 500, 500);

        setUpTextures();

        setUpShaders();

        gl.enable(gl.BLEND);

        gl.blendFunc (
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA
        );

        transform = g2l.Matrix4x4.createIdentityMatrix();
            
        scene.run(undefined, drawScene);

    } catch (e) {
        //
        g2l.ExceptionHelper.displayMessageOf(e);

        return;
    }

    //
    // Functions.
    //
    function setUpCamera() {
        //
        var p = new g2l.Vector3D(0, 0, 1000);
        var origin = new g2l.Vector3D(0, 0, 0);

        camera = new g2l.Camera (
            scene,
            p,
            g2l.Vector3D.subtractVectors(origin, p)
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
            '../../assets/images/space.png';

        mainTexture = scene.assetManager.loadTexture2D(url);
    }

    function setUpShaders() {
        //
        program = scene.assetManager.setUpProgram (
            g2l.PositionTextureCoordinates.VERTEX_SHADER_SOURCE,
            g2l.PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE
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

        camera.getTransform(transform);

        scene.graphicsManager.setUniform (
            uniformLocations.transform,
            transform
        );
        
        scene.graphicsManager.setSampler (
            uniformLocations.sampler,
            mainTexture
        );

        scene.graphicsManager.drawPrimitives (
            g2l.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
        );
    }
}
