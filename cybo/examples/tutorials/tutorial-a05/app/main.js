function main() {
    //
    'use strict';

    var scene;
    var gl;
    var vertexBuffers;
    var program;
    var attributeLocations;
    var uniformLocations;
    var mainTexture;

    try {
        //
        scene = new Cybo.Xcene();
        gl = scene.graphicsManager.webGLContext;

        setUpTextures();

        setUpShaders();

        scene.run(undefined, drawScene);

    } catch (e) {
        //
        Cybo.ExceptionHelper.displayMessageOf(e);

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
            Cybo.TransformedPositionColorTextureCoordinates.VERTEX_SHADER_SOURCE,
            Cybo.TransformedPositionColorTextureCoordinates.FRAGMENT_SHADER_SOURCE
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

        var viewport = scene.graphicsManager.viewport;

        var p = new Cybo.Vector2D (
            viewport.width * 0.5,
            viewport.height * 0.5
        );

        var size = new Cybo.Vector2D (
            mainTexture.width * 0.5,
            mainTexture.height * 0.5
        );

        setUpGeometries(p.x, p.y, size.x, size.y);

        scene.graphicsManager.program = program;

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position,
            4
        );

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color,
            4
        );

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates,
            2
        );

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

    function setUpGeometries(x, y, w, h) {
        //
        vertexBuffers = {
            position: gl.createBuffer(),
            color: gl.createBuffer(),
            textureCoordinates: gl.createBuffer()
        };

        var viewport = scene.graphicsManager.viewport;

        //
        // Vertex positions.
        //
        var halfWidth = w * 0.5;
        var halfHeight = h * 0.5;

        var vertexPositions = [
            new Cybo.Vector3D(x+halfWidth, y-halfHeight, 0),
            new Cybo.Vector3D(x+halfWidth, y+halfHeight, 0),
            new Cybo.Vector3D(x-halfWidth, y-halfHeight, 0),
            new Cybo.Vector3D(x-halfWidth, y+halfHeight, 0) 
        ];

        var vertexPositions2 = [];
        for (var i=0; i<vertexPositions.length; i++) {
            //
            var item = vertexPositions[i];

            var p = Cybo.ScreenCoordinateHelper.toClipSpace (
                viewport,
                item
            );

            vertexPositions2 = vertexPositions2.concat(p.toArray());
        }

        scene.graphicsManager.setUpVertexBuffer (
            vertexBuffers.position,
            vertexPositions2
        );

        //
        // Vertex colors.
        //
        var vertexColors = [];

        for (var i=0; i<4; i++) {
            //
            vertexColors = vertexColors.concat (
                Cybo.Colors.WHITE.toArray()
            );
        }

        scene.graphicsManager.setUpVertexBuffer (
            vertexBuffers.color,
            vertexColors
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
}
