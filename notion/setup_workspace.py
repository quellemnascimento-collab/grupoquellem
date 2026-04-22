#!/usr/bin/env python3
"""
Quellnodigital — Notion Workspace Builder
Usa a API version 2022-06-28 via httpx para compatibilidade total.

Uso:
    pip install -r requirements.txt
    cp .env.example .env          # preencha NOTION_API_KEY
    python setup_workspace.py
"""

import os
import sys
import time
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.environ.get("NOTION_API_KEY", "")
PARENT_PAGE_ID = os.environ.get(
    "NOTION_PARENT_PAGE_ID",
    "64833381-2ed5-4cc5-8de9-97041eac4e2e",
)

if not TOKEN:
    print("❌  Defina NOTION_API_KEY no .env")
    sys.exit(1)

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}
BASE = "https://api.notion.com/v1"

# ─── HTTP helpers ─────────────────────────────────────────────────────────────

def _req(method: str, path: str, body: dict | None = None) -> dict:
    url = f"{BASE}{path}"
    r = httpx.request(method, url, headers=HEADERS, json=body, timeout=30)
    if not r.is_success:
        print(f"\n❌  {method} {path}  →  {r.status_code}")
        print(r.text[:800])
        sys.exit(1)
    time.sleep(0.35)
    return r.json()


def get(path: str) -> dict:
    return _req("GET", path)

def post(path: str, body: dict) -> dict:
    return _req("POST", path, body)

def patch(path: str, body: dict) -> dict:
    return _req("PATCH", path, body)


# ─── Notion property builders ─────────────────────────────────────────────────

def rt(content: str) -> list[dict]:
    return [{"type": "text", "text": {"content": content}}]

def opts(*names: str, colors: list[str] | None = None) -> list[dict]:
    palette = ["blue","green","yellow","orange","red","purple","pink","gray","brown","default"]
    return [
        {"name": n, "color": colors[i] if colors and i < len(colors) else palette[i % len(palette)]}
        for i, n in enumerate(names)
    ]

def select_prop(*names, colors=None):
    return {"select": {"options": opts(*names, colors=colors)}}

def multi_prop(*names, colors=None):
    return {"multi_select": {"options": opts(*names, colors=colors)}}


# ─── Database create & update ─────────────────────────────────────────────────

def create_db(parent_id: str, title: str, emoji: str, properties: dict) -> str:
    body = {
        "parent": {"type": "page_id", "page_id": parent_id},
        "icon": {"type": "emoji", "emoji": emoji},
        "title": rt(title),
        "properties": properties,
    }
    db = post("/databases", body)
    db_id = db["id"]
    print(f"  ✅  {emoji}  {title}  [{db_id}]")
    return db_id


def update_db_props(db_id: str, properties: dict):
    patch(f"/databases/{db_id}", {"properties": properties})


def add_relation_prop(db_id: str, prop_name: str, target_db_id: str):
    patch(f"/databases/{db_id}", {
        "properties": {
            prop_name: {"relation": {"database_id": target_db_id, "single_property": {}}}
        }
    })


# ─── Page (entry) create ──────────────────────────────────────────────────────

def add_entry(db_id: str, properties: dict, emoji: str | None = None) -> str:
    body: dict = {"parent": {"database_id": db_id}, "properties": properties}
    if emoji:
        body["icon"] = {"type": "emoji", "emoji": emoji}
    page = post("/pages", body)
    return page["id"]


# ─── Property schemas ─────────────────────────────────────────────────────────

