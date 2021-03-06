this.xtory = this.xtory || {};
(function (exports) {
'use strict';

// Note:
// Scripts could be run in web browsers or others (such as: Node.js). If they're
// not running in web browsers (and hence 'window' doesn't exist), using 'window'
// causes a reference error.

var isRunningInWebBrowser = (
    (typeof(window) !== 'undefined') ?
    true :
    false
);

if (isRunningInWebBrowser === true) {
    //
    // Note:
    // Provides requestAnimationFrame in a cross browser way.
    // @author paulirish / http://paulirish.com/

    if (window.requestAnimationFrame === undefined) {
        //
        window.requestAnimationFrame = (function() {
            //
            return (
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (
                    callback, // function frameRequestCallback
                    element   // DOMElement element
                ){
                    window.setTimeout(callback, 1000/60);
                }
            );
        })();
    }
}

//
// Constructor.
//
function ArrayHelper() {
    // No contents.
}

//
// Static methods.
//
ArrayHelper.contains = function(array, item) {
    //
    for (var i=0; i<array.length; i++) {
        //
        if (array[i] === item) {
            return true;
        }
    }
    
    return false;
};

ArrayHelper.remove = function(array, item) {
    //
    for (var i=0; i<array.length; i++) {
        //
        if (array[i] === item) {
            array.splice(i, 1);
            return true;
        }
    }
    
    return false;
};

// Note:
// [References]
// Array.prototype.sort()

//
// Constructor.
//
function ComparisonResults() {
    // No contents.
}

//
// Static constants.
//
ComparisonResults.ITEM1_PRECEDES_ITEM2   = -1; // One of the integers which are less than 0.
ComparisonResults.ITEMS_IN_SAME_POSITION =  0;
ComparisonResults.ITEM1_FOLLOWS_ITEM2    =  1; // One of the integers which are greater than 0.

// Note:
// [Reference]
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget

// Note:
// In DOM, event 'type' means its 'name', so in this engine, we use event 'name'
// instead 'type'.

//
// Constructor.
//
function EventTargetHelper() {
    // No contents.
}

//
// Static methods.
//
EventTargetHelper.addEventListener = function(target, eventName, eventListener) {
    //
    if (target[EventTargetHelper.EVENT_LISTENER_GROUPS] === undefined) {
        target[EventTargetHelper.EVENT_LISTENER_GROUPS] = {};
    }

    var elGroups = target[EventTargetHelper.EVENT_LISTENER_GROUPS];

    if ((eventName in elGroups) === false) {
        elGroups[eventName] = [];
    }
    
    var elGroup = elGroups[eventName];
    elGroup.push(eventListener);
};

EventTargetHelper.dispatchEvent = function(target, event) {
    //
    if (target[EventTargetHelper.EVENT_LISTENER_GROUPS] === undefined) {
        return;
    }

    var elGroups = target[EventTargetHelper.EVENT_LISTENER_GROUPS];
    if ((event.name in elGroups) === false) {
        return;
    }

    var elGroup = elGroups[event.name];
    event.target = target;

    for (var i=0, l=elGroup.length; i<l; i++) {
        //
        // Note:
        // We use event.target to indicate who fires the event, so here, directly
        // call the callback instead of using call().
        /*
        elGroup[i].call(target, event);
        */
        elGroup[i](event);
        // :Note
    }

    // Test:
    //return !event.isDefaultPrevented;
    // :Test
};

EventTargetHelper.removeEventListener = function(target, eventName, eventListener) {
    //
    if (target[EventTargetHelper.EVENT_LISTENER_GROUPS] === undefined) {
        return;
    }

    var elGroups = target[EventTargetHelper.EVENT_LISTENER_GROUPS];
    if ((eventName in elGroups) === false) {
        return;
    }

    var elGroup = elGroups[eventName];

    for (var i=0, l=elGroup.length; i<l; i++) {
        //
        if (elGroup[i] === eventListener) {
            elGroup.splice(i, 1);
            return;
        }
    }
};

EventTargetHelper.clearEventListeners = function(target) {
    //
    if (target[EventTargetHelper.EVENT_LISTENER_GROUPS] === undefined) {
        return;
    }

    var elGroups = target[EventTargetHelper.EVENT_LISTENER_GROUPS];

    for (var key in elGroups) {
        target[key] = [];
    }

    // Note:
    // We have to set target[...] = {}, not elGroups = {}. Be careful!
    /*
    elGroups = {};
    */
    target[EventTargetHelper.EVENT_LISTENER_GROUPS] = {};
    // :Note
};

//
// Helpers.
//
EventTargetHelper.checkIfHasEventListeners = function(target, eventName) {
    //
    if (target[EventTargetHelper.EVENT_LISTENER_GROUPS] === undefined) {
        return;
    }

    var elGroups = target[EventTargetHelper.EVENT_LISTENER_GROUPS];

    return ((eventName in elGroups) === true) ? true : false;
};

//
// Static constants.
//
EventTargetHelper.EVENT_LISTENER_GROUPS = 'elGroups'; //'eventListenerGroups';

// Note:
// See the note in the beginning of EventTargetHelper constructor function.

//
// Constructor.
//
function Event(_name) {
    this.target = undefined; // which will be assigned in EventTargetHelper.dispatchEvent()
    this.name = _name;
}

//
// Constructor.
//
function ExceptionHelper() {
    // No contents.
}

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

// Note:
// Adapted from
// 'fps.js' by greggman.

function Fps() {
    //
    var _self;
    var _totalTime;
    var _timeTable;
    var _timeTableIndex;
    var _then; // in milliseconds.
    var _average;

    try {
        //
        _self = this;

        // total time spent for last N frames.
        _totalTime = Fps.FRAME_COUNT_TO_AVERAGE;

        // elapsed time for last N frames.
        _timeTable = [];

        // where to record next elapsed time.
        _timeTableIndex = 0;

        _then = 0;

        _average = 0;

        // Initialize the elapsed time history table.
        for (var i=0; i<Fps.FRAME_COUNT_TO_AVERAGE; i++) {
            _timeTable[i] = 1.0;
        }

    } catch (e) {
        //
        console.log('xtory.core.Fps: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'average', {
        get: function() { return _average; }
    });
    
    //
    // Privileged methods.
    //
    this.update = function() {
        //
        var now = (new Date()).getTime(); // in milliseconds.

        var elapsedTime = // in seconds.
            (now - _then) * 0.001;

        _then = now;

        // Keep the total time and total active time for the last N frames.
        _totalTime += elapsedTime - _timeTable[_timeTableIndex];

        // Save off the elapsed time for this frame so we can subtract it later.
        _timeTable[_timeTableIndex] = elapsedTime;

        // Wrap the place to store the next time sample.
        _timeTableIndex++;
        if (_timeTableIndex === Fps.FRAME_COUNT_TO_AVERAGE) {
            _timeTableIndex = 0;
        }

        _average = Math.floor (
            (1.0 / (_totalTime / Fps.FRAME_COUNT_TO_AVERAGE)) + 0.5
        );
    };    
}

//
// Static constants.
//
Fps.FRAME_COUNT_TO_AVERAGE = 16;

//
// Constructor.
//
function IndexHelper() {
    // No contents.
}

IndexHelper.isIndexValid = function(itemCount, index) {
    //
    if (index < 0 ||
        itemCount - 1 < index) {
        //
        return false;

    } else {
        //
        return true;
    }
};

//
// Constructor.
//
function InheritanceHelper() {
    // No contents.
}

InheritanceHelper.inherit = function(subobject, superobject) {
    //
    var helper = function() {
        //
        // No contents.
    };

    helper.prototype = superobject.prototype;
    
    subobject.prototype = new helper();
};

//
// Constructor.
//
function RandomHelper() {
    // No contents.
}

RandomHelper.next = function (
    min, // which is an integer.
    max  // which is an integer.
){
    // Temp: Not tested yet!!!!!
    
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor((max - min) * Math.random()) + min;
};

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
// SlimDX, Fly3D both define this value as 1e-06f and XNA uses 1e-04f, 1e-05f, or
// 1e-06f (in difference places) as epsilons. This engine selects 1e-05f.

// Note:
// SlimDX uses the term ZeroTolerance to represent Epsilon.

// Note:
// In XNA, there is no such term called Epsilon. XNA directly uses 1e-04f, 1e-05f,
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
// Static constants.
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

//
// Angles.
//
MathHelper.toRadians = function(degrees) {
    //
    // Note:
    // 1 radian = (180 / pi) degrees.
    // => 1 degree = (pi / 180) radians.
    // => n degrees = (pi / 180) * n radians.

    if (typeof(degrees) !== 'number') {
        throw 'typeof(degrees) !== \'number\'';
    }

    return MathHelper.PI_OVER_ONE_EIGHTY * degrees;
};

MathHelper.toDegrees = function(radians) {
    //
    // Note:
    // 1 radian = (180 / pi) degrees.
    // => n radians = (180 / pi) * n degrees.

    if (typeof(radians) !== 'number') {
        throw 'typeof(degrees) !== \'number\'';
    }

    return MathHelper.ONE_EIGHTY_OVER_PI * radians;
};

//
// Epsilon.
//
MathHelper.isZero = function(s) {
    //
    if (typeof(s) !== 'number') {
        throw 'typeof(s) !== \'number\'';
    }

    if (s <= -MathHelper.EPSILON ||
        MathHelper.EPSILON <= s) {
        return false;
    } else { // -MathHelper.EPSILON < s < MathHelper.EPSILON
        return true;
    }
};

MathHelper.areEqual = function(s1, s2) {
    //
    if (typeof(s1) !== 'number') {
        throw 'typeof(s1) !== \'number\'';
    }

    if (typeof(s2) !== 'number') {
        throw 'typeof(s2) !== \'number\'';
    }

    var s = s1 - s2;

//#if DEBUG
    /*
    if (MathHelper.IsZero(s) == false) {
        //
        return false;

    } else { // MathHelper.IsZero(s) == true
        //
        return true;
    }
    */

//#else // RELEASE

    if (s <= -MathHelper.EPSILON ||
        MathHelper.EPSILON <= s) {
        //
        return false;

    } else { // -MathHelper.EPSILON < s < MathHelper.EPSILON
        //
        return true;
    }

//#endif // DEBUG
};

MathHelper.isScalar1LessThanScalar2 = function(s1, s2) {
    //
    if (typeof(s1) !== 'number') {
        throw 'typeof(s1) !== \'number\'';
    }

    if (typeof(s2) !== 'number') {
        throw 'typeof(s2) !== \'number\'';
    }

    if (s1 - s2 <= -MathHelper.EPSILON) {
        //
        // which equals to 's1 - s2 < 0',
        // that is, 's1 < s2'

        return true;

    } else {
        //
        // -MathHelper.EPSILON < s1 - s2, which includes
        // A. -MathHelper.EPSILON < s1 - s2 < MathHelper.EPSILON
        // B. MathHelper.EPSILON <= s1 - s2, and
        // A means 's1 - s2 = 0', B means '0 < s1 - s2',
        // so '0 <= s1 - s2', that is, 's2 <= s1'

        return false;
    }
};

MathHelper.isScalar1LessThanOrEqualToScalar2 = function(s1, s2) {
    //
    if (typeof(s1) !== 'number') {
        throw 'typeof(s1) !== \'number\'';
    }

    if (typeof(s2) !== 'number') {
        throw 'typeof(s2) !== \'number\'';
    }

    if (s1 - s2 < MathHelper.EPSILON) {
        //
        // which includes
        // A. s1 - s2 <= -MathHelper.EPSILON, and
        // B. -MathHelper.EPSILON < s1 - s2 < MathHelper.EPSILON
        // A means 's1 - s2 < 0', B means 's1 - s2 = 0',
        // so 's1 - s2 <= 0', that is, 's1 <= s2'

        return true;

    } else {
        //
        // MathHelper.EPSILON <= s1 - s2, which equals to '0 < s1 - s2',
        // that is, 's2 < s1'

        return false;
    }
};

MathHelper.isScalar1GreaterThanScalar2 = function(s1, s2) {
    //
    if (typeof(s1) !== 'number') {
        throw 'typeof(s1) !== \'number\'';
    }

    if (typeof(s2) !== 'number') {
        throw 'typeof(s2) !== \'number\'';
    }

    if (MathHelper.EPSILON <= s1 - s2) {
        //
        // which equals to '0 < s1 - s2',
        // that is, 's2 < s1'

        return true;

    } else {
        //
        // s1 - s2 < MathHelper.EPSILON, which includes
        // A. s1 - s2 <= -MathHelper.EPSILON, and
        // B. -MathHelper.EPSILON < s1 - s2 < MathHelper.EPSILON
        // A means 's1 - s2 < 0', B means 's1 - s2 = 0',
        // so 's1 - s2 <= 0', that is, 's1 <= s2'

        return false;
    }
};

MathHelper.isScalar1GreaterThanOrEqualToScalar2 = function(s1, s2) {
    //
    if (typeof(s1) !== 'number') {
        throw 'typeof(s1) !== \'number\'';
    }

    if (typeof(s2) !== 'number') {
        throw 'typeof(s2) !== \'number\'';
    }
    
    if (-MathHelper.EPSILON < s1 - s2) {
        //
        // which includes
        // A. -MathHelper.EPSILON < s1 - s2 < MathHelper.EPSILON, and
        // B. MathHelper.EPSILON <= s1 - s2
        // A means 's1 - s2 = 0', B means '0 < s1 - s2',
        // so '0 <= s1 - s2', that is, 's2 <= s1'

        return true;

    } else {
        //
        // s1 - s2 <= -MathHelper.EPSILON, which equals to 's1 - s2 < 0',
        // that is, 's1 < s2'

        return false;
    }
};

//
// Textures.
//
MathHelper.isPowerOfTwo = function(s) {
    //
    if (typeof(s) !== 'number') {
        throw 'typeof(s) !== \'number\'';
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

    if (s !== 0 &&
       (s & (s - 1)) === 0) {
        return true;
    } else {
        return false;
    }
};

//
// Constructor.
//
function CartesianAxis() {
    // No contents.
}

//
// Static constants.
//
CartesianAxis.X = 0;
CartesianAxis.Y = 1;
CartesianAxis.Z = 2;

//
// Constructor.
//
// function Matrix4x4 (
//     _s11, _s12, _s13, _s14,
//     _s21, _s22, _s23, _s24,
//     _s31, _s32, _s33, _s34,
//     _s41, _s42, _s43, _s44
// ){
//     // Note:
//     // When storing matrices in memory, there are two ways of storing their
//     // elements:
//     // 1. Stored in the order s11, s12, s13, ..., s43, s44
//     // => called 'row major' (used by DirectX), or
//     // 2. Stored in the order s11, s21, s31, ..., s34, s44
//     // => called 'column major' (used by OpenGL)

//     // Note:
//     // 'm x n' matrix always means 'm rows, n columns' whether it's row or
//     // column major.

//     // this.elements = [
//     //     _s11, _s21, _s31, _s41,
//     //     _s12, _s22, _s32, _s42,
//     //     _s13, _s23, _s33, _s43,
//     //     _s14, _s24, _s34, _s44
//     // ];

//     this.elements = new Float32Array(Matrix4x4.ELEMENT_COUNT);

//     setUpElements();
    
//     //
//     // Private methods.
//     //
//     function setUpElements() {
//         //
//         var a = this.elements;

//         a[0]=_s11;    a[4]=_s12;    a[ 8]=_s13;    a[12] = _s14;
//         a[1]=_s21;    a[5]=_s22;    a[ 9]=_s23;    a[13] = _s24;
//         a[2]=_s31;    a[6]=_s32;    a[10]=_s33;    a[14] = _s34;
//         a[3]=_s41;    a[7]=_s42;    a[11]=_s43;    a[15] = _s44;
//     }
// }

function Matrix4x4 (
    _s11, _s12, _s13, _s14,
    _s21, _s22, _s23, _s24,
    _s31, _s32, _s33, _s34,
    _s41, _s42, _s43, _s44
){
    // Note:
    // When storing matrices in memory, there're two ways of storing their elements:
    // 1. Stored in the order s11, s12, s13, ..., s43, s44
    // => called 'row major' (used by Direct3D), or
    // 2. Stored in the order s11, s21, s31, ..., s34, s44
    // => called 'column major' (used by OpenGL)

    // Note:
    // 'm x n' matrix always means 'm rows, n columns' whether it's row or column
    // major.

    // var _db = [
    //     _s11, _s21, _s31, _s41,
    //     _s12, _s22, _s32, _s42,
    //     _s13, _s23, _s33, _s43,
    //     _s14, _s24, _s34, _s44
    // ];

    this.db = new Float32Array(Matrix4x4.ELEMENT_COUNT);

    this.db[0]=_s11;    this.db[4]=_s12;    this.db[ 8]=_s13;    this.db[12]=_s14;
    this.db[1]=_s21;    this.db[5]=_s22;    this.db[ 9]=_s23;    this.db[13]=_s24;
    this.db[2]=_s31;    this.db[6]=_s32;    this.db[10]=_s33;    this.db[14]=_s34;
    this.db[3]=_s41;    this.db[7]=_s42;    this.db[11]=_s43;    this.db[15]=_s44;
}

Matrix4x4.prototype = {
    //
    clone: function() {
        return Matrix4x4.fromArray(this.elements);
    }
};

Object.defineProperty(Matrix4x4.prototype, 's11', {
    get: function() { return this.db[0]; }
});

Object.defineProperty(Matrix4x4.prototype, 's12', {
    get: function() { return this.db[4]; }
});

Object.defineProperty(Matrix4x4.prototype, 's13', {
    get: function() { return this.db[8]; }
});

Object.defineProperty(Matrix4x4.prototype, 's14', {
    get: function() { return this.db[12]; }
});

Object.defineProperty(Matrix4x4.prototype, 's21', {
    get: function() { return this.db[1]; }
});

Object.defineProperty(Matrix4x4.prototype, 's22', {
    get: function() { return this.db[5]; }
});

Object.defineProperty(Matrix4x4.prototype, 's23', {
    get: function() { return this.db[9]; }
});

Object.defineProperty(Matrix4x4.prototype, 's24', {
    get: function() { return this.db[13]; }
});

Object.defineProperty(Matrix4x4.prototype, 's31', {
    get: function() { return this.db[2]; }
});

Object.defineProperty(Matrix4x4.prototype, 's32', {
    get: function() { return this.db[6]; }
});

Object.defineProperty(Matrix4x4.prototype, 's33', {
    get: function() { return this.db[10]; }
});

Object.defineProperty(Matrix4x4.prototype, 's34', {
    get: function() { return this.db[14]; }
});

Object.defineProperty(Matrix4x4.prototype, 's41', {
    get: function() { return this.db[3]; }
});

Object.defineProperty(Matrix4x4.prototype, 's42', {
    get: function() { return this.db[7]; }
});

Object.defineProperty(Matrix4x4.prototype, 's43', {
    get: function() { return this.db[11]; }
});

Object.defineProperty(Matrix4x4.prototype, 's44', {
    get: function() { return this.db[15]; }
});

//
// Static constants.
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
    cameraFacingDirection, // not cameraTargetPosition, be careful!
    cameraUpDirection
){
    // Note:
    // Formula of Direct3D Matrix.LookAtRH():
    //
    // [ axisX.x                      axisY.x                      axisZ.x                     0
    //   axisX.y                      axisY.y                      axisZ.y                     0
    //   axisX.z                      axisY.z                      axisZ.z                     0
    //  -dot(axisX, cameraPosition)  -dot(axisY, cameraPosition)  -dot(axisZ, cameraPosition)  1 ]
    //
    // where
    // axisZ = normalize(cameraPosition - cameraTargetPosition)
    //       = normalize(-cameraFacingDirection)
    // axisX = normalize(cross(cameraUpVector, axisZ))
    // axisY = cross(axisZ, axisX)
    //

    // Note:
    // In the formula of Direct3D Matrix.LookAtLH():
    //
    // [ ... ]
    //
    // where
    // axisZ = normalize(cameraTargetPosition - cameraPosition)
    //       = normalize(cameraFacingDirection)

    var axisX, axisY, axisZ, v;
    
    v = Vector3D.negateVector(cameraFacingDirection);
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
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    switch (cartesianAxis) {
        //
        case CartesianAxis.X: {
            //
            // Note:
            // In DirectX,
            //
            // return new Matrix4x4 (
            //     1,    0,      0,      0,
            //     0,    cos,    sin,    0,
            //     0,   -sin,    cos,    0,
            //     0,    0,      0,      1
            // );
            //
            // But in OpenGL,
            //
            return new Matrix4x4 (
                1,    0,      0,      0,
                0,    cos,   -sin,    0,
                0,    sin,    cos,    0,
                0,    0,      0,      1
            );            
        }

        case CartesianAxis.Y: {
            //
            // Note:
            // In DirectX,
            //
            // return new Matrix4x4 (
            //     cos,    0,   -sin,    0,
            //     0,      1,    0,      0,
            //     sin,    0,    cos,    0,
            //     0,      0,    0,      1
            // );
            //
            // But in OpenGL,
            //
            return new Matrix4x4 (
                cos,    0,    sin,    0,
                0,      1,    0,      0,
               -sin,    0,    cos,    0,
                0,      0,    0,      1
            );            
        }

        case CartesianAxis.Z: {
            //
            // Note:
            // In DirectX,
            //
            // return new Matrix4x4 (
            //     cos,    sin,    0,    0,
            //    -sin,    cos,    0,    0,
            //     0,      0,      1,    0,
            //     0,      0,      0,    1
            // );
            //
            // But in OpenGL,
            //
            return new Matrix4x4 (
                cos,   -sin,    0,    0,
                sin,    cos,    0,    0,
                0,      0,      1,    0,
                0,      0,      0,    1
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
    var a1 = m1.db;
    var a2 = m2.db;
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

Matrix4x4.areEqual = function(m1, m2) {
    //
    if ((m1 instanceof Matrix4x4) === false ||
        (m2 instanceof Matrix4x4) === false) {
        return false;
    }

    var a1 = m1.db;
    var a2 = m2.db;

    for (var i=0; i<Matrix4x4.ELEMENT_COUNT; i++) {
        //
        if (a1[i] !== a2[i]) {
            return false;
        }
    }

    return true;
};

//
// Constructor.
//
function Quaternion(_x, _y, _z, _w) {
    //
    // The vector part.
    this.x = _x;
    this.y = _y;
    this.z = _z;

    // The scalar part.
    this.w = _w; // which isn't the rotation angle (in radians).
}

Quaternion.prototype = {
    //
    // Public methods.
    //
    toMatrix4x4: function() {
        //
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        var xx = x * x;
        var yy = y * y;
        var zz = z * z;
        var xy = x * y;
        var zw = z * w;
        var zx = z * x;
        var yw = y * w;
        var yz = y * z;
        var xw = x * w;
        
        // Note:
        // In DirectX,
        //
        // m.s11 = 1 - (2 * (yy + zz));
        // m.s12 = 2 * (xy + zw);
        // m.s13 = 2 * (zx - yw);
        // m.s14 = 0;
        //
        // m.s21 = 2 * (xy - zw);
        // m.s22 = 1 - (2 * (zz + xx));
        // m.s23 = 2 * (yz + xw);
        // m.s24 = 0;
        //
        // m.s31 = 2 * (zx + yw);
        // m.s32 = 2 * (yz - xw);
        // m.s33 = 1 - (2 * (yy + xx));
        // m.s34 = 0;
        //
        // m.s41 = 0;
        // m.s42 = 0;
        // m.s43 = 0;
        // m.s44 = 1;

        var a = [
            // Column 1.
            1 - (2 * (yy + zz)), // m.s11
            2 * (xy + zw),       // m.s21
            2 * (zx - yw),       // m.s31
            0,                   // m.s41
            // Column 2.
            2 * (xy - zw),       // m.s12
            1 - (2 * (zz + xx)), // m.s22
            2 * (yz + xw),       // m.s32
            0,                   // m.s42
            // Column 3.
            2 * (zx + yw),       // m.s13
            2 * (yz - xw),       // m.s23
            1 - (2 * (yy + xx)), // m.s33
            0,                   // m.s43
            // Column 4.
            0,                   // n.s14
            0,                   // n.s24
            0,                   // n.s34
            1                    // n.s44
        ];        

        return Matrix4x4.fromArray(a);
    },

    clone: function() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }
};

//
// Static constants.
//
Quaternion.ELEMENT_COUNT = 4;

//
// Static methods.
//
Quaternion.fromAxisAngle = function(axis, angle) {
    //
    axis = Vector3D.calculateUnitVectorOf(axis);
    
    var halfAngle = angle * 0.5;

    var sin = Math.sin(halfAngle);
    var cos = Math.cos(halfAngle);

    return new Quaternion (
        axis.x * sin,
        axis.y * sin,
        axis.z * sin,
        cos
    );
};

Quaternion.fromArray = function(a) {
    return new Quaternion(a[0], a[1], a[2], a[3]);
};

Quaternion.createIdentityQuaternion = function() {
    return new Quaternion(0, 0, 0, 1);
};

Quaternion.calculateUnitQuaternionOf = function(q) {
    //
    var sqrt = Math.sqrt(q.x*q.x + q.y*q.y + q.z*q.z +q.w*q.w);
    if (sqrt < MathHelper.EPSILON) {
        //
        // Note:
        // This engine doesn't throw a divide-by-zero exception when normalizing
        // Vector2D, Vector3D, Vector4D, Quaternion.
        /*
        console.log('A divide-by-zero exception raised.');
        */

        return new Quaternion(0, 0, 0, 0);

    } else {
        //
        var s = 1.0 / sqrt;

        return new Quaternion(q.x*s, q.y*s, q.z*s, q.w*s);
    }
};

Quaternion.areEqual = function(q1, q2) {
    //
    if ((q1 instanceof Quaternion) === false ||
        (q2 instanceof Quaternion) === false) {
        return false;
    }

    if (q1.x !== q2.x ||
        q1.y !== q2.y ||
        q1.z !== q2.z ||
        q1.w !== q2.w) {
        return false;
    } else {
        return true;
    }
};

//
// Constructor.
//
function Vector2D(_x, _y) {
    //
    this.x = _x;
    this.y = _y;
}

Vector2D.prototype = {
    //
    // Public methods.
    //
    toArray: function() {
        return [ this.x, this.y ];
    },

    clone: function() {
        return new Vector2D(this.x, this.y);
    }
};

//
// Static constants.
//
Vector2D.ELEMENT_COUNT = 2;

//
// Static methods.
//
Vector2D.fromArray = function(a) {
    return new Vector2D(a[0], a[1]);
};

Vector2D.calculateUnitVectorOf = function(v) {
    //
    // Note:
    // All XNA, SlimDX, and WPF don't react to the situation when sqrt = 0, such
    // as zero vector's normalization. But finally I decide to code in the way as
    // the book 'Essential Mathematics for Games and Interactive Applications' does.

    var sqrt = Math.sqrt(v.x*v.x + v.y*v.y);

    if (sqrt < MathHelper.EPSILON) {
        //
        // Note:
        // This engine doesn't throw a divide-by-zero exception when normalizing
        // Vector2D, Vector2D, Vector4D, Quaternion.
        /*
        console.log('A divide-by-zero exception raised.');
        */

        return new Vector2D(0, 0);

    } else {
        //
        var s = 1.0 / sqrt;
        return new Vector2D(v.x*s, v.y*s);
    }
};

Vector2D.negateVector = function (v) {
    return new Vector2D(-v.x, -v.y);
};

Vector2D.addVectors = function(v1, v2) {
    return new Vector2D(v1.x+v2.x, v1.y+v2.y);
};

Vector2D.subtractVectors = function(v1, v2) {
    return new Vector2D(v1.x-v2.x, v1.y-v2.y);
};

Vector2D.multiplyVectorByScalar = function(v, s) {
    return new Vector2D(v.x*s, v.y*s);
};

Vector2D.calculateLengthOf = function(v) {
    return Math.sqrt(v.x*v.x + v.y*v.y);
};

Vector2D.calculateLengthSquaredOf = function(v) {
    return v.x*v.x + v.y*v.y;
};

Vector2D.calculateDotProductOf = function(v1, v2) {
    return v1.x*v2.x + v1.y*v2.y;
};

Vector2D.calculatePerpendicularVectorOf = function(v) {
    //
    // Note:
    // There are two vectors perpendicular to any given vector, one rotated
    // 90 degrees counterclockwise and the other rotated 90 degrees clockwise.
    // F. S. Hill, Jr. (1994) defines the perpendicular vector (v2) obtained
    // from an initial vector (v1) by a counterclockwise rotation by 90
    // degrees.
    //
    return new Vector2D(-v.y, v.x);
};

Vector2D.calculatePerpendicularDotProductOf = function(v1, v2) {
    //
    // Optimization:
    /*
    var v3 = // which is v1 rotated 90 degrees counterclockwise.
        Vector2D.calculatePerpendicularVectorOf(v1);

    return Vector2D.calculateDotProductOf(v3, v2);
    */

    return -v1.y*v2.x + v1.x*v2.y;
    // :Optimization
};

Vector2D.areEqual = function(v1, v2) {
    //
    if ((v1 instanceof Vector2D) === false ||
        (v2 instanceof Vector2D) === false) {
        return false;
    }

    if (v1.x !== v2.x ||
        v1.y !== v2.y) {
        //
        return false;

    } else {
        //
        return true;
    }
};

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
    toArray: function() {
        return [ this.x, this.y, this.z, this.w ];
    },

    clone: function() {
        return new Vector4D(this.x, this.y, this.z, this.w);
    }
};

Object.defineProperty(Vector4D.prototype, 'xyz', {
    get: function() { return new Vector3D(this.x, this.y, this.z); }
});

//
// Static constants.
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
    // All XNA, SlimDX, and WPF don't react to the situation when sqrt = 0, such
    // as zero vector's normalization. But finally I decide to code in the way as
    // the book 'Essential Mathematics for Games and Interactive Applications' does.

    var sqrt = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z + v.w*v.w);

    if (sqrt < MathHelper.EPSILON) {
        //
        // Note:
        // This engine doesn't throw a divide-by-zero exception when normalizing
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

Vector4D.multiplyVectorByScalar = function(v, s) {
    return new Vector4D(v.x*s, v.y*s, v.z*s, v.w*s);
};

Vector4D.calculateLengthOf = function(v) {
    return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z + v.w*v.w);
};

Vector4D.calculateLengthSquaredOf = function(v) {
    return v.x*v.x + v.y*v.y + v.z*v.z + v.w*v.w;
};

Vector4D.transform = function(v, m) {
    //
    return new Vector4D (
        m.s11*v.x + m.s12*v.y + m.s13*v.z + m.s14*v.w,
        m.s21*v.x + m.s22*v.y + m.s23*v.z + m.s24*v.w,
        m.s31*v.x + m.s32*v.y + m.s33*v.z + m.s34*v.w,
        m.s41*v.x + m.s42*v.y + m.s43*v.z + m.s44*v.w
    );
};

Vector4D.areEqual = function(v1, v2) {
    //
    if ((v1 instanceof Vector4D) === false ||
        (v2 instanceof Vector4D) === false) {
        return false;
    }

    if (v1.x !== v2.x ||
        v1.y !== v2.y ||
        v1.z !== v2.z ||
        v1.w !== v2.w) {
        //
        return false;

    } else {
        //
        return true;
    }
};

//
// Constructor.
//
function Vector3D(_x, _y, _z) {
    //
    this.x = _x;
    this.y = _y;
    this.z = _z;
}

Vector3D.prototype = {
    //
    // Public methods.
    //
    toArray: function() {
        return [ this.x, this.y, this.z ];
    },

    clone: function() {
        return new Vector3D(this.x, this.y, this.z);
    }
};

Object.defineProperty(Vector3D.prototype, 'xy', {
    get: function() { return new Vector2D(this.x, this.y); }
});

//
// Static constants.
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
    // All XNA, SlimDX, and WPF don't react to the situation when sqrt = 0, such
    // as zero vector's normalization. But finally I decide to code in the way as
    // the book 'Essential Mathematics for Games and Interactive Applications' does.

    var sqrt = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);

    if (sqrt < MathHelper.EPSILON) {
        //
        // Note:
        // This engine doesn't throw a divide-by-zero exception when normalizing
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

Vector3D.multiplyVectorByScalar = function(v, s) {
    return new Vector3D(v.x*s, v.y*s, v.z*s);
};

Vector3D.calculateLengthOf = function(v) {
    return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
};

Vector3D.calculateLengthSquaredOf = function(v) {
    return v.x*v.x + v.y*v.y + v.z*v.z;
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

Vector3D.transformPoint = function(p, m) {
    //
    var v1 = new Vector4D(p.x, p.y, p.z, 1);
    var v2 = Vector4D.transform(v1, m);

    var s = 1 / v2.w;
    return new Vector3D(v2.x*s, v2.y*s, v2.z*s);
};

Vector3D.transformVector = function(v, m) {
    //
    var v2 = new Vector4D(v.x, v.y, v.z, 0);
    var v3 = Vector4D.transform(v2, m);

    return new Vector3D(v3.x, v3.y, v3.z);
};

Vector3D.transform = function(v, q) {
    //
    var x = q.X + q.X;
    var y = q.Y + q.Y;
    var z = q.Z + q.Z;
    var wx = q.W * x;
    var wy = q.W * y;
    var wz = q.W * z;
    var xx = q.X * x;
    var xy = q.X * y;
    var xz = q.X * z;
    var yy = q.Y * y;
    var yz = q.Y * z;
    var zz = q.Z * z;

    var s1 = (1.0 - yy) - zz;
    var s2 = xy - wz;
    var s3 = xz + wy;
    var s4 = xy + wz;
    var s5 = (1.0 - xx) - zz;
    var s6 = yz - wx;
    var s7 = xz - wy;
    var s8 = yz + wx;
    var s9 = (1.0 - xx) - yy;

    return new Vector3D (
        (v.X*s1 + v.Y*s2) + v.Z*s3,
        (v.X*s4 + v.Y*s5) + v.Z*s6,
        (v.X*s7 + v.Y*s8) + v.Z*s9
    );
};

Vector3D.areEqual = function(v1, v2) {
    //
    if ((v1 instanceof Vector3D) === false ||
        (v2 instanceof Vector3D) === false) {
        return false;
    }

    if (v1.x !== v2.x ||
        v1.y !== v2.y ||
        v1.z !== v2.z) {
        //
        return false;

    } else {
        //
        return true;
    }
};

//
// Constructor.
//
function AxisGroup() {
    // No contents.
}

//
// Static constants.
//
AxisGroup.X_AXIS = new Vector3D(1, 0, 0);
AxisGroup.Y_AXIS = new Vector3D(0, 1, 0);
AxisGroup.Z_AXIS = new Vector3D(0, 0, 1);

//
// Constructor.
//
function ViewFrustum() {
    // No contents.
}

//
// Constructor.
//
function Camera (
    _renderer,
    _position,
    _facingDirection,
    _upDirection,
    _distanceToNearPlane,
    _distanceToFarPlane
){
    var _self;
    var _canvas;
    var _viewMatrix;
    var _projectionMatrix;
    var _transform;
    var _viewFrustum;
    var _hasToUpdateViewMatrix;
    var _hasToUpdateProjectionMatrix;
    var _hasToRaiseTransformUpdatedEvent;
    var _lastAspectRatio;
        
    try {
        //
        _self = this;

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

        _canvas = _renderer.canvas;

        _viewFrustum = new ViewFrustum();

        _hasToUpdateViewMatrix = true;
        _hasToUpdateProjectionMatrix = true;
        _hasToRaiseTransformUpdatedEvent = true;
        
    } catch (e) {
        //
        console.log('xtory.core.Camera: ', e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        get: function() { return _renderer; }
    });

    Object.defineProperty(_self, 'position', {
        get: function() { return _position; },
        set: function(value) { _position = value; }
    });

    Object.defineProperty(_self, 'facingDirection', {
        get: function() { return _facingDirection; },
        set: function(value) { _facingDirection = value; }
    });

    Object.defineProperty(_self, 'upDirection', {
        get: function() { return _upDirection; },
        set: function(value) { _upDirection = value; }
    });

    Object.defineProperty(_self, 'distanceToNearPlane', {
        get: function() { return _distanceToNearPlane; },
        set: function(value) { _distanceToNearPlane = value; }
    });

    Object.defineProperty(_self, 'distanceToFarPlane', {
        get: function() { return _distanceToFarPlane; },
        set: function(value) { _distanceToFarPlane = value; }
    });

    Object.defineProperty(_self, 'viewFrustum', {
        get: function() { return _viewFrustum; }
    });

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
        // In Direct3D, we calculate the aspect ratio of 'viewport', not 'back
        // buffer'. But in WebGL, we calculate the aspect ratio of 'canvas' (by
        // its 'clientWidth/clientHeight', not 'width/height') to get better
        // performance.
        // 
        // Reference:
        // https://www.youtube.com/watch?v=rfQ8rKGTVlg
        /*
        var aspectRatio = _renderer.viewport.aspectRatio;
        */
        var aspectRatio = _canvas.clientWidth / _canvas.clientHeight;
        // :Note

        // Note:
        // The values we want to compare are ratios, we can't just compare if
        // they are equal. The results could be different in the debug and release
        // modes and this will cause subtle bugs. Be careful!
        /*
        if (aspectRatio === _lastAspectRatio) {
            return;
        }
        */

        if (_hasToUpdateProjectionMatrix === false &&
            MathHelper.areEqual(aspectRatio, _lastAspectRatio) === true) {
            return;
        }
        // :Note

        _lastAspectRatio = aspectRatio;

        _projectionMatrix = Matrix4x4.createProjectionMatrix (
            Camera.FIELD_OF_VIEW_Y,
            _lastAspectRatio,
            _distanceToNearPlane,
            _distanceToFarPlane
        );

        _hasToRaiseTransformUpdatedEvent = true;
        _hasToUpdateProjectionMatrix = false;
    }

    //
    // Privileged methods.
    //
    // this.zoom = function(distance) {
    //     //
    //     var v = Vector3D.multiplyVectorByScalar (
    //         Vector3D.calculateUnitVectorOf(_facingDirection),
    //         distance
    //     );

    //     _position = Vector3D.addVectors(_position, v);

    //     _hasToUpdateViewMatrix = true;
    // };

    this.invalidateViewMatrix = function() {
        _hasToUpdateViewMatrix = true;
    };

    this.invalidateProjectionMatrix = function() {
        _hasToUpdateProjectionMatrix = true;
    };

    //
    // Accessors
    //
    this.getProjectionMatrix = function(m) {
        //
        checkProjectionMatrix();
        m.db = _projectionMatrix.db.slice();
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

        m.db = _transform.db.slice();

        // Raises the transform-updated event (if necessary).
        if (_hasToRaiseTransformUpdatedEvent === true) {
            //
            // Temp:
            /*
            if (_self.TransformUpdated != null) {
                _self.TransformUpdated(_self, EventArgs.Empty);
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
    //
    // Public methods.
    //
    zoom: function(distance) {
        //
        var v = Vector3D.multiplyVectorByScalar (
            Vector3D.calculateUnitVectorOf(this.facingDirection),
            distance
        );

        this.position = Vector3D.addVectors(this.position, v);

        //_hasToUpdateViewMatrix = true;
        this.invalidateViewMatrix();
    }
};

//
// Static constants.
//
Camera.DEFAULT_FACING_DIRECTION       = Vector3D.negateVector(AxisGroup.Z_AXIS);
Camera.DEFAULT_UP_DIRECTION           = AxisGroup.Y_AXIS;
Camera.FIELD_OF_VIEW_Y                = MathHelper.PI_OVER_FOUR;           // = pi / 4
Camera.MIN_DISTANCE_TO_NEAR_PLANE     = 10;
Camera.MAX_DISTANCE_TO_FAR_PLANE      = 1000000;                           // = 10^6
Camera.DEFAULT_DISTANCE_TO_NEAR_PLANE = Camera.MIN_DISTANCE_TO_NEAR_PLANE; // = 10.
Camera.DEFAULT_DISTANCE_TO_FAR_PLANE  = 100000;                            // = 10^5

//
// Constructor.
//
function CameraState(_camera) {
    //
    var _self;

    try {
        //
        _self = this;
        
    } catch (e) {
        //
        console.log('xtory.core.CameraState: ', e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'camera', {
        get: function() { return _camera; }
    });
}

CameraState.prototype = {
    //
    // Public methods.
    //
    update: function() {
        //
        // No contents.
    }
};

//
// Constructor.
//
function CameraStateStill(_camera) {
    //
    CameraState.call(this, _camera);
}

InheritanceHelper.inherit(CameraStateStill, CameraState);

//
// Constructor.
//
function EaseMode() {
    // No contents.
}

//
// Static constants.
//
EaseMode.EASE_IN     = 0;
EaseMode.EASE_OUT    = 1;
EaseMode.EASE_IN_OUT = 2;

// Note:
// Adapted from
// https://gist.github.com/electricg/4372563

//
// Constructor.
//
function Stopwatch() {
    //
    var _self;
    var _startTime; // Time of last start / resume. (0 if not running)
    var _baseTime;  // Time on the clock when last stopped in milliseconds

    try {
        //
        _self = this;
        _startTime = 0;
        _baseTime = 0;

    } catch (e) {
        //
        console.log('xtory.core.Stopwatch: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'isRunning', {
        get: function() { return (_startTime !== 0) ? true: false; }
    });

    Object.defineProperty(_self, 'elapsedMilliseconds', {
        //
        get: function() {
            //
            return (
                _baseTime +
                (_self.isRunning===true) ? now()-_startTime : 0
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
        _startTime = (_self.isRunning===true) ? _startTime : now();
    };

    // Stop or pause
    this.stop = function() {
        // If running, update elapsed time otherwise keep it
        //_lastDuration = _startAt ? _lastDuration + now() - _startAt : _lastDuration;
        _baseTime = (
            (_self.isRunning === true) ?
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
    //         (_self.isRunning===true) ? now()-_startTime : 0
    //     ); 
    // }
}

//
// Constructor.
//
function SineEase(_easeMode, _duration, _isLooped) {
    //
    var _self;
    var _startAngle;
    var _finishAngle;
    var _stopwatch;

    try {
        //
        _self = this;
        
        switch (_easeMode) {
            //
            case EaseMode.EASE_IN: {
                //
                _startAngle  = -MathHelper.PI_OVER_TWO;
                _finishAngle =  0;
                break;
            }

            case EaseMode.EASE_OUT: {
                //
                _startAngle  = 0;
                _finishAngle = MathHelper.PI_OVER_TWO;
                break;
            }

            case EaseMode.EASE_IN_OUT: {
                //
                _startAngle  = -MathHelper.PI_OVER_TWO;
                _finishAngle =  MathHelper.PI_OVER_TWO;
                break;
            }

            default: {
                throw 'A not-supported exception raised.';
            }
        }

        // Creates the stopwatch. But don't start it immediately.
        _stopwatch = new Stopwatch();

    } catch (e) {
        //
        console.log('xtory.core.SineEase: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'easeMode', {
        get: function() { return _easeMode; }
    });

    Object.defineProperty(_self, 'duration', {
        get: function() { return _duration; }
    });

    Object.defineProperty(_self, 'sineOfStartAngle', {
        get: function() { return Math.sin(_startAngle); }
    });

    Object.defineProperty(_self, 'sineOfCurrentAngle', {
        //
        get: function() {
            //
            var angleOffset = _finishAngle - _startAngle;

            return Math.sin (
                _startAngle +
                angleOffset * _self.ratioOfCurrentToTotalTimeOffset
            );
        }
    });

    Object.defineProperty(_self, 'sineOfFinishAngle', {
        get: function() { return Math.sin(_finishAngle); }
    });

    /// <summary>
    /// Ratio of 'current time offset' to 'total time offset (that is, the
    /// duration)'. For instance, the current time offset = 500 (in milli-
    /// seconds), the duration = 2000 (in milliseconds) => Ratio = 500 / 2000
    /// = 0.25
    /// </summary>
    Object.defineProperty(_self, 'ratioOfCurrentToTotalTimeOffset', {
        //
        get: function() {
            //
            if (_isLooped === false) {
                //
                if (_self.isFinished === true) {
                    //
                    return 1;

                } else { // _self.isFinished === false
                    //
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
    Object.defineProperty(_self, 'ratioOfCurrentToTotalSineOfAngleOffset', {
        //
        get: function() {
            //
            var currentSineOfAngleOffset =
                _self.sineOfCurrentAngle - _self.sineOfStartAngle;

            var totalSineOfAngleOffset =
                _self.sineOfFinishAngle - _self.sineOfStartAngle;

            return currentSineOfAngleOffset / totalSineOfAngleOffset;
        }
    });

    Object.defineProperty(_self, 'isRunning', {
        get: function() { return _stopwatch.isRunning; }
    });

    Object.defineProperty(_self, 'isFinished', {
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
// Constructor.
//
function CameraStateZooming (
    _camera,
    _distance,
    _duration,
    _updatingCallback,
    _finishingCallback
){
    CameraState.call(this, _camera);

    var _self;
    var _sineEase;
    var _zoomedDistance;

    try {
        //
        _self = this;
        _zoomedDistance = 0;

        _sineEase = new SineEase(EaseMode.EASE_OUT, _duration, false);
        _sineEase.start();

    } catch (e) {
        //
        console.log('xtory.core.CameraStateZooming: ', e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'sineEase', {
        get: function() { return _sineEase; }
    });

    Object.defineProperty(_self, 'distance', {
        get: function() { return _distance; }
    });

    Object.defineProperty(_self, 'zoomedDistance', {
        get: function() { return _zoomedDistance; },
        set: function(value) { _zoomedDistance = value; }
    });

    Object.defineProperty(_self, 'updatingCallback', {
        get: function() { return _updatingCallback; }
    });

    Object.defineProperty(_self, 'finishingCallback', {
        get: function() { return _finishingCallback; }
    });
}

InheritanceHelper.inherit(CameraStateZooming, CameraState);

//
// Prototype.
//
CameraStateZooming.prototype.update = function() {
    //
    var sineEase = this.sineEase;

    var isFinished = sineEase.isFinished;
    var ratio = sineEase.ratioOfCurrentToTotalSineOfAngleOffset;

    if (this.updatingCallback !== undefined) {
        this.updatingCallback(sineEase.ratioOfCurrentToTotalTimeOffset);
    }

    var distance = this.distance * ratio;
    this.camera.baseZoom(distance - this.zoomedDistance);

    this.zoomedDistance = distance;

    if (isFinished === true) {
        //
        if (this.finishingCallback !== undefined) {
            this.finishingCallback();
        }

        this.camera.state = new CameraStateStill(this.camera);
    }
};

//
// Constructor.
//
function SmoothCamera (
    _renderer,
    _position,
    _facingDirection,
    _upDirection,
    _distanceToNearPlane,
    _distanceToFarPlane
){
    Camera.call (
        this,
        _renderer,
        _position, _facingDirection, _upDirection,
        _distanceToNearPlane, _distanceToFarPlane
    );

    var _self;
    var _state;
    var _zoomingDuration;
        
    try {
        //
        _self = this;

        _state = new CameraStateStill(_self);

        _zoomingDuration = SmoothCamera.DEFAULT_ZOOM_DURATION;
        
    } catch (e) {
        //
        console.log('xtory.core.SmoothCamera: ', e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'state', {
        //
        get: function() {
            return _state;
        },

        set: function(value) {
            //
            if (value === _state) {
                return;
            }

            // ...

            _state = value;
        }
    });

    Object.defineProperty(_self, 'zoomingDuration', {
       get: function() { return _zoomingDuration; },
       set: function(value) { _zoomingDuration = value; }
    });

    //
    // Privileged methods.
    //
    this.update = function() {
        //
        _state.update();
    };

    this.zoom = function(distance) {
        //
        if ((_state instanceof CameraStateZooming) === true) {
            return;
        }

        _self.state = new CameraStateZooming (
            _self,
            distance,
            _zoomingDuration
        );
    };

    this.baseZoom = function(distance) {
        //
        Camera.prototype.zoom.call(_self, distance);
    };
}

InheritanceHelper.inherit(SmoothCamera, Camera);

//
// Static constants.
//
SmoothCamera.DEFAULT_ZOOM_DURATION = 250; // milliseconds.

//
// Constructor.
//
function CanvasCoordinateHelper() {
    // No contents.
}

//
// Static methods.
//
CanvasCoordinateHelper.fromDisplayToDrawSpace = function(canvas, p) {
    //
    return {
        x: (p.x / canvas.clientWidth) * canvas.width,
        y: (p.y / canvas.clientHeight) * canvas.height
    };
};

CanvasCoordinateHelper.fromDrawToDisplaySpace = function(canvas, p) {
    //
    return {
        x: (p.x / canvas.width) * canvas.clientWidth,
        y: (p.y / canvas.height) * canvas.clientHeight
    };
};

//
// Constructor.
//
function ClearOptions() {
    // No contents.
}

//
// Static constants.
//
ClearOptions.COLOR_BUFFER   = 0x4000; // = gl.COLOR_BUFFER_BIT
ClearOptions.DEPTH_BUFFER   = 0x0100; // = gl.DEPTH_BUFFER_BIT
ClearOptions.STENCIL_BUFFER = 0x0400; // = gl.STENCIL_BUFFER_BIT

// Note:
// OpenGL's color is composed of (r, g, b, a) channels.
// DirectX's color is composed of (a, r, g, b) channels.

//
// Constructor.
//
function Color(_r, _g, _b, _a) {
    //
    if (_a === undefined) {
        _a = 1.0;
    }

    this.r = _r;
    this.g = _g;
    this.b = _b;
    this.a = _a;
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

//
// Static methods.
//
Color.areEqual = function(value1, value2) {
    //
    if ((value1 instanceof Color) === false ||
        (value2 instanceof Color) === false) {
        return false;
    }

    if (value1.r !== value2.r ||
        value1.g !== value2.g ||
        value1.b !== value2.b ||
        value1.a !== value2.a) {
        return false;
    } else {
        return true;
    }
};

// Reference:
// Photoshop CS2 Swatches.

//
// Constructor.
//
function Colors() {
    // No contents.
}

//
// Static constants.
//
Colors.DEFAULT_BACKGROUND = new Color(32/255, 32/255, 32/255, 1);

//
// System.
//
Colors.BLACK       = new Color(0, 0, 0, 1);
Colors.WHITE       = new Color(1, 1, 1, 1);
Colors.TRANSPARENT = new Color(1, 1, 1, 0);

Colors.SKY_BLUE    = new Color(135/255, 206/255, 235/255, 1);
Colors.CADET_BLUE  = new Color( 95/255, 158/255, 160/255, 1);
Colors.PINK        = new Color(255/255, 192/255, 203/255, 1);
//
// Photoshop
//
// Red.
// (PS, There's no PHOTOSHOP_PASTEL_RED (cuz it's ugly), use PINK instead.)
//
//Colors.PHOTOSHOP_PASTEL_RED = new Color(...);
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

//
// OSX
//
Colors.OSX_SOLID_KELP = new Color(89/255, 136/255, 123/255, 1);

// Note:
// Whether in OpenGL or DirectX, depth buffers have values 0 ~ 1, and conventionally,
// 0: near plane, 1: far plane. We can change it (such as: using gl.depthRange()
// or device.Viewport), but don't change it.

//
// Constructor.
//
function DepthBufferValues() {
    // No contents.
}

//
// Static constants.
//
DepthBufferValues.NEAR_CLIP_PLANE = 0.0; // = default zNear of gl.getParameter(gl.DEPTH_RANGE).
DepthBufferValues.FAR_CLIP_PLANE  = 1.0; // = default zFar of gl.getParameter(gl.DEPTH_RANGE).

//
// Static methods.
//
DepthBufferValues.isDepthOutOfRange = function(depth) {
    //
    if (// Part 1.
        MathHelper.isScalar1LessThanScalar2 (
            depth,
            DepthBufferValues.NEAR_CLIP_PLANE // = 0.0
        ) === true ||
        // Part 2.
        MathHelper.isScalar1LessThanScalar2 (
            DepthBufferValues.FAR_CLIP_PLANE, // = 1.0
            depth
        ) === true) {
        //
        return true;

    } else {
        //
        return false;
    }
};

//
// Constructor.
//
function IndexBuffer(_bufferLoader) {
    //
    var _self;
    var _gl;
    var _webGLBuffer;

    try {
        //
        _self = this;
        _gl = _bufferLoader.loader.renderer.gl;

        _webGLBuffer = _gl.createBuffer();

    } catch (e) {
        //
        console.log('xtory.core.IndexBuffer: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'bufferLoader', {
        get: function() { return _bufferLoader; }
    });

    Object.defineProperty(_self, 'webGLBuffer', {
        get: function() { return _webGLBuffer; }
    });
}

IndexBuffer.prototype = {
    //
    // Public methods.
    //
    loadData: function(data) {
        //
        var gl = this.bufferLoader.loader.renderer.gl;

        gl.bindBuffer (
            gl.ELEMENT_ARRAY_BUFFER,
            this.webGLBuffer
        );

        // Note:
        // DirectX supports 16-bit or 32-bit index buffers. But in this engine,
        // so far, only 16-bit index buffer is supported.
        /*
        if (uses16Bits === true) {
            //
            gl.bufferData (
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(data),
                gl.STATIC_DRAW
            );

        } else {
            //
            gl.bufferData (
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint32Array(data),
                gl.STATIC_DRAW
            );
        }
        */

        gl.bufferData (
            gl.ELEMENT_ARRAY_BUFFER,
            data, // which is already a Uint16Array.
            gl.STATIC_DRAW
        );
        // :Note
    }
};

//
// Constructor.
//
function Line2DIntersectionResult() {
    // No contents.
}

//
// Static constants.
//
Line2DIntersectionResult.OBJECT_ON_LEFT_SIDE_OF_LINE    = 0;
Line2DIntersectionResult.OBJECT_ON_RIGHT_SIDE_OF_LINE   = 1;
Line2DIntersectionResult.OBJECT_INTERSECTING_OR_ON_LINE = 2;

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

// Note:
// Sprite.createVertexXxx() returns a Float32Array directly, but LineSegment2D
// doesn't. Instead, LineSegment2D's vertexPositions, vertexColors, indices are
// all arrays cuz later the values in these arrays will be combined to big Float32-
// Arrays or Uint16Array, not now.

//
// Constructor.
//
function LineSegment2D (
    _lineSegmentBatch,
    _screenPosition1,
    _screenPosition2,
    _screenThickness,
    _color,
    _vertexPositions, // which is a [], not a Float32Array.
    _vertexColors     // which is a [], not a Float32Array.
){
    // 1. Vertex positions.
    LineSegment2D.createVertexPositions (
        // Part 1.
        _vertexPositions,
        // Part 2.
        _screenPosition1, _screenPosition2, _screenThickness
    );
    
    // 2. Vertex colors.
    LineSegment2D.createVertexColors(_vertexColors, _color);

    // Note:
    // Let LineSegment2DBatch get indices using LineSegment2D.INDICES directly.
    /*
    // 3. Indices.
    this.indices = LineSegment2D.INDICES;
    */
}

//
// Static constants.
//
LineSegment2D.VERTEX_COUNT  = 4;
LineSegment2D.POSITION_SIZE = 3; // (x, y, z)
LineSegment2D.COLOR_SIZE    = 4; // (r, g, b, a)
LineSegment2D.INDEX_COUNT   = 6; // (0, 1, 2, 2, 1, 3)

LineSegment2D.DEFAULT_SCREEN_POSITION_DEPTH =
    DepthBufferValues.NEAR_CLIP_PLANE;

LineSegment2D.INDICES = [ 0, 1, 2, 2, 1, 3 ];

//
// Static methods.
// 
LineSegment2D.createVertexPositions = function (
    a,
    screenPosition1,
    screenPosition2,
    screenThickness
){
    // Note:
    // See the note in the beginning of this constructor function.

    var p1 = screenPosition1.xy;
    var p2 = screenPosition2.xy;

    // Note:
    // Imagine p1 is on the lower-left side of p2.
    //
    //         p2
    //        /
    //       /
    //      /
    //    p1
    //
    // Then calculate a perpendicular vector, which is the 90 degrees 'counter-
    // clockwise' rotated result of the input vector: (p2 - p1). In this case,
    // v is from lower-right to upper-left.
    //
    var v = Vector2D.calculatePerpendicularVectorOf (
        Vector2D.subtractVectors(p2, p1) // p2 - p1
    );

    v = Vector2D.calculateUnitVectorOf(v);

    var halfScreenThickness = screenThickness * 0.5;

    // Note:
    // Use the imagination above, 4 corners are then found below.

    v = Vector2D.multiplyVectorByScalar(v, halfScreenThickness);

    // Lower right.
    var p3 = Vector2D.subtractVectors(p2, v); // p2 - v

    // Upper rght.
    var p4 = Vector2D.addVectors(p2, v); // p2 + v

    // Lower left.
    var p5 = Vector2D.subtractVectors(p1, v); // p1 - v

    // Upper left.
    var p6 = Vector2D.addVectors(p1, v); // p1 + v

    a[0]=p3.x;    a[ 1]=p3.y;    a[ 2]=screenPosition2.z;
    a[3]=p4.x;    a[ 4]=p4.y;    a[ 5]=screenPosition2.z;
    a[6]=p5.x;    a[ 7]=p5.y;    a[ 8]=screenPosition1.z;
    a[9]=p6.x;    a[10]=p6.y;    a[11]=screenPosition1.z;
};

LineSegment2D.createVertexColors = function(a, color) {
    //
    // Note:
    // See the note in the beginning of this constructor function.
    //
    a[ 0]=color.r;    a[ 1]=color.g;    a[ 2]=color.b;    a[ 3]=color.a;
    a[ 4]=color.r;    a[ 5]=color.g;    a[ 6]=color.b;    a[ 7]=color.a;
    a[ 8]=color.r;    a[ 9]=color.g;    a[10]=color.b;    a[11]=color.a;
    a[12]=color.r;    a[13]=color.g;    a[14]=color.b;    a[15]=color.a;
};

//
// Constructor.
//
function LineSegment2DBatchStyle() {
    //
    this.clearsDbAfterDrawing = true;

    // Note:
    // See the note in the beginning of SpriteBatchStyle.
    /*
    this.areDbFrequentlyChanged = false;
    */
}

//
// Constructor.
//
function PrimitiveType() {
    // No contents.
}

//
// Static constants.
//
PrimitiveType.LINE_LIST      = 1; // = gl.LINES
PrimitiveType.LINE_STRIP     = 3; // = gl.LINE_STRIP
PrimitiveType.TRIANGLE_LIST  = 4; // = gl.TRIANGLES
PrimitiveType.TRIANGLE_STRIP = 5; // = gl.TRIANGLE_STRIP

//
// Constructor.
//
function LineSegment2DBatch(_renderer, _style) {
    //
    var _self;
    var _gl;
    var _db;

    var _vertexBuffers;
    var _indexBuffer;

    // Shaders.
    var _program;
    var _attributeLocations;
    var _uniformLocations;

    // Helpers.
    var _vertexArrays;
    var _indices;
    var _canvasClientSize; // which is a Float32Array.
    var _isBegun;
    var _isOkToAddItem;

    try {
        //
        _self = this;

        if (_style === undefined) {
            _style = new LineSegment2DBatchStyle();
        }

        _gl = _renderer.gl;

        _db = [];

        setUpVertexBuffers();

        setUpIndexBuffers();

        setUpShaders();

        // Helpers.
        _isBegun = false;
        _isOkToAddItem = true;

    } catch (e) {
        //
        console.log('xtory.core.LineSegment2DBatch: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        get: function() { return _renderer; }
    });

    Object.defineProperty(_self, 'isBegun', {
        get: function() { return _isBegun; }
    });

    //
    // Private methods.
    //
    function setUpVertexBuffers() {
        //
        _vertexBuffers = {
            position: _renderer.loader.createVertexBuffer(),
            color: _renderer.loader.createVertexBuffer()
        };

        _vertexArrays = {
            position: [],
            position2: undefined, // which is a Float32Array.
            color: [],
            color2: undefined // which is a Float32Array.
        };
    }

    function setUpIndexBuffers() {
        //
        _indexBuffer = _renderer.loader.createIndexBuffer();

        _indices = undefined;
    }

    function setUpShaders() {
        //
        _program = _renderer.loader.setUpProgram (
            LineSegment2DBatch.VERTEX_SHADER_SOURCE,
            LineSegment2DBatch.FRAGMENT_SHADER_SOURCE
        );

        _attributeLocations = {
            //
            vertexPosition: _renderer.getAttributeLocation (
                _program,
                'vertexPosition'
            ),

            vertexColor: _renderer.getAttributeLocation (
                _program,
                'vertexColor'
            )
        };

        _uniformLocations = {
            //
            shared: {
                //
                canvasClientSize: _renderer.getUniformLocation (
                    _program,
                    'canvasClientSize'
                )
            }
        };

        // Helpers.
        _canvasClientSize = new Float32Array([undefined, undefined]);
    }

    function setUpVertices() {
        //
        // 1. Vertex positions.
        var size = (
            LineSegment2D.POSITION_SIZE * // = 3.
            LineSegment2D.VERTEX_COUNT    // = 4.
        );

        var length = size * _db.length;

        if (_vertexArrays.position2 === undefined ||
            _vertexArrays.position2.length !== length) {
            _vertexArrays.position2 = new Float32Array(length);
        }

        for (var i=0; i<_db.length; i++) {
            //
            var item = _vertexArrays.position[i];

            for (var j=0; j<size; j++) {
                _vertexArrays.position2[size*i + j] = item[j];
            }
        }

        _vertexBuffers.position.loadData (
            _vertexArrays.position2,
            LineSegment2D.POSITION_SIZE
        );

        // 2: Vertex colors.
        size = (
            LineSegment2D.COLOR_SIZE * // = 4.
            LineSegment2D.VERTEX_COUNT // = 4.
        );
        
        length = size * _db.length;

        if (_vertexArrays.color2 === undefined ||
            _vertexArrays.color2.length !== length) {
            _vertexArrays.color2 = new Float32Array(length);
        }
        
        for (var i=0; i<_db.length; i++) {
            //
            var item = _vertexArrays.color[i];

            for (var j=0; j<size; j++) {
                _vertexArrays.color2[size*i + j] = item[j];
            }
        }

        _vertexBuffers.color.loadData (
            _vertexArrays.color2,
            LineSegment2D.COLOR_SIZE
        );
    }

    function setUpIndices() {
        //
        var size = LineSegment2D.INDEX_COUNT; // = 6.
        var length = size * _db.length;

        if (_indices === undefined ||
            _indices.length !== length) {
            _indices = new Uint16Array(length);
        }

        for (var i=0; i<_db.length; i++) {
            //
            var base = LineSegment2D.VERTEX_COUNT * i;

            for (var j=0; j<size; j++) {
                _indices[size*i + j] = base + LineSegment2D.INDICES[j];
            }
        }

        _indexBuffer.loadData(_indices);
    }

    function flush() {
        //
        _renderer.program = _program;

        _renderer.setAttribute (
            _attributeLocations.vertexPosition,
            _vertexBuffers.position
        );

        _renderer.setAttribute (
            _attributeLocations.vertexColor,
            _vertexBuffers.color
        );

        if (_renderer.canvas.clientWidth !== _canvasClientSize[0] ||
            _renderer.canvas.clientHeight !== _canvasClientSize[1]) {
            //
            _canvasClientSize[0] = _renderer.canvas.clientWidth;
            _canvasClientSize[1] = _renderer.canvas.clientHeight;

            _renderer.setVector2DUniform (
                _uniformLocations.shared.canvasClientSize,
                _canvasClientSize
            );
        }

        _renderer.drawIndexedPrimitives (
            _indexBuffer,
            PrimitiveType.TRIANGLE_LIST,
            LineSegment2D.INDEX_COUNT * _db.length
        );
    }

    function clear() {
        //
        _db = [];

        if (_style.clearsDbAfterDrawing === false) {
            _isOkToAddItem = true;
        }
    }    

    //
    // Privileged methods.
    //
    this.begin = function() {
        //
        _isBegun = true;
    };

    this.drawLineSegment = function (
        screenPosition1,
        screenPosition2,
        screenThickness,
        color
    ){
        if (_style.clearsDbAfterDrawing === false &&
            _isOkToAddItem === false) {
            return;
        }

        if (_isBegun === false) {
            throw 'A begin-not-called-before-drawing exception raised.';
        }

        var va1, va2; // vertex arrays.
        var index = _db.length;

        // 1. Vertex arrays.
        if (_vertexArrays.position.length - 1 < index) {
            //
            va1 = [];
            _vertexArrays.position.push(va1);

        } else { // index <=  _vertexArrays.position.length - 1
            //
            va1 = _vertexArrays.position[index];
        }

        // 2. Vertex colors.
        if (_vertexArrays.color.length - 1 < index) {
            //
            va2 = [];
            _vertexArrays.color.push(va2);

        } else { // index <= _vertexArrays.color.length - 1
            //
            va2 = _vertexArrays.color[index];
        }

        var lineSegment = new LineSegment2D (
            // Part 1.
            _self,
            // Part 2.
            screenPosition1, screenPosition2,
            // Part 3.
            screenThickness,
            // Part 4.
            color,
            // Part 5.
            va1, va2
        );

        _db.push(lineSegment);
    };

    this.end = function() {
        //
        if (_isBegun === false) {
            throw 'A begin-not-called-before-drawing exception raised.';
        }

        if (0 < _db.length) {
            //
            if (// Part 1.
                _style.clearsDbAfterDrawing === true || 
                // Part 2.
               (_style.clearsDbAfterDrawing === false &&
                _isOkToAddItem === true)) {
                //
                setUpVertices();

                setUpIndices();
                
                if (_style.clearsDbAfterDrawing === false) {
                    _isOkToAddItem = false;
                }
            }

            // Flushes the deferred items.
            flush();

            if (_style.clearsDbAfterDrawing === true) {
                //
                // Clears the deferred items.
                clear();
            }
        }

        _isBegun = false;
    };
}

//
// Static constants.
//
LineSegment2DBatch.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;' +
    'attribute vec4 vertexColor;' +

    'uniform vec2 canvasClientSize;' +

    'varying vec4 _color;' +

    'void main() {' +
        //
        // Converts the (vertex) position from screen to 'clip' space with w = 1,
        // just like what ScreenCoordinateHelper.toClipSpace() does.
        'gl_Position = vec4 (' +
            '-1.0 + 2.0 * (vertexPosition.xy / canvasClientSize.xy),' +
            'vertexPosition.z,' +
            '1.0' +
        ');' +

        '_color = vertexColor;' +
    '}'
);

LineSegment2DBatch.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'varying vec4 _color;' +

    'void main() {' +
        'gl_FragColor = _color;' +
    '}'
);

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

// Note:
// NDC stands for 'normalized device coordinates'.

// Note:
// Projection transform converts positions from view space to 'clip space'. OpenGL
// and Direct3D have slightly different rules for clip space. In OpenGL, everything
// that is viewable must be within an axis-aligned cube such that the x, y, and
// z components of its clip-space position are <= its corresponding w component.
// This implies that -w <= x <= w, -w <= y <= w, -w <= z <= w. Direct3D has the
// same clipping requirement for x and y, but the z requirement is 0 <= z <= w.

// Note:
// Clip coordinates are in the homogenous form of <x, y, z, w>, but we need to
// compute a 2D position (an x and y pair) along with a depth value. Dividing x,
// y, and z by w (, which is called 'perspective division') accomplishes this.
// The resulting coordinates are called 'normalized device coordinates'. Now all
// the visible geometric data lies in a cube with positions between <-1, -1, -1>
// and <1, 1, 1> in OpenGL, and between <-1, -1, 0> and <1, 1, 1> in Direct3D.

// Note:
// We don't have to do perspective division ourselves, Direct3D/OpenGL do it for
// us automatically in the pipeline. Besides, Direct3D/OpenGL converts positions
// from NDC to screen space by 'viewport transform' automatically in the pipeline
// as well.

// Note:
// For instance, the values we pass to gl_Position are not divided by w yet. OpenGL
// takes care of 'perspective division' for us later in the pipeline.

// Note:
// Direct3D uses viewport transform; OpenGL uses viewport transform plus depth-
// range transform to convert positions from NDC to screen space.

// Note:
// Conventionally, Direct3D and OpenGL's depth buffers both use 0.0 to represent
// positions on the near clip plane; 1.0 to represent positions on the far clip
// plane, as default values.

//
// Constructor.
//
function Ndc() {
    // No contents.
}

//
// Static constants.
//
Ndc.MIN_X = -1; // Left.
Ndc.MAX_X =  1; // Right.
Ndc.MIN_Y = -1; // Bottom.
Ndc.MAX_Y =  1; // Top.
Ndc.MIN_Z = -1; // Near.
Ndc.MAX_Z =  1; // Far.

// Note:
// GDI+'s Rectangle and WPF's Rect are both (left, top, width, height). But cuz
// OpenGL's texture coordinates is from lower-left (0, 0) to upper-right (1, 1),
// this engine uses Rect: (left, bottom, width, height).

//
// Constructor.
//
function Rect(_left, _bottom, _width, _height) {
    //
    this.left   = _left;
    this.bottom = _bottom;
    this.width  = _width;
    this.height = _height;
}

Object.defineProperty(Rect.prototype, 'right', {
    get: function() { return this.left + this.width; }
});

Object.defineProperty(Rect.prototype, 'top', {
    get: function() { return this.bottom + this.height; }
});

Object.defineProperty(Rect.prototype, 'center', {
    //
    get: function() {
        //
        return new Vector2D (
            this.left + this.width * 0.5,
            this.bottom + this.height * 0.5
        );
    }
});

Object.defineProperty(Rect.prototype, 'size', {
    //
    get: function() { return new Vector2D(this.width, this.height); }
});

Rect.areEqual = function(rect1, rect2) {
    //
    if ((rect1 instanceof Rect) === false ||
        (rect2 instanceof Rect) === false) {
        return false;
    }

    if (rect1.left   !== rect2.left ||
        rect1.bottom !== rect2.bottom ||
        rect1.width  !== rect2.width ||
        rect1.height !== rect2.height) {
        //
        return false;

    } else {
        //
        return true;
    }
};

//
// Constructor.
//
function VertexBuffer(_bufferLoader) {
    //
    var _self;
    var _gl;
    var _webGLBuffer;
    var _size; // Number of components per vertex attribute. Must be 1, 2, 3, or 4.

    try {
        //
        _self = this;
        _gl = _bufferLoader.loader.renderer.gl;

        _webGLBuffer = _gl.createBuffer();

    } catch (e) {
        //
        console.log('xtory.core.VertexBuffer: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'bufferLoader', {
        get: function() { return _bufferLoader; }
    });

    Object.defineProperty(_self, 'webGLBuffer', {
        get: function() { return _webGLBuffer; }
    });

    Object.defineProperty(_self, 'size', {
        get: function() { return _size; },
        set: function(value) { _size = value; }
    });
}

VertexBuffer.prototype = {
    //
    // Public methods.
    //
    loadData: function(data, size) {
        //
        var gl = this.bufferLoader.loader.renderer.gl;
        this.size = size;

        gl.bindBuffer (
            gl.ARRAY_BUFFER,
            this.webGLBuffer
        );
        
        gl.bufferData (
            gl.ARRAY_BUFFER,
            data, // which is already a Float32Array.
            gl.STATIC_DRAW
        );
    }
};

//
// Constructor.
//
function BufferLoader(_loader) {
    //
    var _self;
    var _gl;

    try {
        //
        _self = this;
        _gl = _loader.renderer.gl;

    } catch (e) {
        //
        console.log('xtory.core.BufferLoader: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'loader', {
        get: function() { return _loader; }
    });
    
    //
    // Privileged methods.
    //
    this.createVertexBuffer = function() {
        return new VertexBuffer(_self);
    };

    this.createIndexBuffer = function() {
        return new IndexBuffer(_self);
    };
}

//
// Constructor.
//
function Program(_programLoader) {
    //
    var _self;
    var _gl;
    var _webGLProgram;

    try {
        //
        _self = this;
        _gl = _programLoader.loader.renderer.gl;

        _webGLProgram = _gl.createProgram();

    } catch (e) {
        //
        console.log('xtory.core.Program: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'programLoader', {
        get: function() { return _programLoader; }
    });

    Object.defineProperty(_self, 'webGLProgram', {
        get: function() { return _webGLProgram; }
    });
}

//
// Constructor.
//
function ShaderType() {
    // No contents.
}

//
// Static constants.
//
ShaderType.VERTEX_SHADER = 0;
ShaderType.FRAGMENT_SHADER = 1;

//
// Constructor.
//
function ProgramLoader(_loader) {
    //
    var _self;
    var _gl;

    try {
        //
        _self = this;
        _gl = _loader.renderer.gl;

    } catch (e) {
        //
        console.log('xtory.core.ProgramLoader: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'loader', {
        get: function() { return _loader; }
    });

    //
    // Private methods.
    //
    function loadWebGLShader(shaderType, shaderSource) {
        //
        var webGLShader;

        if (shaderType === ShaderType.VERTEX_SHADER) {
            webGLShader = _gl.createShader(_gl.VERTEX_SHADER);
        } else if (
            shaderType === ShaderType.FRAGMENT_SHADER
        ){
            webGLShader = _gl.createShader(_gl.FRAGMENT_SHADER);
        } else {
            return null; // Unknown shader type.
        }        

        // Send the source to the shader object
        _gl.shaderSource(webGLShader, shaderSource);

        // Compile the shader program
        _gl.compileShader(webGLShader);

        // See if it compiled successfully
        if (_gl.getShaderParameter(webGLShader, _gl.COMPILE_STATUS) === false) {
            //
            var log = _gl.getShaderInfoLog(webGLShader);
            _gl.deleteShader(webGLShader);

            throw 'An error occurred compiling the shaders: ' + log;
        }

        return webGLShader;
    }

    function loadWebGLShaderFromHtmlElement(id) {
        //
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

        var webGLShader;

        if (shaderScript.type === 'x-shader/x-vertex') {
            webGLShader = _gl.createShader(_gl.VERTEX_SHADER);
        } else if (
            shaderScript.type === 'x-shader/x-fragment'
        ){
            webGLShader = _gl.createShader(_gl.FRAGMENT_SHADER);
        } else {
            return null; // Unknown shader type.
        }

        // Send the source to the shader object
        _gl.shaderSource(webGLShader, shaderSource);

        // Compile the shader program
        _gl.compileShader(webGLShader);

        // See if it compiled successfully
        if (_gl.getShaderParameter(webGLShader, _gl.COMPILE_STATUS) === false) {
            //
            var log = _gl.getShaderInfoLog(webGLShader);
            _gl.deleteShader(webGLShader);

            throw 'An error occurred compiling the shaders: ' + log;
        }

        return webGLShader;
    }

    function setUpProgram(webGLVertexShader, webGLFragmentShader) {
        //
        var program = new Program(_self);
        var webGLProgram = program.webGLProgram;

        _gl.attachShader(webGLProgram, webGLVertexShader);
        _gl.attachShader(webGLProgram, webGLFragmentShader);

        _gl.linkProgram(webGLProgram);

        if (_gl.getProgramParameter(webGLProgram, _gl.LINK_STATUS) === false) {
            //
            var log = _gl.getProgramInfoLog(webGLProgram);
            _gl.deleteProgram(webGLProgram);

            throw 'Unable to initialize the (shader) program: ' + log;
        }
        
        return program;
    }
    
    //
    // Privileged methods.
    //
    this.setUpProgram = function(vertexShaderSource, fragmentShaderSource) {
        //
        var webGLVertexShader =
            loadWebGLShader(ShaderType.VERTEX_SHADER, vertexShaderSource);

        var webGLFragmentShader =
            loadWebGLShader(ShaderType.FRAGMENT_SHADER, fragmentShaderSource);

        return setUpProgram(webGLVertexShader, webGLFragmentShader);
    };

    this.setUpProgramFromHtmlElements = function(vertexShaderId, fragmentShaderId) {
        //
        var vertexShader =
            loadWebGLShaderFromHtmlElement(ShaderType.VERTEX_SHADER, vertexShaderId);

        var fragmentShader =
            loadWebGLShaderFromHtmlElement(ShaderType.FRAGMENT_SHADER, fragmentShaderId);

        return setUpProgram(vertexShader, fragmentShader);
    };
}

//
// Constructor.
//
function Texture2D(_textureLoader) {
    //
    var _self;
    var _gl;
    var _width;
    var _height;
    var _webGLTexture;

    try {
        //
        _self = this;
        _gl = _textureLoader.loader.renderer.gl;

    } catch (e) {
        //
        console.log('xtory.core.Texture2D: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'loader', {
        get: function() { return _loader; }
    });

    Object.defineProperty(_self, 'width', {
        get: function() { return _width; },
        set: function(value) { _width = value; }
    });

    Object.defineProperty(_self, 'height', {
        get: function() { return _height; },
        set: function(value) { _height = value; }
    });

    Object.defineProperty(_self, 'webGLTexture', {
        get: function() { return _webGLTexture; },
        set: function(value) { _webGLTexture = value; }
    });
}

// Note:
// DB uses
// - key: url (string)
// - value: Texture
//
//
// Constructor.
//
function TextureLoader(_loader) {
    //
    var _self;
    var _gl;
    var _db;

    try {
        //
        _self = this;
        _gl = _loader.renderer.gl;
        _db = {};

    } catch (e) {
        //
        console.log('xtory.core.TextureLoader: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'loader', {
        get: function() { return _loader; }
    });

    //
    // Private methods.
    //
    function createWebGLTexture() {
        return _gl.createTexture();
    }
    
    function handleTexture2DLoaded(image, webGLTexture) {
        //
        _gl.bindTexture (
            _gl.TEXTURE_2D,
            webGLTexture
        );

        _gl.texImage2D (
            _gl.TEXTURE_2D,    // target
            0,                 // level
            _gl.RGBA,          // internalFormat
            _gl.RGBA,          // format
            _gl.UNSIGNED_BYTE, // type
            image              // htmlImageElement
        );

        if (MathHelper.isPowerOfTwo(image.width) === true &&
            MathHelper.isPowerOfTwo(image.height) === true) {
            //
            _gl.generateMipmap(_gl.TEXTURE_2D);
            
            _gl.texParameteri (
                _gl.TEXTURE_2D,
                _gl.TEXTURE_MIN_FILTER,
                _gl.LINEAR_MIPMAP_LINEAR
            );

        } else {
            //
            _gl.texParameteri (
                _gl.TEXTURE_2D,
                _gl.TEXTURE_MIN_FILTER,
                _gl.LINEAR
            );
        }

        // TEXTURE_MAG_FILTER only has NEAREST or LINEAR to choose, no LINEAR_
        // MIPMAP_LINEAR.
        _gl.texParameteri (
            _gl.TEXTURE_2D,
            _gl.TEXTURE_MAG_FILTER,
            _gl.LINEAR
        );

        _gl.texParameteri (
            _gl.TEXTURE_2D,
            _gl.TEXTURE_WRAP_S,
            _gl.CLAMP_TO_EDGE
        );

        _gl.texParameteri (
            _gl.TEXTURE_2D,
            _gl.TEXTURE_WRAP_T,
            _gl.CLAMP_TO_EDGE
        );

        _gl.bindTexture(_gl.TEXTURE_2D, null);
    }

    //
    // Privileged methods.
    //
    this.loadTexture2D = function(url) {
        //
        if (url === undefined) {
            throw 'An argument-undefined exception raised.';
        }

        var texture = _db[url];
        if (texture !== undefined) {
            return texture;
        }

        var texture = new Texture2D(_self);
        _db[url] = texture;

        var image = new Image();

        image.addEventListener('load', function() {
            //
            try {
                //
                var webGLTexture = createWebGLTexture();

                handleTexture2DLoaded(image, webGLTexture);

                texture.width = image.width;
                texture.height = image.height;
                texture.webGLTexture = webGLTexture;

            } catch (e) {
                //
                console.log('xtory.core.TextureLoader.loadTexture2D(): ' + e);

                throw e;
            }
        });

        image.addEventListener('error', function() {
            //
            console.log (
                'xtory.core.TextureLoader.loadTexture2D() could not load image: ' +
                url
            );
        });

        image.src = url;

        return texture;
    };
}

//
// Constructor.
//
function Loader(_renderer) {
    //
    var _self;
    var _gl;
    var _bufferLoader;
    var _textureLoader;
    var _programLoader;

    try {
        //
        _self = this;
        
        bindRenderer();

        _bufferLoader = new BufferLoader(_self);
        _textureLoader = new TextureLoader(_self);
        _programLoader = new ProgramLoader(_self);

    } catch (e) {
        //
        console.log('xtory.core.Loader: ' + e);

        throw e;
    }

    //
    // Private methods.
    //
    function bindRenderer() {
        //
        _gl = _renderer.gl;

        Object.defineProperty(_self, 'renderer', {
            get: function() { return _renderer; }
        });
    }
    
    //
    // Privileged methods.
    //
    this.createVertexBuffer = function() {
        return _bufferLoader.createVertexBuffer();
    };

    this.createIndexBuffer = function() {
        return _bufferLoader.createIndexBuffer();
    };

    this.setUpProgram = function(vertexShaderSource, fragmentShaderSource) {
        //
        return _programLoader.setUpProgram(vertexShaderSource, fragmentShaderSource);
    };

    this.setUpProgramFromHtmlElements = function(vertexShaderId, fragmentShaderId) {
        //
        return _programLoader.setUpProgram(vertexShaderId, fragmentShaderId);
    };

    this.loadTexture2D = function(url) {
        //
        return _textureLoader.loadTexture2D(url);
    };
}

//
// Constructor.
//
function RendererStyle() {
    //
    this.canvasUsesDefaultStyle = true;
}

// Note:
// This engine doesn't handle window's resize event anymore. See the article...
// https://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html

// Note:
// See viewport.js to understand the relationship between viewport and canvas.

//
// Constructor.
//
function Renderer(_canvas, _style) {
    //
    var _self;
    var _gl;
    var _loader;
    var _program;
    var _clearColor;
    var _clearDepth;
    var _clearStencil;

    try {
        //
        _self = this;

        setUpCanvas();

        if (_style === undefined) {
            _style = new RendererStyle();
        }        

        setUpStyle();

        setUpWebGLContext();

    } catch (e) {
        //
        console.log('xtory.core.Renderer: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'canvas', {
        get: function() { return _canvas; }
    });
    
    Object.defineProperty(_self, 'gl', {
        get: function() { return _gl; }
    });

    // Note:
    // This engine uses a constant viewport. To get viewport size for displaying
    // (nor for drawing), use canvas.clientWidth and clientHeight instead. If we
    // want to change x, y of the viewport, use gl to change it manually. This
    // engine doesn't handle it for us.
    /*
    Object.defineProperty(_self, 'viewport', {
        //
        get: function() {
            //
            var value = _gl.getParameter(_gl.VIEWPORT);

            var p1 = new Vector2D(value[0], value[1]);
            var p2 = new Vector2D(value[2], value[3]);
            var p3 = CanvasCoordinateHelper.fromDrawToDisplaySpace(_canvas, p1);
            var p4 = CanvasCoordinateHelper.fromDrawToDisplaySpace(_canvas, p2);

            return new Viewport(p3.x, p3.y, p4.x, p4.y);
        },

        set: function(value) {
            //
            var p1 = new Vector2D(value[0], value[1]);
            var p2 = new Vector2D(value[2], value[3]);
            var p3 = CanvasCoordinateHelper.fromDisplayToDrawSpace(_canvas, p1);
            var p4 = CanvasCoordinateHelper.fromDisplayToDrawSpace(_canvas, p2);

            _gl.viewport(p3.x, p3.y, p4.x, p4.y);
        }
    });
    */
    
    Object.defineProperty(_self, 'loader', {
        //
        get: function() {
            //
            if (_loader === undefined) {
                _loader = new Loader(_self);
            }

            return _loader;
        }
    });

    Object.defineProperty(_self, 'program', {
        //
        get: function() {
            return _program;
        },
        
        set: function(value) {
            //
            if (value === _program)
            {
                return;                
            }
            
            _program = value;
            _gl.useProgram(_program.webGLProgram);
        },
    });

    //
    // Private methods.
    //
    function setUpCanvas() {
        //
        if (_canvas !== undefined) {
            return;
        }

        if (document.body === undefined) {
            throw 'document.body === undefined';
        }

        _canvas = document.createElementNS (
            'http://www.w3.org/1999/xhtml',
            'canvas'
        );

        _canvas.width = Renderer.CANVAS_WIDTH;
        _canvas.height = Renderer.CANVAS_HEIGHT;
    }

    function setUpStyle() {
        //
        // Note:
        // This function is used to replace CSS below...
        //
        // canvas {
        //     width:   100%;
        //     height:  100%;
        //     display: block; /* prevents scrollbar */
        // }
        //
        if (_style.canvasUsesDefaultStyle === false) {
            return;
        }

        var style = _canvas.style;
        style.width = '100%';
        style.height = '100%';
        style.display = 'block';
    }    

    function setUpWebGLContext() {
        //
        // Try to grab the standard context. If it fails, fallback to experimental.
        //
        // Note:
        // IE11 only supports 'experimental-webgl'.
        //
        _gl = _canvas.getContext('webgl');
        if (_gl === null) {
            //
            _gl = _canvas.getContext('experimental-webgl');
            if (_gl !== null) {
                //
                console.log (
                    'Your browser supports WebGL. \n\n' +
                    'However, it indicates the support is experimental. ' +
                    'That is, not all WebGL functionality may be supported, ' +
                    'and content may not run as expected.'
                );

            } else {
                //
                alert (
                    'Unable to initialize WebGL. Your browser may not support it.'
                );

                throw 'A WebGL-not-supported exception raised.';
            }
        }

        // See notes in DepthBufferValues.js
        _gl.depthRange (
            DepthBufferValues.NEAR_CLIP_PLANE, // = 0.0
            DepthBufferValues.FAR_CLIP_PLANE   // = 1.0
        );

        _clearColor = Renderer.DEFAULT_CLEAR_COLOR;
        _clearDepth = Renderer.DEFAULT_CLEAR_DEPTH;
        _clearStencil = Renderer.DEFAULT_CLEAR_STENCIL;

        _gl.clearColor (
            // Part 1.
            _clearColor.r, _clearColor.g, _clearColor.b,
            // Part 2.
            _clearColor.a
        );

        _gl.clearDepth(_clearDepth);
        _gl.clearStencil(_clearStencil);
        
        // Sets up the states.
        setUpStates();
        
        // Flips the source data along its vertical axis to make WebGL's texture
        // coordinates (S, T) work correctly.
        _gl.pixelStorei (
            _gl.UNPACK_FLIP_Y_WEBGL,
            true
        );
    }

    function setUpStates() {
        //
        setUpAlphaBlendState();

        setUpDepthStencilState();

        setUpSamplerState();

        setUpRasterizerState();
    }

    function setUpAlphaBlendState() {
        //
        _gl.disable(_gl.BLEND); // default: disable.
    }

    function setUpDepthStencilState() {
        //
        // Depth.
        _gl.enable(_gl.DEPTH_TEST); // default: disable.
        _gl.depthFunc(_gl.LEQUAL); // default: LESS.

        // Stencil.
        _gl.disable(_gl.STENCIL_TEST); // default: disable.
    }

    function setUpSamplerState() {
        //
        // Note:
        // The way of setting WebGL's sampler states is different from Direct3D.
    }

    function setUpRasterizerState() {
        //
        _gl.enable(_gl.CULL_FACE); // default: disable.
        _gl.cullFace(_gl.BACK); // default: BACK.
    }

    //
    // Privileged methods.
    //
    this.run = function(updateScene, drawScene) {
        //
        render();

        function render() {
            //
            requestAnimationFrame(render);

            if (updateScene !== undefined) {
                updateScene();
            }

            if (drawScene !== undefined) {
                drawScene();
            }
        }
    };

    this.clear = function(clearOptions, color, depth, stencil) {
        //
        if (color !== undefined &&
            Color.areEqual(color, _clearColor) === false) {
            //
            _clearColor = color;
            
            _gl.clearColor (
                // Part 1.
                _clearColor.r, _clearColor.g, _clearColor.b,
                // Part 2.
                _clearColor.a
            );
        }
        
        if (depth !== undefined &&
            depth !== _clearDepth) {
            _clearDepth = depth;
            _gl.clearDepth(_clearDepth);
        }

        if (stencil !== undefined &&
            stencil !== _clearStencil) {
            _clearStencil = stencil;
            _gl.clearStencil(_clearStencil);
        }

        // Note:
        // There's no _clearOptions.
        if (clearOptions === undefined) {
            clearOptions = Renderer.DEFAULT_CLEAR_OPTIONS;
        }

        _gl.clear(clearOptions);
    };

    this.drawPrimitives = function (
        primitiveType,
        start, // Index of start vertex.
        count
    ){
        _gl.drawArrays(primitiveType, start, count);
    };
    
    this.drawIndexedPrimitives = function (
        indexBuffer,
        primitiveType, count, offset
    ){
        if (offset === undefined) {
            offset = 0;
        }

        _gl.bindBuffer (
            _gl.ELEMENT_ARRAY_BUFFER,
            indexBuffer.webGLBuffer
        );
        
        _gl.drawElements (
            primitiveType,
            count,
            _gl.UNSIGNED_SHORT,
            offset
        );
    };
    
    //
    // Accessors.
    //
    this.getAttributeLocation = function(program, attributeName) {
        //
        return _gl.getAttribLocation(program.webGLProgram, attributeName);
    };
    
    this.getUniformLocation = function(program, uniformName) {
        //
        return _gl.getUniformLocation(program.webGLProgram, uniformName);
    };

    this.setAttribute = function(attributeLocation, buffer) {
        //
        // Binds the buffer before calling gl.vertexAttribPointer().
        _gl.bindBuffer (
            _gl.ARRAY_BUFFER,
            buffer.webGLBuffer
        );

        _gl.vertexAttribPointer (
            attributeLocation,
            buffer.size,
            _gl.FLOAT,
            false,
            0,
            0
        );

        // Turns the 'generic' vertex attribute array on at a given index position.
        // That is, this vertex attribute location (an 'index') doesn't belong to
        // any specific shader program.
        _gl.enableVertexAttribArray (
            attributeLocation
        );
    };

    this.setSampler = function(samplerUniformLocation, texture, unit) {
        //
        if (unit === undefined) {
            unit = Renderer.DEFAULT_TEXTURE_UNIT;
        }

        // Note:
        // gl.TEXTUREX are numbers,
        // gl.TEXTURE0 = 33984,
        // gl.TEXTURE1 = 33985,
        // ...

        _gl.activeTexture(_gl.TEXTURE0 + unit);
        _gl.bindTexture(_gl.TEXTURE_2D, texture.webGLTexture);

        _gl.uniform1i(samplerUniformLocation, unit);
    };

    this.setVector2DUniform = function(uniformLocation, value) {
        //
        _gl.uniform2fv (
            uniformLocation,
            value // which is a Float32Array.
        );
    };

    this.setVector3DUniform = function(uniformLocation, value) {
        //
        _gl.uniform3fv (
            uniformLocation,
            value // which is a Float32Array.
        );
    };

    this.setVector4DUniform = function(uniformLocation, value) {
        //
        _gl.uniform4fv (
            uniformLocation,
            value // which is a Float32Array.
        );
    };

    this.setMatrix4x4Uniform = function(uniformLocation, value) {
        //
        _gl.uniformMatrix4fv (
            uniformLocation,
            false, // which is always false.
            value  // which is a Float32Array.
        );
    };    
}

//
// Static constants.
//
Renderer.CANVAS_WIDTH = 1024;
Renderer.CANVAS_HEIGHT = 1024;

Renderer.DEFAULT_CLEAR_OPTIONS =
    ClearOptions.COLOR_BUFFER | ClearOptions.DEPTH_BUFFER;

Renderer.DEFAULT_CLEAR_COLOR   = Colors.DEFAULT_BACKGROUND;
Renderer.DEFAULT_CLEAR_DEPTH   = 1;
Renderer.DEFAULT_CLEAR_STENCIL = 0;
Renderer.DEFAULT_TEXTURE_UNIT  = 0;

// Note:
// NDC stands for 'normalized device coordinates'.

//
// Constructor.
//
function ScreenCoordinateHelper() {
    // No contents.
}

//
// Static methods.
//
ScreenCoordinateHelper.toClipSpace = function(canvas, p) {
    //
    // Note:
    // Because the input is already a 'screen position', that is, we don't have
    // to worry about the w component (which is related to 'perspective division').
    // The formula below converts the screen position directly to clip space.

    // Note:
    // Besides, OpenGL has no half-pixel offset problem like Direct3D 9, don't
    // have to handle it.

    // Note:
    // This engine uses a constant viewport. To get viewport size for displaying
    // (nor for drawing), use canvas.clientWidth and clientHeight instead.
    /*
    return new Vector3D (
        // Part 1.
        Ndc.MIN_X +
        ((p.x - 0.5) / viewport.width) *
        (Ndc.MAX_X - Ndc.MIN_X),
        // Part 2.
        Ndc.MIN_Y +
        ((p.y - 0.5) / viewport.height) *
        (Ndc.MAX_Y - Ndc.MIN_Y),
        // Part 3.
        p.z,
        // Part 4.
        1.0
    );
    */

    return new Vector4D (
        // Part 1.
        Ndc.MIN_X + // = -1
        (p.x / canvas.clientWidth) *
        (Ndc.MAX_X - Ndc.MIN_X), // = 2
        // Part 2.
        Ndc.MIN_Y + // = -1
        (p.y / canvas.clientHeight) *
        (Ndc.MAX_Y - Ndc.MIN_Y), // = 2
        // Part 3.
        Ndc.MIN_Z + // = -1
        p.z *
        (Ndc.MAX_Z - Ndc.MIN_Z), // = 2
        // Part 4.
        1.0 // w.
    );
    // :Note
};

//
// Constructor.
//
function Size2D(_width, _height) {
    //
    this.width = _width;
    this.height = _height;
}

//
// Static methods.
//
Size2D.addSizes = function(size1, size2) {
    return new Size2D(size1.width+size2.width, size1.height+size2.height);
};

Size2D.subtractSizes = function(size1, size2) {
    return new Size2D(size1.width-size2.width, size1.height-size2.height);
};

Size2D.multiplySizeByScalar = function(size, s) {
    return new Size2D(size.width*s, size.height*s);
};

Size2D.areEqual = function(size1, size2) {
    //
    if ((size1 instanceof Size2D) === false ||
        (size2 instanceof Size2D) === false) {
        return false;
    }

    if (size1.width !== size2.width ||
        size1.height !== size2.height) {
        //
        return false;

    } else {
        //
        return true;
    }
};

//
// Constructor.
//
function Size3D(_width, _height, _depth) {
    //
    this.width  = _width;
    this.height = _height;
    this.depth  = _depth;
}

//
// Constructor.
//
function SpriteFlushingOptions() {
    // No contents.
}

//
// Static constants.
//
SpriteFlushingOptions.VERTEX_POSITIONS           = 0x0001;
SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES = 0x0002;

//
// Constructor.
//
function Sprite (
    _spriteBatch,
    _texture,
    _centerScreenPosition,
    _screenSize,
    _sourceRect, // source texture coordinate rect.
    _color,
    _vertexPositions,         // which is a Float32Array.
    _vertexTextureCoordinates // which is a Float32Array.
){
    this.texture = _texture;

    // 1. Vertex positions.
    Sprite.createVertexPositions (
        // Part 1.
        _vertexPositions,
        // Part 2.
        _centerScreenPosition, _screenSize
    );

    // 2. Vertex texture coordinates.
    if (_sourceRect === undefined ||
        Rect.areEqual(_sourceRect, Sprite.DEFAULT_SOURCE_RECT) === true) {
        //
        this.flushingOptions = SpriteFlushingOptions.VERTEX_POSITIONS;

    } else {
        //
        this.flushingOptions = (
            SpriteFlushingOptions.VERTEX_POSITIONS |
            SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES
        );

        Sprite.createVertexTextureCoordinates (
            _vertexTextureCoordinates,
            _sourceRect
        );
    }

    // 3. color.
    if (_color === undefined) {
        //
        this.color = Sprite.DEFAULT_COLOR;

    } else {
        //
        this.color = new Float32Array(_color.toArray());
    }
}

//
// Static constants.
//
Sprite.VERTEX_COUNT            = 4;
Sprite.POSITION_SIZE           = 3; // (x, y, z)
Sprite.COLOR_SIZE              = 4; // (r, g, b, a)
Sprite.TEXTURE_COORDINATE_SIZE = 2; // (s, t)

Sprite.DEFAULT_SCREEN_POSITION_DEPTH =
    DepthBufferValues.NEAR_CLIP_PLANE;

Sprite.DEFAULT_COLOR = new Float32Array (
    Colors.WHITE.toArray()
);

Sprite.DEFAULT_SOURCE_RECT = new Rect(0, 0, 1, 1);

Sprite.DEFAULT_VERTEX_TEXTURE_COORDINATES = new Float32Array ([
    1.0, 0.0, // lower-right.
    1.0, 1.0, // upper-right.
    0.0, 0.0, // lower-left.
    0.0, 1.0  // upper-left.
]);

//
// Static methods.
// 
Sprite.createVertexPositions = function(a, p, size) {
    //
    var halfWidth = size.width * 0.5;
    var halfHeight = size.height * 0.5;

    a[0]=p.x+halfWidth;    a[ 1]=p.y-halfHeight;    a[ 2]=p.z;
    a[3]=p.x+halfWidth;    a[ 4]=p.y+halfHeight;    a[ 5]=p.z;
    a[6]=p.x-halfWidth;    a[ 7]=p.y-halfHeight;    a[ 8]=p.z;
    a[9]=p.x-halfWidth;    a[10]=p.y+halfHeight;    a[11]=p.z;
};

Sprite.createVertexTextureCoordinates = function(a, rect) {
    //
    a[0]=rect.right;    a[1]=rect.bottom; // lower-right.
    a[2]=rect.right;    a[3]=rect.top;    // upper-right.
    a[4]=rect.left;     a[5]=rect.bottom; // lower-left.
    a[6]=rect.left;     a[7]=rect.top;    // upper-left.
};

// Note:
// WebGL only uses vertex/index buffers (no arrays, for drawing), so this engine
// provides no areDbFrequentlyChanged option, which is provided in SpriteBatch of
// our Direct3D-version engine.

//
// Constructor.
//
function SpriteBatchStyle() {
    //
    this.clearsDbAfterDrawing = true;

    // Note:
    // See the note above.
    /*
    this.areDbFrequentlyChanged = true;
    */
}

// Note:
// SpriteBatch only supports vertex buffers, no index buffers.

// Note:
// LineSegment2D/3D do support vertex/index buffers.

// Note:
// Sees the notes in the beginning of SpriteBatchStyle.

//
// Constructor.
//
function SpriteBatch(_renderer, _style) {
    //
    var _self;
    var _gl;
    var _db;
    
    var _vertexBuffers;
    var _defaultTextureCoordinateVertexBuffer;
    var _vertexArrays;

    // Shaders.
    var _program;
    var _attributeLocations;
    var _uniformLocations;

    // Helpers
    var _canvasClientSize; // which is a Float32Array.
    var _isBegun;
    var _isOkToAddItem;

    try {
        //
        _self = this;

        if (_style === undefined) {
            _style = new SpriteBatchStyle();
        }

        _gl = _renderer.gl;

        _db = [];

        setUpVertexBuffers();

        setUpShaders();

        // Helpers.
        _isBegun = false;
        _isOkToAddItem = true;

    } catch (e) {
        //
        console.log('xtory.core.SpriteBatch: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        get: function() { return _renderer; }
    });

    Object.defineProperty(_self, 'isBegun', {
        get: function() { return _isBegun; }
    });

    //
    // Private methods.
    //
    function setUpVertexBuffers() {
        //
        _vertexBuffers = {
            position: [],
            textureCoordinates: []
        };

        _defaultTextureCoordinateVertexBuffer =
            _renderer.loader.createVertexBuffer();

        // Test:
        _vertexArrays = {
            position: [],
            textureCoordinates: []
        };
        // :Test

        _defaultTextureCoordinateVertexBuffer.loadData (
            Sprite.DEFAULT_VERTEX_TEXTURE_COORDINATES,
            Sprite.TEXTURE_COORDINATE_SIZE
        );
    }

    function setUpShaders() {
        //
        _program = _renderer.loader.setUpProgram (
            SpriteBatch.VERTEX_SHADER_SOURCE,
            SpriteBatch.FRAGMENT_SHADER_SOURCE
        );

        _attributeLocations = {
            //
            vertexPosition: _renderer.getAttributeLocation (
                _program,
                'vertexPosition'
            ),

            vertexTextureCoordinates: _renderer.getAttributeLocation (
                _program,
                'vertexTextureCoordinates'
            )
        };

        _uniformLocations = {
            //
            shared: {
                //
                canvasClientSize: _renderer.getUniformLocation (
                    _program,
                    'canvasClientSize'
                )
            },

            unique: {
                //
                color: _renderer.getUniformLocation (
                    _program,
                    'color'
                ),

                sampler: _renderer.getUniformLocation (
                    _program,
                    'sampler'
                )
            }
        };

        // Helpers.
        _canvasClientSize = new Float32Array([undefined, undefined]);
    }
    
    function flush() {
        //
        _renderer.program = _program;

        if (_renderer.canvas.clientWidth !== _canvasClientSize[0] ||
            _renderer.canvas.clientHeight !== _canvasClientSize[1]) {
            //
            _canvasClientSize[0] = _renderer.canvas.clientWidth;
            _canvasClientSize[1] = _renderer.canvas.clientHeight;

            _renderer.setVector2DUniform (
                _uniformLocations.shared.canvasClientSize,
                _canvasClientSize
            );
        }

        var vb = null;
        var lastColor; // which is a Float32Array.
        var lastOfIfUsesDefault; // if texture coordinates uses default.
        var lastTexture;
        
        for (var i=0; i<_db.length; i++) {
            //
            var item = _db[i];

            vb = _vertexBuffers.position[i];

            _renderer.setAttribute (
                _attributeLocations.vertexPosition,
                vb
            );

            var usesDefault = (
                ((item.flushingOptions & SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES) ===
                SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES) ?
                false :
                true
            );

            if (usesDefault === false) {
                //
                vb = _vertexBuffers.textureCoordinates[i];

            } else {
                //
                vb = _defaultTextureCoordinateVertexBuffer;
            }

            if (// Part 1.
                lastColor === undefined ||
                // Part 2.
               (item.color[0] != lastColor[0] ||
                item.color[1] != lastColor[1] ||
                item.color[2] != lastColor[2] ||
                item.color[3] != lastColor[3])) {
                //
                _renderer.setVector4DUniform (
                    // Part 1.
                    _uniformLocations.unique.color,
                    // Part 2.
                    item.color
                );

                lastColor = item.color;
            }
            
            if (usesDefault !== lastOfIfUsesDefault) {
                //
                _renderer.setAttribute (
                    _attributeLocations.vertexTextureCoordinates,
                    vb
                );

                lastOfIfUsesDefault = usesDefault;
            }

            if (lastTexture !== item.texture) {
                //
                _renderer.setSampler (
                    _uniformLocations.unique.sampler,
                    item.texture
                );

                lastTexture = item.texture;
            }

            _renderer.drawPrimitives (
                PrimitiveType.TRIANGLE_STRIP,
                0,
                4
            );
        }
    }    

    function clear() {
        //
        _db = [];

        if (_style.clearsDbAfterDrawing === false) {
            _isOkToAddItem = true;
        }
    }

    //
    // Privileged methods.
    //
    this.begin = function() {
        //
        _isBegun = true;

        if (_vertexArrays.position.length != _vertexBuffers.position.length ||
            _vertexArrays.textureCoordinates.length != _vertexBuffers.textureCoordinates.length) {
            //
            throw 'An invalid-length exception raised.';
        }
    };

    this.drawSprite = function (
        texture,
        flushingOptions,
        centerScreenPosition,
        screenSize,
        sourceRect,
        color
    ){
        if (_style.clearsDbAfterDrawing === false &&
            _isOkToAddItem === false) {
            return;
        }

        if (_isBegun === false) {
            throw 'A begin-not-called-before-drawing exception raised.';
        }

        if (DepthBufferValues.isDepthOutOfRange(centerScreenPosition.z) === true) {
            return;
        }

        var va1, va2; // vertex arrays.
        var vb1, vb2; // vertex buffers.
        var index = _db.length;

        // 1. Vertex arrays.
        if (_vertexArrays.position.length - 1 < index) {
            //
            va1 = new Float32Array(Sprite.POSITION_SIZE * Sprite.VERTEX_COUNT);
            _vertexArrays.position.push(va1);

            vb1 = _renderer.loader.createVertexBuffer();
            _vertexBuffers.position.push(vb1);

        } else { // index <=  _vertexArrays.position.length - 1
            //
            va1 = _vertexArrays.position[index];
            vb1 = _vertexBuffers.position[index];
        }

        // 2. Vertex texture coordinates.
        if (_vertexArrays.textureCoordinates.length - 1 < index) {
            //
            va2 = new Float32Array(Sprite.TEXTURE_COORDINATE_SIZE * Sprite.VERTEX_COUNT);
            _vertexArrays.textureCoordinates.push(va2);

            vb2 = _renderer.loader.createVertexBuffer();
            _vertexBuffers.textureCoordinates.push(vb2);

        } else { // index <= _vertexArrays.textureCoordinates.length - 1
            //
            va2 = _vertexArrays.textureCoordinates[index];
            vb2 = _vertexBuffers.textureCoordinates[index];
        }

        var sprite = new Sprite (
            // Part 1.
            _self,
            // Part 2.
            texture,
            // Part 3.
            centerScreenPosition, screenSize,
            // Part 4.
            sourceRect,
            // Part 5.
            color,
            // Part 6.
            va1, va2
        );

        // 1. Vertex positions.
        vb1.loadData(va1, Sprite.POSITION_SIZE);

        // 2. Vertex texture coordinates.
        if ((sprite.flushingOptions & SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES) ===
            SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES) {
            //
            vb2.loadData(va2, Sprite.TEXTURE_COORDINATE_SIZE);
        }

        _db.push(sprite);
    };

    this.end = function() {
        //
        if (_isBegun === false) {
            throw 'A begin-not-called-before-drawing exception raised.';
        }

        if (0 < _db.length) {
            //
            if (// Part 1.
                _style.clearsDbAfterDrawing === true || 
                // Part 2.
               (_style.clearsDbAfterDrawing === false &&
                _isOkToAddItem === true)) {
                //
                if (_style.clearsDbAfterDrawing === false) {
                    _isOkToAddItem = false;
                }
            }

            // Flushes the deferred items.
            flush();

            if (_style.clearsDbAfterDrawing === true) {
                //
                // Clears the deferred items.
                clear();
            }
        }

        _isBegun = false;
    };
}

//
// Static constants.
//
SpriteBatch.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;' +
    'attribute vec2 vertexTextureCoordinates;' +

    'uniform vec2 canvasClientSize;' +

    'varying vec2 _textureCoordinates;' +

    'void main() {' +
        //
        // Converts the (vertex) position from screen to 'clip' space with w = 1,
        // just like what ScreenCoordinateHelper.toClipSpace() does.
        'gl_Position = vec4 (' +
            '-1.0 + 2.0 * (vertexPosition.xy / canvasClientSize.xy),' +
            'vertexPosition.z,' +
            '1.0' +
        ');' +

        '_textureCoordinates = vertexTextureCoordinates;' +
    '}'
);

SpriteBatch.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'uniform vec4 color;' +
    'uniform sampler2D sampler;' +

    'varying vec2 _textureCoordinates;' +

    'void main() {' +
        'gl_FragColor = color * texture2D(sampler, _textureCoordinates);' +
    '}'
);

