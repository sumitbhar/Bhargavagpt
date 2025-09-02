import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../types';
import CodeBlock from './CodeBlock';

interface MessageProps {
  message: ChatMessage;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
        U
    </div>
);

const AiIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gray-700/80 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM5.404 4.343a.75.75 0 010 1.06l-2.12 2.122a.75.75 0 11-1.06-1.061l2.12-2.121a.75.75 0 011.06 0zm9.192 0a.75.75 0 011.06 0l2.122 2.121a.75.75 0 11-1.061 1.06l-2.121-2.12a.75.75 0 010-1.06zM10 15a5 5 0 100-10 5 5 0 000 10zm0 1.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM10 18a.75.75 0 01.75-.75v-3.5a.75.75 0 01-1.5 0v3.5a.75.75 0 01.75.75z" clipRule="evenodd" />
        </svg>
    </div>
);


const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const messageClasses = isUser
    ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white self-end'
    : 'bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-200 self-start';
  
  const containerClasses = isUser ? 'flex-row-reverse' : 'flex-row';
  
  const linkClass = isUser ? "underline" : "text-orange-400 underline hover:text-orange-300";

  return (
    <div className={`flex items-start gap-3 my-4 animate-fade-in-up ${containerClasses}`}>
       {isUser ? <UserIcon /> : <AiIcon />}
      <div
        className={`max-w-xl lg:max-w-2xl px-4 py-3 rounded-xl shadow-md ${messageClasses}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
              p: ({node, ...props}) => <p className="whitespace-pre-wrap mb-2 last:mb-0" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
              a: ({node, ...props}) => <a className={linkClass} target="_blank" rel="noopener noreferrer" {...props} />,
              code: CodeBlock,
          }}
        >
            {message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;