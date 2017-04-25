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

export { ChartLayerName };
