# PLAYBOOK COMERCIAL — QUELLNODIGITAL
## CRM · Pipeline · Etapas Automatizadas

---

## VISÃO GERAL DO PIPELINE

```
LEAD CAPTADO
     │
     ▼
[1] PRIMEIRO CONTATO          → SLA: até 15 min após entrada
     │
     ▼
[2] DIAGNÓSTICO               → SLA: reunião em até 48h
     │
     ▼
[3] PROPOSTA ENVIADA          → SLA: proposta em até 24h após diagnóstico
     │
     ▼
[4] NEGOCIAÇÃO                → SLA: resposta em até 1 dia útil
     │
     ▼
[5] CONTRATO ASSINADO         → Onboarding em até 3 dias úteis
     │
     ▼
[6] ONBOARDING ATIVO          → Kickoff em até 5 dias úteis
```

---

## ESTRUTURA DO CRM

### Campos obrigatórios por lead

| Campo | Tipo | Observação |
|-------|------|-----------|
| Nome completo | Texto | — |
| Empresa | Texto | — |
| Segmento | Lista | Clínica / Estética / Jurídico / Educação / Consultoria / E-commerce / Outro |
| Faturamento mensal | Lista | Até R$30k / R$30k–100k / R$100k–300k / Acima de R$300k |
| Origem do lead | Lista | Tráfego pago / Instagram / Indicação / WhatsApp / Cold outreach |
| Etapa do pipeline | Lista | Etapas 1–6 |
| Responsável comercial | Usuário | — |
| Data de entrada | Data | Automático |
| Próxima ação | Texto | Atualizado a cada interação |
| Data da próxima ação | Data | — |
| Valor estimado do contrato | Número | Atualizado na etapa 3 |
| Score de qualificação | Número | 0–10 (ver critérios abaixo) |
| Motivo de perda | Lista | Preço / Timing / Concorrente / Sem orçamento / Sem fit |

### Score de qualificação (0–10)

| Critério | Pontos |
|----------|--------|
| Faturamento acima de R$30k/mês | +2 |
| Já investe em marketing | +2 |
| Tem equipe comercial | +2 |
| Tomador de decisão confirmado | +2 |
| Urgência declarada (problema ativo) | +2 |

**Score ≥ 6** → avança para diagnóstico.
**Score < 6** → nurturing ou descarte qualificado.

---

## ETAPA 1 — PRIMEIRO CONTATO

**Objetivo:** qualificar o lead em até 15 minutos e agendar diagnóstico.

**SLA:** resposta em até 15 min após entrada (horário comercial).

### Script de abordagem (WhatsApp)

```
Olá, [Nome]! Aqui é [Seu nome], da Quellnodigital.

Vi que você demonstrou interesse em crescer sua operação de marketing
e vendas — fico feliz que chegou até nós.

Para eu entender melhor o seu momento:
1. Qual é o seu negócio e quanto você fatura por mês, em média?
2. Qual é o seu maior desafio hoje — leads, conversão ou retenção?

Com isso já consigo te dizer se faz sentido a gente conversar
e como podemos ajudar de verdade.
```

### Perguntas de qualificação rápida

1. Qual é o faturamento mensal atual?
2. Já investe em marketing pago? Quanto por mês?
3. Tem equipe comercial ou vende sozinho?
4. Qual é o maior gargalo agora — leads, conversão ou clientes saindo?
5. Quem toma a decisão de investimento na empresa?

### Critério de avanço

- Score ≥ 6 → agenda diagnóstico
- Score < 6 → entra em sequência de nurturing (ver seção de automações)

### Automação ativa nesta etapa

- **Gatilho:** lead entra no CRM
- **Ação 1:** mensagem de boas-vindas automática no WhatsApp (até 5 min)
- **Ação 2:** se sem resposta em 1h → follow-up automático
- **Ação 3:** se sem resposta em 24h → segundo follow-up + oferta de diagnóstico gratuito

