import React from "react";

export function ChatBubble({text}: {text: string}) {
  return <div className="my-8 text-right">
    <span className="bg-chat-bg p-3 rounded-xl">
      {text}
    </span>
  </div>
}
