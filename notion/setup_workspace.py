#!/usr/bin/env python3
"""
Quellnodigital — Notion Workspace Builder
Cria o ambiente completo de trabalho no Notion via API.

Uso:
    pip install -r requirements.txt
    cp .env.example .env          # preencha NOTION_API_KEY
    python setup_workspace.py
"""

import os
import sys
import time
from notion_client import Client
from dotenv import load_dotenv

load_dotenv()

# ─── Config ──────────────────────────────────────────────────────────────────

TOKEN = os.environ.get("NOTION_API_KEY", "")
PARENT_PAGE_ID = os.environ.get(
    "NOTION_PARENT_PAGE_ID",
    "64833381-2ed5-4cc5-8de9-97041eac4e2e",  # URL da página raiz Grupo Quellem
)

if not TOKEN:
    print("❌  Defina NOTION_API_KEY no arquivo .env ou como variável de ambiente.")
    sys.exit(1)

notion = Client(auth=TOKEN)

# ─── Helpers ─────────────────────────────────────────────────────────────────

PALETTE = [
    "blue", "green", "yellow", "orange", "red",
    "purple", "pink", "gray", "brown", "default",
]


def rt(content: str) -> list[dict]:
    return [{"type": "text", "text": {"content": content}}]


def opts(*names: str, colors: list[str] | None = None) -> list[dict]:
    return [
        {"name": n, "color": (colors[i] if colors and i < len(colors) else PALETTE[i % len(PALETTE)])}
        for i, n in enumerate(names)
    ]


def _pause():
    time.sleep(0.45)


def create_db(parent_id: str, title: str, emoji: str, properties: dict) -> str:
    db = notion.databases.create(
        parent={"type": "page_id", "page_id": parent_id},
        icon={"type": "emoji", "emoji": emoji},
        title=rt(title),
        properties=properties,
    )
    print(f"  ✅  {emoji}  {title}")
    _pause()
    return db["id"]


def create_page(parent_id: str, title: str, emoji: str) -> str:
    page = notion.pages.create(
        parent={"type": "page_id", "page_id": parent_id},
        icon={"type": "emoji", "emoji": emoji},
        properties={"title": {"title": rt(title)}},
    )
    print(f"  📄  {emoji}  {title}")
    _pause()
    return page["id"]


def add_entry(db_id: str, props: dict, emoji: str | None = None) -> str:
    payload: dict = {"parent": {"database_id": db_id}, "properties": props}
    if emoji:
        payload["icon"] = {"type": "emoji", "emoji": emoji}
    page = notion.pages.create(**payload)
    _pause()
    return page["id"]


def add_relation(db_id: str, prop_name: str, target_db_id: str):
    """Adiciona uma propriedade de relação a um banco já criado."""
    notion.databases.update(
        database_id=db_id,
        properties={
            prop_name: {
                "relation": {
                    "database_id": target_db_id,
                    "single_property": {},
                }
            }
        },
    )
    _pause()


# ─── Propriedades dos bancos de dados ────────────────────────────────────────

def props_pipeline() -> dict:
    return {
        "Lead / Empresa": {"title": {}},
        "Etapa": {
            "select": {
                "options": opts(
                    "1 · Primeiro Contato",
                    "2 · Diagnóstico",
                    "3 · Proposta Enviada",
                    "4 · Negociação",
                    "5 · Contrato Assinado",
                    "6 · Onboarding Ativo",
                    colors=["gray", "blue", "yellow", "orange", "green", "purple"],
                )
            }
        },
        "Segmento": {
            "select": {
                "options": opts(
                    "Clínica / Saúde", "Estética / Beleza", "Jurídico",
                    "Educação", "Consultoria", "E-commerce",
                    "Imobiliário", "Tecnologia", "Outro",
                )
            }
        },
        "Faturamento Mensal": {
            "select": {
                "options": opts(
                    "Até R$30k", "R$30k–100k", "R$100k–300k", "Acima de R$300k",
                    colors=["gray", "blue", "green", "purple"],
                )
            }
        },
        "Score (0–10)": {"number": {"format": "number"}},
        "Valor Estimado": {"number": {"format": "real"}},
        "Origem": {
            "select": {
                "options": opts(
                    "Tráfego Pago", "Instagram Orgânico", "Indicação",
                    "WhatsApp", "Cold Outreach", "LinkedIn", "Evento",
                )
            }
        },
        "Próxima Ação": {"rich_text": {}},
        "Data Próxima Ação": {"date": {}},
        "Data de Entrada": {"date": {}},
        "Responsável": {"people": {}},
        "Motivo de Perda": {
            "select": {
                "options": opts(
                    "Preço", "Timing", "Concorrente",
                    "Sem Orçamento", "Sem Fit", "Sem Decisão",
                    colors=["red", "orange", "yellow", "gray", "brown", "default"],
                )
            }
        },
    }


