document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. Lógica do Menu Mobile (Mantenha o funcionamento do seu nav)
    // =======================================================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }


    // =======================================================
    // 2. Lógica de Controle do Player de Áudio Invisível
    // =======================================================
    const audioFundo = document.getElementById('musicaFundo');
    const toggleButton = document.getElementById('toggleMusica');

    // Estado inicial
    let isPlaying = false; // Começa como desligado

    if (audioFundo && toggleButton) {
        
        // Tenta iniciar a música logo de cara (autoplay silencioso)
        // Isso aumenta a chance de sucesso quando o usuário clica
        audioFundo.muted = true;
        audioFundo.play().catch(error => {
            // Se o navegador bloquear até o autoplay mudo (raro, mas possível), 
            // não faz nada e espera pelo clique.
            console.warn("Autoplay mudo falhou, aguardando clique do usuário.", error);
        });


        toggleButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            if (isPlaying) {
                // Se estiver tocando (com som), vamos mutar/pausar
                audioFundo.muted = true;
                audioFundo.pause();
                isPlaying = false;
                
                // Estilo Desligado (Laranja como secundário)
                toggleButton.textContent = "[ Áudio: DESLIGADO ]";
                toggleButton.classList.add('btn-secondary');

            } else {
                // Se estiver desligado, vamos ativar o som
                audioFundo.muted = false;
                audioFundo.play()
                    .then(() => {
                        // Sucesso: Áudio tocando com som
                        isPlaying = true;
                        
                        // Estilo Ativado (Ciano como primário)
                        toggleButton.textContent = "[ Áudio: ATIVADO ]";
                        toggleButton.classList.remove('btn-secondary');
                    })
                    .catch(error => {
                        // Falha ao tentar tocar com som (pode acontecer em alguns navegadores)
                        console.error("Erro: Navegador bloqueou o áudio. Tente novamente.", error);
                        audioFundo.muted = true; // Muta de volta
                        toggleButton.textContent = "[ Áudio BLOQUEADO ]";
                    });
            }
        });
    }

});