def schema_pipeline() -> dict:
    return {
        "Lead": {"title": {}},
        "Empresa": {"rich_text": {}},
        "Etapa": select_prop(
            "1 · Primeiro Contato", "2 · Diagnóstico", "3 · Proposta Enviada",
            "4 · Negociação", "5 · Contrato Assinado", "6 · Onboarding Ativo",
            colors=["gray","blue","yellow","orange","green","purple"],
        ),
        "Segmento": select_prop(
            "Clínica / Saúde","Estética / Beleza","Jurídico",
            "Educação","Consultoria","E-commerce","Imobiliário","Tecnologia","Outro",
        ),
        "Faturamento": select_prop(
            "Até R$30k","R$30k–100k","R$100k–300k","Acima de R$300k",
            colors=["gray","blue","green","purple"],
        ),
        "Score": {"number": {"format": "number"}},
        "Valor Estimado": {"number": {"format": "real"}},
        "Origem": select_prop(
            "Tráfego Pago","Instagram Orgânico","Indicação",
            "WhatsApp","Cold Outreach","LinkedIn","Evento",
        ),
        "Próxima Ação": {"rich_text": {}},
        "Data Próxima Ação": {"date": {}},
        "Data de Entrada": {"date": {}},
        "Responsável": {"people": {}},
        "Motivo de Perda": select_prop(
            "Preço","Timing","Concorrente","Sem Orçamento","Sem Fit","Sem Decisão",
            colors=["red","orange","yellow","gray","brown","default"],
        ),
    }


def schema_clientes() -> dict:
    return {
        "Cliente": {"title": {}},
        "Empresa": {"rich_text": {}},
        "Segmento": select_prop(
            "Clínica / Saúde","Estética / Beleza","Jurídico",
            "Educação","Consultoria","E-commerce","Imobiliário","Tecnologia","Outro",
        ),
        "Pacote": select_prop("Base","Crescimento","Escala", colors=["blue","green","purple"]),
        "Status": select_prop("Onboarding","Ativo","Em Risco","Inativo", colors=["yellow","green","orange","red"]),
        "Valor Mensal": {"number": {"format": "real"}},
        "Início do Contrato": {"date": {}},
        "NPS": {"number": {"format": "number"}},
        "WhatsApp": {"phone_number": {}},
        "Email": {"email": {}},
        "Responsável": {"people": {}},
    }


def schema_conteudo() -> dict:
    return {
        "Título": {"title": {}},
        "Formato": select_prop(
            "Reels","Carrossel","Story","Post Estático",
            "Copy","E-mail","Artigo","Vídeo Longo","Podcast",
        ),
        "Canal": select_prop("Instagram","LinkedIn","WhatsApp","TikTok","YouTube","Blog","E-mail"),
        "Funil": select_prop(
            "Topo · Atração","Meio · Autoridade","Fundo · Conversão",
            colors=["blue","yellow","green"],
        ),
        "Objetivo": select_prop("Atração","Autoridade","Conversão","Retenção", colors=["blue","purple","green","orange"]),
        "Status": select_prop(
            "Ideia","Roteiro","Produção","Revisão","Aprovado","Publicado",
            colors=["gray","blue","yellow","orange","green","purple"],
        ),
        "Publicação": {"date": {}},
        "CTA": select_prop("Saiba Mais","Fale Conosco","Agendar Diagnóstico","Baixar Material","Seguir","Comprar"),
        "Responsável": {"people": {}},
    }


def schema_kpis() -> dict:
    return {
        "Métrica": {"title": {}},
        "Tipo": select_prop(
            "CAC","ROAS","CPL","Taxa de Conversão",
            "LTV","Churn","Leads Gerados","Faturamento","CTR","Taxa de Abertura",
        ),
        "Período": {"date": {}},
        "Valor Atual": {"number": {"format": "number"}},
        "Meta": {"number": {"format": "number"}},
        "Status": select_prop(
            "Acima da Meta","Na Meta","Abaixo da Meta","Crítico",
            colors=["green","blue","orange","red"],
        ),
    }


