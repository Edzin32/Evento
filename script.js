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
var animacaoFundo; // Variável para controlar a animação do fundo
imgFundo.onload = animaFundo;

var velocidade = 1;
var nave;
var navesInimigas = []; // Array para múltiplas naves inimigas
var imgNaveInimiga = new Image();
imgNaveInimiga.src = "img/naveInimigo.png";
imgNaveInimiga.onload = criaNavesInimigas;

var escalaNave = 0.7; // Escala da nave principal
var escalaNaveInimiga = 0.7; // Escala da nave inimiga
var velocidadeInimiga = 2; // Velocidade da nave inimiga

var explosoes = []; // Array para armazenar explosões

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

    this.baixo = function() {
        if (this.y + velocidadeInimiga < this.contexto.canvas.height) {
            this.y += velocidadeInimiga;
        } else {
            this.y = -this.altura; // Reinicia a posição da nave inimiga
            this.x = Math.random() * (this.contexto.canvas.width - this.largura); // Novo x aleatório
        }
    };

    this.desparo=function(){
        this.contexto.fillStyle = "red"; 
        this.contexto.fillReact(this.x,this.y,500,500)
    }
}

function criaNavesInimigas() {
    for (var i = 0; i < 5; i++) { // Ajuste o número de naves inimigas conforme necessário
        var x = Math.random() * (canvas.width - imgNaveInimiga.width * escalaNaveInimiga);
        var y = Math.random() * -canvas.height; // Posição inicial acima do canvas
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
        }else if(tecla==="spacear"){
            nave.disparo();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        desenhaFundo();
        if (nave) nave.desenhar();
        desenhaNavesInimigas();
    });
}

function colidiu(nave, inimigo) {
    return (
        nave.x < inimigo.x + inimigo.largura &&
        nave.x + nave.largura > inimigo.x &&
        nave.y < inimigo.y + inimigo.altura &&
        nave.y + nave.altura > inimigo.y
    );
}

function desenhaNavesInimigas() {
    navesInimigas.forEach(function(naveInimiga) {
        naveInimiga.baixo();
        naveInimiga.desenhar();
        if (nave && colidiu(nave, naveInimiga)) {
            // Adiciona a explosão na posição da nave
            explosoes.push({x: nave.x, y: nave.y});
            nave = null; // Remove a nave principal se houver colisão

            // Remove a explosão após um tempo
            setTimeout(function() {
                explosoes.shift();
            }, 500); // 500 ms para desaparecer a explosão
            
            pararAnimacaoFundo(); // Chama a função para parar a animação do fundo
        }
    });

    // Desenha as explosões
    explosoes.forEach(function(explosaoPos) {
        ctx.drawImage(explosao, explosaoPos.x-115, explosaoPos.y-180, (explosao.width-600) * escalaNave, (explosao.height-600) * escalaNave);
    });
}

function animaFundo() {
    atualizaFundo();
    desenhaFundo();
    if (nave) nave.desenhar(); // Desenha a nave após desenhar o fundo
    desenhaNavesInimigas(); // Desenha e atualiza as naves inimigas
    animacaoFundo = requestAnimationFrame(animaFundo); // Continua a animação do fundo
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

function pararAnimacaoFundo() {
    cancelAnimationFrame(animacaoFundo); // Para a animação do fundo
}
