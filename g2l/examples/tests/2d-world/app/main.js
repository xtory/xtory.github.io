function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var title;
    var renderer;
    var loader;
    var world; // 2D world.

    var textures;
    var worldImages;
    var worldLineSegments;
    var worldImageCount;

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
        title = '2D world';

        renderer = new g2l.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        setUpWorld();

        setUpTextures();

        setUpWorldItems();

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
    function setUpWorld() {
        //
        var style = new g2l.World2DStyle();
        style.backgroundColor = g2l.Color.DEFAULT_BACKGROUND_COLOR;

        world = new g2l.World2D(renderer, style);
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

    function setUpWorldItems() {
        //
        worldImages = [];
        worldLineSegments = [];

        worldImageCount = 500; //2000;

        var worldImageSize = new g2l.Size2D(32, 32); // LA icon's default size: (32, 32)
        var worldLineSegmentThickness = 1.5; // LA link's default thickness: 1.5

        var halfLength = 5000;
        for (var i=0; i<worldImageCount; i++) {
            //
            var p = new g2l.Vector2D (
                halfLength * (-0.5 + Math.random()), // -length/2 ~ length/2
                halfLength * (-0.5 + Math.random())  // -length/2 ~ length/2
            );

            var worldImage = new g2l.World2DImage (
                // Part 1.
                world,
                // Part 2.
                textures[i % textures.length],
                // Part 3.
                p,
                // Part 4.
                worldImageSize
                // Part 5.
                //undefined, //new g2l.Rect(0.25, 0.25, 0.5, 0.5),
                // Part 6.
                //new g2l.Color(0.5, 0.25, 0.25, 1)
            );

            world.addItem (
                g2l.World2DLayerName.MIDDLE_IMAGES,
                worldImage
            );

            worldImages.push(worldImage);
        }

        for (var i=1; i<worldImages.length; i++) {
            //
            var item1 = worldImages[i - 1];
            var item2 = worldImages[i];

            var worldLineSegment = new g2l.World2DLineSegment (
                // Part 1.
                world,
                // Part 2.
                item1.centerPosition, item2.centerPosition,
                // Part 3.
                worldLineSegmentThickness,
                // Part 4.
                new g2l.Color (
                    Math.random(), Math.random(), Math.random(), 0.5
                )
            );

            world.addItem (
                g2l.World2DLayerName.LINE_SEGMENTS_BELOW_MIDDLE_IMAGES,
                worldLineSegment
            );

            worldLineSegments.push(worldLineSegment);
        }
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
        world.update();
        
        fps.update();
    }

    function drawScene() {
        //
        world.draw();

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
            'World-to-screen scale factor: '+ world.worldToScreenScaleFactor.toFixed(5) + '<br>' +
            'Drawn image count: ' + world.drawnImageCount + '<br>' +
            'Drawn line segment count: ' + world.drawnLineSegmentCount
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

            world.move (
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

        world.zoomAt (
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
