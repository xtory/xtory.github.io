(function (exports) {
'use strict';

//
// Constructor.
//
function ChartLayerName() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
ChartLayerName.BACKGROUND     = GorillaGL.World2DLayerName.BACKGROUND; //GorillaGL.World2DLayerName.BACKGROUND,
ChartLayerName.FILLED_BOXES   = GorillaGL.World2DLayerName.BACKGROUND + 1;
ChartLayerName.THEME_LINES    = GorillaGL.World2DLayerName.BACKGROUND + 2;
ChartLayerName.LINKS          = GorillaGL.World2DLayerName.BACKGROUND + 3;
ChartLayerName.CORNERS        = GorillaGL.World2DLayerName.BACKGROUND + 4;
ChartLayerName.UNFILLED_BOXES = GorillaGL.World2DLayerName.BACKGROUND + 5;
ChartLayerName.ENDS           = GorillaGL.World2DLayerName.BACKGROUND + 6;
ChartLayerName.LEGENDS        = GorillaGL.World2DLayerName.BACKGROUND + 7;

// Helpers
ChartLayerName.FIRST_ITEM    = ChartLayerName.BACKGROUND;
ChartLayerName.LAST_ITEM     = ChartLayerName.LEGENDS;
ChartLayerName.FARTHEST_ITEM = ChartLayerName.BACKGROUND;
ChartLayerName.NEAREST_ITEM  = ChartLayerName.LEGENDS;

Object.freeze(ChartLayerName);

//
// Constructor.
//
function CircularLayout() {
    //
    var _self;

    try {
        //
        _self = this;

        

    } catch (e) {
        //
        console.log('g2l.Renderer: ' + e);

        throw e;
    }
}

Object.freeze(CircularLayout);

//
// Constructor.
//
function Edge(_sourceVertexIndex, _destinationVertexIndex) {
    //
    this.sourceVertexIndex = _sourceVertexIndex;
    this.destinationVertexIndex = _destinationVertexIndex;
}

Object.freeze(Edge);

//
// Constructor.
//
function Vertex(_position) {
    //
    this.position = _position; // which is a Vector2D.
}

Object.freeze(Vertex);

// Charting.

exports.ChartLayerName = ChartLayerName;
exports.CircularLayout = CircularLayout;
exports.Edge = Edge;
exports.Vertex = Vertex;

}((this.GorillaLinkAnalysis = this.GorillaLinkAnalysis || {})));
