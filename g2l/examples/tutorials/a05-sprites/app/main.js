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

        loader = renderer.loader;

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
            g2l.SpriteBatch.VERTEX_SHADER_SOURCE,
            g2l.SpriteBatch.FRAGMENT_SHADER_SOURCE
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
            shared: {
                //
                canvasClientSize: renderer.getUniformLocation (
                    program,
                    'canvasClientSize'
                )
            },

            unique: {
                //
                color: renderer.getUniformLocation (
                    program,
                    'color'
                ),

                sampler: renderer.getUniformLocation (
                    program,
                    'sampler'
                )
            }
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

        // Sets the shared uniforms.
        renderer.setVector2DUniform (
            uniformLocations.shared.canvasClientSize,
            new Float32Array ([
                renderer.canvas.clientWidth,
                renderer.canvas.clientHeight
            ])
        );

        // Sets the attributes.
        renderer.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        renderer.setAttribute (
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates
        );

        // Sets the unique uniforms.
        renderer.setVector4DUniform (
            uniformLocations.unique.color,
            new Float32Array (
                g2l.Colors.PHOTOSHOP_DARK_GREEN.toArray()
            )
        );

        renderer.setSampler (
            uniformLocations.unique.sampler,
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
            textureCoordinates: loader.createVertexBuffer()
        };

        //
        // Vertex positions.
        //
        var halfWidth = w * 0.5;
        var halfHeight = h * 0.5;

        var vertexPositions = new Float32Array ([
            x+halfWidth, y-halfHeight, 0,
            x+halfWidth, y+halfHeight, 0,
            x-halfWidth, y-halfHeight, 0,
            x-halfWidth, y+halfHeight, 0 
        ]);

        vertexBuffers.position.loadData (
            vertexPositions,
            3
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

        vertexBuffers.textureCoordinates.loadData (
            vertexTextureCoordinates,
            2
        );
    } 
}