def props_clientes() -> dict:
    return {
        "Cliente": {"title": {}},
        "Empresa": {"rich_text": {}},
        "Segmento": {
            "select": {
                "options": opts(
                    "Clínica / Saúde", "Estética / Beleza", "Jurídico",
                    "Educação", "Consultoria", "E-commerce",
                    "Imobiliário", "Tecnologia", "Outro",
                )
            }
        },
        "Pacote": {
            "select": {
                "options": opts(
                    "Base", "Crescimento", "Escala",
                    colors=["blue", "green", "purple"],
                )
            }
        },
        "Status": {
            "select": {
                "options": opts(
                    "Onboarding", "Ativo", "Em Risco", "Inativo",
                    colors=["yellow", "green", "orange", "red"],
                )
            }
        },
        "Valor Mensal": {"number": {"format": "real"}},
        "Início do Contrato": {"date": {}},
        "NPS (0–10)": {"number": {"format": "number"}},
        "WhatsApp": {"phone_number": {}},
        "E-mail": {"email": {}},
        "Responsável": {"people": {}},
    }


def props_conteudo() -> dict:
    return {
        "Título": {"title": {}},
        "Formato": {
            "select": {
                "options": opts(
                    "Reels", "Carrossel", "Story", "Post Estático",
                    "Copy", "E-mail", "Artigo", "Vídeo Longo", "Podcast",
                )
            }
        },
        "Canal": {
            "select": {
                "options": opts(
                    "Instagram", "LinkedIn", "WhatsApp",
                    "TikTok", "YouTube", "Blog", "E-mail",
                )
            }
        },
        "Etapa do Funil": {
            "select": {
                "options": opts(
                    "Topo · Atração",
                    "Meio · Autoridade",
                    "Fundo · Conversão",
                    colors=["blue", "yellow", "green"],
                )
            }
        },
        "Objetivo": {
            "select": {
                "options": opts(
                    "Atração", "Autoridade", "Conversão", "Retenção",
                    colors=["blue", "purple", "green", "orange"],
                )
            }
        },
        "Status": {
            "select": {
                "options": opts(
                    "Ideia", "Roteiro", "Produção", "Revisão", "Aprovado", "Publicado",
                    colors=["gray", "blue", "yellow", "orange", "green", "purple"],
                )
            }
        },
        "Data de Publicação": {"date": {}},
        "CTA": {
            "select": {
                "options": opts(
                    "Saiba Mais", "Fale Conosco", "Agendar Diagnóstico",
                    "Baixar Material", "Seguir", "Comprar",
                )
            }
        },
        "Responsável": {"people": {}},
    }


def props_kpis() -> dict:
    return {
        "Métrica": {"title": {}},
        "Tipo": {
            "select": {
                "options": opts(
                    "CAC", "ROAS", "CPL", "Taxa de Conversão",
                    "LTV", "Churn", "Leads Gerados", "Faturamento",
                    "CTR", "Alcance", "Taxa de Abertura",
                )
            }
        },
        "Período": {"date": {}},
        "Valor Atual": {"number": {"format": "number"}},
        "Meta": {"number": {"format": "number"}},
        "Status": {
            "select": {
                "options": opts(
                    "Acima da Meta", "Na Meta", "Abaixo da Meta", "Crítico",
                    colors=["green", "blue", "orange", "red"],
                )
            }
        },
    }


