# Pricing Fixtures

Store provider-specific HTML/JSON fixtures here to keep parsers stable without calling live endpoints in tests.

- `openai/`: snapshots of pricing tables and API responses.
- `anthropic/`: token pricing tables, prompt caching details.
- `gemini/`: Vertex AI JSON payloads and cached HTML.
- `cohere/`, `perplexity/`, etc.: add subdirectories as parsers land.

Use these fixtures in unit tests so we can detect DOM or schema changes before production runs. Keep sensitive or license-restricted data out of the repo.