// Note:
// Texture Coordinates.
//
// DirectX: (U, V)      OpenGL: (S, T)           
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

//
// Constructor.
//
function World2DLayerName() {
    // No contents.
}

//
// Static constants.
//
World2DLayerName.BACKGROUND                                                   =  0;
World2DLayerName.RESERVED_ITEMS_BETWEEN_BACKGROUND_AND_FARTHEST_LINE_SEGMENTS =  1;
World2DLayerName.LINE_SEGMENTS_BELOW_FAR_IMAGES                               =  2;
World2DLayerName.FAR_IMAGES                                                   =  3;
World2DLayerName.LINE_SEGMENTS_BELOW_MIDDLE_IMAGES                            =  4;
World2DLayerName.MIDDLE_IMAGES                                                =  5;
World2DLayerName.LINE_SEGMENTS_ABOVE_MIDDLE_IMAGES                            =  6;
World2DLayerName.NEAR_IMAGES                                                  =  7;
World2DLayerName.LINE_SEGMENTS_ABOVE_NEAR_IMAGES                              =  8;
World2DLayerName.RESERVED_ITEMS_BETWEEN_NEAREST_LINE_SEGMENTS_AND_TEXT        =  9;
World2DLayerName.TEXT                                                         = 10;
World2DLayerName.RESERVED_ITEMS_BETWEEN_TEXT_AND_UI                           = 11;
World2DLayerName.UI                                                           = 12;
World2DLayerName.NEAREST_RESERVED_ITEMS                                       = 13;

