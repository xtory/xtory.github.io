import { Line2DHelper }             from './2d-line-helper';
import { Line2DIntersectionResult } from '../2d-line-intersection-result';
import { Vector2D }                 from '../../math/2d-vector';

//
// Constructor.
//
function LineSegment2DHelper() {
    // No contents.
}

//
// Static methods.
//
/// <summary>
/// Checks if the line segment intersects the bounds.
/// </summary>
/// <param name="p1">The line segment's start position in world space.</param>
/// <param name="p2">The line segment's finish position in world space.</param>
/// <param name="boundsCenterPosition">The bounds' center position in world space.</param>
/// <param name="boundsSize">The bounds' size in world space.</param>
/// <returns>True if the line segment intersects the rect; false if it
/// doesn't.</returns>
LineSegment2DHelper.lineSegmentIntersectsBounds = function (
    p1,
    p2,
    boundsCenterPosition,
    boundsSize
){
    var halfWidth = boundsSize.width * 0.5;
    var halfHeight = boundsSize.height * 0.5;

    var lowerLeftPosition = ( // in world space.
        //
        Vector2D.addVectors (
            boundsCenterPosition,
            new Vector2D(-halfWidth, -halfHeight)
        )
    );

    var upperLeftPosition = (
        //
        Vector2D.addVectors (
            boundsCenterPosition,
            new Vector2D(-halfWidth,  halfHeight)
        )
    );

    var upperRightPosition = (
        //
        Vector2D.addVectors (
            boundsCenterPosition,
            new Vector2D( halfWidth,  halfHeight)
        )
    );

    var lowerRightPosition = (
        //
        Vector2D.addVectors (
            boundsCenterPosition,
            new Vector2D( halfWidth, -halfHeight)
        )
    );

    // Note:
    // Step 1:
    // Checks if all four corners of the bounds (in world space) are on the same
    // side of this line. If they are, return false.

    var result1 = Line2DHelper.lineIntersectsPoint (
        // Part 1.
        p1, p2,
        // Part 2.
        lowerLeftPosition
    );

    var result2 = Line2DHelper.lineIntersectsPoint (
        // Part 1.
        p1, p2,
        // Part 2.
        upperLeftPosition
    );

    var result3 = Line2DHelper.lineIntersectsPoint (
        // Part 1.
        p1, p2,
        // Part 2.
        upperRightPosition
    );

    var result4 = Line2DHelper.lineIntersectsPoint (
        // Part 1.
        p1, p2,
        // Part 2.
        lowerRightPosition
    );

    // Note:
    // If any one of the results is Intersecting, we assume the intersection
    // possibly occurs and pass the Step 1's checkings.

    if (result1 === Line2DIntersectionResult.OBJECT_ON_LEFT_SIDE_OF_LINE &&
        result1 === result2 &&
        result1 === result3 &&
        result1 === result4) {
        //
        return false;

    } else if (
        result1 === Line2DIntersectionResult.OBJECT_ON_RIGHT_SIDE_OF_LINE &&
        result1 === result2 &&
        result1 === result3 &&
        result1 === result4
    ){
        return false;
    }

    // Note:
    // Step 2:
    // Projects the line's two vertex positions onto the X axis (that is, Y = 0),
    // and checks whether the line's shadow intersects the canvas' shadow. Repeat
    // on the Y axis.

    if (p1.x < upperLeftPosition.x &&
        p2.x < upperLeftPosition.x) {
        return false;
    }

    if (lowerRightPosition.x < p1.x &&
        lowerRightPosition.x < p2.x) {
        return false;
    }

    if (p1.y < lowerRightPosition.y &&
        p2.y < lowerRightPosition.y) {
        return false;
    }

    if (upperLeftPosition.y < p1.y &&
        upperLeftPosition.y < p2.y) {
        return false;
    }

    return true;
};

Object.freeze(LineSegment2DHelper);

export { LineSegment2DHelper };
