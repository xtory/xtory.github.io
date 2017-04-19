//
// Constructor.
//
function ArrayHelper() {
    // No contents.
}

//
// Static methods.
//
ArrayHelper.contains = function(array, item) {
    //
    for (var i=0; i<array.length; i++) {
        //
        if (array[i] === item) {
            return true;
        }
    }
    
    return false;
};

ArrayHelper.remove = function(array, item) {
    //
    for (var i=0; i<array.length; i++) {
        //
        if (array[i] === item) {
            array.splice(i, 1);
            return true;
        }
    }
    
    return false;
};

Object.freeze(ArrayHelper);

export { ArrayHelper };
