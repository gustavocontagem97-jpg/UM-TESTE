// ---------------------------
// UTIL & INICIALIZAÇÃO
// ---------------------------
(function init() {
  // produtos
  window.produtos = JSON.parse(localStorage.getItem('produtos') || '[]');

  // admins: lista de objetos {user,pass}
  if (!localStorage.getItem('admins')) {
    const defaultAdmins = [{ user: 'ADM', pass: 'senha' }];
    localStorage.setItem('admins', JSON.stringify(defaultAdmins));
  }

  // aplica modos salvos
  if (localStorage.getItem('modoCelular') === 'true') document.body.classList.add('modo-celular');
  if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');

  // carregar produtos na index
  window.addEventListener('load', () => {
    if (document.getElementById('produtos')) carregarProdutos();
    if (document.getElementById('lista-produtos')) carregarProdutos(); // para admin
    iniciarDestaques();
    initCarousel();
    carregarAdmins();
    // aplica estilos nos selects logo ao carregar
    applySelectInlineStyles();
  });
})();


// ---------------------------
// ESCAPES SIMPLES
// ---------------------------
function escapeHtml(str){
  if (str === undefined || str === null) return '';
  return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}
function escapeAttr(s){
  if (!s) return '';
  const t = String(s).trim();
  if (t.toLowerCase().startsWith('javascript:')) return '#';
  return escapeHtml(t);
}

// ---------------------------
// DESTAQUES ROTATIVOS
// ---------------------------
function iniciarDestaques(){
  const destaques = ["Itens em Promoção","Descontos Especiais","Achados do Dia"];
  let idx = 0;
  const el = document.getElementById('destaque-texto');
  if (!el) return;
  el.textContent = destaques[0];
  setInterval(()=> {
    idx = (idx + 1) % destaques.length;
    el.textContent = destaques[idx];
  }, 3000);
}

// ---------------------------
// CARROSSEL (controle JS seguro)
// ---------------------------
function initCarousel(){
  const container = document.querySelector('.carousel-container');
  if (!container) return;
  const imgs = Array.from(container.querySelectorAll('img'));
  if (!imgs.length) return;

  // garante que cada imagem tenha width do container no momento do show
  let index = 0;
  function show(i){
    const width = container.clientWidth || container.offsetWidth;
    container.style.transform = `translateX(-${i * width}px)`;
  }

  window.addEventListener('resize', ()=> show(index));

  let timer = setInterval(()=> {
    index = (index + 1) % imgs.length;
    show(index);
  }, 4000);

  container.addEventListener('mouseenter', ()=> clearInterval(timer));
  container.addEventListener('mouseleave', ()=> {
    timer = setInterval(()=> {
      index = (index + 1) % imgs.length;
      show(index);
    }, 4000);
  });

  setTimeout(()=> show(0), 50);
}

