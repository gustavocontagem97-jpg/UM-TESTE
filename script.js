/* ==========================
   App principal - script.js
   ========================== */

/* ---------- Util / Init ---------- */
const STORAGE_PROD = 'produtos';
const STORAGE_ADMINS = 'admins';
const STORAGE_FAVS = 'favProdutos';
const ITEMS_PER_PAGE = 6; // paginação

// Inicia dados padrões
(function initApp(){
  if (!localStorage.getItem(STORAGE_ADMINS)) {
    localStorage.setItem(STORAGE_ADMINS, JSON.stringify([{user:'admin', pass:'1234'}]));
  }
  if (!localStorage.getItem(STORAGE_PROD)) {
    // inicial vazio (mantém seus produtos se já existirem)
    localStorage.setItem(STORAGE_PROD, JSON.stringify(JSON.parse(localStorage.getItem(STORAGE_PROD) || '[]')));
  }
  if (!localStorage.getItem(STORAGE_FAVS)) localStorage.setItem(STORAGE_FAVS, JSON.stringify([]));

  // aplica modo salvo
  if (localStorage.getItem('modoCelular') === 'true') document.body.classList.add('modo-celular');
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
})();

/* ---------- Helpers ---------- */
const q = id => document.getElementById(id);
const safe = s => (s === undefined || s === null) ? '' : String(s);

function getProdutos(){ return JSON.parse(localStorage.getItem(STORAGE_PROD) || '[]'); }
function setProdutos(arr){ localStorage.setItem(STORAGE_PROD, JSON.stringify(arr)); }
function getAdmins(){ return JSON.parse(localStorage.getItem(STORAGE_ADMINS) || '[]'); }
function setAdmins(arr){ localStorage.setItem(STORAGE_ADMINS, JSON.stringify(arr)); }
function getFavs(){ return JSON.parse(localStorage.getItem(STORAGE_FAVS) || '[]'); }
function setFavs(arr){ localStorage.setItem(STORAGE_FAVS, JSON.stringify(arr)); }

/* ---------- Busca, Ordenação, Filtros, Paginação ---------- */
let state = {
  query: '',
  categoria: 'Todos',
  sort: 'relevancia',
  onlyFavs: false,
  page: 1
};

function applyStateFromUI(){
  state.query = q('search')?.value.trim().toLowerCase() || '';
  state.sort = q('sort')?.value || 'relevancia';
  state.onlyFavs = q('favorites-filter')?.classList.contains('active') || false;
}

// Formata preço para comparação (tenta extrair número)
function parsePrice(p){
  if (!p) return 0;
  const num = p.replace(/[^\d,.\-]/g,'').replace(',', '.');
  const val = parseFloat(num);
  return isNaN(val) ? 0 : val;
}

function filterAndSortProducts(){
  const all = getProdutos();
  let list = all.slice();

  // filtro por categoria
  if (state.categoria && state.categoria !== 'Todos'){
    list = list.filter(p => p.categoria === state.categoria);
  }

  // favoritos
  if (state.onlyFavs){
    const favs = getFavs();
    list = list.filter((p, idx) => favs.includes(p.id || `${p.nome}-${p.link}`));
  }

  // busca (nome + categoria)
  if (state.query){
    list = list.filter(p => (p.nome + ' ' + p.categoria + ' ' + (p.preco || '')).toLowerCase().includes(state.query));
  }

  // ordenação
  if (state.sort === 'preco-asc') list.sort((a,b)=> parsePrice(a.preco) - parsePrice(b.preco));
  else if (state.sort === 'preco-desc') list.sort((a,b)=> parsePrice(b.preco) - parsePrice(a.preco));
  else if (state.sort === 'novo') list = list.reverse(); // assume ordem de inserção
  // relevancia = ordem natural

  return list;
}

/* ---------- Render Index (com paginação) ---------- */
function renderIndex(page = 1){
  state.page = page;
  applyStateFromUI();
  const all = filterAndSortProducts();
  const grid = q('produtos');
  if (!grid) return;

  // paginação
  const total = all.length;
  const pages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  if (state.page > pages) state.page = pages;

  const start = (state.page - 1) * ITEMS_PER_PAGE;
  const pageItems = all.slice(start, start + ITEMS_PER_PAGE);

  // limpar
  grid.classList.add('fade-out');
  setTimeout(()=> {
    grid.innerHTML = '';
    if (!pageItems.length){
      grid.innerHTML = `<p style="grid-column:1/-1;color:#666;padding:20px">Nenhum produto encontrado</p>`;
    } else {
      const favs = getFavs();
      pageItems.forEach(p => {
        const card = document.createElement('div');
        card.className = 'produto';
        const idKey = p.id || `${p.nome}-${p.link}`;
        const isFav = favs.includes(idKey);
        card.innerHTML = `
          <div class="fav" data-id="${idKey}" title="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${isFav ? '★' : '☆'}</div>
          <img src="${safe(p.imagem)}" alt="${safe(p.nome)}" onerror="this.src='https://via.placeholder.com/400x300?text=Sem+imagem'"/>
          <h3>${safe(p.nome)}</h3>
          <p style="font-size:.9rem;color:var(--muted)">${safe(p.categoria)}</p>
          <p class="preco">${safe(p.preco)}</p>
          <a href="${safe(p.link)}" target="_blank" rel="noopener">Comprar Agora</a>
        `;
        grid.appendChild(card);
      });
    }
    grid.classList.remove('fade-out');
    renderPagination(pages);
  }, 160);
}

