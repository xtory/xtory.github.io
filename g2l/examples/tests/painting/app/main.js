function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var title;
    var renderer;
    var loader;
    var world2D;

    var textures;
    var world2DImages;
    var world2DImageCount;
    var world2DLineSegments;

    // Info.
    var info;
    var fps;
    var then;

    // Helpers.
    var isMouseLeftButtonPressed;
    var lastMouseScreenPosition;
    var isZooming;

    try {
        //
        title = 'Painting';

        renderer = new g2l.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        setUpWorld2D();

        setUpTextures();

        setUpWorld2DImages();

        setUpWorld2DLineSegments();

        setUpInfo();

        isMouseLeftButtonPressed = false;
        lastMouseScreenPosition = new g2l.Vector2D(0, 0);
        isZooming = false;

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
    function setUpWorld2D() {
        //
        var worldStyle = new g2l.World2DStyle();
        worldStyle.backgroundColor = g2l.Color.DEFAULT_BACKGROUND_COLOR; //new g2l.Color(0.25, 0.25, 0.25, 1);

        world2D = new g2l.World2D(renderer, worldStyle);
    }

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

    function setUpWorld2DImages() {
        //
        world2DImages = [];
        world2DImageCount = 1000;

        var world2DImageSize = new g2l.Size2D(64, 64);

        var halfLength = 5000;
        for (var i=0; i<world2DImageCount; i++) {
            //
            var p = new g2l.Vector2D (
                halfLength * (-0.5 + Math.random()), // -length/2 ~ length/2
                halfLength * (-0.5 + Math.random())  // -length/2 ~ length/2
            );

            var world2DImage = new g2l.World2DImage (
                world2D,
                textures[i % textures.length],
                p,
                world2DImageSize
            );

            world2D.addItem (
                g2l.World2DLayerName.MIDDLE_IMAGES,
                world2DImage
            );

            world2DImages.push(world2DImage);            
        }
    }

    function setUpWorld2DLineSegments() {
        //
    }
    
    function setUpInfo() {
        //
        var divs = (
            document.
            getElementById('info').
            getElementsByTagName('div')
        );

        info = {
            'title': divs[0],
            'fps':   divs[1],
            'more':  divs[2]
        };

        info.title.innerHTML = title;

        info.fps.innerHTML = 'FPS: 0';

        info.more.innerHTML = (
            'World-to-screen scale factor: 1<br>' +
            'Drawn image count: 0<br>' +
            'Drawn line segment count: 0'
        );        
        
        fps = new g2l.Fps();
        then = 0;
    }

    function hookEvents() {
        //
        //window.addEventListener('resize', onResize);

        renderer.canvas.addEventListener('mousedown',  onMouseDown);
        renderer.canvas.addEventListener('mousemove',  onMouseMove);
        renderer.canvas.addEventListener('mouseup',    onMouseUp);
        renderer.canvas.addEventListener('wheel',      onWheel);
    }

    function updateScene() {
        //
        world2D.update();
        
        fps.update();
    }

    function drawScene() {
        //
        world2D.draw();

        drawInfo();
    }

    function drawInfo() {
        //
        var now = (new Date()).getTime();
        if (now - then < 333.33) { // 333.33 = 1000 / 3
            return;
        }

        then = now;

        info.fps.innerHTML = 'FPS: ' + fps.average;

        info.more.innerHTML = (
            'World-to-screen scale factor: '+ world2D.worldToScreenScaleFactor.toFixed(5) + '<br>' +
            'Drawn image count: ' + world2D.drawnImageCount + '<br>' +
            'Drawn line segment count: ' + world2D.drawnLineSegmentCount
        );
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

                // lastMouseScreenPosition =
                //     new g2l.Vector2D(event.clientX, -event.clientY);
                lastMouseScreenPosition = new g2l.Vector2D (
                    event.clientX,
                    renderer.canvas.clientHeight - event.clientY
                );

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
            var mouseScreenPosition = new g2l.Vector2D (
                event.clientX,
                renderer.canvas.clientHeight - event.clientY
            );

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

    function onWheel(event) {
        //
        if (event.deltaY === 0) {
            return;
        }

        if (isZooming === true) {
            return;
        }

        isZooming = true;

        var delta = (event.deltaY < 0) ? 100 : -100;

        world2D.zoomAt (
            new g2l.Vector2D (
                event.clientX,
                renderer.canvas.clientHeight - event.clientY
            ),
            delta,
            undefined,
            function() {
                isZooming = false;
            }
        );
    }
}
