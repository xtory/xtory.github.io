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
    var uniformLocations;

    // Info.
    var info;
    var fps;
    var then;
    var lastAverageFps;

    // Test
    var lineSegmentBatch;
    var options;
    var usesLineSegmentBatch;

    try {
        //
        title = '2D line segments';

        // Test:
        /*
        var canvas = document.getElementById('canvas');

        var style = new g2l.RendererStyle();
        style.canvasUsesDefaultStyle = false;
        renderer = new g2l.Renderer(canvas, style);
        */

        renderer = new g2l.Renderer();
        // :Test

        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        // Test
        lineSegmentBatch = new g2l.LineSegment2DBatch(renderer);
        usesLineSegmentBatch = false;

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
            g2l.LineSegment2DBatch.VERTEX_SHADER_SOURCE,
            g2l.LineSegment2DBatch.FRAGMENT_SHADER_SOURCE
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

        uniformLocations = {
            //
            canvasClientSize: renderer.getUniformLocation (
                program,
                'canvasClientSize'
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

        options = [];
        
        var option = document.getElementById('none');
        option.addEventListener('click', onClick);
        options.push(option);

        option = document.getElementById('batching');
        option.addEventListener('click', onClick);
        options.push(option);

        options[0].click();
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

        if (usesLineSegmentBatch === false) {
            //
            renderer.program = program;

            // Sets the shared uniform.
            renderer.setVector2DUniform (
                uniformLocations.canvasClientSize,
                new Float32Array ([
                    renderer.canvas.clientWidth,
                    renderer.canvas.clientHeight
                ])
            );

            drawLineSegment (
                // Part 1.
                p1, p2,
                // Part 2.
                50,
                // Part 3.
                g2l.Colors.PHOTOSHOP_DARK_RED
            );

            drawLineSegment (
                // Part 1.
                p3, p4,
                // Part 2.
                35,
                // Part 2.
                g2l.Colors.PHOTOSHOP_DARK_YELLOW_ORANGE
            );

        } else { // _usesLineSegmentBatch === true
            //
            lineSegmentBatch.begin();

            lineSegmentBatch.drawLineSegment (
                // Part 1.
                p1, p2,
                // Part 2.
                50,
                // Part 3.
                g2l.Colors.PHOTOSHOP_DARK_BLUE
            );

            lineSegmentBatch.drawLineSegment (
                // Part 1.
                p3, p4,
                // Part 2.
                35,
                // Part 3.
                g2l.Colors.PHOTOSHOP_DARK_GREEN
            );

            lineSegmentBatch.end();
        }

        drawInfo();
    }

    function drawLineSegment (
        screenPosition1,
        screenPosition2,
        screenThickness,
        color
    ){
        setUpLineSegment (
            screenPosition1,
            screenPosition2,
            screenThickness,
            color
        );

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
        screenThickness,
        color
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

        // Lower right.
        var p3 = g2l.Vector2D.subtractVectors(p2, v); // p2 - v
        
        // Upper right.
        var p4 = g2l.Vector2D.addVectors(p2, v); // p2 + v

        // Lower left.
        var p5 = g2l.Vector2D.subtractVectors(p1, v); // p1 - v

        // Upper left.
        var p6 = g2l.Vector2D.addVectors(p1, v); // p1 + v

        var vertexPositions = new Float32Array ([
            // Part 1: Lower right corner.
            p3.x, p3.y, screenPosition2.z,
            // Part 2: Upper right corner.
            p4.x, p4.y, screenPosition2.z,
            // Part 3: Lower left corner.
            p5.x, p5.y, screenPosition1.z,
            // Part 4: Upper left corner.
            p6.x, p6.y, screenPosition1.z
        ]);

        vertexBuffers.position.loadData(vertexPositions, 3);

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
        if (event.target === options[0]) {
            //
            usesLineSegmentBatch = false;

        } else if (
            event.target === options[1]
        ){
            usesLineSegmentBatch = true;
        }

        for (var i=0; i<options.length; i++) {
            //
            var item = options[i];

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
