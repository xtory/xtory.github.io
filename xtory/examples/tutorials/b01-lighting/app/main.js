function main() {
    //
    'use strict';

    var g2l = gorilla.graphicsLibrary;

    var renderer;
    var loader;
    var camera;
    var vertexBuffers;
    var indexBuffer;
    var program;
    var attributeLocations;
    var uniformLocations;
    var sineEase;
    var sineEase2;
    var transform;
    var texture;

    try {
        //
        renderer = new g2l.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        setUpCamera();

        setUpGeometries();

        setUpTextures();

        setUpShaders();

        setUpTime();

        transform = g2l.Matrix4x4.createIdentityMatrix();

        renderer.run(updateScene, drawScene);

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
        var p = new g2l.Vector3D(0, 0, 325);
        var origin = new g2l.Vector3D(0, 0, 0);

        camera = new g2l.Camera (
            renderer,
            p,
            g2l.Vector3D.subtractVectors(origin, p)
        );
    }

    function setUpGeometries() {
        //
        vertexBuffers = {
            position: loader.createVertexBuffer(),
            normal: loader.createVertexBuffer(),
            textureCoordinates: loader.createVertexBuffer()
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

        vertexBuffers.position.loadData (
            vertexPositions,
            3
        );

        // 
        // Vertex normals.
        //
        var vertexNormals = new Float32Array ([
            //
            // Front face.
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back face.
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top face.
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom face.
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right face.
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left face.
           -1.0,  0.0,  0.0,
           -1.0,  0.0,  0.0,
           -1.0,  0.0,  0.0,
           -1.0,  0.0,  0.0
        ]);

        vertexBuffers.normal.loadData (
            vertexNormals,
            3
        );

        //
        // Vertex texture coordinates.
        //
        var vertexTextureCoordinates = new Float32Array ([
            //
            // Front face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,

            // Back face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,

            // Top face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,

            // Bottom face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,

            // Right face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,

            // Left face.
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            0.0,  0.0,
        ]);

        vertexBuffers.textureCoordinates.loadData (
            vertexTextureCoordinates,
            2
        );

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

    function setUpTextures() {
        //
        var url = // which is relative to index.html, not main.js
            '../../assets/images/jeremy-mann/market-street.jpg';

        texture = loader.loadTexture2D(url);
    }

    function setUpShaders() {
        //
        program = loader.setUpProgram (
            PhongShading.VERTEX_SHADER_SOURCE,
            PhongShading.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexPosition: renderer.getAttributeLocation (
                program,
                'vertexPosition'
            ),

            vertexNormal: renderer.getAttributeLocation (
                program,
                'vertexNormal'
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
                ),

                transposeOfInverseOfModelMatrix: renderer.getUniformLocation (
                    program,
                    'transposeOfInverseOfModelMatrix'
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

    function setUpTime() {
        //
        sineEase = new g2l.SineEase (
            g2l.EaseMode.EASE_IN_OUT,
            3750,
            true
        );

        sineEase.start();

        sineEase2 = new g2l.SineEase (
            g2l.EaseMode.EASE_IN_OUT,
            7500,
            true
        );

        sineEase2.start();
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

        renderer.setAttribute (
            attributeLocations.vertexNormal,
            vertexBuffers.normal
        );

        setUpTransform();
        
        renderer.setSampler (
            uniformLocations.unique.sampler,
            texture
        );

        renderer.drawIndexedPrimitives (
            indexBuffer,
            g2l.PrimitiveType.TRIANGLE_LIST,
            36
        );
    }

    function setUpTransform() {
        //
        var modelMatrix = g2l.Matrix4x4.createRotationMatrix (
            // Part 1.
            g2l.CartesianAxis.Y,
            // Part 2.
           -g2l.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
            sineEase.ratioOfCurrentToTotalTimeOffset
        );

        modelMatrix = g2l.Matrix4x4.multiplyMatrices (
            g2l.Matrix4x4.createRotationMatrix (
                // Part 1.
                g2l.CartesianAxis.X,
                // Part 2.
                g2l.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
                sineEase2.ratioOfCurrentToTotalTimeOffset
            ),
            modelMatrix
        );

        var transposeOfInverseOfModelMatrix =
            g2l.Matrix4x4.invertMatrix(modelMatrix);

        transposeOfInverseOfModelMatrix =
            g2l.Matrix4x4.transposeMatrix(transposeOfInverseOfModelMatrix);
        
        renderer.setMatrix4x4Uniform (
            uniformLocations.shared.transposeOfInverseOfModelMatrix,
            transposeOfInverseOfModelMatrix.db
        );

        camera.getTransform(transform);

        transform = g2l.Matrix4x4.multiplyMatrices (
            transform,
            modelMatrix
        );

        renderer.setMatrix4x4Uniform (
            uniformLocations.shared.transform,
            transform.db
        );
    }
}
