async function comandoRemover(message) {
    try {
        const chat = await message.getChat(); 

        if (!chat.isGroup) {
            return message.reply('Ei chefe essa ordem só pode ser usada nos grupos!!!');
        }

        const botId = message.client.info.wid._serialized;
        const botParticipant = chat.participants.find(p => p.id._serialized === botId);

        if (!botParticipant || !botParticipant.isAdmin) {
            return message.reply('Pra eu poder chutar ele pra fora eu preciso ser admin, entendeu? 😤');
        }

        const args = message.body.split(' ');
        const numero = args[1];

        //Se existir menções, vai remover os mencionados
        if (message.mentionedIds && message.mentionedIds.length > 0) {
            for (const id of message.mentionedIds) {
                try {
                    await chat.removeParticipants([id]);
                } catch (err) {
                    console.log('Erro ao remover membro mencionado:', err);
                }
            }
            
            return message.reply('Bucha removido com sucesso! 🤭');
        }
        
        //informou um numero, tenta remover com base nele 
        if (numero){ 
            const numeroFormatado = numero.replace(/\D/g, '') + '@c.us';
            const membro = chat.participants.find(p => p.id._serialized === numeroFormatado);   

            if (!membro){
                return message.reply('Membro não encontrado no grupo!');
            }

            await chat.removeParticipants([membro.id._serialized]);
            return message.reply(`Esse buxa ${numero} foi banido!!!`);
        }

        // Se não houver menções e nenhum número, avisa o usuário
        return message.reply('Digita o numero ou marca alguém depois de escrever o comando, por favor!!!');

    } catch (error) {
        console.error('Erro no comandoRemover:', error);
        // Não envia mensagem de erro para não poluir o chat
    }
}

module.exports = {
    comandoRemover
};