const produtos = [
  {
    nome: "X-Burguer",
    preco: 15,
    img: "img/xburguer.jpg",
    categoria: "Sanduíches",
    adicionais: [
      { nome: "Queijo extra", preco: 3 },
      { nome: "Bacon", preco: 4 },
      { nome: "Ovo", preco: 2 }
    ]
  },
  {
    nome: "X-Salada",
    preco: 17,
    img: "img/xsalada.jpg",
    categoria: "Sanduíches",
    adicionais: [
      { nome: "Queijo extra", preco: 3 },
      { nome: "Bacon", preco: 4 }
    ]
  },
  {
    nome: "Cachorro-quente",
    preco: 12,
    img: "img/cachorro.jpg",
    categoria: "Lanches"
  },
  {
    nome: "Batata Frita",
    preco: 10,
    img: "img/batata.jpg",
    categoria: "Lanches"
  },
  {
    nome: "Coca-Cola 350ml",
    preco: 8,
    img: "img/coca.jpg",
    categoria: "Bebidas"
  },
  {
    nome: "Suco Natural",
    preco: 7,
    img: "img/suco.jpg",
    categoria: "Bebidas"
  },
  {
    nome: "Pizza Calabresa",
    preco: 30,
    img: "img/pizza.jpg",
    categoria: "Pizzas"
  },
  {
    nome: "Pizza Portuguesa",
    preco: 32,
    img: "img/pizza_portuguesa.jpg",
    categoria: "Pizzas"
  }
];

let pedido = [];
let total = 0;
let categoriaSelecionada = "Sanduíches";

let sanduicheSelecionado = null;
let adicionaisSelecionados = [];

function carregarProdutos() {
  const container = document.getElementById("lista-produtos");
  container.innerHTML = "";

  produtos
    .filter((p) => p.categoria === categoriaSelecionada)
    .forEach((prod, index) => {
      const produtoDiv = document.createElement("div");
      produtoDiv.className = "produto";

      produtoDiv.innerHTML = `
        <img src="${prod.img}" alt="${prod.nome}">
        <h3>${prod.nome}</h3>
        <p>R$ ${prod.preco.toFixed(2)}</p>
      `;

      const botao = document.createElement("button");
      botao.textContent = "Adicionar";

      if (prod.adicionais && prod.adicionais.length > 0) {
        botao.addEventListener("click", () => abrirModalAdicionais(index));
      } else {
        botao.addEventListener("click", () => adicionarAoPedido(prod, []));
      }

      produtoDiv.appendChild(botao);
      container.appendChild(produtoDiv);
    });

  atualizarAtivoCategoria();
}

function filtrarCategoria(cat) {
  categoriaSelecionada = cat;
  carregarProdutos();
}

function atualizarAtivoCategoria() {
  document.querySelectorAll(".categorias button").forEach((btn) => {
    btn.classList.toggle("ativo", btn.textContent === categoriaSelecionada);
  });
}

function abrirModalAdicionais(index) {
  sanduicheSelecionado = produtos[index];
  adicionaisSelecionados = [];

  const lista = document.getElementById("lista-adicionais");
  lista.innerHTML = "";

  if (sanduicheSelecionado.adicionais && sanduicheSelecionado.adicionais.length > 0) {
    sanduicheSelecionado.adicionais.forEach((ad, i) => {
      lista.innerHTML += `
        <label>
          <input type="checkbox" value="${i}" />
          ${ad.nome} (+ R$ ${ad.preco.toFixed(2)})
        </label>
      `;
    });
  } else {
    lista.innerHTML = "<p>Este produto não possui adicionais.</p>";
  }

  document.getElementById("modalAdicionais").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalAdicionais").style.display = "none";
}

function confirmarAdicionais() {
  const checkboxes = document.querySelectorAll("#lista-adicionais input[type=checkbox]:checked");
  adicionaisSelecionados = [];
  checkboxes.forEach((cb) => {
    adicionaisSelecionados.push(sanduicheSelecionado.adicionais[parseInt(cb.value)]);
  });

  adicionarAoPedido(sanduicheSelecionado, adicionaisSelecionados);
  fecharModal();
}

function adicionarAoPedido(produto, adicionais) {
  pedido.push({ produto, adicionais });
  calcularTotal();
  atualizarCarrinho();
}

