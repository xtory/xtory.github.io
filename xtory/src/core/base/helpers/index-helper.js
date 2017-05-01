//
// Constructor.
//
function IndexHelper() {
    // No contents.
}

IndexHelper.isIndexValid = function(itemCount, index) {
    //
    if (index < 0 ||
        itemCount - 1 < index) {
        //
        return false;

    } else {
        //
        return true;
    }
}

export { IndexHelper };
