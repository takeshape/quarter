import React from "react";

export function ChatBubble({text}: {text: string}) {
  return <div className="my-8 text-right">
    <div className="bg-message-bg p-3 rounded-xl text-white inline-block">
      {text}
    </div>
  </div>
}