function calcularTotal() {
  total = pedido.reduce((acc, item) => {
    const adicionaisPreco = item.adicionais.reduce((soma, a) => soma + a.preco, 0);
    return acc + item.produto.preco + adicionaisPreco;
  }, 0);
}

function atualizarCarrinho() {
  const lista = document.getElementById("pedido-lista");
  lista.innerHTML = "";

  pedido.forEach((item, i) => {
    const adicionaisTxt = item.adicionais.length
      ? ` (Adicionais: ${item.adicionais.map((a) => a.nome).join(", ")})`
      : "";
    const precoItem = item.produto.preco + item.adicionais.reduce((soma, a) => soma + a.preco, 0);
    lista.innerHTML += `
      <li>
        <div class="item-info">${item.produto.nome}${adicionaisTxt}</div> - R$ ${precoItem.toFixed(2)}
        <button onclick="removerItem(${i})">
          <i class="fas fa-trash"></i>
        </button>
      </li>
    `;
  });

  document.getElementById("total").textContent = total.toFixed(2);
}

function removerItem(i) {
  pedido.splice(i, 1);
  calcularTotal();
  atualizarCarrinho();
}

function toggleEndereco() {
  const entrega = document.querySelector('input[name="tipoEntrega"]:checked').value;
  document.getElementById("formEndereco").style.display = entrega === "entrega" ? "block" : "none";
}

function toggleTroco() {
  const pagamento = document.querySelector('input[name="formaPagamento"]:checked').value;
  const campoTroco = document.getElementById("campoTroco");
  if (pagamento === "Dinheiro") {
    campoTroco.style.display = "block";
  } else {
    campoTroco.style.display = "none";
    document.getElementById("valorTroco").value = "";
  }
}

function validarEndereco() {
  if (document.querySelector('input[name="tipoEntrega"]:checked').value === "entrega") {
    const campos = ["nomeCliente", "ruaNumero", "bairro", "cidade", "cep"];
    for (const id of campos) {
      const val = document.getElementById(id).value.trim();
      if (!val) {
        alert("Por favor, preencha o campo: " + id);
        return false;
      }
    }
  }
  return true;
}

function enviarWhatsApp() {
  if (pedido.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  if (!validarEndereco()) return;

  const numero = "5531983184051"; // Ajuste para seu número
  let mensagem = "Olá! Quero fazer o seguinte pedido:\n";

  pedido.forEach((item) => {
    const adicionaisTxt = item.adicionais.length
      ? ` (Adicionais: ${item.adicionais.map((a) => a.nome).join(", ")})`
      : "";
    const precoItem = item.produto.preco + item.adicionais.reduce((soma, a) => soma + a.preco, 0);
    mensagem += `- ${item.produto.nome}${adicionaisTxt} - R$ ${precoItem.toFixed(2)}\n`;
  });

  mensagem += `Total: R$ ${total.toFixed(2)}\n\n`;

  const tipoEntrega = document.querySelector('input[name="tipoEntrega"]:checked').value;
  if (tipoEntrega === "retirada") {
    mensagem += "Forma de recebimento: Retirar na loja\n";
  } else {
    mensagem += "Forma de recebimento: Entrega\n";
    mensagem += "Endereço:\n";
    mensagem += `Nome: ${document.getElementById("nomeCliente").value}\n`;
    mensagem += `Rua e Número: ${document.getElementById("ruaNumero").value}\n`;
    mensagem += `Bairro: ${document.getElementById("bairro").value}\n`;
    mensagem += `Cidade: ${document.getElementById("cidade").value}\n`;
    mensagem += `CEP: ${document.getElementById("cep").value}\n`;
    const telefone = document.getElementById("telefone").value.trim();
    if (telefone) mensagem += `Telefone: ${telefone}\n`;
  }

  const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked').value;
  mensagem += `Forma de pagamento: ${formaPagamento}\n`;

  if (formaPagamento === "Dinheiro") {
    const valorTroco = document.getElementById("valorTroco").value.trim();
    if (valorTroco) {
      mensagem += `Precisa de troco para: R$ ${parseFloat(valorTroco).toFixed(2)}\n`;
    }
  }

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

window.onload = () => {
  carregarProdutos();
  toggleEndereco();
  toggleTroco();
};