function renderPagination(totalPages){
  const pager = q('pagination');
  if(!pager) return;
  pager.innerHTML = '';
  for(let i=1;i<=totalPages;i++){
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === state.page) btn.style.fontWeight = '700';
    btn.addEventListener('click', ()=> renderIndex(i));
    pager.appendChild(btn);
  }
}

/* ---------- Evento favorito (delegation) ---------- */
document.addEventListener('click', (e) => {
  const fav = e.target.closest('.fav');
  if (fav){
    const id = fav.dataset.id;
    const favs = getFavs();
    if (favs.includes(id)) {
      setFavs(favs.filter(x=>x!==id));
      fav.textContent = '☆'; fav.title='Adicionar aos favoritos';
    } else {
      favs.push(id); setFavs(favs);
      fav.textContent = '★'; fav.title='Remover dos favoritos';
    }
    // manter UI: rerender current page
    renderIndex(state.page);
  }
});

/* ---------- Eventos UI (busca, sort, fav filter, categorias) ---------- */
q('search')?.addEventListener('input', ()=> { state.page = 1; renderIndex(1); });
q('sort')?.addEventListener('change', ()=> { state.page = 1; renderIndex(1); });

q('favorites-filter')?.addEventListener('click', function(){
  this.classList.toggle('active');
  state.onlyFavs = this.classList.contains('active');
  this.textContent = state.onlyFavs ? '★ Favoritos' : '☆ Favoritos';
  renderIndex(1);
});

// categorias
document.getElementById('categoria-list')?.addEventListener('click', (e)=>{
  const li = e.target.closest('li');
  if (!li) return;
  document.querySelectorAll('#categoria-list li').forEach(x => x.classList.remove('active'));
  li.classList.add('active');
  state.categoria = li.dataset.cat;
  state.page = 1;
  renderIndex(1);
});

/* ---------- Carousel melhorado ---------- */
function initCarousel(){
  const container = document.querySelector('.carousel-container');
  if (!container) return;
  const items = container.children;
  let idx = 0;
  function show(i){
    const w = container.clientWidth;
    container.style.transform = `translateX(-${i * w}px)`;
    // dots
    const dots = q('carousel-dots');
    if (dots){
      dots.innerHTML = '';
      for(let j=0;j<items.length;j++){
        const d = document.createElement('button');
        d.className = j===i ? 'dot active' : 'dot';
        d.addEventListener('click', ()=> { idx = j; show(idx);});
        dots.appendChild(d);
      }
    }
  }
  let timer = setInterval(()=> { idx = (idx + 1) % items.length; show(idx); }, 3800);
  container.addEventListener('mouseenter', ()=> clearInterval(timer));
  container.addEventListener('mouseleave', ()=> { timer = setInterval(()=> { idx=(idx+1)%items.length; show(idx);},3800);});
  window.addEventListener('resize', ()=> show(idx));
  show(0);
}

/* ---------- Tema (dark) e Modo Celular ---------- */
q('toggle-theme')?.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
q('toggle-mode')?.addEventListener('click', ()=>{
  document.body.classList.toggle('modo-celular');
  localStorage.setItem('modoCelular', document.body.classList.contains('modo-celular') ? 'true' : 'false');
});

/* ---------- Admin: produtos CRUD ---------- */
function salvarProdutoObj(prod){
  const arr = getProdutos();
  // garante id único
  if (!prod.id) prod.id = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  arr.push(prod);
  setProdutos(arr);
}
function atualizarProdutoObj(prod){
  const arr = getProdutos();
  const idx = arr.findIndex(p => p.id === prod.id);
  if (idx >= 0) arr[idx] = prod;
  else arr.push(prod);
  setProdutos(arr);
}
function removerProdutoAdmin(idx){
  const arr = getProdutos();
  arr.splice(idx,1);
  setProdutos(arr);
}

