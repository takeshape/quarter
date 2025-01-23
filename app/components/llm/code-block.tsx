import {
  loadHighlighter,
  useCodeBlockToHtml,
  allLangs,
  allLangsAlias,
} from "@llm-ui/code";
// WARNING: Importing bundledThemes increases your bundle size
// see: https://llm-ui.com/docs/blocks/code#bundle-size
import { bundledThemes } from "shiki/themes";
import { type LLMOutputComponent } from "@llm-ui/react";
import ReactHtmlParser from "html-react-parser";
import { getHighlighterCore } from "shiki/core";
import { bundledLanguagesInfo } from "shiki/langs";

import getWasm from "shiki/wasm";
import { Code } from "@heroui/react";
import { useTheme } from "../../utils/theme-provider.jsx";

const highlighter = loadHighlighter(
  getHighlighterCore({
    langs: allLangs(bundledLanguagesInfo),
    langAlias: allLangsAlias(bundledLanguagesInfo),
    themes: Object.values(bundledThemes),
    loadWasm: getWasm,
  }),
);

export const CodeBlock: LLMOutputComponent = ({ blockMatch }) => {
  const [theme] = useTheme();
  const { html, code } = useCodeBlockToHtml({
    markdownCodeBlock: blockMatch.output,
    highlighter,
    codeToHtmlOptions: {
      theme: theme === 'dark' ? 'github-dark' : 'github-light'
    }
  });

  if (!html) {
    // fallback to <pre> if Shiki is not loaded yet
    return (
      <pre className="shiki">
        <Code>{code}</Code>
      </pre>
    );
  }
  return <Code className="my-4 p-2 w-full" style={{backgroundColor: theme === 'dark' ? "rgb(36, 41, 46)" : "rgb(255, 255, 255)"}}>{ReactHtmlParser(html)}</Code>;
};
