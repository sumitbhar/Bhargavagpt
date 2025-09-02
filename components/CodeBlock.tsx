
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy code: ', err);
    });
  };

  if (inline) {
    return (
      <code className="bg-gray-800/60 text-orange-300 rounded px-1.5 py-1 font-mono text-sm">
        {children}
      </code>
    );
  }

  if (match) {
      return (
        <div className="relative my-2 rounded-lg bg-[#1e1e1e] font-mono text-sm">
          <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900/70 rounded-t-lg border-b border-gray-700">
            <span className="text-xs font-semibold text-gray-400">{match[1]}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              disabled={isCopied}
              aria-label="Copy code"
            >
              {isCopied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy code
                </>
              )}
            </button>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.875rem' }}
            codeTagProps={{ style: { fontFamily: 'inherit' } }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      )
  }

  // Fallback for code blocks without a language
  return (
    <pre className="bg-gray-800/60 p-3 my-2 rounded-lg overflow-x-auto">
        <code className="text-white font-mono text-sm">{children}</code>
    </pre>
  );
};

export default CodeBlock;