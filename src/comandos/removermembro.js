const { isSenderAdmin, isTargetAdmin } = require('../utils/seguranca.js');

async function comandoRemover(message, args) {
    try {
        const chat = await message.getChat();

        if (!chat.isGroup) {
            return message.reply('Este comando só pode ser usado em grupos!');
        }

        if (!await isSenderAdmin(chat, message.author)) {
            return message.reply("❌ Apenas administradores do grupo podem remover membros.");
        }
        
        const botParticipant = chat.participants.find(p => p.id._serialized === message.client.info.wid._serialized);
        if (!botParticipant || !botParticipant.isAdmin) {
            return message.reply('Pra eu poder remover alguém, eu também preciso ser admin do grupo! 😤');
        }

        const numeroParaRemover = args[1];
        const mencionados = await message.getMentions();

        if (mencionados && mencionados.length > 0) {
            const removidos = [];
            const protegidos = [];

            for (const contato of mencionados) {
                const idMencionado = contato.id._serialized;

                if (await isTargetAdmin(chat, idMencionado)) {
                    protegidos.push(contato.pushname || idMencionado.split('@')[0]);
                } else {
                    await chat.removeParticipants([idMencionado]);
                    removidos.push(contato.pushname || idMencionado.split('@')[0]);
                }
            }

            let resposta = '';
            if (removidos.length > 0) {
                resposta += `Buxa(s) removidos(s): ${removidos.join(', ')}.\n`;
            }
            if (protegidos.length > 0) {
                resposta += `Não posso remover: ${protegidos.join(', ')}, pois são administradores.`;
            }
            return message.reply(resposta.trim());
        }

        if (numeroParaRemover) {
            const idFormatado = numeroParaRemover.replace(/\D/g, '') + '@c.us';

            if (await isTargetAdmin(chat, idFormatado)) {
                return message.reply(`😠 Não posso remover este número, pois ele pertence a um administrador!`);
            }

            try {
                const resultado = await chat.removeParticipants([idFormatado]);
                if (resultado.status === 200) {
                    return message.reply(`O buxa ${numeroParaRemover} foi banido!`);
                } else {
                    return message.reply(`Não consegui remover ${numeroParaRemover}. Verifique o número ou se ele realmente está no grupo.`);
                }
            } catch (err) {
                return message.reply(`Não encontrei o membro com o número ${numeroParaRemover} no grupo.`);
            }
        }

        return message.reply('Para remover, marque um ou mais membros ou digite o número após o comando. Ex: `!remover @membro` ou `!remover 5511...`');

    } catch (error) {
        console.error('Erro no comandoRemover:', error);
        message.reply('❌ Ocorreu um erro inesperado ao tentar executar este comando.');
    }
}

module.exports = {
    comandoRemover
};