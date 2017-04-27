//
// Constructor.
//
function ChartLayerName() {
    // No contents.
}

//
// Static constants.
//
ChartLayerName.BACKGROUND     = gorilla.graphicsLibrary.World2DLayerName.BACKGROUND;
ChartLayerName.FILLED_BOXES   = gorilla.graphicsLibrary.World2DLayerName.BACKGROUND + 1;
ChartLayerName.THEME_LINES    = gorilla.graphicsLibrary.World2DLayerName.BACKGROUND + 2;
ChartLayerName.LINKS          = gorilla.graphicsLibrary.World2DLayerName.BACKGROUND + 3;
ChartLayerName.CORNERS        = gorilla.graphicsLibrary.World2DLayerName.BACKGROUND + 4;
ChartLayerName.UNFILLED_BOXES = gorilla.graphicsLibrary.World2DLayerName.BACKGROUND + 5;
ChartLayerName.ENDS           = gorilla.graphicsLibrary.World2DLayerName.BACKGROUND + 6;
ChartLayerName.LEGENDS        = gorilla.graphicsLibrary.World2DLayerName.BACKGROUND + 7;

// Helpers
ChartLayerName.FIRST_ITEM    = ChartLayerName.BACKGROUND;
ChartLayerName.LAST_ITEM     = ChartLayerName.LEGENDS;
ChartLayerName.FARTHEST_ITEM = ChartLayerName.BACKGROUND;
ChartLayerName.NEAREST_ITEM  = ChartLayerName.LEGENDS;

export { ChartLayerName };
