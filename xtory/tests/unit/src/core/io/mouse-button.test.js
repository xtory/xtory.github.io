var xc = require('../../../dist/xtory.core.cjs.js');

test('constants', () => {
    //
    // Note:
    // [References]
    // MouseEvent.button
    //
    // 0: Main button pressed, usually the left button or the un-initialized
    // state.
    expect(xc.MouseButton.LEFT).toBe(0);
    
    // 1: Auxiliary button pressed, usually the wheel button or the middle
    // button (if present).
    expect(xc.MouseButton.MIDDLE).toBe(1);

    // 2: Secondary button pressed, usually the right button.
    expect(xc.MouseButton.RIGHT).toBe(2);
});
