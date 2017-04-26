//
// Constructor.
//
function JSHelper() {
    // No contents.
}

JSHelper.inherit = function(subobject, superobject) {
    //
    var helper = function() {
        //
        // No contents.
    };

    helper.prototype = superobject.prototype;
    
    subobject.prototype = new helper();
};

export { JSHelper };
