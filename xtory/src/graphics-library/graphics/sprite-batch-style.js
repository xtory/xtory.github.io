// Note:
// WebGL only uses vertex/index buffers (no arrays, for drawing), so this engine
// provides no areDbFrequentlyChanged option, which is provided in SpriteBatch of
// our Direct3D-version engine.

//
// Constructor.
//
function SpriteBatchStyle() {
    //
    this.clearsDbAfterDrawing = true;

    // Note:
    // See the note above.
    /*
    this.areDbFrequentlyChanged = true;
    */
}

export { SpriteBatchStyle };
