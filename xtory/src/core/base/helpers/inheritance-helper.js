//
// Constructor.
//
function InheritanceHelper() {
    // No contents.
}

InheritanceHelper.inherit = function(subobject, superobject) {
    //
    var helper = function() {
        //
        // No contents.
    };

    helper.prototype = superobject.prototype;
    
    subobject.prototype = new helper();
};

export { InheritanceHelper };
