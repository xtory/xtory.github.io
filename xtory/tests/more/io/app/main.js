function main() {
    //
    'use strict';

    var xc = xtory.core;

    var title;
    var renderer;
    var loader;
    var camera;
    var vertexBuffers;
    var indexBuffer;
    var program;
    var attributeLocations;
    var uniformLocations;
    var modelMatrix;
    var transform;
    var isMouseLeftButtonPressed = false;
    var lastMousePosition;
    var lastTouchPosition;
    var lastTouchDistanceSqured;
    var backgroundColor;

    // Info.
    var info;
    var fps;
    var then;
    var lastAverageFps;

    try {
        //
        title = 'IO';

        renderer = new xc.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        setUpCamera();
        
        setUpGeometries();

        setUpShaders();

        setUpInfo();

        hookEvents();

        modelMatrix = xc.Matrix4x4.createIdentityMatrix();
        transform = xc.Matrix4x4.createIdentityMatrix();

        backgroundColor = xc.Colors.DEFAULT_BACKGROUND;

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
        var p = new xc.Vector3D(200, 200, 325);
        var origin = new xc.Vector3D(0, 0, 0);

        camera = new xc.SmoothCamera (
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
            //
            // Front face.
            50, -50,  50,
            50,  50,  50,
           -50,  50,  50,
           -50, -50,  50,
            
            // Back face.
           -50, -50, -50,
           -50,  50, -50,
            50,  50, -50,
            50, -50, -50,
            
            // Top face.
            50,  50,  50,
            50,  50, -50,
           -50,  50, -50,
           -50,  50,  50,
            
            // Bottom face.
            50, -50, -50,
            50, -50,  50,
           -50, -50,  50,
           -50, -50, -50,
            
            // Right face.
            50, -50, -50,
            50,  50, -50,
            50,  50,  50,
            50, -50,  50,
            
            // Left face.
           -50, -50,  50,
           -50,  50,  50,
           -50,  50, -50,
           -50, -50, -50
        ]);

        vertexBuffers.position.loadData(vertexPositions, 3);

        //
        // Vertex colors.
        //
        var faceColors = [
            xc.Colors.PHOTOSHOP_DARK_RED.toArray(),
            xc.Colors.PHOTOSHOP_DARK_YELLOW_ORANGE.toArray(),
            xc.Colors.PHOTOSHOP_DARK_GREEN.toArray(),
            xc.Colors.PHOTOSHOP_DARK_GREEN_CYAN.toArray(),
            xc.Colors.PHOTOSHOP_DARK_BLUE.toArray(),
            xc.Colors.PHOTOSHOP_DARK_VIOLET.toArray(),
        ];

        var vertexColors = [];

        for (var i=0; i<6; i++) {
            //
            var item = faceColors[i];

            // Repeat each color four times for the four vertices of the face

            for (var j=0; j<4; j++) {
                vertexColors = vertexColors.concat(item);
            }
        }

        var vertexColors2 = new Float32Array(vertexColors);

        vertexBuffers.color.loadData(vertexColors2, 4);

        //
        // Vertex indices.
        //
        indexBuffer = loader.createIndexBuffer();

        var vertexIndices = new Uint16Array ([
            //
            // Front face.
            0,  1,  2,
            0,  2,  3,

            // Back face.
            4,  5,  6,
            4,  6,  7,

            // Top face.
            8,  9,  10,
            8,  10, 11,

            // Bottom face.
            12, 13, 14,
            12, 14, 15,

            // Right face.
            16, 17, 18,
            16, 18, 19,

            // Left face.
            20, 21, 22,
            20, 22, 23
        ]);

        indexBuffer.loadData(vertexIndices);
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

    function setUpInfo() {
        //
        var divs = (
            document.
            getElementById('info').
            getElementsByTagName('div')
        );

        info = {
            title: divs[0],
            fps:   divs[1],
            more:  divs[2]
        };

        info.title.innerHTML = title;

        info.fps.innerHTML = 'FPS: 0';
        
        fps = new xc.Fps();
        then = 0;
        lastAverageFps = 0;
    }
    
    function hookEvents() {
        //
        renderer.canvas.addEventListener('mousedown',   onMouseDown);
        renderer.canvas.addEventListener('mousemove',   onMouseMove);
        renderer.canvas.addEventListener('mouseup',     onMouseUp);
        renderer.canvas.addEventListener('wheel',       onWheel);
        renderer.canvas.addEventListener('touchstart',  onTouchStart);
        renderer.canvas.addEventListener('touchmove',   onTouchMove);
        renderer.canvas.addEventListener('touchcancel', onTouchCancel);
        renderer.canvas.addEventListener('touchend',    onTouchEnd);
    }

    function updateScene() {
        //
        camera.update();

        fps.update();
    }

    function drawScene() {
        //
        renderer.clear (
            undefined,
            backgroundColor
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

        camera.getTransform(transform);

        transform = xc.Matrix4x4.multiplyMatrices (
            transform,
            modelMatrix
        );

        renderer.setMatrix4x4Uniform (
            uniformLocations.shared.transform,
            transform.db
        );
        
        renderer.drawIndexedPrimitives (
            indexBuffer,
            xc.PrimitiveType.TRIANGLE_LIST,
            36
        );

        drawInfo();
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

    function rotateModel(offset) {
        //
        modelMatrix = xc.Matrix4x4.multiplyMatrices (
            xc.Matrix4x4.createRotationMatrix (
                xc.CartesianAxis.Y,
                xc.MathHelper.toRadians(offset.x * 0.5)
            ),
            modelMatrix
        );

        modelMatrix = xc.Matrix4x4.multiplyMatrices (
            xc.Matrix4x4.createRotationMatrix (
                xc.CartesianAxis.X,
                xc.MathHelper.toRadians(offset.y * 0.5)
            ),
            modelMatrix
        );
    }    

    //
    // Event handlers.
    //
    function onMouseDown(event) {
        //
        switch (event.button) {
            //
            case xc.MouseButton.LEFT: {
                //
                isMouseLeftButtonPressed = true;

                lastMousePosition =
                    new xc.Vector2D(event.clientX, event.clientY);

                break;
            }

            default: {
                break;
            }
        }

        event.preventDefault();
    }

    function onMouseMove(event) {
        //
        if (isMouseLeftButtonPressed === true) {
            //
            var mousePosition =
                new xc.Vector2D(event.clientX, event.clientY);

            var offset = xc.Vector2D.subtractVectors (
                mousePosition,
                lastMousePosition
            );

            lastMousePosition = mousePosition;

            rotateModel(offset);
        }

        event.preventDefault();
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

        event.preventDefault();
    }
    
    function onWheel(event) {
        //
        if (event.deltaY === 0) {
            return;
        }

        var distance = (event.deltaY<0) ? 250 : -250;
        camera.zoom(distance);

        event.preventDefault();
    }

    function onTouchStart(event) {
        //
        switch (event.touches.length) {
            //
            case 1: {
                //
                var touch = event.touches[0];

                lastTouchPosition =
                    new xc.Vector2D(touch.clientX, touch.clientY);

                break;
            }

            case 2: {
                //
                var touch1 = event.touches[0];
                var touch2 = event.touches[1];

                var v1 = new xc.Vector2D(touch1.clientX, touch1.clientY);
                var v2 = new xc.Vector2D(touch2.clientX, touch2.clientY);

                var v = xc.Vector2D.subtractVectors(v1, v2);

                lastTouchDistanceSqured =
                    xc.Vector2D.calculateLengthSquaredOf(v);

                break;
            }

            default: {
                break;
            }
        }

        event.preventDefault();
    }    

    function onTouchMove(event) {
        //
        switch (event.touches.length) {
            //
            case 1: {
                //
                var touch = event.touches[0];

                var touchPosition =
                    new xc.Vector2D(touch.clientX, touch.clientY);

                var offset = xc.Vector2D.subtractVectors (
                    touchPosition,
                    lastTouchPosition
                );

                lastTouchPosition = touchPosition;
                
                rotateModel(offset);

                break;
            }

            case 2: {
                //
                var touch1 = event.touches[0];
                var touch2 = event.touches[1];

                var v1 = new xc.Vector2D(touch1.clientX, touch1.clientY);
                var v2 = new xc.Vector2D(touch2.clientX, touch2.clientY);

                var v = xc.Vector2D.subtractVectors(v1, v2);

                var touchDistanceSqured =
                    xc.Vector2D.calculateLengthSquaredOf(v);

                var s = 12;
                if (touchDistanceSqured < lastTouchDistanceSqured) {
                    camera.zoom(-s);
                } else {
                    camera.zoom(s);
                }

                lastTouchDistanceSqured = touchDistanceSqured;

                break;
            }

            default: {
                break;
            }
        }

        event.preventDefault();
    }    

    function onTouchCancel(event) {
        //
        event.preventDefault();
    }    

    function onTouchEnd(event) {
        //
        event.preventDefault();
    }
}
