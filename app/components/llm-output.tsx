import { useLLMOutput } from "@llm-ui/react";
import React from "react";
import { MarkdownComponent } from "./llm/markdown-component.tsx";
import { markdownLookBack } from "@llm-ui/markdown";
import { codeBlockLookBack, findCompleteCodeBlock, findPartialCodeBlock } from "@llm-ui/code";
import { CodeBlock } from "./llm/code-block.tsx";
import { Product } from "./llm/product.tsx";

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
      {
        component: Product,
        findCompleteMatch: (str) => {
          console.log('1', str);
          const execResult = (/Product ID: \S+/gd).exec(str);
          console.log('1.1', execResult);
          if (execResult) {
            const firstResult = execResult.indices[0];
            
            return {
              startIndex: firstResult[0],
              endIndex: firstResult[1],
              outputRaw: execResult[0]
            }
          }
        },
        findPartialMatch: (str) => {
          console.log('2', str);
          return undefined;
          // return {
          //   startIndex: 0,
          //   endIndex: 1,
          //   outputRaw: 'hi'
          // }
        },
        lookBack: (args) => {
          console.log('3', args);
          const {output, isComplete, visibleTextLengthTarget, isStreamFinished} = args;
          return {
            output: output,
            visibleText: output
          }
        }
      }
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