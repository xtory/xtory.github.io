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
    var transform;
    var texture1;
    var texture2;

    try {
        //
        renderer = new xc.Renderer();
        document.body.appendChild(renderer.canvas);

        loader = renderer.loader;

        setUpCamera();

        setUpGeometries(0, 0, 500, 500);

        setUpTextures();

        setUpShaders();

        transform = xc.Matrix4x4.createIdentityMatrix();
            
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
        var url = '../../assets/images/jeremy-mann/market-street.jpg';
        texture1 = loader.loadTexture2D(url);

        url = '../../assets/images/starburst.jpg';
        texture2 = loader.loadTexture2D(url);        
    }

    function setUpShaders() {
        //
        program = loader.setUpProgram (
            Multitexturing.VERTEX_SHADER_SOURCE,
            Multitexturing.FRAGMENT_SHADER_SOURCE
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
                sampler1: renderer.getUniformLocation (
                    program,
                    'sampler1'
                ),

                sampler2: renderer.getUniformLocation (
                    program,
                    'sampler2'
                )
            }
        };
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

        camera.getTransform(transform);

        renderer.setMatrix4x4Uniform (
            uniformLocations.shared.transform,
            transform.db
        );
        
        renderer.setSampler (
            uniformLocations.unique.sampler1,
            texture1,
            0
        );

        renderer.setSampler (
            uniformLocations.unique.sampler2,
            texture2,
            1
        );

        renderer.drawPrimitives (
            xc.PrimitiveType.TRIANGLE_STRIP,
            0,
            4
        );
    }
}
