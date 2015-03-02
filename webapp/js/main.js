try {
    var nw = require("nw.gui");
    var win = nw.Window.get();
}catch(Ex){

}

// Raices

var arbolA = undefined;
var arbolB = undefined;

// Métodos de Arbol

function Nodo (arbol, valor){
    this.valor = parseInt(valor);
    this.izq = undefined;
    this.der = undefined;
    this.arbol = arbol;
}

Nodo.prototype.agregarNodo = function(arbol, valor){

    // Ubicar el nodo recibido
    if(this.valor > parseInt(valor)){
        if(this.izq === undefined)
            this.izq = new Nodo(arbol, valor);
        else
            this.izq.agregarNodo(arbol, valor);
    }else if(this.valor < parseInt(valor)){
        if(this.der === undefined)
            this.der = new Nodo(arbol, valor);
        else
            this.der.agregarNodo(arbol, valor);
    }

};

Nodo.prototype.preorden = function(){
    var arrValores = [];

    arrValores[0]=this.valor;

    if(this.izq !== undefined)
        arrValores.concat(this.izq.preorden());
    if(this.der !== undefined)
        arrValores.concat(this.der.preorden());

    return arrValores;
};

Nodo.prototype.inorden = function(){

    var arrValores = [];

    if(this.izq !== undefined)
        arrValores = arrValores.concat(this.izq.inorden());

    arrValores[arrValores.length]=this.valor;

    if(this.der !== undefined)
        arrValores = arrValores.concat(this.der.inorden());

    return arrValores;
};

Nodo.prototype.postorden = function(){
    var arrValores = [];

    if(this.izq !== undefined)
        arrValores.concat(this.izq.postorden());

    if(this.der !== undefined)
        arrValores.concat(this.der.postorden());

    arrValores[arrValores.length]=this.valor;

    return arrValores;
};

Nodo.prototype.nivel = function(nivel){
    if(nivel === undefined)
        nivel = 1;

    var nivelIzq = 0;

    if(this.izq !== undefined)
        nivelIzq = this.izq.nivel(nivel + 1);

    var nivelDer = 0;

    if(this.der !== undefined)
        nivelDer = this.der.nivel(nivel + 1);

    if(nivel > nivelIzq && nivel > nivelDer)
        return nivel;
    else if(nivelIzq > nivel && nivelIzq > nivelDer)
        return nivelIzq;
    else
        return nivelDer;
};

/**
 * Método que dibuja el nodo, y opcionalmente los caminos a los hijos que posean
 * @param canvas    Objeto Canvas
 * @param dH        Altura de
 * @param nivel
 */
Nodo.prototype.dibujar = function(nivel, n){

    var nWH = 15;

    if(nivel === undefined)
        nivel = 1;

    if(n === undefined)
        n = 1;

    /*
     *  dX Distancia horizontal entre cada nodo, depende del nivel, está dado por
     *  dX = ancho / (Numero de Nodos por Nivel + 1)
     *  Numero de Nodos por Nivel = 2 ^ (nivel - 1)
     */

    var nodos = Math.pow(2, nivel - 1);

    var dX = parseFloat(this.arbol.canvas.width / (Math.pow(2, nivel - 1) + 1));

    var cx = n * dX;
    var cy = nivel * this.arbol.diferencia_altura();

    //console.log("X (" + this.valor + ") : " + cx + " Y: " + cy + " dX: " + dX + " Nivel: " + nivel + " n: " + n);

    var ctx = this.arbol.canvas.getContext('2d');

    // si existen hijos traze los caminos antes

    if(this.izq !== undefined || this.der !== undefined){
        var dXc = parseFloat(this.arbol.canvas.width / (Math.pow(2, nivel) + 1));
        // console.log("dXc: " + dXc);
        var cxi = ((2*n)-1) * dXc;
        var cxr = ((2*n)) * dXc;
        var cyir = (nivel + 1) * this.arbol.diferencia_altura();

        if(this.izq !== undefined) {
            ctx.beginPath();
            ctx.strokeStyle = '#999999';
            ctx.lineWidth = 2;
            ctx.moveTo(cx, cy);
            ctx.lineTo(cxi, cyir);
            ctx.stroke();

        }

        if(this.der !== undefined) {
            ctx.beginPath();
            ctx.strokeStyle = '#999999';
            ctx.lineWidth = 2;
            ctx.moveTo(cx, cy);
            ctx.lineTo(cxr, cyir);
            ctx.stroke();
        }

    }

    ctx.beginPath();
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    ctx.arc(cx, cy, nWH, 0, 2 * Math.PI, false);
    ctx.stroke();

    ctx.font = '12pt Courier';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FF0000';
    ctx.fillText(this.valor, cx, cy + 5);

    if(this.izq !== undefined)
        this.izq.dibujar(nivel + 1, 2*n - 1);

    if(this.der !== undefined)
        this.der.dibujar(nivel + 1, 2*n);

};

