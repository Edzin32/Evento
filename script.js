var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

var imgNave = new Image();
imgNave.src = "img/nave.png";
imgNave.onload = criaNave;

var explosao = new Image();
explosao.src = "img/explosao.png";

var imgFundo = new Image();
imgFundo.src = "img/praia.jpg";
var posY = 0;
var animacaoFundo;
imgFundo.onload = animaFundo;

var velocidade = 1;
var nave;
var navesInimigas = []; 
var imgNaveInimiga = new Image();
imgNaveInimiga.src = "img/naveInimigo.png";
imgNaveInimiga.onload = criaNavesInimigas;

var escalaNave = 0.7; 
var escalaNaveInimiga = 0.7; 
var velocidadeInimiga = 2; 

var explosoes = []; 
var tiros = []; 

var somTiro=new Audio()
somTiro.src="sounds/tiro.mp3"
somTiro.volume=0.2
somTiro.load()

var somExp=new Audio()
somExp.src="sounds/explosao.mp3"
somExp.volume=0.2
somExp.load()

var somAcao=new Audio()
somAcao.src="sounds/musica-acao.mp3"
somAcao.volume=0.2
somAcao.load()
somAcao.currentTime = 0.0;
somAcao.play()

function Sprite(contexto, imagem, x, y, deslocamento, escala,somTiro) {
    this.contexto = contexto;
    this.imagem = imagem;
    this.x = x;
    this.y = y;
    this.deslocamento = deslocamento;
    this.largura = this.imagem.width * escala;
    this.altura = this.imagem.height * escala;
    this.som=somTiro;

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

    this.baixo = function() {
        if (this.y + velocidadeInimiga < this.contexto.canvas.height) {
            this.y += velocidadeInimiga;
        } else {
            this.y = -this.altura; 
            this.x = Math.random() * (this.contexto.canvas.width - this.largura); 
        }
    };

    this.disparo = function() {
        tiros.push({x: this.x + this.largura / 2 - 2.5, y: this.y - 10, largura: 5, altura: 10});
    
    }
}

function criaNavesInimigas() {
    for (var i = 0; i < 5; i++) { 
        var x = Math.random() * (canvas.width - imgNaveInimiga.width * escalaNaveInimiga);
        var y = Math.random() * -canvas.height; 
        var naveInimiga = new Sprite(ctx, imgNaveInimiga, x, y, 0, escalaNaveInimiga);
        navesInimigas.push(naveInimiga);
    }
}

function criaNave() {
    nave = new Sprite(ctx, imgNave, canvas.width / 2 - imgNave.width * escalaNave / 2, canvas.height - imgNave.height * escalaNave, 20, escalaNave);

    document.addEventListener("keydown", function(evento) {
        var tecla = evento.key;
        if (tecla === "ArrowLeft") {
            nave.esquerda();
        } else if (tecla === "ArrowRight") {
            nave.direita();
        } else if (tecla === " ") { 
            nave.disparo();
            somTiro.currentTime = 0.0;
            somTiro.play();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        desenhaFundo();
        if (nave) nave.desenhar();
        desenhaNavesInimigas();
        
    });
}

function colidiuDesparo(tiros, inimigo) {
    return tiros.some(function(tiro) {
        return (
            tiro.x < inimigo.x + inimigo.largura &&
            tiro.x + tiro.largura > inimigo.x &&
            tiro.y < inimigo.y + inimigo.altura &&
            tiro.y + tiro.altura > inimigo.y
        );
    });
}
function colidiu(nave, inimigo) {
    return (
        nave.x+50 < inimigo.x + inimigo.largura &&
        nave.x + nave.largura > inimigo.x &&
        nave.y+50 < inimigo.y + inimigo.altura &&
        nave.y + nave.altura > inimigo.y
    );
}

function desenhaNavesInimigas() {
    navesInimigas.forEach(function(naveInimiga) {
        naveInimiga.baixo();
        naveInimiga.desenhar();
        if (nave && colidiu(nave, naveInimiga)) {

            somExp.currentTime = 1.0;
            somExp.play();
            explosoes.push({x: nave.x, y: nave.y});
            nave = null; 

            
            setTimeout(function() {
                explosoes.shift();
            }, 500); 
            
            pararAnimacaoFundo(); 
        }
        if(tiros&&colidiuDesparo(tiros,naveInimiga)){
            somExp.currentTime = 1.0;
            somExp.play();
            explosoes.push({x: naveInimiga.x, y: naveInimiga.y});
            
            naveInimiga.x=null;
            setTimeout(function() {
                explosoes.shift();
            }, 300); 
        }
    });

   
    explosoes.forEach(function(explosaoPos) {
        ctx.drawImage(explosao, explosaoPos.x - 115, explosaoPos.y - 180, (explosao.width - 600) * escalaNave, (explosao.height - 600) * escalaNave);
    });
}

function desenhaTiros() {
    tiros.forEach(function(tiro, index) {
        ctx.fillStyle = "Red";
        ctx.fillRect(tiro.x, tiro.y, tiro.largura, tiro.altura);
        tiro.y -= 5; 

        
        if (tiro.y < 0) {
            tiros.splice(index, 1);
        }
    });
}

function animaFundo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    if (velocidade !== null) {
        atualizaFundo();
        desenhaFundo();
        if (nave) nave.desenhar(); 
        desenhaNavesInimigas(); 
        desenhaTiros(); 
        requestAnimationFrame(animaFundo); 
    } else {
        desenhaFundo();
        desenhaNavesInimigas(); 
        desenhaTiros(); 
        ctx.font = "48px serif";
        ctx.fillStyle = "Red";
        ctx.fillText("FIM DE JOGO!", canvas.width / 2 - 150, canvas.height / 2);
    }
}

function atualizaFundo() {
    posY += velocidade;
    if (posY >= canvas.height) {
        posY = 0;
    }
}

function desenhaFundo() {
   
    ctx.drawImage(imgFundo, 0, 0, canvas.width, canvas.height);
    
   
    var y1 = posY;
    var y2 = posY - canvas.height;
    
    
    ctx.drawImage(imgFundo, 0, y1, canvas.width, canvas.height);
    ctx.drawImage(imgFundo, 0, y2, canvas.width, canvas.height);
}

function pararAnimacaoFundo() {
    velocidadeInimiga = null;
    velocidade = null;
    somTiro.currentTime = 1.0;
    somAcao.pause();
}


