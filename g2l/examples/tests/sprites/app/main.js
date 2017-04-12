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
        spriteCount = 1000;
        spritePositionOffsets = [];

        var width = 1000;
        var height = 1000;

        for (var i=0; i<spriteCount; i++) {
            //
            spritePositionOffsets.push(new g2l.Vector2D (
                width * (-0.25 + Math.random() * 0.5), // -0.25 ~ 0.25
                height * (-0.25 + Math.random() * 0.5)  // -0.25 ~ 0.25
            ));
        }

        vertexBuffers = [];
        
        for (var i=0; i<spriteCount; i++) {
            //
            vertexBuffers.push ({
                screenPosition: loader.createVertexBuffer(),
                color: loader.createVertexBuffer(),
                textureCoordinates: loader.createVertexBuffer()
            });
        }

        flush();
    }
    
    function setUpShaders() {
        //
        program = loader.setUpProgram (
            Sprite.VERTEX_SHADER_SOURCE,
            Sprite.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexScreenPosition: renderer.getAttributeLocation (
                program,
               'vertexScreenPosition'
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

        //flush();

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

        for (var i=0; i<spriteCount; i++) {
            //
            var item = vertexBuffers[i];

            renderer.setAttribute (
                attributeLocations.vertexScreenPosition,
                item.screenPosition
            );

            renderer.setAttribute (
                attributeLocations.vertexColor,
                item.color
            );

            renderer.setAttribute (
                attributeLocations.vertexTextureCoordinates,
                item.textureCoordinates
            );

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
                item2,
                spriteScreenSize
            )

            var item2 = vertexBuffers[i];

            item2.screenPosition.setItems (
                sprite.vertexPositions,
                g2l.Sprite.POSITION_SIZE2
            );

            item2.color.setItems (
                sprite.vertexColors,
                g2l.Sprite.COLOR_SIZE
            );

            item2.textureCoordinates.setItems (
                sprite.vertexTextureCoordinates,
                g2l.Sprite.TEXTURE_COORDINATE_SIZE
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
        flush();
    }
}
