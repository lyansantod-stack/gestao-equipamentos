# ⚙️ Sistema de Gestão e Acompanhamento de Equipamentos por Exceção

Este projeto foi desenvolvido para permitir o acompanhamento rápido, simples e seguro de **140 equipamentos** espalhados pelo Brasil (com maior concentração em SP), com inclusão de dados por uma equipe de **10 técnicos via celular**, gerenciados por um **Controlador**.

---

## 🎯 Conceito Principal: Gestão por Exceção

1. **Apenas Pendências em Evidência**: Equipamentos operando normalmente **ficam ocultos** da tela principal do Controlador para eliminar a poluição visual.
2. **Alertas de Inatividade (SLA)**: Quando uma máquina fica mais de **24h** ou **48h** sem nenhuma atualização da ação corretiva, o sistema destaca a máquina automaticamente em vermelho/amarelo.
3. **Visão Mobile Simplificada**: Os 10 operadores em campo acessam uma página extremamente simples pelo celular (sem necessidade de instalar aplicativos de loja), selecionam a máquina e o motivo da parada/desligamento em 30 segundos.
4. **Baixa Automática**: Quando o Controlador marca a ação como "Resolvida", o equipamento retorna ao status NORMAL e sai da tela de pendências.
5. **Automação por E-mail**: Disparo diário ou sob demanda com o resumo consolidado por tema e máquinas com alertas críticos.

---

## 📁 Estrutura do Projeto

* `index.html`: Aplicação Web completa e responsiva (PWA Ready) com JavaScript e Tailwind CSS.
* `README.md`: Este guia detalhado de utilização e implantação.

---

## 🚀 Opções de Implantação Gratuita / Produção

### Opção 1: Web App Responsivo na Nuvem (Vercel / Netlify / Render)
* **Vantagem**: Funciona em qualquer celular Android/iPhone via link do navegador.
* **Como hospedar**: 
  1. Subir esta pasta para o GitHub.
  2. Conectar ao serviço gratuito da **Vercel** ou **Netlify**.
  3. O link fica disponível imediatamente (ex: `https://gestao-equipamentos.vercel.app`).

### Opção 2: Plataforma No-Code (Google AppSheet)
* Caso queira integrar diretamente a uma planilha do **Google Sheets**:
  1. Crie uma planilha no Google Drive com as colunas: `ID_Equipamento`, `Estado`, `Cidade`, `Status`, `Motivo`, `Ultima_Atualizacao`, `Etapa_Acao`.
  2. No Google Sheets, clique em `Extensões > AppSheet > Criar App`.
  3. O AppSheet gera automaticamente um aplicativo mobile para a equipe de campo e um painel para você com notificações e e-mails nativos.

---

## 👨‍💻 Como Definir este Diretório como Workspace Ativo

Recomendamos definir esta pasta como seu workspace padrão no editor:
`C:\Users\YanSantos\.gemini\antigravity\scratch\gestao-equipamentos`
