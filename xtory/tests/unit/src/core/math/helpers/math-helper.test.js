var xc = require('../../../../dist/xtory.core.cjs.js');

var numDigits = 5; // with 5-digit precision.

test('constants', () => {
    //
    expect(xc.MathHelper.EPSILON).toBe(Math.pow(10, -numDigits)); // = 0.00001

    // Cuz the tests below are about PI, we want to be more precise. So use 10-
    // digit precision instead of 5.
    var numDigits2 = numDigits * 2;

    expect(xc.MathHelper.PI).toBeCloseTo(Math.PI, numDigits2);
    expect(xc.MathHelper.PI_OVER_TWO).toBeCloseTo(Math.PI/2, numDigits2);
    expect(xc.MathHelper.PI_OVER_FOUR).toBeCloseTo(Math.PI/4, numDigits2);
    expect(xc.MathHelper.TWO_PI).toBeCloseTo(Math.PI*2, numDigits2);
    expect(xc.MathHelper.PI_OVER_ONE_EIGHTY).toBeCloseTo(Math.PI/180, numDigits2);
    expect(xc.MathHelper.ONE_EIGHTY_OVER_PI).toBeCloseTo(180/Math.PI, numDigits2);

    var value = xc.MathHelper.RADIANS_OF_FORTY_FIVE_DEGREES;
    expect(value).toBeCloseTo(xc.MathHelper.PI_OVER_FOUR, numDigits2);
    expect(value).toBeCloseTo(xc.MathHelper.toRadians(45), numDigits2);

    value = xc.MathHelper.RADIANS_OF_NINETY_DEGREES;
    expect(value).toBeCloseTo(xc.MathHelper.PI_OVER_TWO, numDigits2);
    expect(value).toBeCloseTo(xc.MathHelper.toRadians(90), numDigits2);

    value = xc.MathHelper.RADIANS_OF_ONE_EIGHTY_DEGREES;
    expect(value).toBeCloseTo(xc.MathHelper.PI, numDigits2);
    expect(value).toBeCloseTo(xc.MathHelper.toRadians(180), numDigits2);

    value = xc.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES;
    expect(value).toBeCloseTo(xc.MathHelper.TWO_PI, numDigits2);
    expect(value).toBeCloseTo(xc.MathHelper.toRadians(360), numDigits2);
});

test('toRadians()', () => {
    //
    // Note:
    // To convert degrees to radians, multiply by (Math.PI / 180), and divide by
    // it to convert the other way.

    var degrees = 123.456;

    expect(xc.MathHelper.toRadians(degrees)).
        toBeCloseTo(degrees * (Math.PI / 180), numDigits);

    degrees = -654.321;

    expect(xc.MathHelper.toRadians(degrees)).
        toBeCloseTo(degrees * (Math.PI / 180), numDigits);
});

test('toDegrees()', () => {
    //
    var radians = 12.34;

    expect(xc.MathHelper.toDegrees(radians)).
        toBeCloseTo(radians / (Math.PI / 180), numDigits);

    radians = -43.21;

    expect(xc.MathHelper.toDegrees(radians)).
        toBeCloseTo(radians / (Math.PI / 180), numDigits);
});

test('isZero()', () => {
    //
    expect(xc.MathHelper.isZero(10)).toBe(false);
    expect(xc.MathHelper.isZero(1)).toBe(false);
    expect(xc.MathHelper.isZero(0.000011)).toBe(false);
    expect(xc.MathHelper.isZero(1e-5)).toBe(false);
    expect(xc.MathHelper.isZero(0.00001)).toBe(false);

    expect(xc.MathHelper.isZero(0.000009)).toBe(true);
    expect(xc.MathHelper.isZero(0)).toBe(true);
    expect(xc.MathHelper.isZero(-0.000009)).toBe(true);    

    expect(xc.MathHelper.isZero(-0.00001)).toBe(false);
    expect(xc.MathHelper.isZero(-1e-5)).toBe(false);
    expect(xc.MathHelper.isZero(-0.000011)).toBe(false);
    expect(xc.MathHelper.isZero(-1)).toBe(false);
    expect(xc.MathHelper.isZero(-10)).toBe(false);
});

test('areEqual()', () => {
    //
    // ...
});

test('isScalar1LessThanScalar2()', () => {
    //
    // ...
});

test('isScalar1LessThanOrEqualToScalar2()', () => {
    //
    // ...
});

test('isScalar1GreaterThanScalar2()', () => {
    //
    // ...
});

test('isScalar1GreaterThanOrEqualToScalar2()', () => {
    //
    // ...
});

test('isPowerOfTwo()', () => {
    //
    // ...
});
