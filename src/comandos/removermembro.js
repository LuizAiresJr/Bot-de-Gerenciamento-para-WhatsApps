async function comandoRemover(message) {
    const chat = await message.getChat(); 

if (!chat.isgroup) {
    return message.reply('ei chefe essa ordem só pode ser usada nos grupos!!!');
}

const botId = message.to; 
const botInfo = await chat.getparticipantById(botId);
if (!botInfo.isAdmin) {
    return message.reply('Para eu poder mandar ele pro vasco eu preciso de adm, entendeu?');
}

if (message.metionedIds.lenght === 0){
    return message.reply('Amigo(a) marca a pessoa ai para eu poder remover.');
}

        //Remove os mencioandos e retorna se tiver algum erro
    for (const id of message.mentionedIds) {
        try {
            await chat.removeParticipants([id]);
        } catch (err) {
            console.log('Erro ao remover membro:', err);
            await messsage.reply('Foi mal mas não consegui remover ${id}.');
        }
    }

    await message.reply('Um buxa removido com sucesso!!!🤭');

}

//     const args = message.body.split(' ');
//     const numero = args[1]; // Número do membro a ser removido
//     const membro = chat.participants.find(p => p.id.user === numero);

//     if (!membro) {
//         return message.reply('Membro não encontrado no grupo!');
//     }

//     await chat.removeParticipants([membro.id]);
//     return message.reply(`Membro ${numero} removido com sucesso!`);
