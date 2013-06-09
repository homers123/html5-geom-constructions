/*jslint browser: true*/
/*jslint devel: true */
/*jslint plusplus: true */
/*global requestAnimFrame, Matrix3x3, Vector2d*/

window.requestAnimFrame = (function (callback) {
    'use strict';
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}());

function DrawStyle() {
    'use strict';
    
    this.strokeStyle =  '#000000';
    this.fillStyle = '#000000';
    this.filled = false;
    this.lineWidth = 1;
    this.lineDash = [];
    this.lineCap = 'butt';
    this.lineJoin = 'miter';
}
DrawStyle.copy = function (other) {
    'use strict';
    var cpy = new DrawStyle();
    cpy.strokeStyle = other.strokeStyle;
    cpy.fillStyle = other.fillStyle;
    cpy.filled = other.filled;
    cpy.lineWidth = other.lineWidth;
    cpy.lineDash = other.lineDash;
    cpy.lineCap = other.lineCap;
    cpy.lineCap = other.lineCap;
    return cpy;
};

function DrawObject(s, drawcb) {
    'use strict';
    var style = DrawStyle.copy(s),
        drawcallback = drawcb;
    
    /*private functions*/
    function setStyle(ctx) {
        ctx.strokeStyle = style.strokeStyle;
        ctx.fillStyle = style.fillStyle;
        ctx.lineWidth = style.lineWidth;
        ctx.lineCap = style.lineCap;
        ctx.lineJoin = style.lineJoin;
    }
    
    /* public functions */
    this.draw = function (ctx) {
        setStyle(ctx);
        drawcallback();
    };
}

