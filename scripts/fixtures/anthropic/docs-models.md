Title: Models overview - Claude Docs

URL Source: https://docs.claude.com/en/docs/about-claude/models

Markdown Content:
* * *

Model names
-----------

| Model | Claude API | AWS Bedrock | GCP Vertex AI |
| --- | --- | --- | --- |
| Claude Sonnet 4.5 | claude-sonnet-4-5-20250929 | anthropic.claude-sonnet-4-5-20250929-v1:0 | claude-sonnet-4-5@20250929 |
| Claude Sonnet 4 | claude-sonnet-4-20250514 | anthropic.claude-sonnet-4-20250514-v1:0 | claude-sonnet-4@20250514 |
| Claude Sonnet 3.7 | claude-3-7-sonnet-20250219 (claude-3-7-sonnet-latest) | anthropic.claude-3-7-sonnet-20250219-v1:0 | claude-3-7-sonnet@20250219 |
| Claude Opus 4.1 | claude-opus-4-1-20250805 | anthropic.claude-opus-4-1-20250805-v1:0 | claude-opus-4-1@20250805 |
| Claude Opus 4 | claude-opus-4-20250514 | anthropic.claude-opus-4-20250514-v1:0 | claude-opus-4@20250514 |
| Claude Haiku 3.5 | claude-3-5-haiku-20241022 (claude-3-5-haiku-latest) | anthropic.claude-3-5-haiku-20241022-v1:0 | claude-3-5-haiku@20241022 |
| Claude Haiku 3 | claude-3-haiku-20240307 | anthropic.claude-3-haiku-20240307-v1:0 | claude-3-haiku@20240307 |

### Model aliases

For convenience during development and testing, we offer aliases for our model ids. These aliases automatically point to the most recent snapshot of a given model. When we release new model snapshots, we migrate aliases to point to the newest version of a model, typically within a week of the new release.

| Model | Alias | Model ID |
| --- | --- | --- |
| Claude Opus 4.1 | claude-opus-4-1 | claude-opus-4-1-20250805 |
| Claude Opus 4 | claude-opus-4-0 | claude-opus-4-20250514 |
| Claude Sonnet 4.5 | claude-sonnet-4-5 | claude-sonnet-4-5-20250929 |
| Claude Sonnet 4 | claude-sonnet-4-0 | claude-sonnet-4-20250514 |
| Claude Sonnet 3.7 | claude-3-7-sonnet-latest | claude-3-7-sonnet-20250219 |
| Claude Haiku 3.5 | claude-3-5-haiku-latest | claude-3-5-haiku-20241022 |

### Model comparison table

To help you choose the right model for your needs, we’ve compiled a table comparing the key features and capabilities of each model in the Claude family:

