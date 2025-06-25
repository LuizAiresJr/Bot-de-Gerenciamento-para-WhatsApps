const { Client, LocalAuth} = require ('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require ('fs');
const path = require ('path');

//sisteam vai puxar os comandos 

 const {

      comandoAniversario,
      comandoMeuAniversario,
      comandoProximoAniversario

 } = require ('./src/comandos/aniversario')

 const {

      comandoRemover

 } = require ('./src/comandos/removermembro');

   const {

      comandoAdicionar

   } = require ('./src/comandos/adicionar');

   const {

      comandoSticker

   } = require ('./src/comandos/sticker');

 const comandos = {

   '!aniversario': comandoAniversario,
   '!meuaniversario': comandoMeuAniversario,
   '!proximoaniversario': comandoProximoAniversario,
   '!remover': comandoRemover,
   '!sticker': comandoSticker,
   '!adicionar': comandoAdicionar,

 };

   const client = new Client ({
     authStrategy: new LocalAuth(),
     puppeteer: {
      headless:true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
     }
   }); 

   process.on('unhandledRejection', (error) => {
      console.error('Erro não tratado:', error);
   });

   client.on('qr', (qr) => {
      console.log('📱 Escaneie o QR Code abaixo para logar:');
      qrcode.generate(qr, { small: true }, function (qrcode) {
      console.log(qrcode);
    });
    
   });

   client.on('ready', () =>{
      console.log('Freya está online!!!');
   });

   client.on('message', async (message) => {

      try {
      const texto = message.body.trim();
      const args = texto.split(' ');
      const comandoNome = args[0].toLowerCase();

      if (comandos[comandoNome]){
         console.log(`Executando comando: ${comandoNome}`);
         await comandos[comandoNome](message, args);
      } 
   }   catch (error) {
         console.error(`Erro ao processar o comando:`, error);
      }

   });

   client.initialize().catch(error => {
    console.error('Falha na inicialização:', error);
});