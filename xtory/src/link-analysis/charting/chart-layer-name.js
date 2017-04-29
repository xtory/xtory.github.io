//
// Constructor.
//
function ChartLayerName() {
    // No contents.
}

//
// Static constants.
//
ChartLayerName.BACKGROUND     = xtory.graphicsLibrary.World2DLayerName.BACKGROUND;
ChartLayerName.FILLED_BOXES   = xtory.graphicsLibrary.World2DLayerName.BACKGROUND + 1;
ChartLayerName.THEME_LINES    = xtory.graphicsLibrary.World2DLayerName.BACKGROUND + 2;
ChartLayerName.LINKS          = xtory.graphicsLibrary.World2DLayerName.BACKGROUND + 3;
ChartLayerName.CORNERS        = xtory.graphicsLibrary.World2DLayerName.BACKGROUND + 4;
ChartLayerName.UNFILLED_BOXES = xtory.graphicsLibrary.World2DLayerName.BACKGROUND + 5;
ChartLayerName.ENDS           = xtory.graphicsLibrary.World2DLayerName.BACKGROUND + 6;
ChartLayerName.LEGENDS        = xtory.graphicsLibrary.World2DLayerName.BACKGROUND + 7;

// Helpers
ChartLayerName.FIRST_ITEM    = ChartLayerName.BACKGROUND;
ChartLayerName.LAST_ITEM     = ChartLayerName.LEGENDS;
ChartLayerName.FARTHEST_ITEM = ChartLayerName.BACKGROUND;
ChartLayerName.NEAREST_ITEM  = ChartLayerName.LEGENDS;

export { ChartLayerName };