---

## ETAPA 2 — DIAGNÓSTICO

**Objetivo:** mapear o negócio do cliente, identificar gargalos reais e criar urgência genuína.

**Formato:** videochamada de 45–60 min.

**SLA:** reunião realizada em até 48h após qualificação.

### Estrutura da reunião de diagnóstico

#### Bloco 1 — Contexto (10 min)
- O que a empresa faz e qual é o diferencial real
- Quanto fatura e qual é a meta de crescimento
- Há quanto tempo está no mercado

#### Bloco 2 — Situação atual de marketing e vendas (20 min)
- O que já foi tentado (o que funcionou e o que não funcionou)
- Como chega a maioria dos clientes hoje
- Qual é o CAC atual (mesmo que estimado)
- Qual é a taxa de conversão do comercial
- Tem CRM? Usa alguma ferramenta?

#### Bloco 3 — Dores e objetivos (15 min)
- Qual é o maior problema hoje (sem romantizar)
- O que acontece se nada mudar em 6 meses
- Qual seria o resultado ideal em 6 meses

#### Bloco 4 — Apresentação do próximo passo (5 min)
- Não vender ainda — apresentar o que você viu
- Confirmar que faz sentido construir uma proposta personalizada
- Definir data para apresentação da proposta

### Perguntas de diagnóstico (aprofundamento)

**Sobre aquisição:**
- De onde vêm os clientes hoje? (indicação, tráfego, orgânico, cold)
- Qual canal traz o cliente com melhor perfil?
- Qual o custo por lead atual?

**Sobre conversão:**
- Quantos leads chegam por mês?
- Quantos viram clientes?
- Qual é o tempo médio de fechamento?

**Sobre retenção:**
- Qual o LTV médio do cliente?
- Qual a taxa de churn mensal?
- O que faz o cliente sair?

**Sobre operação:**
- Tem processo definido de onboarding?
- Usa alguma automação hoje?
- Onde está o maior desperdício de tempo da equipe?

### Critério de avanço

- Tomador de decisão presente na reunião
- Urgência confirmada (problema ativo, não especulativo)
- Orçamento compatível com o pacote mínimo

### Automação ativa nesta etapa

- **24h antes:** lembrete automático da reunião (WhatsApp + e-mail)
- **30 min antes:** segundo lembrete com link da chamada
- **Imediatamente após:** mensagem de encerramento com próximo passo combinado

---

## ETAPA 3 — PROPOSTA ENVIADA

**Objetivo:** apresentar a solução personalizada e ancorar valor antes de falar em preço.

**SLA:** proposta enviada em até 24h após diagnóstico.

### Estrutura da proposta

```
1. DIAGNÓSTICO — o que encontramos no seu negócio
   (reflita o que o cliente disse com as palavras dele)

2. O QUE ESTÁ TRAVANDO SEU CRESCIMENTO
   (3 gargalos principais, em linguagem de negócio)

3. NOSSA PROPOSTA PARA OS PRÓXIMOS 6 MESES
   (escopo orientado a resultado, não a entregável)

4. O QUE VOCÊ VAI TER EM 30 / 60 / 90 DIAS
   (marcos concretos e mensuráveis)

5. KPIs DE ACOMPANHAMENTO
   (CAC, ROAS, CPL, taxa de conversão, LTV)

6. INVESTIMENTO
   (apresentar valor, não preço — ancoragem antes do número)

7. PRÓXIMO PASSO
   (call to action claro: assinar ou marcar call de dúvidas)
```

### Apresentação (ao vivo é sempre melhor)

- Nunca envie proposta sem apresentar ao vivo quando possível
- Se enviar por escrito: grave um vídeo de 3–5 min explicando os pontos principais
- Não envie PDF sem follow-up agendado

### Critério de avanço

- Cliente confirmou leitura/visualização da proposta
- Perguntas ou objeções foram levantadas (sinal de interesse real)

