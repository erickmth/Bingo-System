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

const TOTAL = imagens.length; // 30
const CIRCUMFERENCE = 2 * Math.PI * 118; // ≈ 741.1

let sorteados = [];
let vencedores = [];

// Elementos do DOM
const btnSortear        = document.getElementById('btnSortear');
const btnBingo          = document.getElementById('btnBingo');
const imagemSorteada    = document.getElementById('imagemSorteada');
const listaSorteados    = document.getElementById('listaSorteados');
const itensSorteadosLista = document.getElementById('itensSorteadosLista');
const pesquisaItem      = document.getElementById('pesquisaItem');
const itemName          = document.getElementById('itemName');
const headerCount       = document.getElementById('headerCount');
const ringFill          = document.getElementById('ringFill');

// Popup
const bingoPopup        = document.getElementById('bingoPopup');
const closePopup        = document.querySelector('.close-popup');
const confirmarBingo    = document.getElementById('confirmarBingo');
const vencedorNomeInput = document.getElementById('vencedorNome');

// ─── Sortear ───────────────────────────────────────
btnSortear.addEventListener('click', () => {
    if (sorteados.length === TOTAL) {
        alert('Todas as imagens já foram sorteadas!');
        return;
    }

    let idx;
    do { idx = Math.floor(Math.random() * TOTAL); }
    while (sorteados.includes(idx));

    sorteados.push(idx);
    const imgItem = imagens[idx];

    // Imagem
    imagemSorteada.innerHTML = `<img src="imagens/${imgItem.arquivo}" alt="${imgItem.nome}">`;

    // Nome do item
    itemName.textContent = imgItem.nome;

    // Contador header
    headerCount.textContent = sorteados.length;

    // Anel de progresso
    const progress = sorteados.length / TOTAL;
    const offset   = CIRCUMFERENCE * (1 - progress);
    ringFill.style.strokeDashoffset = offset;

    atualizarHistorico();
});

// ─── Abrir popup BINGO ─────────────────────────────
btnBingo.addEventListener('click', () => {
    if (sorteados.length === 0) {
        alert('Nenhum item foi sorteado ainda!');
        return;
    }
    bingoPopup.style.display = 'flex';
    vencedorNomeInput.focus();
    atualizarItensSorteados();
});

// ─── Fechar popup ──────────────────────────────────
closePopup.addEventListener('click', fecharPopup);
window.addEventListener('click', e => { if (e.target === bingoPopup) fecharPopup(); });

function fecharPopup() {
    bingoPopup.style.display = 'none';
    vencedorNomeInput.value = '';
}

// ─── Confirmar bingo ───────────────────────────────
confirmarBingo.addEventListener('click', () => {
    const nome = vencedorNomeInput.value.trim();
    if (!nome) { alert('Por favor, digite o nome do vencedor!'); return; }
    vencedores.push(nome);
    atualizarVencedores();
    fecharPopup();
});

// ─── Pesquisa no popup ────────────────────────────
pesquisaItem.addEventListener('input', atualizarItensSorteados);

// ─── Histórico (últimos 3) ────────────────────────
function atualizarHistorico() {
    listaSorteados.innerHTML = '';
    sorteados.slice(-3).reverse().forEach(index => {
        const imgItem = imagens[index];
        const item = document.createElement('div');
        item.className = 'item-sorteado';
        item.innerHTML = `<img src="imagens/${imgItem.arquivo}" alt="${imgItem.nome}">`;
        listaSorteados.appendChild(item);
    });
}

// ─── Itens no popup ───────────────────────────────
function atualizarItensSorteados() {
    itensSorteadosLista.innerHTML = '';
    const termo = pesquisaItem.value.toLowerCase();
    const filtrados = sorteados.filter(i => imagens[i].nome.toLowerCase().includes(termo));

    if (filtrados.length > 0) {
        filtrados.forEach(index => {
            const imgItem = imagens[index];
            const item = document.createElement('div');
            item.className = 'item-sorteado-popup';
            item.innerHTML = `<img src="imagens/${imgItem.arquivo}" alt="${imgItem.nome}"><span>${imgItem.nome}</span>`;
            itensSorteadosLista.appendChild(item);
        });
    } else if (termo) {
        const msg = document.createElement('div');
        msg.className = 'nao-encontrado';
        msg.textContent = 'Não encontrado...';
        itensSorteadosLista.appendChild(msg);
    }
}

// ─── Vencedores (local) ───────────────────────────
function atualizarVencedores() {
    const n1 = document.getElementById('nome1');
    const n2 = document.getElementById('nome2');
    const n3 = document.getElementById('nome3');
    if (vencedores.length >= 1) n3.textContent = vencedores[vencedores.length-1];
    if (vencedores.length >= 2) n2.textContent = vencedores[vencedores.length-2];
    if (vencedores.length >= 3) n1.textContent = vencedores[vencedores.length-3];
}

// Init
atualizarHistorico();