//
// Helpers.
//
World2DLayerName.FARTHEST_ITEMS = World2DLayerName.BACKGROUND;
World2DLayerName.NEAREST_ITEMS  = World2DLayerName.NEAREST_RESERVED_ITEMS;

//
// Constructor.
//
function World2DState(_world) {
    //
    var _self;
    
    try {
        //
        _self = this;

    } catch (e) {
        //
        console.log('xtory.core.World2DState: ', e);

        throw e;
    }
    
    //
    // Properties.
    //
    Object.defineProperty(_self, 'world', {
        get: function() { return _world; }
    });
}

World2DState.prototype = {
    //
    // Public methods.
    //
    update: function() {
        //
        // No contents.
    }
};

//
// Constructor.
//
function World2DStateNormal(_world) {
    //
    World2DState.call(this, _world);
}

InheritanceHelper.inherit(World2DStateNormal, World2DState);

//
// Constructor.
//
function World2DStateZoomingAtScreenPosition (
    _world,
    _screenPosition,
    _newSize,  // in world space.
    _duration, // in milliseconds.
    _updatingCallback,
    _finishingCallback
){
    World2DState.call(this, _world);

    var _self;
    var _sineEase;
    var _oldSize; // in world space.

    try {
        //
        _self = this;

        Object.defineProperty(_self, 'screenPosition', {
            get: function() { return _screenPosition; }
        });

        _oldSize = _world.size;

        Object.defineProperty(_self, 'oldSize', {
            get: function() { return _oldSize; }
        });

        Object.defineProperty(_self, 'newSize', {
            get: function() { return _newSize; }
        });

        Object.defineProperty(_self, 'updatingCallback', {
            get: function() { return _updatingCallback; }
        });

        Object.defineProperty(_self, 'finishingCallback', {
            get: function() { return _finishingCallback; }
        });

        _sineEase = new SineEase(EaseMode.EASE_OUT, _duration, false);
        _sineEase.start();

        Object.defineProperty(_self, 'sineEase', {
            get: function() { return _sineEase; }
        });

    } catch (e) {
        //
        console.log('xtory.core.World2DStateZoomingAtScreenPosition: ', e);

        throw e;
    }
}