Nodo.prototype.forma = function(){
    var str = "";

    var forma = 1;

    if(this.izq !== undefined)
        forma += 2;

    if(this.der !== undefined)
        forma += 4;

    str = str + "" + forma;

    if(this.izq !== undefined)
        str = str + this.izq.forma();

    if(this.der !== undefined)
        str = str + this.der.forma();

    return str;

};

Nodo.prototype.peso = function(){
    var peso = 1;

    if(this.izq !== undefined)
        peso += this.izq.peso();

    if(this.der !== undefined)
        peso += this.der.peso();

    return peso;
};

function Arbol (canvas){
    this.canvas = canvas;
    this.raiz = undefined;
}

Arbol.prototype.nivel = function(){
    return this.raiz.nivel();
};

Arbol.prototype.diferencia_altura = function () {
    return parseFloat(this.canvas.height / (this.nivel() + 1));
};

Arbol.prototype.agregarNodo = function(valor){
    if(this.raiz !== undefined)
        this.raiz.agregarNodo(this, valor);
    else
        this.raiz = new Nodo(this, valor);
};

Arbol.prototype.inorden = function(){
    if(this.raiz !== undefined)
        return this.raiz.inorden();

    return [];
};

Arbol.prototype.preorden = function(){
    if(this.raiz !== undefined)
        return this.raiz.preorden();

    return [];
};

Arbol.prototype.postorden = function(){
    if(this.raiz !== undefined)
        return this.raiz.postorden();

    return [];
};

Arbol.prototype.forma = function(){
    if(this.raiz !== undefined)
        return this.raiz.forma();

    return "";
};

Arbol.prototype.dibujar = function(){

    // No proceda a dibujar nada porque no tiene los parámetros correctos
    if(this.canvas === undefined)
        return;

    var ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#DFDFDF';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.beginPath();
    ctx.fillStyle = '#FF0000';
    ctx.font = '12pt Arial';
    ctx.textAlign = 'left';
    ctx.fillText("Peso: " + this.peso(), 5, 15);

    if(this.raiz === undefined)
        return;

    // Halle el nivel del árbol
    var nivelArbol = this.raiz.nivel();

    // Tamaño del canvas
    var cW = this.canvas.width;
    var cH = this.canvas.height;

    // Altura entre cada nivel (dH)
    var dH = parseFloat(cH / (nivelArbol + 1));

    this.raiz.dibujar();

};

Arbol.prototype.peso = function(){
    if(this.raiz !== undefined)
        return this.raiz.peso();

    return 0;1
};

$(document).ready(function(){

    arbolA = new Arbol($("#canvasArbolA").get(0));
    arbolB = new Arbol($("#canvasArbolB").get(0));

    arbolA.dibujar();
    arbolB.dibujar();

    /*$("canvas").each(function(idx, obj){
        var contexto = obj.getContext('2d');

        contexto.fillStyle = '#DFDFDF';
        contexto.fillRect(0,0,obj.width,obj.height);

    });*/

    $("#item_arbolA").keydown(function(e){
        if($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            (e.keyCode == 65 && e.ctrlKey === true) ||
            (e.keyCode >= 35 && e.keyCode <= 40)){
            if(e.keyCode == 13){
                $("#btnArbolA").click();
            }
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $("#item_arbolB").keydown(function(e){
        if($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            (e.keyCode == 65 && e.ctrlKey === true) ||
            (e.keyCode >= 35 && e.keyCode <= 40)){
            if(e.keyCode == 13){
                $("#btnArbolB").click();
            }
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $("#btnArbolA").click(function(e){
        arbolA.agregarNodo($("#item_arbolA").val());
        arbolA.dibujar();
        $("#item_arbolA").val('').focus();
        if(arbolA.forma() == arbolB.forma()){
            $(".resultado").html("<h1>Árboles ISOMORFICOS</h1>");
        }else{
            $(".resultado").html("");
        }
    });

    $("#btnArbolB").click(function(e){
        arbolB.agregarNodo($("#item_arbolB").val());
        arbolB.dibujar();
        $("#item_arbolB").val('').focus();
        if(arbolA.forma() == arbolB.forma()){
            $(".resultado").html("<h1>Árboles ISOMORFICOS</h1>");
        }else{
            $(".resultado").html("");
        }
    });

    // Evento para cierre de aplicación
    $(".boton-cierre").click(function(){
        if(win !== undefined)
            win.close();
    });

    $(".boton-reset").click(function(){
        arbolA.raiz = undefined;
        arbolA.dibujar();
        arbolB.raiz = undefined;
        arbolB.dibujar();
        $(".resultado").html("");
    });

});