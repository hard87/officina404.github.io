---
date: "2026-03-30"
featuredOrder: 1
status: "publicado"
---

# A Lei de Moore não morreu, mas está respirando com ajuda de arquitetura

## O silício ainda trabalha, mas parou de carregar software preguiçoso nas costas

Durante décadas, a computação melhorou como se existisse um acordo informal entre programadores e fabricantes de chips: o software podia engordar, desperdiçar memória, abusar de abstrações e fingir que ninguém estava vendo, porque em dois anos viria um processador novo para varrer a sujeira para debaixo do tapete.

Funcionou por bastante tempo.

O programa ficava mais pesado, o sistema operacional mais guloso, o navegador mais faminto que aplicação Java esquecida num servidor empoeirado, e tudo parecia seguir em frente. Não porque todo mundo escrevia software melhor, mas porque o hardware vinha logo atrás com uma pá, uma vassoura e bilhões de transistores novos.

Só que o silício cansou de fazer milagre.

A Lei de Moore não acabou como uma explosão cinematográfica, com fumaça saindo da sala limpa e engenheiros chorando em câmera lenta. Ela foi ficando mais cara, mais quente, mais difícil e mais cheia de asteriscos. O ganho de desempenho “grátis” ficou menos grátis. A conta chegou em forma de calor, consumo energético, vazamento de corrente, complexidade de fabricação e arquiteturas cada vez mais especializadas.

E agora entender hardware voltou a ser uma obrigação. Não uma curiosidade de quem desmonta computador por diversão no domingo.

## O que foi a Lei de Moore

A Lei de Moore é uma das ideias mais importantes da história da computação moderna, apesar do nome exagerado. Ela não é uma lei física, como a gravidade. Nenhum elétron acorda de manhã preocupado em cumprir planejamento trimestral da Intel.

A formulação mais conhecida diz que o número de transistores em um circuito integrado dobra aproximadamente a cada dois anos, com aumento mínimo de custo. A própria Intel descreve a Lei de Moore como uma observação sobre a duplicação do número de transistores em circuitos integrados, não como uma regra inevitável da natureza. Gordon Moore fez a previsão original em 1965, inicialmente falando em duplicação anual, e depois revisou essa cadência para algo próximo de dois anos em 1975.

Referência: <https://newsroom.intel.com/press-kit/moores-law>

Na prática, essa observação virou o metrônomo da indústria de semicondutores. Ela ajudou fabricantes, engenheiros, investidores e desenvolvedores a pensar o futuro da computação como uma escada relativamente previsível: mais transistores, mais desempenho, menor custo por função, mais capacidade em menos espaço.

Não foi pouca coisa.

Sem essa escalada, dificilmente teríamos smartphones com poder de processamento absurdo no bolso, servidores compactos processando volumes gigantescos de dados, placas gráficas capazes de treinar modelos de IA, roteadores baratos, microcontroladores com Wi-Fi integrado e placas embarcadas acessíveis para projetos de IoT.

A Lei de Moore foi o motor econômico e técnico que ajudou a tirar a computação do laboratório e colocar no bolso, na fábrica, no carro, no hospital, no data center e até na tomada inteligente que promete economizar energia enquanto conversa com um aplicativo duvidoso.

## Mais transistores não significam automaticamente computadores melhores

Aqui começa a confusão clássica.

Muita gente escuta “mais transistores” e entende “computador automaticamente mais rápido”. É compreensível, mas incompleto. Um processador não é só um depósito de transistores. Ele é uma cidade inteira em escala microscópica, com ruas, energia, zonas especializadas, congestionamentos, atalhos, gargalos e vizinhos inconvenientes.

Ter mais transistores pode permitir mais cache, mais núcleos, unidades vetoriais maiores, aceleradores internos, controladores melhores e arquiteturas mais eficientes. Mas isso não significa que qualquer programa vá rodar duas vezes mais rápido só porque o chip novo tem mais bilhões de componentes.

Um software limitado por acesso à memória pode não se beneficiar tanto de mais núcleos. Uma aplicação mal paralelizada pode usar apenas uma parte pequena do processador. Um sistema cheio de chamadas desnecessárias ao banco de dados pode continuar lento mesmo rodando em hardware moderno. Uma rotina de IoT mal escrita pode drenar bateria sem fazer quase nada útil.

