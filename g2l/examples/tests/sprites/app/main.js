function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var title;
    var renderer;
    var loader;

    // Sprites.
    var spriteBatch;
    var spriteCount;
    var spritePositionOffsets;
    var textures;

    // FPS.
    var info;
    var fps;
    var then;
    var lastAverageFps;

    try {
        //
        title = 'Sprites';

        renderer = new g2l.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        spriteBatch = new g2l.SpriteBatch(renderer);

        setUpTextures();

        setUpSprites();

        setUpInfo();

        setUpStates();

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
        textures = [];

        var urls = [
            '../../assets/images/i2/common/male.png',
            '../../assets/images/i2/common/female.png',
            '../../assets/images/i2/common/car.png',
            '../../assets/images/i2/common/cellPhone.png',
            '../../assets/images/i2/common/creditCard.png'
        ];

        for (var i=0; i<urls.length; i++) {
            textures.push(loader.loadTexture2D(urls[i]));
        }
    }

    function setUpSprites() {
        //
        spriteCount = 1000;
        spritePositionOffsets = [];

        var width = 1250;
        var height = 1250;

        for (var i=0; i<spriteCount; i++) {
            //
            spritePositionOffsets.push(new g2l.Vector2D (
                width * (-0.25 + Math.random() * 0.5), // -0.25 ~ 0.25
                height * (-0.25 + Math.random() * 0.5)  // -0.25 ~ 0.25
            ));
        }
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

    function setUpStates() {
        //
        var gl = renderer.gl;

        gl.enable(gl.BLEND);

        gl.blendFunc (
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA
        );
    }

    function hookEvents() {
        //
        window.addEventListener('resize', onResize);
    }

    function updateScene() {
        //
        fps.update();
    }

    function drawScene() {
        //
        renderer.clear (
            g2l.ClearOptions.COLOR_BUFFER,
            new g2l.Color(0.25, 0.25, 0.25, 1) //g2l.Colors.WHITE 
        );

        drawSprites();

        drawInfo();
    }

    function drawSprites() {
        //
        spriteBatch.begin();

        var center = new g2l.Vector2D (
            renderer.canvas.clientWidth * 0.5,
            renderer.canvas.clientHeight * 0.5
        );

        for (var i=0; i<spriteCount; i++) {
            //
            var item = spritePositionOffsets[i];

            var p = new g2l.Vector3D (
                center.x + item.x,
                center.y + item.y,
                0
            );

            var texture = textures[i % textures.length];

            spriteBatch.drawSprite (
                texture,
                g2l.SpriteCreationOptions.VERTEX_POSITIONS, //undefined,
                p,
                new g2l.Size2D(texture.width*0.5, texture.height*0.5) //size
            );
        }

        spriteBatch.end();
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
        //
        //flush();
    }
}
