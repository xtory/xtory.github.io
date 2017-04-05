function main() {
    //
    'use strict';

    var scene;
    var gl;
    var vertexBuffers;
    var program;
    var attributeLocations;

    try {
        //
        scene = new Cybo.Xcene();
        gl = scene.graphicsManager.webGLContext;

        setUpShaders();

        scene.run(undefined, drawScene);

    } catch (e) {
        //
        Cybo.ExceptionHelper.displayMessageOf(e);

        return;
    }

    //
    // Functions.
    //
    function setUpShaders() {
        //
        program = scene.assetManager.setUpProgram (
            Cybo.TransformedPositionColor.VERTEX_SHADER_SOURCE,
            Cybo.TransformedPositionColor.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexPosition: scene.graphicsManager.getAttributeLocation (
                program,
               'vertexPosition'
            ),

            vertexColor: scene.graphicsManager.getAttributeLocation (
                program,
               'vertexColor'
            )
        };
    }

    function drawScene() {
        //
        scene.graphicsManager.clear();

        var viewport = scene.graphicsManager.viewport;

        var p = new Cybo.Vector2D (
            viewport.width * 0.5,
            viewport.height * 0.5
        );

        drawLineSegment (
            new Cybo.Vector3D(p.x, p.y-200, 0),
            new Cybo.Vector3D(p.x, p.y+200, 1),
            Cybo.Colors.PHOTOSHOP_DARK_BLUE,
            50
        );

        drawLineSegment (
            new Cybo.Vector3D(p.x-250, p.y, 0.5),
            new Cybo.Vector3D(p.x+250, p.y, 0.5),
            Cybo.Colors.CADET_BLUE,
            35
        );
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

        scene.graphicsManager.program = program;

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position,
            4
        );

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color,
            4
        );

        scene.graphicsManager.drawPrimitives (
            Cybo.PrimitiveType.TRIANGLE_STRIP,
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
            position: gl.createBuffer(),
            color: gl.createBuffer()
        };

        var viewport = scene.graphicsManager.viewport;

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
        var v = Cybo.Vector2D.calculatePerpendicularVectorOf (
            Cybo.Vector2D.subtractVectors(p2, p1) // p2 - p1
        );

        v = Cybo.Vector2D.calculateUnitVectorOf(v);

        var halfScreenThickness = screenThickness * 0.5;

        // Note:
        // Use the imagination above, 4 corners are then found below.

        v = Cybo.Vector2D.multiplyVectorByScalar(v, halfScreenThickness);
        var lowerRightCorner = Cybo.Vector2D.subtractVectors(p2, v); // p2 - v
        var upperRightCorner = Cybo.Vector2D.addVectors(p2, v);      // p2 + v
        var lowerLeftCorner  = Cybo.Vector2D.subtractVectors(p1, v); // p1 - v
        var upperLeftCorner  = Cybo.Vector2D.addVectors(p1, v);      // p1 + v

        var p3 = new Cybo.Vector3D (
            lowerRightCorner.x,
            lowerRightCorner.y,
            screenPosition2.z
        );

        var p4 = new Cybo.Vector3D (
            upperRightCorner.x,
            upperRightCorner.y,
            screenPosition2.z
        );

        var p5 = new Cybo.Vector3D (
            lowerLeftCorner.x,
            lowerLeftCorner.y,
            screenPosition1.z
        );

        var p6 = new Cybo.Vector3D (
            upperLeftCorner.x,
            upperLeftCorner.y,
            screenPosition1.z
        );
        
        var vertexPositions = [ p3, p4, p5, p6 ];

        var vertexPositions2 = [];

        for (var i=0; i<vertexPositions.length; i++) {
            //
            var item = vertexPositions[i];

            var p = Cybo.ScreenCoordinateHelper.toClipSpace (
                viewport,
                item
            );

            vertexPositions2 = vertexPositions2.concat(p.toArray());
        }

        scene.graphicsManager.setUpVertexBuffer (
            vertexBuffers.position,
            vertexPositions2
        );

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

        scene.graphicsManager.setUpVertexBuffer (
            vertexBuffers.color,
            vertexColors
        );
    } 
}