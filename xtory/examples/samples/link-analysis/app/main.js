function main() {
    //
    'use strict';

    var xc = xtory.core;
    var xla = xtory.linkAnalysis;

    var self;
    var title;
    var chart;
    var canvas;
    var world;
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
    var templateOptions;
    var layoutOptions;
    var viewportOptions;

    // Helpers.
    var isMouseLeftButtonPressed;
    var lastMouseScreenPosition;
    var isZooming;

    var state;

    try {
        //
        self = this;

        title = 'Link analysis';

        // renderer = new xc.Renderer();
        // document.body.appendChild(renderer.canvas);

        // loader = renderer.loader;

        // setUpWorld();

        chart = new xla.Chart();

        canvas = chart.renderer.canvas;
        document.body.appendChild(canvas);

        world = chart.world;
        layout = chart.layout;

        setUpTextures();

        setUpInfo();

        isMouseLeftButtonPressed = false;
        lastMouseScreenPosition = new xc.Vector2D(0, 0);
        isZooming = false;

        hookEvents();

        state = new MainStateNormal();

        //chart.run();

    } catch (e) {
        //
        xc.ExceptionHelper.displayMessageOf(e);

        return;
    }

    //
    // Functions.
    //
    // function setUpWorld() {
    //     //
    //     var style = new xc.World2DStyle();
    //     style.backgroundColor = xc.Colors.WHITE;

    //     world = new xc.World2D(renderer, style);
    // }

    function setUpTextures() {
        //
        var loader = chart.renderer.loader;

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
        tearDownWorldItems();

        worldImages = [];
        worldLineSegments = [];
        ends = [];
        links = [];

        var worldImageSize = new xc.Size2D(32, 32); // LA icon's default size: (32, 32)
        var worldLineSegmentThickness = 1.5; // LA link's default thickness: 1.5

        var halfLength = worldImageCount * 50;

        var center = world.centerPosition;

        for (var i=0; i<worldImageCount; i++) {
            //
            var p = xc.Vector2D.addVectors (
                center,
                new xc.Vector2D (
                    halfLength * (-0.5 + Math.random()), // -length/2 ~ length/2
                    halfLength * (-0.5 + Math.random())  // -length/2 ~ length/2
                )
            );

            var worldImage = new xc.World2DImage (
                // Part 1.
                world,
                // Part 2.
                textures[i % textures.length],
                // Part 3.
                p,
                // Part 4.
                worldImageSize
                // Part 5.
                //undefined, //new xc.Rect(0.25, 0.25, 0.5, 0.5),
                // Part 6.
                //new xc.Color(0.5, 0.25, 0.25, 1)
            );

            world.addItem (
                xc.World2DLayerName.MIDDLE_IMAGES,
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

        var chartStyle = chart.style;

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

            var worldLineSegment = new xc.World2DLineSegment (
                // Part 1.
                world,
                // Part 2.
                //worldImages[index1].centerPosition, worldImages[index2].centerPosition,
                worldImages[index1].centerPosition.clone(),
                worldImages[index2].centerPosition.clone(),
                // Part 3.
                worldLineSegmentThickness,
                // Part 4.
                new xc.Color (
                    Math.random(), Math.random(), Math.random(), 0.5
                )
            );

            var style = worldLineSegment.style;
            style.boundsScreenThickness = chartStyle.boundsLinkScreenThickness;
            style.minScreenThickness = chartStyle.minLinkScreenThickness;
            style.maxScreenThickness = chartStyle.maxLinkScreenThickness;
            worldLineSegment.style = style;

            world.addItem (
                xc.World2DLayerName.LINE_SEGMENTS_BELOW_MIDDLE_IMAGES,
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
        
        fps = new xc.Fps();
        then = 0;

        templateOptions = {};
        layoutOptions = {};
        viewportOptions = {};
        
        var id = 'template-10-20';
        var option = document.getElementById(id);
        templateOptions[id] = option;

        id = 'template-25-50';
        var option = document.getElementById(id);
        templateOptions[id] = option;

        id = 'template-50-100';
        var option = document.getElementById(id);
        templateOptions[id] = option;

        id = 'template-100-200';
        option = document.getElementById(id);
        templateOptions[id] = option;

        id = 'template-250-500';
        var option = document.getElementById(id);
        templateOptions[id] = option;

        id = 'template-500-1000';
        var option = document.getElementById(id);
        templateOptions[id] = option;

        id = 'template-1000-2000';
        option = document.getElementById(id);
        templateOptions[id] = option;

        // id = 'template-2500-5000';
        // option = document.getElementById(id);
        // templateOptions[id] = option;
        // id = 'template-3000-3000';
        // option = document.getElementById(id);
        // templateOptions[id] = option;
        id = 'template-2500-5000';
        option = document.getElementById(id);
        templateOptions[id] = option;

        for (var key in templateOptions) {
            //
            if (templateOptions.hasOwnProperty(key) === false) {
                continue;
            }

            var item = templateOptions[key];
            item.addEventListener('click', onTemplateClick);
        }

        id = 'circular-layout';
        option = document.getElementById(id);
        layoutOptions[id] = option;

        for (var key in layoutOptions) {
            //
            if (layoutOptions.hasOwnProperty(key) === false) {
                continue;
            }

            var item = layoutOptions[key];
            item.addEventListener('click', onLayoutClick);
        }

        templateOptions['template-50-100'].click();
    }

    function hookEvents() {
        //
        //renderer.run(updateScene, drawScene);
        // chart.updating.push(onChartUpdating);
        // chart.updated.push(onChartUpdated);
        // chart.drawing.push(onChartDrawing);
        // chart.drew.push(onChartDrew);

        // if (xc.ArrayHelper.contains(chart.updating, onChartUpdating) === true) {
        //     xc.ArrayHelper.remove(chart.updating, onChartUpdating);
        // }
        xc.EventTargetHelper.addEventListener(chart, 'updating', onChartUpdating);
        xc.EventTargetHelper.addEventListener(chart, 'updated',  onChartUpdated);
        xc.EventTargetHelper.addEventListener(chart, 'drawing',  onChartDrawing);
        xc.EventTargetHelper.addEventListener(chart, 'drew',     onChartDrew);

        //window.addEventListener('resize', onResize);

        canvas.addEventListener('mousedown',  onMouseDown);
        canvas.addEventListener('mousemove',  onMouseMove);
        canvas.addEventListener('mouseup',    onMouseUp);
        canvas.addEventListener('wheel',      onWheel);
    }

    function drawInfo() {
        //
        var now = (new Date()).getTime();
        if (now - then < 333.33) { // 333.33 = 1000 / 3
            return;
        }

        then = now;

        info.fps.innerHTML = 'FPS: ' + fps.average;

        var world = chart.world;
        info.status.innerHTML = (
            'World-to-screen scale factor: '+ world.worldToScreenScaleFactor.toFixed(5) + '<br>' +
            'Drawn image count: ' + world.drawnImageCount + '<br>' +
            'Drawn line segment count: ' + world.drawnLineSegmentCount
        );
    }

    function performLayout() {
        //
        var style = new xla.CircularLayoutStyle();
        layout.startPerformingCircularlayout (
            style,
            ends, links,
            world.centerPosition.clone() //world.centerPosition
        );

        // Temp:
        /*
        for (var i=0; i<ends.length; i++) {
            //
            var item = layout.getGraphVertexAt(i);
            
            worldImages[i].centerPosition = item.position;
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
        */

        state = new MainStateMovingEndsToResult (
            worldImages,
            worldLineSegments,
            ends,
            links,
            layout,
            function() {
                state = new MainStateNormal();
            }
        );
        // :Temp
    }

    //
    // Event listeners.
    //
    function onChartUpdating(event) {
        //
        state.update();
    }

    function onChartUpdated(event) {
        //
        fps.update();
    }

    function onChartDrawing(event) {
        //
        // No contents.
    }

    function onChartDrew(event) {
        //
        drawInfo();
    }

    function onMouseDown(event) {
        //
        switch (event.button) {
            //
            case xc.MouseButton.LEFT: {
                //
                isMouseLeftButtonPressed = true;

                // lastMouseScreenPosition =
                //     new xc.Vector2D(event.clientX, -event.clientY);
                lastMouseScreenPosition = new xc.Vector2D (
                    event.clientX,
                    canvas.clientHeight - event.clientY
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
            var mouseScreenPosition = new xc.Vector2D (
                event.clientX,
                canvas.clientHeight - event.clientY
            );

            var offset = xc.Vector2D.subtractVectors (
                mouseScreenPosition,
                lastMouseScreenPosition
            );

            lastMouseScreenPosition = mouseScreenPosition;

            chart.move (
                xc.Vector2D.negateVector(offset)
            );
        }

        //event.preventDefault();
    }

    function onMouseUp(event) {
        //
        switch (event.button) {
            //
            case xc.MouseButton.LEFT: {
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

        chart.zoomAt (
            new xc.Vector2D (
                event.clientX,
                canvas.clientHeight - event.clientY
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
        if (event.target === templateOptions['template-10-20']) {
            //
            worldImageCount = 10;
            worldLineSegmentCount = 20;

            setUpWorldItems();

        } else if (
            event.target === templateOptions['template-25-50']
        ){
            worldImageCount = 25;
            worldLineSegmentCount = 50;

            setUpWorldItems();

        } else if (
            event.target === templateOptions['template-50-100']
        ){
            worldImageCount = 50;
            worldLineSegmentCount = 100;

            setUpWorldItems();

        } else if (
            event.target === templateOptions['template-100-200']
        ){
            worldImageCount = 100;
            worldLineSegmentCount = 200;

            setUpWorldItems();

        } else if (
            event.target === templateOptions['template-250-500']
        ){
            worldImageCount = 250;
            worldLineSegmentCount = 500;

            setUpWorldItems();

        } else if (
            event.target === templateOptions['template-500-1000']
        ){
            worldImageCount = 500;
            worldLineSegmentCount = 1000;

            setUpWorldItems();

        } else if (
            event.target === templateOptions['template-1000-2000']
        ){
            worldImageCount = 1000;
            worldLineSegmentCount = 2000;

            setUpWorldItems();

        } else if (
            event.target === templateOptions['template-2500-5000']
        ){
            worldImageCount = 2500;
            worldLineSegmentCount = 5000;

            setUpWorldItems();

        } else {
            //
            throw 'A not-supported exception raised.';
        }

        for (var key in templateOptions) {
            //
            if (templateOptions.hasOwnProperty(key) === false) {
                continue;
            }

            var item = templateOptions[key];

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
