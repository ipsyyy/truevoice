# TrueVoice 🎙️

**Brand voice consistency scorer for AI-assisted social media management.**

TrueVoice analyzes a brand's social messages and scores how consistently 
they reflect the intended brand voice — across tone, formality, personality, 
vocabulary, and visual language.

## The Problem

AI agents are now handling millions of brand conversations every day. As brands 
scale social engagement through automation, voice consistency becomes an 
operational discipline — not just a creative preference. A single off-brand 
reply can get screenshotted and go viral for the wrong reasons.

Yet there is no standardized way to measure whether AI-generated or 
human-written brand messages are actually staying on-brand over time.

TrueVoice makes that measurable.

## What It Does

- **5-dimension voice scoring** — Tone, Formality, Personality, Vocabulary, 
  Visual Language
- **Overall consistency score** (0–100) with Consistent / Drifting / 
  Fragmented classification
- **Flags the 3 most inconsistent messages** with specific reasoning and 
  suggested rewrites
- **One-sentence diagnosis** summarizing the brand's voice pattern and 
  biggest consistency gap
- **Radar chart visualization** across all five dimensions
- **URL fetch mode** — paste a public URL and auto-extract brand content 
  via Firecrawl
- **LLM observability** — every scoring run is logged and traced via Langfuse

## Built With

- React + Vite
- Claude API (claude-sonnet-4-5) — voice scoring and rewrite generation
- Firecrawl — web content extraction from public URLs
- Langfuse — LLM observability and prompt tracing
- Recharts — radar chart visualization

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env` and add your API keys
3. Run `npm install`
4. Run `npm run dev`
5. Open `localhost:5173`

## Environment Variables

See `.env.example` for required keys:
- `VITE_ANTHROPIC_API_KEY`
- `VITE_FIRECRAWL_API_KEY`
- `VITE_LANGFUSE_PUBLIC_KEY`
- `VITE_LANGFUSE_SECRET_KEY`
- `VITE_LANGFUSE_HOST`

## PM Context

This project was built as a product exploration of brand voice governance 
in the agentic AI marketing space. It demonstrates how voice consistency 
can be operationalized as a measurable, scoreable product feature — rather 
than remaining a subjective editorial judgment.

Built by [Ipsita Choudhury](https://linkedin.com/in/ipsita-choudhury/) — 
Senior PM with 9+ years of experience, currently based in the SF Bay Area.