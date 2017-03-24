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
    var sampler1UniformLocation;
    var sampler2UniformLocation;
    var vertexPositionBuffer;
    var vertexTextureCoordinateBuffer;
    var transform;
    var mainTexture;
    var starburstTexture;

    try {
        //
        scene = new Cybo.Xcene();

        renderingContext =
            scene.graphicsManager.renderingContext;

        var p = new Cybo.Vector3D(0, 0, 1250);
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
        setUpBuffers(0, 0, 500, 500);

        // Sets up the textures.
        setUpTextures();

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
            Multitexturing.VERTEX_SHADER_SOURCE
        );

        var fragmentShader = scene.assetManager.loadShader (
            Cybo.ShaderType.FRAGMENT_SHADER,
            Multitexturing.FRAGMENT_SHADER_SOURCE
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

        sampler1UniformLocation = (
            scene.graphicsManager.getUniformLocation (
                shaderProgram,
                'sampler1'
            )
        );

        sampler2UniformLocation = (
            scene.graphicsManager.getUniformLocation (
                shaderProgram,
                'sampler2'
            )
        );
    }

    function setUpBuffers(x, y, w, h) {
        //
        var halfWidth = w / 2;
        var halfHeight = h / 2;

        var vertexPositions = [
            x+halfWidth, y-halfHeight, 0,
            x+halfWidth, y+halfHeight, 0,
            x-halfWidth, y-halfHeight, 0,
            x-halfWidth, y+halfHeight, 0
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
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 1.0
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
            //'../../assets/images/mier.jpg';
            '../../assets/images/jeremy-mann/cat.jpg';

        mainTexture = scene.assetManager.loadTexture2D(url);

        url = '../../assets/images/starburst.jpg';

        starburstTexture = scene.assetManager.loadTexture2D(url);        
    }

    function drawScene() {
        //
        scene.graphicsManager.clear (
            undefined,
            Cybo.Colors.CADET_BLUE
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
            sampler1UniformLocation,
            0
        );

        renderingContext.activeTexture (
            WebGLRenderingContext.TEXTURE1
        );

        renderingContext.bindTexture (
            WebGLRenderingContext.TEXTURE_2D,
            starburstTexture
        );
        
        scene.graphicsManager.setSamplerUniform (
            sampler2UniformLocation,
            1
        );

        renderingContext.drawArrays (
            WebGLRenderingContext.TRIANGLE_STRIP,
            0,
            4
        );
    }

    function setUpTransform() {
        //
        camera.getTransform(transform);

        scene.graphicsManager.setMatrix4x4Uniform (
            transformUniformLocation,
            transform
        );
    }
}