O transistor é uma peça fundamental. Mas desempenho real depende de conjunto: arquitetura, frequência, cache, barramento, memória, sistema operacional, compilador, modelo de concorrência, consumo energético e, claro, software.

É aqui que o conto de fadas começa a perder o brilho.

## A cidade que não pode mais crescer só para os lados

Uma boa forma de entender os limites do silício é pensar em uma cidade.

Durante muito tempo, a indústria conseguiu colocar mais casas no mesmo terreno. Os transistores ficaram menores, mais próximos e mais numerosos. A cidade crescia para os lados e parecia haver espaço infinito. Cada novo bairro trazia mais capacidade, mais serviços, mais gente trabalhando.

Só que uma hora o terreno fica apertado.

Então a cidade começa a crescer para cima. Prédios maiores, estruturas verticais, uso mais intenso do espaço. E isso resolve parte do problema, mas cria outros: elevadores, fundação, energia, água, esgoto, ventilação, tráfego, segurança, manutenção e custo.

Com chips acontece algo parecido. Quando diminuir tudo no plano fica mais difícil, a indústria busca outras saídas: empilhamento, chiplets, encapsulamento avançado, memória próxima do processador, interconexões melhores e integração heterogênea. Não é simplesmente “colocar mais coisa”. É reorganizar a cidade inteira para que ela continue funcionando sem virar um forno caro e instável.

E como em qualquer cidade grande, o problema nem sempre é falta de prédio. Às vezes é trânsito.

No chip, esse trânsito aparece como latência, comunicação entre blocos, acesso à memória, dissipação térmica e consumo de energia.

## O muro físico: calor, consumo e vazamento de corrente

Durante boa parte da história da microeletrônica, encolher transistores trazia uma vantagem dupla: cabia mais coisa no chip e o consumo por transistor também diminuía. Esse comportamento ficou associado ao chamado Dennard scaling, uma regra de escala que ajudava a manter a densidade de potência sob controle à medida que os transistores ficavam menores.

O problema é que essa mágica começou a falhar. Por volta de meados dos anos 2000, a indústria encontrou o chamado “power wall”: não era mais possível aumentar frequência e densidade mantendo o consumo e o calor sob controle do mesmo jeito. Estudos sobre dark silicon apontam que, com o fim do Dennard scaling, ainda era possível continuar aumentando a quantidade de dispositivos por geração, mas com ganhos bem menores de eficiência energética no nível do transistor.

Referência: <https://cseweb.ucsd.edu/~hadi/doc/paper/2012-toppicks-dark_silicon.pdf>

O motivo é cruelmente físico. Transistores menores são maravilhosos, mas não são mágicos. Existe vazamento de corrente. Existe limite para reduzir tensão. Existe aquecimento. Existe material real, não planilha de marketing.

Quando um chip esquenta demais, não adianta fazer discurso sobre inovação. Ele reduz desempenho, consome mais energia, exige mais refrigeração ou simplesmente falha. A física tem um jeito muito antipático de encerrar reuniões motivacionais.

Foi nesse cenário que a indústria começou a mudar o foco. Em vez de apenas aumentar clock e esperar que cada núcleo ficasse muito mais rápido, passou a apostar em múltiplos núcleos, paralelismo, especialização e eficiência por watt.

## A era dos múltiplos núcleos

Quando aumentar a frequência ficou mais difícil, colocar vários núcleos no mesmo processador pareceu uma saída natural. Se um trabalhador não pode mais correr o dobro, talvez quatro trabalhadores resolvam o serviço juntos.

Talvez.

O detalhe inconveniente é que nem todo trabalho pode ser dividido bem. Algumas tarefas são naturalmente paralelizáveis, como renderização, simulação, processamento de imagens, compressão em blocos, servidores atendendo múltiplas requisições e treinamento de modelos de IA. Outras dependem de uma sequência rígida de passos.

É a velha diferença entre lavar cem copos e fazer um bolo. Cem copos podem ser divididos entre várias pessoas. Já o bolo tem ordem: misturar, assar, esperar. Colocar oito pessoas gritando em volta do forno não assa oito vezes mais rápido. Só deixa a cozinha mais desagradável.

No software, paralelismo exige projeto. Threads, processos, filas, locks, concorrência, sincronização, memória compartilhada, deadlocks, race conditions. Não basta ter muitos núcleos. O programa precisa saber usá-los.

