// Note:
// See the note in the beginning of EventHelper constructor function.

//
// Constructor.
//
function Event(_name) {
    this.target = undefined; // which will be assigned in EventHelper.dispatchEvent()
    this.name = _name;
}

export { Event };
