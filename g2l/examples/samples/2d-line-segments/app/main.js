function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var scene;
    var gl;
    var vertexBuffers;
    var program;
    var attributeLocations;

    // FPS.
    var leftTexts;
    var fps;
    var then;
    var lastElapsedMilliseconds;
    var lastFps;

    try {
        //
        scene = new g2l.Scene();

        // var canvas = document.getElementById("canvas");
        // scene = new g2l.Scene({
        //     canvas: canvas,
        //     usesDefaultStyles: false
        // });

        gl = scene.renderer.webGLContext;

        document.body.appendChild(gl.canvas);

        setUpShaders();

        setUpFps();

        scene.run(undefined, drawScene);

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
        program = scene.loader.setUpProgram (
            g2l.TransformedPositionColor.VERTEX_SHADER_SOURCE,
            g2l.TransformedPositionColor.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexPosition: scene.renderer.getAttributeLocation (
                program,
               'vertexPosition'
            ),

            vertexColor: scene.renderer.getAttributeLocation (
                program,
               'vertexColor'
            )
        };
    }

    function setUpFps() {
        //
        leftTexts = document.getElementById("leftTexts");
        fps = new g2l.Fps();
        then = 0;
        lastElapsedMilliseconds = 0;
        lastFps = 0;
    }

    function drawScene() {
        //
        scene.renderer.clear();

        // Test:
        /*
        var viewport = scene.renderer.viewport;

        var p = new g2l.Vector2D (
            viewport.width * 0.5,
            viewport.height * 0.5
        );
        */

        var canvas = scene.renderer.canvas;
        
        var p = new g2l.Vector2D (
            canvas.clientWidth * 0.5,
            canvas.clientHeight * 0.5
        );
        // :Test

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

        drawFps();
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

        scene.renderer.program = program;

        scene.renderer.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        scene.renderer.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color
        );

        scene.renderer.drawPrimitives (
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
            position: scene.loader.createVertexBuffer(),
            color: scene.loader.createVertexBuffer()
        };

        var viewport = scene.renderer.viewport;

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
                gl.canvas,
                item
            );

            vertexPositions2 = vertexPositions2.concat(p.toArray());
        }

        vertexBuffers.position.setItems(vertexPositions2, 4);

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

        vertexBuffers.color.setItems(vertexColors, 4);
    }

    function drawFps() {
        //
        // Compute the elapsed time since the last rendered frame in seconds.
        var now = (new Date()).getTime();
        var elapsedTime = now - then;
        then = now;

        // Update the FPS counter.
        fps.update(elapsedTime);

        if (now - lastElapsedMilliseconds < 1000) {
            return;
        }

        lastElapsedMilliseconds = now;

        var fps2 = fps.average;
        if (fps2 !== lastFps) {
            leftTexts.innerHTML = 'FPS: ' + fps2;
            lastFps = fps2;
        }
    }
}