| Feature | Claude Sonnet 4.5 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4.1 | Claude Opus 4 | Claude Haiku 3.5 | Claude Haiku 3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Description** | Our best model for complex agents and coding | High-performance model | High-performance model with early extended thinking | Exceptional model for specialized complex tasks | Our previous flagship model | Our fastest model | Fast and compact model for near-instant responsiveness |
| **Strengths** | Highest intelligence across most tasks with exceptional agent and coding capabilities | High intelligence and balanced performance | High intelligence with toggleable extended thinking | Very high intelligence and capability for specialized tasks | Very high intelligence and capability | Intelligence at blazing speeds | Quick and accurate targeted performance |
| **Multilingual** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Vision** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **[Extended thinking](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)** | Yes | Yes | Yes | Yes | Yes | No | No |
| **[Priority Tier](https://docs.claude.com/en/api/service-tiers)** | Yes | Yes | Yes | Yes | Yes | Yes | No |
| **API model name** | claude-sonnet-4-5-20250929 | claude-sonnet-4-20250514 | claude-3-7-sonnet-20250219 | claude-opus-4-1-20250805 | claude-opus-4-20250514 | claude-3-5-haiku-20241022 | claude-3-haiku-20240307 |
| **Comparative latency** | Fast | Fast | Fast | Moderately Fast | Moderately Fast | Fastest | Fast |
| **Context window** | / 1M (beta)1 | / 1M (beta)1 |  |  |  |  |  |
| **Max output** |  |  |  |  |  |  |  |
| **Reliable knowledge cutoff** | Jan 2025 2 | Jan 2025 2 | Oct 2024 2 | Jan 2025 2 | Jan 2025 2 | 3 | 3 |
| **Training data cutoff** | Jul 2025 | Mar 2025 | Nov 2024 | Mar 2025 | Mar 2025 | Jul 2024 | Aug 2023 |

_1 - Claude Sonnet 4.5 and Claude Sonnet 4 support a [1M token context window](https://docs.claude.com/en/docs/build-with-claude/context-windows#1m-token-context-window) when using the `context-1m-2025-08-07` beta header. [Long context pricing](https://docs.claude.com/en/docs/about-claude/pricing#long-context-pricing) applies to requests exceeding 200K tokens._ _2 - **Reliable knowledge cutoff** indicates the date through which a model’s knowledge is most extensive and reliable. **Training data cutoff** is the broader date range of training data used. For example, Claude Sonnet 4.5 was trained on publicly available information through July 2025, but its knowledge is most extensive and reliable through January 2025. For more information, see [Anthropic’s Transparency Hub](https://www.anthropic.com/transparency)._ _3 - Haiku models have a single training data cutoff date._

### Model pricing

The table below shows the price per million tokens for each model:

| Model | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
| --- | --- | --- | --- | --- | --- |
| Claude Opus 4.1 | $15 / MTok | $18.75 / MTok | $30 / MTok | $1.50 / MTok | $75 / MTok |
| Claude Opus 4 | $15 / MTok | $18.75 / MTok | $30 / MTok | $1.50 / MTok | $75 / MTok |
| Claude Sonnet 4.5 | $3 / MTok | $3.75 / MTok | $6 / MTok | $0.30 / MTok | $15 / MTok |
| Claude Sonnet 4 | $3 / MTok | $3.75 / MTok | $6 / MTok | $0.30 / MTok | $15 / MTok |
| Claude Sonnet 3.7 | $3 / MTok | $3.75 / MTok | $6 / MTok | $0.30 / MTok | $15 / MTok |
| Claude Sonnet 3.5 ([deprecated](https://docs.claude.com/en/docs/about-claude/model-deprecations)) | $3 / MTok | $3.75 / MTok | $6 / MTok | $0.30 / MTok | $15 / MTok |
| Claude Haiku 3.5 | $0.80 / MTok | $1 / MTok | $1.6 / MTok | $0.08 / MTok | $4 / MTok |
| Claude Opus 3 ([deprecated](https://docs.claude.com/en/docs/about-claude/model-deprecations)) | $15 / MTok | $18.75 / MTok | $30 / MTok | $1.50 / MTok | $75 / MTok |
| Claude Haiku 3 | $0.25 / MTok | $0.30 / MTok | $0.50 / MTok | $0.03 / MTok | $1.25 / MTok |

Prompt and output performance
-----------------------------

Claude 4 models excel in:

*   **Performance**: Top-tier results in reasoning, coding, multilingual tasks, long-context handling, honesty, and image processing. See the [Claude 4 blog post](http://www.anthropic.com/news/claude-4) for more information.
*   **Engaging responses**: Claude models are ideal for applications that require rich, human-like interactions.
    *   If you prefer more concise responses, you can adjust your prompts to guide the model toward the desired output length. Refer to our [prompt engineering guides](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering) for details.
    *   For specific Claude 4 prompting best practices, see our [Claude 4 best practices guide](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices).

*   **Output quality**: When migrating from previous model generations to Claude 4, you may notice larger improvements in overall performance.

Migrating to Claude 4
---------------------

In most cases, you can switch from Claude 3.7 models to Claude 4 models with minimal changes:

1.   Update your model name:
    *   From: claude-3-7-sonnet-20250219
    *   To: claude-sonnet-4-5-20250929 or claude-opus-4-1-20250805

2.   Your existing API calls will continue to work without modification, although API behavior has changed slightly in Claude 4 models (see [API release notes](https://docs.claude.com/en/release-notes/api) for details).

For more details, see [Migrating to Claude 4](https://docs.claude.com/en/docs/about-claude/models/migrating-to-claude-4).

* * *

Get started with Claude
-----------------------

If you’re ready to start exploring what Claude can do for you, let’s dive in! Whether you’re a developer looking to integrate Claude into your applications or a user wanting to experience the power of AI firsthand, we’ve got you covered.

If you have any questions or need assistance, don’t hesitate to reach out to our [support team](https://support.claude.com/) or consult the [Discord community](https://www.anthropic.com/discord).
