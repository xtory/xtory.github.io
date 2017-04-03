function main() {
    //
    'use strict';

    var scene;
    var gl;
    var camera;
    var vertexBuffers;
    var program;
    var attributeLocations;
    var uniformLocations;
    var sineEase;
    var transform;

    try {
        //
        scene = new Cybo.Xcene();
        gl = scene.graphicsManager.webGLContext;
        
        setUpCamera();

        setUpGeometries();

        setUpShaders();

        gl.disable(gl.CULL_FACE);

        transform = Cybo.Matrix4x4.createIdentityMatrix();

        sineEase = new Cybo.SineEase(Cybo.EaseMode.EASE_IN_OUT, 1000, true);
        sineEase.start();
        
        scene.run(undefined, drawScene);

    } catch (e) {
        //
        Cybo.ExceptionHelper.displayMessageOf(e);

        return;
    }

    //
    // Functions.
    //
    function setUpCamera() {
        //
        var p = new Cybo.Vector3D(0, 0, 1750);
        var origin = new Cybo.Vector3D(0, 0, 0);

        camera = new Cybo.Camera (
            scene,
            p,
            Cybo.Vector3D.subtractVectors(origin, p)
        );
    }

    function setUpGeometries() {
        //
        vertexBuffers = {
            position: gl.createBuffer(),
            color: gl.createBuffer()
        };

        //
        // Vertex positions.
        //
        var vertexPositions = [
              0,  225, 0,
           -250, -150, 0,
            250, -150, 0
        ];

        scene.graphicsManager.setUpVertexBuffer (
            vertexBuffers.position,
            vertexPositions
        );

        //
        // Vertex colors.
        //
        var vertexColors = [].concat (
            Cybo.Colors.PHOTOSHOP_DARK_RED.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_GREEN.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_BLUE.toArray()
        );

        scene.graphicsManager.setUpVertexBuffer (
            vertexBuffers.color,
            vertexColors
        );
    }

    function setUpShaders() {
        //
        program = scene.assetManager.setUpProgram (
            Cybo.PositionColor.VERTEX_SHADER_SOURCE,
            Cybo.PositionColor.FRAGMENT_SHADER_SOURCE
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
        
        uniformLocations = {
            transform: scene.graphicsManager.getUniformLocation (
                program,
               'transform'
            )
        };
    }

    function drawScene() {
        //
        scene.graphicsManager.clear();

        scene.graphicsManager.program = program;

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position,
            3
        );

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color,
            4
        );
        
        setUpTransform();

        gl.drawArrays (
            Cybo.PrimitiveType.TRIANGLE_STRIP,
            0,
            3
        );
    }

    function setUpTransform() {
        //
        var rotation = Cybo.Quaternion.fromAxisAngle (
            // Part 1.
            Cybo.AxisGroup.Y_AXIS,
            // Part 2.
            Cybo.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
            sineEase.ratioOfCurrentToTotalTimeOffset
        );

        camera.getTransform(transform);

        transform = Cybo.Matrix4x4.multiplyMatrices (
            transform,
            rotation.toMatrix4x4()
        );

        scene.graphicsManager.setUniform (
            uniformLocations.transform,
            transform
        );
    }    
}
