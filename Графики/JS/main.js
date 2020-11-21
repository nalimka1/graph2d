var funcs = [];

window.onload = function () {
    var WINDOW = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20
    };

    var graph = new Graph({
        id: 'canvas',
        width: 800,
        height: 800,
        WINDOW: WINDOW,
        callbacks: {
            wheel,
            mouseup,
            mousedown,
            mousemove,
            mouseleave
        }
    });

    var ui = new UI({
        callbacks: {
            enterFunction,
            delFunction,
            enterColor,
            enterWidth,
            setDerivative
        }
    });

    var zoomStep = 0.5;
    var canScroll = false;
    var mouseX = 0;

    function printFunction(f, color, width) {
        var x = WINDOW.LEFT;
        var dx = WINDOW.WIDTH / 1000;
        while (x < WINDOW.WIDTH + WINDOW.LEFT) {
            try {
                graph.line(x, f(x), x + dx, f(x + dx), color, width);
            } catch (e) { }
            x += dx;
        }
    }
    // Создание функций
    function enterFunction(f, num) {
        funcs[num] = {
            f,
            color: 'red',
            width: 2
        }
        render();
    }

    function enterColor(f, num) {
        funcs[num].color = f;
        render();
    }


    function enterWidth(f, num) {
        funcs[num].width = f;
        render();
    }

    function delFunction(num) {
        funcs[num] = null;
        render();
    }



    function printOXY() {
        var size = 0.1;
        // Ox
        graph.line(WINDOW.LEFT, 0, WINDOW.WIDTH + WINDOW.LEFT, 0, '#000', 1);
        // Oy
        graph.line(0, WINDOW.BOTTOM, 0, WINDOW.HEIGHT + WINDOW.BOTTOM, '#000', 1);
        // Ox стрелка
        graph.line(WINDOW.WIDTH + WINDOW.LEFT, 0, WINDOW.WIDTH + WINDOW.LEFT - 1 / 2, size, '#000', 1);
        graph.line(WINDOW.WIDTH + WINDOW.LEFT, 0, WINDOW.WIDTH + WINDOW.LEFT - 1 / 2, -size, '#000', 1);
        // Oy стрелка
        graph.line(0, WINDOW.HEIGHT + WINDOW.BOTTOM, size, WINDOW.HEIGHT + WINDOW.BOTTOM - 1 / 2, '#000', 1);
        graph.line(0, WINDOW.HEIGHT + WINDOW.BOTTOM, -size, WINDOW.HEIGHT + WINDOW.BOTTOM - 1 / 2, '#000', 1);

        // чёрточки OX
        for (var i = 1; i < WINDOW.WIDTH + WINDOW.LEFT; i++) {
            graph.line(i, WINDOW.HEIGHT, i, WINDOW.BOTTOM, '#bbb', 1);
            if (i % 5 == 0) {
                graph.line(i, -size * 2, i, size * 2, '#000', 2);
            } else {
                graph.line(i, -size, i, size, '#000', 1);
            }
        }
        for (var i = -1; i > WINDOW.LEFT; i--) {
            graph.line(i, WINDOW.HEIGHT, i, WINDOW.BOTTOM, '#bbb', 1);
            if (i % -5 == 0) {
                graph.line(i, -size * 2, i, size * 2, '#000', 2);
            } else {
                graph.line(i, -size, i, size, '#000', 1);
            }
        }
        //чёрточки OY
        for (var i = 1; i < WINDOW.HEIGHT + WINDOW.BOTTOM; i++) {
            graph.line(WINDOW.LEFT, i, WINDOW.WIDTH, i, '#bbb', 1);
            if (i % 5 == 0) {
                graph.line(-size * 2, i, size * 2, i, '#000', 2);
            } else {
                graph.line(-size, i, size, i, '#000', 1);
            }
        }
        for (var i = -1; i > WINDOW.BOTTOM; i--) {
            graph.line(WINDOW.LEFT, i, WINDOW.WIDTH, i, '#bbb', 1);
            if (i % -5 == 0) {
                graph.line(-size * 2, i, size * 2, i, '#000', 2);
            } else {
                graph.line(-size, i, size, i, '#000', 1);
            }
        }
    }

    function wheel(event) {
        var delta = (event.wheelDelta > 0) ? - zoomStep : zoomStep;
        if (WINDOW.WIDTH - zoomStep > 0) {
            WINDOW.WIDTH += delta;
            WINDOW.HEIGHT += delta;
            WINDOW.LEFT -= delta / 2;
            WINDOW.BOTTOM -= delta / 2;
        }
        if (WINDOW.WIDTH <= zoomStep) {
            WINDOW.WIDTH -= delta;
            WINDOW.HEIGHT -= delta;
            WINDOW.LEFT += delta / 2;
            WINDOW.BOTTOM += delta / 2;
        }
        render();
    }

    function mousedown() {
        canScroll = true;
    }
    function mouseup() {
        canScroll = false;
    }
    function mouseleave() {
        canScroll = false;
    }
    function mousemove(event) {
        if (canScroll) {
            WINDOW.LEFT -= graph.sx(event.movementX);
            WINDOW.BOTTOM -= graph.sy(event.movementY);
        }
        mouseX = graph.sx(event.offsetX) + WINDOW.LEFT;
        render();
    }

    function printNumbers() {
        for (var i = 1; i < WINDOW.WIDTH + WINDOW.LEFT; i++) {
            graph.number(i, i, 0, 'x');
        }
        for (var i = 1; i < Math.abs(WINDOW.LEFT); i++) {
            graph.number(-i, -i, 0, 'x');
        }
        for (var i = 1; i < WINDOW.HEIGHT + WINDOW.BOTTOM; i++) {
            graph.number(i, 0, i, 'y');
        }
        for (var i = 1; i < Math.abs(WINDOW.BOTTOM); i++) {
            graph.number(-i, 0, -i, 'y');
        }
        graph.number('0', 0, 0, '0');
    }

    function getZero(f, a, b, eps) {
        if (f(a) * f(b) > 0) {
            return null;
        }
        if (Math.abs(a - b) < eps) {
            return (a + b) / 2;
        }
        var half = (a + b) / 2;
        if (f(a) * f(half) <= 0) {
            return getZero(f, a, half, eps);
        }
        if (f(half) * f(b) <= 0) {
            return getZero(f, half, b, eps);
        }
    }

    function setDerivative(value, num) {
        if (funcs[num]) {
            funcs[num].derivative = value;
            render();
        }
    }

    function setDerivative(f, x0) {
        return (f(x0 + 0.00001) - f(x0)) / 0.00001;
    }

    function printDerivative(f, x0) {
        var der = setDerivative(f,x0);
        if (der) {
            var x1=WINDOW.LEFT;
            var x2 = WINDOW.LEFT + WINDOW.WIDTH;
            graph.line(x1+x0, der*x1+ f(x0), x2+x0, der*x2+f(x0), '#aca',1,true)
        }
    }


    function render() {
        graph.clear();
        printOXY();
        for (var i = 0; i < funcs.length; i++) {
            if (funcs[i]) {
                printFunction(funcs[i].f, funcs[i].color, funcs[i].width);
                graph.printFuncNames(funcs[i].name, funcs[i].nameCoor, funcs[i].f, funcs[i].color);
                if (funcs[i].derivative) {
                    printDerivative(funcs[i].f, mouseX)
                }
                printFunction();
            }
        }
        printNumbers();

        /*
        var x = getZero(funcs[i].f, 1, 4, 0.0001);
        if (x !== null) {
            graph.point(x, 0, 2);
        }
        */
    }


    render();
}