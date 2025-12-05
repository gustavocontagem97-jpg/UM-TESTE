/*============================
      SISTEMA DE PRODUTOS
=============================*/

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

/* Animação de destaques */
const destaques = ["Itens em Promoção", "Descontos Especiais", "Achados do Dia"];
let indexDestaque = 0;
setInterval(() => {
  const t = document.getElementById("destaque-texto");
  if (t) t.textContent = destaques[indexDestaque];
  indexDestaque = (indexDestaque + 1) % destaques.length;
}, 3000);

/* Renderizar produtos */
function renderProdutos(categoria = "Todos") {
  const container = document.getElementById("produtos");
  if (!container) return;

  container.innerHTML = "";

  produtos
    .filter(p => categoria === "Todos" || p.categoria === categoria)
    .forEach(p => {
      container.innerHTML += `
        <div class="produto">
          <img src="${p.imagem}" alt="${p.nome}">
          <h3>${p.nome}</h3>
          <p><strong>${p.categoria}</strong></p>
          <p class="preco">${p.preco}</p>
          <a href="${p.link}" target="_blank">Comprar Agora</a>
        </div>
      `;
    });
}
renderProdutos();

/* Filtro com animação */
function filtrarCategoria(cat) {
  const c = document.getElementById("produtos");
  c.classList.add("fade-out");
  setTimeout(() => {
    renderProdutos(cat);
    c.classList.remove("fade-out");
  }, 300);
}

/*============================
          LOGIN ADM
=============================*/

let adminUser = localStorage.getItem("adminUser") || "admin";
let adminPass = localStorage.getItem("adminPass") || "1234";

function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (user === adminUser && pass === adminPass) {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    renderListaAdmin();
  } else {
    document.getElementById("login-error").textContent = "Usuário ou senha incorretos!";
  }
}

/* Trocar usuário e senha do ADM */
function atualizarLogin() {
  const novoUser = document.getElementById("novoUser").value.trim();
  const novoPass = document.getElementById("novoPass").value.trim();

  if (!novoUser || !novoPass) {
    alert("Preencha usuário e senha!");
    return;
  }

  adminUser = novoUser;
  adminPass = novoPass;

  localStorage.setItem("adminUser", novoUser);
  localStorage.setItem("adminPass", novoPass);

  alert("Usuário e senha atualizados com sucesso!");
}

/*============================
      ÁREA DO ADMIN
=============================*/

function renderListaAdmin() {
  const lista = document.getElementById("lista-produtos");
  lista.innerHTML = "";

  produtos.forEach((p, i) => {
    lista.innerHTML += `
      <li>
        ${p.nome} - ${p.preco} (${p.categoria})
        <button onclick="removerProduto(${i})">Remover</button>
      </li>
    `;
  });
}

/* Adicionar produtos */
document.getElementById("produto-form")?.addEventListener("submit", e => {
  e.preventDefault();

  const nome = document.getElementById("produto-nome").value;
  const link = document.getElementById("produto-link").value;
  const imagem = document.getElementById("produto-imagem").value;
  const preco = document.getElementById("produto-preco").value;
  const categoria = document.getElementById("produto-categoria").value;

  produtos.push({ nome, link, imagem, preco, categoria });
  localStorage.setItem("produtos", JSON.stringify(produtos));

  renderProdutos();
  renderListaAdmin();
  e.target.reset();
});

/* Remover produtos */
function removerProduto(i) {
  produtos.splice(i, 1);
  localStorage.setItem("produtos", JSON.stringify(produtos));
  renderProdutos();
  renderListaAdmin();
}

/*============================
        MODO CELULAR
=============================*/

document.getElementById("toggle-mode")?.addEventListener("click", () => {
  document.body.classList.toggle("modo-celular");
});

/*============================
  PATCH — SELECT (BUG FIX)
=============================*/

document.querySelectorAll("select").forEach(s => {
  s.style.background = "#fff";
  s.style.color = "#000";
});
