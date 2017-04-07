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
    var starburstTexture;

    try {
        //
        scene = new g2l.Xcene();
        gl = scene.graphicsManager.webGLContext;

        document.body.appendChild(gl.canvas);

        setUpCamera();

        setUpGeometries(0, 0, 500, 500);

        setUpTextures();

        setUpShaders();

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
        var p = new g2l.Vector3D(0, 0, 1250);
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
            position: scene.assetManager.createVertexBuffer(),
            textureCoordinates: scene.assetManager.createVertexBuffer()
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

        vertexBuffers.position.setItems (
            vertexPositions,
            3
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

        vertexBuffers.textureCoordinates.setItems (
            vertexTextureCoordinates,
            2
        );
    }

    function setUpTextures() {
        //
        var url = '../../assets/images/jeremy-mann/market-street.jpg';
        mainTexture = scene.assetManager.loadTexture2D(url);

        url = '../../assets/images/starburst.jpg';
        starburstTexture = scene.assetManager.loadTexture2D(url);        
    }

    function setUpShaders() {
        //
        program = scene.assetManager.setUpProgram (
            Multitexturing.VERTEX_SHADER_SOURCE,
            Multitexturing.FRAGMENT_SHADER_SOURCE
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

            sampler1: scene.graphicsManager.getUniformLocation (
                program,
               'sampler1'
            ),

            sampler2: scene.graphicsManager.getUniformLocation (
                program,
               'sampler2'
            )
        };
    }
    
    function drawScene() {
        //
        scene.graphicsManager.clear();

        scene.graphicsManager.program = program;

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates
        );

        camera.getTransform(transform);

        scene.graphicsManager.setUniform (
            uniformLocations.transform,
            transform
        );
        
        scene.graphicsManager.setSampler (
            uniformLocations.sampler1,
            mainTexture,
            0
        );

        scene.graphicsManager.setSampler (
            uniformLocations.sampler2,
            starburstTexture,
            1
        );

        scene.graphicsManager.drawPrimitives (
            g2l.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
        );
    }
}