InheritanceHelper.inherit(World2DStateZoomingAtScreenPosition, World2DState);

World2DStateZoomingAtScreenPosition.prototype.update = function() {
    //
    var isFinished = this.sineEase.isFinished;
    var ratio = this.sineEase.ratioOfCurrentToTotalSineOfAngleOffset;

    if (this.updateCallback !== undefined) {
        this.updatingCallback(_sineEase.ratioOfCurrentToTotalTimeOffset);
    }
    
    var size = ( // in world space.
        // Part 1.
        (isFinished === false) ?
        // Part 2.
        Size2D.addSizes (
            this.oldSize,
            Size2D.multiplySizeByScalar (
                Size2D.subtractSizes(this.newSize, this.oldSize),
                ratio
            )
         ) : 
         // Part 3.
        this.newSize
    );

    var canvasCenterPosition = // in world space.
        this.world.centerPosition;

    var p = this.world.convertPositionFromScreenToWorldSpace(this.screenPosition);

    this.world.setBounds(canvasCenterPosition, size);

    var positionOffset = Vector2D.subtractVectors (
        this.world.convertPositionFromScreenToWorldSpace(this.screenPosition),
        p
    );

    //canvasCenterPosition -= positionOffset;
    canvasCenterPosition =
        Vector2D.subtractVectors(canvasCenterPosition, positionOffset);

    this.world.setBounds(canvasCenterPosition, size);
    
    if (isFinished === true) {
        //
        if (this.finishingCallback !== undefined) {
            this.finishingCallback();
        }

        this.world.state = new World2DStateNormal(this.world);
    }
};