### Automação ativa nesta etapa

- **Imediatamente:** proposta enviada + mensagem de contexto no WhatsApp
- **24h sem resposta:** follow-up humanizado ("Conseguiu ver a proposta?")
- **48h sem resposta:** follow-up com urgência leve ("Quero garantir que você tem tudo para decidir com clareza")
- **72h sem resposta:** ligação direta ou mensagem de último contato

---

## ETAPA 4 — NEGOCIAÇÃO

**Objetivo:** resolver objeções reais e conduzir ao fechamento sem desconto desnecessário.

**SLA:** resposta a qualquer contato em até 1 dia útil.

### Objeções mais comuns e respostas

#### "Está caro."

```
Entendo. Mas vamos olhar pelo lado do investimento:
se a gente conseguir trazer [X leads qualificados] por mês
e sua taxa de conversão for de [Y%], estamos falando de
[Z reais] em receita nova — isso representa [múltiplo] do investimento.

O que está pesando mais: o valor total ou o fluxo de caixa?
```

#### "Preciso pensar."

```
Claro, faz sentido. Me ajuda a entender: o que você ainda
precisa ter clareza para tomar essa decisão?
Tem alguma dúvida que a proposta não respondeu?
```

#### "Vou ver com meu sócio / marido / financeiro."

```
Ótimo. Posso participar dessa conversa com vocês?
Assim garanto que todas as dúvidas sejam respondidas
na hora e a decisão fique mais fácil.
```

#### "Já trabalhei com agência e não funcionou."

```
Faz todo sentido ter esse receio. O que não funcionou antes?
[Ouça com atenção]

O que diferencia nosso trabalho é que a gente assume
responsabilidade pelo resultado — não entregamos posts,
entregamos crescimento. E isso aparece nos números.
```

#### "Posso começar com algo menor?"

```
Sim, podemos adaptar o escopo. O que não podemos fazer
é entregar resultado menor do que o que você precisa.

Me fala qual é o seu orçamento real agora —
a partir daí vejo o que faz sentido propor sem comprometer o resultado.
```

### Gatilho de fechamento

Use escassez real (nunca falsa):
- Vagas de onboarding por mês
- Data limite para garantir o mesmo investimento

### Critério de avanço

- Decisão de compra confirmada verbalmente
- Contrato enviado para assinatura

---

## ETAPA 5 — CONTRATO ASSINADO

**Objetivo:** formalizar, cobrar e preparar o onboarding sem atritos.

**SLA:** contrato enviado em até 4h após confirmação verbal. Onboarding iniciado em até 3 dias úteis após assinatura.

### Checklist pós-fechamento

- [ ] Contrato enviado (DocuSign ou similar)
- [ ] Pagamento confirmado (NF emitida)
- [ ] Formulário de onboarding enviado ao cliente
- [ ] Reunião de kickoff agendada
- [ ] Responsável interno designado para a conta
- [ ] Cliente adicionado ao grupo de comunicação (WhatsApp ou Slack)
- [ ] Pasta do cliente criada com estrutura padrão

### Automação ativa nesta etapa

- **Imediatamente:** mensagem de boas-vindas oficial + expectativas dos próximos passos
- **24h após assinatura:** lembrete do formulário de onboarding (se não preenchido)
- **48h após assinatura:** confirmação do kickoff

---

## ETAPA 6 — ONBOARDING ATIVO

**Objetivo:** garantir que o cliente sinta valor imediato e reduza o risco de churn nos primeiros 90 dias.

**Formato:** reunião de kickoff + plano 30-60-90 entregue na primeira semana.

### Reunião de kickoff (até 5 dias úteis após assinatura)

**Pauta:**
1. Apresentação do time responsável pela conta
2. Alinhamento de expectativas e metas dos primeiros 30 dias
3. Acesso a ferramentas e materiais necessários
4. Definição de canal e frequência de comunicação
5. Data da primeira reunião estratégica mensal

