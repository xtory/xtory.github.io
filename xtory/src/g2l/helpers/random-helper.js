//
// Constructor.
//
function RandomHelper() {
    // No contents.
}

RandomHelper.next = function (
    min, // which is an integer.
    max  // which is an integer.
){
    // Temp: Not tested yet!!!!!
    
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor((max - min) * Math.random()) + min;
}

export { RandomHelper };