//
// Constructor.
//
function World2DStyle() {
    //
    this.backgroundColor                    = Colors.DEFAULT_BACKGROUND_COLOR;
    this.zoomDuration                       = 250; // in milliseconds.
    this.zoomScaleFactor                    = 2.0;
    this.hitLineSegmentScreenThicknessTimes = 5.0;
    this.viewMargin                         = 125; // in world space.
}

//
// Static methods.
//
World2DStyle.areEqual = function(style1, style2) {
    //
    if ((style1 instanceof World2DStyle) === false ||
        (style2 instanceof World2DStyle) === false) {
        return false;
    }

    if (Color.areEqual(style1.backgroundColor, style2.backgroundColor) === false ||
        style1.zoomDuration !== style2.zoomDuration ||
        style1.zoomScaleFactor !== style2.zoomScaleFactor ||
        style1.hitLineSegmentScreenThicknessTimes !== style2.hitLineSegmentScreenThicknessTimes ||
        style1.viewMargin !== style2.viewMargin) {
        //
        return false;

    } else {
        //
        return true;
    }
};

// Note:
// OpenGL viewport's (X, Y) means the lower-left corner.
// DirectX viewport's (X, Y) means the upper-left corner.
//
// And screen space follows the viewport's rule, that is, (0, 0) means the lower-
// left corner, not the upper-left corner.
//
//
// Constructor.
//
function World2D(_renderer, _style) {
    //
    var _self;
    var _state;
    var _spriteBatch;
    var _lineSegmentBatch;

    //
    // Bounds.
    //
    // Note:
    // 'CenterPosition' here means: the center position of this canvas 'in world
    // space'.
    var _centerPosition; // which will be set before continuing.

    // Note:
    // 'Size' here means: the size of this canvas 'in world space'.
    var _size; // which will be set before continuing.

    // Note:
    // The scale factor of world to screen.
    var _worldToScreenScaleFactor;

    var _layers;

    // Helpers
    var _hasToUpdateItems;
    var _drawnImageCount;
    var _drawnLineSegmentCount;
    var _lastDrawnItem;

    // Test:
    var _lastCanvasClientSize;

    this.elGroups = {}; // elGroups = event-listener groups.
    // :Test

    try {
        //
        _self = this;

        if (_style === undefined) {
            _style = new World2DStyle();
        }

        _state = new World2DStateNormal(_self);

        _spriteBatch = new SpriteBatch(_renderer);
        _lineSegmentBatch = new LineSegment2DBatch(_renderer);

        _centerPosition = new Vector2D(0, 0);
        _worldToScreenScaleFactor = 1.0;

        setUpLayers();

        // Test:
        /*
        this.resize();
        */
        _lastCanvasClientSize = new Size2D(undefined, undefined);
        resize();
        // :Test

        _hasToUpdateItems = false;
        _drawnImageCount = 0;
        _drawnLineSegmentCount = 0;
        _lastDrawnItem = null;

        hookEvents();

    } catch (e) {
        //
        console.log('xtory.core.World2D: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        get: function() { return _renderer; }
    });

    Object.defineProperty(_self, 'style', {
        //
        get: function() {
            return _style;
        },

        set: function(value) {
            //
            if (World2DStyle.areEqual(value, _style) === true) {
                return;
            }

            // ...

            _style = value;
        }
    });

    Object.defineProperty(_self, 'state', {
        //
        get: function() {
            return _state;
        },

        set: function(value) {
            //
            if (value === _state) {
                return;
            }

            // ...

            _state = value;
        }
    });

    Object.defineProperty(_self, 'spriteBatch', {
        get: function() { return _spriteBatch; }
    });

    Object.defineProperty(_self, 'lineSegmentBatch', {
        get: function() { return _lineSegmentBatch; }
    });

    //
    // Extent.
    //
    Object.defineProperty(_self, 'centerPosition', {
        get: function() { return _centerPosition; }
    });

    Object.defineProperty(_self, 'size', {
        get: function() { return _size; }
    });

    Object.defineProperty(_self, 'worldToScreenScaleFactor', {
        get: function() { return _worldToScreenScaleFactor; }
    });

    Object.defineProperty(_self, 'drawnImageCount', {
        get: function() { return _drawnImageCount; },
        set: function(value) { _drawnImageCount = value; }
    });

    Object.defineProperty(_self, 'drawnLineSegmentCount', {
        get: function() { return _drawnLineSegmentCount; },
        set: function(value) { _drawnLineSegmentCount = value; }
    });

    Object.defineProperty(_self, 'lastDrawnItem', {
        get: function() { return _lastDrawnItem; },
        set: function(value) { _lastDrawnItem = value; }
    });

    //
    // Private methods.
    //
    function resize() {
        //
        var canvasClientSize = new Size2D (
            _renderer.canvas.clientWidth,
            _renderer.canvas.clientHeight
        );

        if (Size2D.areEqual(canvasClientSize, _lastCanvasClientSize) === true) {
            return;
        }

        _lastCanvasClientSize = canvasClientSize;
        
        // Note:
        // This method could be called when window resizing occurs, that is,
        // viewport changes (and hence _size changes as well). But the world's
        // center position remains unchanged.

        var screenToWorldScaleFactor = 1.0 / _worldToScreenScaleFactor;

        _size = Size2D.multiplySizeByScalar (
            canvasClientSize,
            screenToWorldScaleFactor
        );

        _hasToUpdateItems = true;

        // Test:
        /*
        if (this.boundsChanged !== null) {
            this.boundsChanged (
                this,
                new BoundsChangedEventArgs(false, true)
            );
        }
        */

        var eventName = 'boundsChanged';
        if (EventTargetHelper.checkIfHasEventListeners(_self, eventName) === true) {
            //
            var event = new Event(eventName);
            event.isMoved = false;
            event.isResized = true;

            EventTargetHelper.dispatchEvent(_self, event);
        }
        // :Test
    }

    function setUpLayers() {
        //
        if (_layers !== null) {
            tearDownLayers();
        }

        _layers = [];

        // Sets the layer count.
        var layerCount = (
            World2DLayerName.NEAREST_ITEMS -
            World2DLayerName.FARTHEST_ITEMS +
            1
        );

        for (var i=0; i<layerCount; i++) {
            _layers.push([]);
        }
    }

    function tearDownLayers() {
        //
        if (_layers != null) {
            //
            for (var i=0; i<_layers.length; i++) {
                //
                var item1 = _layers[i];

                for (var j=0; j<item1.length; j++) {
                    //
                    var item2 = item1[j];
                    if (item2 !== null) {
                        item2.dispose();
                    }
                }

                // Test:
                /*
                item1.clear();
                */
                _layers[i] = null;
                // :Test
            }

            // Test:
            /*
            _layers.clear();
            */
            _layers = null;
        }
    }

    function hookEvents() {
        //
        EventTargetHelper.addEventListener(_self, 'boundsChanged', onBoundsChanged);
    }

    //
    // Event listeners.
    //
    function onBoundsChanged(event) {
        //
        // event: 
        // - isCenterPositionChanged
        // - isSizeChanged

        for (var i=0; i<_layers.length; i++) {
            //
            var item = _layers[i];

            for (var j=0; j<item.length; j++) {
                //
                var item2 = item[j];
                item2.invalidateBounds();
            }
        }
    }

    //
    // Privileged methods.
    //
    this.addItem = function(layerName, item) {
        //
        if (item === null) {
            throw 'An argument-null exception raised.';
        }

        var layerIndex = layerName;// (int)layerName;
        if (IndexHelper.isIndexValid(_layers.length, layerIndex) === false) {
            throw 'An index-out-of-range exception raised.';
        }

        //if (_layers[layerIndex].Contains(item) == true) {
        if (ArrayHelper.contains(_layers[layerIndex], item) === true) {
            //
            // throw new InvalidOperationException (
            //     string.Format (
            //         Messages.CanvasLayerItemAlreadyExists,
            //         layerName.ToString()
            //     )
            // );
            throw 'A world-layer-item-already-exists exception raised.';
        }

        _layers[layerIndex].push(item);

        _hasToUpdateItems = true;
    };

    this.removeItem = function(item) {
        //
        if (item === null) {
            throw 'An argument-null exception raised.';
        }

        var containsItem = false;

        for (var i=0; i<_layers.length; i++) {
            //
            var layer = _layers[i];

            if (ArrayHelper.contains(layer, item) === true) {
                //
                containsItem = true;

                var isSucceeded = ArrayHelper.remove(layer, item);
                if (isSucceeded === false) {
                    return false;
                }
            }
        }

        if (containsItem === false) {
            //
            return false;

        } else {
            //
            _hasToUpdateItems = true;
            
            return true;
        }
    };

    this.update = function() {
        //
        // Updates the state.
        _state.update();

        if (_hasToUpdateItems === true) {
            //
            for (var i=0; i<_layers.length; i++) {
                //
                var item = _layers[i];

                for (var j=0; j<item.length; j++) {
                    //
                    item[j].update();
                }
            }

            _hasToUpdateItems = false;
        }
    };

    this.draw = function() {
        //
        // Resizes (if necessary).
        resize();

        _drawnImageCount = 0;
        _drawnLineSegmentCount = 0;

        // 1. Draws the background.
        _renderer.clear (
            ClearOptions.COLOR_BUFFER,
            _style.backgroundColor
        );

        // 2. Draws the items in all layers.
        for (var i=0; i<_layers.length; i++) {
            //
            var item = _layers[i];

            for (var j=0; j<item.length; j++) {
                //
                item[j].draw();
            }
        }

        // 3. Ends the sprite batch (if necessary).
        this.endSpriteBatch();

        // Ends the line-segment batch (if necessary).
        this.endLineSegmentBatch();

        // 4. Sets the last drawn item to null.
        _lastDrawnItem = null;
    };

    this.move = function(screenPositionOffset) {
        //
        if (screenPositionOffset.x === 0 &&
            screenPositionOffset.y === 0) {
            return;
        }

        var s = 1.0 / _worldToScreenScaleFactor;

        var positionOffset = // in world space.
            Vector2D.multiplyVectorByScalar(screenPositionOffset, s);

        _centerPosition =
            Vector2D.addVectors(_centerPosition, positionOffset);

        _hasToUpdateItems = true;

        // Test:
        /*
        if (this.boundsChanged != null) {
            //
            this.boundsChanged (
                this,
                new BoundsChangedEventArgs(true, false)
            );
        }
        */

        var eventName = 'boundsChanged';
        if (EventTargetHelper.checkIfHasEventListeners(_self, eventName) === true) {
            //
            var event = new Event(eventName);
            event.isMoved = true;
            event.isResized = false;

            EventTargetHelper.dispatchEvent(_self, event);
        }
        // :Test
    };

    this.zoomAt = function(screenPosition, delta, updatingCallback, finishingCallback) {
        //
        if (delta === 0) {
            return;
        }
        
        var size = (
            (delta < 0) ?
            Size2D.multiplySizeByScalar(_size, _style.zoomScaleFactor) :
            Size2D.multiplySizeByScalar(_size, 1.0/_style.zoomScaleFactor)
        );

        this.state = new World2DStateZoomingAtScreenPosition (
            this,
            screenPosition,
            size,
            _style.zoomDuration,
            updatingCallback,
            finishingCallback
        );

        // Note:
        // The Zooming state will set _hasToUpdateItems to true every time the state
        // is called, so we don't have to set it here.
    };

    this.resize = function() {
        resize();
    };

    this.invalidateItems = function() {
        //
        _hasToUpdateItems = true;
    };

    //
    // Accessors.
    //
    this.setBounds = function(centerPosition, size) {
        //
        // 1. Sets the new center position in world space.
        var isMoved;
        if (centerPosition === _centerPosition) {
            //
            isMoved = false;

        } else { // centerPosition !== _centerPosition
            //
            _centerPosition = centerPosition;
            isMoved = true;
        }

        var isResized;
        if (size === _size) {
            //
            isResized = false;

        } else { // size !== _size
            //
            // 2-1. Checks if the aspect ratios of before and after are the same.
            var oldAspectRatio = _size.width / _size.height;
            var newAspectRatio =  size.width /  size.height;

            // 2-2. Then zooms in or out with the same center world position.

            if (MathHelper.areEqual(oldAspectRatio, newAspectRatio) === true) {
                //
                _worldToScreenScaleFactor *= _size.width / size.width;

            } else {
                //
                // Note:
                // The difference between the old and new aspect ratios is
                // supposed to be smaller then the epsilon, or an exception
                // is thrown. But later, I found this insistence isn't nece-
                // ssary and the chart still works when those aspect ratio
                // are different. So I changed how to modify _worldToScreen-
                // ScaleFactor (as shown below) and kept going.
                /*
                throw 'An invalid-operation-exception raised.';
                */

                if (oldAspectRatio <= newAspectRatio) {
                    //
                    _worldToScreenScaleFactor *= _size.jeight / size.jeight;

                } else {
                    //
                    _worldToScreenScaleFactor *= _size.width / size.width;
                }
                // :Note
            }

            _size = size;

            isResized = true;
        }

        _hasToUpdateItems = true;

        // Test:
        /*
        if (this.BoundsChanged != null) {
            //
            this.BoundsChanged (
                this,
                new BoundsChangedEventArgs(isMoved, isResized)
            );
        }
        */

        var eventName = 'boundsChanged';
        if (EventTargetHelper.checkIfHasEventListeners(_self, eventName) === true) {
            //
            var event = new Event(eventName);
            event.isMoved = isMoved;
            event.isResized = isResized;

            EventTargetHelper.dispatchEvent(_self, event);
        }
        // :Test
    };

    //
    // Helpers
    //
    this.drawsItem = function(item) {
        //
        if (item.isVisible === false ||
            item.isOutOfBounds === true) {
            //
            return false;
            
        } else {
            //
            return true;
        }
    };

    this.endSpriteBatch = function() {
        //
        if (_spriteBatch.isBegun === false) {
            return;
        }

        var gl = _renderer.gl;

        // Sets the graphics states.
        // _scene.GraphicsDevice.AlphaBlendState =
        //     AlphaBlendStates.Transparent;

        gl.enable(gl.BLEND);

        gl.blendFunc (
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA
        );

        // _scene.GraphicsDevice.DepthStencilState =
        //     DepthStencilStates.None;

        // _scene.GraphicsDevice.RasterizerState =
        //     RasterizerStates.CullCounterclockwise;

        // _scene.GraphicsDevice.TextureBlendState =
        //     TextureBlendStates.TextureColorOnly;

        // Ends the sprite batch.
        _spriteBatch.end();
    };

    this.endLineSegmentBatch = function() {
        //
        if (_lineSegmentBatch.isBegun === false) {
            return;
        }

        var gl = _renderer.gl;

        // Sets the graphics states.
        // _scene.GraphicsDevice.AlphaBlendState =
        //     AlphaBlendStates.Transparent;
        gl.enable(gl.BLEND);

        gl.blendFunc (
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA
        );

        // _scene.GraphicsDevice.DepthStencilState =
        //     DepthStencilStates.None;

        // _scene.GraphicsDevice.RasterizerState =
        //     RasterizerStates.CullCounterclockwise;

        // _scene.GraphicsDevice.TextureBlendState =
        //     TextureBlendStates.VertexColorOnly;

        // Ends the line-segment batch.
        _lineSegmentBatch.end();
    };

    this.convertPositionFromScreenToWorldSpace = function(screenPosition) {
        //
        // Note:
        // See the notes above this constructor function.
        /*
        var upperLeftPosition = new Vector2D (
            _centerPosition.x - _size.width*0.5,
            _centerPosition.y + _size.height*0.5
        );

        var screenToWorldScaleFactor = 1.0 / _worldToScreenScaleFactor;

        return new Vector2D (
            upperLeftPosition.x + screenPosition.x*screenToWorldScaleFactor,
            upperLeftPosition.y - screenPosition.y*screenToWorldScaleFactor
        );
        */

        var lowerLeftPosition = new Vector2D (
            _centerPosition.x - _size.width*0.5,
            _centerPosition.y - _size.height*0.5
        );

        var screenToWorldScaleFactor = 1.0 / _worldToScreenScaleFactor;

        return new Vector2D (
            lowerLeftPosition.x + screenPosition.x*screenToWorldScaleFactor,
            lowerLeftPosition.y + screenPosition.y*screenToWorldScaleFactor
        );
        // :Note
    };

    this.convertPositionFromWorldToScreenSpace = function(position) {
        //
        // Note:
        // See the notes above this constructor function.
        /*
        var upperLeftPosition = new Vector2D (
            _centerPosition.x - _size.width*0.5,
            _centerPosition.y + _size.height*0.5
        );

        return new Vector2D (
            (position.x - upperLeftPosition.x) * _worldToScreenScaleFactor,
            (upperLeftPosition.y - position.y) * _worldToScreenScaleFactor
        );
        */

        var lowerLeftPosition = new Vector2D (
            _centerPosition.x - _size.width*0.5,
            _centerPosition.y - _size.height*0.5
        );

        return new Vector2D (
            (position.x - lowerLeftPosition.x) * _worldToScreenScaleFactor,
            (position.y - lowerLeftPosition.y) * _worldToScreenScaleFactor
        );
        // :Note
    };

    this.convertLengthFromScreenToWorldSpace = function(screenLength) {
        //
        return screenLength / _worldToScreenScaleFactor;
    };

    this.convertLengthFromWorldToScreenSpace = function(length) {
        //
        return length * _worldToScreenScaleFactor;
    };
}

