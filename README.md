# TokenTally: All-in-One AI Cost Calculator

[TokenTally](https://tokentalley.griffen.codes/) is an open source web application designed to empower developers, researchers, and businesses to estimate and compare costs across various AI and Large Language Model (LLM) APIs. In today’s rapidly evolving AI landscape, TokenTally provides a real-time, user-friendly interface to help you make informed decisions when integrating services like [OpenAI](https://www.openai.com/), [Claude](https://www.anthropic.com/), [Gemini](https://www.google.com/), [DALL-E](https://www.openai.com/dall-e-2), [Whisper](https://www.openai.com/research/whisper), [Cohere](https://cohere.ai/), and [Perplexity.ai](https://www.perplexity.ai/) into your projects.

## Features

- **Multiple Model Support:** Calculate costs for models such as [OpenAI](https://www.openai.com/), [Claude](https://www.anthropic.com/), [Gemini](https://www.google.com/), [DALL-E](https://www.openai.com/dall-e-2), [Whisper](https://www.openai.com/research/whisper), [Cohere](https://cohere.ai/), and [Perplexity.ai](https://www.perplexity.ai/).
- **Interactive Calculators:** Easily input token counts and view detailed cost breakdowns.
- **Comprehensive Pricing Tables:** Always up-to-date pricing details across supported AI models.
- **Visual Comparisons:** Charts and graphs to compare costs across different services.
- **Quick Calculations:** Utilize the command palette (Cmd+K) for rapid cost estimates.
- **Responsive Design:** Enjoy a fully responsive layout that works seamlessly on both desktop and mobile devices.
- **Dark Mode Support:** Toggle between light and dark themes for a comfortable user experience.
- **Dynamic OG Images:** Automatically generated Open Graph images enhance social media sharing.
- **Toast Notifications:** User-friendly notifications via Sonner for improved interactivity.

## Project Structure Overview

TokenTally follows a modern Next.js 15+ architecture using the App Router. Below is an breakdown of the project’s structure along with the most significant files:

```
/app                  - Main application directory with pages and layout components (e.g., /app/page.tsx for the landing page)
/components           - Reusable React components (Calculators, Toast Notifications, Charts, etc.)
/styles               - Global and component-specific styles
/public               - Static assets including images, icons, and dynamic OG images
/utils                - Utility functions for API integrations and cost calculations
/data                 - JSON files containing current pricing and model configurations
/package.json         - Manages project dependencies and scripts (see updated snippet below)
/next.config.js       - Next.js configuration file
```

---

## Installation & Usage

Follow these steps to set up and run TokenTally locally:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/TokenTally.git
   cd TokenTally
   ```

2. **Install Dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

3. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

   Open your browser and navigate to `http://localhost:3000`.

4. **Build for Production:**

   ```bash
   npm run build
   npm start
   ```

   or

   ```bash
   yarn build
   yarn start
   ```

---

## Contributing

TokenTally is an open source project and welcomes contributions from the community. To contribute:

1. **Fork the Repository**
2. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to Your Branch:**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request** for review.

Please ensure your contributions adhere to our coding standards and include relevant tests.

---

## Acknowledgements

TokenTally is powered by a collection of outstanding services and libraries:

- **Vercel** – Hosting and deployment platform.
- **v0** – Innovative technology and UI generation.
- **Next.js** – The React framework for building modern web applications.
- **RepoBeats** – Provides insightful project analytics.
- **ShadCN UI** – A set of modern UI components for rapid development.

## Project Stats

![Alt](https://repobeats.axiom.co/api/embed/55e9dbc9f7b635cb5756c35298d29da533cdc031.svg "Repobeats analytics image")

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