def props_projetos() -> dict:
    return {
        "Projeto": {"title": {}},
        "Fase": {
            "select": {
                "options": opts(
                    "Fundação (30 dias)", "Aquisição (60 dias)", "Escala (90 dias)",
                    colors=["blue", "yellow", "green"],
                )
            }
        },
        "Status": {
            "select": {
                "options": opts(
                    "Planejamento", "Em Andamento", "Revisão", "Concluído", "Pausado",
                    colors=["gray", "blue", "yellow", "green", "orange"],
                )
            }
        },
        "Prioridade": {
            "select": {
                "options": opts(
                    "Alta", "Média", "Baixa",
                    colors=["red", "yellow", "blue"],
                )
            }
        },
        "Data Início": {"date": {}},
        "Data Entrega": {"date": {}},
        "Responsável": {"people": {}},
    }


def props_prompts() -> dict:
    return {
        "Nome do Prompt": {"title": {}},
        "Categoria": {
            "select": {
                "options": opts(
                    "Diagnóstico", "Proposta", "Conteúdo",
                    "Funil", "Performance", "Atendimento", "Vendas",
                )
            }
        },
        "Uso": {
            "select": {
                "options": opts(
                    "Cliente", "Interno", "Marketing", "Vendas",
                    colors=["green", "blue", "purple", "orange"],
                )
            }
        },
        "Tags": {
            "multi_select": {
                "options": opts(
                    "IA", "WhatsApp", "Funil", "Diagnóstico",
                    "Proposta", "CRM", "Conteúdo", "Performance",
                )
            }
        },
        "Prompt": {"rich_text": {}},
    }


def props_conhecimento() -> dict:
    return {
        "Título": {"title": {}},
        "Categoria": {
            "select": {
                "options": opts(
                    "Processo", "Template", "Script",
                    "Guia", "Case", "Modelo", "Treinamento",
                )
            }
        },
        "Status": {
            "select": {
                "options": opts(
                    "Rascunho", "Publicado", "Arquivado",
                    colors=["yellow", "green", "gray"],
                )
            }
        },
        "Tags": {
            "multi_select": {
                "options": opts(
                    "Comercial", "Marketing", "Operação",
                    "IA", "Onboarding", "Retenção", "Conteúdo",
                )
            }
        },
    }


# ─── Entradas modelo ─────────────────────────────────────────────────────────

def seed_pipeline(db_id: str):
    entries = [
        ("Clínica Bem Estar", "1 · Primeiro Contato", "Clínica / Saúde", "R$30k–100k", 7.0, 3500.0, "Instagram Orgânico", "Enviar apresentação", "🟡"),
        ("Studio Glow", "2 · Diagnóstico", "Estética / Beleza", "R$30k–100k", 8.0, 4200.0, "Indicação", "Reunião de diagnóstico", "🔵"),
        ("Advogados & Co.", "3 · Proposta Enviada", "Jurídico", "R$100k–300k", 9.0, 6500.0, "Tráfego Pago", "Follow-up proposta", "🟠"),
        ("EduMais Cursos", "4 · Negociação", "Educação", "R$30k–100k", 6.0, 2800.0, "Cold Outreach", "Contornar objeção de preço", "🔴"),
    ]
    for name, stage, seg, fat, score, val, origem, acao, emoji in entries:
        add_entry(
            db_id,
            {
                "Lead / Empresa": {"title": rt(name)},
                "Etapa": {"select": {"name": stage}},
                "Segmento": {"select": {"name": seg}},
                "Faturamento Mensal": {"select": {"name": fat}},
                "Score (0–10)": {"number": score},
                "Valor Estimado": {"number": val},
                "Origem": {"select": {"name": origem}},
                "Próxima Ação": {"rich_text": rt(acao)},
            },
            emoji,
        )