É por isso que a escalada multicore resolveu muita coisa, mas não tudo. Ela transferiu parte da responsabilidade para arquitetura de software. E, sinceramente, a indústria de software nem sempre recebeu essa responsabilidade com maturidade. Às vezes recebeu como quem ganha uma motosserra sem manual.

## GPUs, NPUs, TPUs e aceleradores especializados

A próxima resposta da indústria foi ainda mais interessante: parar de fingir que uma CPU generalista deve fazer tudo sozinha.

A CPU continua sendo essencial. Ela é flexível, excelente para controle de fluxo, sistema operacional, tarefas gerais e decisões complexas. Mas algumas cargas de trabalho são repetitivas, massivamente paralelas ou matematicamente específicas. Para essas, usar apenas CPU é como contratar um engenheiro para apertar o mesmo parafuso o dia inteiro.

As GPUs ganharam força porque são excelentes para paralelismo massivo. Primeiro brilharam em gráficos. Depois viraram peça central em computação científica, mineração, simulações e IA. Em vez de poucos núcleos muito sofisticados, elas trazem muitos núcleos trabalhando em operações parecidas ao mesmo tempo.

Depois vieram aceleradores ainda mais específicos. TPUs, NPUs, DSPs, ASICs e outras siglas que parecem ter sido batizadas durante uma queda de energia em uma reunião de produto. O Google, por exemplo, descreve suas TPUs como aceleradores customizados para cargas de IA, incluindo modelos de linguagem, visão computacional, recomendação e outros workloads modernos.

Referência: <https://cloud.google.com/tpu>

No celular, NPUs ajudam a executar tarefas de IA localmente com menor consumo. Em data centers, aceleradores reduzem tempo e energia por operação. Em sistemas embarcados, unidades especializadas podem fazer criptografia, processamento de sinal, visão ou inferência com muito mais eficiência do que uma CPU generalista.

A ideia central é simples: usar a ferramenta certa para o tipo certo de trabalho.

O futuro da computação não é uma CPU fazendo tudo com mais força bruta. É um conjunto de blocos especializados trabalhando de forma coordenada. Menos “um martelo maior”, mais “uma oficina organizada”.

## Chiplets: o Lego brutal do silício moderno

Outra mudança importante está na forma de construir chips.

Por muito tempo, a ideia dominante era colocar tudo em um grande chip monolítico. Só que chips muito grandes são caros, difíceis de fabricar e mais vulneráveis a defeitos. Quanto maior a área, maior a chance de algo dar errado. E em semicondutores, “algo dar errado” não significa uma pequena imperfeição charmosa. Significa dinheiro evaporando.

Os chiplets surgem como uma resposta prática: em vez de fabricar um bloco gigante, divide-se o sistema em blocos menores, cada um com uma função. Depois esses blocos são conectados dentro de um pacote avançado. Pode haver chiplet de CPU, chiplet de I/O, chiplet de cache, chiplet gráfico, memória de alta largura de banda próxima e por aí vai.

A analogia com Lego ajuda, mas é perigosa se for levada longe demais. Lego não precisa lidar com latência, integridade de sinal, dissipação térmica, alimentação elétrica, yield de fabricação e interconexões microscópicas de altíssima velocidade.

A Intel descreve tecnologias como EMIB e Foveros para integração heterogênea, combinando diferentes matrizes e empilhamentos dentro do mesmo pacote. Em um exemplo citado pela própria empresa, a Intel Data Center GPU Max Series usa EMIB 3.5D para integrar mais de 100 bilhões de transistores e dezenas de blocos ativos.

Referência: <https://www.intel.com.br/content/www/br/pt/foundry/packaging.html>

Também existe esforço de padronização. O UCIe, Universal Chiplet Interconnect Express, se apresenta como uma iniciativa para construir um ecossistema aberto de chiplets e interconexão dentro do pacote.

Referência: <https://www.uciexpress.org/>

Isso mostra uma mudança de mentalidade. A indústria não está apenas tentando fazer transistores menores. Está tentando reorganizar o computador dentro do próprio pacote.

## O nanômetro virou mais marketing do que régua

Outro ponto importante: nomes como 7 nm, 5 nm, 3 nm e 2 nm precisam ser tratados com cuidado.

