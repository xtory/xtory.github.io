// Note:
// Adapted from
// 'fps.js' by greggman.

function Fps() {
    //
    var _self;
    var _totalTime;
    var _timeTable;
    var _timeTableIndex;
    var _then; // in milliseconds.
    var _average;

    try {
        //
        _self = this;

        // total time spent for last N frames.
        _totalTime = Fps.FRAME_COUNT_TO_AVERAGE;

        // elapsed time for last N frames.
        _timeTable = [];

        // where to record next elapsed time.
        _timeTableIndex = 0;

        _then = 0;

        _average = 0;

        // Initialize the elapsed time history table.
        for (var i=0; i<Fps.FRAME_COUNT_TO_AVERAGE; i++) {
            _timeTable[i] = 1.0;
        }

    } catch (e) {
        //
        console.log('xtory.core.Fps: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'average', {
        get: function() { return _average; }
    });
    
    //
    // Privileged methods.
    //
    this.update = function() {
        //
        var now = (new Date()).getTime(); // in milliseconds.

        var elapsedTime = // in seconds.
            (now - _then) * 0.001;

        _then = now;

        // Keep the total time and total active time for the last N frames.
        _totalTime += elapsedTime - _timeTable[_timeTableIndex];

        // Save off the elapsed time for this frame so we can subtract it later.
        _timeTable[_timeTableIndex] = elapsedTime;

        // Wrap the place to store the next time sample.
        _timeTableIndex++;
        if (_timeTableIndex === Fps.FRAME_COUNT_TO_AVERAGE) {
            _timeTableIndex = 0;
        }

        _average = Math.floor (
            (1.0 / (_totalTime / Fps.FRAME_COUNT_TO_AVERAGE)) + 0.5
        );
    };    
}

//
// Static constants.
//
Fps.FRAME_COUNT_TO_AVERAGE = 16;

export { Fps };
