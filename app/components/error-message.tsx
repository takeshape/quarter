import React from "react";

export function ErrorMessage({children}: {children: React.ReactNode}) {
  return <div className={`mx-auto px-4 max-w-2xl text-red-600`}>{children}</div>
}