def schema_projetos() -> dict:
    return {
        "Projeto": {"title": {}},
        "Fase": select_prop(
            "Fundação (30 dias)","Aquisição (60 dias)","Escala (90 dias)",
            colors=["blue","yellow","green"],
        ),
        "Status": select_prop(
            "Planejamento","Em Andamento","Revisão","Concluído","Pausado",
            colors=["gray","blue","yellow","green","orange"],
        ),
        "Prioridade": select_prop("Alta","Média","Baixa", colors=["red","yellow","blue"]),
        "Data Início": {"date": {}},
        "Data Entrega": {"date": {}},
        "Responsável": {"people": {}},
    }


def schema_prompts() -> dict:
    return {
        "Prompt": {"title": {}},
        "Categoria": select_prop(
            "Diagnóstico","Proposta","Conteúdo",
            "Funil","Performance","Atendimento","Vendas",
        ),
        "Uso": select_prop("Cliente","Interno","Marketing","Vendas", colors=["green","blue","purple","orange"]),
        "Tags": multi_prop("IA","WhatsApp","Funil","Diagnóstico","Proposta","CRM","Conteúdo","Performance"),
        "Texto": {"rich_text": {}},
    }


def schema_conhecimento() -> dict:
    return {
        "Título": {"title": {}},
        "Categoria": select_prop("Processo","Template","Script","Guia","Case","Modelo","Treinamento"),
        "Status": select_prop("Rascunho","Publicado","Arquivado", colors=["yellow","green","gray"]),
        "Tags": multi_prop("Comercial","Marketing","Operação","IA","Onboarding","Retenção","Conteúdo"),
    }


# ─── Seed functions ───────────────────────────────────────────────────────────

def seed_pipeline(db_id: str):
    rows = [
        ("Clínica Bem Estar","Clínica VidaSaúde","1 · Primeiro Contato","Clínica / Saúde","R$30k–100k",7,3500,"Instagram Orgânico","Enviar apresentação da Quellnodigital","🟡"),
        ("Studio Glow Ana","Studio Glow","2 · Diagnóstico","Estética / Beleza","R$30k–100k",8,4200,"Indicação","Reunião de diagnóstico agendada","🔵"),
        ("Adv. Costa & Assoc.","Costa Advocacia","3 · Proposta Enviada","Jurídico","R$100k–300k",9,6500,"Tráfego Pago","Follow-up: proposta enviada há 24h","🟠"),
        ("EduMais Cursos","EduMais","4 · Negociação","Educação","R$30k–100k",6,2800,"Cold Outreach","Contornar objeção de preço","🔴"),
    ]
    for nome, empresa, etapa, seg, fat, score, val, origem, acao, emoji in rows:
        add_entry(db_id, {
            "Lead":            {"title": rt(nome)},
            "Empresa":         {"rich_text": rt(empresa)},
            "Etapa":           {"select": {"name": etapa}},
            "Segmento":        {"select": {"name": seg}},
            "Faturamento":     {"select": {"name": fat}},
            "Score":           {"number": score},
            "Valor Estimado":  {"number": val},
            "Origem":          {"select": {"name": origem}},
            "Próxima Ação":    {"rich_text": rt(acao)},
        }, emoji)


def seed_clientes(db_id: str):
    rows = [
        ("Dr. Paulo Ferreira","Clínica VidaSaúde","Clínica / Saúde","Escala","Ativo",4200,9,"🟢"),
        ("Ana Lima","Studio Bloom","Estética / Beleza","Crescimento","Onboarding",2800,8,"🟡"),
        ("BRGrowth Consultoria","BRGrowth","Consultoria","Base","Ativo",1900,7,"🔵"),
    ]
    for nome, empresa, seg, pacote, status, valor, nps, emoji in rows:
        add_entry(db_id, {
            "Cliente":       {"title": rt(nome)},
            "Empresa":       {"rich_text": rt(empresa)},
            "Segmento":      {"select": {"name": seg}},
            "Pacote":        {"select": {"name": pacote}},
            "Status":        {"select": {"name": status}},
            "Valor Mensal":  {"number": valor},
            "NPS":           {"number": nps},
        }, emoji)


