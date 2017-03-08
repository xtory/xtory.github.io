(function (exports) {
'use strict';

//
// Constructor.
//
function PositionColor() {
    // No contents.
}

//
// Prototype.
//
PositionColor.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
PositionColor.VERTEX_SHADER_SOURCE = [
    //
   'attribute vec3 vertexPosition;',
   'attribute vec4 vertexColor;',
   'uniform mat4 transform;',
    //
   'varying lowp vec4 color;',
    //
   'void main() {',
       'gl_Position = transform * vec4(vertexPosition, 1.0);',
       'color = vertexColor;',
   '}'

].join('\n');

PositionColor.FRAGMENT_SHADER_SOURCE = [
    //
   'varying lowp vec4 color;',
    //
   'void main() {',
       'gl_FragColor = color;',
   '}'

].join('\n');

Object.freeze(PositionColor);

//
// Constructor.
//
function PositionOnly() {
    // No contents.
}

//
// Prototype.
//
PositionOnly.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
PositionOnly.VERTEX_SHADER_SOURCE = [
    //
   'attribute vec3 vertexPosition;',
   'uniform mat4 transform;',
    //
   'void main() {',
       'gl_Position = transform * vec4(vertexPosition, 1.0);',
   '}'
   
].join('\n');

PositionOnly.FRAGMENT_SHADER_SOURCE = [
    //
   'void main() {',
       'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',
   '}'

].join('\n');

Object.freeze(PositionOnly);

//
// Constructor.
//
function PositionTextureCoordinates() {
    // No contents.
}

//
// Prototype.
//
PositionTextureCoordinates.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
PositionTextureCoordinates.VERTEX_SHADER_SOURCE = [
    //
   'attribute vec3 vertexPosition;',
   'attribute vec2 vertexTextureCoordinates;',
   'uniform mat4 transform;',
    //
   'varying highp vec2 textureCoordinates;',
    //
   'void main() {',
       'gl_Position = transform * vec4(vertexPosition, 1.0);',
       'textureCoordinates = vertexTextureCoordinates;',
   '}'

].join('\n');

PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE = [
    //
   'varying highp vec2 textureCoordinates;',
   'uniform sampler2D sampler;',
    //
   'void main() {',
       'gl_FragColor = texture2D(sampler, textureCoordinates);',
   '}'
   
].join('\n');

Object.freeze(PositionTextureCoordinates);

//
// Constructor.
//
function JSHelper() {
    // No contents.
}

//
// Prototype.
//
JSHelper.prototype = {
    // No contents.
};

//
// Static methods.
//
JSHelper.isUndefinedOrNull = function(value) {
    //
    if (value === undefined ||
        value === null) {
        return true;
    } else {
        return false;
    }
};

Object.freeze(JSHelper);

// Note:
// The equivelant of this value in C is 'FLT_EPSILON', and in the GNU C Library,
// http://www.gnu.org/software/libc/manual/html_node/Floating-Point-Parameters.html
// FLT_EPSILON is the difference between 1 and the smallest floating point number
// of type float that is greater than 1. It's not supposed to be greater than 1E-5.

// Note:
// C# float.Epsilon = 1.4013e-045f, which represents the smallest positive System.
// Single value greater than zero.

// Note:
// FLT_EPSILON is 1.192092896e-07F in <float.h>

// Note:
// SlimDX, Fly3D both define this value as 1e-6f and XNA uses 1e-4f, 1e-5f, or 1e-6f
// (in difference places) as epsilons. Cybo selects 1e-5f.

// Note:
// SlimDX uses the term ZeroTolerance to represent Epsilon.

// Note:
// In XNA, there is no such term called Epsilon. XNA directly uses 1e-4f, 1e-05f,
// 1e-06f or as epsilon. For instance...
// Ray.Intersects() directly uses 1e-05f as epsilon
// BoundingBox.Intersects() directly uses 1e-06f as epsilon, etc.

// Note:
// The equivelant in Fly3D of this value is 'FY_EPS'.
    
//
// Constructor.
//
function MathHelper() {
    // No contents.
}

//
// Prototype.
//
MathHelper.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//

// PI.

// Note:
// Pi = 3.1415926535897932 radians = 180 degrees.

MathHelper.PI                             = 3.1415926535897932;
MathHelper.PI_OVER_TWO                    = 1.5707963267948966;      // = pi / 2
MathHelper.PI_OVER_FOUR                   = 0.7853981633974483;      // = pi / 4
MathHelper.TWO_PI                         = 6.2831853071795864;      // = pi * 2
MathHelper.PI_OVER_ONE_EIGHTY             = 0.0174532925199432;      // = pi / 180
MathHelper.ONE_EIGHTY_OVER_PI             = 57.2957795130823208;     // = 180 / pi
MathHelper.RADIANS_OF_FORTY_FIVE_DEGREES  = MathHelper.PI_OVER_FOUR; // = MathHelper.toRadians(45)
MathHelper.RADIANS_OF_NINETY_DEGREES      = MathHelper.PI_OVER_TWO;  // = MathHelper.toRadians(90)
MathHelper.RADIANS_OF_ONE_EIGHTY_DEGREES  = MathHelper.PI;           // = MathHelper.toRadians(180)
MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES = MathHelper.TWO_PI;       // = MathHelper.toRadians(360)

// Epsilon.
MathHelper.EPSILON = 0.00001; // = 1e-5;

//
// Static methods.
//
MathHelper.toRadians = function(degrees) {
    //
    // Note:
    // 1 radian = (180 / pi) degrees.
    // => 1 degree = (pi / 180) radians.
    // => n degrees = (pi / 180) * n radians.

    return MathHelper.PiOverOneEighty * degrees;
},

MathHelper.toDegrees = function(radians) {
    //
    // Note:
    // 1 radian = (180 / pi) degrees.
    // => n radians = (180 / pi) * n degrees.

    return MathHelper.OneEightyOverPi * radians;
},

MathHelper.isPowerOfTwo = function(value) {
    //
    if (typeof(value) !== 'number') {
        throw 'A not-a-number exception raised.';
    }
    
    // Note:
    // For instance,
    // 2  = 00000010 
    // 4  = 00000100 
    // 8  = 00001000 
    // 16 = 00010000
    //
    // => 
    // 2 - 1 = 1 = 00000001 
    // 4 - 1 = 3 = 00000011 
    // 8 - 1 = 7 = 00000111
    //
    // =>
    // 2 & 1 = 00000010 & 00000001 = 0 
    // 8 & 7 = 00001000 & 00000111 = 0

    if (value !== 0 &&
        (value & (value - 1)) === 0) {
        return true;
    } else {
        return false;
    }
};

Object.freeze(MathHelper);

//
// Constructor.
//
function ShaderType() {
    // No contents.
}

//
// Prototype.
//
ShaderType.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
ShaderType.VERTEX_SHADER = 0;
ShaderType.FRAGMENT_SHADER = 1;

Object.freeze(ShaderType);

//
// Constructor.
//
function AssetManager(_xcene) {
    //
    var _renderingContext;

    Object.defineProperty(this, 'xcene', {
        get: function() { return _xcene; }
    });
    
    _renderingContext =
        _xcene.graphicsManager.renderingContext;

    Object.defineProperty(this, 'renderingContext', {
        get: function() { return _renderingContext; }
    });
}

//
// Prototype.
//
AssetManager.prototype = {
    //
    // Public methods.
    //
    loadShader: function(shaderType, shaderSource) {
        //
        var renderingContext = this.renderingContext;
        var shader;

        if (shaderType === ShaderType.VERTEX_SHADER) {
            //
            shader = renderingContext.createShader (
                WebGLRenderingContext.VERTEX_SHADER
            );
        } else if (
            shaderType === ShaderType.FRAGMENT_SHADER
        ){
            shader = renderingContext.createShader (
                WebGLRenderingContext.FRAGMENT_SHADER
            );
        } else {
            return null; // Unknown shader type
        }        

        // Send the source to the shader object
        renderingContext.shaderSource(shader, shaderSource);

        // Compile the shader program
        renderingContext.compileShader(shader);

        // See if it compiled successfully
        if (JSHelper.isUndefinedOrNull (
                renderingContext.getShaderParameter (
                    shader,
                    WebGLRenderingContext.COMPILE_STATUS
                )
            ) === true)
        {
            throw (
                'An error occurred compiling the shaders: ' +
                renderingContext.getShaderInfoLog(shader)
            );
        }

        return shader;
    },
    //
    // loadShaderFromHtmlElement
    //
    // Loads a shader program by scouring the current document,
    // looking for a script with the specified ID.
    //
    loadShaderFromHtmlElement: function(id) {
        //
        var renderingContext = this.renderingContext;

        var shaderScript = document.getElementById(id);

        // Didn't find an element with the specified ID; abort.

        if (shaderScript === null) {
            return null;
        }

        // Walk through the source element's children, building the
        // shader source string.

        var shaderSource = '';
        var currentChild = shaderScript.firstChild;

        while (currentChild !== null) {
            //
            if (currentChild.nodeType === Node.TEXT_NODE) {
                shaderSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        // Now figure out what type of shader script we have,
        // based on its MIME type.

        var shader;

        if (shaderScript.type === 'x-shader/x-vertex') {
            //
            shader = renderingContext.createShader (
                WebGLRenderingContext.VERTEX_SHADER
            );
        } else if (
            shaderScript.type === 'x-shader/x-fragment'
        ){
            shader = renderingContext.createShader (
                WebGLRenderingContext.FRAGMENT_SHADER
            );
        } else {
            return null; // Unknown shader type
        }

        // Send the source to the shader object
        renderingContext.shaderSource(shader, shaderSource);

        // Compile the shader program
        renderingContext.compileShader(shader);

        // See if it compiled successfully
        if (JSHelper.isUndefinedOrNull (
                renderingContext.getShaderParameter (
                    shader,
                    WebGLRenderingContext.COMPILE_STATUS
                )
            ) === true)
        {
            throw (
                'An error occurred compiling the shaders: ' +
                renderingContext.getShaderInfoLog(shader)
            );
        }

        return shader;
    },

    loadTexture2D: function(imageSourceUrl) {
        //
        var renderingContext = this.renderingContext;

        var image = new Image();
        var texture = renderingContext.createTexture();

        image.addEventListener('load', function() {
            handleTextureLoaded(image, texture);
        });

        image.src = imageSourceUrl;

        function handleTextureLoaded(image, texture) {
            //
            renderingContext.bindTexture (
                WebGLRenderingContext.TEXTURE_2D,
                texture
            );

            renderingContext.texImage2D (
                WebGLRenderingContext.TEXTURE_2D,    // target
                0,                                   // level
                WebGLRenderingContext.RGBA,          // internalFormat
                WebGLRenderingContext.RGBA,          // format
                WebGLRenderingContext.UNSIGNED_BYTE, // type
                image                                // htmlImageElement
            );

            if (MathHelper.isPowerOfTwo(image.width) === true &&
                MathHelper.isPowerOfTwo(image.height) === true) {
                //
                renderingContext.generateMipmap (
                    WebGLRenderingContext.TEXTURE_2D
                );
                
                renderingContext.texParameteri (
                    WebGLRenderingContext.TEXTURE_2D,
                    WebGLRenderingContext.TEXTURE_MIN_FILTER,
                    WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
                );

            } else {
                //
                renderingContext.texParameteri (
                    WebGLRenderingContext.TEXTURE_2D,
                    WebGLRenderingContext.TEXTURE_MIN_FILTER,
                    WebGLRenderingContext.LINEAR
                );
            }

            // TEXTURE_MAG_FILTER only has NEAREST or LINEAR to choose, no
            // LINEAR_MIPMAP_LINEAR.
            renderingContext.texParameteri (
                WebGLRenderingContext.TEXTURE_2D,
                WebGLRenderingContext.TEXTURE_MAG_FILTER,
                WebGLRenderingContext.LINEAR
            );

            renderingContext.texParameteri (
                WebGLRenderingContext.TEXTURE_2D,
                WebGLRenderingContext.TEXTURE_WRAP_S,
                WebGLRenderingContext.CLAMP_TO_EDGE
            );

            renderingContext.texParameteri (
                WebGLRenderingContext.TEXTURE_2D,
                WebGLRenderingContext.TEXTURE_WRAP_T,
                WebGLRenderingContext.CLAMP_TO_EDGE
            );

            renderingContext.bindTexture (
                WebGLRenderingContext.TEXTURE_2D,
                null
            );
        }

        return texture;
    }
};

Object.freeze(AssetManager);

//
// Constructor.
//
function Vector4D(_x, _y, _z, _w) {
    //
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.w = _w;
}

//
// Prototype.
//
Vector4D.prototype = {
    //
    // Public methods.
    //
    add: function(v) {
        return Vector4D.addVectors(this, v);
    },

    subtract: function(v) {
        return Vector4D.subtractVectors(this, v);
    }
};

//
// Static constants (after Object.freeze()).
//
Vector4D.ELEMENT_COUNT = 4;

//
// Static methods.
//
Vector4D.fromArray = function(a) {
    return new Vector4D(a[0], a[1], a[2], a[3]);
};

Vector4D.calculateUnitVectorOf = function(v) {
    //
    // Note:
    // All XNA, SlimDX, and WPF don't react to the situation when sqrt =
    // 0, such as zero vector's normalization. But finally I decide to
    // code in the way as the book 'Essential Mathematics for Games and
    // Interactive Applications' does.

    var sqrt = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z + v.w*v.w);

    if (sqrt < MathHelper.EPSILON) {
        //
        // Note:
        // Cybo doesn't throw a divide-by-zero exception when normalizing
        // Vector2D, Vector4D, Vector4D, Quaternion.
        /*
        console.log('A divide-by-zero exception raised.');
        */

        return new Vector4D(0, 0, 0, 0);

    } else {
        //
        var s = 1.0 / sqrt;
        return new Vector4D(v.x*s, v.y*s, v.z*s, v.w*s);
    }
};

Vector4D.addVectors = function(v1, v2) {
    return new Vector4D(v1.x+v2.x, v1.y+v2.y, v1.z+v2.z, v1.w+v2.w);
};

Vector4D.subtractVectors = function(v1, v2) {
    return new Vector4D(v1.x-v2.x, v1.y-v2.y, v1.z-v2.z, v1.w-v2.w);
};

Vector4D.transform = function(m, v) {
    //
    return new Vector4D (
        m.s11*v.x + m.s12*v.y + m.s13*v.z + m.s14*v.w,
        m.s21*v.x + m.s22*v.y + m.s23*v.z + m.s24*v.w,
        m.s31*v.x + m.s32*v.y + m.s33*v.z + m.s34*v.w,
        m.s41*v.x + m.s42*v.y + m.s43*v.z + m.s44*v.w
    );
};

Object.freeze(Vector4D);

//
// Constructor.
//
function Vector3D(_x, _y, _z) {
    //
    this.x = _x;
    this.y = _y;
    this.z = _z;
}

//
// Prototype.
//
Vector3D.prototype = {
    //
    // Public methods.
    //
    add: function(v) {
        return Vector3D.addVectors(this, v);
    },

    subtract: function(v) {
        return Vector3D.subtractVectors(this, v);
    }
};

//
// Static constants (after Object.freeze()).
//
Vector3D.ELEMENT_COUNT = 3;

//
// Static methods.
//
Vector3D.fromArray = function(a) {
    return new Vector3D(a[0], a[1], a[2]);
};

Vector3D.calculateUnitVectorOf = function(v) {
    //
    // Note:
    // All XNA, SlimDX, and WPF don't react to the situation when sqrt =
    // 0, such as zero vector's normalization. But finally I decide to
    // code in the way as the book 'Essential Mathematics for Games and
    // Interactive Applications' does.

    var sqrt = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);

    if (sqrt < MathHelper.EPSILON) {
        //
        // Note:
        // Cybo doesn't throw a divide-by-zero exception when normalizing
        // Vector2D, Vector3D, Vector4D, Quaternion.
        /*
        console.log('A divide-by-zero exception raised.');
        */

        return new Vector3D(0, 0, 0);

    } else {
        //
        var s = 1.0 / sqrt;
        return new Vector3D(v.x*s, v.y*s, v.z*s);
    }
};

Vector3D.negateVector = function (v) {
    return new Vector3D(-v.x, -v.y, -v.z);
};

Vector3D.addVectors = function(v1, v2) {
    return new Vector3D(v1.x+v2.x, v1.y+v2.y, v1.z+v2.z);
};

Vector3D.subtractVectors = function(v1, v2) {
    return new Vector3D(v1.x-v2.x, v1.y-v2.y, v1.z-v2.z);
};

Vector3D.calculateDotProductOf = function(v1, v2) {
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
};

Vector3D.calculateCrossProductOf = function(v1, v2) {
    //
    return new Vector3D (
        v1.y*v2.z - v1.z*v2.y,
        v1.z*v2.x - v1.x*v2.z,
        v1.x*v2.y - v1.y*v2.x
    );
};

Vector3D.transformPoint = function(m, p) {
    //
    var v = new Vector4D(p.x, p.y, p.z, 1);
    var v2 = Vector4D.Transform(m, v);

    var s = 1 / v2.w;
    return new Vector3D(v2.x*s, v2.y*s, v2.z*s);
};

Vector3D.transformVector = function(m, v) {
    //
    var v2 = new Vector4D(v.x, v.y, v.z, 0);
    v = Vector4D.Transform(m, v2);

    return new Vector3D(v.x, v.y, v.z);
};

Object.freeze(Vector3D);

//
// Constructor.
//
function AxisGroup() {
    // No contents.
}

//
// Prototype.
//
AxisGroup.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
AxisGroup.X_AXIS = new Vector3D(1, 0, 0);
AxisGroup.Y_AXIS = new Vector3D(0, 1, 0);
AxisGroup.Z_AXIS = new Vector3D(0, 0, 1);

Object.freeze(AxisGroup);

//
// Constructor.
//
function ViewFrustum() {
    // No contents.
}

//
// Prototype.
//
ViewFrustum.prototype = {
    // No contents.
};

Object.freeze(ViewFrustum);

//
// Constructor.
//
function CartesianAxis() {
    // No contents.
}

//
// Prototype.
//
CartesianAxis.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
CartesianAxis.X = 0;
CartesianAxis.Y = 1;
CartesianAxis.Z = 2;

Object.freeze(CartesianAxis);

//
// Constructor.
//
function Matrix4x4 (
    _s11, _s12, _s13, _s14,
    _s21, _s22, _s23, _s24,
    _s31, _s32, _s33, _s34,
    _s41, _s42, _s43, _s44
){
    // Note:
    // When storing matrices in memory, there are two ways of storing their
    // elements:
    // 1. Stored in the order s11, s12, s13, ..., s43, s44
    // => called 'row major' (used by DirectX), or
    // 2. Stored in the order s11, s21, s31, ..., s34, s44
    // => called 'column major' (used by OpenGL, WebGL)

    // Note:
    // 'm x n' matrix always means 'm rows, n columns' whether it's row or
    // column major.

    this.elements = [
        _s11, _s21, _s31, _s41,
        _s12, _s22, _s32, _s42,
        _s13, _s23, _s33, _s43,
        _s14, _s24, _s34, _s44
    ];

    //
    // Properties.
    //
    Object.defineProperty(this, 's11', {
        get: function() { return this.elements[0]; }
    });

    Object.defineProperty(this, 's12', {
        get: function() { return this.elements[4]; }
    });

    Object.defineProperty(this, 's13', {
        get: function() { return this.elements[8]; }
    });

    Object.defineProperty(this, 's14', {
        get: function() { return this.elements[12]; }
    });

    Object.defineProperty(this, 's21', {
        get: function() { return this.elements[1]; }
    });

    Object.defineProperty(this, 's22', {
        get: function() { return this.elements[5]; }
    });

    Object.defineProperty(this, 's23', {
        get: function() { return this.elements[9]; }
    });

    Object.defineProperty(this, 's24', {
        get: function() { return this.elements[13]; }
    });

    Object.defineProperty(this, 's31', {
        get: function() { return this.elements[2]; }
    });

    Object.defineProperty(this, 's32', {
        get: function() { return this.elements[6]; }
    });

    Object.defineProperty(this, 's33', {
        get: function() { return this.elements[10]; }
    });

    Object.defineProperty(this, 's34', {
        get: function() { return this.elements[14]; }
    });

    Object.defineProperty(this, 's41', {
        get: function() { return this.elements[3]; }
    });

    Object.defineProperty(this, 's42', {
        get: function() { return this.elements[7]; }
    });

    Object.defineProperty(this, 's43', {
        get: function() { return this.elements[11]; }
    });

    Object.defineProperty(this, 's44', {
        get: function() { return this.elements[15]; }
    });
}

//
// Prototype.
//
Matrix4x4.prototype = {
    //
    // Public methods.
    //
    multiply: function(m) {
        return Matrix4x4.multiplyMatrices(this, m);
    }
};

//
// Static constants (after Object.freeze()).
//
Matrix4x4.ELEMENT_COUNT = 16;

//
// Static methods.
//
Matrix4x4.fromArray = function(a) {
    //
    return new Matrix4x4 (
        a[0], a[4], a[ 8], a[12],
        a[1], a[5], a[ 9], a[13],
        a[2], a[6], a[10], a[14],
        a[3], a[7], a[11], a[15]
    );
};

Matrix4x4.createIdentityMatrix = function() {
    //
    return new Matrix4x4 (
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
};

Matrix4x4.createViewMatrix = function (
    cameraPosition,
    cameraTargetPosition,
    cameraUpDirection
){
    // Note:
    // Formula of the Direct3D Matrix.LookAtRH method:
    //
    // [ axisX.x                      axisY.x                      axisZ.x                     0
    //   axisX.y                      axisY.y                      axisZ.y                     0
    //   axisX.z                      axisY.z                      axisZ.z                     0
    //  -dot(axisX, cameraPosition)  -dot(axisY, cameraPosition)  -dot(axisZ, cameraPosition)  1 ]
    //
    // where
    // axisZ = normal(cameraPosition - cameraTargetPosition)
    // axisX = normal(cross(cameraUpVector, axisZ))
    // axisY = cross(axisZ, axisX)
    //
    var axisX, axisY, axisZ, v;
    
    v = Vector3D.subtractVectors (
        cameraPosition,
        cameraTargetPosition
    );

    axisZ = Vector3D.calculateUnitVectorOf(v);
    v = Vector3D.calculateCrossProductOf(cameraUpDirection, axisZ);
    axisX = Vector3D.calculateUnitVectorOf(v);
    axisY = Vector3D.calculateCrossProductOf(axisZ, axisX);

    var s11 = axisX.x;
    var s21 = axisY.x;
    var s31 = axisZ.x;
    var s41 = 0;

    var s12 = axisX.y;
    var s22 = axisY.y;
    var s32 = axisZ.y;
    var s42 = 0;

    var s13 = axisX.z;
    var s23 = axisY.z;
    var s33 = axisZ.z;
    var s43 = 0;

    var s14 = -Vector3D.calculateDotProductOf(axisX, cameraPosition);
    var s24 = -Vector3D.calculateDotProductOf(axisY, cameraPosition);
    var s34 = -Vector3D.calculateDotProductOf(axisZ, cameraPosition);
    var s44 = 1;

    return new Matrix4x4 (
        s11, s12, s13, s14,
        s21, s22, s23, s24,
        s31, s32, s33, s34,
        s41, s42, s43, s44
    );
};

Matrix4x4.createProjectionMatrix = function (
    fovY,        // fieldOfViewY
    aspectRatio, // Aspect ratio of 'viewport', not 'back buffer'!
    near,        // distanceToNearPlane
    far          // distanceToFarPlane
){
    if (fovY === undefined) {
        fovY = Camera.FIELD_OF_VIEW_Y;
    }

    if (near === undefined) {
        near = Camera.DEFAULT_DISTANCE_TO_NEAR_PLANE;
    }

    if (far === undefined) {
        far = Camera.DEFAULT_DISTANCE_TO_FAR_PLANE;
    }

    // Note:
    // Formula of the Direct3D Matrix.PerspectiveFovRH method:
    //
    // [ w    0    0                      0
    //   0    h    0                      0
    //   0    0    far/(near-far)        -1
    //   0    0    near*far/(near-far)    0 ]
    //
    // where
    // h = cot(fovY/2) = 1 / tan(fovY/2)
    // w = h / aspectRatio
    //
    var w, h;

    h = 1.0 / Math.tan(fovY / 2.0);
    w = h / aspectRatio;

    var a = [];

    a[0] = w;
    a[1] = 0;
    a[2] = 0;
    a[3] = 0;

    a[4] = 0;
    a[5] = h;
    a[6] = 0;
    a[7] = 0;

    a[ 8] =  0;
    a[ 9] =  0;
    a[10] = far / (near - far);
    a[11] = -1;

    a[12] = 0;
    a[13] = 0;
    a[14] = near * far / (near - far);
    a[15] = 0;

    return Matrix4x4.fromArray(a);
};

Matrix4x4.createScaleMatrix = function(v) {
    //
    return new Matrix4x4 (
        v.x, 0,   0,   0,
        0,   v.y, 0,   0,
        0,   0,   v.z, 0,
        0,   0,   0,   1
    );
};

Matrix4x4.createRotationMatrix = function (
    cartesianAxis,
    angle // in radians.
){
    var cosine = Math.cos(angle);
    var sine   = Math.sin(angle);

    switch (cartesianAxis) {
        //
        case CartesianAxis.X: {
            //
            return new Matrix4x4 (
                1,    0,         0,         0,
                0,    cosine,    sine,      0,
                0,   -sine,      cosine,    0,
                0,    0,         0,         1
            );
        }

        case CartesianAxis.Y: {
            //
            return new Matrix4x4 (
                cosine,    0,   -sine,      0,
                0,         1,    0,         0,
                sine,      0,    cosine,    0,
                0,         0,    0,         1
            );
        }

        case CartesianAxis.Z: {
            //
            return new Matrix4x4 (
                cosine,    sine,      0,    0,
                -sine,      cosine,    0,    0,
                0,         0,         1,    0,
                0,         0,         0,    1
            );
        }

        default: {
            console.log('A not-supported exception raised.');
            break;
        }
    }
};

Matrix4x4.createTranslationMatrix = function(v) {
    //
    return new Matrix4x4 (
        1, 0, 0, v.x,
        0, 1, 0, v.y,
        0, 0, 1, v.z,
        0, 0, 0,   1
    );
};

Matrix4x4.multiplyMatrices = function(m1, m2) {
    //
    var a1 = m1.elements;
    var a2 = m2.elements;
    var a3 = [];

    var a11=a1[0], a12=a1[4], a13=a1[ 8], a14=a1[12];
    var a21=a1[1], a22=a1[5], a23=a1[ 9], a24=a1[13];
    var a31=a1[2], a32=a1[6], a33=a1[10], a34=a1[14];
    var a41=a1[3], a42=a1[7], a43=a1[11], a44=a1[15];

    var b11=a2[0], b12=a2[4], b13=a2[ 8], b14=a2[12];
    var b21=a2[1], b22=a2[5], b23=a2[ 9], b24=a2[13];
    var b31=a2[2], b32=a2[6], b33=a2[10], b34=a2[14];
    var b41=a2[3], b42=a2[7], b43=a2[11], b44=a2[15];

    a3[ 0] = a11*b11 + a12*b21 + a13*b31 + a14*b41;
    a3[ 4] = a11*b12 + a12*b22 + a13*b32 + a14*b42;
    a3[ 8] = a11*b13 + a12*b23 + a13*b33 + a14*b43;
    a3[12] = a11*b14 + a12*b24 + a13*b34 + a14*b44;

    a3[ 1] = a21*b11 + a22*b21 + a23*b31 + a24*b41;
    a3[ 5] = a21*b12 + a22*b22 + a23*b32 + a24*b42;
    a3[ 9] = a21*b13 + a22*b23 + a23*b33 + a24*b43;
    a3[13] = a21*b14 + a22*b24 + a23*b34 + a24*b44;

    a3[ 2] = a31*b11 + a32*b21 + a33*b31 + a34*b41;
    a3[ 6] = a31*b12 + a32*b22 + a33*b32 + a34*b42;
    a3[10] = a31*b13 + a32*b23 + a33*b33 + a34*b43;
    a3[14] = a31*b14 + a32*b24 + a33*b34 + a34*b44;

    a3[ 3] = a41*b11 + a42*b21 + a43*b31 + a44*b41;
    a3[ 7] = a41*b12 + a42*b22 + a43*b32 + a44*b42;
    a3[11] = a41*b13 + a42*b23 + a43*b33 + a44*b43;
    a3[15] = a41*b14 + a42*b24 + a43*b34 + a44*b44;

    return Matrix4x4.fromArray(a3);
};

Matrix4x4.transposeMatrix = function(m) {
    //
    return new Matrix4x4 (
        m.s11, m.s21, m.s31, m.s41,
        m.s12, m.s22, m.s32, m.s42,
        m.s13, m.s23, m.s33, m.s43,
        m.s14, m.s24, m.s34, m.s44
    );
};

Matrix4x4.invertMatrix = function(m) {
    //
    // Note:
    // Adapted from THREE's Matrix4.getInverse()
    //
    var s11=m.s11, s12=m.s12, s13=m.s13, s14=m.s14;
    var s21=m.s21, s22=m.s22, s23=m.s23, s24=m.s24;
    var s31=m.s31, s32=m.s32, s33=m.s33, s34=m.s34;
    var s41=m.s41, s42=m.s42, s43=m.s43, s44=m.s44;

    var d11 = s23*s34*s42 - s24*s33*s42 + s24*s32*s43 - s22*s34*s43 - s23*s32*s44 + s22*s33*s44;
    var d12 = s14*s33*s42 - s13*s34*s42 - s14*s32*s43 + s12*s34*s43 + s13*s32*s44 - s12*s33*s44;
    var d13 = s13*s24*s42 - s14*s23*s42 + s14*s22*s43 - s12*s24*s43 - s13*s22*s44 + s12*s23*s44;
    var d14 = s14*s23*s32 - s13*s24*s32 - s14*s22*s33 + s12*s24*s33 + s13*s22*s34 - s12*s23*s34;

    // Calculates the determinant.
    var s = s11*d11 + s21*d12 + s31*d13 + s41*d14;

    if (s === 0) {
        throw 'Can\'t invert matrix cuz determinant is 0';
    }

    s = 1 / s;

    return Matrix4x4.fromArray ([
        d11 * s,
        (s24*s33*s41 - s23*s34*s41 - s24*s31*s43 + s21*s34*s43 + s23*s31*s44 - s21*s33*s44) * s,
        (s22*s34*s41 - s24*s32*s41 + s24*s31*s42 - s21*s34*s42 - s22*s31*s44 + s21*s32*s44) * s,
        (s23*s32*s41 - s22*s33*s41 - s23*s31*s42 + s21*s33*s42 + s22*s31*s43 - s21*s32*s43) * s,
        d12 * s,
        (s13*s34*s41 - s14*s33*s41 + s14*s31*s43 - s11*s34*s43 - s13*s31*s44 + s11*s33*s44) * s,
        (s14*s32*s41 - s12*s34*s41 - s14*s31*s42 + s11*s34*s42 + s12*s31*s44 - s11*s32*s44) * s,
        (s12*s33*s41 - s13*s32*s41 + s13*s31*s42 - s11*s33*s42 - s12*s31*s43 + s11*s32*s43) * s,
        d13 * s,
        (s14*s23*s41 - s13*s24*s41 - s14*s21*s43 + s11*s24*s43 + s13*s21*s44 - s11*s23*s44) * s,
        (s12*s24*s41 - s14*s22*s41 + s14*s21*s42 - s11*s24*s42 - s12*s21*s44 + s11*s22*s44) * s,
        (s13*s22*s41 - s12*s23*s41 - s13*s21*s42 + s11*s23*s42 + s12*s21*s43 - s11*s22*s43) * s,
        d14 * s,
        (s13*s24*s31 - s14*s23*s31 + s14*s21*s33 - s11*s24*s33 - s13*s21*s34 + s11*s23*s34) * s,
        (s14*s22*s31 - s12*s24*s31 - s14*s21*s32 + s11*s24*s32 + s12*s21*s34 - s11*s22*s34) * s,
        (s12*s23*s31 - s13*s22*s31 + s13*s21*s32 - s11*s23*s32 - s12*s21*s33 + s11*s22*s33) * s
    ]);
};

Object.freeze(Matrix4x4);

//
// Constructor.
//
function Camera (
    _scene,
    _position,
    _facingDirection,
    _upDirection,
    _distanceToNearPlane,
    _distanceToFarPlane
){
    var _viewMatrix;
    var _projectionMatrix;
    var _transform;
    var _viewFrustum;
    var _hasToUpdateViewMatrix;
    var _hasToUpdateProjectionMatrix;
    var _hasToRaiseTransformUpdatedEvent;
    var _lastViewportAspectRatio;
        
    try {
        //
        if (_position === undefined) {
            _position = new Vector3D(0, 0, 10000);
        }

        if (_facingDirection === undefined) {
            _facingDirection = Camera.DEFAULT_FACING_DIRECTION;
        }

        if (_upDirection === undefined) {
            _upDirection = Camera.DEFAULT_UP_DIRECTION;
        }

        if (_distanceToNearPlane === undefined) {
            _distanceToNearPlane = Camera.DEFAULT_DISTANCE_TO_NEAR_PLANE;
        }

        if (_distanceToFarPlane === undefined) {
            _distanceToFarPlane = Camera.DEFAULT_DISTANCE_TO_FAR_PLANE;
        }

        if (_distanceToNearPlane < Camera.MIN_DISTANCE_TO_NEAR_PLANE) {
            _distanceToNearPlane = Camera.MIN_DISTANCE_TO_NEAR_PLANE;
        }

        if (Camera.MAX_DISTANCE_TO_FAR_PLANE < _distanceToFarPlane) {
            _distanceToFarPlane = Camera.MAX_DISTANCE_TO_FAR_PLANE;
        }

        _viewFrustum = new ViewFrustum();

        Object.defineProperty(this, 'viewFrustum', {
            'get': function() { return _viewFrustum; }
        });

        _hasToUpdateViewMatrix           = true;
        _hasToUpdateProjectionMatrix     = true;
        _hasToRaiseTransformUpdatedEvent = true;
        
    } catch (e) {
        //
        console.log('Cybo.Camera: ', e);

        throw e;
    }

    //
    // Private methods.
    //
    function checkViewMatrix() {
        //
        if (_hasToUpdateViewMatrix === false) {
            return;
        }

        _viewMatrix = Matrix4x4.createViewMatrix (
            _position,
            _facingDirection,
            _upDirection
        );

        _hasToRaiseTransformUpdatedEvent = true;
        _hasToUpdateViewMatrix = false;
    }

    function checkProjectionMatrix() {
        //
        // Note:
        // Calculates the aspect ratio of "viewport", not "back buffer".

        // Temp: Change back to viewport later.
        /*
        var viewportAspectRatio =
            _scene.graphicsManager.Viewport.AspectRatio;
        */
        var viewportAspectRatio =
            window.innerWidth / window.innerHeight;
        // :Temp

        // Note:
        // The values we want to compare are ratios, we can't just compare if
        // they are equal. The results could be different in the debug and re-
        // lease modes and this will cause subtle bugs. Be careful!
        /*
        if (viewportAspectRatio === _lastViewportAspectRatio) {
            return;
        }
        */

        // Temp:
        /*
        if (_hasToUpdateProjectionMatrix === false &&
            MathHelper.areEqual(viewportAspectRatio, _lastViewportAspectRatio) === true) {
            return;
        }
        */
        if (_hasToUpdateProjectionMatrix === false &&
            viewportAspectRatio === _lastViewportAspectRatio) {
            return;
        }
        // :Temp
        // :Note

        _lastViewportAspectRatio = viewportAspectRatio;

        _projectionMatrix = Matrix4x4.createProjectionMatrix (
            Camera.FIELD_OF_VIEW_Y,
            _lastViewportAspectRatio,
            _distanceToNearPlane,
            _distanceToFarPlane
        );

        _hasToRaiseTransformUpdatedEvent = true;
        _hasToUpdateProjectionMatrix = false;
    }

    //
    // Priviledged methods.
    //
    this.getViewMatrix = function(m) {
        //
        checkViewMatrix();
        m.elements = _viewMatrix.elements.slice();
    };

    this.getProjectionMatrix = function(m) {
        //
        checkProjectionMatrix();
        m.elements = _projectionMatrix.elements.slice();
    };

    this.getTransform = function(m) {
        //
        // Checks the view matrix.
        checkViewMatrix();

        // Checks the projection matrix.
        checkProjectionMatrix();

        if (_hasToRaiseTransformUpdatedEvent === true) {
            //
            // Note:
            // _hasToRaiseTransformUpdatedEvent == true means _viewMatrix or
            // _projectionMatrix (or both) is recreated. So, _transform has
            // to be recalculated.

            // Recalculates the transform.
            _transform = Matrix4x4.multiplyMatrices (
                _projectionMatrix,
                _viewMatrix
            );
        }

        m.elements = _transform.elements.slice();

        // Raises the transform-updated event (if necessary).
        if (_hasToRaiseTransformUpdatedEvent === true) {
            // Temp:
            /*
            if (this.TransformUpdated != null) {
                this.TransformUpdated(this, EventArgs.Empty);
            }
            */

            _hasToRaiseTransformUpdatedEvent = false;
        }
    };
}   

//
// Prototype.
//
Camera.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
Camera.DEFAULT_FACING_DIRECTION       = Vector3D.negateVector(AxisGroup.Z_AXIS);
Camera.DEFAULT_UP_DIRECTION           = AxisGroup.Y_AXIS;
Camera.FIELD_OF_VIEW_Y                = MathHelper.PI_OVER_FOUR;           // = pi / 4
Camera.MIN_DISTANCE_TO_NEAR_PLANE     = 10;
Camera.MAX_DISTANCE_TO_FAR_PLANE      = 1000000;                           // = 10^6
Camera.DEFAULT_DISTANCE_TO_NEAR_PLANE = Camera.MIN_DISTANCE_TO_NEAR_PLANE; // = 10.
Camera.DEFAULT_DISTANCE_TO_FAR_PLANE  = 100000;                            // = 10^5

Object.freeze(Camera);

//
// Constructor.
//
function ShaderHelper(_graphicsManager) {
    //
    var _renderingContext =
        _graphicsManager.renderingContext;
    
    Object.defineProperty(this, 'renderingContext', {
        get: function() { return _renderingContext; }
    });
}

//
// Prototype.
//
ShaderHelper.prototype = {
    //
    // Public methods.
    //
    setUpShaderProgram: function(vertexShader, fragmentShader) {
        //
        var shaderProgram =
            this.renderingContext.createProgram();
        
        this.renderingContext.attachShader(shaderProgram, vertexShader);
        this.renderingContext.attachShader(shaderProgram, fragmentShader);
        this.renderingContext.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (JSHelper.isUndefinedOrNull (
                //
                this.renderingContext.getProgramParameter (
                    shaderProgram,
                    WebGLRenderingContext.LINK_STATUS
                )
            ) === true)
        {
            throw (
                'Unable to initialize the shader program: ' +
                this.renderingContext.getProgramInfoLog(shader)
            );
        }
        
        return shaderProgram;
    }
};

Object.freeze(ShaderHelper);

// Note:
// Texture Coordinates.
//
// DirectX: (U, V)      WebGL: (S, T)           
//            
// (0, 0)     (1, 0)    (0, 1)     (1, 1)        
//     ┌───────┐            ┌───────┐            
//     │       │            │       │            
//     │       │            │       │            
//     └───────┘            └───────┘            
// (0, 1)     (1, 1)    (0, 0)     (1, 0)        
//
// The conditions below must be satisfied...
// V = -2 <-> T =  3
// V = -1 <-> T =  2
// V =  0 <-> T =  1
// V =  1 <-> T =  0
// V =  2 <-> T = -1
// V =  3 <-> T = -2
// => T = 1 - V
// => V = 1 - T

//
// Constructor.
//
function TextureCoordinateHelper() {
    // No contents.
}

//
// Prototype.
//
TextureCoordinateHelper.prototype = {
    // No contents.
};

//
// Static methods.
//
TextureCoordinateHelper.toUV = function(s, t) {
    //
    return {
        u: s,
        v: 1 - t
    };
};

TextureCoordinateHelper.toST = function(u, v) {
    //
    return {
        s: u,
        t: 1 - v
    };
};    

Object.freeze(TextureCoordinateHelper);

//
// Constructor.
//
function WebGLRenderingContextHelper() {
    // No contents.
}

//
// Prototype.
//
WebGLRenderingContextHelper.prototype = {
    // No contents.
};

//
// Static methods.
//
WebGLRenderingContextHelper.syncConstants = function(renderingContext) {
    //
    // Note:
    // Reference to WebGLRenderingContextBase interface in WebGL 1.0 spec.

    /* ClearBufferMask */
    syncConstant('DEPTH_BUFFER_BIT');

    /* ClearBufferMask */
    syncConstant('DEPTH_BUFFER_BIT');
    syncConstant('STENCIL_BUFFER_BIT');
    syncConstant('COLOR_BUFFER_BIT');

    /* BeginMode */
    syncConstant('POINTS');
    syncConstant('LINES');
    syncConstant('LINE_LOOP');
    syncConstant('LINE_STRIP');
    syncConstant('TRIANGLES');
    syncConstant('TRIANGLE_STRIP');
    syncConstant('TRIANGLE_FAN');

    /* AlphaFunction (not supported in ES20) */
    /*      NEVER */
    /*      LESS */
    /*      EQUAL */
    /*      LEQUAL */
    /*      GREATER */
    /*      NOTEQUAL */
    /*      GEQUAL */
    /*      ALWAYS */

    /* BlendingFactorDest */
    syncConstant('ZERO');
    syncConstant('ONE');
    syncConstant('SRC_COLOR');
    syncConstant('ONE_MINUS_SRC_COLOR');
    syncConstant('SRC_ALPHA');
    syncConstant('ONE_MINUS_SRC_ALPHA');
    syncConstant('DST_ALPHA');
    syncConstant('ONE_MINUS_DST_ALPHA');

    /* BlendingFactorSrc */
    /*      ZERO */
    /*      ONE */
    syncConstant('DST_COLOR');
    syncConstant('ONE_MINUS_DST_COLOR');
    syncConstant('SRC_ALPHA_SATURATE');
    /*      SRC_ALPHA */
    /*      ONE_MINUS_SRC_ALPHA */
    /*      DST_ALPHA */
    /*      ONE_MINUS_DST_ALPHA */

    /* BlendEquationSeparate */
    syncConstant('FUNC_ADD');
    syncConstant('BLEND_EQUATION');
    syncConstant('BLEND_EQUATION_RGB');   /* same as BLEND_EQUATION */
    syncConstant('BLEND_EQUATION_ALPHA');

    /* BlendSubtract */
    syncConstant('FUNC_SUBTRACT');
    syncConstant('FUNC_REVERSE_SUBTRACT');

    /* Separate Blend Functions */
    syncConstant('BLEND_DST_RGB');
    syncConstant('BLEND_SRC_RGB');
    syncConstant('BLEND_DST_ALPHA');
    syncConstant('BLEND_SRC_ALPHA');
    syncConstant('CONSTANT_COLOR');
    syncConstant('ONE_MINUS_CONSTANT_COLOR');
    syncConstant('CONSTANT_ALPHA');
    syncConstant('ONE_MINUS_CONSTANT_ALPHA');
    syncConstant('BLEND_COLOR');

    /* Buffer Objects */
    syncConstant('ARRAY_BUFFER');
    syncConstant('ELEMENT_ARRAY_BUFFER');
    syncConstant('ARRAY_BUFFER_BINDING');
    syncConstant('ELEMENT_ARRAY_BUFFER_BINDING');

    syncConstant('STREAM_DRAW');
    syncConstant('STATIC_DRAW');
    syncConstant('DYNAMIC_DRAW');

    syncConstant('BUFFER_SIZE');
    syncConstant('BUFFER_USAGE');

    syncConstant('CURRENT_VERTEX_ATTRIB');

    /* CullFaceMode */
    syncConstant('FRONT');
    syncConstant('BACK');
    syncConstant('FRONT_AND_BACK');

    /* DepthFunction */
    /*      NEVER */
    /*      LESS */
    /*      EQUAL */
    /*      LEQUAL */
    /*      GREATER */
    /*      NOTEQUAL */
    /*      GEQUAL */
    /*      ALWAYS */

    /* EnableCap */
    /* TEXTURE_2D */
    syncConstant('CULL_FACE');
    syncConstant('BLEND');
    syncConstant('DITHER');
    syncConstant('STENCIL_TEST');
    syncConstant('DEPTH_TEST');
    syncConstant('SCISSOR_TEST');
    syncConstant('POLYGON_OFFSET_FILL');
    syncConstant('SAMPLE_ALPHA_TO_COVERAGE');
    syncConstant('SAMPLE_COVERAGE');

    /* ErrorCode */
    syncConstant('NO_ERROR');
    syncConstant('INVALID_ENUM');
    syncConstant('INVALID_VALUE');
    syncConstant('INVALID_OPERATION');
    syncConstant('OUT_OF_MEMORY');

    /* FrontFaceDirection */
    syncConstant('CW');
    syncConstant('CCW');

    /* GetPName */
    syncConstant('LINE_WIDTH');
    syncConstant('ALIASED_POINT_SIZE_RANGE');
    syncConstant('ALIASED_LINE_WIDTH_RANGE');
    syncConstant('CULL_FACE_MODE');
    syncConstant('FRONT_FACE');
    syncConstant('DEPTH_RANGE');
    syncConstant('DEPTH_WRITEMASK');
    syncConstant('DEPTH_CLEAR_VALUE');
    syncConstant('DEPTH_FUNC');
    syncConstant('STENCIL_CLEAR_VALUE');
    syncConstant('STENCIL_FUNC');
    syncConstant('STENCIL_FAIL');
    syncConstant('STENCIL_PASS_DEPTH_FAIL');
    syncConstant('STENCIL_PASS_DEPTH_PASS');
    syncConstant('STENCIL_REF');
    syncConstant('STENCIL_VALUE_MASK');
    syncConstant('STENCIL_WRITEMASK');
    syncConstant('STENCIL_BACK_FUNC');
    syncConstant('STENCIL_BACK_FAIL');
    syncConstant('STENCIL_BACK_PASS_DEPTH_FAIL');
    syncConstant('STENCIL_BACK_PASS_DEPTH_PASS');
    syncConstant('STENCIL_BACK_REF');
    syncConstant('STENCIL_BACK_VALUE_MASK');
    syncConstant('STENCIL_BACK_WRITEMASK');
    syncConstant('VIEWPORT');
    syncConstant('SCISSOR_BOX');
    /*      SCISSOR_TEST */
    syncConstant('COLOR_CLEAR_VALUE');
    syncConstant('COLOR_WRITEMASK');
    syncConstant('UNPACK_ALIGNMENT');
    syncConstant('PACK_ALIGNMENT');
    syncConstant('MAX_TEXTURE_SIZE');
    syncConstant('MAX_VIEWPORT_DIMS');
    syncConstant('SUBPIXEL_BITS');
    syncConstant('RED_BITS');
    syncConstant('GREEN_BITS');
    syncConstant('BLUE_BITS');
    syncConstant('ALPHA_BITS');
    syncConstant('DEPTH_BITS');
    syncConstant('STENCIL_BITS');
    syncConstant('POLYGON_OFFSET_UNITS');
    /*      POLYGON_OFFSET_FILL */
    syncConstant('POLYGON_OFFSET_FACTOR');
    syncConstant('TEXTURE_BINDING_2D');
    syncConstant('SAMPLE_BUFFERS');
    syncConstant('SAMPLES');
    syncConstant('SAMPLE_COVERAGE_VALUE');
    syncConstant('SAMPLE_COVERAGE_INVERT');

    /* GetTextureParameter */
    /*      TEXTURE_MAG_FILTER */
    /*      TEXTURE_MIN_FILTER */
    /*      TEXTURE_WRAP_S */
    /*      TEXTURE_WRAP_T */

    syncConstant('COMPRESSED_TEXTURE_FORMATS');

    /* HintMode */
    syncConstant('DONT_CARE');
    syncConstant('FASTEST');
    syncConstant('NICEST');

    /* HintTarget */
    syncConstant('GENERATE_MIPMAP_HINT');

    /* DataType */
    syncConstant('BYTE');
    syncConstant('UNSIGNED_BYTE');
    syncConstant('SHORT');
    syncConstant('UNSIGNED_SHORT');
    syncConstant('INT');
    syncConstant('UNSIGNED_INT');
    syncConstant('FLOAT');

    /* PixelFormat */
    syncConstant('DEPTH_COMPONENT');
    syncConstant('ALPHA');
    syncConstant('RGB');
    syncConstant('RGBA');
    syncConstant('LUMINANCE');
    syncConstant('LUMINANCE_ALPHA');

    /* PixelType */
    /*      UNSIGNED_BYTE */
    syncConstant('UNSIGNED_SHORT_4_4_4_4');
    syncConstant('UNSIGNED_SHORT_5_5_5_1');
    syncConstant('UNSIGNED_SHORT_5_6_5');

    /* Shaders */
    syncConstant('FRAGMENT_SHADER');
    syncConstant('VERTEX_SHADER');
    syncConstant('MAX_VERTEX_ATTRIBS');
    syncConstant('MAX_VERTEX_UNIFORM_VECTORS');
    syncConstant('MAX_VARYING_VECTORS');
    syncConstant('MAX_COMBINED_TEXTURE_IMAGE_UNITS');
    syncConstant('MAX_VERTEX_TEXTURE_IMAGE_UNITS');
    syncConstant('MAX_TEXTURE_IMAGE_UNITS');
    syncConstant('MAX_FRAGMENT_UNIFORM_VECTORS');
    syncConstant('SHADER_TYPE');
    syncConstant('DELETE_STATUS');
    syncConstant('LINK_STATUS');
    syncConstant('VALIDATE_STATUS');
    syncConstant('ATTACHED_SHADERS');
    syncConstant('ACTIVE_UNIFORMS');
    syncConstant('ACTIVE_ATTRIBUTES');
    syncConstant('SHADING_LANGUAGE_VERSION');
    syncConstant('CURRENT_PROGRAM');

    /* StencilFunction */
    syncConstant('NEVER');
    syncConstant('LESS');
    syncConstant('EQUAL');
    syncConstant('LEQUAL');
    syncConstant('GREATER');
    syncConstant('NOTEQUAL');
    syncConstant('GEQUAL');
    syncConstant('ALWAYS');

    /* StencilOp */
    /*      ZERO */
    syncConstant('KEEP');
    syncConstant('REPLACE');
    syncConstant('INCR');
    syncConstant('DECR');
    syncConstant('INVERT');
    syncConstant('INCR_WRAP');
    syncConstant('DECR_WRAP');

    /* StringName */
    syncConstant('VENDOR');
    syncConstant('RENDERER');
    syncConstant('VERSION');

    /* TextureMagFilter */
    syncConstant('NEAREST');
    syncConstant('LINEAR');

    /* TextureMinFilter */
    /*      NEAREST */
    /*      LINEAR */
    syncConstant('NEAREST_MIPMAP_NEAREST');
    syncConstant('LINEAR_MIPMAP_NEAREST');
    syncConstant('NEAREST_MIPMAP_LINEAR');
    syncConstant('LINEAR_MIPMAP_LINEAR');

    /* TextureParameterName */
    syncConstant('TEXTURE_MAG_FILTER');
    syncConstant('TEXTURE_MIN_FILTER');
    syncConstant('TEXTURE_WRAP_S');
    syncConstant('TEXTURE_WRAP_T');

    /* TextureTarget */
    syncConstant('TEXTURE_2D');
    syncConstant('TEXTURE');

    syncConstant('TEXTURE_CUBE_MAP');
    syncConstant('TEXTURE_BINDING_CUBE_MAP');
    syncConstant('TEXTURE_CUBE_MAP_POSITIVE_X');
    syncConstant('TEXTURE_CUBE_MAP_NEGATIVE_X');
    syncConstant('TEXTURE_CUBE_MAP_POSITIVE_Y');
    syncConstant('TEXTURE_CUBE_MAP_NEGATIVE_Y');
    syncConstant('TEXTURE_CUBE_MAP_POSITIVE_Z');
    syncConstant('TEXTURE_CUBE_MAP_NEGATIVE_Z');
    syncConstant('MAX_CUBE_MAP_TEXTURE_SIZE');

    /* TextureUnit */
    syncConstant('TEXTURE0');
    syncConstant('TEXTURE1');
    syncConstant('TEXTURE2');
    syncConstant('TEXTURE3');
    syncConstant('TEXTURE4');
    syncConstant('TEXTURE5');
    syncConstant('TEXTURE6');
    syncConstant('TEXTURE7');
    syncConstant('TEXTURE8');
    syncConstant('TEXTURE9');
    syncConstant('TEXTURE10');
    syncConstant('TEXTURE11');
    syncConstant('TEXTURE12');
    syncConstant('TEXTURE13');
    syncConstant('TEXTURE14');
    syncConstant('TEXTURE15');
    syncConstant('TEXTURE16');
    syncConstant('TEXTURE17');
    syncConstant('TEXTURE18');
    syncConstant('TEXTURE19');
    syncConstant('TEXTURE20');
    syncConstant('TEXTURE21');
    syncConstant('TEXTURE22');
    syncConstant('TEXTURE23');
    syncConstant('TEXTURE24');
    syncConstant('TEXTURE25');
    syncConstant('TEXTURE26');
    syncConstant('TEXTURE27');
    syncConstant('TEXTURE28');
    syncConstant('TEXTURE29');
    syncConstant('TEXTURE30');
    syncConstant('TEXTURE31');
    syncConstant('ACTIVE_TEXTURE');

    /* TextureWrapMode */
    syncConstant('REPEAT');
    syncConstant('CLAMP_TO_EDGE');
    syncConstant('MIRRORED_REPEAT');

    /* Uniform Types */
    syncConstant('FLOAT_VEC2');
    syncConstant('FLOAT_VEC3');
    syncConstant('FLOAT_VEC4');
    syncConstant('INT_VEC2');
    syncConstant('INT_VEC3');
    syncConstant('INT_VEC4');
    syncConstant('BOOL');
    syncConstant('BOOL_VEC2');
    syncConstant('BOOL_VEC3');
    syncConstant('BOOL_VEC4');
    syncConstant('FLOAT_MAT2');
    syncConstant('FLOAT_MAT3');
    syncConstant('FLOAT_MAT4');
    syncConstant('SAMPLER_2D');
    syncConstant('SAMPLER_CUBE');

    /* Vertex Arrays */
    syncConstant('VERTEX_ATTRIB_ARRAY_ENABLED');
    syncConstant('VERTEX_ATTRIB_ARRAY_SIZE');
    syncConstant('VERTEX_ATTRIB_ARRAY_STRIDE');
    syncConstant('VERTEX_ATTRIB_ARRAY_TYPE');
    syncConstant('VERTEX_ATTRIB_ARRAY_NORMALIZED');
    syncConstant('VERTEX_ATTRIB_ARRAY_POINTER');
    syncConstant('VERTEX_ATTRIB_ARRAY_BUFFER_BINDING');

    /* Read Format */
    syncConstant('IMPLEMENTATION_COLOR_READ_TYPE');
    syncConstant('IMPLEMENTATION_COLOR_READ_FORMAT');

    /* Shader Source */
    syncConstant('COMPILE_STATUS');

    /* Shader Precision-Specified Types */
    syncConstant('LOW_FLOAT');
    syncConstant('MEDIUM_FLOAT');
    syncConstant('HIGH_FLOAT');
    syncConstant('LOW_INT');
    syncConstant('MEDIUM_INT');
    syncConstant('HIGH_INT');

    /* Framebuffer Object. */
    syncConstant('FRAMEBUFFER');
    syncConstant('RENDERBUFFER');

    syncConstant('RGBA4');
    syncConstant('RGB5_A1');
    syncConstant('RGB565');
    syncConstant('DEPTH_COMPONENT16');
    syncConstant('STENCIL_INDEX');
    syncConstant('STENCIL_INDEX8');
    syncConstant('DEPTH_STENCIL');

    syncConstant('RENDERBUFFER_WIDTH');
    syncConstant('RENDERBUFFER_HEIGHT');
    syncConstant('RENDERBUFFER_INTERNAL_FORMAT');
    syncConstant('RENDERBUFFER_RED_SIZE');
    syncConstant('RENDERBUFFER_GREEN_SIZE');
    syncConstant('RENDERBUFFER_BLUE_SIZE');
    syncConstant('RENDERBUFFER_ALPHA_SIZE');
    syncConstant('RENDERBUFFER_DEPTH_SIZE');
    syncConstant('RENDERBUFFER_STENCIL_SIZE');

    syncConstant('FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE');
    syncConstant('FRAMEBUFFER_ATTACHMENT_OBJECT_NAME');
    syncConstant('FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL');
    syncConstant('FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE');

    syncConstant('COLOR_ATTACHMENT0');
    syncConstant('DEPTH_ATTACHMENT');
    syncConstant('STENCIL_ATTACHMENT');
    syncConstant('DEPTH_STENCIL_ATTACHMENT');

    syncConstant('NONE');

    syncConstant('FRAMEBUFFER_COMPLETE');
    syncConstant('FRAMEBUFFER_INCOMPLETE_ATTACHMENT');
    syncConstant('FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT');
    syncConstant('FRAMEBUFFER_INCOMPLETE_DIMENSIONS');
    syncConstant('FRAMEBUFFER_UNSUPPORTED');

    syncConstant('FRAMEBUFFER_BINDING');
    syncConstant('RENDERBUFFER_BINDING');
    syncConstant('MAX_RENDERBUFFER_SIZE');

    syncConstant('INVALID_FRAMEBUFFER_OPERATION');

    /* WebGL-specific enums */
    syncConstant('UNPACK_FLIP_Y_WEBGL');
    syncConstant('UNPACK_PREMULTIPLY_ALPHA_WEBGL');
    syncConstant('CONTEXT_LOST_WEBGL');
    syncConstant('UNPACK_COLORSPACE_CONVERSION_WEBGL');
    syncConstant('BROWSER_DEFAULT_WEBGL');        

    function syncConstant(name) {
        //
        if (WebGLRenderingContext[name] === undefined) {
            WebGLRenderingContext[name] = renderingContext[name];
        }
    }

    Object.freeze(WebGLRenderingContext);
};

Object.freeze(WebGLRenderingContextHelper);

//
// Constructor.
//
function Color(r, g, b, a) {
    //
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

//
// Prototype.
//
Color.prototype = {
    //
    // Public methods.
    //
    toArray: function() {
        return [ this.r, this.g, this.b, this.a ];
    }
};

Object.freeze(Color);

// Reference:
// Photoshop CS2 Swatches.

//
// Constructor.
//
function Colors() {
    // No contents.
}

//
// Prototype.
//
Colors.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//

//
// System.
//
Colors.BLACK              = new Color(0, 0, 0, 1);
Colors.WHITE              = new Color(1, 1, 1, 1);
Colors.TRANSPARENT        = new Color(1, 1, 1, 0);
Colors.DEFAULT_BACKGROUND = new Color(32/255, 32/255, 32/255, 1);

//
// Red.
// (PS, There's no PHOTOSHOP_PASTEL_RED (cuz it's ugly), use PINK instead.)
//
Colors.PINK = new Color(255/255, 192/255, 203/255, 1);
Colors.PHOTOSHOP_DARK_RED = new Color(157/255, 10/255, 14/255, 1);

//
// Red orange.
//
Colors.PHOTOSHOP_PASTEL_RED_ORANGE = new Color(255, 173/255, 129/255, 1);
Colors.PHOTOSHOP_DARK_RED_ORANGE = new Color(255, 65/255, 13/255, 1);

//
// Yellow orange.
//
Colors.PHOTOSHOP_PASTEL_YELLOW_ORANGE = new Color(253/255, 198/255, 137/255, 1);
Colors.PHOTOSHOP_DARK_YELLOW_ORANGE = new Color(163/255, 97/255, 9/255, 1);

//
// Yellow.
//
Colors.PHOTOSHOP_PASTEL_YELLOW = new Color(255/255, 247/255, 153/255, 1);
Colors.PHOTOSHOP_DARK_YELLOW = new Color(171/255, 160/255, 0/255, 1);

//
// Green.
//
Colors.PHOTOSHOP_PASTEL_PEA_GREEN = new Color(196/255, 223/255, 155/255, 1);
Colors.PHOTOSHOP_DARK_PEA_GREEN = new Color(89/255, 133/255, 39/255, 1);

//
// Yellow green.
//
Colors.PHOTOSHOP_PASTEL_YELLOW_GREEN = new Color(162/255, 211/255, 156/255, 1);
Colors.PHOTOSHOP_DARK_YELLOW_GREEN = new Color(25/255, 122/255, 48/255, 1);

//
// Green.
//
Colors.PHOTOSHOP_PASTEL_GREEN = new Color(130/255, 202/255, 156/255, 1);
Colors.PHOTOSHOP_DARK_GREEN = new Color(0/255, 114/255, 54/255, 1);

//
// Green cyan.
//
Colors.PHOTOSHOP_PASTEL_GREEN_CYAN = new Color(122/255, 204/255, 200/255, 1);
Colors.PHOTOSHOP_DARK_GREEN_CYAN = new Color(0/255, 115/255, 106/255, 1);

//
// Cyan.
//
Colors.PHOTOSHOP_PASTEL_CYAN = new Color(109/255, 207/255, 246/255, 1);
Colors.PHOTOSHOP_DARK_CYAN = new Color(0/255, 118/255, 163/255, 1);

//
// Cyan blue.
//
Colors.PHOTOSHOP_PASTEL_CYAN_BLUE = new Color(125/255, 167/255, 216/255, 1);
Colors.PHOTOSHOP_DARK_CYAN_BLUE = new Color(0/255, 74/255, 128/255, 1);

//
// Blue.
//
Colors.PHOTOSHOP_PASTEL_BLUE = new Color(131/255, 147/255, 202/255, 1);
Colors.PHOTOSHOP_DARK_BLUE = new Color(0/255, 52/255, 113/255, 1);

//
// Blue violet.
//
Colors.PHOTOSHOP_PASTEL_BLUE_VIOLET = new Color(135/255, 129/255, 189/255, 1);
Colors.PHOTOSHOP_DARK_BLUE_VIOLET = new Color(27/255, 20/255, 100/255, 1);

//
// Violet.
//
Colors.PHOTOSHOP_PASTEL_VIOLET = new Color(161/255, 134/255, 190/255, 1);
Colors.PHOTOSHOP_DARK_VIOLET = new Color(68/255, 14/255, 98/255, 1);

//
// Violet magenta.
//
Colors.PHOTOSHOP_PASTEL_VIOLET_MAGENTA = new Color(188/255, 140/255, 191/255, 1);
Colors.PHOTOSHOP_DARK_VIOLET_MAGENTA = new Color(98/255, 4/255, 96/255, 1);

//
// Magenta.
//
Colors.PHOTOSHOP_PASTEL_MAGENTA = new Color(244/255, 154/255, 193/255, 1);
Colors.PHOTOSHOP_DARK_MAGENTA = new Color(158/255, 0/255, 93/255, 1);

//
// Magenta red.
//
Colors.PHOTOSHOP_PASTEL_MAGENTA_RED = new Color(245/255, 152/255, 157/255, 1);
Colors.PHOTOSHOP_DARK_MAGENTA_RED = new Color(157/255, 0/255, 57/255, 1);

//
// Brown.
//
Colors.PHOTOSHOP_PALE_COOL_BROWN = new Color(199/255, 178/255, 153/255, 1);
Colors.PHOTOSHOP_DARK_COOL_BROWN = new Color(83/255, 71/255, 65/255, 1);
Colors.PHOTOSHOP_PALE_WARM_BROWN = new Color(198/255, 156/255, 109/255, 1);
Colors.PHOTOSHOP_DARK_WARM_BROWN = new Color(117/255, 76/255, 36/255, 1);

Object.freeze(Colors);

//
// Constructor.
//
function GraphicsManager(_xcene) {
    //
    var _renderingContext;
    var _shaderProgram;

    Object.defineProperty(this, 'xcene', {
        'get': function() { return _xcene; }
    });

    setUpWebGLRenderingContext();

    Object.defineProperty(this, 'renderingContext', {
        get: function() { return _renderingContext; }
    });
    
    Object.defineProperty(this, 'shaderProgram', {
        //
        get: function() {
            return _shaderProgram;
        },
        
        set: function(value) {
            //
            if (value === _shaderProgram)
            {
                return;                
            }
            
            _shaderProgram = value;
            _renderingContext.useProgram(_shaderProgram);
        },
    });

    //
    // Private methods.
    //
    function setUpWebGLRenderingContext() {
        //
        // Try to grab the standard context. If it fails, fallback to experi-
        // mental.
        //
        // Note:
        // IE11 only supports 'experimental-webgl'.
        //
        _renderingContext =
            _xcene.mainCanvas.getContext('webgl');

        if (_renderingContext === null) {
            //
            _renderingContext =
                _xcene.mainCanvas.getContext('experimental-webgl');
            
            if (_renderingContext !== null) {
                //
                console.log (
                    'Your browser supports WebGL. \n\n' +
                    'However, it indicates the support is experimental. ' +
                    'That is, not all WebGL functionality may be supported, ' +
                    'and content may not run as expected.'
                );
            }
            else {
                //
                alert (
                    'Unable to initialize WebGL. Your browser may not support it.'
                );

                throw 'WebGL-not-supported exception raised.';
            }
        }

        WebGLRenderingContextHelper.syncConstants(_renderingContext);
        
        // Enable depth testing
        _renderingContext.enable(WebGLRenderingContext.DEPTH_TEST);

        // Near things obscure far things
        _renderingContext.depthFunc(WebGLRenderingContext.LEQUAL);
        
        // Flips the source data along its vertical axis to make WebGL's texture
        // coordinates (S, T) work correctly.
        _renderingContext.pixelStorei (
            WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL,
            true
        );
    }
}

//
// Prototype.
//
GraphicsManager.prototype = {
    //
    // Public methods.
    //
    enableVertexAttribute: function(vertexAttributeLocation) {
        this.renderingContext.enableVertexAttribArray(vertexAttributeLocation);
    },
    
    clear: function(mask, color, depth, s) {
        //
        if (mask === undefined) {
            //
            mask = (
                WebGLRenderingContext.COLOR_BUFFER_BIT |
                WebGLRenderingContext.DEPTH_BUFFER_BIT
            );
        }

        if (color === undefined) {
            color = GraphicsManager.DEFAULT_COLOR_BUFFER_VALUE;
        }
        
        if (depth === undefined) {
            depth = GraphicsManager.DEFAULT_DEPTH_BUFFER_VALUE;
        }
        
        if (s === undefined) {
            s = GraphicsManager.DEFAULT_STENCIL_BUFFER_VALUE;
        }

        this.renderingContext.clearColor(color.r, color.g, color.b, color.a);
        this.renderingContext.clearDepth(depth);
        this.renderingContext.clearStencil(s);

        this.renderingContext.clear(mask);
    },    
    
    //
    // Accessors.
    //
    getAttributeLocation: function(shaderProgram, attributeName) {
        //
        return this.renderingContext.getAttribLocation (
            shaderProgram,
            attributeName
        );
    },
    
    getUniformLocation: function(shaderProgram, uniformName) {
        //
        return this.renderingContext.getUniformLocation (
            shaderProgram,
            uniformName
        );
    },

    setMatrix4x4Uniform: function(uniformLocation, m) {
        //
        this.renderingContext.uniformMatrix4fv (
            uniformLocation,
            false, // which is always false.
            new Float32Array(m.elements)
        );
    },

    setSamplerUniform: function(uniformLocation, s) {
        //
        this.renderingContext.uniform1i (
            uniformLocation,
            s
        );
    }
};

//
// Static constants (after Object.freeze()).
//
GraphicsManager.DEFAULT_COLOR_BUFFER_VALUE   = Colors.DEFAULT_BACKGROUND;
GraphicsManager.DEFAULT_DEPTH_BUFFER_VALUE   = 1;
GraphicsManager.DEFAULT_STENCIL_BUFFER_VALUE = 0;

Object.freeze(GraphicsManager);

//
// Constructor.
//
function ExceptionHelper() {
    // No contents.
}

//
// Prototype.
//
ExceptionHelper.prototype = {
    // No contents.
};

//
// Static methods.
//
ExceptionHelper.displayMessageOf = function(e) {
    //
    // Test:
    /*
    if (typeof(e) === 'string') {
        alert(e);
    } else if (
        e !== undefine &&
        e.message !== undefine
    ){
        alert(e.message);
    }
    */

    alert(e);
};

Object.freeze(ExceptionHelper);

//
// Constructor.
//
function Xcene(_mainCanvas, _usesDefaultStyles) {
    //
    try {
        //
        if (document.body === undefined) {
            throw 'document.body === undefined';
        }

        if (JSHelper.isUndefinedOrNull(_mainCanvas) === true) {
            //
            _mainCanvas = document.createElementNS (
                'http://www.w3.org/1999/xhtml',
                'canvas'
            );

            document.body.appendChild(_mainCanvas);
        }

        if (_usesDefaultStyles === undefined) {
            _usesDefaultStyles = true;
        }
        
        var _graphicsManager;
        var _assetManager;

        Object.defineProperty(this, 'mainCanvas', {
            get: function() { return _mainCanvas; }
        });

        _graphicsManager = new GraphicsManager(this);
        Object.defineProperty(this, 'graphicsManager', {
            get: function() { return _graphicsManager; }
        });

        _assetManager = new AssetManager(this);
        Object.defineProperty(this, 'assetManager', {
            get: function() { return _assetManager; }
        });

        // Sets up the styles (if necessary).
        if (_usesDefaultStyles === true) {
            setUpStyles();
        }

        // Sets up the timers.
        setUpTimers();

        // Hooks the events.        
        hookEvents();

        // Calls onResize() immediately at the end of Xcene's constructor.
        onResize();
        
    } catch (e) {
        //
        console.error('Cybo.Xcene: ' + e);
        
        throw e;
    }

    //
    // Private methods.
    //
    function setUpStyles() {
        //
        // Note:
        // This function is used to replace CSS below...
        //
        // body {
        //     margin: 0;
        //     background-color: #202020; /* = cybo.graphics.colors.DEFAULT_BACKGROUND*/
        // }
        //
        // canvas {
        //     width:   100vw;
        //     height:  100vh;
        //     display: block; /* prevents scrollbar */
        // }

        var style;

        style = document.body.style;
        style.margin = 0;
        style.backgroundColor = '#202020'; // = cybo.graphics.colors.DEFAULT_BACKGROUND

        style = _mainCanvas.style;
        style.width = '100vw';
        style.height = '100vh';
        style.display = 'block';
    }

    function setUpTimers() {
        //
        // Note:
        // Provides requestAnimationFrame in a cross browser way.
        // @author paulirish / http://paulirish.com/

        if (window.requestAnimationFrame === undefined) {

            window.requestAnimationFrame = (function() {
                //
                return (
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (
                        callback, // function FrameRequestCallback
                        element   // DOMElement Element
                    ){
                        window.setTimeout(callback, 1000/60);
                    }
                );
            })();
        }
    }

    function hookEvents() {
        //
        window.addEventListener('resize', onResize);

        // window.addEventListener('error', onError)
        // window.addEventListener('beforeunload', onBeforeUnload);
    }

    //
    // Event handlers.
    //
    function onResize() {
        //
        // Lookup the size the browser is displaying the canvas.
        var displayWidth  = _mainCanvas.clientWidth;
        var displayHeight = _mainCanvas.clientHeight;

        // Check if the canvas is not the same size.
        if (_mainCanvas.width  != displayWidth ||
            _mainCanvas.height != displayHeight) {
            //
            // Make the canvas the same size
            _mainCanvas.width  = displayWidth;
            _mainCanvas.height = displayHeight;
            
            _graphicsManager.renderingContext.viewport (
                // Part 1.
                0, 0,
                // Part 2.
                _mainCanvas.width, _mainCanvas.height
            );
        }
    }

    // function onError(errorMsg, url, lineNumber) {
    //     //
    //     alert (
    //         'Error: ' + errorMsg +
    //         ', Script: ' + url +
    //         ', Line: ' + lineNumber
    //     );
    // }

    // function onBeforeUnload() {
    //     // No contents.
    // }
}

//
// Prototype.
//
Xcene.prototype = {
    //
    // Public methods.
    //
    render: function(update, draw) {
        //
        tick();

        function tick() {
            //
            requestAnimationFrame(tick);

            update();
            draw();
        }
    },
};

Object.freeze(Xcene);

//
// Constructor.
//
function EaseMode() {
    // No contents.
}

//
// Prototype.
//
EaseMode.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
EaseMode.EASE_IN     = 0;
EaseMode.EASE_OUT    = 1;
EaseMode.EASE_IN_OUT = 2;

Object.freeze(EaseMode);

// Note:
// Adapted from
// https://gist.github.com/electricg/4372563

//
// Constructor.
//
function Stopwatch() {
    //
    var _startTime = 0; // Time of last start / resume. (0 if not running)
    var _baseTime = 0; // Time on the clock when last stopped in milliseconds

    //
    // Properties.
    //
    Object.defineProperty(this, 'isRunning', {
        get: function() { return (_startTime !== 0) ? true: false; }
    });

    Object.defineProperty(this, 'elapsedMilliseconds', {
        //
        get: function() {
            //
            return (
                _baseTime +
                (this.isRunning===true) ? now()-_startTime : 0
            ); 
        }
    });

    //
    // Private methods.
    //
    // var now = function() {
    //     return (new Date()).getTime();
    // };        
    function now() {
        return (new Date()).getTime();
    }

    //
    // Privileged methods.
    //
    // Start or resume
    this.start = function() {
        //_startAt = _startAt ? _startAt : now();
        _startTime = (this.isRunning===true) ? _startTime : now();
    };

    // Stop or pause
    this.stop = function() {
        // If running, update elapsed time otherwise keep it
        //_lastDuration = _startAt ? _lastDuration + now() - _startAt : _lastDuration;
        _baseTime = (
            (this.isRunning === true) ?
            _baseTime + (now() - _startTime) :
            _baseTime
        );

        _startTime = 0; // Paused
    };

    // Reset
    this.reset = function() {
        _startTime = 0;
        _baseTime = 0;
    };

    // // Duration
    // this.elapsedMilliseconds = function() {
    //     //
    //     return (
    //         _baseTime +
    //         (this.isRunning===true) ? now()-_startTime : 0
    //     ); 
    // }
}

//
// Prototype.
//
Stopwatch.prototype = {
    // No contents.
};

Object.freeze(Stopwatch);

//
// Constructor.
//
function SineEase(_easeMode, _duration, _isLooped) {
    //
    var _startAngle;
    var _finishAngle;
    var _stopwatch;

    switch (_easeMode)
    {
        case EaseMode.EASE_IN:
        {
            _startAngle  = -MathHelper.PI_OVER_TWO;
            _finishAngle =  0;
            break;
        }

        case EaseMode.EASE_OUT:
        {
            _startAngle  = 0;
            _finishAngle = MathHelper.PI_OVER_TWO;
            break;
        }

        case EaseMode.EASE_IN_OUT:
        {
            _startAngle  = -MathHelper.PI_OVER_TWO;
            _finishAngle =  MathHelper.PI_OVER_TWO;
            break;
        }

        default:
        {
            throw new NotSupportedException();
        }
    }

    // Creates the stopwatch. But don't start it immediately.
    _stopwatch = new Stopwatch();

    //
    // Properties.
    //
    Object.defineProperty(this, 'easeMode', {
        get: function() { return _easeMode; }
    });

    Object.defineProperty(this, 'duration', {
        get: function() { return _duration; }
    });

    Object.defineProperty(this, 'sineOfStartAngle', {
        get: function() { return Math.sin(_startAngle); }
    });

    Object.defineProperty(this, 'sineOfCurrentAngle', {
        //
        get: function() {
            //
            var angleOffset = _finishAngle - _startAngle;

            return Math.sin (
                _startAngle +
                angleOffset * this.ratioOfCurrentToTotalTimeOffset
            );
        }
    });

    Object.defineProperty(this, 'sineOfFinishAngle', {
        get: function() { return Math.sin(_finishAngle); }
    });

    /// <summary>
    /// Ratio of 'current time offset' to 'total time offset (that is, the
    /// duration)'. For instance, the current time offset = 500 (in milli-
    /// seconds), the duration = 2000 (in milliseconds) => Ratio = 500 / 2000
    /// = 0.25
    /// </summary>
    Object.defineProperty(this, 'ratioOfCurrentToTotalTimeOffset', {
        //
        get: function() {
            //
            if (_isLooped === false) {
                //
                if (this.isFinished === true) {
                    return 1;
                } else { // this.isFinished === false
                    return _stopwatch.elapsedMilliseconds / _duration;
                }

            } else { // _isLooped === true
                //
                var elapsedMilliseconds =
                    _stopwatch.elapsedMilliseconds % _duration;

                return elapsedMilliseconds / _duration;
            }
        }
    });

    /// <summary>
    /// Ratio of 'current sine-of-angle offset' to 'total sine-of-angle offset'.
    /// For instance, the current sine-of-angle offset = 0.125, the total sine-
    /// of-angle offset = 1 => Ratio = 0.125 / 1 = 0.125
    /// </summary>
    Object.defineProperty(this, 'ratioOfCurrentToTotalSineOfAngleOffset', {
        //
        get: function() {
            //
            var currentSineOfAngleOffset =
                this.sineOfCurrentAngle - this.sineOfStartAngle;

            var totalSineOfAngleOffset =
                this.sineOfFinishAngle - this.sineOfStartAngle;

            return currentSineOfAngleOffset / totalSineOfAngleOffset;
        }
    });

    Object.defineProperty(this, 'isRunning', {
        get: function() { return _stopwatch.isRunning; }
    });

    Object.defineProperty(this, 'isFinished', {
        //
        get: function() {
            //
            if (_isLooped === true) {
                return false;
            }

            var isFinished = (
                (_duration <= _stopwatch.elapsedMilliseconds) ?
                true :
                false
            );

            if (isFinished === true) {
                _stopwatch.stop();
            }

            return isFinished;
        }
    });

    //
    // Privileged methods.
    //
    this.start = function() {
        //
        if (_stopwatch.isRunning === true) {
            return;
        }

        _stopwatch.start();
    };

    this.pause = function() {
        //
        if (_stopwatch.isRunning === false) {
            return;
        }

        // Note:
        // Stopwatch's stop() is like media player's pause(). After calling
        // Stopwatch's start(), the playing continues.

        _stopwatch.stop();
    };

    this.resume = function() {
        //
        if (_stopwatch.isRunning === true) {
            return;
        }

        _stopwatch.start();
    };

    this.stop = function() {
        //
        // Note:
        // Stopwatch's reset() is like media player's stop(). After calling
        // Stopwatch.reset(), everything resets, and this is what we want for
        // SineEase's stop().

        _stopwatch.reset();
    };
}

//
// Prototype.
//
SineEase.prototype = {
    // No contents.
};

Object.freeze(SineEase);

exports.PositionColor = PositionColor;
exports.PositionOnly = PositionOnly;
exports.PositionTextureCoordinates = PositionTextureCoordinates;
exports.AssetManager = AssetManager;
exports.Camera = Camera;
exports.ShaderHelper = ShaderHelper;
exports.ShaderType = ShaderType;
exports.TextureCoordinateHelper = TextureCoordinateHelper;
exports.WebGLRenderingContextHelper = WebGLRenderingContextHelper;
exports.Color = Color;
exports.Colors = Colors;
exports.GraphicsManager = GraphicsManager;
exports.ExceptionHelper = ExceptionHelper;
exports.JSHelper = JSHelper;
exports.MathHelper = MathHelper;
exports.Vector3D = Vector3D;
exports.Vector4D = Vector4D;
exports.Matrix4x4 = Matrix4x4;
exports.CartesianAxis = CartesianAxis;
exports.Xcene = Xcene;
exports.EaseMode = EaseMode;
exports.SineEase = SineEase;
exports.Stopwatch = Stopwatch;

}((this.Cybo = this.Cybo || {})));
