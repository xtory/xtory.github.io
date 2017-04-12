function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var renderer;
    var loader;
    var vertexBuffers;
    var program;
    var attributeLocations;
    var uniformLocations;
    var texture;

    try {
        //
        renderer = new g2l.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = new g2l.Loader(renderer);

        setUpTextures();

        setUpShaders();

        renderer.run(updateScene, drawScene);

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

        texture = loader.loadTexture2D(url);
    }

    function setUpShaders() {
        //
        program = loader.setUpProgram (
            g2l.TransformedPositionColorTextureCoordinates.VERTEX_SHADER_SOURCE,
            g2l.TransformedPositionColorTextureCoordinates.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexPosition: renderer.getAttributeLocation (
                program,
               'vertexPosition'
            ),

            vertexColor: renderer.getAttributeLocation (
                program,
               'vertexColor'
            ),

            vertexTextureCoordinates: renderer.getAttributeLocation (
                program,
               'vertexTextureCoordinates'
            )
        };

        uniformLocations = {
            //
            sampler: renderer.getUniformLocation (
                program,
               'sampler'
            )
        };
    }

    function updateScene() {
        //
        // No contents.
    }

    function drawScene() {
        //
        renderer.clear();

        var p = new g2l.Vector2D (
            renderer.canvas.clientWidth * 0.5,
            renderer.canvas.clientHeight * 0.5
        );

        var size = new g2l.Vector2D (
            texture.width * 0.5,
            texture.height * 0.5
        );

        setUpGeometries(p.x, p.y, size.x, size.y);

        renderer.program = program;

        renderer.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        renderer.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color
        );

        renderer.setAttribute (
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates
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

    function setUpGeometries(x, y, w, h) {
        //
        vertexBuffers = {
            position: loader.createVertexBuffer(),
            color: loader.createVertexBuffer(),
            textureCoordinates: loader.createVertexBuffer()
        };

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
                renderer.canvas,
                item
            );

            vertexPositions2 = vertexPositions2.concat(p.toArray());
        }

        var vertexPositions3 = new Float32Array(vertexPositions2);

        vertexBuffers.position.setItems (
            vertexPositions3,
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

        var vertexColors2 = new Float32Array(vertexColors);

        vertexBuffers.color.setItems (
            vertexColors2,
            4
        );

        //
        // Vertex texture coordinates.
        //
        var vertexTextureCoordinates = new Float32Array ([
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 1.0
        ]);

        vertexBuffers.textureCoordinates.setItems (
            vertexTextureCoordinates,
            2
        );
    } 
}