def seed_clientes(db_id: str):
    entries = [
        ("Dr. Paulo Ferreira", "Clínica VidaSaúde", "Clínica / Saúde", "Escala", "Ativo", 4200.0, 9.0, "🟢"),
        ("Ana Lima", "Studio Bloom", "Estética / Beleza", "Crescimento", "Onboarding", 2800.0, 8.0, "🟡"),
        ("Consultoria BRGrowth", "BRGrowth", "Consultoria", "Base", "Ativo", 1900.0, 7.0, "🔵"),
    ]
    for nome, empresa, seg, pacote, status, valor, nps, emoji in entries:
        add_entry(
            db_id,
            {
                "Cliente": {"title": rt(nome)},
                "Empresa": {"rich_text": rt(empresa)},
                "Segmento": {"select": {"name": seg}},
                "Pacote": {"select": {"name": pacote}},
                "Status": {"select": {"name": status}},
                "Valor Mensal": {"number": valor},
                "NPS (0–10)": {"number": nps},
            },
            emoji,
        )


def seed_conteudo(db_id: str):
    entries = [
        ("3 erros que impedem sua clínica de crescer online", "Carrossel", "Instagram", "Topo · Atração", "Autoridade", "Ideia", "Saiba Mais", "🎯"),
        ("Como estruturamos um funil para estética em 30 dias", "Reels", "Instagram", "Meio · Autoridade", "Autoridade", "Roteiro", "Agendar Diagnóstico", "🎬"),
        ("Resultado real: +140 leads em 45 dias para uma clínica em SP", "Post Estático", "Instagram", "Fundo · Conversão", "Conversão", "Aprovado", "Fale Conosco", "📊"),
        ("Por que curtida não paga boleto — e o que fazer diferente", "Reels", "LinkedIn", "Topo · Atração", "Atração", "Produção", "Saiba Mais", "💡"),
        ("Diagnóstico gratuito: descubra onde seu marketing está travado", "Copy", "WhatsApp", "Fundo · Conversão", "Conversão", "Aprovado", "Agendar Diagnóstico", "📲"),
    ]
    for titulo, fmt, canal, funil, obj, status, cta, emoji in entries:
        add_entry(
            db_id,
            {
                "Título": {"title": rt(titulo)},
                "Formato": {"select": {"name": fmt}},
                "Canal": {"select": {"name": canal}},
                "Etapa do Funil": {"select": {"name": funil}},
                "Objetivo": {"select": {"name": obj}},
                "Status": {"select": {"name": status}},
                "CTA": {"select": {"name": cta}},
            },
            emoji,
        )


def seed_kpis(db_id: str):
    entries = [
        ("CAC — Clínica VidaSaúde", "CAC", 180.0, 150.0, "Abaixo da Meta", "📉"),
        ("ROAS — Studio Bloom", "ROAS", 4.2, 4.0, "Acima da Meta", "📈"),
        ("CPL — Campanha Diagnóstico", "CPL", 22.0, 25.0, "Acima da Meta", "✅"),
        ("Taxa de Conversão — Comercial", "Taxa de Conversão", 28.0, 30.0, "Abaixo da Meta", "⚠️"),
        ("Churn Mensal", "Churn", 3.0, 5.0, "Acima da Meta", "🟢"),
    ]
    for metrica, tipo, atual, meta, status, emoji in entries:
        add_entry(
            db_id,
            {
                "Métrica": {"title": rt(metrica)},
                "Tipo": {"select": {"name": tipo}},
                "Valor Atual": {"number": atual},
                "Meta": {"number": meta},
                "Status": {"select": {"name": status}},
            },
            emoji,
        )


def seed_projetos(db_id: str):
    entries = [
        ("Lançamento Campanha Diagnóstico", "Aquisição (60 dias)", "Em Andamento", "Alta", "🚀"),
        ("Estruturação de Scripts Comerciais", "Fundação (30 dias)", "Concluído", "Alta", "✅"),
        ("Implementação CRM Interno", "Fundação (30 dias)", "Em Andamento", "Alta", "🔧"),
        ("Produção de 3 Cases Estruturados", "Aquisição (60 dias)", "Planejamento", "Média", "📋"),
        ("Automação WhatsApp com IA", "Escala (90 dias)", "Planejamento", "Alta", "🤖"),
    ]
    for nome, fase, status, prio, emoji in entries:
        add_entry(
            db_id,
            {
                "Projeto": {"title": rt(nome)},
                "Fase": {"select": {"name": fase}},
                "Status": {"select": {"name": status}},
                "Prioridade": {"select": {"name": prio}},
            },
            emoji,
        )


