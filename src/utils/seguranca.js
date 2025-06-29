const config = require ('../../config.json');

/**
 @param {string}
 @returns {boolean}
 */

 function isDono(authorId){
    return authorId === config.dono; 

 }

/**
 * @param {string}
 * @returns {boolean}
 */

function isGrupoAutorizado(chatId){
    return config.grupos_autorizados.includes(chatId);
}

/**
 * @param {object}
 * @param {string}
 * @returns {Promise<boolean>}
 */

async function isSenderAdmin(chat, authorId) {
    if (!chat.isGroup) return false; 
    const sender = chat.participants.find(p => p.id._serialized === authorId);
    return sender && sender.isAdmin;
}

/**
 * @param {object}
 * @param {string}
 * @returns {Promise<boolean>}
 */

async function isTargetAdmin(chat, targetId) {
    if (!chat.isGroup) return false;
    const target = chat.participants.find(p => p.id._serialized === targetId);
    return target && target.isAdmin;
}

module.exports = {
    isDono,
    isGrupoAutorizado,
    isSenderAdmin,
    isTargetAdmin
};