def seed_conteudo(db_id: str):
    rows = [
        ("3 erros que impedem sua clínica de crescer online","Carrossel","Instagram","Topo · Atração","Autoridade","Ideia","Saiba Mais","🎯"),
        ("Como estruturamos um funil para estética em 30 dias","Reels","Instagram","Meio · Autoridade","Autoridade","Roteiro","Agendar Diagnóstico","🎬"),
        ("+140 leads em 45 dias — case clínica SP","Post Estático","Instagram","Fundo · Conversão","Conversão","Aprovado","Fale Conosco","📊"),
        ("Por que curtida não paga boleto","Reels","LinkedIn","Topo · Atração","Atração","Produção","Saiba Mais","💡"),
        ("Diagnóstico gratuito: onde seu marketing está travado","Copy","WhatsApp","Fundo · Conversão","Conversão","Aprovado","Agendar Diagnóstico","📲"),
        ("5 métricas que todo dono de negócio precisa acompanhar","Carrossel","Instagram","Meio · Autoridade","Autoridade","Ideia","Saiba Mais","📈"),
        ("Como a IA pode reduzir 60% do custo de atendimento","Reels","LinkedIn","Topo · Atração","Atração","Ideia","Saiba Mais","🤖"),
    ]
    for titulo, fmt, canal, funil, obj, status, cta, emoji in rows:
        add_entry(db_id, {
            "Título":    {"title": rt(titulo)},
            "Formato":   {"select": {"name": fmt}},
            "Canal":     {"select": {"name": canal}},
            "Funil":     {"select": {"name": funil}},
            "Objetivo":  {"select": {"name": obj}},
            "Status":    {"select": {"name": status}},
            "CTA":       {"select": {"name": cta}},
        }, emoji)


def seed_kpis(db_id: str):
    rows = [
        ("CAC — Clínica VidaSaúde","CAC",180,150,"Abaixo da Meta","📉"),
        ("ROAS — Studio Bloom","ROAS",4.2,4.0,"Acima da Meta","📈"),
        ("CPL — Campanha Diagnóstico","CPL",22,25,"Acima da Meta","✅"),
        ("Taxa de Conversão Comercial","Taxa de Conversão",28,30,"Abaixo da Meta","⚠️"),
        ("Churn Mensal","Churn",3,5,"Acima da Meta","🟢"),
        ("Leads Gerados — Abril","Leads Gerados",87,80,"Acima da Meta","🎯"),
    ]
    for metrica, tipo, atual, meta, status, emoji in rows:
        add_entry(db_id, {
            "Métrica":     {"title": rt(metrica)},
            "Tipo":        {"select": {"name": tipo}},
            "Valor Atual": {"number": atual},
            "Meta":        {"number": meta},
            "Status":      {"select": {"name": status}},
        }, emoji)


def seed_projetos(db_id: str):
    rows = [
        ("Lançamento Campanha Diagnóstico","Aquisição (60 dias)","Em Andamento","Alta","🚀"),
        ("Estruturação de Scripts Comerciais","Fundação (30 dias)","Concluído","Alta","✅"),
        ("Implementação CRM Interno","Fundação (30 dias)","Em Andamento","Alta","🔧"),
        ("Produção de 3 Cases Estruturados","Aquisição (60 dias)","Planejamento","Média","📋"),
        ("Automação WhatsApp com IA","Escala (90 dias)","Planejamento","Alta","🤖"),
        ("Criação de Pacotes (Base/Crescimento/Escala)","Fundação (30 dias)","Em Andamento","Alta","📦"),
    ]
    for nome, fase, status, prio, emoji in rows:
        add_entry(db_id, {
            "Projeto":    {"title": rt(nome)},
            "Fase":       {"select": {"name": fase}},
            "Status":     {"select": {"name": status}},
            "Prioridade": {"select": {"name": prio}},
        }, emoji)


