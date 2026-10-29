# 🏗️ L6 Engenharia — Site Portfólio

Este repositório contém o desenvolvimento de um site institucional para a **L6 Engenharia**, uma empresa de engenharia civil. O objetivo do projeto é apresentar a empresa de forma profissional, destacando seus serviços, projetos realizados e facilitando o contato com clientes.

---

## 📌 Sobre o Projeto

O site foi desenvolvido como um portfólio digital, com foco em:

* Apresentação institucional da empresa
* Divulgação dos serviços prestados
* Exibição de projetos executados
* Disponibilização de canais de contato

A proposta é oferecer uma navegação simples, moderna e responsiva, garantindo uma boa experiência ao usuário em diferentes dispositivos.

---

## 🧭 Navegação do Site

A estrutura de navegação segue o padrão:

Home → Sobre → Serviços → Projetos → Contato

---

## 🚀 Funcionalidades

*  🏠 **Home** — Seção inicial com apresentação da empresa e destaque visual 
*  📖 **Sobre** — Informações sobre a empresa, missão, visão e valores 
*  🛠️ **Serviços** — Lista detalhada dos serviços oferecidos 
*  🏗️ **Projetos** — Portfólio com obras e projetos já realizados 
*  📞 **Contato** — Formas de entrar em contato com a empresa 
*  📱 **Design Responsivo** — Compatível com dispositivos móveis e desktops

---

## 🛠️ Tecnologias Utilizadas

* HTML5
* CSS3
*  JavaScript

---

## 📂 Estrutura do Projeto

```
📁 Projeto-L6
├── 📁 assets
│   ├── 📁 images
│   │   ├── 📁 brand      → marca recortada para web (l6-mark.png)
│   │   └── 📁 gallery    → fotos extras de cada projeto, em WebP (modal e hero)
│   └── 📁 icons          → ícones antigos em PNG (não usados)
├── 📁 css
│   └── style.css
├── 📁 js
│   └── script.js
├── index.html
├── README.md
└── LICENSE
```

---

## 🎨 Sistema visual (redesign 2.0)

* **Direção de arte:** "precisão técnica" — grades de prancha, cotas e numeração de seções, com a paleta da marca (navy `#0A2841` + teal `#16B8AC`).
* **Tipografia:** Archivo (variável, com eixo de largura) para títulos e textos; JetBrains Mono para rótulos técnicos.
* **Tokens:** cores, espaçamentos, raios, sombras e curvas de animação ficam em variáveis no topo de `css/style.css`.
* **Ícones:** sprite SVG no início do `index.html` — use `<svg class="ico"><use href="#i-nome"/></svg>`.
* **Animações:** elementos com `data-reveal` (ou filhos de `data-stagger`) entram ao rolar a página. Para manter a fluidez, as animações usam só `opacity` e `transform`. Tudo respeita `prefers-reduced-motion`, e o conteúdo continua visível se o JavaScript falhar.

### Manutenção

* **Projetos:** os dados de cada card ficam nos atributos `data-*` do `<article class="proj">` em `index.html`; as fotos extras ficam em `PROJ_GALLERIES`, no topo de `js/script.js`.
* **Fotos:** use WebP com no máximo 1200px de largura para manter o site leve.
* **Anos de experiência:** calculados automaticamente a partir de 2018 (`data-since="2018"`).
* **Cache:** ao publicar mudanças em `style.css` ou `script.js`, aumente o número de versão (`?v=2.2`) nas referências do `index.html` para que visitantes recebam os arquivos novos.

---

## 🎯 Objetivo

Este projeto tem como objetivo demonstrar habilidades em desenvolvimento web, com foco na criação de sites institucionais para empresas, especialmente no ramo da engenharia civil.

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido por **Lucas Souza e Marcelo Evaristo 🚀**