// ---------------------------
// PRODUTOS: carregar / render
// ---------------------------
function carregarProdutos(){
  const produtos = window.produtos || [];
  const grid = document.getElementById('produtos');
  if (grid) {
    grid.innerHTML = '';
    if (!produtos.length) {
      grid.innerHTML = `<p style="grid-column:1/-1;color:#666;padding:20px">Nenhum produto cadastrado</p>`;
    } else {
      produtos.forEach(p => {
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `
          <img src="${escapeAttr(p.imagem)}" alt="${escapeAttr(p.nome)}" onerror="this.src='https://via.placeholder.com/400x300?text=Sem+imagem'"/>
          <h3>${escapeHtml(p.nome)}</h3>
          <p style="font-size:.9rem;color:var(--muted)">${escapeHtml(p.categoria)}</p>
          <p class="preco">${escapeHtml(p.preco)}</p>
          <a href="${escapeAttr(p.link)}" target="_blank" rel="noopener">Comprar Agora</a>
        `;
        grid.appendChild(div);
      });
    }
  }

  // admin list (se existir)
  const lista = document.getElementById('lista-produtos');
  if (lista) {
    lista.innerHTML = '';
    produtos.forEach((p,i) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div style="display:flex;gap:10px;align-items:center;justify-content:space-between;">
          <div style="max-width:70%;">
            <strong>${escapeHtml(p.nome)}</strong><br/>
            <small style="color:#ccc">${escapeHtml(p.categoria)} • ${escapeHtml(p.preco)}</small>
          </div>
          <div style="display:flex;gap:8px">
            <button onclick="editarProduto(${i})">Editar</button>
            <button onclick="removerProduto(${i})" style="background:#c0392b;color:white;border-radius:6px;padding:6px 8px">Remover</button>
          </div>
        </div>
      `;
      lista.appendChild(li);
    });
  }
}

// ---------------------------
// FILTRAR POR CATEGORIA
// ---------------------------
function filtrarCategoria(categoria = 'Todos'){
  const grid = document.getElementById('produtos');
  if (!grid) return;
  grid.classList.add('fade-out');
  setTimeout(()=> {
    const produtos = window.produtos || [];
    const list = categoria === 'Todos' ? produtos : produtos.filter(p => p.categoria === categoria);
    grid.innerHTML = '';
    if (!list.length) {
      grid.innerHTML = `<p style="grid-column:1/-1;color:#666;padding:20px">Nenhum produto na categoria "${escapeHtml(categoria)}"</p>`;
    } else {
      list.forEach(p => {
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `
          <img src="${escapeAttr(p.imagem)}" alt="${escapeAttr(p.nome)}" onerror="this.src='https://via.placeholder.com/400x300?text=Sem+imagem'"/>
          <h3>${escapeHtml(p.nome)}</h3>
          <p style="font-size:.9rem;color:var(--muted)">${escapeHtml(p.categoria)}</p>
          <p class="preco">${escapeHtml(p.preco)}</p>
          <a href="${escapeAttr(p.link)}" target="_blank" rel="noopener">Comprar Agora</a>
        `;
        grid.appendChild(div);
      });
    }
    grid.classList.remove('fade-out');
  }, 200);
}

// ---------------------------
// ADICIONAR / EDITAR / REMOVER PRODUTO (ADMIN)
// ---------------------------
const produtoForm = document.getElementById('produto-form');
if (produtoForm) {
  produtoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('produto-nome').value.trim();
    const link = document.getElementById('produto-link').value.trim();
    const imagem = document.getElementById('produto-imagem').value.trim();
    const preco = document.getElementById('produto-preco').value.trim();
    const categoria = document.getElementById('produto-categoria').value;

    if (!nome || !link || !imagem || !preco || !categoria) {
      alert('Preencha todos os campos do produto.');
      return;
    }

    // inserir no array
    window.produtos.push({ nome, link, imagem, preco, categoria });
    localStorage.setItem('produtos', JSON.stringify(window.produtos));
    carregarProdutos();
    produtoForm.reset();
  });
}

function removerProduto(i){
  if (!confirm('Remover este produto?')) return;
  window.produtos.splice(i,1);
  localStorage.setItem('produtos', JSON.stringify(window.produtos));
  carregarProdutos();
}

function editarProduto(i){
  const p = (window.produtos || [])[i];
  if (!p) return;
  document.getElementById('produto-nome').value = p.nome;
  document.getElementById('produto-link').value = p.link;
  document.getElementById('produto-imagem').value = p.imagem;
  document.getElementById('produto-preco').value = p.preco;
  document.getElementById('produto-categoria').value = p.categoria;
  // remover o antigo para quando salvar, seja substituído
  window.produtos.splice(i,1);
  localStorage.setItem('produtos', JSON.stringify(window.produtos));
  carregarProdutos();
}
function limparFormProduto(){
  document.getElementById('produto-form')?.reset();
}

// ---------------------------
// ADMINS: criar / listar / remover / login
// ---------------------------
function getAdmins(){
  try { return JSON.parse(localStorage.getItem('admins') || '[]'); }
  catch { return []; }
}
function setAdmins(list){ localStorage.setItem('admins', JSON.stringify(list)); }

function carregarAdmins(){
  const lista = document.getElementById('lista-admins');
  if (!lista) return;
  lista.innerHTML = '';
  const admins = getAdmins();
  admins.forEach((a, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;width:100%">
        <div><strong>${escapeHtml(a.user)}</strong></div>
        <div style="display:flex;gap:8px">
          <button onclick="promptAlterarSenha(${idx})">Alterar senha</button>
          <button onclick="removerAdmin(${idx})" style="background:#c0392b;color:white">Remover</button>
        </div>
      </div>
    `;
    lista.appendChild(li);
  });
}

const adminForm = document.getElementById('admin-form');
if (adminForm) {
  adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('adm-nome').value.trim();
    const senha = document.getElementById('adm-senha').value;
    if (nome.length < 3 || senha.length < 3) {
      alert('Usuário e senha devem ter pelo menos 3 caracteres.');
      return;
    }
    const admins = getAdmins();
    if (admins.some(a => a.user === nome)) {
      alert('Já existe um admin com esse usuário.');
      return;
    }
    admins.push({user: nome, pass: senha});
    setAdmins(admins);
    document.getElementById('adm-nome').value = '';
    document.getElementById('adm-senha').value = '';
    carregarAdmins();
  });
}

function promptAlterarSenha(idx){
  const admins = getAdmins();
  const novo = prompt(`Nova senha para ${admins[idx].user}: (mínimo 3 chars)`);
  if (!novo || novo.length < 3) return alert('Senha inválida.');
  admins[idx].pass = novo;
  setAdmins(admins);
  carregarAdmins();
  alert('Senha alterada com sucesso.');
}

function removerAdmin(idx){
  const admins = getAdmins();
  if (admins.length <= 1) return alert('Deve existir pelo menos 1 administrador.');
  if (!confirm(`Remover admin ${admins[idx].user}?`)) return;
  admins.splice(idx,1);
  setAdmins(admins);
  carregarAdmins();
}

