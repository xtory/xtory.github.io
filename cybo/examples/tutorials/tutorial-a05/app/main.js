function main() {
    //
    'use strict';

    var scene;
    var gl;
    var shaderProgram;
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
        shaderProgram = scene.assetManager.setUpShaderProgram (
            Cybo.TransformedPositionColorTextureCoordinates.VERTEX_SHADER_SOURCE,
            Cybo.TransformedPositionColorTextureCoordinates.FRAGMENT_SHADER_SOURCE
        );

        vertexPositionAttributeLocation = (
            scene.graphicsManager.getShaderAttributeLocation (
                shaderProgram,
               'vertexPosition'
            )
        );

        vertexColorAttributeLocation = (
            scene.graphicsManager.getShaderAttributeLocation (
                shaderProgram,
               'vertexColor'
            )
        );

        vertexTextureCoordinateAttributeLocation = (
            scene.graphicsManager.getShaderAttributeLocation (
                shaderProgram,
               'vertexTextureCoordinates'
            )
        );

        samplerUniformLocation = (
            scene.graphicsManager.getShaderUniformLocation (
                shaderProgram,
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

        scene.graphicsManager.shaderProgram =
            shaderProgram;

        scene.graphicsManager.setShaderAttribute (
            vertexPositionAttributeLocation,
            vertexPositionBuffer,
            4
        );

        scene.graphicsManager.setShaderAttribute (
            vertexColorAttributeLocation,
            vertexColorBuffer,
            4
        );

        scene.graphicsManager.setShaderAttribute (
            vertexTextureCoordinateAttributeLocation,
            vertexTextureCoordinateBuffer,
            2
        );

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

    function setUpGeometries(x, y, w, h) {
        //
        // Vertex positions.
        //
        var viewport = scene.graphicsManager.viewport;

        vertexPositionBuffer =
            gl.createBuffer();
            
        var halfWidth = w * 0.5;
        var halfHeight = h * 0.5;

        var vertexPositions = [
            new Cybo.Vector2D(x+halfWidth, y-halfHeight),
            new Cybo.Vector2D(x+halfWidth, y+halfHeight),
            new Cybo.Vector2D(x-halfWidth, y-halfHeight),
            new Cybo.Vector2D(x-halfWidth, y+halfHeight)
        ];

        var vertexPositions2 = [];
        for (var i=0; i<vertexPositions.length; i++) {
            //
            var item = vertexPositions[i];

            var p = viewport.toNormalizedDeviceSpace(item);

            vertexPositions2.push(p.x);
            vertexPositions2.push(p.y);
            vertexPositions2.push(0); // z.
            vertexPositions2.push(1); // w.
        }

        scene.graphicsManager.setUpVertexBuffer (
            vertexPositionBuffer,
            vertexPositions2 //vertexPositions
        );

        //
        // Vertex colors.
        //
        vertexColorBuffer =
            gl.createBuffer();
            
        var halfWidth = w / 2;
        var halfHeight = h / 2;

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
        vertexTextureCoordinateBuffer =
            gl.createBuffer();
            
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
