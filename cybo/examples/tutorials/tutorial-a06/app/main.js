function main() {
    //
    'use strict';

    var scene;
    var renderingContext;
    var camera;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var vertexColorAttributeLocation;
    var transformUniformLocation;
    var vertexPositionBuffer;
    var vertexColorBuffer;
    var indexBuffer;
    var modelMatrix;
    var transform;
    var isMouseLeftButtonPressed = false;
    var lastMousePosition;
    var lastTouchPosition;
    var lastTouchDistanceSqured;
    var backgroundColor;

    try {
        //
        scene = new Cybo.Xcene();
        
        renderingContext =
            scene.graphicsManager.renderingContext;

        setUpCamera();
        
        setUpShaders();

        setUpGeometries();

        hookEvents();

        modelMatrix = Cybo.Matrix4x4.createIdentityMatrix();
        transform = Cybo.Matrix4x4.createIdentityMatrix();

        backgroundColor = Cybo.Colors.DEFAULT_BACKGROUND;

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
        var p = new Cybo.Vector3D(200, 200, 325);
        var origin = new Cybo.Vector3D(0, 0, 0);

        camera = new Cybo.Camera (
            scene,
            p,
            Cybo.Vector3D.subtractVectors(origin, p)
        );
    }

    function setUpShaders() {
        //
        shaderHelper =
            new Cybo.ShaderHelper(scene.graphicsManager);

        var vertexShader = scene.assetManager.loadShader (
            Cybo.ShaderType.VERTEX_SHADER,
            Cybo.PositionColor.VERTEX_SHADER_SOURCE
        );
            
        var fragmentShader = scene.assetManager.loadShader (
            Cybo.ShaderType.FRAGMENT_SHADER,
            Cybo.PositionColor.FRAGMENT_SHADER_SOURCE
        );

        shaderProgram = shaderHelper.setUpShaderProgram (
            vertexShader,
            fragmentShader
        );

        vertexPositionAttributeLocation = (
            scene.graphicsManager.getShaderAttributeLocation (
                shaderProgram,
               'vertexPosition'
            )
        );

        vertexColorAttributeLocation = (
            scene.graphicsManager.getShaderAttributeLocation (
                shaderProgram,
               'vertexColor'
            )
        );

        transformUniformLocation = (
            scene.graphicsManager.getShaderUniformLocation (
                shaderProgram,
               'transform'
            )
        );
    }
   
    function setUpGeometries() {
        //
        // Vertex positions.
        //
        vertexPositionBuffer =
            renderingContext.createBuffer();

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

        scene.graphicsManager.setUpVertexBuffer (
            vertexPositionBuffer,
            vertexPositions
        );

        //
        // Vertex colors.
        //
        vertexColorBuffer =
            renderingContext.createBuffer();

        var faceColors = [
            Cybo.Colors.PHOTOSHOP_DARK_RED.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_YELLOW_ORANGE.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_GREEN.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_GREEN_CYAN.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_BLUE.toArray(),
            Cybo.Colors.PHOTOSHOP_DARK_VIOLET.toArray(),
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

        scene.graphicsManager.setUpVertexBuffer (
            vertexColorBuffer,
            vertexColors
        );

        //
        // Vertex indices.
        //
        indexBuffer =
            renderingContext.createBuffer();

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

        scene.graphicsManager.setUpIndexBuffer (
            indexBuffer,
            vertexIndices
        );
    }

    function hookEvents() {
        //
        var mainCanvas = renderingContext.canvas;

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

        scene.graphicsManager.shaderProgram =
            shaderProgram;
        
        scene.graphicsManager.setShaderAttribute (
            vertexPositionAttributeLocation,
            vertexPositionBuffer,
            3
        );

        scene.graphicsManager.setShaderAttribute (
            vertexColorAttributeLocation,
            vertexColorBuffer,
            4
        );

        camera.getTransform(transform);

        transform = Cybo.Matrix4x4.multiplyMatrices (
            transform,
            modelMatrix
        );

        scene.graphicsManager.setShaderUniform (
            transformUniformLocation,
            transform
        );
        
        scene.graphicsManager.drawIndexedPrimitives (
            indexBuffer,
            Cybo.PrimitiveType.TRIANGLE_LIST,
            36
        );
    }

    //
    // Event handlers.
    //
    function onMouseDown(event) {
        //
        switch (event.button) {
            //
            case Cybo.MouseButton.LEFT: {
                //
                isMouseLeftButtonPressed = true;

                lastMousePosition =
                    new Cybo.Vector2D(event.clientX, event.clientY);

                break;
            }

            default: {
                break;
            }
        }
    }

    function onMouseMove(event) {
        //
        if (isMouseLeftButtonPressed === true) {
            //
            var mousePosition =
                new Cybo.Vector2D(event.clientX, event.clientY);

            var offset = Cybo.Vector2D.subtractVectors (
                mousePosition,
                lastMousePosition
            );

            lastMousePosition = mousePosition;

            rotateModel(offset);
        }
    }

    function onMouseUp(event) {
        //
        switch (event.button) {
            //
            case Cybo.MouseButton.LEFT: {
                isMouseLeftButtonPressed = false;
                break;
            }

            default: {
                break;
            }
        }
    }
    
    function onMouseWheel(event) {
        //
        camera.zoom(event.wheelDelta);
    }

    function onKeyDown(event) {
        changeBackground();
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
    }

    // function onTouchStart(event) {
    //     //
    //     if (event.touches.length < 1) {
    //         return;
    //     }

    //     var touch = event.touches[0];

    //     lastTouchPosition =
    //         new Cybo.Vector2D(touch.clientX, touch.clientY);
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
                    new Cybo.Vector2D(touch.clientX, touch.clientY);

                break;
            }

            case 2: {
                //
                //isTouch2ing = true;

                var touch1 = event.touches[0];
                var touch2 = event.touches[1];

                var v1 = new Cybo.Vector2D(touch1.clientX, touch1.clientY);
                var v2 = new Cybo.Vector2D(touch2.clientX, touch2.clientY);

                var v = Cybo.Vector2D.subtractVectors(v1, v2);

                lastTouchDistanceSqured =
                    Cybo.Vector2D.calculateLengthSquaredOf(v);

                break;
            }

            default: {
                break;
            }
        }
    }    

    // function onTouchMove(event) {
    //     //
    //     if (event.touches.length < 1) {
    //         return;
    //     }

    //     var touch = event.touches[0];

    //     event.preventDefault() 

    //     var offset = new Cybo.Vector2D (
    //         event.pageX - lastTouchPosition.x,
    //         event.pageY - lastTouchPosition.y
    //     );

    //     lastTouchPosition = new Cybo.Vector2D(touch.clientX, touch.clientY);
    // }

    function onTouchMove(event) {
        //
        // if (event.touches.length < 1) {
        //     return;
        // }

        event.preventDefault() 

        switch (event.touches.length) {
            //
            case 1: {
                //
                var touch = event.touches[0];

                var touchPosition =
                    new Cybo.Vector2D(touch.clientX, touch.clientY);

                var offset = Cybo.Vector2D.subtractVectors (
                    touchPosition,
                    lastTouchPosition
                );

                lastTouchPosition = touchPosition;
                
                //rotateModel(Cybo.Vector2D.negateVector(offset));
                rotateModel(offset);

                break;
            }

            case 2: {
                //
                var touch1 = event.touches[0];
                var touch2 = event.touches[1];

                var v1 = new Cybo.Vector2D(touch1.clientX, touch1.clientY);
                var v2 = new Cybo.Vector2D(touch2.clientX, touch2.clientY);

                var v = Cybo.Vector2D.subtractVectors(v1, v2);

                var touchDistanceSqured =
                    Cybo.Vector2D.calculateLengthSquaredOf(v);

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
    }    

    function onTouchCancel(event) {
        //alert('touchcancel!');
    }    

    function onTouchEnd(event) {
        //alert('touchend!');
        // isTouch1ing = false;
        // isTouch2ing = false;
    }

    function rotateModel(offset) {
        //
        modelMatrix = Cybo.Matrix4x4.multiplyMatrices (
            Cybo.Matrix4x4.createRotationMatrix (
                Cybo.CartesianAxis.Y,
                Cybo.MathHelper.toRadians(offset.x * 0.5)
            ),
            modelMatrix
        );

        modelMatrix = Cybo.Matrix4x4.multiplyMatrices (
            Cybo.Matrix4x4.createRotationMatrix (
                Cybo.CartesianAxis.X,
                Cybo.MathHelper.toRadians(offset.y * 0.5)
            ),
            modelMatrix
        );
    }

    function changeBackground() {
        backgroundColor = new Cybo.Color (
            Math.random(),
            Math.random(),
            Math.random(),
            1
        )
    }
}
