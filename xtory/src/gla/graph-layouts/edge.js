//
// Constructor.
//
function Edge(_sourceVertexIndex, _destinationVertexIndex) {
    //
    this.sourceVertexIndex = _sourceVertexIndex;
    this.destinationVertexIndex = _destinationVertexIndex;
}

Object.freeze(Edge);

export { Edge };
