async function comandoPainel(message){
    const textoPainel = `
    ✨ *Painel de Comandos da Freya* ✨
    _Aqui está tudo o que eu consigo fazer no momento:_

    *- LISTA DE COMANDOS -*
    \`!painel\`
    _Mostra esta lista de comandos._

    \`!sticker\`
    _Responda a uma imagem ou envie com a legenda para transformá-la em figurinha._

    \`!adicionar <número>\`
    _Adiciona uma ou mais pessoas pessoas no grupo. Use o número no formato: 5599999999999._

    \`!remover @membro\`
    _Remove um membro marcando-o._

    \`!aniversario <dd/mm>\`
    _Salva o seu aniversário._

    \`!meuaniversario\`
    _Mostra quanto tempo falta para o seu aniversário._

    \`!proximoaniversario\`
    _Mostra o próximo aniversário do grupo._

        \`!pinterest\`
    _Envia uma imagem do Pinterest de acordo com o que pedem._

    `;

    await message.reply(textoPainel.trim()); 

}

module.exports = {
    comandoPainel
};