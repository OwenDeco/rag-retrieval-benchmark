# Experiment Contract (v1)

## Objective
Benchmark two retrieval paradigms under controlled enterprise-like conditions:
A) BM25 lexical retrieval with semantic reranking
B) Embedding-based vector retrieval

Primary question:
How do A and B compare in reliability, latency, and cost under controlled conditions?

## Fixed Controls
- Region: West Europe
- Search: Azure AI Search (Standard S1)
- LLM: GPT-5.2
- Temperature: 0.1 (fixed)
- Chunking: 500 tokens, 100-token overlap
- Context budget: 4,000 tokens max injected
- Repetitions: 5 runs per query per configuration
- Warm-up: exclude first run per configuration from reporting (still logged)

## Independent Variables
- Retrieval family: A (BM25+Semantic) vs B (Vector)
- TopK: 3 / 5 / 10
- Metadata filtering: OFF / ON
- Reranking: OFF / ON (within selected branch per staged design)

## Dependent Metrics (Definitions)
- hit@k: 1 if any retrieved chunk maps to an expected source document for the query; else 0
- MRR: reciprocal rank of the first retrieved chunk that maps to an expected source document
- Groundedness: 1–5 rubric (stored as integer); rubric defined in contract/groundedness_rubric_v1.md
- Unsupported claims: integer count of claims not supported by retrieved context
- Latency: end-to-end ms (retrieval + LLM); report p50/p95 across runs
- Token count: prompt + completion tokens
- Cost/query: derived from token count and configured pricing table
- Correct answer: determined by correctness rule below
- Cost/correct: total cost divided by number of correct answers

## Correctness Rule (v1)
Correct = (Groundedness >= 4) AND (UnsupportedClaims == 0)

## Logging
All runs must include:
- configuration (branch, TopK, filter, rerank, prompt version)
- retrieval outputs (chunk_ids, doc_ids, scores)
- LLM usage (tokens, latency)
- evaluation fields (hit@k, MRR, groundedness, unsupported claims, correct)
See schemas/run_log_schema_v1.json.

## Staged Methodology
1) Retrieval family screening (TopK=5)
2) Retrieval depth optimization (TopK 3/5/10) on winning branch
3) Metadata filtering impact (OFF/ON)
4) Reranking impact (OFF/ON)
5) Final spot-check validation
