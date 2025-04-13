async function comandoRemover(message) {
    const chat = await message.getChat(); 

    if (!chat.isGroup) {
    return message.reply('Ei chefe essa ordem só pode ser usada nos grupos!!!');
        }

 const botId = message.to; 
 const botInfo = await chat.getParticipantById(botId);

   if (!botInfo || !botInfo.isAdmin) {
    return message.reply('Pra eu poder chutar ele pra fora eu preciso ser admin, entendeu? 😤 ');
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
                await message.reply(`Foi mal, mas não consegiui remover ${id}.`);
            }
        }
        
        return message.reply('Bucha removido com sucesso! 🤭');
    }
    
    //informou um numero, tenta remover com base nele 
    if (numero){ 
        const membro = chat.participants.find(p => p.id.user === numero);   

        if (!membro){
            return message.reply('Membro não encontrado no grupo!');
        }

        try {
            await chat.removeParticipants([membro.id._serialized || membro.id]);
            return message.reply(`Esse bucha ${numero} foi banido!!! `);

        } catch (err) {
            console.log('Erro ao remover membro:', err);
            return message.reply(`Desculpa chefe não consegui remover ${numero}.`);
        }
    
    }

    // Se não houver menções e nenhum número, avisa o usuário
    return message.reply('Digita o numero ou marca alguém depois de escrever o comando, por favor!!!');

}
