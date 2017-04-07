function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var scene;
    var gl;
    var vertexBuffers;
    var program;
    var attributeLocations;
    var uniformLocations;
    var mainTexture;

    try {
        //
        scene = new g2l.Xcene();
        gl = scene.graphicsManager.webGLContext;

        document.body.appendChild(gl.canvas);

        setUpTextures();

        setUpShaders();

        scene.run(undefined, drawScene);

    } catch (e) {
        //
        g2l.ExceptionHelper.displayMessageOf(e);

        return;
    }

    //
    // Functions.
    //
    function setUpTextures() {
        //
        var url = // which is relative to index.html, not main.js
            '../../assets/images/jeremy-mann/market-street.jpg';

        mainTexture = scene.assetManager.loadTexture2D(url);
    }

    function setUpShaders() {
        //
        program = scene.assetManager.setUpProgram (
            g2l.TransformedPositionColorTextureCoordinates.VERTEX_SHADER_SOURCE,
            g2l.TransformedPositionColorTextureCoordinates.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexPosition: scene.graphicsManager.getAttributeLocation (
                program,
               'vertexPosition'
            ),

            vertexColor: scene.graphicsManager.getAttributeLocation (
                program,
               'vertexColor'
            ),

            vertexTextureCoordinates: scene.graphicsManager.getAttributeLocation (
                program,
               'vertexTextureCoordinates'
            )
        };

        uniformLocations = {
            //
            sampler: scene.graphicsManager.getUniformLocation (
                program,
               'sampler'
            )
        };
    }

    function drawScene() {
        //
        scene.graphicsManager.clear();

        var p = new g2l.Vector2D (
            gl.canvas.clientWidth * 0.5,
            gl.canvas.clientHeight * 0.5
        );

        var size = new g2l.Vector2D (
            mainTexture.width * 0.5,
            mainTexture.height * 0.5
        );

        setUpGeometries(p.x, p.y, size.x, size.y);

        scene.graphicsManager.program = program;

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color
        );

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates
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

    function setUpGeometries(x, y, w, h) {
        //
        vertexBuffers = {
            position: scene.assetManager.createVertexBuffer(),
            color: scene.assetManager.createVertexBuffer(),
            textureCoordinates: scene.assetManager.createVertexBuffer()
        };

        var viewport = scene.graphicsManager.viewport;

        //
        // Vertex positions.
        //
        var halfWidth = w * 0.5;
        var halfHeight = h * 0.5;

        var vertexPositions = [
            new g2l.Vector3D(x+halfWidth, y-halfHeight, 0),
            new g2l.Vector3D(x+halfWidth, y+halfHeight, 0),
            new g2l.Vector3D(x-halfWidth, y-halfHeight, 0),
            new g2l.Vector3D(x-halfWidth, y+halfHeight, 0) 
        ];

        var vertexPositions2 = [];
        for (var i=0; i<vertexPositions.length; i++) {
            //
            var item = vertexPositions[i];

            var p = g2l.ScreenCoordinateHelper.toClipSpace (
                gl.canvas,
                item
            );

            vertexPositions2 = vertexPositions2.concat(p.toArray());
        }

        vertexBuffers.position.setItems (
            vertexPositions2,
            4
        );

        //
        // Vertex colors.
        //
        var vertexColors = [];

        for (var i=0; i<4; i++) {
            //
            vertexColors = vertexColors.concat (
                g2l.Colors.WHITE.toArray()
            );
        }

        vertexBuffers.color.setItems (
            vertexColors,
            4
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
}
