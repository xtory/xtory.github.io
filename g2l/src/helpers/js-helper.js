//
// Constructor.
//
function JSHelper() {
    // No contents.
}

//
// Static methods.
//
JSHelper.arrayContainsItem = function(array, item) {
    //
    for (var i=0; i<array.length; i++) {
        //
        if (array[i] === item) {
            return true;
        }
    }
    
    return false;
}

JSHelper.arrayRemoveItem = function(array, item) {
    //
    for (var i=0; i<array.length; i++) {
        //
        if (array[i] === item) {
            array.splice(i, 1);
            return true;
        }
    }
    
    return false;
}

Object.freeze(JSHelper);

export { JSHelper };
