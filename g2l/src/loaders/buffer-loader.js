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
        Object.defineProperty(this, 'loader', {
            'get': function() { return _loader; }
        });

        _self = this;
        
        _gl = _loader.renderer.gl;

    } catch (e) {
        //
        console.log('g2l.BufferLoader: '+ e);

        throw e;
    }
    
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

Object.freeze(BufferLoader);

export { BufferLoader };
