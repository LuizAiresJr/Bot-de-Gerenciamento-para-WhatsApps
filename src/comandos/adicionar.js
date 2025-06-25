async function comandoAdicionar(message) {
    try {
        const chat = await message.getChat();

        if (!chat.isGroup) {
            return message.reply('Esse comando só funciona em grupos, chefe!!!');
        }

        const participants = chat.participants;
        const botIsAdmin = participants.some(participant => 
            participant.id._serialized === message.client.info.wid._serialized && 
            participant.isAdmin
        );

        if (!botIsAdmin) {
            return message.reply('Eu preciso ser Admin pra adicionar alguém! Manda assim: `!adicionar 5599999999999`');
        }

        const numero = message.body.split(' ')[1];
        
        if (!numero) {
            return message.reply('Você precisa mandar o numero assim: `!adicionar 5599999999999`');
        }

        const telefoneFormato = numero.replace(/\D/g, '') + '@c.us';

        try {
            // Esta linha já funciona para adicionar novos membros E readicionar banidos
            await chat.addParticipants([telefoneFormato]);
            return message.reply(`Membro ${numero} adicionado com sucesso!`);
        } catch (err) {
            console.error('Erro ao adicionar participante:', err);
            return message.reply(`Não consegui adicionar ${numero}. Talvez ele tenha restrição de privacidade.`);
        }
    } catch (error) {
        console.error('Erro no comandoAdicionar:', error);
        // Não envia mensagem adicional para não poluir o chat
    }
}

module.exports = {
    comandoAdicionar
};