//
// Static constants.
//
World2D.DEFAULT_LINE_SEGMENT_LAYER_INDEX = World2DLayerName.LINE_SEGMENTS_BELOW_FAR_IMAGES;
World2D.DEFAULT_IMAGE_LAYER_INDEX = World2DLayerName.MIDDLE_IMAGES;

//
// Constructor.
//
function World2DImageStyle() {
    //
    this.boundsScreenSize = false;
    this.minScreenSize    = new Size2D(0, 0);
    this.maxScreenSize    = new Size2D(Number.MAX_VALUE, Number.MAX_VALUE);
}

//
// Static methods.
//
World2DImageStyle.areEqual = function(style1, style2) {
    //
    if ((style1 instanceof World2DImageStyle) === false ||
        (style2 instanceof World2DImageStyle) === false) {
        return false;
    }

    if (style1.boundsScreenSize !== style2.boundsScreenSize ||
        Size2D.areEqual(style1.minScreenSize, style2.minScreenSize) === false ||
        Size2D.areEqual(style1.maxScreenSize, style2.maxScreenSize) === false) {
        //
        return false;

    } else {
        //
        return true;
    }
};

//
// Constructor.
//
function World2DItem(_world) {
    //
    var _self;
    var _isEnabled;
    var _isVisible;
    var _isSelected;
    var _isOutOfBounds;
    var _tag;

    //
    // Helpers.
    //
    var _hasToCheckBounds;

    try {
        //
        _self = this;

        _isEnabled     = true;
        _isVisible     = true;
        _isSelected    = false;
        _isOutOfBounds = false;

        _hasToCheckBounds = true;

    } catch (e) {
        //
        console.log('xtory.core.World2DItem: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'world', {
        get: function() { return _world; }
    });

    Object.defineProperty(_self, 'isEnabled', {
        //
        get: function() {
            return _isEnabled;
        },

        set: function(value) {
            //
            if (value === _isEnabled) {
                return;
            }

            _isEnabled = value;

            if (_isEnabled === true) {
                //
                _world.invalidateItems();
            }
        }
    });

    Object.defineProperty(_self, 'isVisible', {
        //
        get: function() {
            //
            return _isVisible;
        },

        set: function(value) {
            //
            if (value === _isVisible) {
                return;
            }

            _isVisible = value;

            // Note:
            // We don't have to check if updating items is needed (like what Is-
            // Enabled does) because whether this item is visible or not, we have
            // to update it.
            /*
            if (_isVisible === true) {
                //
                _world.invalidateItems();
            }
            */
        }
    });

    Object.defineProperty(_self, 'isSelected', {
        //
        get: function() {
            //
            return _isSelected;
        },

        set: function(value) {
            //
            if (value === _isSelected) {
                return;
            }

            _isSelected = value;

            // ...
        }
    });

    Object.defineProperty(_self, 'isOutOfBounds', {
        //
        get: function() {
            //
            if (_hasToCheckBounds === true) {
                //
                _self.checkIfOutOfBounds();

                _hasToCheckBounds = false;
            }

            return _isOutOfBounds;
        },

        set: function(value) {
            //
            if (value === _isOutOfBounds) {
                return;
            }

            _isOutOfBounds = value;

            // ...
        }
    });

    Object.defineProperty(_self, 'tag', {
        get: function() { return _tag; },
        set: function(value) { _tag = value; }
    });

    Object.defineProperty(_self, 'hasToCheckBounds', {
        get: function() { return _hasToCheckBounds; },
        set: function(value) { _hasToCheckBounds = value; }
    });
}

