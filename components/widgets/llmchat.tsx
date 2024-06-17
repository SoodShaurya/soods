// components/ChatComponent.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface ChatComponentProps {
  apiKey: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<{ user: string; assistant: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/claude', { prompt: input }, {
        headers: {
          'X-API-Key': apiKey,
        },
      });
      const assistantResponse = response.data.result;

      setMessages([...messages, { user: input, assistant: assistantResponse }]);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex h-[500px] w-full flex-col">
      {/* Prompt Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col">
            <div className="mb-2 flex flex-row px-2 py-4 sm:px-4">
              <div className="flex max-w-3xl items-center">
                <p>{message.user}</p>
              </div>
            </div>
            <div className="mb-4 flex rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4">
              <div className="flex max-w-3xl items-center rounded-xl">
                <p>{message.assistant}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Prompt message input */}
      <form onSubmit={handleSubmit} className="mt-2">
        <label htmlFor="chat-input" className="sr-only">
          Enter your prompt
        </label>
        <div className="relative">
          <textarea
            id="chat-input"
            className="block w-full resize-none rounded-xl border-none bg-slate-200 p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base"
            placeholder="Enter your prompt"
            rows={1}
            value={input}
            onChange={handleInputChange}
            required
          ></textarea>
          <button
            type="submit"
            className="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base"
          >
            Send <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;