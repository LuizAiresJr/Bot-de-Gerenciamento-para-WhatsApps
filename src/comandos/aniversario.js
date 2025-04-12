const fs = require('fs');
const path = require('path');

const aniversariosPath = path.join(__dirname, '../../aniversarios.json');

function carregarAniversarios() {
    if (!fs.existsSync(aniversariosPath)) return {};
    return JSON.parse(fs.readFileSync(aniversariosPath));
}

function salvarAniversarios(dados) {
    fs.writeFileSync(aniversariosPath, JSON.stringify(dados, null, 2));
}

async function comandoAniversario(message, args) {
    const aniversarios = carregarAniversarios();
    const idUsuario = message.author || message.from;

    if (args.length < 2) {
        return message.reply('Por favor, use: !aniversario DD/MM/AAAA');
    }

    const data = args[1];
    const [dia, mes, ano] = data.split('/').map(Number);

    if (!dia || !mes || !ano) {
        return message.reply('Errou Bobão!! Usa esse formato DD/MM/AAAA');
    }

    aniversarios[idUsuario] = {
        nome: message._data?.notifyName || 'Usuário',
        data: `${ano}-${mes}-${dia}`
    };

    salvarAniversarios(aniversarios);
    return message.reply('Aniversário salvo com sucesso! 🎉');
}

async function comandoMeuAniversario(message) {
    const aniversarios = carregarAniversarios();
    const idUsuario = message.author || message.from;
    const dados = aniversarios[idUsuario];

    if (!dados) {
        return message.reply('Você não cadastrou seu aniversário! Use: !aniversario DD/MM/AAAA');
    }

    const hoje = new Date();
    const nascimento = new Date(dados.data);
    const proximo = new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate());

    if (proximo < hoje) proximo.setFullYear(hoje.getFullYear() + 1);

    const idade = proximo.getFullYear() - nascimento.getFullYear();
    const diasRestantes = Math.ceil((proximo - hoje) / (1000 * 60 * 60 * 24));

    return message.reply(`Seu aniversário é dia ${nascimento.toLocaleDateString()}! 🎂\nFaltam ${diasRestantes} dias e você fará ${idade} anos!`);
}

async function comandoProximoAniversario(message) {
    const aniversarios = carregarAniversarios();
    const hoje = new Date();
    let proximo = null;
    let menorDiff = Infinity;
    let nome = '';
    let idade = 0;

    for (let [id, { nome: n, data }] of Object.entries(aniversarios)) {
        const nascimento = new Date(data);
        const prox = new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate());
        if (prox < hoje) prox.setFullYear(hoje.getFullYear() + 1);

        const diff = prox - hoje;
        if (diff < menorDiff) {
            menorDiff = diff;
            proximo = prox;
            nome = n;
            idade = prox.getFullYear() - nascimento.getFullYear();
        }
    }

    if (!proximo) {
        return message.reply('Nenhum aniversário cadastrado ainda.');
    }

    const dias = Math.ceil(menorDiff / (1000 * 60 * 60 * 24));
    return message.reply(`🎉 O próximo aniversário é de ${nome}!\nFaltam ${dias} dias e essa pessoa fará ${idade} anos!`);
}

module.exports = {
    comandoAniversario,
    comandoMeuAniversario,
    comandoProximoAniversario,
};
