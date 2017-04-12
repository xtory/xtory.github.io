function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var title;
    var renderer;
    var loader;
    var spriteBatch;
    var vertexBuffers;
    var program;
    var attributeLocations;
    var uniformLocations;
    var texture;

    // FPS.
    var info;
    var fps;
    var then;
    var lastAverageFps;

    var spriteCount;
    var spritePositionOffsets;

    try {
        //
        title = 'Sprites';

        renderer = new g2l.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = new g2l.Loader(renderer);

        spriteBatch = new g2l.SpriteBatch(renderer);

        setUpTextures();

        setUpSprites();

        setUpShaders();

        setUpInfo();

        hookEvents();

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

    function setUpSprites() {
        //
        spriteCount = 2000;
        spritePositionOffsets = [];

        var width = 1500;
        var height = 1500;

        for (var i=0; i<spriteCount; i++) {
            //
            spritePositionOffsets.push(new g2l.Vector2D (
                width * (-0.25 + Math.random() * 0.5), // -0.25 ~ 0.25
                height * (-0.25 + Math.random() * 0.5)  // -0.25 ~ 0.25
            ));
        }

        vertexBuffers = {
            position: [],
            color: loader.createVertexBuffer(),
            textureCoordinates: loader.createVertexBuffer()
        }
        
        for (var i=0; i<spriteCount; i++) {
            //
            vertexBuffers.position.push(loader.createVertexBuffer());
        }

        vertexBuffers.color.setItems (
            g2l.Sprite.DEFAULT_VERTEX_COLORS,
            g2l.Sprite.COLOR_SIZE
        );

        vertexBuffers.textureCoordinates.setItems (
            g2l.Sprite.DEFAULT_VERTEX_TEXTURE_COORDINATES,
            g2l.Sprite.TEXTURE_COORDINATE_SIZE
        );
    }    
    
    function setUpShaders() {
        //
        program = loader.setUpProgram (
            Sprite.VERTEX_SHADER_SOURCE,
            Sprite.FRAGMENT_SHADER_SOURCE
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
            canvasClientSize: renderer.getUniformLocation (
                program,
               'canvasClientSize'
            ),

            sampler: renderer.getUniformLocation (
                program,
               'sampler'
            )
        };
    }

    function setUpInfo() {
        //
        var left = document.getElementById('left');
        var divs = left.getElementsByTagName('div');

        divs[0].innerHTML = title;

        info = divs[1];
        info.innerHTML = (
            'FPS: 0' + '<br>' +
            'Sprite count: ' + spriteCount
        );
        
        fps = new g2l.Fps();
        then = 0;
        lastAverageFps = 0;
    }

    function hookEvents() {
        window.addEventListener('resize', onResize);
    }

    function updateScene() {
        //
        fps.update();
    }

    function drawScene() {
        //
        renderer.clear();

        flush();

        renderer.program = program;

        renderer.setVector2DUniform (
            // Part 1.
            uniformLocations.canvasClientSize,
            // Part 2.
            new Float32Array ([
                renderer.canvas.clientWidth,
                renderer.canvas.clientHeight            
            ])
        );

        var lastTexture = null;

        renderer.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color
        );

        renderer.setAttribute (
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates
        );
        
        for (var i=0; i<spriteCount; i++) {
            //
            var item = vertexBuffers.position[i];

            renderer.setAttribute (
                attributeLocations.vertexPosition,
                item
            );

            // renderer.setAttribute (
            //     attributeLocations.vertexColor,
            //     item.color
            // );

            // renderer.setAttribute (
            //     attributeLocations.vertexTextureCoordinates,
            //     item.textureCoordinates
            // );

            if (lastTexture !== texture) {
                //
                renderer.setSampler (
                    uniformLocations.sampler,
                    texture
                );

                lastTexture = texture;
            }

            renderer.drawPrimitives (
                g2l.PrimitiveType.TRIANGLE_STRIP,
                0,
                4
            );
        }

        drawInfo();
    }

    function flush() {
        //
        var center = new g2l.Vector2D (
            renderer.canvas.clientWidth * 0.5,
            renderer.canvas.clientHeight * 0.5
        );

        var spriteScreenSize = new g2l.Size2D(50, 50);

        for (var i=0; i<spriteCount; i++) {
            //
            var item = spritePositionOffsets[i];

            var item2 = new g2l.Vector3D (
                center.x + item.x,
                center.y + item.y,
                0
            );

            var sprite = new g2l.Sprite (
                spriteBatch,
                texture,
                g2l.SpriteCreationOptions.VERTEX_POSITIONS,
                item2,
                spriteScreenSize
            )

            var vb = vertexBuffers.position[i];

            vb.setItems (
                sprite.vertexPositions,
                g2l.Sprite.POSITION_SIZE
            );
        }
    }

    function drawInfo() {
        //
        var now = (new Date()).getTime();
        if (now - then < 333.33) { // 333.33 = 1000 / 3
            return;
        }

        then = now;

        var averageFps = fps.average;
        if (averageFps !== lastAverageFps) {
            //
            info.innerHTML = (
                'FPS: ' + averageFps + '<br>' +
                'Sprite count: ' + spriteCount
            );

            lastAverageFps = averageFps;
        }
    }

    //
    // Event handlers.
    //
    function onResize(event) {
        //flush();
    }
}
