const { Client, LocalAuth} = require ('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require ('fs');
const path = require ('path');

//Trás os comandos 

 const {

    comandoAniversario,
    comandoMeuAniversario,
    comandoProximoAniversario

 } = require ('./comandos/aniversario.js');

 const {
    comandoSticker
 } = require ('./comandos/sticker.js')

 const {
    comandoRemover
   } = require ('./comandos/removermembro.js')

   const {
      comandoAdicionar
   } = require ('./comandos/adicionar.js')

   const client = new Client ({
     authStrategy: new LocalAuth()
   }); 

   client.on('qr', (qr) => {

    console.log('📱 Escaneie o QR Code abaixo para logar:');
    qrcode.generate(qr, { small: true });

   });

   client.on('message', async (message) => {
      const texto = message.body.trim();
      const args = texto.split(' ');
      const comando = args[0].toLowerCase();

      if (comando === '!aniversario') {
            await comandoAniversario(message, args);
      }

      else if (comando === '!meuaniversario'){
            await comandoMeuAniversario(message);
      }

        else if (comando === '!proximoaniversario'){
                await comandoProximoAniversario(message);
        }

        else if (comando === '!remover') {
         await comandoRemover(message);
        }

         else if (comando === '!sticker') {
               await comandoSticker(message);
         }

         else if (comando === '!adicionar'){
            await comandoAdicionar(message);
         }

        //Futuros comandos entraram aqui

   });

   client.initialize();
