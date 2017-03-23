function main() {
    //
    'use strict';

    var scene;
    var renderingContext;
    var camera;
    var shaderHelper;
    var shaderProgram;
    var vertexPositionAttributeLocation;
    var vertexTextureCoordinateAttributeLocation;
    var transformUniformLocation;
    var samplerUniformLocation;
    var vertexPositionBuffer;
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
            1500,
            true
        );

        sineEase.start();

        sineEase2 = new Cybo.SineEase (
            Cybo.EaseMode.EASE_IN_OUT,
            3000,
            true
        );
        
        sineEase2.start();

        transform = Cybo.Matrix4x4.createIdentityMatrix();
            
        scene.run(undefined, drawScene);

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
            Cybo.PositionTextureCoordinates.VERTEX_SHADER_SOURCE
        );

        var fragmentShader = scene.assetManager.loadShader (
            Cybo.ShaderType.FRAGMENT_SHADER,
            Cybo.PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE
        );

        shaderProgram = shaderHelper.setUpShaderProgram (
            vertexShader,
            fragmentShader
        );

        vertexPositionAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                shaderProgram,
                'vertexPosition'
            )
        );

        vertexTextureCoordinateAttributeLocation = (
            scene.graphicsManager.getAttributeLocation (
                shaderProgram,
                'vertexTextureCoordinates'
            )
        );

        transformUniformLocation = (
            scene.graphicsManager.getUniformLocation (
                shaderProgram,
                'transform'
            )
        );

        samplerUniformLocation = (
            scene.graphicsManager.getUniformLocation (
                shaderProgram,
                'sampler'
            )
        );
    }

    function setUpBuffers() {
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

        vertexPositionBuffer =
            renderingContext.createBuffer();

        // Select the vertexPositionBuffer as the one to apply vertex
        // operations to from here out.

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexPositionBuffer
        );

        // Now pass the list of vertex positions into WebGL to build the shape.
        // We do this by creating a Float32Array from the JavaScript array, then
        // use it to fill the current vertex buffer.

        renderingContext.bufferData (
            WebGLRenderingContext.ARRAY_BUFFER,
            new Float32Array(vertexPositions),
            WebGLRenderingContext.STATIC_DRAW
        );

        var textureCoordinates = [
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

        vertexTextureCoordinateBuffer =
            renderingContext.createBuffer();

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexTextureCoordinateBuffer
        );

        renderingContext.bufferData (
            WebGLRenderingContext.ARRAY_BUFFER,
            new Float32Array(textureCoordinates),
            WebGLRenderingContext.STATIC_DRAW
        );

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

        indexBuffer =
            renderingContext.createBuffer();

        renderingContext.bindBuffer (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            indexBuffer
        );

        // Now send the element array to GL

        renderingContext.bufferData (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(vertexIndices),
            WebGLRenderingContext.STATIC_DRAW
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
            '../../assets/images/market-street.jpg';

        mainTexture = scene.assetManager.loadTexture2D(url);
    }

    function drawScene() {
        //
        scene.graphicsManager.clear (
            undefined,
            new Cybo.Color(0.75, 0.5, 0.5, 1)
        );

        setUpTransform();

        scene.graphicsManager.shaderProgram =
            shaderProgram;

        scene.graphicsManager.enableVertexAttribute (
            vertexPositionAttributeLocation
        );

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexPositionBuffer
        );

        renderingContext.vertexAttribPointer (
            vertexPositionAttributeLocation,
            3,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );

        scene.graphicsManager.enableVertexAttribute (
            vertexTextureCoordinateAttributeLocation
        );

        renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexTextureCoordinateBuffer
        );

        renderingContext.vertexAttribPointer (
            vertexTextureCoordinateAttributeLocation,
            2,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );

        renderingContext.activeTexture (
            WebGLRenderingContext.TEXTURE0
        );

        renderingContext.bindTexture (
            WebGLRenderingContext.TEXTURE_2D,
            mainTexture
        );

        scene.graphicsManager.setSamplerUniform (
            samplerUniformLocation,
            0
        );

        renderingContext.bindBuffer (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            indexBuffer
        );

        renderingContext.drawElements (
            WebGLRenderingContext.TRIANGLES,
            36,
            WebGLRenderingContext.UNSIGNED_SHORT,
            0
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

        camera.getTransform(transform);

        transform = Cybo.Matrix4x4.multiplyMatrices (
            transform,
            modelMatrix
        );

        scene.graphicsManager.setMatrix4x4Uniform (
            transformUniformLocation,
            transform
        );
    }
}