//
// Prototype.
//
World2DItem.prototype = {
    //
    // Public methods.
    //
    update: function() {
        //
        // No contents.
    },

    draw: function() {
        //
        // No contents.
    },

    invalidateBounds: function() {
        //
        this.hasToCheckBounds = true;
    },

    //
    // Helpers
    //
    checkIfOutOfBounds: function() {
        //
        // No contents.
    }
};

//
// Constructor.
//
function World2DLineSegmentStyle() {
    //
    this.boundsScreenThickness = false;
    this.minScreenThickness    = 0;
    this.maxScreenThickness    = Number.MAX_VALUE;
}

//
// Static methods.
//
World2DLineSegmentStyle.areEqual = function(style1, style2) {
    //
    if ((style1 instanceof World2DLineSegmentStyle) === false ||
        (style2 instanceof World2DLineSegmentStyle) === false) {
        return false;
    }

    if (style1.boundsScreenThickness !== style2.boundsScreenThickness ||
        style1.minScreenThickness !== style2.minScreenThickness ||
        style1.maxScreenThickness !== style2.maxScreenThickness) {
        //
        return false;

    } else {
        //
        return true;
    }
};

//
// Constructor.
//
function World2DLineSegment (
    _world,
    _startPosition,
    _finishPosition,
    _thickness,
    _color
){
    World2DItem.call(this, _world);

    var _self;
    var _startScreenPosition;
    var _finishScreenPosition;
    var _screenThickness;
    var _style;

    try {
        //
        _self = this;

        if (_thickness < 0) {
            throw 'An invalid-length exception raised.';
        }

        // Note:
        // Define properties before continuing.

        // Note:
        // The start position in world space.
        Object.defineProperty(_self, 'startPosition', {
            //
            get: function() {
                return _startPosition;
            },

            set: function(value) {
                //
                if (Vector2D.areEqual(value, _startPosition) === true) {
                    return;
                }

                _startPosition = value;

                _startScreenPosition =
                    _world.convertPositionFromWorldToScreenSpace(_startPosition);

                // Test:
                _self.invalidateBounds();
                // :Test
            }
        });

        // Note:
        // The finish position in world space.
        Object.defineProperty(_self, 'finishPosition', {
            //
            get: function() {
                return _finishPosition;
            },

            set: function(value) {
                //
                if (Vector2D.areEqual(value, _finishPosition) === true) {
                    return;
                }

                _finishPosition = value;

                _finishScreenPosition =
                    _world.convertPositionFromWorldToScreenSpace(_finishPosition);

                // Test:
                _self.invalidateBounds();
                // :Test
            }
        });

        Object.defineProperty(_self, 'startScreenPosition', {
            get: function() { return _startScreenPosition },
            // Test:
            set: function(value) { _startScreenPosition = value; }
            // :Test
        });

        Object.defineProperty(_self, 'finishScreenPosition', {
            get: function() { return _finishScreenPosition },
            // Test:
            set: function(value) { _finishScreenPosition = value; }
            // :Test
        });

        // Note:
        // The thickness in world space.
        Object.defineProperty(_self, 'thickness', {
            //
            get: function() {
                return _thickness;
            },

            set: function(value) {
                //
                if (value === _thickness) {
                    return;
                }

                _thickness = value;

                update();
            }
        });

        Object.defineProperty(_self, 'screenThickness', {
            get: function() { return _screenThickness },
            // Test:
            set: function(value) { _screenThickness = value; }
            // :Test
        });

        Object.defineProperty(_self, 'color', {
            get: function() { return _color },
            set: function(value) { _color = value; }
        });

        _style = new World2DLineSegmentStyle();
        
        Object.defineProperty(_self, 'style', {
            //
            get: function() {
                //
                return _style
            },

            set: function(value) {
                //
                if (World2DLineSegmentStyle.areEqual(value, _style) === true) {
                    return;
                }

                _style = value;

                update();
            }
        });

        // Calls Update() to calculate the positions and thickness in screen space.
        this.update();

    } catch (e) {
        //
        console.log('xtory.core.World2DLineSegment: ' + e);

        throw e;
    }
}

