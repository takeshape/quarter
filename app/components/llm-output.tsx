import { useLLMOutput } from "@llm-ui/react";
import React from "react";
import { MarkdownComponent } from "./llm/markdown-component.tsx";
import { markdownLookBack } from "@llm-ui/markdown";
import { codeBlockLookBack, findCompleteCodeBlock, findPartialCodeBlock } from "@llm-ui/code";
import { CodeBlock } from "./llm/code-block.tsx";

export function LLMOutput({llmOutput, isStreamFinished}: {llmOutput: string, isStreamFinished: boolean}) {

  const { blockMatches } = useLLMOutput({
    llmOutput,
    fallbackBlock: {
      component: MarkdownComponent,
      lookBack: markdownLookBack(),
    },
    blocks: [
      {
        component: CodeBlock,
        findCompleteMatch: findCompleteCodeBlock(),
        findPartialMatch: findPartialCodeBlock(),
        lookBack: codeBlockLookBack(),
      },
    ],
    isStreamFinished,
  });
  
  return <div className="markdown-body !bg-transparent">
    {blockMatches.map((blockMatch, index) => {
      const Component = blockMatch.block.component;
      return <Component key={index} blockMatch={blockMatch} />;
    })}
  </div>;
}