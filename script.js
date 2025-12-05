// LOGIN PADRÃO
if (!localStorage.getItem("admUser")) {
  localStorage.setItem("admUser", "admin");
  localStorage.setItem("admPass", "1234");
}

// LOGIN
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === localStorage.getItem("admUser") &&
      pass === localStorage.getItem("admPass")) {

    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    carregarProdutos();

  } else {
    document.getElementById("login-error").textContent = "Usuário ou senha inválidos!";
  }
}

// SAIR
function logout() {
  location.reload();
}

// TROCAR LOGIN
function atualizarLogin() {
  const novoUser = document.getElementById("novo-usuario").value;
  const novaSenha = document.getElementById("nova-senha").value;

  if (novoUser && novaSenha) {
    localStorage.setItem("admUser", novoUser);
    localStorage.setItem("admPass", novaSenha);
    document.getElementById("atualizar-msg").textContent = "Login atualizado!";
  }
}

// PRODUTOS
function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
  const lista = document.getElementById("lista-produtos");

  if (!lista) return;

  lista.innerHTML = "";

  produtos.forEach((p, i) => {
    const item = document.createElement("li");
    item.innerHTML = `${p.nome} - ${p.preco}
      <button onclick="removerProduto(${i})">Remover</button>`;
    lista.appendChild(item);
  });

  // carregar na página inicial
  const grid = document.getElementById("produtos");
  if (grid) {
    grid.innerHTML = "";
    produtos.forEach(p => {
      grid.innerHTML += `
        <div class="produto-card">
          <img src="${p.imagem}">
          <p><strong>${p.nome}</strong></p>
          <p>${p.preco}</p>
          <a href="${p.link}" target="_blank">Comprar</a>
        </div>
      `;
    });
  }
}

// REMOVER
function removerProduto(i) {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
  produtos.splice(i, 1);
  localStorage.setItem("produtos", JSON.stringify(produtos));
  carregarProdutos();
}

// ADICIONAR
const form = document.getElementById("produto-form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();

    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");

    produtos.push({
      nome: document.getElementById("produto-nome").value,
      link: document.getElementById("produto-link").value,
      imagem: document.getElementById("produto-imagem").value,
      preco: document.getElementById("produto-preco").value,
      categoria: document.getElementById("produto-categoria").value
    });

    localStorage.setItem("produtos", JSON.stringify(produtos));

    form.reset();
    carregarProdutos();
  });
}

window.onload = carregarProdutos;
