function main() {
    //
    'use strict';

    var scene;
    var gl;
    var program;
    var vertexPositionAttributeLocation;
    var vertexColorAttributeLocation;
    var vertexTextureCoordinateAttributeLocation;
    var samplerUniformLocation;
    var vertexPositionBuffer;
    var vertexColorBuffer;
    var vertexTextureCoordinateBuffer;
    var mainTexture;

    try {
        //
        scene = new Cybo.Xcene();
        gl = scene.graphicsManager.webGLContext;

        setUpShaders();

        setUpTextures();

        scene.run(undefined, drawScene);

    } catch (e) {
        //
        Cybo.ExceptionHelper.displayMessageOf(e);

        return;
    }

    //
    // Functions.
    //
    function setUpShaders() {
        //
        program = scene.assetManager.setUpProgram (
            Cybo.TransformedPositionColorTextureCoordinates.VERTEX_SHADER_SOURCE,
            Cybo.TransformedPositionColorTextureCoordinates.FRAGMENT_SHADER_SOURCE
        );

        vertexPositionAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                program,
               'vertexPosition'
            )
        );

        vertexColorAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                program,
               'vertexColor'
            )
        );

        vertexTextureCoordinateAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                program,
               'vertexTextureCoordinates'
            )
        );

        samplerUniformLocation = (
            scene.graphicsManager.getUniformLocation (
                program,
               'sampler'
            )
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
            vertexPositionAttributeLocation,
            vertexPositionBuffer,
            4
        );

        scene.graphicsManager.setAttribute (
            vertexColorAttributeLocation,
            vertexColorBuffer,
            4
        );

        scene.graphicsManager.setAttribute (
            vertexTextureCoordinateAttributeLocation,
            vertexTextureCoordinateBuffer,
            2
        );

        scene.graphicsManager.setSampler (
            samplerUniformLocation,
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
        // Vertex positions.
        //
        var viewport = scene.graphicsManager.viewport;

        vertexPositionBuffer = gl.createBuffer();
            
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

            // vertexPositions2.push(p.x);
            // vertexPositions2.push(p.y);
            // vertexPositions2.push(p.z);
            // vertexPositions2.push(1.0);
            vertexPositions2 = vertexPositions2.concat(p.toArray());
        }

        scene.graphicsManager.setUpVertexBuffer (
            vertexPositionBuffer,
            vertexPositions2
        );

        //
        // Vertex colors.
        //
        vertexColorBuffer = gl.createBuffer();

        var vertexColors = [];

        for (var i=0; i<4; i++) {
            //
            vertexColors = vertexColors.concat (
                Cybo.Colors.WHITE.toArray()
            );
        }

        scene.graphicsManager.setUpVertexBuffer (
            vertexColorBuffer,
            vertexColors
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
}
