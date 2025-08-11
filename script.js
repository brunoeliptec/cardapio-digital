// Lista de produtos (imagens locais)
const produtos = [
    { nome: "X-Burguer", preco: 15, img: "img/xburguer.jpg" },
    { nome: "Batata Frita", preco: 10, img: "img/batata.jpg" },
    { nome: "Coca-Cola 350ml", preco: 8, img: "img/coca.jpg" },
    { nome: "Pizza Calabresa", preco: 30, img: "img/pizza.jpg" }
];

let pedido = [];
let total = 0;

// Renderiza produtos
function carregarProdutos() {
    const container = document.getElementById("lista-produtos");
    produtos.forEach((prod, index) => {
        container.innerHTML += `
            <div class="produto">
                <img src="${prod.img}" alt="${prod.nome}">
                <h3>${prod.nome}</h3>
                <p>R$ ${prod.preco.toFixed(2)}</p>
                <button onclick="addItem(${index})">Adicionar</button>
            </div>
        `;
    });
}

// Adiciona item ao carrinho
function addItem(index) {
    pedido.push(produtos[index]);
    total += produtos[index].preco;
    atualizarCarrinho();
}

// Remove item
function removerItem(i) {
    total -= pedido[i].preco;
    pedido.splice(i, 1);
    atualizarCarrinho();
}

// Atualiza carrinho
function atualizarCarrinho() {
    const lista = document.getElementById("pedido-lista");
    lista.innerHTML = "";
    pedido.forEach((item, i) => {
        lista.innerHTML += `
            <li>
                ${item.nome} - R$ ${item.preco.toFixed(2)}
                <button onclick="removerItem(${i})"><i class="fas fa-trash"></i></button>
            </li>
        `;
    });
    document.getElementById("total").textContent = total.toFixed(2);
}

// Alterna exibição do formulário de endereço
function toggleEndereco() {
    const entrega = document.querySelector('input[name="tipoEntrega"]:checked').value;
    document.getElementById("formEndereco").style.display = (entrega === "entrega") ? "block" : "none";
}

// Alterna exibição do campo troco
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

// Validação simples dos campos de endereço
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

// Envia para WhatsApp
function enviarWhatsApp() {
    if (pedido.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (!validarEndereco()) return;

    const numero = "5531983184051"; // Número configurado
    let mensagem = "Olá! Quero fazer o seguinte pedido:\n";
    pedido.forEach(item => {
        mensagem += `- ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
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

    // Forma de pagamento
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
