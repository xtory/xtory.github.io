//
// Constructor.
//
function World2DLayerName() {
    // No contents.
}

//
// Static constants.
//
World2DLayerName.BACKGROUND                                                   =  0;
World2DLayerName.RESERVED_ITEMS_BETWEEN_BACKGROUND_AND_FARTHEST_LINE_SEGMENTS =  1;
World2DLayerName.LINE_SEGMENTS_BELOW_FAR_IMAGES                               =  2;
World2DLayerName.FAR_IMAGES                                                   =  3;
World2DLayerName.LINE_SEGMENTS_BELOW_MIDDLE_IMAGES                            =  4;
World2DLayerName.MIDDLE_IMAGES                                                =  5;
World2DLayerName.LINE_SEGMENTS_ABOVE_MIDDLE_IMAGES                            =  6;
World2DLayerName.NEAR_IMAGES                                                  =  7;
World2DLayerName.LINE_SEGMENTS_ABOVE_NEAR_IMAGES                              =  8;
World2DLayerName.RESERVED_ITEMS_BETWEEN_NEAREST_LINE_SEGMENTS_AND_TEXT        =  9;
World2DLayerName.TEXT                                                         = 10;
World2DLayerName.RESERVED_ITEMS_BETWEEN_TEXT_AND_UI                           = 11;
World2DLayerName.UI                                                           = 12;
World2DLayerName.NEAREST_RESERVED_ITEMS                                       = 13;

//
// Helpers.
//
World2DLayerName.FARTHEST_ITEMS = World2DLayerName.BACKGROUND;
World2DLayerName.NEAREST_ITEMS  = World2DLayerName.NEAREST_RESERVED_ITEMS;

export { World2DLayerName };
