function Vector2d(x, y) {
    'use strict';
    
    /* public variables */
    this.x = x;
    this.y = y;
    
    
    /* privileged functions */
    this.toString = function () {
        return '[' + this.x + ', ' + this.y + ']';
    };
    
    this.add = function (other) {
        this.x += other.x;
        this.y += other.y;
    };
    
    this.sub = function (other) {
        this.x -= other.x;
        this.y -= other.y;
    };
    
    this.mul = function (other) {
        this.x *= other.x;
        this.y *= other.y;
    };
    
    this.div = function (other) {
        this.x /= other.x;
        this.y /= other.y;
    };
}

Vector2d.zero = function () {
    'use strict';
    return new Vector2d(0.0, 0.0);
};