def seed_prompts(db_id: str):
    rows = [
        (
            "Diagnóstico Estratégico de Cliente","Diagnóstico","Interno",
            ["IA","Diagnóstico","Funil"],
            "Aja como estrategista da Quellnodigital. Analise o seguinte negócio: [dados]. Gere: 1. Diagnóstico estratégico (problemas reais) 2. Gargalos no funil de vendas 3. Oportunidades de crescimento imediato 4. Plano de ação 30-60-90 5. KPIs ideais. Seja direto e orientado a resultado, sem generalizações.","🔍",
        ),
        (
            "Proposta Comercial de Alto Nível","Proposta","Vendas",
            ["Proposta","CRM"],
            "Aja como especialista em vendas consultivas da Quellnodigital. Cliente: [dados]. Crie proposta com: diagnóstico claro, escopo orientado a resultado, justificativa de cada ação, estrutura de investimento e argumentação de valor (não preço). Linguagem estratégica, sem jargões vazios.","📄",
        ),
        (
            "Estratégia de Conteúdo por Nicho","Conteúdo","Marketing",
            ["Conteúdo","Funil"],
            "Aja como estrategista de conteúdo orientado a vendas. Nicho: [segmento]. Crie 10 ideias com objetivo claro (atração, autoridade ou conversão), roteiro estratégico de cada conteúdo e CTA alinhado ao funil. Sem conteúdo genérico — tudo com função de negócio.","✍️",
        ),
        (
            "Desenho de Funil Completo","Funil","Cliente",
            ["Funil","IA","WhatsApp"],
            "Aja como especialista em funis de marketing e vendas. Negócio: [dados]. Desenhe funil completo com topo, meio e fundo, estratégias de aquisição, qualificação de leads, processo comercial e automações com IA. Foque em previsibilidade de receita.","🔄",
        ),
        (
            "Otimização de Performance — Cliente Ativo","Performance","Cliente",
            ["Performance","Diagnóstico"],
            "Aja como gestor de performance da Quellnodigital. Métricas: [dados]. Identifique: onde está o desperdício de dinheiro, oportunidades de otimização imediata, testes prioritários e plano de melhoria em 30 dias. Base: CTR, CPL, CAC, ROAS.","📊",
        ),
        (
            "Script de Qualificação WhatsApp","Atendimento","Vendas",
            ["WhatsApp","CRM"],
            "Aja como especialista em vendas consultivas. Segmento: [nicho]. Crie script de qualificação para WhatsApp que: gera rapport, identifica dor principal, qualifica faturamento e urgência e conduz para agendamento de diagnóstico. Máx. 5 perguntas. Tom consultivo, nunca agressivo.","💬",
        ),
    ]
    for nome, cat, uso, tags, texto, emoji in rows:
        add_entry(db_id, {
            "Prompt":    {"title": rt(nome)},
            "Categoria": {"select": {"name": cat}},
            "Uso":       {"select": {"name": uso}},
            "Tags":      {"multi_select": [{"name": t} for t in tags]},
            "Texto":     {"rich_text": rt(texto[:2000])},
        }, emoji)


