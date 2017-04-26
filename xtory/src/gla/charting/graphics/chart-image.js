//
// Constructor.
//
function ChartImage (
    _chart,
    _texture,
    _centerPosition, // in world space.
    _size            // in world space.
){
    GorillaGL.World2DImage.call (
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
        console.log('g2l.ChartImage: ', e);

        throw e;
    }
}

GorillaGL.JSHelper.inherit(ChartImage, GorillaGL.World2DImage);

ChartImage.prototype.draw = function() {
    //
    // No contents.
};

export { ChartImage };
