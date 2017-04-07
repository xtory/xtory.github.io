function main() {
    //
    'use strict';

    var g2l = GorillaGL;

    var scene;
    var gl;
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

    // FPS.
    var leftTexts;
    var rightTexts;
    var fps;
    var then;
    var lastFps;

    try {
        //
        scene = new g2l.Xcene();
        gl = scene.graphicsManager.webGLContext;

        document.body.appendChild(gl.canvas);

        setUpCamera();
        
        setUpGeometries();

        setUpShaders();

        setUpFps();

        hookEvents();

        modelMatrix = g2l.Matrix4x4.createIdentityMatrix();
        transform = g2l.Matrix4x4.createIdentityMatrix();

        backgroundColor = g2l.Colors.DEFAULT_BACKGROUND;

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
        var p = new g2l.Vector3D(200, 200, 325);
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
        ];

        vertexBuffers.position.setItems(vertexPositions, 3);

        //
        // Vertex colors.
        //
        var faceColors = [
            g2l.Colors.PHOTOSHOP_DARK_RED.toArray(),
            g2l.Colors.PHOTOSHOP_DARK_YELLOW_ORANGE.toArray(),
            g2l.Colors.PHOTOSHOP_DARK_GREEN.toArray(),
            g2l.Colors.PHOTOSHOP_DARK_GREEN_CYAN.toArray(),
            g2l.Colors.PHOTOSHOP_DARK_BLUE.toArray(),
            g2l.Colors.PHOTOSHOP_DARK_VIOLET.toArray(),
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

        vertexBuffers.color.setItems(vertexColors, 4);

        //
        // Vertex indices.
        //
        indexBuffer = scene.assetManager.createIndexBuffer();

        var vertexIndices = [
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
        ]

        indexBuffer.setItems(vertexIndices);
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
            //
            transform: scene.graphicsManager.getUniformLocation (
                program,
               'transform'
            )
        };
    }

    function setUpFps() {
        //
        leftTexts = document.getElementById("leftTexts");
        rightTexts = document.getElementById("rightTexts");
        fps = new g2l.Fps();
        then = (new Date()).getTime() * 0.001;
        lastFps = 0;
    }
    
    function hookEvents() {
        //
        var mainCanvas = gl.canvas;

        mainCanvas.addEventListener('mousedown',  onMouseDown);
        mainCanvas.addEventListener('mousemove',  onMouseMove);
        mainCanvas.addEventListener('mouseup',    onMouseUp);
        mainCanvas.addEventListener('mousewheel', onMouseWheel);
        mainCanvas.addEventListener('keydown',    onKeyDown);
        mainCanvas.addEventListener('keyup',      onKeyUp);

        mainCanvas.addEventListener('touchstart',  onTouchStart);
        mainCanvas.addEventListener('touchmove',   onTouchMove);
        mainCanvas.addEventListener('touchcancel', onTouchCancel);
        mainCanvas.addEventListener('touchend',    onTouchEnd);
    }

    function drawScene() {
        //
        scene.graphicsManager.clear (
            undefined,
            backgroundColor
        );

        scene.graphicsManager.program = program;
        
        scene.graphicsManager.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        scene.graphicsManager.setAttribute (
            attributeLocations.vertexColor,
            vertexBuffers.color
        );

        camera.getTransform(transform);

        transform = g2l.Matrix4x4.multiplyMatrices (
            transform,
            modelMatrix
        );

        scene.graphicsManager.setUniform (
            uniformLocations.transform,
            transform
        );
        
        scene.graphicsManager.drawIndexedPrimitives (
            indexBuffer,
            g2l.PrimitiveType.TRIANGLE_LIST,
            36
        );

        drawFps();
    }

    function drawFps() {
        //
        // Compute the elapsed time since the last rendered frame in seconds.
        var now = (new Date()).getTime() * 0.001;
        var elapsedTime = now - then;
        then = now;

        // Update the FPS counter.
        fps.update(elapsedTime);

        var fps2 = fps.average;
        if (fps2 !== lastFps) {
            leftTexts.innerHTML = 'FPS: ' + fps2 + 'A​‌B​‌C​‌Ć​‌Č​‌D​‌Đ​‌E​‌F​‌G​‌H​‌I​‌J​‌K​‌L​‌M​‌N​‌O​‌P​‌Q​‌R​‌S​‌Š​‌T​‌U​‌V​‌W​‌X​‌Y​‌Z​‌Ž​‌a​‌b​‌c​‌č​‌ć​‌d​‌đ​‌e​‌f​‌g​‌h​‌i​‌j​‌k​‌l​‌m​‌n​‌o​‌p​‌q​‌r​‌s​‌š​‌t​‌u​‌v​‌w​‌x​‌y​‌z​‌ž​‌1​‌2​‌3​‌4​‌5​‌6​‌7​‌8​‌9​‌0​‌';
            rightTexts.innerHTML = 'FPS: ' + fps2 + 'A​‌B​‌C​‌Ć​‌Č​‌D​‌Đ​‌E​‌F​‌G​‌H​‌I​‌J​‌K​‌L​‌M​‌N​‌O​‌P​‌Q​‌R​‌S​‌Š​‌T​‌U​‌V​‌W​‌X​‌Y​‌Z​‌Ž​‌a​‌b​‌c​‌č​‌ć​‌d​‌đ​‌e​‌f​‌g​‌h​‌i​‌j​‌k​‌l​‌m​‌n​‌o​‌p​‌q​‌r​‌s​‌š​‌t​‌u​‌v​‌w​‌x​‌y​‌z​‌ž​‌1​‌2​‌3​‌4​‌5​‌6​‌7​‌8​‌9​‌0​‌';
            lastFps = fps2;
        }
    }

    //
    // Event handlers.
    //
    function onMouseDown(event) {
        //
        switch (event.button) {
            //
            case g2l.MouseButton.LEFT: {
                //
                isMouseLeftButtonPressed = true;

                lastMousePosition =
                    new g2l.Vector2D(event.clientX, event.clientY);

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
                new g2l.Vector2D(event.clientX, event.clientY);

            var offset = g2l.Vector2D.subtractVectors (
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
            case g2l.MouseButton.LEFT: {
                isMouseLeftButtonPressed = false;
                break;
            }

            default: {
                break;
            }
        }

        event.preventDefault();
    }
    
    function onMouseWheel(event) {
        //
        camera.zoom(event.wheelDelta);

        event.preventDefault();
    }

    function onKeyDown(event) {
        changeBackground();

        event.preventDefault();
    }

    function onKeyUp(event) {
        //
        // switch (event.key) {
        //     case 'space': {
        //         break;
        //     }

        //     default: {
        //         break;
        //     }
        // }
        changeBackground();

        event.preventDefault();
    }

    // function onTouchStart(event) {
    //     //
    //     if (event.touches.length < 1) {
    //         return;
    //     }

    //     var touch = event.touches[0];

    //     lastTouchPosition =
    //         new g2l.Vector2D(touch.clientX, touch.clientY);
    // }

    function onTouchStart(event) {
        //
        // if (event.touches.length < 1) {
        //     return;
        // }
        // if (isTouch1ing === true ||
        //     isTouch2ing === true) {
        //     return;
        // }

        switch (event.touches.length) {
            //
            case 1: {
                //
                //isTouch1ing = true;

                var touch = event.touches[0];

                lastTouchPosition =
                    new g2l.Vector2D(touch.clientX, touch.clientY);

                break;
            }

            case 2: {
                //
                //isTouch2ing = true;

                var touch1 = event.touches[0];
                var touch2 = event.touches[1];

                var v1 = new g2l.Vector2D(touch1.clientX, touch1.clientY);
                var v2 = new g2l.Vector2D(touch2.clientX, touch2.clientY);

                var v = g2l.Vector2D.subtractVectors(v1, v2);

                lastTouchDistanceSqured =
                    g2l.Vector2D.calculateLengthSquaredOf(v);

                break;
            }

            default: {
                break;
            }
        }

        event.preventDefault();
    }    

    // function onTouchMove(event) {
    //     //
    //     if (event.touches.length < 1) {
    //         return;
    //     }

    //     var touch = event.touches[0];

    //     event.preventDefault() 

    //     var offset = new g2l.Vector2D (
    //         event.pageX - lastTouchPosition.x,
    //         event.pageY - lastTouchPosition.y
    //     );

    //     lastTouchPosition = new g2l.Vector2D(touch.clientX, touch.clientY);
    // }

    function onTouchMove(event) {
        //
        // if (event.touches.length < 1) {
        //     return;
        // }

        switch (event.touches.length) {
            //
            case 1: {
                //
                var touch = event.touches[0];

                var touchPosition =
                    new g2l.Vector2D(touch.clientX, touch.clientY);

                var offset = g2l.Vector2D.subtractVectors (
                    touchPosition,
                    lastTouchPosition
                );

                lastTouchPosition = touchPosition;
                
                //rotateModel(g2l.Vector2D.negateVector(offset));
                rotateModel(offset);

                break;
            }

            case 2: {
                //
                var touch1 = event.touches[0];
                var touch2 = event.touches[1];

                var v1 = new g2l.Vector2D(touch1.clientX, touch1.clientY);
                var v2 = new g2l.Vector2D(touch2.clientX, touch2.clientY);

                var v = g2l.Vector2D.subtractVectors(v1, v2);

                var touchDistanceSqured =
                    g2l.Vector2D.calculateLengthSquaredOf(v);

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
        //alert('touchcancel!');

        event.preventDefault();
    }    

    function onTouchEnd(event) {
        //alert('touchend!');
        // isTouch1ing = false;
        // isTouch2ing = false;

        event.preventDefault();
    }

    function rotateModel(offset) {
        //
        modelMatrix = g2l.Matrix4x4.multiplyMatrices (
            g2l.Matrix4x4.createRotationMatrix (
                g2l.CartesianAxis.Y,
                g2l.MathHelper.toRadians(offset.x * 0.5)
            ),
            modelMatrix
        );

        modelMatrix = g2l.Matrix4x4.multiplyMatrices (
            g2l.Matrix4x4.createRotationMatrix (
                g2l.CartesianAxis.X,
                g2l.MathHelper.toRadians(offset.y * 0.5)
            ),
            modelMatrix
        );
    }

    function changeBackground() {
        backgroundColor = new g2l.Color (
            Math.random(),
            Math.random(),
            Math.random(),
            1
        )
    }
}
