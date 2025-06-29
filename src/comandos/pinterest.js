const axios = require ('axios');
const { MessageMedia } = require('whatsapp-web.js');

async function comandoPinterest (message, args) {
    const query = args.slice(1).join(' ');

    if (!query){
        return message.reply('Você precisa me dar mais detalhes sobre o que buscar! Ex: `!pinterest um dragão de Gelo`'); 
    }

    await message.reply(`🔎 Buscando imagens para *"${query}*..."`);

    try {
        const apiUrl = `http://localhost:5000/search?query=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.image_url){
            const imageUrl = response.data.image_url;
            console.log(`Enviando imagem do Pinterest: ${imageUrl}`);

            const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true});

            await message.reply(media, undefined, { caption: `Aqui está a imagem para: *${query}*`});
        }
        else {
            await message.reply(response.data.error || 'Não achei uma imagem para essa busca.');
        }

    } catch (error) {
        if (error.code === 'ECONNREFUSED'){
            return message.reply('❌ Meu serviço de busca de imagens não está operando no momento, por favor verifique a conexão!');
        }
        if (error.response && error.response.data && error.response.data.error) {
            return message.reply(`❌ Erro na busca: ${error.response.data.error}`);
        }
        console.error("Erro ao chamar a API de imagens:", error.message);
        await message.reply('❌ Ocorreu um erro inepserado ao tentar buscar a imagem.');
    }
}

module.exports = {
    comandoPinterest
};