### Plano 30-60-90 padrão de onboarding

| Período | Foco | Entregáveis |
|---------|------|-------------|
| **30 dias** | Diagnóstico profundo + fundação | Auditoria completa, acesso a contas, primeiras campanhas no ar |
| **60 dias** | Otimização + primeiros resultados | Relatório de performance, ajustes de rota, leads qualificados entrando |
| **90 dias** | Escala + revisão estratégica | Reunião de review, expansão de escopo se aplicável, upsell identificado |

### Sinais de alerta de churn (monitorar ativamente)

- Cliente não responde em mais de 48h
- Cliente questiona o valor do serviço antes do dia 45
- Métricas abaixo do projetado sem comunicação proativa
- Reunião mensal adiada mais de 2x

---

## CADÊNCIA DE FOLLOW-UP (para leads que não avançaram)

### Nurturing — leads com score < 6

| Dia | Ação | Canal |
|-----|------|-------|
| D+0 | Mensagem inicial com conteúdo de valor (case ou insight) | WhatsApp |
| D+7 | Envio de material educativo (guia, checklist) | E-mail |
| D+15 | Pergunta direta: "O que mudou no seu negócio desde que conversamos?" | WhatsApp |
| D+30 | Oferta de diagnóstico gratuito | WhatsApp + E-mail |
| D+60 | Última tentativa com novo ângulo de dor | WhatsApp |

### Recuperação — proposta enviada sem resposta

| Dia | Ação |
|-----|------|
| D+1 | "Conseguiu ver a proposta?" |
| D+3 | Envio de case relevante para o segmento do lead |
| D+5 | Pergunta sobre o que está travando a decisão |
| D+7 | Oferta de call de 15 min para dúvidas |
| D+10 | Último contato — encerramento humanizado com porta aberta |

---

## KPIs DO PIPELINE

| Métrica | Meta | Frequência de revisão |
|---------|------|-----------------------|
| Taxa de qualificação (leads → diagnóstico) | ≥ 40% | Semanal |
| Taxa de diagnóstico → proposta | ≥ 70% | Semanal |
| Taxa de proposta → fechamento | ≥ 30% | Semanal |
| Tempo médio de ciclo (lead → contrato) | ≤ 10 dias | Mensal |
| Ticket médio | Meta por pacote | Mensal |
| CAC (custo de aquisição de cliente) | ≤ 1x ticket mensal | Mensal |
| LTV / CAC | ≥ 12x | Trimestral |
| Taxa de churn (primeiros 90 dias) | ≤ 5% | Mensal |

---

## REGRAS DO PIPELINE (não negociáveis)

1. **Todo lead qualificado tem próxima ação e data definida** — nenhum lead fica sem movimento por mais de 48h.
2. **Diagnóstico só acontece com tomador de decisão presente** — sem exceções.
3. **Proposta nunca é enviada sem apresentação** — ao vivo ou em vídeo gravado.
4. **Desconto só existe com contrapartida** — pagamento antecipado, prazo maior de contrato ou indicação.
5. **Lead perdido tem motivo registrado no CRM** — sem isso, não há aprendizado.
6. **Reunião mensal é inegociável** — faz parte do contrato, não é favor.

---

## FERRAMENTAS RECOMENDADAS

| Função | Ferramenta sugerida |
|--------|-------------------|
| CRM | HubSpot Free / Pipedrive / RD Station CRM |
| Assinatura de contrato | DocuSign / Clicksign |
| Automação WhatsApp | Z-API / Wapi / Typebot |
| Agendamento | Calendly / Google Agenda |
| Proposta | Canva Pro / Notion / Pipefy |
| Reuniões | Google Meet / Zoom |
| Relatórios | Google Looker Studio |

---

*Documento interno — Grupo Quellem / Quellnodigital*
*Versão: 1.0 — revisão trimestral recomendada*
