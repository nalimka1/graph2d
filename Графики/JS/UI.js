function cos(x) { return Math.cos(x); }
function sin(x) { return Math.sin(x); }
function tg(x) { return Math.tan(x); }
function ctg(x) { return 1 / Math.tan(x); }
var isOpen = false;

function UI(options) {
    var num = 0;
    var callbacks = options.callbacks || {};
    var addFunc = document.getElementById('addFunction');
    addFunc.addEventListener('click', addFunction);

    //var firstAs = document.getElementById('firstAs');
    //firstAs.addEventListener('keyup', firstAsUp);

    //var secondAs = document.getElementById('secondAs');
    //secondAs.addEventListener('keyup', secondAsUp);

    var openBtn = document.getElementById('menu');
    openBtn.addEventListener('click', menu);

    function addFunction() {
        var element = document.createElement('div');
        element.setAttribute('class', 'element');

        var del = document.createElement('button');
        del.style.height = 20 + 'px';
        del.style.marginLeft = 20 + 'px';
        del.innerHTML = 'Удалить функцию';
        del.dataset.num = num;
        del.addEventListener('click', deleteFunc);

        //input функции
        var Func = document.createElement('input');
        Func.setAttribute('placeholder', `Функция №${num}`);
        Func.dataset.num = num;
        Func.addEventListener('keyup', funcKeyup);

        //input цвета
        var FuncColor = document.createElement('input');
        FuncColor.setAttribute('placeholder', `Цвет линии`);
        FuncColor.dataset.num = num;
        FuncColor.addEventListener('keyup', colorKeyup);

        //input ширины
        var FuncWidth = document.createElement('input');
        FuncWidth.setAttribute('placeholder', `Ширина линии`);
        FuncWidth.dataset.num = num;
        FuncWidth.addEventListener('keyup', widthKeyup);

        //input касательной
        var derivative = document.createElement('input');
        derivative.setAttribute('type', 'checkbox');
        derivative.setAttribute('id', `derivative${num}`);
        derivative.addEventListener('change', function () {
            callbacks.setDerivative(this.checked, FuncColor.dataset.num);
        });
        //текст для касательной
        var derText = document.createElement('label');
        derText.innerHTML = 'Касательная';
        derivative.appendChild(derText);


        element.appendChild(Func);
        element.appendChild(FuncColor);
        element.appendChild(FuncWidth);
        element.appendChild(del);
        element.appendChild(derivative);


        function deleteFunc() {
            callbacks.deleteFunc(this.dataset.num);
            functions.removeChild(element);
        }


        var functions = document.getElementById('functions');
        functions.appendChild(element);
        num += 1;
    }
    function funcKeyup() {
        try {
            var f, n;
            eval(`f = function(x){ return ${this.value}; }`);
            n = 'y = ' + this.value;
            callbacks.enterFunction(f, n, this.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }
    function colorKeyup() {
        try {
            var f;
            eval(`f = '${this.value}'`);
            callbacks.enterColorFunction(f, this.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }
    function widthKeyup() {
        try {
            var f;
            eval(`f = '${this.value}'`);
            callbacks.enterWidthFunction(f, this.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }
    function firstAsUp() {
        try {
            callbacks.changeAsymphtot(1, this.value - 0);
        } catch { }
    }
    function secondAsUp() {
        try {
            callbacks.changeAsymphtot(2, this.value - 0);
        } catch { }
    }
    function menu() {
        var over = document.getElementById('over');
        //over.classList.toggle('hide');
        //over.classList.add('animated');
        if (isOpen) {
            over.style.top = -800 + 'px';
            isOpen = false;
        } else {
            over.style.top = 15 + 'px';
            isOpen = true;
        }

    }
}