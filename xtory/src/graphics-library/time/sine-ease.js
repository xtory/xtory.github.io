import { EaseMode }   from './ease-mode';
import { Stopwatch }  from './stopwatch';
import { MathHelper } from '../math/helpers/math-helper';

//
// Constructor.
//
function SineEase(_easeMode, _duration, _isLooped) {
    //
    var _self;
    var _startAngle;
    var _finishAngle;
    var _stopwatch;

    try {
        //
        _self = this;
        
        switch (_easeMode) {
            //
            case EaseMode.EASE_IN: {
                //
                _startAngle  = -MathHelper.PI_OVER_TWO;
                _finishAngle =  0;
                break;
            }

            case EaseMode.EASE_OUT: {
                //
                _startAngle  = 0;
                _finishAngle = MathHelper.PI_OVER_TWO;
                break;
            }

            case EaseMode.EASE_IN_OUT: {
                //
                _startAngle  = -MathHelper.PI_OVER_TWO;
                _finishAngle =  MathHelper.PI_OVER_TWO;
                break;
            }

            default: {
                throw 'A not-supported exception raised.';
            }
        }

        // Creates the stopwatch. But don't start it immediately.
        _stopwatch = new Stopwatch();

    } catch (e) {
        //
        console.log('gorilla.graphicsLibrary.SineEase: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'easeMode', {
        get: function() { return _easeMode; }
    });

    Object.defineProperty(_self, 'duration', {
        get: function() { return _duration; }
    });

    Object.defineProperty(_self, 'sineOfStartAngle', {
        get: function() { return Math.sin(_startAngle); }
    });

    Object.defineProperty(_self, 'sineOfCurrentAngle', {
        //
        get: function() {
            //
            var angleOffset = _finishAngle - _startAngle;

            return Math.sin (
                _startAngle +
                angleOffset * _self.ratioOfCurrentToTotalTimeOffset
            );
        }
    });

    Object.defineProperty(_self, 'sineOfFinishAngle', {
        get: function() { return Math.sin(_finishAngle); }
    });

    /// <summary>
    /// Ratio of 'current time offset' to 'total time offset (that is, the
    /// duration)'. For instance, the current time offset = 500 (in milli-
    /// seconds), the duration = 2000 (in milliseconds) => Ratio = 500 / 2000
    /// = 0.25
    /// </summary>
    Object.defineProperty(_self, 'ratioOfCurrentToTotalTimeOffset', {
        //
        get: function() {
            //
            if (_isLooped === false) {
                //
                if (_self.isFinished === true) {
                    //
                    return 1;

                } else { // _self.isFinished === false
                    //
                    return _stopwatch.elapsedMilliseconds / _duration;
                }

            } else { // _isLooped === true
                //
                var elapsedMilliseconds =
                    _stopwatch.elapsedMilliseconds % _duration;

                return elapsedMilliseconds / _duration;
            }
        }
    });

    /// <summary>
    /// Ratio of 'current sine-of-angle offset' to 'total sine-of-angle offset'.
    /// For instance, the current sine-of-angle offset = 0.125, the total sine-
    /// of-angle offset = 1 => Ratio = 0.125 / 1 = 0.125
    /// </summary>
    Object.defineProperty(_self, 'ratioOfCurrentToTotalSineOfAngleOffset', {
        //
        get: function() {
            //
            var currentSineOfAngleOffset =
                _self.sineOfCurrentAngle - _self.sineOfStartAngle;

            var totalSineOfAngleOffset =
                _self.sineOfFinishAngle - _self.sineOfStartAngle;

            return currentSineOfAngleOffset / totalSineOfAngleOffset;
        }
    });

    Object.defineProperty(_self, 'isRunning', {
        get: function() { return _stopwatch.isRunning; }
    });

    Object.defineProperty(_self, 'isFinished', {
        //
        get: function() {
            //
            if (_isLooped === true) {
                return false;
            }

            var isFinished = (
                (_duration <= _stopwatch.elapsedMilliseconds) ?
                true :
                false
            );

            if (isFinished === true) {
                _stopwatch.stop();
            }

            return isFinished;
        }
    });

    //
    // Privileged methods.
    //
    this.start = function() {
        //
        if (_stopwatch.isRunning === true) {
            return;
        }

        _stopwatch.start();
    }

    this.pause = function() {
        //
        if (_stopwatch.isRunning === false) {
            return;
        }

        // Note:
        // Stopwatch's stop() is like media player's pause(). After calling
        // Stopwatch's start(), the playing continues.

        _stopwatch.stop();
    }

    this.resume = function() {
        //
        if (_stopwatch.isRunning === true) {
            return;
        }

        _stopwatch.start();
    }

    this.stop = function() {
        //
        // Note:
        // Stopwatch's reset() is like media player's stop(). After calling
        // Stopwatch.reset(), everything resets, and this is what we want for
        // SineEase's stop().

        _stopwatch.reset();
    }
}

export { SineEase };
