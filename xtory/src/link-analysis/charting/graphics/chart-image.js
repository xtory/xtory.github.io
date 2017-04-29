//
// Constructor.
//
function ChartImage (
    _chart,
    _texture,
    _centerPosition, // in world space.
    _size            // in world space.
){
    var xc = xtory.core;

    xc.World2DImage.call (
        _chart.world,
        _texture,
        _centerPosition,
        _size
    );

    var _self;
        
    try {
        //
        _self = this;
        
    } catch (e) {
        //
        console.log('xtory.linkAnalysis.ChartImage: ', e);

        throw e;
    }
}

xtory.core.JSHelper.inherit(ChartImage, xtory.core.World2DImage);

ChartImage.prototype.draw = function() {
    //
    // No contents.
};

export { ChartImage };
