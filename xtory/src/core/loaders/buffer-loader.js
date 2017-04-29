import { IndexBuffer }  from '../graphics/index-buffer';
import { VertexBuffer } from '../graphics/vertex-buffer';

//
// Constructor.
//
function BufferLoader(_loader) {
    //
    var _self;
    var _gl;

    try {
        //
        _self = this;
        _gl = _loader.renderer.gl;

    } catch (e) {
        //
        console.log('xtory.core.BufferLoader: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'loader', {
        get: function() { return _loader; }
    });
    
    //
    // Privileged methods.
    //
    this.createVertexBuffer = function() {
        return new VertexBuffer(_self);
    };

    this.createIndexBuffer = function() {
        return new IndexBuffer(_self);
    };
}

export { BufferLoader };