def seed_prompts(db_id: str):
    prompts = [
        (
            "Diagnóstico Estratégico de Cliente",
            "Diagnóstico", "Interno",
            ["IA", "Diagnóstico", "Funil"],
            "Aja como estrategista da Quellnodigital. Analise o seguinte negócio: [dados]. Gere: 1. Diagnóstico estratégico 2. Gargalos no funil 3. Oportunidades imediatas 4. Plano 30-60-90 5. KPIs ideais. Seja direto e orientado a resultado.",
            "🔍",
        ),
        (
            "Proposta Comercial de Alto Nível",
            "Proposta", "Vendas",
            ["Proposta", "Comercial", "CRM"],
            "Aja como especialista em vendas consultivas da Quellnodigital. Com base neste cliente: [dados]. Crie proposta com: diagnóstico, escopo orientado a resultado, justificativa de cada ação, estrutura de investimento e argumentação de valor.",
            "📄",
        ),
        (
            "Estratégia de Conteúdo por Nicho",
            "Conteúdo", "Marketing",
            ["Conteúdo", "Funil", "IA"],
            "Aja como estrategista de conteúdo orientado a vendas. Para o nicho: [segmento]. Crie 10 ideias com objetivo claro (atração, autoridade ou conversão), roteiro estratégico e CTA alinhado ao funil. Sem conteúdo genérico.",
            "✍️",
        ),
        (
            "Desenho de Funil Completo",
            "Funil", "Cliente",
            ["Funil", "IA", "WhatsApp"],
            "Aja como especialista em funis de marketing e vendas. Desenhe um funil completo para: [negócio]. Inclua topo, meio e fundo, estratégias de aquisição, qualificação, processo comercial e automações com IA. Foque em previsibilidade de receita.",
            "🔄",
        ),
        (
            "Otimização de Performance de Cliente Ativo",
            "Performance", "Cliente",
            ["Performance", "CRM", "Diagnóstico"],
            "Aja como gestor de performance da Quellnodigital. Analise: [métricas]. Identifique: onde está o desperdício, oportunidades de otimização imediata, testes prioritários e plano de melhoria em 30 dias. Baseie-se em dados (CTR, CPL, CAC, ROAS).",
            "📊",
        ),
        (
            "Script de Atendimento WhatsApp (Qualificação)",
            "Atendimento", "Vendas",
            ["WhatsApp", "Comercial", "CRM"],
            "Aja como especialista em vendas consultivas. Crie um script de qualificação para WhatsApp para o segmento [nicho]. O script deve: gerar rapport, identificar dor principal, qualificar faturamento e urgência, e conduzir para agendamento de diagnóstico. Máx. 5 perguntas.",
            "💬",
        ),
    ]
    for nome, cat, uso, tags, prompt_text, emoji in prompts:
        add_entry(
            db_id,
            {
                "Nome do Prompt": {"title": rt(nome)},
                "Categoria": {"select": {"name": cat}},
                "Uso": {"select": {"name": uso}},
                "Tags": {"multi_select": [{"name": t} for t in tags]},
                "Prompt": {"rich_text": rt(prompt_text[:2000])},
            },
            emoji,
        )


