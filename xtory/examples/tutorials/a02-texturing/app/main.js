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
    var texture;

    try {
        //
        renderer = new xc.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        setUpCamera();
        
        setUpGeometries(0, 0, 500, 500);

        setUpTextures();

        setUpShaders();

        setUpStates();
        
        transform = xc.Matrix4x4.createIdentityMatrix();

        sineEase = new xc.SineEase(xc.EaseMode.EASE_IN_OUT, 1500, true);
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
        var p = new xc.Vector3D(0, 0, 1250);
        var origin = new xc.Vector3D(0, 0, 0);

        camera = new xc.Camera (
            renderer,
            p,
            xc.Vector3D.subtractVectors(origin, p)
        );
    }

    function setUpGeometries(x, y, w, h) {
        //
        vertexBuffers = {
            position: loader.createVertexBuffer(),
            textureCoordinates: loader.createVertexBuffer()
        };

        //
        // Vertex positions.
        //
        var halfWidth = w * 0.5;
        var halfHeight = h * 0.5;

        var vertexPositions = new Float32Array ([
            x+halfWidth, y-halfHeight, 0,
            x+halfWidth, y+halfHeight, 0,
            x-halfWidth, y-halfHeight, 0,
            x-halfWidth, y+halfHeight, 0
        ]);

        vertexBuffers.position.loadData (
            vertexPositions,
            3
        );

        //
        // Vertex texture coordinates.
        //
        var vertexTextureCoordinates = new Float32Array ([
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 1.0
        ]);

        vertexBuffers.textureCoordinates.loadData (
            vertexTextureCoordinates,
            2
        );
    }

    function setUpTextures() {
        //
        var url = // which is relative to index.html, not main.js
            '../../assets/images/jeremy-mann/market-street.jpg';

        texture = loader.loadTexture2D(url);
    }

    function setUpShaders() {
        //
        program = loader.setUpProgram (
            xc.PositionTextureCoordinates.VERTEX_SHADER_SOURCE,
            xc.PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexPosition: renderer.getAttributeLocation (
                program,
                'vertexPosition'
            ),

            vertexTextureCoordinates: renderer.getAttributeLocation (
                program,
                'vertexTextureCoordinates'
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
            },

            unique: {
                //
                sampler: renderer.getUniformLocation (
                    program,
                    'sampler'
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
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates
        );

        setUpTransform();

        renderer.setSampler (
            uniformLocations.unique.sampler,
            texture
        );

        renderer.drawPrimitives (
            xc.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
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
