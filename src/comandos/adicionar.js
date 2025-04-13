async function comandoAdicionar(message) {
    const chat = await message.getChat();

    if (!chat.isGroup) {
        return message.reply('Esse comanodo só funciona em grupos, chefe!!!');
    }

    const botId = message.to;
    const botInfo = await chat.getParticipantById(botId);

    if (!botInfo || !botInfo.isAdmin) {
        return message.reply('Eu preciso ser Admin pra adicionar alguém! Manda assim: `!adicionaer 5599999999999`');
    }

    //Pega o numero da mensagem
    const numero = message.body.split(' ')[1];
    if (!numero){
        return message.reply('Você precisa mandar o numero assim: `!adicionar 5599999999999`');
    }

    //Olha e formata o número corretamente
    const telefoneFormato = numero.replace(/\D/g, '') + '@c.us';

    try {
        await chat.addParticipants([telefoneFormatado]);
        return message.reply(`Membro ${numero} adicioando com sucesso!`);
    }
    catch (err){
        console.error('Erro ao adicionar participante:', err);
        return message.reply(`Não consegui adiconar ${numero}. Talvez ele tenha restrição de privacidade ou saiu do grupo recentemente`);    
    }

}