import { Button, CircularProgress, Navbar } from "@nextui-org/react";
import {Input} from "@nextui-org/input";
import React from "react";
import { Form, json, useActionData } from "@remix-run/react";
import { ActionFunction } from "@remix-run/node";
import { LLMOutput } from "../components/llm-output.tsx";
import { ChatBubble } from "../components/chat-bubble.tsx";

const query = `
query ($input:String!, $sessionId: String) {
  chat(input:$input, sessionId: $sessionId) {
    content
    sessionId
  }
}
`;

type LoaderResponse = {
  success: boolean;
  output?: {
    chat: {
      content: string;
      sessionId: string;
    }
  } | null;
  isStreamFinished?: boolean;
  error?: string;
}

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData();

  const takeshapeDomain = process.env.TAKESHAPE_DOMAIN;
  if (!takeshapeDomain) {
    throw new Error('TAKESHAPE_DOMAIN must be set');
  }

  const projectId = process.env.TAKESHAPE_PROJECT_ID;
  if (!projectId) {
    throw new Error('TAKESHAPE_PROJECT_ID must be set');
  }

  const apiKey = process.env.TAKESHAPE_API_KEY;
  if (!apiKey) {
    throw new Error('TAKESHAPE_API_KEY must be set');
  }

  const message = formData.get('message');
  const sessionId = formData.get('sessionId');

  if (message === null) {
    return json({
      success: true,
      output: null,
      isStreamFinished: true
    })
  }

  const response = await fetch(`https://${takeshapeDomain}/project/${projectId}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      query,
      variables: {
        input: message,
        sessionId: sessionId === '' ? undefined : sessionId
      }
    })
  });

  if (response.status !== 200) {
    console.error(response);
    return json({success: false, error: `HTTP Status Code ${response.status}`});
  }

  const responseJson = await response.json();

  if (responseJson.errors?.length > 0) {
    console.error(response);
    return json({success: false, error: responseJson.errors[0].message});
  }

  const result = { success: true, output: responseJson.data, isStreamFinished: true };

  return json(result);
};

export default function Demo() {
  const data = useActionData<LoaderResponse>();

  console.log('### data', data);

  const sessionId = data?.output?.chat?.sessionId ?? '';
  const output = data?.output?.chat?.content ?? '';
  const isStreamFinished = data?.isStreamFinished;
  
  const [inputText, setInputText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  const scrolledToBottomRef = React.useRef(true);

  const handleScroll = React.useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollTop + windowHeight >= documentHeight) {
      scrolledToBottomRef.current = true;
    } else {
      scrolledToBottomRef.current = false;
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  React.useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    handleScroll();
    if (scrolledToBottomRef.current) {
      window.setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 0);
    }
  }, [data]);

  React.useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [history]);

  const inputRef = React.useRef(null);

  const submitChat = React.useCallback(() => {
    setLoading(true);
    const newHistory = [...history];
    console.log('### output', data, output);
    if (output) {
      newHistory.push({
        type: 'llm',
        value: output,
        isStreamFinished
      });
    }
    newHistory.push({
      type: 'user',
      value: inputText
    });
    setInputText('');
    setHistory(newHistory);
  }, [inputText]);

  const changeMessage = React.useCallback((e) => {
    setInputText(e.target.value);
  }, []);

  if (data?.success === false) {
    return <div className={`mx-auto px-4 max-w-2xl text-red-600`}>{data.error}</div>
  }

  return (
    <>
      <div className={`mx-auto px-4 max-w-2xl mb-32`}>
        {history.map((item, index) => 
          <div key={`item-${index}`}>
            {item.type === 'user' && <ChatBubble text={item.value}/>}
            {item.type === 'llm' && <LLMOutput llmOutput={item.value} isStreamFinished={item.isStreamFinished}/>}
          </div>
        )}
        {!loading && <LLMOutput llmOutput={output} isStreamFinished={isStreamFinished}/>}
        {loading && <div className="flex justify-center mt-8"><CircularProgress/></div>}
      </div>
      <Navbar className={`bg-chat-bg fixed bottom-0 top-auto item h-32`} isBlurred={false}>
        <Form method="post" className="w-full" onSubmit={submitChat}>
          <input type="hidden" name="sessionId" value={sessionId} />
          <Input
            name="message"
            size="lg"
            fullWidth
            placeholder="Message"
            value={inputText}
            onChange={changeMessage}
            classNames={{
              inputWrapper: "pr-0"
            }}
            disabled={loading}
            ref={inputRef}
            endContent={
              <Button
                isIconOnly
                type="submit"
                variant="light"
                disabled={loading}
                aria-label="Input"
              >
                <svg className="fill-transparent stroke-neutral-600 dark:stroke-neutral-300 w-6" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            }
          />
        </Form>
      </Navbar>
    </>
  );
}
