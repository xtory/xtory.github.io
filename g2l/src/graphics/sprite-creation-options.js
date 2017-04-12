//
// Constructor.
//
function SpriteCreationOptions() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
SpriteCreationOptions.VERTEX_POSITIONS           = 0x00000001;
SpriteCreationOptions.VERTEX_COLORS              = 0x00000002;
SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES = 0x00000004;

Object.freeze(SpriteCreationOptions);

export { SpriteCreationOptions };