function carregarProdutosAdminList(){
  const lista = q('lista-produtos');
  if (!lista) return;
  const arr = getProdutos();
  lista.innerHTML = '';
  arr.forEach((p,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;width:100%">
      <div style="max-width:68%"><strong>${safe(p.nome)}</strong><br/><small style="color:#ccc">${safe(p.categoria)} • ${safe(p.preco)}</small></div>
      <div style="display:flex;gap:8px">
        <button onclick="editarProdutoAdmin(${i})">Editar</button>
        <button onclick="confirmRemoverProduto(${i})" style="background:#c0392b;color:white">Remover</button>
      </div></div>`;
    lista.appendChild(li);
  });
}
function confirmRemoverProduto(i){
  if (!confirm('Remover este produto?')) return;
  removerProdutoAdmin(i);
  carregarProdutosAdminList();
  renderIndex( state.page );
}

function editarProdutoAdmin(i){
  const arr = getProdutos();
  const p = arr[i];
  if (!p) return;
  q('produto-nome').value = p.nome;
  q('produto-link').value = p.link;
  q('produto-imagem').value = p.imagem;
  q('produto-preco').value = p.preco;
  q('produto-categoria').value = p.categoria;
  // remove antigo para substituir ao salvar (com novo id)
  arr.splice(i,1);
  setProdutos(arr);
  carregarProdutosAdminList();
}

/* form produto submissão */
q('produto-form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const nome = q('produto-nome').value.trim();
  const link = q('produto-link').value.trim();
  const imagem = q('produto-imagem').value.trim();
  const preco = q('produto-preco').value.trim();
  const categoria = q('produto-categoria').value;
  if (!nome || !link || !imagem || !preco) { alert('Preencha todos os campos'); return; }
  salvarProdutoObj({nome, link, imagem, preco, categoria});
  q('produto-form').reset();
  carregarProdutosAdminList();
  renderIndex(1);
});
function limparFormProduto(){ q('produto-form')?.reset(); }

/* ---------- Admins: CRUD e login ---------- */
function carregarAdmins(){
  const lista = q('lista-admins'); if (!lista) return;
  const admins = getAdmins(); lista.innerHTML = '';
  admins.forEach((a, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div><strong>${safe(a.user)}</strong></div>
      <div style="display:flex;gap:8px">
        <button onclick="promptAlterarSenha(${idx})">Alterar senha</button>
        <button onclick="removerAdmin(${idx})" style="background:#c0392b;color:white">Remover</button>
      </div></div>`;
    lista.appendChild(li);
  });
}
q('admin-form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const nome = q('adm-nome').value.trim(); const senha = q('adm-senha').value;
  if (nome.length < 3 || senha.length < 3) { alert('Usuário e senha precisam de pelo menos 3 caracteres'); return; }
  const admins = getAdmins();
  if (admins.some(x => x.user === nome)) { alert('Já existe esse usuário'); return; }
  admins.push({user:nome, pass:senha}); setAdmins(admins);
  q('adm-nome').value=''; q('adm-senha').value=''; carregarAdmins();
});

function promptAlterarSenha(idx){
  const admins = getAdmins();
  const novo = prompt(`Nova senha para ${admins[idx].user} (mín 3 chars)`);
  if (!novo || novo.length < 3) return alert('Senha inválida.');
  admins[idx].pass = novo; setAdmins(admins); carregarAdmins(); alert('Senha alterada com sucesso.');
}
function removerAdmin(idx){
  const admins = getAdmins();
  if (admins.length <= 1) return alert('Deve existir pelo menos 1 administrador.');
  if (!confirm(`Remover ${admins[idx].user}?`)) return;
  admins.splice(idx,1); setAdmins(admins); carregarAdmins();
}

/* ---------- Login (verifica lista de admins) ---------- */
function login(){
  const user = q('username')?.value.trim(); const pass = q('password')?.value;
  const err = q('login-error'); if (!user || !pass) { if(err) err.textContent='Preencha usuário e senha.'; return; }
  const admins = getAdmins(); const match = admins.find(a => a.user === user && a.pass === pass);
  if (!match) { if(err) err.textContent='Usuário ou senha incorretos!'; return; }
  // sucesso: mostra painel
  if (err) err.textContent = '';
  q('login-container')?.classList.add('hidden'); q('admin-panel')?.classList.remove('hidden');
  carregarAdmins(); carregarProdutosAdminList();
}

/* Atalho wrapper porque admin.html chama handleLogin->login */
function handleLogin(){ login(); }

/* atualizar login rápido (altera o primeiro admin por conveniência) */
function atualizarLogin(){
  const novo = q('novo-usuario')?.value.trim(); const nova = q('nova-senha')?.value;
  const msg = q('atualizar-msg'); if (!novo || !nova || novo.length<3 || nova.length<3) { if (msg) {msg.textContent='Usuário/senha precisam ter 3 chars.'; msg.className='msg-error';} return; }
  const admins = getAdmins(); admins[0] = { user: novo, pass: nova }; setAdmins(admins);
  if (msg) { msg.textContent='Login atualizado com sucesso.'; msg.className='msg-success'; }
  q('novo-usuario').value=''; q('nova-senha').value=''; carregarAdmins();
}
function logout(){ location.reload(); }

/* ---------- Inicialização final (index/admin behavior) ---------- */
window.addEventListener('load', ()=>{
  // inicial renders
  renderIndex(1);
  carregarAdmins();
  carregarProdutosAdminList();
  // iniciar carousel
  initCarousel();
  // destaques simples
  (function iniciarDestaques(){ const ds = ["Itens em Promoção","Descontos Especiais","Achados do Dia"]; let i=0; const el = q('destaque-texto'); if(!el) return; el.textContent = ds[0]; setInterval(()=>{ i=(i+1)%ds.length; el.textContent = ds[i]; }, 3000); })();
});