def seed_conhecimento(db_id: str):
    rows = [
        ("Mapeamento Estratégico — Grupo Quellem","Guia","Publicado",["Marketing","Comercial","Operação"],"🗺️"),
        ("Playbook Comercial — Pipeline 6 Etapas","Processo","Publicado",["Comercial","CRM"],"🎯"),
        ("Script de Primeiro Contato — WhatsApp","Script","Publicado",["Comercial","WhatsApp"],"📲"),
        ("Roteiro de Reunião de Diagnóstico","Script","Publicado",["Comercial","Onboarding"],"🎙️"),
        ("Template de Proposta Comercial","Template","Publicado",["Comercial"],"📄"),
        ("Processo de Onboarding — 30-60-90","Processo","Publicado",["Onboarding","Operação"],"🗂️"),
        ("Guia de KPIs e Métricas Essenciais","Guia","Publicado",["Marketing","Operação"],"📊"),
        ("Checklist de Pós-Fechamento","Processo","Publicado",["Comercial","Onboarding"],"✅"),
        ("Objeções Mais Comuns e Como Responder","Script","Publicado",["Comercial","Vendas"],"💡"),
    ]
    for titulo, cat, status, tags, emoji in rows:
        add_entry(db_id, {
            "Título":    {"title": rt(titulo)},
            "Categoria": {"select": {"name": cat}},
            "Status":    {"select": {"name": status}},
            "Tags":      {"multi_select": [{"name": t} for t in tags]},
        }, emoji)


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("\n🚀  Quellnodigital — Notion Workspace Builder\n")

    # ── 1. Criar bancos de dados ───────────────────────────────────────────
    print("📦  Criando bancos de dados...\n")

    pipeline_id = create_db(PARENT_PAGE_ID, "Pipeline Comercial",     "🎯", schema_pipeline())
    clientes_id = create_db(PARENT_PAGE_ID, "Base de Clientes",       "👥", schema_clientes())
    conteudo_id = create_db(PARENT_PAGE_ID, "Calendário de Conteúdo", "📅", schema_conteudo())
    kpis_id     = create_db(PARENT_PAGE_ID, "KPIs e Métricas",        "📊", schema_kpis())
    projetos_id = create_db(PARENT_PAGE_ID, "Projetos",               "🚀", schema_projetos())
    prompts_id  = create_db(PARENT_PAGE_ID, "Biblioteca de Prompts",  "🤖", schema_prompts())
    conhec_id   = create_db(PARENT_PAGE_ID, "Base de Conhecimento",   "📚", schema_conhecimento())

    # ── 2. Relações entre bancos ───────────────────────────────────────────
    print("\n🔗  Criando relações...\n")

    add_relation_prop(pipeline_id, "Cliente Convertido", clientes_id)
    print("  ✅  Pipeline → Clientes")
    add_relation_prop(conteudo_id, "Cliente",  clientes_id)
    print("  ✅  Conteúdo → Clientes")
    add_relation_prop(conteudo_id, "Projeto",  projetos_id)
    print("  ✅  Conteúdo → Projetos")
    add_relation_prop(kpis_id,     "Cliente",  clientes_id)
    print("  ✅  KPIs → Clientes")
    add_relation_prop(projetos_id, "Cliente",  clientes_id)
    print("  ✅  Projetos → Clientes")

    # ── 3. Semear entradas ─────────────────────────────────────────────────
    print("\n🌱  Populando com entradas modelo...\n")

    print("  ⟶  Pipeline Comercial")
    seed_pipeline(pipeline_id)

    print("  ⟶  Base de Clientes")
    seed_clientes(clientes_id)

    print("  ⟶  Calendário de Conteúdo")
    seed_conteudo(conteudo_id)

    print("  ⟶  KPIs e Métricas")
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
║  🎯  Pipeline Comercial      4 leads em etapas diferentes    ║
║  👥  Base de Clientes        3 clientes modelo               ║
║  📅  Calendário de Conteúdo  7 conteúdos prontos             ║
║  📊  KPIs e Métricas         6 métricas com meta vs. atual   ║
║  🚀  Projetos                6 projetos do plano de escala   ║
║  🤖  Biblioteca de Prompts   6 prompts estratégicos          ║
║  📚  Base de Conhecimento    9 documentos internos           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ATIVAR VISÃO GALERIA (por banco):                           ║
║  → Clique em "+ Adicionar visualização"                      ║
║  → Selecione "Galeria"                                       ║
║  → Propriedades → ative "Mostrar capa da página"             ║
╚══════════════════════════════════════════════════════════════╝
""")


if __name__ == "__main__":
    main()
