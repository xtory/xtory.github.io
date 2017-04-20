function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var title;
    var renderer;
    var loader;
    var vertexBuffers;
    var program;
    var attributeLocations;

    // Info.
    var info;
    var fps;
    var then;
    var lastAverageFps;

    // Test
    var lineSegmentBatch;
    var _options;
    var _usesLineSegmentBatch;

    try {
        //
        title = '2D line segments';

        // Test:
        /*
        var canvas = document.getElementById('canvas');

        var rendererStyle = new g2l.RendererStyle();
        rendererStyle.canvasUsesDefaultStyle = false;
        renderer = new g2l.Renderer(canvas, rendererStyle);
        */

        renderer = new g2l.Renderer();
        // :Test

        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        // Test
        lineSegmentBatch = new g2l.LineSegmentBatch(renderer);
        _usesLineSegmentBatch = false;

        setUpShaders();

        setUpInfo();

        renderer.run(updateScene, drawScene);

    } catch (e) {
        //
        g2l.ExceptionHelper.displayMessageOf(e);

        return;
    }

    //
    // Functions.
    //
    function setUpShaders() {
        //
        program = loader.setUpProgram (
            g2l.TransformedPositionColor.VERTEX_SHADER_SOURCE,
            g2l.TransformedPositionColor.FRAGMENT_SHADER_SOURCE
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
            )
        };
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
        
        fps = new g2l.Fps();
        then = 0;
        lastAverageFps = 0;

        _options = [];
        
        var option = document.getElementById('none');
        option.addEventListener('click', onClick);
        _options.push(option);

        option = document.getElementById('batching');
        option.addEventListener('click', onClick);
        _options.push(option);

        _options[0].click();
    }

    function updateScene() {
        //
        fps.update();
    }

    function drawScene() {
        //
        renderer.clear();

        var canvas = renderer.canvas;
        
        var p = new g2l.Vector2D (
            canvas.clientWidth * 0.5,
            canvas.clientHeight * 0.5
        );

        var p1 = new g2l.Vector3D(p.x,     p.y-200, 0);
        var p2 = new g2l.Vector3D(p.x,     p.y+200, 1);
        var p3 = new g2l.Vector3D(p.x-250, p.y,     0.5);
        var p4 = new g2l.Vector3D(p.x+250, p.y,     0.5);

        if (_usesLineSegmentBatch === false) {
            //
            drawLineSegment (
                // Part 1.
                p1, p2,
                // Part 2.
                g2l.Colors.PHOTOSHOP_DARK_RED,
                // Part 3.
                50
            );

            drawLineSegment (
                // Part 1.
                p3, p4,
                // Part 2.
                g2l.Colors.PHOTOSHOP_DARK_YELLOW_ORANGE,
                // Part 3.
                35
            );

        } else { // _usesLineSegmentBatch === true
            //
            lineSegmentBatch.begin();

            lineSegmentBatch.drawLineSegment (
                // Part 1.
                p1, p2,
                // Part 2.
                g2l.Colors.PHOTOSHOP_DARK_BLUE,
                // Part 3.
                50
            );

            lineSegmentBatch.drawLineSegment (
                // Part 1.
                p3, p4,
                // Part 2.
                g2l.Colors.PHOTOSHOP_DARK_GREEN,
                // Part 3.
                35
            );

            lineSegmentBatch.end();
        }

        drawInfo();
    }

    function drawLineSegment (
        screenPosition1,
        screenPosition2,
        color,
        screenThickness
    ){
        setUpLineSegment (
            screenPosition1,
            screenPosition2,
            color,
            screenThickness
        );

        renderer.program = program;

        renderer.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        renderer.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color
        );

        renderer.drawPrimitives (
            g2l.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
        );
    }

    function setUpLineSegment (
        screenPosition1,
        screenPosition2,
        color,
        screenThickness
    ){
        vertexBuffers = {
            position: loader.createVertexBuffer(),
            color: loader.createVertexBuffer()
        };

        //
        // Vertex positions.
        //
        var p1 = screenPosition1.xy;
        var p2 = screenPosition2.xy;

        // Note:
        // Imagine p1 is on the lower-left side of p2.
        //
        //         p2
        //        /
        //       /
        //      /
        //    p1
        //
        // Then calculate a perpendicular vector, which is the 90 degrees 'counter-
        // clockwise' rotated result of the input vector: (p2 - p1). In this case,
        // v is from lower-right to upper-left.
        //
        var v = g2l.Vector2D.calculatePerpendicularVectorOf (
            g2l.Vector2D.subtractVectors(p2, p1) // p2 - p1
        );

        v = g2l.Vector2D.calculateUnitVectorOf(v);

        var halfScreenThickness = screenThickness * 0.5;

        // Note:
        // Use the imagination above, 4 corners are then found below.

        v = g2l.Vector2D.multiplyVectorByScalar(v, halfScreenThickness);
        var lowerRightCorner = g2l.Vector2D.subtractVectors(p2, v); // p2 - v
        var upperRightCorner = g2l.Vector2D.addVectors(p2, v);      // p2 + v
        var lowerLeftCorner  = g2l.Vector2D.subtractVectors(p1, v); // p1 - v
        var upperLeftCorner  = g2l.Vector2D.addVectors(p1, v);      // p1 + v

        var p3 = new g2l.Vector3D (
            lowerRightCorner.x,
            lowerRightCorner.y,
            screenPosition2.z
        );

        var p4 = new g2l.Vector3D (
            upperRightCorner.x,
            upperRightCorner.y,
            screenPosition2.z
        );

        var p5 = new g2l.Vector3D (
            lowerLeftCorner.x,
            lowerLeftCorner.y,
            screenPosition1.z
        );

        var p6 = new g2l.Vector3D (
            upperLeftCorner.x,
            upperLeftCorner.y,
            screenPosition1.z
        );
        
        var vertexPositions = [ p3, p4, p5, p6 ];

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

        vertexBuffers.position.loadData(vertexPositions3, 4);

        //
        // Vertex colors.
        //
        var vertexColors = [];

        for (var i=0; i<4; i++) {
            //
            vertexColors = vertexColors.concat (
                color.toArray()
            );
        }

        var vertexColors2 = new Float32Array(vertexColors);

        vertexBuffers.color.loadData(vertexColors2, 4);
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
            info.fps.innerHTML = 'FPS: ' + fps.average;

            lastAverageFps = averageFps;
        }
    }

    //
    // Event listeners.
    //
    function onClick(event) {
        //
        if (event.target === _options[0]) {
            //
            _usesLineSegmentBatch = false;

        } else if (
            event.target === _options[1]
        ){
            _usesLineSegmentBatch = true;
        }

        for (var i=0; i<_options.length; i++) {
            //
            var item = _options[i];

            if (item === event.target) {
                //
                item.style.opacity = '1.0';

            } else {
                //
                item.style.opacity = '0.45';
            }
        }
    }
}
