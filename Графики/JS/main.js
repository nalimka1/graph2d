var graphs = [];

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
        WINDOW,
        callBacks: {
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
            enterColorFunction,
            enterWidthFunction,
            changeAsymphtot,
            deleteFunc,
            setDerivative
        }
    });


    function enterFunction(f, n, num) {
        if (graphs[num]) {
            graphs[num].func = f;
            graphs[num].name = n;
        } else {
            graphs[num] = {
                func: f,
                name: n,
                width: 1,
                color: 'blue'
            }
        }
        render();
    }

    function setDerivative(value, num) {
        if (graphs[num]) {
            graphs[num].derivative = value;
            render();
        }
    }

    function deleteFunc(num) {
        graphs[num] = null;
        render();
    }

    function enterColorFunction(f, num) {
        graphs[num].color = f;
        render();
    }

    function enterWidthFunction(f, num) {
        graphs[num].width = f;
        render();
    }

    function changeAsymphtot(x, value) {
        console.log(x, value);
        if (x == 1) {
            asymphX1 = value;
        }
        if (x == 2) {
            asymphX2 = value;
        }
        render();
    }
    var asymphX1 = -5, asymphX2 = 5;
    var mouseX = 0;
    var mainColor = 'black';
    var zoomStep = 0.5;
    var canScroll = false;

    //ОСИ
    function printOXY() {
        var size = 0.2;
        // Ox
        graph.line(WINDOW.LEFT, 0, WINDOW.WIDTH + WINDOW.LEFT, 0, mainColor, 1);
        // Oy
        graph.line(0, WINDOW.BOTTOM, 0, WINDOW.HEIGHT + WINDOW.BOTTOM, mainColor, 1);
        // Ox >
        graph.line(WINDOW.WIDTH + WINDOW.LEFT, 0, WINDOW.WIDTH + WINDOW.LEFT - 1 / 2, size, mainColor, 1);
        graph.line(WINDOW.WIDTH + WINDOW.LEFT, 0, WINDOW.WIDTH + WINDOW.LEFT - 1 / 2, -size, mainColor, 1);
        // Oy >
        graph.line(0, WINDOW.HEIGHT + WINDOW.BOTTOM, +size, WINDOW.HEIGHT + WINDOW.BOTTOM - 1 / 2, mainColor, 1);
        graph.line(0, WINDOW.HEIGHT + WINDOW.BOTTOM, -size, WINDOW.HEIGHT + WINDOW.BOTTOM - 1 / 2, mainColor, 1);

        // Чёрточки
        for (var i = 1; i < WINDOW.WIDTH + WINDOW.LEFT; i++) {
            graph.line(i, WINDOW.HEIGHT, i, WINDOW.BOTTOM, '#bbb', 1);
            if (i % 5 == 0) {
                graph.line(i, -size, i, size, mainColor, 2);
            } else {
                graph.line(i, -size, i, size, mainColor, 1);
            }
        }
        for (var i = -1; i > WINDOW.LEFT; i--) {
            graph.line(i, WINDOW.HEIGHT, i, WINDOW.BOTTOM, '#bbb', 1);
            if (i % -5 == 0) {
                graph.line(i, -size, i, size, mainColor, 2);
            } else {
                graph.line(i, -size, i, size, mainColor, 1);
            }
        }
        for (var i = 1; i < WINDOW.HEIGHT + WINDOW.BOTTOM; i++) {
            graph.line(WINDOW.LEFT, i, WINDOW.WIDTH, i, '#bbb', 1);
            if (i % 5 == 0) {
                graph.line(-size, i, size, i, mainColor, 2);
            } else {
                graph.line(-size, i, size, i, mainColor, 1);
            }
        }
        for (var i = -1; i > WINDOW.BOTTOM; i--) {
            graph.line(WINDOW.LEFT, i, WINDOW.WIDTH, i, '#bbb', 1);
            if (i % -5 == 0) {
                graph.line(-size, i, size, i, mainColor, 2);
            } else {
                graph.line(-size, i, size, i, mainColor, 1);
            }
        }
    }

    // MOUSE
    function wheel(event) {
        var delta = (event.wheelDelta > 0) ? - zoomStep : zoomStep;
        if (WINDOW.WIDTH - zoomStep > 3) {
            WINDOW.WIDTH += delta;
            WINDOW.HEIGHT += delta;
            WINDOW.LEFT -= delta / 2;
            WINDOW.BOTTOM -= delta / 2;
        }
        if (WINDOW.WIDTH <= zoomStep + 3) {
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

    function printDerivative(f, x0) {
        var der = getDerivative(f, x0);
        if (der) {
            var x1 = WINDOW.LEFT;
            var x2 = WINDOW.LEFT + WINDOW.WIDTH;
            graph.line(x1 + x0, der * x1 + f(x0), x2 + x0, der * x2 + f(x0), '#aaa', 1, true);
            var str = `${der.toFixed(3)};${f(der).toFixed(3)}`;
            graph.printText(str, der, f(der));
            graph.angle(Math.atan(der), f(x0) / der);
        }
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

    function getOldZero(f, a, b) {
        var c;
        var E = 0.001;
        if (graphs[0].func == '') {
            return false;
        }
        if (Math.abs(f(a) - f(b) == 0)) {
            return false;
        }
        while (isNaN(f(a))) {
            a += 0.1;
            if (a >= b) {
                break;
            }
        }
        while (isNaN(f(b))) {
            b -= 0.1;
            if (a >= b) {
                break;
            }
        }
        while (Math.abs(f(a) - f(b)) >= E) {
            if (isNaN(f(a)) || isNaN(f(b))) {
                return null;
            }
            if (f(a) * f(b) > 0) {
                return false;
            }
            c = (a + b) / 2;
            if (f(a) * f(c) <= 0) {
                b = c;
                continue;
            }
            if (f(c) * f(b) <= 0) {
                a = c;
            }
        }

        return a;
    }

    function getCross(f, g, a, b) {
        var c;
        var E = 0.001;
        if (graphs[0].func == '') {
            return false;
        }
        while (Math.abs(f(a) - g(b)) >= E) {
            if (isNaN(f(a)) || isNaN(f(b))) {
                return null;
            }
            if ((f(a) - g(a)) * (f(b) - g(b)) > 0) {
                return false;
            }
            c = (a + b) / 2;
            if ((f(a) - g(a)) * (f(c) - g(c)) > 0) {
                b = c;
                continue;
            }
            if ((f(c) - g(c)) * (f(b) - g(b)) > 0) {
                a = c;
            }
        }
        console.log(a, f(a));
        graph.point(a, f(a), 'red', 5);
        return a;
    }

    function getZero(f, a, b) {
        while (a < b) {
            if (graphs[0].func == '') {
                return false;
            }
            if (f(a) - f(b) == 0) {
                return false;
            }
            while (isNaN(f(a))) {
                a += 0.1;
                if (a >= b) {
                    break;
                }
            }
            while (isNaN(f(b))) {
                b -= 0.1;
                if (a >= b) {
                    break;
                }
            }
            if (f(a) * f(a + 0.01) < 0) {
                return a;
            }
            a += 0.01;
        }
    }

    function printFunction(f, color, width, asymph, x1, x2) {
        var x = WINDOW.LEFT;
        var dx = WINDOW.WIDTH / 1000;
        var count = 0;
        while (x < WINDOW.WIDTH + WINDOW.LEFT) {
            //printFuncBreak(x, x + dx, f);
            //if(isNaN(f(x))){
            //    count += dx;
            //}
            try {
                if (asymph && x > x1 && x < x2) {
                    graph.line(x, f(x), x + dx, f(x + dx), 'black', width);
                } else {
                    graph.line(x, f(x), x + dx, f(x + dx), color, width);
                }
            } catch (e) { }
            x += dx;
        }
        //printNanGraphic(x, x + count);
    }

    function getDerivative(f, x0) {
        deltaX = 0.0000000001;
        return (f(x0 + deltaX) - f(x0)) / deltaX;
    }

    function drawAsymphtots(f, x1, x2) {
        x = getZero(f, x1, x2);
        if (x != null && x) {
            graph.line(x1, WINDOW.BOTTOM, x1, WINDOW.HEIGHT + WINDOW.BOTTOM, 'blue', 1, true);
            graph.line(x2, WINDOW.BOTTOM, x2, WINDOW.HEIGHT + WINDOW.BOTTOM, 'blue', 1, true);
        }
    }

    function changeFuncColor(f, x1, x2) {
        printFunction(f, graphs[0].color, 3, true, x1, x2);
    }

    function printNanGraphic(x, x2) {
        graph.printRect(x, x2, 'rgba(255, 255, 0, 0.5)');
    }

    function printFuncBreak(x, x2, func) {
        if (Math.abs(func(x) - func(x2) > 100)) {
            graph.line(x, WINDOW.HEIGHT, x, WINDOW.BOTTOM, 'rgba(255, 0, 0, 0.5)', 5, true);
        }
    }

    function render() {
        graph.clear();
        printOXY();
        printNumbers();
        for (var i = 0; i < graphs.length; i++) {
            if (graphs[i]) {
                printFunction(graphs[i].func, graphs[i].color, graphs[i].width);
                graph.printFuncNames(graphs[i].name, graphs[i].func, graphs[i].color);
            }

        }
        if (graphs[0] && graphs[1]) {
            getCross(graphs[0].func, graphs[1].func, -2, 5);
        }
        for (var i = 0; i < graphs.length; i++) {
            if (graphs[i]) {
                if (graphs[i].derivative) {
                    printDerivative(graphs[i].func, mouseX);
                }
            }
        }



        //x = getZero(graphs[0].func, asymphX1, asymphX2);
        //if (x) {
        //    drawAsymphtots(graphs[0].func, asymphX1, asymphX2);
        //    changeFuncColor(graphs[0].func, asymphX1, asymphX2);
        //    graph.point(x, 0, 'red', 3);
        //}
    }
    render();
}