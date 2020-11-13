function Graph(options) {
    options = options || {};
    var id = options.id;
    var width = options.width || 300;
    var height = options.height || 300;
    var WINDOW = options.WINDOW || {};
    var callbacks = options.callbacks;
    var canvas;

    if (id) {
        canvas = document.getElementById(id);
    } else {
        canvas = document.createElement('canvas');
        document.querySelector('body').appendChild(canvas);
    }

    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');
    canvas.addEventListener('wheel', callbacks.wheel);
    canvas.addEventListener('mouseup', callbacks.mouseup);
    canvas.addEventListener('mousedown', callbacks.mousedown);
    canvas.addEventListener('mousemove', callbacks.mousemove);
    canvas.addEventListener('mouseleave', callbacks.mouseleave);

    function xs(x) {
        return (x - WINDOW.LEFT) / WINDOW.WIDTH * canvas.width;
    }

    function ys(y) {
        return canvas.height - (y - WINDOW.BOTTOM) / WINDOW.HEIGHT * canvas.height;
    }

    this.sx = function (x) {
        return x * WINDOW.WIDTH / canvas.width;
    }

    this.sy = function (y) {
        return -y * WINDOW.HEIGHT / canvas.height;
    }

    this.clear = function () {
        context.fillStyle = '#d9d9d9';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    this.point = function (x, y, size, color) {
        context.beginPath();
        context.strokeStyle = color || '#F00';
        context.arc(xs(x), ys(y), size || 2, 0, 2 * Math.PI);
        context.stroke();
    }

    this.line = function (x1, y1, x2, y2, color, width) {
        context.beginPath();
        context.strokeStyle = color || 'black';
        context.lineWidth = width || 2;
        context.moveTo(xs(x1), ys(y1));
        context.lineTo(xs(x2), ys(y2));
        context.stroke();
    }

    this.printFuncNames = function (name, x, f, color) {
        context.fillStyle = color || 'F00';
        context.font = "italic 12pt Arial";
        y = f(x) + 1.5;
        context.fillText(name, xs(x), ys(y));
    }

    this.number = function (text, x, y, axis) {
        context.fillStyle = "#000";
        context.font = "italic 11pt Arial";
        if (axis == 'x') {
            context.fillText(text, xs(x - 0.25), ys(y - 0.7));
        } else if (axis == 'y') {
            context.fillText(text, xs(x - 0.7), ys(y - 0.15));
        } else {
            context.fillText(text, xs(x + 0.1), ys(y - 0.5));
        }
    }
}