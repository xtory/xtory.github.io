import { CircularLayoutStyle } from './circular-layout-style';
import { CircularLayoutVertexDegree} from './circular-layout-vertex-degree';

//
// Constructor.
//
function CircularLayout(_style) {
    //
    var xc = xtory.core;
    
    var _self;
    var _vertexDegrees;
    var _edgedVertexIndices;
    var _unedgedVertexIndices;
    var _circleVertexPositions;
    var _vertices;
    var _edges;

    try {
        //
        _self = this;

        if (_style === undefined) {
            _self = new CircularLayoutStyle();
        }

    } catch (e) {
        //
        console.log('xtory.linkAnalysis.CircularLayout: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'style', {
        //
        get: function() {
            return _style;
        },

        set: function(value) {
            //
            if (CircularLayoutStyle.areEqual(value, _style) === true) {
                return;
            }

            // ...
            
            _style = value;
        }
    });

    //
    // Private methods.
    //
    function setUpVertexDegrees() {
        //
        _vertexDegrees = [];

        for (var i=0; i<_vertices.length; i++) {
            //
            // Note:
            // We have to store the vertex degree's vertex index because we'll sort
            // these vertex degrees later.

            _vertexDegrees.push(new CircularLayoutVertexDegree(i, 0));
        }

        for (var i=0; i<_edges.length; i++) {
            //
            var item = _edges[i];

            // Note:
            // Until now, the vertex degree's vertex index is the same as the index
            // this vertex degree is at.

            // Source.
            var vertexDegree =
                _vertexDegrees[item.sourceVertexIndex];

            vertexDegree.value++;

            _vertexDegrees[item.sourceVertexIndex]
                = vertexDegree;

            // Destination.
            vertexDegree =
                _vertexDegrees[item.destinationVertexIndex];

            vertexDegree.value++;

            _vertexDegrees[item.destinationVertexIndex]
                = vertexDegree;
        }

        // Then sorts the vertex degrees by their degrees.
        _vertexDegrees.sort(function(item1, item2) {
            //
            if (item1.value < item2.value) {
                //
                return xc.ComparisonResults.ITEM1_FOLLOWS_ITEM2;

            } else if (
                //
                item2.value < item1.value
            ){
                return xc.ComparisonResults.ITEM1_PRECEDES_ITEM2;

            } else { // item1.value == item2.value
                //
                return xc.ComparisonResults.ITEMS_IN_SAME_POSITION;
            }
        });

        // Removes the vertices with degree = 0. That is, from now on, there's no
        // vertex with degree = 0 in _vertexDegrees.
        for (var i=0; i<_vertexDegrees.length; i++) {
            //
            var item = _vertexDegrees[i];

            if (item.value === 0) {
                //
                _vertexDegrees.splice (
                    i,
                    _vertexDegrees.length - i // = ((_vertexDegrees.length - 1) - i) + 1;
                );

                break;
            }
        }
    }

    function setUpEdgedVertexIndices() {
        //
        _edgedVertexIndices = [];
        _unedgedVertexIndices = [];

        for (var i=0; i<_vertexDegrees.length; i++) {
            //
            var vertexDegree = _vertexDegrees[i];

            // Debug.Assert (
            //     0 < vertexDegree.value,
            //     Messages.CircularLayoutVertexDegreeZero
            // );
            if (vertexDegree.value <= 0) {
                console.log (
                    'vertexDegree.value <= 0 occurs, but it\'s not supposed to.'
                );
            }

            _edgedVertexIndices.push(vertexDegree.vertexIndex);
        }

        for (var i=0; i<_vertices.length; i++) {
            //
            //if (_edgedVertexIndices.Contains(i) === false) {
            if (xc.ArrayHelper.contains(_edgedVertexIndices, i) === false) {
                //
                _unedgedVertexIndices.push(i);
            }
        }
    }

    function setUpCircleVertexPositions() {
        //
        _circleVertexPositions = [];

        if (_edgedVertexIndices.length === 0) {
            //
            return;

        } else if (
            _edgedVertexIndices.length === 1
        ){
            _circleVertexPositions.push(new xc.Vector2D(0, 0));

        } else { // aka, 1 < _edgedVertexIndices.length
            //
            var totalRadians =
                xc.MathHelper.RADIANS_OF_THREE_SIXTY_DEGREES;

            var unitRadians =
                totalRadians / _edgedVertexIndices.length;

            var theta = unitRadians * 0.5;

            var resultRadius = (_style.vertexSpacing * 0.5) / Math.sin(theta);
            
            var p1, p2, q, m;
            for (var i=0; i<_edgedVertexIndices.length; i++) {
                //
                p1 = new xc.Vector3D(0, resultRadius, 0);
            
                // var m = new Quaternion (
                //     new Vector3D(0, 0, -1),
                //     unitRadians * i
                // ).ToMatrix4x3();

                q = new xc.Quaternion.fromAxisAngle (
                    new xc.Vector3D(0, 0, -1),
                    unitRadians * i
                );

                m = q.toMatrix4x4();

                p2 = xc.Vector3D.transformPoint(p1, m);

                _circleVertexPositions.push(p2.xy);
            }
        }
    }

    function setUpGroups() {
        //
        // Divides vertices into groups according to its count.
        var groupCount;

        if (_edgedVertexIndices.length < 16) { // aka, 4 ~ 15 {
            //
            groupCount = 4;

        } else if (
            _edgedVertexIndices.length < 32 // aka, 16 ~ 31
        ){
            groupCount = 8;

        } else { // aka, 32 <= _edgedVertexIndices.length
            //
            groupCount = 16;
        }

        //groups = new List<List<int>>();
        var groups = [];
        for (var i=0; i<groupCount; i++) {
            groups.push([]); //groups.Add(new List<int>());
        }

        var result = Math.floor(_edgedVertexIndices.length / groups.length);
        var remainder = _edgedVertexIndices.length % groups.length;

        //var groupVertexCounts = new List<int>(); // Vertex count in each group.
        var groupVertexCounts = []; // Vertex count in each group.
        for (var i=0; i<groups.length; i++) {
            groupVertexCounts.push(result);
        }

        for (var i=0; i<remainder; i++) {
            groupVertexCounts[i]++;
        }

        // Note:
        // Adds index to each groups.
        // Example 1:
        // vertex count = 5, group count = 4, then
        // group 1: { 0, 1 },
        // group 2: { 2 },
        // group 3: { 3 },
        // group 4: { 4 }
        // Example 2:
        // vertex count = 11, group count = 4, then
        // group 1: { 0, 1, 2 },
        // group 2: { 3, 4, 5 },
        // group 3: { 6, 7, 8 },
        // group 4: { 9, 10 }

        var count = 0;
        for (var i=0; i<groups.length; i++) {
            //
            var item = groups[i];

            for (var j=0; j<groupVertexCounts[i]; j++) {
                //
                item.push(count);

                count++;
            }
        }

        // Error checking.
        // Debug.Assert(
        //     count == _edgedVertexIndices.length,
        //     @"Error checking failed!"
        // );
        if (count !== _edgedVertexIndices.length) {
            console.log('An error-checking-failed exception raised.');
        }

        // Note:
        // In the example 1 above, the loop count is 2; in the example 2, the loop
        // count is 3. If the remainder is 0, the loop count remains unchanged.

        var levelCount = result;
        if (remainder !== 0) {
            levelCount++;
        }

        return {
            groups: groups,
            levelCount: levelCount
        };
    }

    function processResultIndex (
        group,
        index, // index to process.
        resultIndices 
    ){
        if (group.length === 0) {
            //
            return;

        } else if (
            group.length - 1 < index
        ){
            // Note:
            // The input index is selected among 0 ~ groups[0].length randomly.
            // It's common that groups[0]'s length is larger than the input group's
            // length. If so, and suppose we select the last index in groups[0]
            // (by _random), 'group.length-1 < index' occurs. Then we choose the
            // first one (aka, index = 0) instead.

            index = 0;
        }

        var resultIndex = group[index];
        resultIndices.push(resultIndex);

        //group.removeAt(index);
        group.splice(index, 1);
    }

    function setUpUnedgedVertexPositions(maxX, maxY) {
        //
        var p;

        if (_edgedVertexIndices.length === 0) {
            //
            p = new xc.Vector2D(0, 0);

        } else {
            //
            p = new xc.Vector2D (
                maxX + _style.vertexSpacing,
                maxY
            );
        }

        var count = 0;
        for (var i=0; i<_unedgedVertexIndices.length; i++) {
            //
            var vertexIndex = _unedgedVertexIndices[i];                
            var vertex = _vertices[vertexIndex];
            
            vertex.position = xc.Vector2D.addVectors (
                p,
                new xc.Vector2D (
                    CircularLayout.DEFAULT_UNEDGED_VERTEX_SPACING * count,
                    0
                )
            );

            _vertices[vertexIndex] = vertex;

            count++;
        }
    }

    //
    // Helpers.
    //
    function checkIfResultValid(resultIndices) {
        //
        // Note:
        // That is, checks if all elements of the result indices are different.

        for (var i=0; i<resultIndices.length; i++) {
            //
            for (var j=0; j<resultIndices.length; j++) {
                //
                if (i === j) {
                    //
                    continue;
                }

                if (resultIndices[i] === resultIndices[j]) {
                    throw 'An invalid-operation exception raised.';
                }
            }
        }
    }

    //
    // Privileged methods.
    //
    this.perform = function(vertices, edges) {
        //
        if (vertices.length === 0) {
            return;
        }

        // Note:
        // The element orders in _vertices and _edges will 'never' be changed.

        _vertices = vertices;
        _edges = edges;

        // Sets up the vertex degrees.
        setUpVertexDegrees();

        // Sets up the edged (and unedged) vertex indices.
        setUpEdgedVertexIndices();

        // Sets up the circle's vertex positions (by edged vertex indices).
        setUpCircleVertexPositions();

        var maxX = Number.MIN_VALUE;
        var maxY = Number.MIN_VALUE;

        if (_edgedVertexIndices.length <= 3) {
            //
            for (var i=0; i<_vertexDegrees.length; i++)
            {
                var vertexDegree = _vertexDegrees[i];

                // Debug.Assert (
                //     0 < vertexDegree.value,
                //     Messages.CircularLayoutVertexDegreeZero
                // );
                if (vertexDegree.value <= 0) {
                    //
                    concole.log (
                        'vertexDegree.value <= 0 occurs, but it\'s not supposed to.'
                    );
                }

                var vertexIndex = vertexDegree.vertexIndex;
                var vertex = _vertices[vertexIndex];

                vertex.position = _circleVertexPositions[i];

                if (maxX < vertex.position.x) { maxX = vertex.position.x; }
                if (maxY < vertex.position.y) { maxY = vertex.position.y; }

                _vertices[vertexIndex] = vertex;
            }

        } else {
            //
            // var groups; //List<List<int>> groups;
            // var levelCount;
            var info = setUpGroups();
            
            var resultIndices = []; // = _circleVertexPositions's indices
            var isClockwise = true;

            for (var i=0; i<info.levelCount; i++) {
                //
                if (i === 0) {
                    // Note:
                    // When i == 0, it's always clockwise and we always choose
                    // the index 0 to process.

                    for (var j=0; j<info.groups.length; j++) {
                        //
                        var item = info.groups[j];
                        var index = 0;
                        var resultIndex = item[index];
                        resultIndices.push(resultIndex);

                        //item.RemoveAt(index);
                        item.splice(index, 1);
                    }

                } else {
                    //
                    // Note:
                    // When i != 0, we randomly select an index to process.

                    //var index = _random.Next(0, info.groups[0].length);
                    var index = xc.RandomHelper.next(0, info.groups[0].length);

                    if (isClockwise === true) {
                        //
                        for (var j=0; j<info.groups.length; j++) {
                            //
                            var item = info.groups[j];

                            processResultIndex(item, index, resultIndices);
                        }

                    } else {
                        //
                        for (var j=info.groups.length-1; 0<=j; j--) {
                            //
                            var item = info.groups[j];

                            processResultIndex(item, index, resultIndices);
                        }
                    }
                }

                isClockwise = !isClockwise;
            }

            // Checks if the result (indices) is valid.
            checkIfResultValid(resultIndices);

            for (var i=0; i<_vertexDegrees.length; i++) {
                //
                var vertexDegree = _vertexDegrees[i];

                // Debug.Assert (
                //     0 < vertexDegree.value,
                //     Messages.CircularLayoutVertexDegreeZero
                // );

                if (vertexDegree.value <= 0) {
                    //
                    concole.log (
                        'vertexDegree.value <= 0 occurs, but it\'s not supposed to.'
                    );
                }

                var vertexIndex = vertexDegree.vertexIndex;
                var resultIndex = resultIndices[i];

                var vertex = _vertices[vertexIndex];

                vertex.position = _circleVertexPositions[resultIndex];

                if (maxX < vertex.position.x) { maxX = vertex.position.x; }
                if (maxY < vertex.position.y) { maxY = vertex.position.y; }

                _vertices[vertexIndex] = vertex;
            }
        }

        // Sets up the unedged vertex positions.
        setUpUnedgedVertexPositions(maxX, maxY);
    };
}

//
// Static constants.
//
CircularLayout.DEFAULT_UNEDGED_VERTEX_SPACING =
    CircularLayoutStyle.DEFAULT_VERTEX_SPACING; // = 150.0

export { CircularLayout };
