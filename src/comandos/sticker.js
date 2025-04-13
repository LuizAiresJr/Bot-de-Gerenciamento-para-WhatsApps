const { MessageMedia } = require('whatsapp-web.js');


async function comandoSticker() {
    if (message.hasMedia) {
        const media = await MessageMedia.downloadMedia();
        
        await message.reply(media, null, {
            sendMediaAsSticker: true,
            stickAuthor: 'Freya ✨',
            stickerName: 'Figurinhas da madame'
        }); 
    } else {
        await message.reply('📎 Envie uma imagem ou GIF com o comando !sticker');
    }
    }

    module.exports = {
        comandoSticker
}