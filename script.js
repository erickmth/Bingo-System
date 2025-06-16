// Lista de imagens temáticas de festa junina
const imagens = [
    { nome: "milho", arquivo: "milho.png" },
    { nome: "fogueira", arquivo: "fogueira.png" },
    { nome: "balão", arquivo: "balão.png" },
    { nome: "chapéu", arquivo: "chapéu.png" },
    { nome: "paçoca", arquivo: "paçoca.png" },
    { nome: "quentão", arquivo: "quentão.png" },
    { nome: "canjica", arquivo: "canjica.png" },
    { nome: "bandeirinha", arquivo: "bandeirinha.png" },
    { nome: "sanfona", arquivo: "sanfona.png" },
    { nome: "quadrilha", arquivo: "quadrilha.png" },
    { nome: "pé-de-moleque", arquivo: "pé-de-moleque.png" },
    { nome: "cuscuz", arquivo: "cuscuz.png" },
    { nome: "pinhão", arquivo: "pinhão.png" },
    { nome: "Bolo de Fubá", arquivo: "bolo.png" },
    { nome: "cocada", arquivo: "cocada.png" },
    { nome: "Curau", arquivo: "curau.png" },
    { nome: "casal caipira", arquivo: "casal.png" },
    { nome: "pescaria", arquivo: "pescaria.png" },
    { nome: "argola", arquivo: "argola.png" },
    { nome: "corrida de saco", arquivo: "corrida-de-saco.png" },
    { nome: "pau de sebo", arquivo: "pau-de-sebo.png" },
    { nome: "tiro ao alvo", arquivo: "tiro-ao-alvo.png" },
    { nome: "boca do palhaço", arquivo: "boca-do-palhaço.png" },
    { nome: "Espantalho", arquivo: "espantalho.png" },
    { nome: "tecido", arquivo: "tecido.png" },
    { nome: "arroz doce", arquivo: "arroz.png" },
    { nome: "maçã do amor", arquivo: "maca-do-amor.png" },
    { nome: "pipoca", arquivo: "pipoca.png" },
    { nome: "cachorro-quente", arquivo: "cachorro-quente.png" },
    { nome: "bingo", arquivo: "bingo.png" }
];

let sorteados = [];
let vencedores = [];

// Elementos do DOM
const btnSortear = document.getElementById('btnSortear');
const btnBingo = document.getElementById('btnBingo');
const imagemSorteada = document.getElementById('imagemSorteada');
const listaSorteados = document.getElementById('listaSorteados');
const vencedor1 = document.getElementById('vencedor1');
const vencedor2 = document.getElementById('vencedor2');
const vencedor3 = document.getElementById('vencedor3');
const itensSorteadosLista = document.getElementById('itensSorteadosLista');
const pesquisaItem = document.getElementById('pesquisaItem');

// Elementos do popup
const bingoPopup = document.getElementById('bingoPopup');
const closePopup = document.querySelector('.close-popup');
const confirmarBingo = document.getElementById('confirmarBingo');
const vencedorNomeInput = document.getElementById('vencedorNome');

// Sortear imagem
btnSortear.addEventListener('click', () => {
    if (sorteados.length === imagens.length) {
        alert('Todas as imagens já foram sorteadas!');
        return;
    }

    let sorteado;
    do {
        sorteado = Math.floor(Math.random() * imagens.length);
    } while (sorteados.includes(sorteado));

    sorteados.push(sorteado);
    const imgItem = imagens[sorteado];

    // Mostra a imagem sorteada
    imagemSorteada.innerHTML = `<img src="imagens/${imgItem.arquivo}" alt="${imgItem.nome}">`;

    // Atualiza o histórico (apenas os 3 últimos)
    atualizarHistorico();
});

// Registrar Bingo - Abre o popup
btnBingo.addEventListener('click', () => {
    if (sorteados.length === 0) {
        alert('Nenhum item foi sorteado ainda!');
        return;
    }
    bingoPopup.style.display = 'flex';
    vencedorNomeInput.focus();
    atualizarItensSorteados(); // Atualiza a lista quando o popup abre
});

// Fechar popup
closePopup.addEventListener('click', () => {
    bingoPopup.style.display = 'none';
    vencedorNomeInput.value = '';
});

// Confirmar bingo
confirmarBingo.addEventListener('click', () => {
    const nome = vencedorNomeInput.value.trim();
    if (nome === '') {
        alert('Por favor, digite o nome do vencedor!');
        return;
    }
    
    vencedores.push(nome);
    atualizarVencedores();
    bingoPopup.style.display = 'none';
    vencedorNomeInput.value = '';
});

// Fechar ao clicar fora do popup
window.addEventListener('click', (e) => {
    if (e.target === bingoPopup) {
        bingoPopup.style.display = 'none';
        vencedorNomeInput.value = '';
    }
});

// Pesquisar itens
pesquisaItem.addEventListener('input', () => {
    atualizarItensSorteados();
});

function atualizarHistorico() {
    // Limpa a lista
    listaSorteados.innerHTML = '';
    
    // Pega os últimos 3 itens (ou menos se não houver 3)
    const ultimosTres = sorteados.slice(-3).reverse();
    
    // Adiciona os itens no histórico
    ultimosTres.forEach(index => {
        const imgItem = imagens[index];
        const item = document.createElement('div');
        item.className = 'item-sorteado';
        item.innerHTML = `<img src="imagens/${imgItem.arquivo}" alt="${imgItem.nome}">`;
        listaSorteados.appendChild(item);
    });
}

function atualizarItensSorteados() {
    // Limpa a lista
    itensSorteadosLista.innerHTML = '';
    
    const termoPesquisa = pesquisaItem.value.toLowerCase();
    
    // Filtra os itens sorteados baseado na pesquisa
    const itensFiltrados = sorteados.filter(index => {
        const item = imagens[index];
        return item.nome.toLowerCase().includes(termoPesquisa);
    });
    
    // Adiciona os itens na lista
    if (itensFiltrados.length > 0) {
        itensFiltrados.forEach(index => {
            const imgItem = imagens[index];
            const item = document.createElement('div');
            item.className = 'item-sorteado-popup';
            item.innerHTML = `
                <img src="imagens/${imgItem.arquivo}" alt="${imgItem.nome}">
                <span>${imgItem.nome}</span>
            `;
            itensSorteadosLista.appendChild(item);
        });
    } else if (termoPesquisa !== '') {
        // Mostra mensagem de não encontrado apenas se houver termo de pesquisa
        const mensagem = document.createElement('div');
        mensagem.className = 'nao-encontrado';
        mensagem.textContent = 'Não encontrado...';
        itensSorteadosLista.appendChild(mensagem);
    }
}

function atualizarVencedores() {
    // Atualiza apenas os 3 primeiros lugares
    if (vencedores.length >= 1) {
        vencedor1.textContent = `1º Lugar🥇 ${vencedores[0]}`;
    }
    if (vencedores.length >= 2) {
        vencedor2.textContent = `2º Lugar🥈 ${vencedores[1]}`;
    }
    if (vencedores.length >= 3) {
        vencedor3.textContent = `3º Lugar🥉 ${vencedores[2]}`;
    }
}

// Inicializa o display
atualizarHistorico();