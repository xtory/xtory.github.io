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
    var sineEase;
    var sineEase2;
    var transform;
    var texture;

    try {
        //
        scene = new g2l.Xcene();
        gl = scene.renderer.webGLContext;

        document.body.appendChild(gl.canvas);

        setUpCamera();
        
        setUpGeometries();

        setUpTextures();

        setUpShaders();

        setUpTime();

        transform = g2l.Matrix4x4.createIdentityMatrix();

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
        var p = new g2l.Vector3D(0, 0, 325);
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
            position: scene.loader.createVertexBuffer(),
            normal: scene.loader.createVertexBuffer(),
            textureCoordinates: scene.loader.createVertexBuffer()
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

        vertexBuffers.position.setItems (
            vertexPositions,
            3
        );

        // 
        // Vertex normals.
        //
        var vertexNormals = [
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
        ];

        vertexBuffers.normal.setItems (
            vertexNormals,
            3
        );

        //
        // Vertex texture coordinates.
        //
        var vertexTextureCoordinates = [
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
        ];

        vertexBuffers.textureCoordinates.setItems (
            vertexTextureCoordinates,
            2
        );

        //
        // Vertex indices.
        //
        indexBuffer = scene.loader.createIndexBuffer();

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

    function setUpTextures() {
        //
        var url = // which is relative to index.html, not main.js
            '../../assets/images/jeremy-mann/market-street.jpg';

        texture = scene.loader.loadTexture2D(url);
    }

    function setUpShaders() {
        //
        program = scene.loader.setUpProgram (
            PhongShading.VERTEX_SHADER_SOURCE,
            PhongShading.FRAGMENT_SHADER_SOURCE
        );

        attributeLocations = {
            //
            vertexPosition: scene.renderer.getAttributeLocation (
                program,
               'vertexPosition'
            ),

            vertexNormal: scene.renderer.getAttributeLocation (
                program,
               'vertexNormal'
            ),
            
            vertexTextureCoordinates: scene.renderer.getAttributeLocation (
                program,
               'vertexTextureCoordinates'
            )
        };
        
        uniformLocations = {
            //
            transform: scene.renderer.getUniformLocation (
                program,
               'transform'
            ),

            transposeOfInverseOfModelMatrix: scene.renderer.getUniformLocation (
                program,
               'transposeOfInverseOfModelMatrix'
            ),

            sampler: scene.renderer.getUniformLocation (
                program,
               'sampler'
            )
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

    function drawScene() {
        //
        scene.renderer.clear();

        scene.renderer.program = program;

        scene.renderer.setAttribute (
            attributeLocations.vertexPosition,
            vertexBuffers.position
        );

        scene.renderer.setAttribute (
            attributeLocations.vertexTextureCoordinates,
            vertexBuffers.textureCoordinates
        );

        scene.renderer.setAttribute (
            attributeLocations.vertexNormal,
            vertexBuffers.normal
        );

        setUpTransform();
        
        scene.renderer.setSampler (
            uniformLocations.sampler,
            texture
        );

        scene.renderer.drawIndexedPrimitives (
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
        
        scene.renderer.setUniform (
            uniformLocations.transposeOfInverseOfModelMatrix,
            transposeOfInverseOfModelMatrix
        );

        camera.getTransform(transform);

        transform = g2l.Matrix4x4.multiplyMatrices (
            transform,
            modelMatrix
        );

        scene.renderer.setUniform (
            uniformLocations.transform,
            transform
        );
    }
}
