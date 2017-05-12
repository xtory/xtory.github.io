var xc = require('../../../dist/xtory.core.cjs.js');

test('constants', () => {
    //
    // Note:
    // [References]
    // Array.prototype.sort()
    //
    // 1. If compareFunction(a, b) is less than 0, sort a to a lower index
    // than b, i.e. a comes first.
    expect(xc.ComparisonResults.ITEM1_PRECEDES_ITEM2).toBeLessThan(0);

    // 2. If compareFunction(a, b) returns 0, leave a and b unchanged with
    // respect to each other, but sorted with respect to all different elements.
    expect(xc.ComparisonResults.ITEMS_IN_SAME_POSITION).toBe(0);

    // 3. If compareFunction(a, b) is greater than 0, sort b to a lower index
    // than a.
    expect(xc.ComparisonResults.ITEM1_FOLLOWS_ITEM2).toBeGreaterThan(0);
});
