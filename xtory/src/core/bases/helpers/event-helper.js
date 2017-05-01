// Note:
// [Reference]
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget

// Note:
// In DOM, event 'type' means its 'name', so in this engine, we use event 'name'
// instead 'type'.

//
// Constructor.
//
function EventHelper() {
    // No contents.
}

//
// Static methods.
//
EventHelper.addEventListener = function(target, eventName, eventListener) {
    //
    if (target.eventListeners === undefined) {
        target.eventListeners = {};
    }

    if ((eventName in target.eventListeners) === false) {
        target.eventListeners[eventName] = [];
    }
    
    target.eventListeners[eventName].push(eventListener);
};

EventHelper.dispatchEvent = function(target, event) {
    //
    // Note:
    // See the note in the beginning of this constructor function.
    //
    if ((event.name in target.eventListeners) === false) {
        return;
    }

    var stack = target.eventListeners[event.name];
    event.target = target;

    for (var i=0, l=stack.length; i<l; i++) {
        //
        // Note:
        // We use event.target to indicate who fires the event, so here, directly
        // call the callback instead of using call().
        /*
        stack[i].call(target, event);
        */
        stack[i](event);
        // :Test
    }

    // Test:
    //return !event.isDefaultPrevented;
    // :Test
};

EventHelper.removeEventListener = function(target, eventName, eventListener) {
    //
    if ((eventName in target.eventListeners) === false) {
        return;
    }

    var stack = target.eventListeners[eventName];

    for (var i=0, l=stack.length; i<l; i++) {
        //
        if (stack[i] === eventListener) {
            stack.splice(i, 1);
            return;
        }
    }
};

EventHelper.clearEventListeners = function(target) {
    //
    if (target.eventListeners === undefined) {
        return;
    }

    for (var key in target.eventListeners) {
        target[key] = [];
    }

    target.eventListeners = {};
};

//
// Helpers.
//
EventHelper.checkIfHasEventListeners = function(target, eventName) {
    //
    if (target.eventListeners === undefined) {
        return false;
    }

    return ((eventName in target.eventListeners) === true) ? true : false;
};

export { EventHelper };
