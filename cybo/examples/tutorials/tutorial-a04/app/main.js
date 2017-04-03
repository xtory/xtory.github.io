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
    var transform;
    var mainTexture;
    var starburstTexture;

    try {
        //
        scene = new Cybo.Xcene();
        gl = scene.graphicsManager.webGLContext;

        setUpCamera();

        setUpGeometries(0, 0, 500, 500);

        setUpTextures();

        setUpShaders();

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
            Cybo.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
        );
    }
}