function CanvasViewer(container_element) {
    'use strict';
    
    /* private variables */
    var parent_element = container_element,
        canvas_front = null,    // the front canvas
        canvas_back = null,     // the back canvas
        ctx = null,             // the back canvas context
        ctx_front = null,       // the front canvas context
        canvas_width = 0,
        canvas_half_width = 0,
        canvas_height = 0,
        canvas_half_height = 0,
        viewmatrix = new Matrix3x3(),
        modelmatrix = new Matrix3x3(),
        current_coordinate_pos = Vector2d.zero(),
        drawObjects = [];
    
    /* private functions */
    function getClientPos(evt) {
        var rect = canvas_front.getBoundingClientRect();
        return new Vector2d(evt.clientX - rect.left, evt.clientY - rect.top);
    }
    
    function drawCoordinatePos() {
        var text = 'x=' + current_coordinate_pos.x + ', y=' + current_coordinate_pos.y;
        ctx.font = '12px Arial';
        ctx.save();
        ctx.scale(1.0, -1.0);
        ctx.fillStyle = '#000000';
        ctx.fillText(text, -canvas_half_width + 5, canvas_half_height - 5);
        ctx.restore();
    }
    
    function onMouseMove(evt) {
        var pos = getClientPos(evt),
            translation = viewmatrix.getTranslate();
        current_coordinate_pos.x = pos.x - translation.x;
        current_coordinate_pos.y = -pos.y + translation.y;
            
        //console.log('position: ' + pos.toString());
        //console.log('coordinate position: ' + current_coordinate_pos.toString());
    }
    
    function addEventListeners() {
        if (canvas_front.addEventListener) {
            canvas_front.addEventListener('mousemove', onMouseMove, false);
        } else {
            canvas_front.attachEvent('onmousemove', onMouseMove);
        }
    }
    
    function drawCoordinateAxis() {
        ctx.lineWidth = 1;
        ctx.font = '12px Arial';
        
        // x axis
        ctx.beginPath();
        ctx.strokeStyle = '#FF0000';
        ctx.moveTo(-canvas_half_width + 25, 0);
        ctx.lineTo(canvas_half_width - 25, 0);
        ctx.stroke();
        
        // x axis arrow
        ctx.beginPath();
        ctx.fillStyle = '#FF0000';
        ctx.moveTo(canvas_half_width - 25, -5);
        ctx.lineTo(canvas_half_width - 25, 5);
        ctx.lineTo(canvas_half_width - 15, 0);
        ctx.lineTo(canvas_half_width - 25, -5);
        ctx.fill();
        
        // x axis caption
        ctx.save();
        ctx.scale(1.0, -1.0);
        ctx.fillText('+x', canvas_half_width - 25, 15);
        ctx.restore();
        
        // y axis
        ctx.beginPath();
        ctx.strokeStyle = '#00FF00';
        ctx.moveTo(0, -canvas_half_height + 25);
        ctx.lineTo(0, canvas_half_height - 25);
        ctx.stroke();
        
        // y axis arrow
        ctx.beginPath();
        ctx.fillStyle = '#00FF00';
        ctx.moveTo(-5, canvas_half_height - 25);
        ctx.lineTo(5, canvas_half_height - 25);
        ctx.lineTo(0, canvas_half_height - 15);
        ctx.lineTo(-5, canvas_half_height - 25);
        ctx.fill();
        
        // y axis caption
        ctx.save();
        ctx.scale(1.0, -1.0);
        ctx.fillText('+y', 15, -canvas_half_height + 25);
        ctx.restore();
    }
    
    function drawBackground() {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.rect(-canvas_half_width, -canvas_half_height, canvas_width, canvas_height);
        ctx.stroke();
    }
    
    function clear(ctx_clear, x, y, w, h) {
        // save current transformation matrix
        ctx_clear.save();
        // use identity matrix when clearing
        ctx_clear.setTransform(1, 0, 0, 1, 0, 0);
        // clear the context
        ctx_clear.clearRect(x, y, w, h);
        // restore the context transformation matrix
        ctx_clear.restore();
    }
    
    function swapCanvas() {
        ctx_front.drawImage(canvas_back, 0, 0);
    }
    
    function draw() {
        // clear both contexts
        clear(ctx, 0, 0, canvas_width, canvas_height);
        clear(ctx_front, 0, 0, canvas_width, canvas_height);
        
        // setup view matrix
        viewmatrix.setContextTransform(ctx);
        
        // draw
        drawBackground();
        drawCoordinateAxis();
        drawCoordinatePos();
        
        // draw objects
        var i = 0;
        for (i = 0; i < drawObjects.length; i++) {
            drawObjects[i].draw(ctx);
        }
        
        // swap
        swapCanvas();
        
        requestAnimFrame(function () {
            draw();
        });
    }
    
    function resize(width, height) {
        canvas_width = parent_element.offsetWidth;
        canvas_height = parent_element.offsetHeight;
        canvas_half_width = canvas_width / 2.0;
        canvas_half_height = canvas_height / 2.0;
        
        canvas_front.setAttribute('width', width);
        canvas_front.setAttribute('height', height);
        
        canvas_back.setAttribute('width', width);
        canvas_back.setAttribute('height', height);
        
        viewmatrix.identity();
        // translate viewmatrix to center of canvas
        // to have (0, 0) in the center of the canvas view
        viewmatrix.translate(canvas_width / 2, canvas_height / 2);
        
        // scale the viewmatrix by x = 1.0 and y = -1.0
        // to have the y axis flipped from negative bottom to positive top
        viewmatrix.scale(1.0, -1.0);
    }
    
    function init() {
        // create visible canvas
        canvas_front = document.createElement('canvas');
        canvas_front.setAttribute('id', 'visible_canvas');
        canvas_front.setAttribute('class', 'canvas');
        ctx_front = canvas_front.getContext('2d');
        parent_element.appendChild(canvas_front);
        
        
        // create back canvas
        canvas_back = document.createElement('canvas');
        canvas_back.setAttribute('id', 'offscreen_canvas');
        ctx = canvas_back.getContext('2d');
        
        resize(parent_element.offsetWidth, parent_element.offsetHeight);
        
        addEventListeners();
    }
    

    /* public functions */
    this.run = function () {
        init();
        draw();
    };
    
    
    this.addCircle = function (middlepoint, radius, style) {
        style = (typeof style === "undefined") ? new DrawStyle() : style;
        drawObjects.push(new DrawObject(style, function () {
            ctx.beginPath();
            ctx.arc(middlepoint.x, middlepoint.y, radius, 0, 2 * Math.PI);
            if (style.filled) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }));
    };
}
