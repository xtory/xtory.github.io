function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var title;
    var renderer;
    var loader;

    var world2D;

    // Sprites.
    //var spriteBatch;
    // var spriteCount;
    // var spritePositionOffsets;

    var textures;
    var world2DImages;
    var world2DLineSegments;

    // FPS.
    var info;
    var fps;
    var then;
    var lastAverageFps;

    var isMouseLeftButtonPressed = false;
    var lastMouseScreenPosition;

    try {
        //
        title = 'Painting';

        renderer = new g2l.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        world2D = new g2l.World2D(renderer, {
            'backgroundColor': new g2l.Color(0.5, 0.25, 0.25, 1)
        });

        //spriteBatch = new g2l.SpriteBatch(renderer);

        setUpTextures();

        setUpWorld2DImages();

        setUpWorld2DLineSegments();

        //setUpSprites();

        setUpInfo();

        lastMouseScreenPosition = new g2l.Vector2D(0, 0);

        //setUpStates();

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
            '../../assets/images/i2/common/creditCard.png',
            '../../assets/images/i2/individuals/officer.png',
            '../../assets/images/i2/individuals/spy.png',
            '../../assets/images/i2/transport/airplane.png',
            '../../assets/images/i2/transport/cruiser.png',
            '../../assets/images/i2/transport/motorcycle.png'
        ];

        for (var i=0; i<urls.length; i++) {
            textures.push(loader.loadTexture2D(urls[i]));
        }
    }

    // function setUpSprites() {
    //     //
    //     spriteCount = 1000;
    //     spritePositionOffsets = [];

    //     var width = 1250;
    //     var height = 1250;

    //     for (var i=0; i<spriteCount; i++) {
    //         //
    //         spritePositionOffsets.push(new g2l.Vector2D (
    //             width * (-0.25 + Math.random() * 0.5), // -0.25 ~ 0.25
    //             height * (-0.25 + Math.random() * 0.5)  // -0.25 ~ 0.25
    //         ));
    //     }
    // }

    function setUpWorld2DImages() {
        //
        // spriteCount = 1000;
        // spritePositionOffsets = [];

        // var width = 1250;
        // var height = 1250;

        // for (var i=0; i<spriteCount; i++) {
        //     //
        //     spritePositionOffsets.push(new g2l.Vector2D (
        //         width * (-0.25 + Math.random() * 0.5), // -0.25 ~ 0.25
        //         height * (-0.25 + Math.random() * 0.5)  // -0.25 ~ 0.25
        //     ));
        // }

        world2DImages = [];

        var world2DImage = new g2l.World2DImage (
            world2D,
            textures[0],
            new g2l.Vector2D(0, 0),
            new g2l.Size2D(100, 100)
        );

        world2D.addItem (
            g2l.World2DLayerName.MIDDLE_IMAGES,
            world2DImage
        );

        world2DImages.push(world2DImage);
    }

    function setUpWorld2DLineSegments() {
        //
    }
    
    function setUpInfo() {
        //
        var left = document.getElementById('left');
        var divs = left.getElementsByTagName('div');

        divs[0].innerHTML = title;

        info = divs[1];
        // info.innerHTML = (
        //     'FPS: 0' + '<br>' +
        //     'Sprite count: ' + spriteCount
        // );
        info.innerHTML = 'FPS: 0';
        
        fps = new g2l.Fps();
        then = 0;
        lastAverageFps = 0;
    }

    // function setUpStates() {
    //     //
    //     var gl = renderer.gl;

    //     gl.enable(gl.BLEND);

    //     gl.blendFunc (
    //         gl.SRC_ALPHA,
    //         gl.ONE_MINUS_SRC_ALPHA
    //     );
    // }

    function hookEvents() {
        //
        //window.addEventListener('resize', onResize);

        renderer.canvas.addEventListener('mousedown',  onMouseDown);
        renderer.canvas.addEventListener('mousemove',  onMouseMove);
        renderer.canvas.addEventListener('mouseup',    onMouseUp);
        renderer.canvas.addEventListener('mousewheel', onMouseWheel);
    }

    function updateScene() {
        //
        world2D.update();
        
        fps.update();
    }

    function drawScene() {
        //
        // renderer.clear (
        //     g2l.ClearOptions.COLOR_BUFFER,
        //     new g2l.Color(0.25, 0.25, 0.25, 1) //g2l.Colors.WHITE 
        // );

        // drawSprites();
        world2D.draw();

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
        // if (now - then < 333.33) { // 333.33 = 1000 / 3
        //     return;
        // }

        then = now;

        var averageFps = fps.average;
        //if (averageFps !== lastAverageFps) {
            //
            var world2DImage = world2DImages[0];

            info.innerHTML = (
                'FPS: ' + averageFps + '<br>' +
                'SP: (' + world2DImage.centerScreenPosition.x + ', ' + world2DImage.centerScreenPosition.y + ')'
            );

            lastAverageFps = averageFps;
        //}
    }

    //
    // Event listeners.
    //
    function onMouseDown(event) {
        //
        switch (event.button) {
            //
            case g2l.MouseButton.LEFT: {
                //
                isMouseLeftButtonPressed = true;

                lastMouseScreenPosition =
                    new g2l.Vector2D(event.clientX, -event.clientY);

                break;
            }

            default: {
                break;
            }
        }

        //event.preventDefault();
    }

    function onMouseMove(event) {
        //
        if (isMouseLeftButtonPressed === true) {
            //
            var mouseScreenPosition =
                new g2l.Vector2D(event.clientX, -event.clientY);

            var offset = g2l.Vector2D.subtractVectors (
                mouseScreenPosition,
                lastMouseScreenPosition
            );

            lastMouseScreenPosition = mouseScreenPosition;

            world2D.move (
                g2l.Vector2D.negateVector(offset)
            );
        }

        //event.preventDefault();
    }

    function onMouseUp(event) {
        //
        switch (event.button) {
            //
            case g2l.MouseButton.LEFT: {
                isMouseLeftButtonPressed = false;
                break;
            }

            default: {
                break;
            }
        }

        //event.preventDefault();
    }
    
    function onMouseWheel(event) {
        //
        if (event.wheelDelta === 0) {
            return;
        }

        // var zoomOffset = 250.0;
        // camera.zoom((event.wheelDelta<0) ? -zoomOffset : zoomOffset);

        //event.preventDefault();
    }    
}
