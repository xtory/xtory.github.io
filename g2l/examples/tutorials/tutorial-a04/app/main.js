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
    var texture1;
    var texture2;

    try {
        //
        scene = new g2l.Scene();
        gl = scene.renderer.webGLContext;

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
            position: scene.loader.createVertexBuffer(),
            textureCoordinates: scene.loader.createVertexBuffer()
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
        texture1 = scene.loader.loadTexture2D(url);

        url = '../../assets/images/starburst.jpg';
        texture2 = scene.loader.loadTexture2D(url);        
    }

    function setUpShaders() {
        //
        program = scene.loader.setUpProgram (
            Multitexturing.VERTEX_SHADER_SOURCE,
            Multitexturing.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexPosition: scene.renderer.getAttributeLocation (
                program,
               'vertexPosition'
            ),

            vertexTextureCoordinates: scene.renderer.getAttributeLocation (
                program,
               'vertexTextureCoordinates'
            )
        };

        uniformLocations = {
            //
            transform: scene.renderer.getUniformLocation (
                program,
               'transform'
            ),

            sampler1: scene.renderer.getUniformLocation (
                program,
               'sampler1'
            ),

            sampler2: scene.renderer.getUniformLocation (
                program,
               'sampler2'
            )
        };
    }
    
    function drawScene() {
        //
        scene.renderer.clear();

        scene.renderer.program = program;

        scene.renderer.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        scene.renderer.setAttribute (
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates
        );

        camera.getTransform(transform);

        scene.renderer.setUniform (
            uniformLocations.transform,
            transform
        );
        
        scene.renderer.setSampler (
            uniformLocations.sampler1,
            texture1,
            0
        );

        scene.renderer.setSampler (
            uniformLocations.sampler2,
            texture2,
            1
        );

        scene.renderer.drawPrimitives (
            g2l.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
        );
    }
}
