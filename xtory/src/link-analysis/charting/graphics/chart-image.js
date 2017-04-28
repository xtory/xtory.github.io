//
// Constructor.
//
function ChartImage (
    _chart,
    _texture,
    _centerPosition, // in world space.
    _size            // in world space.
){
    var g2l = gorilla.graphicsLibrary;

    g2l.World2DImage.call (
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
        console.log('gorilla.linkAnalysis.ChartImage: ', e);

        throw e;
    }
}

gorilla.graphicsLibrary.JSHelper.inherit (
    ChartImage,
    gorilla.graphicsLibrary.World2DImage
);

ChartImage.prototype.draw = function() {
    //
    // No contents.
};

export { ChartImage };