InheritanceHelper.inherit(World2DLineSegment, World2DItem);

World2DLineSegment.prototype.update = function() {
    //
    // Note:
    // See the note in World2DImage.update()

    if (this.isEnabled === false) {
        return;
    }

    // 1. Calculates the start/finish positions and thickness in screen space.
    this.startScreenPosition =
        this.world.convertPositionFromWorldToScreenSpace(this.startPosition);

    this.finishScreenPosition =
        this.world.convertPositionFromWorldToScreenSpace(this.finishPosition);

    this.screenThickness =
        this.thickness * this.world.worldToScreenScaleFactor;

    // 2. Bounds the thickness in screen space (if necessary).
    this.boundScreenThickness();
};

World2DLineSegment.prototype.draw = function() {
    //
    var world = this.world;
    if (world.drawsItem(this) === false) {
        return;
    }
    
    if (world.lastDrawnItem === null) {
        //
        world.lineSegmentBatch.begin();

    } else if (
        (world.lastDrawnItem instanceof World2DImage) === true
    ){
        if (world.spriteBatch.IsBegun === true) {
            world.endSpriteBatch();
        }

        world.lineSegmentBatch.begin();

    } else if (
       (world.lastDrawnItem instanceof World2DLineSegment) === true &&
        world.lineSegmentBatch.isBegun === false
    ){
        // Note:
        // This situation shouldn't happen. But if it does, begin the line-segment
        // batch.

        //Debug.Fail(new InvalidOperationException().ToString());
        console.log('An invalid-operation exception raised.');

        world.lineSegmentBatch.begin();
    }

    // Draws this line segment.
    world.lineSegmentBatch.drawLineSegment (
        new Vector3D (
            this.startScreenPosition.x,
            this.startScreenPosition.y,
            LineSegment2D.DEFAULT_SCREEN_POSITION_DEPTH
        ),
        new Vector3D (
            this.finishScreenPosition.x,
            this.finishScreenPosition.y,
            LineSegment2D.DEFAULT_SCREEN_POSITION_DEPTH
        ),
        this.screenThickness,
        this.color
    );

    // Sets the canvas' last drawn item to this line segment.
    world.lastDrawnItem = this;

    // Increases the canvas' drawn line-segment count by 1.
    world.drawnLineSegmentCount++;
};

World2DLineSegment.prototype.boundScreenThickness = function() {
    //
    var style = this.style;

    if (style.boundsScreenThickness === false) {
        return;
    }

    if (style.minScreenThickness < 0 ||
        style.maxScreenThickness < 0) {
        //
        throw 'An invalid-operation exception raised.';
    }

    if (this.screenThickness < style.minScreenThickness) {
        //
        this.screenThickness = style.minScreenThickness;

        // Note:
        // Sets the line segment's thickness in screen space to min, but keeps the
        // thickness in world space unchanged.
        /*
        this.thickness =
            this.screenThickness / this.world.worldToScreenScaleFactor;
        */

    } else if (
        style.maxScreenThickness < this.screenThickness
    ){
        this.screenThickness = style.maxScreenThickness;

        // Note:
        // See the note above.
    }
};

//
// Helpers
//
World2DLineSegment.prototype.checkIfOutOfBounds = function() {
    //
    var centerPosition = this.world.centerPosition;
    var size = this.world.size;

    if (LineSegment2DHelper.lineSegmentIntersectsBounds (
            // Part 1.
            this.startPosition, this.finishPosition,
            // Part 2.
            centerPosition, size
            //
        ) === true) {
        //
        this.isOutOfBounds = false;

    } else {
        //
        this.isOutOfBounds = true;
    }
};

//
// Constructor.
//
function World2DImage (
    _world,
    _texture,
    _centerPosition, // in world space.
    _size,           // in world space.
    _sourceRect,
    _color
){
    World2DItem.call(this, _world);

    var _self;
    var _centerScreenPosition;
    var _screenSize;
    var _style;

    try {
        //
        _self = this;

        if (_texture === null) {
            throw 'An argument-null exception raised.';
        }

        // Note:
        // Define properties before continuing.

        Object.defineProperty(_self, 'texture', {
            get: function() { return _texture; },
            set: function(value) { _texture = value; }
        });

        // Note:
        // 'centerPosition' here means the center position of this image "in world
        // space".
        Object.defineProperty(_self, 'centerPosition', {
            //
            get: function() {
                //
                return _centerPosition;
            },

            set: function(value) {
                //
                if (Vector2D.areEqual(value, _centerPosition) === true) {
                    return;
                }

                _centerPosition = value;

                // Calculates the center position in screen space as well.
                _centerScreenPosition =
                    _world.convertPositionFromWorldToScreenSpace(_centerPosition);

                // Test:
                _self.invalidateBounds();
                // :Test
            }
        });

        // Note:
        // 'Size' here means this image's size in world space.
        Object.defineProperty(_self, 'size', {
            //
            get: function() {
                //
                return _size;
            },

            set: function(value) {
                //
                if (Size2D.areEqual(value, _size) === true) {
                    return;
                }

                _size = value;

                // Calculates the size in screen space as well.
                _screenSize =
                    Size2D.multiplySizeByScalar(_size, _world.worldToScreenScaleFactor);

                // Test:
                _self.invalidateBounds();
                // :Test
            }
        });

        // Note:
        // "CenterScreenPosition" here means this image's center position in screen
        // space, not the screen's center position.
        Object.defineProperty(_self, 'centerScreenPosition', {
            get: function() { return _centerScreenPosition; },
            // Test:
            set: function(value) { _centerScreenPosition = value; }
            // :Test
        });

        // Note:
        // "ScreenSize" here means this image's size in screen space, not the screen's
        // size.
        Object.defineProperty(_self, 'screenSize', {
            get: function() { return _screenSize; },
            // Test:
            set: function(value) { _screenSize = value; }
            // :Test
        });

        Object.defineProperty(_self, 'sourceRect', {
            get: function() { return _sourceRect; },
            set: function(value) { _sourceRect = value; }
        });

        Object.defineProperty(_self, 'color', {
            get: function() { return _color; },
            set: function(value) { _color = value; }
        });

        _style = new World2DImageStyle();

        Object.defineProperty(_self, 'style', {
            //
            get: function() {
                //
                return _style;
            },

            set: function(value) {
                //
                if (World2DImageStyle.areEqual(value,  _style) === true) {
                    return;
                }

                _style = value;

                update();
            }
        });

        // Note:
        // Be careful! Use property to set _size as well as _screenSize!
        //this.size = _size;
        var size = _size;
        _size = 0;
        this.size = size;

        // Calls Update() to calculate the center position and size in screen space.
        this.update();

    } catch (e) {
        //
        console.log('xtory.core.World2DImage: ' + e);

        throw e;
    }
}

InheritanceHelper.inherit(World2DImage, World2DItem);

World2DImage.prototype.update = function() {
    //
    // Note:
    // No matter how canvas changes (maybe due to the window resizing, different
    // size viewport, etc.), every image's world-related data doesn't change, such
    // as: image's center position and size in world space. After canvas changed,
    // we should update image's canvas-related data using its own world-related
    // data and canvas' world-related data.

    if (this.isEnabled === false) {
        return;
    }

    // 1. Calculates the center position and size in screen space.
    this.centerScreenPosition =
        this.world.convertPositionFromWorldToScreenSpace(this.centerPosition);

    this.screenSize =
        Size2D.multiplySizeByScalar(this.size, this.world.worldToScreenScaleFactor);

    // 2. Bounds the size in screen space (if necessary).
    this.boundScreenSize();
};

World2DImage.prototype.draw = function() {
    //
    var world = this.world;
    if (world.drawsItem(this) === false) {
        return;
    }
    
    if (world.lastDrawnItem === null) {
        //
        this.beginSpriteBatch();

    } else if (
        (world.lastDrawnItem instanceof World2DLineSegment) === true
    ){
        if (world.lineSegmentBatch.isBegun === true) {
            //
            world.endLineSegmentBatch();
        }
        
        this.beginSpriteBatch();

    } else if (
        (world.lastDrawnItem instanceof World2DImage) === true &&
        world.spriteBatch.isBegun === false
    ){
        // Note:
        // This situation shouldn't happen. But if it does, begin the sprite batch.

        //Debug.Fail(new InvalidOperationException().ToString());
        console.log('An invalid-operation exception raised.');

        this.beginSpriteBatch();
    }
    
    world.spriteBatch.drawSprite (
        this.texture,
        this.flushingOptions,
        new Vector3D (
            this.centerScreenPosition.x,
            this.centerScreenPosition.y,
            Sprite.DEFAULT_SCREEN_POSITION_DEPTH
        ),
        this.screenSize,
        this.sourceRect,
        this.color
    );

    // Sets the canvas' last drawn item to this image.
    world.lastDrawnItem = this;

    // Increases the canvas' drawn image count by 1.
    world.drawnImageCount++;
};

World2DImage.prototype.boundScreenSize = function() {
    //
    var style = this.style;

    if (style.boundsScreenSize === false) {
        return;
    }

    if (style.maxScreenSize.width < style.minScreenSize.width ||
        style.maxScreenSize.height < style.minScreenSize.height) {
        throw new 'An invalid-operation exception raised.';
    }

    // 1. Minimum size in screen space.
    if (this.screenSize.width < style.minScreenSize.width) {
        //
        this.screenSize.width = style.minScreenSize.width;

        // Note:
        // Set the image's size in screen space to min, but keep the size in world
        // space unchanged.
        /*
        this.size.width =
            this.screenSize.width / this.world.worldToScreenScaleFactor;
        */
    }

    if (this.screenSize.height < style.minScreenSize.height) {
        //
        this.screenSize.height = style.minScreenSize.height;

        // Note:
        // See the notes above.
    }

    // 2. Maximum size in screen space.
    if (style.maxScreenSize.width < this.screenSize.width) {
        //
        this.screenSize.width = style.maxScreenSize.width;

        // Note:
        // See the notes above.
    }

    if (style.maxScreenSize.height < this.screenSize.height) {
        //
        this.screenSize.height = style.maxScreenSize.height;

        // Note:
        // See the notes above.
    }
};

//
// Helpers
//
World2DImage.prototype.checkIfOutOfBounds = function() {
    //
    var world = this.world;

    var centerPosition = world.centerPosition;
    var size = world.size;

    if (// Part 1.
        (this.size.width*0.5 + size.width*0.5) <
        Math.abs(this.centerPosition.x - centerPosition.x) ||
        // Part 2.
        (this.size.height*0.5 + size.height*0.5) <
        Math.abs(this.centerPosition.y - centerPosition.y)) {
        //
        this.isOutOfBounds = true;

    } else {
        //
        this.isOutOfBounds = false;
    }
};

World2DImage.prototype.beginSpriteBatch = function() {
    //
    this.world.spriteBatch.begin();
};

//
// Constructor.
//
function MouseButton() {
    // No contents.
}

//
// Static constants.
//
MouseButton.LEFT   = 0;
MouseButton.MIDDLE = 1;
MouseButton.RIGHT  = 2;

//
// Constructor.
//
function Plane() {
    // No contents.
}

//
// Constructor.
//
function PositionColor() {
    // No contents.
}

//
// Static constants.
//
PositionColor.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;' +
    'attribute vec4 vertexColor;' +

    'uniform mat4 transform;' +

    'varying vec4 _color;' +

    'void main() {' +
        //
        'gl_Position = transform * vec4(vertexPosition, 1.0);' +
        
        '_color = vertexColor;' +
    '}'
);

PositionColor.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'varying vec4 _color;' +

    'void main() {' +
        'gl_FragColor = _color;' +
    '}'
);

//
// Constructor.
//
function PositionOnly() {
    // No contents.
}

//
// Static constants.
//
PositionOnly.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;' +

    'uniform mat4 transform;' +

    'void main() {' +
        'gl_Position = transform * vec4(vertexPosition, 1.0);' +
    '}'
);

PositionOnly.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'void main() {' +
        'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);' +
    '}'
);

//
// Constructor.
//
function PositionTextureCoordinates() {
    // No contents.
}

//
// Static constants.
//
PositionTextureCoordinates.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;' +
    'attribute vec2 vertexTextureCoordinates;' +

    'uniform mat4 transform;' +

    'varying vec2 _textureCoordinates;' +

    'void main() {' +
        //
        'gl_Position = transform * vec4(vertexPosition, 1.0);' +

        '_textureCoordinates = vertexTextureCoordinates;' +
    '}'
);

PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE = (
    //
   'precision mediump float;' + // which is the recommended fragment shader precision.

   'uniform sampler2D sampler;' +

   'varying vec2 _textureCoordinates;' +

   'void main() {' +
       'gl_FragColor = texture2D(sampler, _textureCoordinates);' +
   '}'
);

//
// Constructor.
//
function TransformedPositionColor() {
    // No contents.
}

//
// Static constants.
//
TransformedPositionColor.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec4 vertexPosition;' +
    'attribute vec4 vertexColor;' +

    'varying vec4 _color;' +

    'void main() {' +
        //
        'gl_Position = vertexPosition;' +

        '_color = vertexColor;' +
    '}'
);

TransformedPositionColor.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'varying vec4 _color;' +

    'void main() {' +
        'gl_FragColor = _color;' +
    '}'
);

//
// Constructor.
//
function TransformedPositionColorTextureCoordinates() {
    // No contents.
}

//
// Static constants.
//
TransformedPositionColorTextureCoordinates.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec4 vertexPosition;' +
    'attribute vec4 vertexColor;' +
    'attribute vec2 vertexTextureCoordinates;' +

    'varying vec4 _color;' +
    'varying vec2 _textureCoordinates;' +

    'void main() {' +
        //
        'gl_Position = vertexPosition;' +
       
        '_color = vertexColor;' +
        '_textureCoordinates = vertexTextureCoordinates;' +
    '}'
);

TransformedPositionColorTextureCoordinates.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'uniform sampler2D sampler;' +

    'varying vec4 _color;' +
    'varying vec2 _textureCoordinates;' +

    'void main() {' +
        'gl_FragColor = _color * texture2D(sampler, _textureCoordinates);' +
    '}'
);

//
// Constructor.
//
function TransformedPositionTextureCoordinates() {
    // No contents.
}

//
// Static constants.
//
TransformedPositionTextureCoordinates.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec4 vertexPosition;' +
    'attribute vec2 vertexTextureCoordinates;' +

    'varying vec2 _textureCoordinates;' +

    'void main() {' +
        //
        'gl_Position = vertexPosition;' +

        '_textureCoordinates = vertexTextureCoordinates;' +
    '}'
);

TransformedPositionTextureCoordinates.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'uniform sampler2D sampler;' +

    'varying vec2 _textureCoordinates;' +

    'void main() {' +
        'gl_FragColor = texture2D(sampler, _textureCoordinates);' +
    '}'
);

// Polyfills.

exports.ArrayHelper = ArrayHelper;
exports.ComparisonResults = ComparisonResults;
exports.EventTargetHelper = EventTargetHelper;
exports.Event = Event;
exports.ExceptionHelper = ExceptionHelper;
exports.Fps = Fps;
exports.IndexHelper = IndexHelper;
exports.InheritanceHelper = InheritanceHelper;
exports.RandomHelper = RandomHelper;
exports.Camera = Camera;
exports.CameraState = CameraState;
exports.CameraStateStill = CameraStateStill;
exports.CameraStateZooming = CameraStateZooming;
exports.SmoothCamera = SmoothCamera;
exports.CanvasCoordinateHelper = CanvasCoordinateHelper;
exports.ClearOptions = ClearOptions;
exports.Color = Color;
exports.Colors = Colors;
exports.DepthBufferValues = DepthBufferValues;
exports.IndexBuffer = IndexBuffer;
exports.Line2DHelper = Line2DHelper;
exports.Line2DIntersectionResult = Line2DIntersectionResult;
exports.LineSegment2D = LineSegment2D;
exports.LineSegment2DBatch = LineSegment2DBatch;
exports.LineSegment2DBatchStyle = LineSegment2DBatchStyle;
exports.LineSegment2DHelper = LineSegment2DHelper;
exports.Ndc = Ndc;
exports.PrimitiveType = PrimitiveType;
exports.Rect = Rect;
exports.Renderer = Renderer;
exports.RendererStyle = RendererStyle;
exports.ScreenCoordinateHelper = ScreenCoordinateHelper;
exports.Size2D = Size2D;
exports.Size3D = Size3D;
exports.Sprite = Sprite;
exports.SpriteBatch = SpriteBatch;
exports.SpriteBatchStyle = SpriteBatchStyle;
exports.SpriteFlushingOptions = SpriteFlushingOptions;
exports.Texture2D = Texture2D;
exports.TextureCoordinateHelper = TextureCoordinateHelper;
exports.VertexBuffer = VertexBuffer;
exports.World2D = World2D;
exports.World2DImage = World2DImage;
exports.World2DImageStyle = World2DImageStyle;
exports.World2DItem = World2DItem;
exports.World2DLineSegment = World2DLineSegment;
exports.World2DLineSegmentStyle = World2DLineSegmentStyle;
exports.World2DLayerName = World2DLayerName;
exports.World2DState = World2DState;
exports.World2DStateNormal = World2DStateNormal;
exports.World2DStateZoomingAtScreenPosition = World2DStateZoomingAtScreenPosition;
exports.World2DStyle = World2DStyle;
exports.MouseButton = MouseButton;
exports.BufferLoader = BufferLoader;
exports.Loader = Loader;
exports.ProgramLoader = ProgramLoader;
exports.TextureLoader = TextureLoader;
exports.AxisGroup = AxisGroup;
exports.MathHelper = MathHelper;
exports.Vector2D = Vector2D;
exports.Vector3D = Vector3D;
exports.Vector4D = Vector4D;
exports.Matrix4x4 = Matrix4x4;
exports.CartesianAxis = CartesianAxis;
exports.Plane = Plane;
exports.Quaternion = Quaternion;
exports.ViewFrustum = ViewFrustum;
exports.PositionColor = PositionColor;
exports.PositionOnly = PositionOnly;
exports.PositionTextureCoordinates = PositionTextureCoordinates;
exports.Program = Program;
exports.ShaderType = ShaderType;
exports.TransformedPositionColor = TransformedPositionColor;
exports.TransformedPositionColorTextureCoordinates = TransformedPositionColorTextureCoordinates;
exports.TransformedPositionTextureCoordinates = TransformedPositionTextureCoordinates;
exports.EaseMode = EaseMode;
exports.SineEase = SineEase;
exports.Stopwatch = Stopwatch;

}((this.xtory.core = this.xtory.core || {})));
