// Note:
// See the note in the beginning of EventTargetHelper constructor function.

//
// Constructor.
//
function Event(_name) {
    this.target = undefined; // which will be assigned in EventTargetHelper.dispatchEvent()
    this.name = _name;
}

export { Event };
