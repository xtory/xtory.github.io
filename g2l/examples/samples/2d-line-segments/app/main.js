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

    // FPS.
    var info;
    var fps;
    var then;
    var lastAverageFps;

    try {
        //
        title = '2D line segments';

        // var canvas = document.getElementById('canvas');
        // renderer = new g2l.Renderer ({
        //     canvas: canvas,
        //     usesDefaultStyles: false
        // });

        renderer = new g2l.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = new g2l.Loader(renderer);

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
        var left = document.getElementById('left');
        var divs = left.getElementsByTagName('div');

        divs[0].innerHTML = title;

        info = divs[1];
        info.innerHTML = 'FPS: 0';
        
        fps = new g2l.Fps();
        then = 0;
        lastAverageFps = 0;
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

        drawLineSegment (
            new g2l.Vector3D(p.x, p.y-200, 0),
            new g2l.Vector3D(p.x, p.y+200, 1),
            g2l.Colors.PHOTOSHOP_DARK_BLUE,
            50
        );

        drawLineSegment (
            new g2l.Vector3D(p.x-250, p.y, 0.5),
            new g2l.Vector3D(p.x+250, p.y, 0.5),
            g2l.Colors.CADET_BLUE,
            35
        );

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

        vertexBuffers.position.setData(vertexPositions3, 4);

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

        vertexBuffers.color.setData(vertexColors2, 4);
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
            info.innerHTML = 'FPS: ' + averageFps;
            lastAverageFps = averageFps;
        }
    }
}
