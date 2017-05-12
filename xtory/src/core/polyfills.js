// Note:
// Scripts could be run in web browsers or others (such as: Node.js). If they're
// not running in web browsers (and hence 'window' doesn't exist), using 'window'
// causes a reference error, so we have to check it before testing window-related
// stuff.

// Note:
// But we use 'Jest' for our unit tests and the default environment in Jest is a
// browser-like environment, that is, we don't have to check if the scripts are
// running in a web browser or not.
/*
var isRunningInWebBrowser = (
    (typeof(window) !== 'undefined') ?
    true :
    false
);

if (isRunningInWebBrowser === true) {
    //
    if (window.requestAnimationFrame === undefined) {
        //
        ...
    }
}
*/

//
// Note:
// Provides requestAnimationFrame in a cross browser way.
// @author paulirish / http://paulirish.com/

if (window.requestAnimationFrame === undefined) {
    //
    window.requestAnimationFrame = (function() {
        //
        return (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (
                callback, // function frameRequestCallback
                element   // DOMElement element
            ){
                window.setTimeout(callback, 1000/60);
            }
        );
    })();
}
