// ─── Lista de imagens temáticas de festa junina ──────────────────────────────
const imagens = [
    { nome: "milho",             arquivo: "milho.png" },
    { nome: "fogueira",          arquivo: "fogueira.png" },
    { nome: "balão",             arquivo: "balão.png" },
    { nome: "chapéu",            arquivo: "chapéu.png" },
    { nome: "paçoca",            arquivo: "paçoca.png" },
    { nome: "quentão",           arquivo: "quentão.png" },
    { nome: "canjica",           arquivo: "canjica.png" },
    { nome: "bandeirinha",       arquivo: "bandeirinha.png" },
    { nome: "sanfona",           arquivo: "sanfona.png" },
    { nome: "quadrilha",         arquivo: "quadrilha.png" },
    { nome: "pé-de-moleque",     arquivo: "pé-de-moleque.png" },
    { nome: "cuscuz",            arquivo: "cuscuz.png" },
    { nome: "pinhão",            arquivo: "pinhão.png" },
    { nome: "bolo de fubá",      arquivo: "bolo.png" },
    { nome: "cocada",            arquivo: "cocada.png" },
    { nome: "curau",             arquivo: "curau.png" },
    { nome: "casal caipira",     arquivo: "casal.png" },
    { nome: "pescaria",          arquivo: "pescaria.png" },
    { nome: "argola",            arquivo: "argola.png" },
    { nome: "corrida de saco",   arquivo: "corrida-de-saco.png" },
    { nome: "pau de sebo",       arquivo: "pau-de-sebo.png" },
    { nome: "tiro ao alvo",      arquivo: "tiro-ao-alvo.png" },
    { nome: "boca do palhaço",   arquivo: "boca-do-palhaço.png" },
    { nome: "espantalho",        arquivo: "espantalho.png" },
    { nome: "tecido",            arquivo: "tecido.png" },
    { nome: "arroz doce",        arquivo: "arroz.png" },
    { nome: "maçã do amor",      arquivo: "maca-do-amor.png" },
    { nome: "pipoca",            arquivo: "pipoca.png" },
    { nome: "cachorro-quente",   arquivo: "cachorro-quente.png" },
    { nome: "bingo",             arquivo: "bingo.png" }
];

const TOTAL = imagens.length; // 30
// r=145, circumference = 2π×145 ≈ 911.1
const CIRCUMFERENCE = 2 * Math.PI * 145;

let sorteados  = [];
let vencedores = [];

// Elementos do DOM
const btnSortear          = document.getElementById('btnSortear');
const btnBingo            = document.getElementById('btnBingo');
const imagemSorteada      = document.getElementById('imagemSorteada');
const listaSorteados      = document.getElementById('listaSorteados');
const itensSorteadosLista = document.getElementById('itensSorteadosLista');
const pesquisaItem        = document.getElementById('pesquisaItem');
const itemName            = document.getElementById('itemName');
const headerCount         = document.getElementById('headerCount');
const ringFill            = document.getElementById('ringFill');

// Popup Bingo
const bingoPopup        = document.getElementById('bingoPopup');
const closePopupBtn     = document.querySelector('.close-popup');
const confirmarBingo    = document.getElementById('confirmarBingo');
const vencedorNomeInput = document.getElementById('vencedorNome');

// Confirm modal
const confirmModal   = document.getElementById('confirmModal');
const confirmTitle   = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const confirmOk      = document.getElementById('confirmOk');
const confirmCancel  = document.getElementById('confirmCancel');

// Toast container
const toastContainer = document.getElementById('toastContainer');

// ─── Toast notifications ──────────────────────────────────────────────────────
const ICON_MAP = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error:   `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
};

function showToast(message, type = 'info', duration = 3200) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${ICON_MAP[type] || ICON_MAP.info}</span>
        <span class="toast-msg">${message}</span>
    `;
    toastContainer.appendChild(toast);

    const remove = () => {
        toast.classList.add('toast-out');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    const timer = setTimeout(remove, duration);
    toast.addEventListener('click', () => { clearTimeout(timer); remove(); });
}

// ─── Custom confirm modal ─────────────────────────────────────────────────────
function showAlert(title, message) {
    return new Promise(resolve => {
        confirmTitle.textContent   = title;
        confirmMessage.textContent = message;
        confirmCancel.style.display = 'none';
        confirmModal.style.display  = 'flex';

        const ok = () => {
            confirmModal.style.display = 'none';
            confirmOk.removeEventListener('click', ok);
            resolve(true);
        };
        confirmOk.addEventListener('click', ok);
    });
}

confirmModal.addEventListener('click', e => {
    if (e.target === confirmModal) confirmModal.style.display = 'none';
});

