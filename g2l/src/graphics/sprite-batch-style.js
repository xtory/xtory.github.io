// Note:
// WebGL only uses vertex/index buffers (no arrays, for drawing), so this engine
// provides no areDbFrequentlyChanged option, which is provided in SpriteBatch of
// our Direct3D-version engine.

//
// Constructor.
//
function SpriteBatchStyle() {
    //
    //this.areDbFrequentlyChanged = true;
    this.clearsDbAfterDrawing = true;
}

Object.freeze(SpriteBatchStyle);

export { SpriteBatchStyle };