No passado, o nome do nó de fabricação tinha relação mais direta com dimensões físicas do transistor. Hoje, esses nomes são mais uma categoria tecnológica e comercial do que uma medida simples que você possa imaginar como uma régua microscópica. O artigo “The Node is Nonsense”, publicado na IEEE Spectrum, discute justamente como a nomenclatura moderna dos nós deixou de representar diretamente uma dimensão física única do transistor.

Referência: <https://read.nxtbook.com/ieee/spectrum/spectrum_na_august_2020/the_node_is_nonsense.html>

Isso não significa que os avanços sejam falsos. Significa que eles são mais complexos do que o nome sugere.

A TSMC, por exemplo, informa que sua tecnologia N2 entrou em produção em volume no quarto trimestre de 2025 e usa transistores nanosheet de primeira geração.

Referência: <https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm>

Isso é avanço real. Mas não deve ser interpretado como “tudo no transistor mede exatamente 2 nanômetros”. O mundo real raramente respeita o departamento de marketing.

## Computação quântica, sem incenso e fumaça

Em qualquer conversa sobre o futuro da computação, alguém eventualmente aparece com computação quântica como se tivesse encontrado a carta secreta do baralho.

Calma.

Computação quântica é uma área séria, relevante e promissora para certos tipos de problema. Mas não é substituta direta do computador clássico. Um computador quântico não é um PC gamer possuído por física avançada. Ele não vai abrir planilha mais rápido, rodar servidor web comum com mais elegância ou resolver software mal arquitetado por intervenção espiritual de qubits.

A promessa está em classes específicas de problemas: simulações quânticas, otimização, certos algoritmos matemáticos e impactos importantes em criptografia. Aliás, a parte da criptografia já é concreta o suficiente para preocupar governos e empresas. O NIST publicou em 2024 os primeiros padrões finalizados de criptografia pós-quântica, justamente para preparar sistemas contra futuros computadores quânticos capazes de ameaçar algoritmos tradicionais.

Referência: <https://csrc.nist.gov/news/2024/postquantum-cryptography-fips-approved>

Então sim, computação quântica importa. Mas não como hype barato. Ela deve ser tratada como fronteira técnica, não como tempero místico para apresentação de startup.

## Por que otimização de software voltou a importar

Durante anos, muita gente tratou otimização como frescura de velho rabugento que sente saudade de programar em C no terminal verde.

Só que otimização não significa escrever tudo em Assembly usando café frio e sofrimento. Otimização significa entender custo. Significa medir. Significa saber onde está o gargalo. Significa não desperdiçar CPU, memória, rede, disco, bateria e energia elétrica como se data center fosse movido a boas intenções.

Quando o hardware evoluía com folga, dava para empurrar ineficiência para o futuro. Hoje isso está ficando caro.

Uma query SQL ruim pode derrubar uma aplicação. Um backend que faz polling desnecessário pode multiplicar tráfego sem necessidade. Uma aplicação web que carrega megabytes de dependências para exibir três botões transforma o navegador em academia de crossfit. Um firmware de IoT mal escrito pode acabar com a bateria de um sensor de campo antes do tempo. Uma rotina de IA mal dimensionada pode gastar GPU como se energia elétrica fosse item decorativo.

Otimização voltou a importar porque eficiência voltou a ser produto. Não é só questão de elegância técnica. É custo operacional, autonomia, escalabilidade, sustentabilidade e segurança.

Software ruim não é apenas feio. Em escala, ele vira infraestrutura desperdiçada.

## IA, servidores e a conta de energia

A explosão recente da IA deixou esse debate ainda mais evidente. Modelos maiores, inferência em escala, agentes autônomos, treinamento pesado e data centers especializados colocaram energia e refrigeração no centro da conversa.

A Agência Internacional de Energia projeta que o consumo de eletricidade de data centers pode quase dobrar, saindo de 485 TWh em 2025 para 950 TWh em 2030. O consumo de data centers focados em IA cresce ainda mais rápido, com projeção de triplicar no mesmo período.

Referência: <https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary>

Isso não quer dizer que IA seja “errada” ou que data center seja vilão de desenho animado. Quer dizer que computação tem custo físico. Cada requisição, cada inferência, cada pipeline, cada modelo, cada tela carregada e cada telemetria enviada consome energia em algum lugar.

A nuvem parece etérea, mas é só o computador dos outros ligado em uma tomada muito grande.

## Mobile e IoT: onde eficiência não é luxo

Em dispositivos móveis e IoT, essa discussão fica ainda mais concreta.

