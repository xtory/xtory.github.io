import { GraphLayoutState } from './graph-layout-state';

//
// Constructor.
//
function GraphLayoutStateNormal(_layout) {
    //
    GraphLayoutState.call(this, _layout);
}

gorilla.graphicsLibrary.JSHelper.inherit(GraphLayoutStateNormal, GraphLayoutState);

export { GraphLayoutStateNormal };
