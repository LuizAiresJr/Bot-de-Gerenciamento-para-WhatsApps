const { MessageMedia } = require('whatsapp-web.js');
const sharp = require('sharp');

async function comandoSticker(message) {
    if (!message.hasMedia && !message.hasQuotedMsg) {
        return messsage.reply('📎 Para criar um sticker, envie uma imagem com o comando `!sticker` ou responda a uma imagem com o comando.');
    }

    try {

        await message.reply('Entendido! preparando o seu sticker... ⏳');

        const media = await (message.hasMedia ? message.downloadMedia() : (await message.getQuotedMessage()).downloadMedia());

        if (media && media.mimetype.includes('image')){
            const imageBuffer = Buffer.from(media.data, 'base64');

        const webpBuffer = await sharp(imageBuffer)
            .resize({ width: 512, height: 512, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0} })
            .toFormat('webp')
            .toBuffer();

        const mediaSticker = new MessageMedia('image/webp', webpBuffer.toString('base64'), 'sticker.webp');

        await message.reply(mediaSticker, undefined, {

            sendMediaAsSticker: true,
            stickerAuthor: 'Freya Bot ✨',
            dtickerName: 'Feito pela Madame'
        });

        } else if (media && media.mimetype.incluse('video')) {
            //No futuro talvez eu bote um suporte pra videos, mas por enquanto só imagens
            await message.reply('⚠️ Desculpe, ainda não consigo fazer stickers animados. Tente com uma imagem estática!');
        } else {
            await message.reply('⚠️ O arquivo que você enviou não é uma imagem válida.');
        }

    } catch (error) {
        console.error('Erro ao criar sticker:', error);
        await message.reply('❌ Ops! Algo deu errado e não consegui criar o sticker. Tente com outra imagem.');
    }
}

module.exports = {
    comandoSticker
};