
var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

var imgNave = new Image();
imgNave.src = "img/nave.png";
imgNave.onload = criaNave;

var imgFundo = new Image();
imgFundo.src = "img/praia.jpg";
var posY = 0;
imgFundo.onload = animaFundo;

var velocidade = 1;
var nave; 



function Sprite(contexto, imagem, x, y, deslocamento) {
    this.contexto = contexto;
    this.imagem = imagem;
    this.x = x;
    this.y = y;
    this.deslocamento = deslocamento;
    this.largura = this.imagem.width;
    this.altura = this.imagem.height;

    this.desenhar = function() {
        this.contexto.drawImage(this.imagem, this.x, this.y +90, this.largura - 100, this.altura - 100);
    };

    this.direita = function() {
        if (this.x-120 < this.contexto.canvas.width - this.largura - this.deslocamento) {
            this.x += this.deslocamento;
        }
    };

    this.esquerda = function() {
        if (this.x-15 >= 0) {
            this.x -= this.deslocamento;
        }
    };

    /*this.subir = function() {
        if (this.y -  > 0) {
            this.y -= this.deslocamento;
        }
    };*/

    this.descer = function() {
        if (this.y - 280  <= this.contexto.canvas.height - this.altura - this.deslocamento) {
            this.y += this.deslocamento;
        }
    };
}

function criaNave() {
    nave = new Sprite(ctx, imgNave, canvas.width / 2 - imgNave.width / 2, canvas.height - imgNave.height, 20);

    document.addEventListener("keydown", function(evento) {
        var tecla = evento.key;
        if (tecla === "ArrowLeft") {
            nave.esquerda();
        } else if (tecla === "ArrowRight") {
            nave.direita();
        } 
        /*else if (tecla === "ArrowUp") {
            nave.subir();
        } else if (tecla === "ArrowDown") {
            nave.descer();
        }*/
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        desenhaFundo();
        nave.desenhar();
    });
}

function animaFundo() {
    atualizaFundo();
    desenhaFundo();
    if (nave) nave.desenhar(); // Desenha a nave após desenhar o fundo
    requestAnimationFrame(animaFundo);
}

function atualizaFundo() {
    posY += velocidade;
    if (posY >= canvas.height) {
        posY = 0;
    }
}

function desenhaFundo() {
    // Desenha o fundo cobrindo todo o canvas
    ctx.drawImage(imgFundo, 0, 0, canvas.width, canvas.height);
    
    // Calcula a posição y para repetir o fundo verticalmente
    var y1 = posY;
    var y2 = posY - canvas.height;
    
    // Desenha o fundo repetido
    ctx.drawImage(imgFundo, 0, y1, canvas.width, canvas.height);
    ctx.drawImage(imgFundo, 0, y2, canvas.width, canvas.height);
}


