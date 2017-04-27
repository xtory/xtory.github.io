function main() {
    //
    'use strict';

    var g2l = gorilla.graphicsLibrary;
    var gla = gorilla.linkAnalysis;

    var title;
    var renderer;
    var loader;
    var world; // 2D world.
    var chart;
    var layout;

    var textures;
    var worldImageCount;
    var worldImages;
    var worldLineSegmentCount;
    var worldLineSegments;
    var ends;
    var links;

    // Info.
    var info;
    var fps;
    var then;
    var countOptions;
    var layoutOptions;

    // Helpers.
    var isMouseLeftButtonPressed;
    var lastMouseScreenPosition;
    var isZooming;
    //var isSettingUpWorldItems;

    try {
        //
        title = '2D world';

        renderer = new g2l.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        setUpWorld();

        chart = new gla.Chart();
        layout = chart.layout;

        setUpTextures();

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
        style.backgroundColor = g2l.Colors.WHITE;

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
        //isSettingUpWorldItems = true;
        
        tearDownWorldItems();

        worldImages = [];
        worldLineSegments = [];
        ends = [];
        links = [];

        var worldImageSize = new g2l.Size2D(32, 32); // LA icon's default size: (32, 32)
        var worldLineSegmentThickness = 1.5; // LA link's default thickness: 1.5

        var halfLength = worldImageCount * 50;

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

            ends.push ({
                centerPosition: p
            });
        }

        var net = [];
        for (var i=0; i<worldImageCount; i++) {
            net.push([]);
        }

        var index1 = -1;
        var index2 = -1;
        for (var i=0; i<worldLineSegmentCount; i++) {
            //
            index1 = Math.floor(worldImageCount * Math.random());

            while (true) {
                //
                index2 = Math.floor(worldImageCount * Math.random());
                if (index1 === index2) {
                    continue;
                }

                if (net[index1].length === 0 ||
                    net[index2].length === 0) {
                    break;
                }

                var retry = false;
                var item = net[index1];
                for (var j=0; j<item.length; j++) {
                    //
                    if (item[j] === index2) {
                        retry = true;
                        break;
                    }
                }

                if (retry === false) {
                    break;
                }
            }

            var worldLineSegment = new g2l.World2DLineSegment (
                // Part 1.
                world,
                // Part 2.
                worldImages[index1].centerPosition, worldImages[index2].centerPosition,
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

            links.push ({
                sourceGraphVertexIndex: index1,
                destinationGraphVertexIndex: index2
            });            

            net[index1].push(index2);
            net[index2].push(index1);

            index1 = -1;
            index2 = -1;
        }

       // isSettingUpWorldItems = false;
    }

    function tearDownWorldItems() {
        //
        if (worldLineSegments !== undefined) {
            //
            for (var i=0; i<worldLineSegments.length; i++) {
                //
                world.removeItem(worldLineSegments[i]);
            }
        }

        if (worldImages !== undefined) {
            //
            for (var i=0; i<worldImages.length; i++) {
                //
                world.removeItem(worldImages[i]);
            }
        }
    }

    function setUpInfo() {
        //
        // var divs = (
        //     document.
        //     getElementById('info').
        //     getElementsByTagName('p')
        // );

        info = {
            'title':  document.getElementById('title'),
            'fps':    document.getElementById('fps'),
            'status': document.getElementById('status')
        };

        info.title.innerHTML = title;

        info.fps.innerHTML = 'FPS: 0';

        info.status.innerHTML = (
            'World-to-screen scale factor: 1<br>' +
            'Drawn image count: 0<br>' +
            'Drawn line segment count: 0'
        );        
        
        fps = new g2l.Fps();
        then = 0;

        countOptions = {};
        layoutOptions = {};
        
        var id = 'template-10-20';
        var option = document.getElementById(id);
        option.addEventListener('click', onTemplateClick);
        countOptions[id] = option;

        id = 'template-25-50';
        var option = document.getElementById(id);
        option.addEventListener('click', onTemplateClick);
        countOptions[id] = option;

        id = 'template-50-100';
        var option = document.getElementById(id);
        option.addEventListener('click', onTemplateClick);
        countOptions[id] = option;

        id = 'template-100-200';
        option = document.getElementById(id);
        option.addEventListener('click', onTemplateClick);
        countOptions[id] = option;

        id = 'template-250-500';
        var option = document.getElementById(id);
        option.addEventListener('click', onTemplateClick);
        countOptions[id] = option;

        id = 'template-500-1000';
        var option = document.getElementById(id);
        option.addEventListener('click', onTemplateClick);
        countOptions[id] = option;

        id = 'template-1000-2000';
        option = document.getElementById(id);
        option.addEventListener('click', onTemplateClick);
        countOptions[id] = option;

        id = 'template-2500-5000';
        option = document.getElementById(id);
        option.addEventListener('click', onTemplateClick);
        countOptions[id] = option;

        id = 'circular-layout';
        option = document.getElementById(id);
        option.addEventListener('click', onLayoutClick);        
        layoutOptions[id] = option;

        countOptions['template-50-100'].click();
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

        info.status.innerHTML = (
            'World-to-screen scale factor: '+ world.worldToScreenScaleFactor.toFixed(5) + '<br>' +
            'Drawn image count: ' + world.drawnImageCount + '<br>' +
            'Drawn line segment count: ' + world.drawnLineSegmentCount
        );
    }

    function performLayout() {
        //
        var style = new gla.CircularLayoutStyle();
        layout.startPerformingCircularlayout (
            style,
            ends, links,
            world.centerPosition
        );

        // Test:
        for (var i=0; i<ends.length; i++) {
            //
            var item = layout.getGraphVertexAt(i);
            
            worldImages[i].centerPosition = item;
        }

        for (var i=0; i<links.length; i++) {
            //
            var item = links[i];

            var end1 = worldImages[item.sourceGraphVertexIndex];
            var end2 = worldImages[item.destinationGraphVertexIndex];

            var worldLineSegment = worldLineSegments[i];
            worldLineSegment.startPosition = end1.centerPosition;
            worldLineSegment.finishPosition = end2.centerPosition;
        }
        // :Test
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

    function onTemplateClick(event) {
        //
        // if (isSettingUpWorldItems === true) {
        //     return;
        // }

        if (event.target === countOptions['template-10-20']) {
            //
            worldImageCount = 10;
            worldLineSegmentCount = 20;

            setUpWorldItems();

        } else if (
            event.target === countOptions['template-25-50']
        ){
            worldImageCount = 25;
            worldLineSegmentCount = 50;

            setUpWorldItems();

        } else if (
            event.target === countOptions['template-50-100']
        ){
            worldImageCount = 50;
            worldLineSegmentCount = 100;

            setUpWorldItems();

        } else if (
            event.target === countOptions['template-100-200']
        ){
            worldImageCount = 100;
            worldLineSegmentCount = 200;

            setUpWorldItems();

        } else if (
            event.target === countOptions['template-250-500']
        ){
            worldImageCount = 250;
            worldLineSegmentCount = 500;

            setUpWorldItems();

        } else if (
            event.target === countOptions['template-500-1000']
        ){
            worldImageCount = 500;
            worldLineSegmentCount = 1000;

            setUpWorldItems();

        } else if (
            event.target === countOptions['template-1000-2000']
        ){
            worldImageCount = 1000;
            worldLineSegmentCount = 2000;

            setUpWorldItems();

        } else if (
            event.target === countOptions['template-2500-5000']
        ){
            worldImageCount = 2500;
            worldLineSegmentCount = 5000;

            setUpWorldItems();

        } else {
            //
            throw 'A not-supported exception raised.';
        }

        for (var key in countOptions) {
            //
            if (countOptions.hasOwnProperty(key) === false) {
                continue;
            }

            var item = countOptions[key];

            if (item === event.target) {
                //
                item.style.opacity = '1.0';

            } else {
                //
                item.style.opacity = '0.45';
            }
        }
    }

    function onLayoutClick(event) {
        //
        performLayout();
    }
}
