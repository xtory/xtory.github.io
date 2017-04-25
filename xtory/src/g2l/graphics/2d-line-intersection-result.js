//
// Constructor.
//
function Line2DIntersectionResult() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
Line2DIntersectionResult.OBJECT_ON_LEFT_SIDE_OF_LINE    = 0;
Line2DIntersectionResult.OBJECT_ON_RIGHT_SIDE_OF_LINE   = 1;
Line2DIntersectionResult.OBJECT_INTERSECTING_OR_ON_LINE = 2;

Object.freeze(Line2DIntersectionResult);

export { Line2DIntersectionResult };
