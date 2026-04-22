# Grupo Quellem / Quellnodigital

Fundada por Márcia Quellem Nascimento em Serra/ES, a Quellnodigital nasceu da convicção de que pequenas e médias empresas merecem o mesmo nível de estratégia, execução e inteligência de dados que hoje só os grandes acessam. Começamos com gestão de tráfego e mídias sociais; hoje entregamos um ecossistema completo de crescimento previsível — integrando marketing, comercial, IA e estratégia de negócio.

> "Não vendemos marketing. Construímos máquina de aquisição e crescimento."

---

## Documentação estratégica

- [Mapeamento Estratégico](./MAPEAMENTO_ESTRATEGICO.md) — oportunidades, posicionamento, personas, plano 6 meses e prompts operacionais
- [Playbook Comercial](./PLAYBOOK_COMERCIAL.md) — CRM, pipeline de 6 etapas, scripts, objeções, automações e KPIs

## Workspace Notion

Script que constrói automaticamente os 7 bancos de dados no Notion com entradas modelo e relações entre tabelas.

### Pré-requisitos

- Python 3.11+
- Integração criada em [notion.so/my-integrations](https://www.notion.so/my-integrations)
- A integração deve ter acesso à página raiz do Grupo Quellem

### Como executar

```bash
cd notion
pip install -r requirements.txt
cp .env.example .env        # preencha NOTION_API_KEY
python setup_workspace.py
```

### Bancos criados

| Banco | Emoji | Descrição |
|-------|-------|-----------|
| Pipeline Comercial | 🎯 | 6 etapas com SLA, score e origem |
| Base de Clientes | 👥 | Pacote, status, NPS, faturamento |
| Calendário de Conteúdo | 📅 | Formato, canal, etapa do funil, CTA |
| KPIs & Métricas | 📊 | CAC, ROAS, CPL, churn com meta vs. atual |
| Projetos | 🚀 | Fases 30-60-90, prioridade, responsável |
| Biblioteca de Prompts | 🤖 | 6 prompts prontos com categoria e tags |
| Base de Conhecimento | 📚 | Scripts, templates, processos, cases |

### Ativar visão Galeria (após rodar o script)

1. Abra cada banco de dados no Notion
2. Clique em **+ Adicionar uma visualização**
3. Selecione **Galeria**
4. Em *Propriedades da galeria* → ative **Mostrar capa da página**
5. Repita para os 7 bancos
