// Note:
// Provides requestAnimationFrame in a cross browser way.
// @author paulirish / http://paulirish.com/

if (window !== undefined &&
    window.requestAnimationFrame === undefined) {
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