// ─── Sortear ─────────────────────────────────────────────────────────────────
btnSortear.addEventListener('click', () => {
    if (sorteados.length === TOTAL) {
        showAlert('Sorteio encerrado', 'Todos os 30 itens já foram sorteados!');
        return;
    }

    let idx;
    do { idx = Math.floor(Math.random() * TOTAL); }
    while (sorteados.includes(idx));

    sorteados.push(idx);
    const imgItem = imagens[idx];

    // Imagem com card polished
    imagemSorteada.innerHTML = `
        <div class="drawn-card">
            <img src="imagens/${imgItem.arquivo}" alt="${imgItem.nome}">
        </div>
    `;

    // Nome do item
    itemName.textContent = imgItem.nome;

    // Contador header
    headerCount.textContent = sorteados.length;

    // Anel de progresso
    const offset = CIRCUMFERENCE * (1 - sorteados.length / TOTAL);
    ringFill.style.strokeDasharray  = CIRCUMFERENCE;
    ringFill.style.strokeDashoffset = offset;

    atualizarHistorico();

    showToast(`Sorteado: <strong>${imgItem.nome}</strong>`, 'info', 2800);

    if (sorteados.length === TOTAL) {
        showToast('Todos os itens foram sorteados!', 'warning', 5000);
    }
});

// ─── Abrir popup BINGO ───────────────────────────────────────────────────────
btnBingo.addEventListener('click', () => {
    if (sorteados.length === 0) {
        showAlert('Nenhum item sorteado', 'Realize pelo menos um sorteio antes de registrar um bingo.');
        return;
    }
    bingoPopup.style.display = 'flex';
    vencedorNomeInput.focus();
    atualizarItensSorteados();
});

// ─── Fechar popup ─────────────────────────────────────────────────────────────
closePopupBtn.addEventListener('click', fecharPopup);
window.addEventListener('click', e => { if (e.target === bingoPopup) fecharPopup(); });

// Esc para fechar
window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (bingoPopup.style.display === 'flex') fecharPopup();
        if (confirmModal.style.display === 'flex') confirmModal.style.display = 'none';
    }
});

function fecharPopup() {
    bingoPopup.style.display  = 'none';
    vencedorNomeInput.value   = '';
    pesquisaItem.value        = '';
}

// ─── Confirmar bingo ─────────────────────────────────────────────────────────
confirmarBingo.addEventListener('click', () => {
    const nome = vencedorNomeInput.value.trim();
    if (!nome) {
        showToast('Digite o nome do vencedor para continuar.', 'warning');
        vencedorNomeInput.focus();
        return;
    }
    vencedores.push(nome);
    atualizarVencedores();
    fecharPopup();
    showToast(`Bingo registrado para <strong>${nome}</strong>!`, 'success', 4000);
});

// ─── Pesquisa no popup ────────────────────────────────────────────────────────
pesquisaItem.addEventListener('input', atualizarItensSorteados);

// ─── Histórico (últimos 3) ────────────────────────────────────────────────────
function atualizarHistorico() {
    listaSorteados.innerHTML = '';
    sorteados.slice(-3).reverse().forEach(index => {
        const imgItem = imagens[index];
        const item = document.createElement('div');
        item.className = 'item-sorteado';
        item.title = imgItem.nome;
        item.innerHTML = `<img src="imagens/${imgItem.arquivo}" alt="${imgItem.nome}">`;
        listaSorteados.appendChild(item);
    });
}

// ─── Itens no popup ───────────────────────────────────────────────────────────
function atualizarItensSorteados() {
    itensSorteadosLista.innerHTML = '';
    const termo = pesquisaItem.value.toLowerCase();
    const filtrados = sorteados.filter(i => imagens[i].nome.toLowerCase().includes(termo));

    if (filtrados.length > 0) {
        filtrados.forEach(index => {
            const imgItem = imagens[index];
            const item = document.createElement('div');
            item.className = 'item-sorteado-popup';
            item.innerHTML = `
                <img src="imagens/${imgItem.arquivo}" alt="${imgItem.nome}">
                <span>${imgItem.nome}</span>
            `;
            itensSorteadosLista.appendChild(item);
        });
    } else {
        const msg = document.createElement('div');
        msg.className = 'nao-encontrado';
        msg.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ink-mute)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Nenhum item encontrado</span>
        `;
        itensSorteadosLista.appendChild(msg);
    }
}

// ─── Vencedores ───────────────────────────────────────────────────────────────
// Posições fixas: 1º bingo -> 3º lugar, 2º bingo -> 2º lugar, 3º bingo -> 1º lugar
// Após o 3º, não desloca mais (posições permanecem fixas)
function atualizarVencedores() {
    const setName = (id, name) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (name) {
            el.textContent = name;
            el.classList.remove('empty');
        } else {
            el.textContent = 'Aguardando…';
            el.classList.add('empty');
        }
    };

    setName('nome3', vencedores[0] ?? null); // 1º bingo
    setName('nome2', vencedores[1] ?? null); // 2º bingo
    setName('nome1', vencedores[2] ?? null); // 3º bingo
}

// Init
atualizarHistorico();
ringFill.style.strokeDasharray  = CIRCUMFERENCE;
ringFill.style.strokeDashoffset = CIRCUMFERENCE;

// ─── Tela cheia (fallback caso o script inline do HTML não seja suficiente) ───
// A lógica principal está no script inline em index.html para garantir
// que rode após o DOMContentLoaded e após o lucide.createIcons().
