function main() {
    //
    'use strict';

    var xgl = xtory.graphicsLibrary;

    var test = [ 10, 100, 100, 1, 1000 ];

    test.sort(function(item1, item2) {
        //
        if (item1 > item2) {
            //
            return xgl.ComparisonResults.ITEM1_PRECEDES_ITEM2;

        } else if (
            item1 === item2
        ){
            return xgl.ComparisonResults.ITEMS_IN_SAME_POSITION;

        } else {
            //
            return xgl.ComparisonResults.ITEM1_FOLLOWS_ITEM2;
        }
    });

    // var value1 = 0x00004000;
    // var value2 = 0x4000;
    // if (value1 === WebGLRenderingContext.COLOR_BUFFER_BIT) {
    //     var test = 'hi hi';
    // }

    // if (value1 === value2) {
    //     var test = 'hi hi';
    // }    

    console.log(test);
}
