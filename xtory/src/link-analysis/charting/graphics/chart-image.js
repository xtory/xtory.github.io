//
// Constructor.
//
function ChartImage (
    _chart,
    _texture,
    _centerPosition, // in world space.
    _size            // in world space.
){
    var xgl = xtory.graphicsLibrary;

    xgl.World2DImage.call (
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

xtory.graphicsLibrary.JSHelper.inherit (
    ChartImage,
    xtory.graphicsLibrary.World2DImage
);

ChartImage.prototype.draw = function() {
    //
    // No contents.
};

export { ChartImage };
