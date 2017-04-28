import { CircularLayout }         from './circular-layout';
import { GraphLayoutStateNormal } from './states/graph-layout-state-normal';
import { GraphEdge }              from './graph-edge';
import { GraphVertex }            from './graph-vertex';

//
// Constructor.
//
function Layout(_chart) {
    //
    var g2l = gorilla.graphicsLibrary;

    var _self;
    var _state;
    var _circularLayout;
    var _graphVertices;
    var _graphEdges;

    try {
        //
        _self = this;

        _state = new GraphLayoutStateNormal(_self);

        //_circularLayout = new CircularLayout(_self);

        _graphVertices = [];
        _graphEdges = [];

    } catch (e) {
        //
        console.log('gorilla.linkAnalysis.Layout: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'chart', {
        get: function() { return _chart; }
    })

    Object.defineProperty(_self, 'state', {
        //
        get: function() {
            return _state;
        },

        set: function(value) {
            //
            if (value === _state) {
                return;
            }

            // ...

            _state = value;
        }
    });

    Object.defineProperty(_self, 'graphVertexCount', {
        get: function() { return _graphVertices.length; }
    });

    //
    // Private methods.
    //
    function setUpGraphData(ends, links) {
        //
        // Clears the graph data.
        clearGraphData();

        // Sets up the graph vertices.
        for (var i=0; i<ends.length; i++) {
            //
            var graphVertex = new GraphVertex (
                ends[i].centerPosition.clone()
            );

            _graphVertices.push(graphVertex);
        }

        // Sets up the graph edges.
        for (var i=0; i<links.length; i++) {
            //
            var item = links[i];

            var graphEdge = new GraphEdge (
                item.sourceGraphVertexIndex,
                item.destinationGraphVertexIndex
            );

            _graphEdges.push(graphEdge);
        }
    }

    function clearGraphData() {
        //
        _graphEdges = [];
        _graphVertices = [];
    }

    //
    // Privileged methods.
    //
    this.startPerformingCircularlayout = function(style, ends, links, centerPosition) {
        //
        if (_circularLayout === undefined) {
            //
            _circularLayout = new CircularLayout(style);

        } else {
            //
            _circularLayout.style = style;
        }

        setUpGraphData(ends, links);

        _circularLayout.perform(_graphVertices, _graphEdges);

        for (var i=0; i<_graphVertices.length; i++) {
            //
            var item = _graphVertices[i];

            item.position = 
                g2l.Vector2D.addVectors(centerPosition, item.position);

            // Test:
            /*
            _graphVertices[i] = item;
            */
        }
    };

    //
    // Accessors.
    //
    this.getGraphVertexAt = function(index) {
        //
        if (g2l.IndexHelper.isIndexValid(_graphVertices, index) === false) {
            throw 'An argument-out-of-range exception raised.';
        }

        //return _graphVertices[index].position;
        return _graphVertices[index];
    };
}

export { Layout };
