//
// Constructor.
//
function MainStateMovingEndsToResult (
    _worldImages,
    _worldLineSegments,
    _ends,
    _links,
    _layout,
    _finishingCallback
){
    var g2l = gorilla.graphicsLibrary;

    MainState.call(this);

    var _self;
    var _sineEase;
    var _worldImagePositions;

    try {
        //
        _self = this;

        setUpWorldImagesPositions();

        _sineEase = new g2l.SineEase(g2l.EaseMode.EASE_OUT, 1500, false);
        _sineEase.start();

    } catch (e) {
        //
        console.log('MainStateMovingEndsToResult: ', e);

        throw e;
    }

    Object.defineProperty(_self, 'sineEase', {
        get: function() { return _sineEase; }
    });

    Object.defineProperty(_self, 'worldImages', {
        get: function() { return _worldImages; }
    });

    Object.defineProperty(_self, 'worldLineSegments', {
        get: function() { return _worldLineSegments; }
    });

    Object.defineProperty(_self, 'ends', {
        get: function() { return _ends; }
    });

    Object.defineProperty(_self, 'links', {
        get: function() { return _links; }
    });

    Object.defineProperty(_self, 'layout', {
        get: function() { return _layout; }
    });

    Object.defineProperty(_self, 'finishingCallback', {
        get: function() { return _finishingCallback; }
    });

    Object.defineProperty(_self, 'worldImagePositions', {
        get: function() { return _worldImagePositions; }
    });

    //
    // Private methods.
    //
    function setUpWorldImagesPositions() {
        //
        _worldImagePositions = {
            start: [],
            finish: []
        };

        for (var i=0; i<_worldImages.length; i++) {
            //
            _worldImagePositions.start.push (
                _worldImages[i].centerPosition
            );
        }

        for (var i=0; i<_layout.graphVertexCount; i++) {
            //
            _worldImagePositions.finish.push (
                _layout.getGraphVertexAt(i).position
            );
        }
    }
}

gorilla.graphicsLibrary.JSHelper.inherit(MainStateMovingEndsToResult, MainState);

//
// Prototype.
//
MainStateMovingEndsToResult.prototype.update = function() {
    //
    var g2l = gorilla.graphicsLibrary;

    var worldImages = this.worldImages;
    var worldLineSegments = this.worldLineSegments;
    var ends = this.ends;
    var links = this.links;
    var layout = this.layout;
    var worldImagePositions = this.worldImagePositions;
    var sineEase = this.sineEase;

    var isFinished = sineEase.isFinished;
    var ratio = sineEase.ratioOfCurrentToTotalSineOfAngleOffset;

    if (isFinished === false) {
        //
        for (var i=0; i<ends.length; i++) {
            //
            var item = layout.getGraphVertexAt(i);

            var p1 = worldImagePositions.start[i];
            var p2 = worldImagePositions.finish[i];

            worldImages[i].centerPosition = g2l.Vector2D.addVectors (
                p1,
                g2l.Vector2D.multiplyVectorByScalar (
                    g2l.Vector2D.subtractVectors(p2, p1),
                    ratio
                )
            );            
        }

        for (var i=0; i<links.length; i++) {
            //
            var item = links[i];

            var end1 = worldImages[item.sourceGraphVertexIndex];
            var end2 = worldImages[item.destinationGraphVertexIndex];

            var worldLineSegment = worldLineSegments[i];
            worldLineSegment.startPosition = end1.centerPosition;
            worldLineSegment.finishPosition = end2.centerPosition;
        }

    } else {
        //
        //_main.state = new MainStateNormal(_main);
        if (this.finishingCallback !== undefined) {
            this.finishingCallback();
        }
    }
};
