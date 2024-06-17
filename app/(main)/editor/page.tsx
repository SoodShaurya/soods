"use client";
import Editor from "@/components/editor/advanced-editor";
import { JSONContent } from "novel";
import { useState } from "react";
import { defaultValue } from "./default-value";

export default function EditorPage() {
  const [value, setValue] = useState<JSONContent>(defaultValue);
  console.log(value);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col p-6 border max-w-xl w-full gap-6 rounded-md bg-card">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold"> Novel Example</h1>
        </div>
        <Editor initialValue={value} onChange={setValue} />
      </div>
    </main>
  );
}