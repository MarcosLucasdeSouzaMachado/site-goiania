//Aparecer e sumir a barra lateral
document.getElementById('toggleSidebar').addEventListener('click', function() {
    var sidebar = document.querySelector('.Side_Bar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
});

//Objeto para armazenar as datas dos checkboxes
const checkboxDatas = {};

//Carregar dados salvos do localStorage ao iniciar
function carregarDados() {
    const dadosSalvos = localStorage.getItem('checkboxDatas');
    if (dadosSalvos) {
        Object.assign(checkboxDatas, JSON.parse(dadosSalvos));
    }
}

//Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('checkboxDatas', JSON.stringify(checkboxDatas));
}

//Restaurar estado dos checkboxes ao carregar a página
function restaurarCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkboxDatas[checkbox.id]) {
            checkbox.checked = true;
            atualizarDataExibida(checkbox);
        }
    });
}

//Atualizar a data exibida ao lado do checkbox
function atualizarDataExibida(checkbox) {
    //Remover span anterior se existir
    const spanAnterior = checkbox.nextElementSibling;
    if (spanAnterior && spanAnterior.classList.contains('data-registro')) {
        spanAnterior.remove();
    }
    
    //Se houver dados salvos, criar novo span com a data
    if (checkboxDatas[checkbox.id]) {
        const span = document.createElement('span');
        span.classList.add('data-registro');
        const { data, hora } = checkboxDatas[checkbox.id];
        span.textContent = ` ✓ ${data} às ${hora}`;
        span.style.marginLeft = '10px';
        span.style.color = '#28a745';
        span.style.fontWeight = 'bold';
        checkbox.parentNode.insertBefore(span, checkbox.nextSibling);
    }
}

//Verificar se todos os checkboxes estão marcados
function verificarTodosCheckados() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    return Array.from(checkboxes).every(cb => cb.checked);
}

//Desmarcar todos os checkboxes
function desmarcarTodos() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        // Remover spans de data
        const span = checkbox.nextElementSibling;
        if (span && span.classList.contains('data-registro')) {
            span.remove();
        }
    });
    checkboxDatas = {};
    salvarDados();
}

//Adicionar event listeners a todos os checkboxes
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    restaurarCheckboxes();
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                //Criar objeto com data e hora
                const agora = new Date();
                const dataFormatada = agora.toLocaleDateString('pt-BR');
                const horaFormatada = agora.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                //Salvar a data do checkbox
                checkboxDatas[this.id] = {
                    data: dataFormatada,
                    hora: horaFormatada,
                    timestamp: agora.getTime()
                };
                
                salvarDados();
                atualizarDataExibida(this);
                
                //Verificar se todos foram marcados
                if (verificarTodosCheckados()) {
                    setTimeout(() => {
                        alert('Todos os territórios foram marcados! Resetando...');
                        desmarcarTodos();
                        restaurarCheckboxes();
                    }, 500);
                }
            } else {
                atualizarDataExibida(this);
                salvarDados();
            }
        });
    });
});