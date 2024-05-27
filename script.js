var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

var imgNave = new Image();
imgNave.src = "img/nave.png";
imgNave.onload = criaNave;

var imgFundo = new Image();
imgFundo.src = "img/praia.jpg"var posY = 0;
imgFundo.onload = animaFundo;

var velocidade = 1;

function Sprite(contexto, imagem, x, y, deslocamento) {
    this.contexto = contexto;
    this.imagem = imagem;
    this.x = x;
    this.y = y;
    this.deslocamento = deslocamento;
    this.largura = this.imagem.width;
    this.altura = this.imagem.height;

    this.desenhar = function() {
        this.contexto.drawImage(this.imagem, this.x, this.y - 177, this.largura - 80, this.altura - 80);
    };

    this.direita = function() {
        if (this.x < this.contexto.canvas.width - this.largura - this.deslocamento) {
            this.x += this.deslocamento;
        }
    };

    this.esquerda = function() {
        if (this.x > 0) {
            this.x -= this.deslocamento;
        }
    };

    this.subir = function() {
        if (this.y - 180 > 0) {
            this.y -= this.deslocamento;
        }
    };

    this.descer = function() {
        if (this.y - 177 <= this.contexto.canvas.height - this.altura - this.deslocamento) {
            this.y += this.deslocamento;
        }
    };
}

function animaFundo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    atualizaFundo();
    desenhaFundo();
    requestAnimationFrame(animaFundo);
}

function atualizaFundo() {
    posY += velocidade;
    if (posY > imgFundo.height) {
        posY = 0;
    }
}

function desenhaFundo() {
    var y = posY - imgFundo.height;
    ctx.drawImage(imgFundo, 0, y);
    y = posY;
    ctx.drawImage(imgFundo, 0, y);
}

function criaNave() {
    var nave = new Sprite(ctx, imgNave, canvas.width / 2 - imgNave.width / 2, canvas.height - imgNave.height, 20);
    nave.desenhar();

    document.addEventListener("keydown", function(evento) {
        var tecla = evento.key;
        if (tecla === "ArrowLeft") {
            nave.esquerda();
        } else if (tecla === "ArrowRight") {
            nave.direita();
        } else if (tecla === "ArrowUp") {
            nave.subir();
        } else if (tecla === "ArrowDown") {
            nave.descer();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nave.desenhar();
    });
}
