//
// Constructor.
//
function SpriteFlushingOptions() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
SpriteFlushingOptions.VERTEX_POSITIONS           = 0x00000001;
SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES = 0x00000002;

Object.freeze(SpriteFlushingOptions);

export { SpriteFlushingOptions };
