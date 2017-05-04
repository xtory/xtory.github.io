// Note:
// [Reference]
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget

// Note:
// In DOM, event 'type' means its 'name', so in this engine, we use event 'name'
// instead 'type'.

//
// Constructor.
//
function EventTargetHelper() {
    // No contents.
}

//
// Static methods.
//
EventTargetHelper.addEventListener = function(target, eventName, eventListener) {
    //
    if (target[EventTargetHelper.EVENT_LISTENER_GROUPS] === undefined) {
        target[EventTargetHelper.EVENT_LISTENER_GROUPS] = {};
    }

    var elGroups = target[EventTargetHelper.EVENT_LISTENER_GROUPS];

    if ((eventName in elGroups) === false) {
        elGroups[eventName] = [];
    }
    
    var elGroup = elGroups[eventName];
    elGroup.push(eventListener);
};

EventTargetHelper.dispatchEvent = function(target, event) {
    //
    if (target[EventTargetHelper.EVENT_LISTENER_GROUPS] === undefined) {
        return;
    }

    var elGroups = target[EventTargetHelper.EVENT_LISTENER_GROUPS];
    if ((event.name in elGroups) === false) {
        return;
    }

    var elGroup = elGroups[event.name];
    event.target = target;

    for (var i=0, l=elGroup.length; i<l; i++) {
        //
        // Note:
        // We use event.target to indicate who fires the event, so here, directly
        // call the callback instead of using call().
        /*
        elGroup[i].call(target, event);
        */
        elGroup[i](event);
        // :Note
    }

    // Test:
    //return !event.isDefaultPrevented;
    // :Test
};

EventTargetHelper.removeEventListener = function(target, eventName, eventListener) {
    //
    if (target[EventTargetHelper.EVENT_LISTENER_GROUPS] === undefined) {
        return;
    }

    var elGroups = target[EventTargetHelper.EVENT_LISTENER_GROUPS];
    if ((eventName in elGroups) === false) {
        return;
    }

    var elGroup = elGroups[eventName];

    for (var i=0, l=elGroup.length; i<l; i++) {
        //
        if (elGroup[i] === eventListener) {
            elGroup.splice(i, 1);
            return;
        }
    }
};

EventTargetHelper.clearEventListeners = function(target) {
    //
    if (target[EventTargetHelper.EVENT_LISTENER_GROUPS] === undefined) {
        return;
    }

    var elGroups = target[EventTargetHelper.EVENT_LISTENER_GROUPS];

    for (var key in elGroups) {
        target[key] = [];
    }

    // Note:
    // We have to set target[...] = {}, not elGroups = {}. Be careful!
    /*
    elGroups = {};
    */
    target[EventTargetHelper.EVENT_LISTENER_GROUPS] = {};
    // :Note
};

//
// Helpers.
//
EventTargetHelper.checkIfHasEventListeners = function(target, eventName) {
    //
    if (target[EventTargetHelper.EVENT_LISTENER_GROUPS] === undefined) {
        return;
    }

    var elGroups = target[EventTargetHelper.EVENT_LISTENER_GROUPS];

    return ((eventName in elGroups) === true) ? true : false;
};

//
// Static constants.
//
EventTargetHelper.EVENT_LISTENER_GROUPS = 'elGroups'; //'eventListenerGroups';

export { EventTargetHelper };
