/*global Vector2d*/
function Matrix3x3() {
    'use strict';
    /* private variables */
    var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    
    
    /* privileged functions */
    this.toString = function () {
        var str = '';
        str += m[0] + '  ' + m[1] + '  ' + m[2] + '\n';
        str += m[3] + '  ' + m[4] + '  ' + m[5] + '\n';
        str += m[6] + '  ' + m[7] + '  ' + m[8] + '\n';
        return str;
    };
    
    this.identity = function () {
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 1;
        m[5] = 0;
        m[6] = 0;
        m[7] = 0;
        m[8] = 1;
    };

    this.scale = function (sx, sy) {
        m[0] *= sx;
        m[4] *= sy;
    };
    
    this.getScale = function () {
        return new Vector2d(m[0], m[4]);
    };
    
    this.translate = function (tx, ty) {
        m[2] += tx;
        m[5] += ty;
    };
    
    this.getTranslate = function () {
        return new Vector2d(m[2], m[5]);
    };
    
    this.setContextTransform = function (ctx) {
        ctx.setTransform(
            m[0],
            m[1],
            m[3],
            m[4],
            m[2],
            m[5]
        );
    };
    this.multVector = function (vec) {
        var x = m[0] * vec.x + m[1] * vec.y + m[2],
            y = m[3] * vec.x + m[4] * vec.y + m[5];
        return new Vector2d(x, y);
    };
    
    this.multMatrix = function (other) {
        /*
         * build up like:
         *     --               --
         *    |                   |
         *    |  m11   m21   m31  |
         *    |                   |
         *    |  m12   m22   m32  |
         *    |                   |
         *    |  m13   m23   m33  |
         *    |                   |
         *     --               --
         */
        var a11 = m[0],
            a21 = m[1],
            a31 = m[2],
            a12 = m[3],
            a22 = m[4],
            a32 = m[5],
            a13 = m[6],
            a23 = m[7],
            a33 = m[8],
        
            b11 = other.m[0],
            b21 = other.m[1],
            b31 = other.m[2],
            b12 = other.m[3],
            b22 = other.m[4],
            b32 = other.m[5],
            b13 = other.m[6],
            b23 = other.m[7],
            b33 = other.m[8],
        
            r = new Matrix3x3();
        
        r.m[0] = a11 * b11 + a21 * b12 + a31 * b13;
        r.m[1] = a11 * b21 + a21 * b22 + a31 * b23;
        r.m[2] = a11 * b31 + a21 * b32 + a31 * b33;
        r.m[3] = a12 * b11 + a22 * b12 + a32 * b13;
        r.m[4] = a12 * b21 + a22 * b22 + a32 * b23;
        r.m[5] = a12 * b31 + a22 * b32 + a32 * b33;
        r.m[6] = a13 * b11 + a23 * b12 + a33 * b13;
        r.m[7] = a13 * b21 + a23 * b22 + a33 * b23;
        r.m[8] = a13 * b31 + a23 * b32 + a33 * b33;
        
        return r;
    };
}
