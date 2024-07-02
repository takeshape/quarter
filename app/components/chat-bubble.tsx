import React from "react";

export function ChatBubble({text}: {text: string}) {
  return <div className="my-8 text-right">
    <span className="bg-message-bg p-3 rounded-xl text-white">
      {text}
    </span>
  </div>
}
