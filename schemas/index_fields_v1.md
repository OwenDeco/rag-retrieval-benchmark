# Azure AI Search Index Blueprint (v1)

Key:
- id (Key): chunk_id
- doc_id (Filterable, Facetable)
- chunk_ordinal (Filterable, Sortable)
- title (Searchable)
- content (Searchable)  [BM25 + Semantic]
- contentVector (Vector) [Vector search; populated in Phase 2]
- source_uri (Filterable)
- source (Filterable, Facetable)
- domain (Filterable, Facetable)
- language (Filterable, Facetable)

Semantic config:
- Title field: title
- Content fields: content

Vector config:
- Field: contentVector
- Similarity: cosine
- Dimensions: match embedding model output
