// *Note*
// [Reference]
// Photoshop CS2 Swatches.

define ([
    "./color"
], function (
    Color
){
    "use strict";
    
    //
    // Constructor.
    //
    function Colors() {
        // No contents.
    }

    //
    // Prototype.
    //
    Colors.prototype = {
        // No contents.
    };

    //
    // Constants.
    //

    Object.defineProperty(Colors, "BLACK", {
        get: function() { return new Color(0, 0, 0, 1); }
    });

    Object.defineProperty(Colors, "WHITE", {
        get: function() { return new Color(1, 1, 1, 1); }
    });

    Object.defineProperty(Colors, "TRANSPARENT", {
        get: function() { return new Color(1, 1, 1, 0); }
    });

    Object.defineProperty(Colors, "DEFAULT_BACKGROUND", {
        get: function() { return new Color(64/255, 64/255, 64/255, 1); } // change back to Color(32/255, 32/255, 32/255, 1) later.
    });    

    // There's no PHOTOSHOP_PASTEL_RED (cuz it's ugly), use PINK instead.
    Object.defineProperty(Colors, "PINK", {
        get: function() { return new Color(255/255, 192/255, 203/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_RED", {
        get: function() { return new Color(157/255, 10/255, 14/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_RED_ORANGE", {
        get: function() { return new Color(249/255, 173/255, 129/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_RED_ORANGE", {
        get: function() { return new Color(160/255, 65/255, 13/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_YELLOW_ORANGE", {
        get: function() { return new Color(253/255, 198/255, 137/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_YELLOW_ORANGE", {
        get: function() { return new Color(163/255, 97/255, 9/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_YELLOW", {
        get: function() { return new Color(255/255, 247/255, 153/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_YELLOW", {
        get: function() { return new Color(171/255, 160/255, 0/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_PEA_GREEN", {
        get: function() { return new Color(196/255, 223/255, 155/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_PEA_GREEN", {
        get: function() { return new Color(89/255, 133/255, 39/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_YELLOW_GREEN", {
        get: function() { return new Color(162/255, 211/255, 156/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_YELLOW_GREEN", {
        get: function() { return new Color(25/255, 122/255, 48/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_GREEN", {
        get: function() { return new Color(130/255, 202/255, 156/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_GREEN", {
        get: function() { return new Color(0/255, 114/255, 54/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_GREEN_CYAN", {
        get: function() { return new Color(122/255, 204/255, 200/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_GREEN_CYAN", {
        get: function() { return new Color(0/255, 115/255, 106/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_CYAN", {
        get: function() { return new Color(109/255, 207/255, 246/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_CYAN", {
        get: function() { return new Color(0/255, 118/255, 163/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_CYAN_BLUE", {
        get: function() { return new Color(125/255, 167/255, 216/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_CYAN_BLUE", {
        get: function() { return new Color(0/255, 74/255, 128/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_BLUE", {
        get: function() { return new Color(131/255, 147/255, 202/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_BLUE", {
        get: function() { return new Color(0/255, 52/255, 113/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_BLUE_VIOLET", {
        get: function() { return new Color(135/255, 129/255, 189/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_BLUE_VIOLET", {
        get: function() { return new Color(27/255, 20/255, 100/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_VIOLET", {
        get: function() { return new Color(161/255, 134/255, 190/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_VIOLET", {
        get: function() { return new Color(68/255, 14/255, 98/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_VIOLET_MAGENTA", {
        get: function() { return new Color(188/255, 140/255, 191/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_VIOLET_MAGENTA", {
        get: function() { return new Color(98/255, 4/255, 96/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_MAGENTA", {
        get: function() { return new Color(244/255, 154/255, 193/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_MAGENTA", {
        get: function() { return new Color(158/255, 0/255, 93/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PASTEL_MAGENTA_RED", {
        get: function() { return new Color(245/255, 152/255, 157/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_MAGENTA_RED", {
        get: function() { return new Color(157/255, 0/255, 57/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PALE_COOL_BROWN", {
        get: function() { return new Color(199/255, 178/255, 153/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_COOL_BROWN", {
        get: function() { return new Color(83/255, 71/255, 65/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_PALE_WARM_BROWN", {
        get: function() { return new Color(198/255, 156/255, 109/255, 1); }
    });

    Object.defineProperty(Colors, "PHOTOSHOP_DARK_WARM_BROWN", {
        get: function() { return new Color(117/255, 76/255, 36/255, 1); }
    });

    return Colors;
});
