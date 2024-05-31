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
var naveInimiga;
var imgNaveInimiga = new Image();
imgNaveInimiga.src = "img/naveInimigo.png";
imgNaveInimiga.onload = criaNaveInimiga;

var escalaNave = 0.7; // Escala da nave principal
var escalaNaveInimiga = 0.7; // Escala da nave inimiga

function Sprite(contexto, imagem, x, y, deslocamento, escala) {
    this.contexto = contexto;
    this.imagem = imagem;
    this.x = x;
    this.y = y;
    this.deslocamento = deslocamento;
    this.largura = this.imagem.width * escala;
    this.altura = this.imagem.height * escala;

    this.desenhar = function() {
        this.contexto.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    };

    this.direita = function() {
        if (this.x + this.deslocamento < this.contexto.canvas.width - this.largura) {
            this.x += this.deslocamento;
        }
    };

    this.esquerda = function() {
        if (this.x - this.deslocamento >= 0) {
            this.x -= this.deslocamento;
        }
    };
}

function criaNaveInimiga() {
    naveInimiga = new Sprite(ctx, imgNaveInimiga, canvas.width / 2 - imgNaveInimiga.width * escalaNaveInimiga / 2, 0, 0, escalaNaveInimiga);
    desenhaFundo();
    naveInimiga.desenhar();
}

function criaNave() {
    nave = new Sprite(ctx, imgNave, canvas.width / 2 - imgNave.width * escalaNave / 2, canvas.height - imgNave.height * escalaNave, 20, escalaNave);

    document.addEventListener("keydown", function(evento) {
        var tecla = evento.key;
        if (tecla === "ArrowLeft") {
            nave.esquerda();
        } else if (tecla === "ArrowRight") {
            nave.direita();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        desenhaFundo();
        nave.desenhar();
        if (naveInimiga) naveInimiga.desenhar(); // Desenha a nave inimiga, se existir
    });
}

function animaFundo() {
    atualizaFundo();
    desenhaFundo();
    if (nave) nave.desenhar(); // Desenha a nave após desenhar o fundo
    if (naveInimiga) naveInimiga.desenhar(); // Desenha a nave inimiga após desenhar o fundo
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
