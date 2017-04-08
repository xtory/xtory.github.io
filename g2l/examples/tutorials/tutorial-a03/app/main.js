function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var renderer;
    var loader;
    var camera;
    var gl;
    var vertexBuffers;
    var program;
    var attributeLocations;
    var uniformLocations;
    var transform;
    var texture;

    try {
        //
        renderer = new g2l.Renderer();
        gl = renderer.webGLContext;
        document.body.appendChild(gl.canvas);

        loader = new g2l.Loader(renderer);

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
            
        renderer.run(undefined, drawScene);

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
            renderer,
            p,
            g2l.Vector3D.subtractVectors(origin, p)
        );
    }

    function setUpGeometries(x, y, w, h) {
        //
        vertexBuffers = {
            position: loader.createVertexBuffer(),
            textureCoordinates: loader.createVertexBuffer()
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
        var url = // which is relative to index.html, not main.js
            '../../assets/images/space.png';

        texture = loader.loadTexture2D(url);
    }

    function setUpShaders() {
        //
        program = loader.setUpProgram (
            g2l.PositionTextureCoordinates.VERTEX_SHADER_SOURCE,
            g2l.PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexPosition: renderer.getAttributeLocation (
                program,
               'vertexPosition'
            ),

            vertexTextureCoordinates: renderer.getAttributeLocation (
                program,
               'vertexTextureCoordinates'
            )
        };

        uniformLocations = {
            //
            transform: renderer.getUniformLocation (
                program,
               'transform'
            ),

            sampler: renderer.getUniformLocation (
                program,
               'sampler'
            )
        };
    }

    function drawScene() {
        //
        renderer.clear();

        renderer.program = program;

        renderer.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        renderer.setAttribute (
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates
        );

        camera.getTransform(transform);

        renderer.setUniform (
            uniformLocations.transform,
            transform
        );
        
        renderer.setSampler (
            uniformLocations.sampler,
            texture
        );

        renderer.drawPrimitives (
            g2l.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
        );
    }
}
