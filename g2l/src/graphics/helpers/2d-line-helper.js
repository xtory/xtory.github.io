import { Line2DIntersectionResult } from '../2d-line-intersection-result';
import { MathHelper } from '../../math/helpers/math-helper';

//
// Constructor.
//
function Line2DHelper() {
    // No contents.
}

//
// Static methods.
//
/// <summary>
/// Checks if the line (not line segment) intersects the point.
/// </summary>
/// <param name="p1">One of the points on the line as the start position.</param>
/// <param name="p2">One of the points on the line as the finish position.</param>
/// <param name="p">The point to check.</param>
/// <returns>A value indicates the point is on the left, right side of the
/// line, or precisely on the line.</returns>
Line2DHelper.lineIntersectsPoint = function(p1, p2, p) {
    //
//#if DEBUG
    /*
    var v1 = p2 - p1;
    var v2 = p - p1;

    // Note:
    // We can call Vector2D.CalculatePerpendicularDotProductOf() instead
    // to get the same result of calling these two lines of code below.
    />
    // Creates a perpendicular vector of v1 by rotating v1 90 degrees
    // counterclockwise.
    var v3 = Vector2D.createPerpendicularVectorOf(v1); 

    // dot(v3, v2) = |v3||v2|cosOfTheta, where theta is the angle between
    // v3 and v2.
    var s = Vector2D.calculateDotProductOf(v3, v2);

    // Then, because |v3| and |v2| are both positive and can't make cos-
    // OfTheta become negative from positive, or vice versa, we're able
    // to use cosOfTheta to know if theta is less than 90 degrees (when
    // 0 < s), larger than 90 degrees (when s < 0), or equal to 90 degrees
    // (when s = 0). And further, we're able to find if p is on the left
    // , right side of the line, or on the line.
    </

    var s = Vector2D.calculatePerpendicularDotProductOf(v1, v2);
    // :Note
    */

//#else // RELEASE

    var s = (p2.x-p1.x)*(p.y-p1.y) - (p2.y-p1.y)*(p.x-p1.x);

//#endif // DEBUG

    if (MathHelper.EPSILON <= s) { // 0 < s
    //
        return Line2DIntersectionResult.OBJECT_ON_LEFT_SIDE_OF_LINE;

    } else if (
        s <= -MathHelper.EPSILON // s < 0
    ){
        return Line2DIntersectionResult.OBJECT_ON_RIGHT_SIDE_OF_LINE;

    } else { // -MathHelper.EPSILON < s < MathHelper.EPSILON, s == 0
        //
        return Line2DIntersectionResult.OBJECT_INTERSECTING_OR_ON_LINE; 
    }
};

Object.freeze(Line2DHelper);

export { Line2DHelper };