def seed_conhecimento(db_id: str):
    entries = [
        ("Script de Primeiro Contato — WhatsApp", "Script", "Publicado", ["Comercial", "WhatsApp"], "📲"),
        ("Roteiro de Reunião de Diagnóstico", "Script", "Publicado", ["Comercial", "Onboarding"], "🎙️"),
        ("Template de Proposta Comercial", "Template", "Publicado", ["Comercial"], "📄"),
        ("Processo de Onboarding — 30-60-90", "Processo", "Publicado", ["Onboarding", "Operação"], "🗂️"),
        ("Guia de KPIs e Métricas Essenciais", "Guia", "Publicado", ["Marketing", "Operação"], "📊"),
        ("Checklist de Pós-Fechamento", "Processo", "Publicado", ["Comercial", "Onboarding"], "✅"),
        ("Mapeamento Estratégico Grupo Quellem", "Guia", "Publicado", ["Marketing", "Operação", "Comercial"], "🗺️"),
    ]
    for titulo, cat, status, tags, emoji in entries:
        add_entry(
            db_id,
            {
                "Título": {"title": rt(titulo)},
                "Categoria": {"select": {"name": cat}},
                "Status": {"select": {"name": status}},
                "Tags": {"multi_select": [{"name": t} for t in tags]},
            },
            emoji,
        )


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("\n🚀  Quellnodigital — Construindo workspace no Notion...\n")

    # ── Bancos de dados principais ─────────────────────────────────────────
    print("📦  Criando bancos de dados...\n")

    pipeline_id = create_db(PARENT_PAGE_ID, "Pipeline Comercial", "🎯", props_pipeline())
    clientes_id = create_db(PARENT_PAGE_ID, "Base de Clientes", "👥", props_clientes())
    conteudo_id = create_db(PARENT_PAGE_ID, "Calendário de Conteúdo", "📅", props_conteudo())
    kpis_id     = create_db(PARENT_PAGE_ID, "KPIs & Métricas", "📊", props_kpis())
    projetos_id = create_db(PARENT_PAGE_ID, "Projetos", "🚀", props_projetos())
    prompts_id  = create_db(PARENT_PAGE_ID, "Biblioteca de Prompts", "🤖", props_prompts())
    conhec_id   = create_db(PARENT_PAGE_ID, "Base de Conhecimento", "📚", props_conhecimento())

    # ── Relações entre bancos ──────────────────────────────────────────────
    print("\n🔗  Criando relações entre bancos...\n")

    add_relation(pipeline_id, "Cliente Convertido", clientes_id)
    print("  ✅  Pipeline → Clientes")

    add_relation(conteudo_id, "Cliente", clientes_id)
    print("  ✅  Conteúdo → Clientes")

    add_relation(conteudo_id, "Projeto", projetos_id)
    print("  ✅  Conteúdo → Projetos")

    add_relation(kpis_id, "Cliente", clientes_id)
    print("  ✅  KPIs → Clientes")

    add_relation(projetos_id, "Cliente", clientes_id)
    print("  ✅  Projetos → Clientes")

    # ── Entradas modelo ────────────────────────────────────────────────────
    print("\n🌱  Populando com entradas modelo...\n")

    print("  ⟶  Pipeline Comercial")
    seed_pipeline(pipeline_id)

    print("  ⟶  Base de Clientes")
    seed_clientes(clientes_id)

    print("  ⟶  Calendário de Conteúdo")
    seed_conteudo(conteudo_id)

    print("  ⟶  KPIs & Métricas")
    seed_kpis(kpis_id)

    print("  ⟶  Projetos")
    seed_projetos(projetos_id)

    print("  ⟶  Biblioteca de Prompts")
    seed_prompts(prompts_id)

    print("  ⟶  Base de Conhecimento")
    seed_conhecimento(conhec_id)

    # ── Resumo ─────────────────────────────────────────────────────────────
    print("""
╔══════════════════════════════════════════════════════════════╗
║          ✅  WORKSPACE CRIADO COM SUCESSO                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Bancos de dados criados:                                    ║
║  🎯  Pipeline Comercial      (4 leads modelo)                ║
║  👥  Base de Clientes        (3 clientes modelo)             ║
║  📅  Calendário de Conteúdo  (5 conteúdos modelo)            ║
║  📊  KPIs & Métricas         (5 métricas modelo)             ║
║  🚀  Projetos                (5 projetos modelo)             ║
║  🤖  Biblioteca de Prompts   (6 prompts prontos)             ║
║  📚  Base de Conhecimento    (7 documentos modelo)           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  PRÓXIMO PASSO — Ativar visão Galeria:                       ║
║  1. Abra cada banco de dados no Notion                       ║
║  2. Clique em "+ Adicionar uma visualização"                 ║
║  3. Selecione "Galeria"                                      ║
║  4. Em "Propriedades da galeria" → ative "Mostrar capa"      ║
║  5. Repita para todos os 7 bancos                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
""")


if __name__ == "__main__":
    main()
