function main() {
    //
    'use strict';

    var xc = xtory.core;

    var renderer;
    var loader;
    var camera;
    var vertexBuffers;
    var program;
    var attributeLocations;
    var uniformLocations;
    var sineEase;
    var transform;

    try {
        //
        renderer = new xc.Renderer();
        document.body.appendChild(renderer.canvas);
        
        loader = renderer.loader;

        setUpCamera();

        setUpGeometries();

        setUpShaders();

        setUpStates();
        
        transform = xc.Matrix4x4.createIdentityMatrix();

        sineEase = new xc.SineEase(xc.EaseMode.EASE_IN_OUT, 1000, true);
        sineEase.start();
        
        renderer.run(updateScene, drawScene);

    } catch (e) {
        //
        xc.ExceptionHelper.displayMessageOf(e);

        return;
    }

    //
    // Functions.
    //
    function setUpCamera() {
        //
        var p = new xc.Vector3D(0, 0, 1750);
        var origin = new xc.Vector3D(0, 0, 0);

        camera = new xc.Camera (
            renderer,
            p,
            xc.Vector3D.subtractVectors(origin, p)
        );
    }

    function setUpGeometries() {
        //
        vertexBuffers = {
            position: loader.createVertexBuffer(),
            color: loader.createVertexBuffer()
        };

        //
        // Vertex positions.
        //
        var vertexPositions = new Float32Array ([
              0,  225, 0,
           -250, -150, 0,
            250, -150, 0
        ]);

        vertexBuffers.position.loadData(vertexPositions, 3);

        //
        // Vertex colors.
        //
        var vertexColors = new Float32Array (
            [].concat (
                xc.Colors.PHOTOSHOP_DARK_RED.toArray(),
                xc.Colors.PHOTOSHOP_DARK_GREEN.toArray(),
                xc.Colors.PHOTOSHOP_DARK_BLUE.toArray()
            )
        );

        vertexBuffers.color.loadData(vertexColors, 4);
    }

    function setUpShaders() {
        //
        program = loader.setUpProgram (
            xc.PositionColor.VERTEX_SHADER_SOURCE,
            xc.PositionColor.FRAGMENT_SHADER_SOURCE
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
            shared: {
                //
                transform: renderer.getUniformLocation (
                    program,
                    'transform'
                )
            }
        };
    }

    function setUpStates() {
        //
        var gl = renderer.gl;
        
        gl.disable(gl.CULL_FACE);
    }

    function updateScene() {
        //
        // No contents.
    }

    function drawScene() {
        //
        renderer.clear();

        renderer.program = program;

        renderer.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        renderer.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color
        );
        
        setUpTransform();

        renderer.drawPrimitives (
            xc.PrimitiveType.TRIANGLE_STRIP,
            0,
            3
        );
    }

    function setUpTransform() {
        //
        var rotation = xc.Quaternion.fromAxisAngle (
            // Part 1.
            xc.AxisGroup.Y_AXIS,
            // Part 2.
            xc.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
            sineEase.ratioOfCurrentToTotalTimeOffset
        );

        camera.getTransform(transform);

        transform = xc.Matrix4x4.multiplyMatrices (
            transform,
            rotation.toMatrix4x4()
        );

        renderer.setMatrix4x4Uniform (
            uniformLocations.shared.transform,
            transform.db
        );
    }    
}
