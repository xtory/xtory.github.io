function main() {
    //
    'use strict';

    var g2l = GorillaGL;

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
        scene = new g2l.Xcene();
        gl = scene.graphicsManager.webGLContext;
        
        document.body.appendChild(gl.canvas);
        
        setUpCamera();

        setUpGeometries();

        setUpShaders();

        gl.disable(gl.CULL_FACE);

        transform = g2l.Matrix4x4.createIdentityMatrix();

        sineEase = new g2l.SineEase(g2l.EaseMode.EASE_IN_OUT, 1000, true);
        sineEase.start();
        
        scene.run(undefined, drawScene);

    } catch (e) {
        //
        g2l.ExceptionHelper.displayMessageOf(e);

        return;
    }

    //
    // Functions.
    //
    function setUpCamera() {
        //
        var p = new g2l.Vector3D(0, 0, 1750);
        var origin = new g2l.Vector3D(0, 0, 0);

        camera = new g2l.Camera (
            scene,
            p,
            g2l.Vector3D.subtractVectors(origin, p)
        );
    }

    function setUpGeometries() {
        //
        vertexBuffers = {
            position: scene.assetManager.createVertexBuffer(),
            color: scene.assetManager.createVertexBuffer()
        };

        //
        // Vertex positions.
        //
        var vertexPositions = [
              0,  225, 0,
           -250, -150, 0,
            250, -150, 0
        ];

        vertexBuffers.position.setItems(vertexPositions, 3);

        //
        // Vertex colors.
        //
        var vertexColors = [].concat (
            g2l.Colors.PHOTOSHOP_DARK_RED.toArray(),
            g2l.Colors.PHOTOSHOP_DARK_GREEN.toArray(),
            g2l.Colors.PHOTOSHOP_DARK_BLUE.toArray()
        );

        vertexBuffers.color.setItems(vertexColors, 4);
    }

    function setUpShaders() {
        //
        program = scene.assetManager.setUpProgram (
            g2l.PositionColor.VERTEX_SHADER_SOURCE,
            g2l.PositionColor.FRAGMENT_SHADER_SOURCE
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
            vertexBuffers.position
        );

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color
        );
        
        setUpTransform();

        gl.drawArrays (
            g2l.PrimitiveType.TRIANGLE_STRIP,
            0,
            3
        );
    }

    function setUpTransform() {
        //
        var rotation = g2l.Quaternion.fromAxisAngle (
            // Part 1.
            g2l.AxisGroup.Y_AXIS,
            // Part 2.
            g2l.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
            sineEase.ratioOfCurrentToTotalTimeOffset
        );

        camera.getTransform(transform);

        transform = g2l.Matrix4x4.multiplyMatrices (
            transform,
            rotation.toMatrix4x4()
        );

        scene.graphicsManager.setUniform (
            uniformLocations.transform,
            transform
        );
    }    
}
