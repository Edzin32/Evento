function sprite(contexto,imagem,x,y,deslocamento){
this.contexto=contexto;

this.imagem=imagem;
this.x=x;
this.y=y;

this.deslocamento=deslocamento;
this.largura=this.imagem.width;
this.altura=this.imagem.height;

this.desenhar=function(){
    this.contexto.drawimage(this.x,this.y,this.largura,this.altura);

}
this.direita=function(){
    if(this.x<this.contexto.canvas.width-this.largura-this.deslocamento){
        this.x+=this.deslocamento;
    }
}
this.esquerda=function(){
    if(this.x>0){
        this.x-=this.deslocamento;
    }
}
this.subir=function(){
    if(this.y>0){
        this.y-=this.deslocamento;
    }
}
this.descer=function(){
    if(this.t<=this.contexto.canvas.height-this.altura-this.deslocamento){
        this.y+=this.deslocamento;
    }
}
}