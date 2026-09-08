---
title: "Fluxo"
heading: "Fluxo — do sinal ao entendimento"
subtitle: "Dados precisam percorrer um caminho antes de virar entendimento."
description: "Plataforma para acompanhar dispositivos conectados (IoT) e transformar sinais do mundo físico em informação que ajuda a entender o que acontece. Projeto pessoal, em construção."
category: "Plataforma IoT"
tags: ["IoT", "Telemetria", "Observabilidade"]
date: "2026-09-06"
slug: "fluxo"
author: "Junior Godoi"
status: "publicado"
featured: true
featuredOrder: 1
---

# Fluxo

## O que é o Fluxo

O Fluxo é uma plataforma que acompanha dispositivos conectados e transforma sinais do mundo físico em informações que fazem sentido. Não é só coletar dado: é entender o que ele diz, de onde veio, como se comportou e o que dá para aprender com isso.

A ideia é ter visibilidade completa — do sensor na bancada até a informação apresentada no portal.

## Por que esse projeto existe

Eu sempre quis construir algo que fosse meu e que resolvesse um problema real. Na indústria, na bancada, em campo, a dificuldade era quase sempre a mesma: medir e observar certas coisas no momento certo. Por que aquela máquina parou às 15 horas de uma tarde de verão, sem ninguém ter encostado nela? O calor pode ter sido o culpado, mas como mostrar isso sem dados?

Medições e aferições são essenciais para qualquer sistema que dependa de precisão. E não há como ter visibilidade disso sem um lugar central reunindo essas informações.

Em 2020, comecei a estudar Big Data. Foi o pontapé inicial. Em 2022, li o livro *Build Your Own IoT Platform*, e aquilo acendeu de vez a curiosidade sobre grandes volumes de dados, dispositivos conectados e o que dá para construir a partir do que se captura.

## Controle e aprendizado

Construir a própria plataforma significa não terceirizar a parte mais interessante do problema. A infraestrutura, o armazenamento e o caminho dos dados ficam sob o meu olhar. Isso dá mais trabalho, mas também um aprendizado que dificilmente existiria se todas essas etapas estivessem escondidas atrás de um serviço fechado.

## O que a plataforma permite enxergar

O Fluxo acompanha o comportamento de dispositivos ao longo do tempo. Dá para observar padrões, notar anomalias e entender o contexto por trás de cada evento. Em vez de números soltos, aparecem histórias: uma máquina que opera fora do esperado em certos horários, um sensor que reage diferente sob determinadas condições, variações que antes passavam despercebidas.

A proposta é produzir informação confiável, que apoie decisões — não acumular dado por acumular.

## Uma volta pelo portal

No portal, o caminho é direto: escolher um dispositivo, definir um período e ver as medições em gráfico. Dá para comparar séries, isolar uma métrica e acompanhar como ela mudou ao longo do tempo, sempre com as unidades originais preservadas. Medidas numéricas, estados e textos convivem na mesma tela, sem precisar de uma ferramenta diferente para cada tipo de sinal.

Por trás disso, cada dispositivo tem a própria credencial e o próprio tópico. O que chega fica registrado com origem e ordem; o que é recusado vai para uma trilha visível, em vez de sumir num log — assim é possível responder, depois, por que um dado não chegou.

## O que já está medido

Números de cenários controlados, registrados nos relatórios de fase do repositório. Não são projeções nem prova de operação em produção.

| Frente | O que foi observado |
|---|---|
| Ingestão | 100 dispositivos e 30.000 mensagens, sem perda no cenário registrado |
| Consulta | 5.115.083 pontos consultados; a pior consulta ficou em 1,6 s, abaixo do limite de 2 s |
| Campo | gateway em Raspberry Pi com MQTT sobre TLS; ordem e fila locais preservadas após queda de energia, reboot e reconexão |
| Testes | 149 testes revalidados em 06/09/2026, entre regras de negócio, integração e portal |

## O que ainda não está pronto

- Alta disponibilidade de broker, serviços e banco de dados ainda não foi comprovada.
- Retenção, backup e restore existem como procedimento, mas ainda sem uma política exercida na prática.
- Rastreamento de ponta a ponta ainda não existe.
- Os ensaios de 24 horas do gateway e do firmware seguem pendentes.
- Alertas com estado e notificação são a próxima fase: a arquitetura está decidida em ADR, a implementação não começou.

Nada disso prova que a plataforma aguente mil dispositivos em produção — e o projeto não afirma isso.

## Como o projeto é desenvolvido

A Officina 404 é um laboratório independente onde hardware, software e infraestrutura se encontram. É um espaço para testar ideias, aprender fazendo, documentar o que se descobre e compartilhar o processo com honestidade.

O Fluxo nasce dessa maneira de trabalhar. Nada é declarado pronto antes da hora. Eu testo em cenários reais, anoto o que funciona, o que não funciona e por quê, e registro as escolhas, os erros e os ajustes.

Não é sobre parecer uma grande empresa. É sobre construir algo sólido, compreensível e útil, passo a passo. O código, a documentação e os relatórios de cada fase estão em [github.com/hard87/fluxo-iot-platform](https://github.com/hard87/fluxo-iot-platform).

## O estágio atual

O projeto está em andamento, e ainda há muito a construir.

Hoje o Fluxo já recebe dados de dispositivos, preserva essas informações e permite acompanhá-las pelo portal: dá para ver medições, consultar períodos e perceber mudanças de comportamento.

As próximas etapas envolvem tornar essas leituras mais claras e úteis, colocar de pé os alertas em tempo real, melhorar a experiência do portal e preparar a infraestrutura para cenários mais exigentes.

A direção é simples: receber sinais, preservar seu contexto e devolver uma compreensão confiável do que está acontecendo.

> O Fluxo é consequência de uma trajetória pessoal e de uma maneira de trabalhar: fazer, entender, documentar e compartilhar — sem muito enfeite.

:::article-cta
Se você trabalha com dispositivos conectados, dados que viram informação ou infraestrutura que precisa ser observada, [puxe uma conversa](../index.html#contato) ou acompanhe o projeto no [GitHub](https://github.com/hard87/fluxo-iot-platform).
:::
