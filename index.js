const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
    },
});

const aniversariosPath = path.join(__dirname, 'aniversarios.json');

function carregarAniversarios() {
    if (!fs.existsSync(aniversariosPath)) return {};
    return JSON.parse(fs.readFileSync(aniversariosPath));
}

function salvarAniversarios(dados) {
    fs.writeFileSync(aniversariosPath, JSON.stringify(dados, null, 2));
}

client.on('qr', (qr) => {
    console.log('Escaneie o QR Code com o seu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Freya está online e pronta para agir!');
});

client.on('message', async (message) => {
    const msg = message.body.trim().toLowerCase();
    const args = message.body.trim().split(" ");
    const aniversarios = carregarAniversarios();
    const idUsuario = message.author || message.from;

    // Responde a "Oi"
    if (msg === 'oi') {
        return await message.reply('Oi, humano ♡ Freya está à sua disposição!');
    }

    // Cadastrar aniversário
    if (msg.startsWith('!aniversario')) {
        if (args.length < 2) {
            return message.reply('Por favor, use: !aniversario DD/MM/AAAA');
        }

        const data = args[1];
        const [dia, mes, ano] = data.split('/').map(Number);

        if (!dia || !mes || !ano) {
            return message.reply('Data inválida. Use o formato DD/MM/AAAA');
        }

        aniversarios[idUsuario] = {
            nome: message._data.notifyName || 'Usuário',
            data: `${ano}-${mes}-${dia}`
        };

        salvarAniversarios(aniversarios);
        return message.reply('Aniversário salvo com sucesso! 🎉');
    }

    // Ver meu aniversário
    if (msg === '!meuaniversario') {
        const dados = aniversarios[idUsuario];
        if (!dados) return message.reply('Você ainda não cadastrou seu aniversário. Use: !aniversario DD/MM/AAAA');

        const hoje = new Date();
        const nascimento = new Date(dados.data);
        const proximo = new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate());

        if (proximo < hoje) proximo.setFullYear(hoje.getFullYear() + 1);

        const idade = proximo.getFullYear() - nascimento.getFullYear();
        const diasRestantes = Math.ceil((proximo - hoje) / (1000 * 60 * 60 * 24));

        return message.reply(`Seu aniversário é dia ${nascimento.toLocaleDateString()}! 🎂\nFaltam ${diasRestantes} dias e você fará ${idade} anos!`);
    }

    // Ver próximo aniversariante
    if (msg === '!proximoaniversario') {
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

        if (!proximo) return message.reply('Nenhum aniversário foi cadastrado ainda.');

        const dias = Math.ceil(menorDiff / (1000 * 60 * 60 * 24));
        return message.reply(`🎉 O próximo aniversário é de ${nome}!\nFaltam ${dias} dias e essa pessoa fará ${idade} anos.`);
    }
});

client.initialize();