No smartphone, desempenho precisa conviver com bateria, temperatura, conectividade e espaço físico. Não adianta ter um chip poderoso se ele esquenta demais, drena bateria ou reduz frequência depois de alguns minutos. É por isso que eficiência energética virou uma das grandes batalhas em processadores móveis.

Em IoT, a situação é mais severa. Um sensor industrial, agrícola ou ambiental pode precisar funcionar meses ou anos com bateria, energia solar limitada ou alimentação instável. Cada ciclo de CPU importa. Cada transmissão sem necessidade importa. Cada biblioteca pesada demais importa.

Um dispositivo embarcado não tem a paciência de um desktop. Ele não quer saber se o framework está na moda. Ele quer acordar, medir, transmitir, dormir e sobreviver.

Aqui a Officina404 entra com força: circuito, código e infraestrutura não são mundos separados. Um firmware mal escrito afeta bateria. Uma arquitetura de backend ruim afeta custo de servidor. Um protocolo mal escolhido afeta rede. Uma coleta de dados exagerada afeta armazenamento. Uma decisão preguiçosa no software vira problema físico no hardware.

É tudo conectado. O elétron não respeita organograma.

## O erro de achar que abstração é gratuita

Abstrações são necessárias. Sem elas, desenvolver software moderno seria uma tortura improdutiva. Ninguém está defendendo que toda aplicação web seja escrita bit a bit em uma caverna.

O problema é confundir abstração com licença para ignorar tudo abaixo dela.

Frameworks ajudam, mas têm custo. Containers ajudam, mas têm custo. ORMs ajudam, mas têm custo. Microsserviços ajudam em certos cenários, mas também trazem rede, latência, observabilidade, autenticação, filas, versionamento e complexidade operacional. IA ajuda muito, mas também pode gerar código inchado, inseguro ou ineficiente quando usada sem revisão técnica.

A maturidade está em saber quando a abstração paga o próprio custo.

Tecnologia boa não é a que parece bonita no diagrama. É a que resolve o problema com clareza, segurança, manutenção possível e consumo proporcional.

## O futuro não é menos computação. É computação menos ingênua

A Lei de Moore não morreu. Mas ela envelheceu.

O silício continua avançando. Novos nós de fabricação, transistores nanosheet, empacotamento 2.5D e 3D, chiplets, memórias mais próximas, interconexões melhores e aceleradores especializados mostram que ainda existe muita engenharia acontecendo. A indústria não parou. Só ficou mais difícil fingir que tudo será resolvido automaticamente pelo próximo chip.

O futuro da computação será mais heterogêneo. CPUs, GPUs, NPUs, TPUs, FPGAs, ASICs, memória especializada, chiplets e software otimizado trabalhando juntos. Não porque é bonito, mas porque a física cobrou organização.

E isso muda o papel de quem desenvolve software.

Não basta mais escrever código e esperar que o hardware do futuro peça desculpas pelo seu design ruim. Também não basta saber montar servidor sem entender carga de trabalho. Não basta falar de IA sem falar de energia. Não basta falar de IoT sem falar de bateria, rede e firmware. Não basta falar de performance sem medir.

A era do desempenho grátis está acabando. Ou, no mínimo, ficando bem menos generosa.

## Conclusão: o silício não acabou, mas parou de ser babá

A Lei de Moore foi uma das maiores alavancas da computação moderna. Ela empurrou a indústria para frente, reduziu custos, aumentou capacidade e criou o mundo digital que usamos hoje. Mas ela também ajudou a criar um vício: a crença de que o próximo hardware compensaria os pecados do software atual.

Esse tempo está passando.

Agora, desempenho nasce da combinação entre arquitetura, energia, memória, paralelismo, aceleradores, empacotamento avançado e software bem pensado. O computador moderno não é apenas um processador menor. É um ecossistema de decisões técnicas.

O silício ainda tem estrada pela frente. Só não dá mais para tratar transistor como plano de saúde para software doente.

A próxima fase da computação pertence a quem entende que desempenho não nasce apenas na fábrica de chips. Ele nasce também na arquitetura, na infraestrutura, no firmware, no banco de dados, no protocolo, no código e nas escolhas feitas antes de apertar “deploy” e fingir surpresa quando o servidor pega fogo.

No fim, a Lei de Moore não morreu.

Ela só parou de trabalhar sozinha.
