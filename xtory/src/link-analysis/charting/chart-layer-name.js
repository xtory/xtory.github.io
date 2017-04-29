//
// Constructor.
//
function ChartLayerName() {
    // No contents.
}

//
// Static constants.
//
ChartLayerName.BACKGROUND     = xtory.core.World2DLayerName.BACKGROUND;
ChartLayerName.FILLED_BOXES   = xtory.core.World2DLayerName.BACKGROUND + 1;
ChartLayerName.THEME_LINES    = xtory.core.World2DLayerName.BACKGROUND + 2;
ChartLayerName.LINKS          = xtory.core.World2DLayerName.BACKGROUND + 3;
ChartLayerName.CORNERS        = xtory.core.World2DLayerName.BACKGROUND + 4;
ChartLayerName.UNFILLED_BOXES = xtory.core.World2DLayerName.BACKGROUND + 5;
ChartLayerName.ENDS           = xtory.core.World2DLayerName.BACKGROUND + 6;
ChartLayerName.LEGENDS        = xtory.core.World2DLayerName.BACKGROUND + 7;

// Helpers
ChartLayerName.FIRST_ITEM    = ChartLayerName.BACKGROUND;
ChartLayerName.LAST_ITEM     = ChartLayerName.LEGENDS;
ChartLayerName.FARTHEST_ITEM = ChartLayerName.BACKGROUND;
ChartLayerName.NEAREST_ITEM  = ChartLayerName.LEGENDS;

export { ChartLayerName };
