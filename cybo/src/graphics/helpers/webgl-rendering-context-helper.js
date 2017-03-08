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
}

Object.freeze(WebGLRenderingContextHelper);

export { WebGLRenderingContextHelper };
