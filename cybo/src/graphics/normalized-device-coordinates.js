// Note:
// In OpenGL, there is a term called "Normalized Device Coordinates/Space". All
// points in it are:
// -1(left)   < X <= 1(right)
// -1(bottom) < Y <= 1(top)
// -1(near)   < Z <= 1(far)
//
// But in DirectX, there is no specific term for it. So I name it "(DirectX version
// of) normalized device coordinates" as well as "clipping cuboid after projection
// transform and perspective division". points in it are:
// -1(left)   < X <= 1(right)
// -1(bottom) < Y <= 1(top)
//  0(near)   < Z <= 1(far)

//
// Constructor.
//
function NormalizedDeviceCoordinates() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
NormalizedDeviceCoordinates.MIN_X = -1; // Left.
NormalizedDeviceCoordinates.MAX_X =  1; // Right.
NormalizedDeviceCoordinates.MIN_Y = -1; // Bottom.
NormalizedDeviceCoordinates.MAX_Y =  1; // Top.
NormalizedDeviceCoordinates.MIN_Z = -1; // Near.
NormalizedDeviceCoordinates.MAX_Z =  1; // Far.

Object.freeze(NormalizedDeviceCoordinates);

export { NormalizedDeviceCoordinates };
