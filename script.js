
 canvas = document.getElementById("canv");
     ctx = canvas.getContext("2d");

     imgNave = new Image();
    imgNave.src = "image.png";
    imgNave.onload = criaNave;

    function Sprite(contexto, imagem, x, y, deslocamento) {
        this.contexto = contexto;
        this.imagem = imagem;
        this.x = x;
        this.y = y;
        this.deslocamento = deslocamento;
        this.largura = this.imagem.width;
        this.altura = this.imagem.height;

        this.desenhar = function() {
            this.contexto.drawImage(this.imagem, this.x, this.y-177, this.largura-80, this.altura-80);
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
            if (this.y-180 > 0) {
                this.y -= this.deslocamento;
            }
        };

        this.descer = function() {
            if (this.y-177 <= this.contexto.canvas.height - this.altura - this.deslocamento) {
                this.y += this.deslocamento;
            }
        };
    }

    function criaNave() {
         nave = new Sprite(ctx, imgNave, canvas.width / 2 - imgNave.width / 2, canvas.height - imgNave.height,20);
        nave.desenhar();

        document.addEventListener("keydown", function(evento) {
             tecla = evento.key;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (tecla === "ArrowLeft") {
                nave.esquerda();
            } else if (tecla === "ArrowRight") {
                nave.direita();
            } else if (tecla === "ArrowUp") {
                nave.subir();
            } else if (tecla === "ArrowDown") {
                nave.descer();
            }
            nave.desenhar();
        });
    }

