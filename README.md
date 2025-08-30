Calculador de Áreas de Figuras Geométricas 📐

Este é um projeto simples, mas eficaz, desenvolvido em JavaScript puro para calcular as áreas de diversas figuras geométricas. A aplicação oferece uma interface dinâmica onde o usuário pode selecionar a figura e o método de cálculo desejado, inserir os valores necessários e obter o resultado instantaneamente.

Funcionalidades ✨

Cálculo de Áreas: Suporta uma ampla gama de figuras geométricas, incluindo:

Triângulos: Base e altura, três lados (fórmula de Heron), dois lados e ângulo, e triângulo equilátero.

Quadriláteros: Quadrado, retângulo, losango, trapézio e paralelogramo.

Polígonos regulares: Pentágono e hexágono.

Circunferência: Área do círculo, setor circular e círculo anular.

Conversão de Unidades de Ângulo: Para cálculos que exigem ângulos, a aplicação converte automaticamente entre graus, radianos e grados, garantindo a precisão dos resultados.

Validação de Entrada: Alertas de erro são exibidos para entradas inválidas, como lados que não formam um triângulo ou raios que não atendem aos critérios de cálculo.

Histórico de Cálculos: Mantém um histórico das últimas 20 operações realizadas, facilitando a consulta dos resultados.

Interface Responsiva: O design é adaptado para dispositivos móveis, com um menu lateral que melhora a usabilidade em telas menores.

Como Usar 🚀

Para usar o calculador, basta abrir o arquivo index.html (que deve ser acompanhado do código JavaScript e do CSS correspondentes, não inclusos aqui). A interface é intuitiva:

Selecione a Figura: Clique na figura desejada na barra de navegação lateral.

Escolha o Método: Selecione o método de cálculo (por exemplo, "Três lados" para triângulos) no menu suspenso.

Insira os Dados: Preencha os campos de entrada com os valores numéricos.

Calcule: Clique no botão "Calcular" ou pressione Enter para ver o resultado.

Estrutura do Código 📁

O código é estruturado de forma modular e fácil de entender.

Constantes e Funções de Utilitário: No início do código, há funções auxiliares como toNumber, fmt (para formatar números), e toRad (para converter ângulos para radianos), além de seletores de elementos do DOM ($ e $$).

FIGURAS Array: O coração da aplicação é o array FIGURAS, que armazena objetos para cada figura geométrica. Cada objeto contém:

id e label: Identificadores da figura.

tag: Uma etiqueta visual (ex: "4 modos").

methods: Um array de objetos que descreve os diferentes métodos de cálculo para a figura. Cada método inclui campos (fields), a função de cálculo (calc) e outras propriedades.

Funções de Renderização e Lógica: Funções como renderFigures, setFigure, renderMethods, setMethod, calculate e addHistory são responsáveis por manipular o DOM, gerenciar o estado da aplicação e executar os cálculos.

Listeners de Eventos: Os eventos de clique e de teclado são gerenciados para garantir a interatividade do usuário.

Contribuição 🤝

Sinta-se à vontade para contribuir com melhorias, novos cálculos ou correções de bugs.

Faça um fork do repositório.

Crie uma nova branch (git checkout -b feature/sua-melhoria).

Faça suas alterações e commit (git commit -am 'Adiciona nova funcionalidade').

Envie para a branch original (git push origin feature/sua-melhoria).

Abra um Pull Request!
