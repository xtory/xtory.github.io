function main() {
    //
    'use strict';

    var scene;
    var renderingContext;
    var camera;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var vertexNormalAttributeLocation;
    var vertexTextureCoordinateAttributeLocation;
    var transformUniformLocation;
    var transposeOfInverseOfModelMatrixUniformLocation;
    var samplerUniformLocation;
    var vertexPositionBuffer;
    var vertexNormalBuffer;
    var vertexTextureCoordinateBuffer;
    var indexBuffer;
    var sineEase;
    var sineEase2;
    var transform;
    var mainTexture;

    try {
        //
        scene = new Cybo.Xcene();

        renderingContext =
            scene.graphicsManager.renderingContext;

        var p = new Cybo.Vector3D(0, 0, 325);
        var origin = new Cybo.Vector3D(0, 0, 0);

        camera = new Cybo.Camera (
            scene,
            p,
            Cybo.Vector3D.subtractVectors(origin, p)
        );
        
        shaderHelper =
            new Cybo.ShaderHelper(scene.graphicsManager);

        // Set up the shaders; this is where all the lighting for the
        // vertices and so forth is established.
        setUpShaders();

        // Here's where we call the routine that builds all the objects
        // we'll be drawing.
        setUpBuffers();

        setUpTextures();

        sineEase = new Cybo.SineEase (
            Cybo.EaseMode.EASE_IN_OUT,
            3750,
            true
        );

        sineEase.start();

        sineEase2 = new Cybo.SineEase (
            Cybo.EaseMode.EASE_IN_OUT,
            7500,
            true
        );

        sineEase2.start();

        transform = Cybo.Matrix4x4.createIdentityMatrix();

        scene.run(updateScene, drawScene);

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
        var vertexShader = scene.assetManager.loadShader (
            Cybo.ShaderType.VERTEX_SHADER,
            PhongShading.VERTEX_SHADER_SOURCE
        );
            
        var fragmentShader = scene.assetManager.loadShader (
            Cybo.ShaderType.FRAGMENT_SHADER,
            PhongShading.FRAGMENT_SHADER_SOURCE
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

        vertexNormalAttributeLocation = (
            scene.graphicsManager.getShaderAttributeLocation (
                shaderProgram,
                'vertexNormal'
            )
        );
        
        vertexTextureCoordinateAttributeLocation = (
            scene.graphicsManager.getShaderAttributeLocation (
                shaderProgram,
                'vertexTextureCoordinates'
            )
        );
        
        transformUniformLocation = (
            scene.graphicsManager.getShaderUniformLocation (
                shaderProgram,
                'transform'
            )
        );

        transposeOfInverseOfModelMatrixUniformLocation = (
            scene.graphicsManager.getShaderUniformLocation (
                shaderProgram,
                'transposeOfInverseOfModelMatrix'
            )
        );

        samplerUniformLocation = (
            scene.graphicsManager.getShaderUniformLocation (
                shaderProgram,
                'sampler'
            )
        );
    }

    function setUpBuffers() {
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
        // Vertex normals.
        //
        vertexNormalBuffer =
            renderingContext.createBuffer();

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

        scene.graphicsManager.setUpVertexBuffer (
            vertexNormalBuffer,
            vertexNormals
        );

        //
        // Vertex texture coordinates.
        //
        vertexTextureCoordinateBuffer =
            renderingContext.createBuffer();

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

        scene.graphicsManager.setUpVertexBuffer (
            vertexTextureCoordinateBuffer,
            vertexTextureCoordinates
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

    //
    // setUpTextures
    //
    // Initialize the textures we'll be using, then initiate a load of
    // the texture images. The handleTextureLoaded() callback will finish
    // the job; it gets called each time a texture finishes loading.
    //
    function setUpTextures() {
        //
        var url = // which is relative to index.html, not main.js
            '../../assets/images/jeremy-mann/market-street.jpg';

        mainTexture = scene.assetManager.loadTexture2D(url);
    }

    function updateScene() {
    }

    function drawScene() {
        //
        scene.graphicsManager.clear (
            undefined,
            new Cybo.Color(0.75, 0.5, 0.5, 1)
        );

        scene.graphicsManager.shaderProgram =
            shaderProgram;

        scene.graphicsManager.setShaderAttribute (
            vertexPositionAttributeLocation,
            vertexPositionBuffer,
            3
        );

        scene.graphicsManager.setShaderAttribute (
            vertexTextureCoordinateAttributeLocation,
            vertexTextureCoordinateBuffer,
            2
        );

        scene.graphicsManager.setShaderAttribute (
            vertexNormalAttributeLocation,
            vertexNormalBuffer,
            3
        );

        setUpTransform();
        
        scene.graphicsManager.setShaderSampler (
            samplerUniformLocation,
            mainTexture
        );

        scene.graphicsManager.drawIndexedPrimitives (
            indexBuffer,
            WebGLRenderingContext.TRIANGLES,
            36
        );
    }

    function setUpTransform() {
        //
        var modelMatrix = Cybo.Matrix4x4.createRotationMatrix (
            // Part 1.
            Cybo.CartesianAxis.Y,
            // Part 2.
            Cybo.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
            sineEase.ratioOfCurrentToTotalTimeOffset
        );

        modelMatrix = Cybo.Matrix4x4.multiplyMatrices (
            Cybo.Matrix4x4.createRotationMatrix (
                // Part 1.
                Cybo.CartesianAxis.X,
                // Part 2.
               -Cybo.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES *
                sineEase2.ratioOfCurrentToTotalTimeOffset
            ),
            modelMatrix
        );

        var transposeOfInverseOfModelMatrix =
            Cybo.Matrix4x4.invertMatrix(modelMatrix);

        transposeOfInverseOfModelMatrix =
            Cybo.Matrix4x4.transposeMatrix(transposeOfInverseOfModelMatrix);
        
        scene.graphicsManager.setShaderUniform (
            transposeOfInverseOfModelMatrixUniformLocation,
            transposeOfInverseOfModelMatrix
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
    }
}