// login: checa lista de admins
function login(){
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value;
  const err = document.getElementById('login-error');
  if (!user || !pass) { if (err) err.textContent = 'Preencha usuário e senha.'; return; }

  const admins = getAdmins();
  const match = admins.find(a => a.user === user && a.pass === pass);
  if (!match) { if (err) err.textContent = 'Usuário ou senha incorretos!'; return; }

  // sucesso
  if (err) err.textContent = '';
  document.getElementById('login-container')?.classList.add('hidden');
  document.getElementById('admin-panel')?.classList.remove('hidden');
  carregarProdutos();
  carregarAdmins();
}

// atualizar login atual (atualiza primeiro admin por conveniência)
function atualizarLogin(){
  const novoUser = document.getElementById('novo-usuario').value.trim();
  const novaSenha = document.getElementById('nova-senha').value;
  const msg = document.getElementById('atualizar-msg');
  if (novoUser.length < 3 || novaSenha.length < 3) {
    if (msg) { msg.textContent = 'Usuário e senha precisam ter pelo menos 3 caracteres.'; msg.classList.remove('msg-success'); msg.classList.add('msg-error'); }
    return;
  }

  const admins = getAdmins();
  admins[0] = { user: novoUser, pass: novaSenha };
  setAdmins(admins);
  if (msg) { msg.textContent = 'Login atualizado com sucesso.'; msg.classList.remove('msg-error'); msg.classList.add('msg-success'); }
  document.getElementById('novo-usuario').value = '';
  document.getElementById('nova-senha').value = '';
  carregarAdmins();
}

// logout (recarrega para voltar ao login)
function logout(){ location.reload(); }

// ---------------------------
// MODO: alterna Dark / Celular / Normal
// ---------------------------

document.getElementById('toggle-mode')?.addEventListener('click', () => {
  const body = document.body;

  // Se estiver em nenhum modo: ativa dark-mode
  if (!body.classList.contains('dark-mode') && !body.classList.contains('modo-celular')) {
    body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
  }
  // Se estiver só em dark-mode: troca para modo-celular (remove dark)
  else if (body.classList.contains('dark-mode') && !body.classList.contains('modo-celular')) {
    body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
    body.classList.add('modo-celular');
    localStorage.setItem('modoCelular', 'true');
  }
  // Se estiver em modo-celular: volta ao normal (remove modo-celular)
  else if (body.classList.contains('modo-celular')) {
    body.classList.remove('modo-celular');
    localStorage.setItem('modoCelular', 'false');
  }

  atualizarBotaoModo();
});

function atualizarBotaoModo(){
  const btn = document.getElementById('toggle-mode');
  if (!btn) return;

  if (document.body.classList.contains('modo-celular')) {
    btn.textContent = "Modo Computador";
  } else if (document.body.classList.contains('dark-mode')) {
    btn.textContent = "Modo Claro";
  } else {
    btn.textContent = "Modo Escuro";
  }
}

// inicial define texto do botão ao carregar
window.addEventListener('load', atualizarBotaoModo);

// ---------------------------
// FIX: força estilos legíveis em <select> e <option>
// aplica inline style e observa mutações
// ---------------------------
function applySelectInlineStyles(){
  try {
    document.querySelectorAll('select').forEach(s => {
      // não sobrescrever classe admin-body specifics if present, but ensure legibility
      const isAdmin = s.closest('.admin-body') || s.closest('#admin-panel') || document.body.classList.contains('admin-body');
      if (isAdmin) {
        s.style.backgroundColor = '#1e1e1e';
        s.style.color = '#fff';
        s.style.border = '1px solid rgba(255,255,255,0.08)';
      } else {
        s.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#1e1e1e' : '#ffffff';
        s.style.color = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
        s.style.border = '1px solid rgba(0,0,0,0.12)';
      }
      for (let i=0;i<s.options.length;i++){
        try { s.options[i].style.color = document.body.classList.contains('dark-mode') ? '#fff' : '#000'; } catch(e){}
      }
      s.dataset.fixApplied = '1';
    });

    const obs = new MutationObserver(() => {
      document.querySelectorAll('select').forEach(s => {
        if (!s.dataset.fixApplied) {
          const isAdmin = s.closest('.admin-body') || s.closest('#admin-panel') || document.body.classList.contains('admin-body');
          if (isAdmin) {
            s.style.backgroundColor = '#1e1e1e';
            s.style.color = '#fff';
            s.style.border = '1px solid rgba(255,255,255,0.08)';
          } else {
            s.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#1e1e1e' : '#ffffff';
            s.style.color = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
            s.style.border = '1px solid rgba(0,0,0,0.12)';
          }
          for (let i=0;i<s.options.length;i++){
            try { s.options[i].style.color = document.body.classList.contains('dark-mode') ? '#fff' : '#000'; } catch(e){}
          }
          s.dataset.fixApplied = '1';
        }
      });
    });
    obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
  } catch(e){
    console.warn('applySelectInlineStyles failed', e);
  }
}
