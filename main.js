// Usado pelos "x" nos cards das tarefas.
function excluirTarefa(botao){
    botao.parentElement.remove();
    salvarMudancas();

    if(document.querySelectorAll(".tarefa").length == 0){
        document.getElementById("texto-semTarefas").style.display = 'flex';
    }
}

// Chamado pelo botão de adicionar tarefas.
function adicionarTarefa() {
    let input = document.getElementById("input-novaTarefa");
    let entrada = input.value.trim();

    // Impossibilita a adição de tarefas vazias.
    if(!entrada || entrada.value == "") return;

    // Esconde o texto de nenhuma tarefa.
    document.getElementById("texto-semTarefas").style.display = 'none';

    // Adicionamos a tarefa ao HTML do container.
    document.getElementById("container-tarefas").insertAdjacentHTML("beforeend", `
        <div class="tarefa">
            <p class="tarefa-nome">${entrada}</p>
            <input onclick="toggleCheck(this)" type="checkbox" class="tarefa-check"></button>
            <button onclick="excluirTarefa(this)" class="tarefa-excluir">X</button>
        </div>
    `);

    // Por fim, limpamos o input e salvamos as mudanças feitas.
    input.value = "";
    salvarMudancas();
}

// Gerencia a mudança do status do checkbox.
function toggleCheck(check) {
    let blocoTarefa = check.parentElement;

    if(check.checked){
        blocoTarefa.classList.add("tarefa-concluida");
    } else {
        blocoTarefa.classList.remove("tarefa-concluida");
    }

    salvarMudancas();
}

// Gera e atualiza o array de tarefas que fica guardado no Local Storage.
function salvarMudancas() {
    let tarefas = [];

    let blocos = document.querySelectorAll(".tarefa");
    if(!blocos) return;

    // Loopando por todos os blocos de tarefas e colhendo as informações
    blocos.forEach(bloco => {
        tarefas.push({
            nome: bloco.querySelector(".tarefa-nome").innerText,
            concluido: bloco.querySelector(".tarefa-check").checked
        });
    });


    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Chamado assim que todo conteúdo é carregado.
document.addEventListener("DOMContentLoaded", () => {

    // Carregando e criando as tarefas (se houver alguma) ao iniciar a página.
    let tarefas = JSON.parse(localStorage.getItem("tarefas")) || null;
    if(tarefas && tarefas.length > 0){
        tarefas.forEach(tarefa => {
            document.getElementById("container-tarefas").insertAdjacentHTML("beforeend", `
                <div class="tarefa ${tarefa.concluido ? "tarefa-concluida" : ""}">
                    <p class="tarefa-nome">${tarefa.nome}</p>
                    <input onclick="toggleCheck(this)" type="checkbox" class="tarefa-check" ${tarefa.concluido ? "checked" : ""}></button>
                    <button onclick="excluirTarefa(this)" class="tarefa-excluir">X</button>
                </div>
            `);
        });
    } else {
        // Exibe o texto indicando que não há tarefas salvas.
        document.getElementById("texto-semTarefas").style.display = 'flex';
    }

    // Atribui o listener ao botão de nova tarefa.
    document.getElementById("botao-novaTarefa").addEventListener("click", adicionarTarefa);

    // Bindando o ENTER ao botão de nova tarefa.
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          document.getElementById("botao-novaTarefa").click();
        }
      });
});