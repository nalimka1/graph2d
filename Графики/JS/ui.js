function sin(x) { return Math.sin(x); }
function cos(x) { return Math.cos(x); }
function tg(x) { return Math.tan(x); }
function sqrt(x) { return Math.sqrt(x); }
function abs(x) { return Math.abs(x); }

function UI(options) {
    var callbacks = options.callbacks;
    document.getElementById('addFunction').addEventListener('click', addFunction);
    document.getElementById('showHide').addEventListener('click', showHide);
    var num = 1;

    function showHide() {
        var div = document.querySelector('.over');
        div.classList.toggle('hide');
        document.addEventListener('click', function () {
            div.classList.toggle('show');
        })
    }
    showHide();

    function addFunction() {
        //input функции
        var input = document.createElement('input');
        input.setAttribute('placeholder', `function №${num}`);
        input.dataset.num = num;
        input.addEventListener('keyup', keyup);

        //input цвета
        var funcColor = document.createElement('input')
        funcColor.setAttribute('placeholder', `ЦВЕТ`);
        funcColor.dataset.num = num;
        funcColor.addEventListener('keyup', keyupColor);

        //input толщины
        var funcWidth = document.createElement('input')
        funcWidth.setAttribute('placeholder', `ШИРИНА`);
        funcWidth.dataset.num = num;
        funcWidth.addEventListener('keyup', keyupWidth);
        //удаление
        var button = document.createElement('button');
        button.innerHTML = 'Delete';
        button.addEventListener('click', function () {
            callbacks.delFunction(input.dataset.num);
            divFuncs.removeChild(input);
            divFuncs.removeChild(funcColor);
            divFuncs.removeChild(funcWidth);
            divFuncs.removeChild(button);
        });

        var divFuncs = document.getElementById('funcs');
        divFuncs.appendChild(input);
        divFuncs.appendChild(funcColor);
        divFuncs.appendChild(funcWidth);
        divFuncs.appendChild(button);
        num++;

        
        var inputDer = document.createElement('input');
        inputDer.setAttribute('type', 'checkbox');
        inputDer.setAttribute('id', `derivative${num}`);
        inputDer.addEventListener('change',function(){
            callbacks.setDerivative(this.checked, input.dataset.num)
        })
    }

    function keyup() {
        try {
            var f;
            eval(`f = function(x) { return ${this.value}; }`);
            callbacks.enterFunction(f, this.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }

    function keyupColor() {
        try {
            var f;
            eval(`f = '${this.value}'`);
            callbacks.enterColor(f, this.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }

    function keyupWidth() {
        try {
            var f;
            eval(`f = '${this.value}'`);
            callbacks.enterWidth(f, this.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }
}