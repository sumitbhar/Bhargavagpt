
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage, CognitiveState, GroundingChunk } from '../types';
import CodeBlock from './CodeBlock';
import AnalysisPopover from './AnalysisPopover';

interface MessageProps {
  message: ChatMessage;
  t: (key: string, params?: Record<string, string>) => string;
  onAnalyze: (messageId: string, lens: CognitiveState) => void;
  isAnalyzing: boolean;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
        U
    </div>
);

const AiIcon = ({ isAnalysis }: { isAnalysis?: boolean }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAnalysis ? 'bg-purple-800/80' : 'bg-gray-700/80'}`}>
        {isAnalysis ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
             </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM5.404 4.343a.75.75 0 010 1.06l-2.12 2.122a.75.75 0 11-1.06-1.061l2.12-2.121a.75.75 0 011.06 0zm9.192 0a.75.75 0 011.06 0l2.122 2.121a.75.75 0 11-1.061 1.06l-2.121-2.12a.75.75 0 010-1.06zM10 15a5 5 0 100-10 5 5 0 000 10zm0 1.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM10 18a.75.75 0 01.75-.75v-3.5a.75.75 0 01-1.5 0v3.5a.75.75 0 01.75.75z" clipRule="evenodd" />
            </svg>
        )}
    </div>
);

const GenericFileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const Sources: React.FC<{ chunks: GroundingChunk[]; t: (key: string, params?: Record<string, string>) => string; }> = ({ chunks, t }) => {
    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    return (
        <div className="mt-3 pt-3 border-t border-gray-600/50">
            <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                {t('sources')}
            </h4>
            <ol className="list-decimal list-inside space-y-1.5">
                {chunks.map((chunk, index) => (
                    <li key={index} className="text-sm">
                        <a 
                            href={chunk.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-orange-400 hover:underline break-words"
                            title={chunk.title}
                        >
                            {chunk.title}
                        </a>
                        <span className="text-xs text-gray-500 ml-1">({t('source_from', {domain: getDomain(chunk.uri)})})</span>
                    </li>
                ))}
            </ol>
        </div>
    );
};


const Message: React.FC<MessageProps> = ({ message, t, onAnalyze, isAnalyzing }) => {
  const isUser = message.sender === 'user';
  const [isAnalysisPopoverOpen, setIsAnalysisPopoverOpen] = useState(false);

  const messageClasses = isUser
    ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white'
    : message.isAnalysis
    ? 'bg-gray-800/60 backdrop-blur-sm border border-purple-700/50 text-gray-200 self-start'
    : 'bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-200 self-start';
  
  const containerClasses = isUser ? 'flex-row-reverse' : 'flex-row';
  
  const linkClass = isUser ? "underline" : "text-orange-400 underline hover:text-orange-300";

  const handleScrollToOriginal = () => {
    if (message.analysisForId) {
      document.getElementById(`message-${message.analysisForId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div id={`message-${message.id}`} className={`flex items-start gap-3 my-4 animate-fade-in-up ${containerClasses}`}>
       {isUser ? <UserIcon /> : <AiIcon isAnalysis={message.isAnalysis} />}
      <div className={`w-full max-w-xl lg:max-w-2xl`}>
        <div className={`px-4 py-3 rounded-xl shadow-md ${messageClasses}`}>
          {message.isAnalysis && message.analysisForId && (
            <div className="border-b border-purple-600/50 pb-2 mb-2">
                <h4 className="font-bold text-sm text-purple-300">{t('analysisFor')}</h4>
                <button onClick={handleScrollToOriginal} className="text-xs text-orange-400 hover:underline">
                    {t('scrollToOriginal')}
                </button>
            </div>
          )}
          {message.attachment && (
            <div className="mb-2 last:mb-0">
              {message.attachment.mimeType.startsWith('image/') ? (
                <img 
                  src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} 
                  alt={message.attachment.name} 
                  className="rounded-lg max-w-xs max-h-64 object-contain border border-gray-600/50" 
                />
              ) : (
                <div className="flex items-center gap-2.5 p-2.5 bg-black/20 rounded-lg border border-white/20">
                  <GenericFileIcon />
                  <span className="truncate text-sm font-medium">{message.attachment.name}</span>
                </div>
              )}
            </div>
          )}
          {message.text && (
              <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                      p: ({node, ...props}) => <p className="whitespace-pre-wrap mb-2 last:mb-0" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
                      a: ({node, ...props}) => <a className={linkClass} target="_blank" rel="noopener noreferrer" {...props} />,
                      code: (props) => <CodeBlock {...props} t={t} />,
                  }}
              >
                  {message.text}
              </ReactMarkdown>
          )}
          {message.groundingChunks && message.groundingChunks.length > 0 && (
            <Sources chunks={message.groundingChunks} t={t} />
          )}
        </div>

        {!isUser && !message.isAnalysis && (
            <div className="relative mt-2 flex justify-start">
                <button
                    onClick={() => setIsAnalysisPopoverOpen(true)}
                    disabled={isAnalyzing}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 bg-gray-800/70 rounded-md hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                    {isAnalyzing ? (
                        <>
                            <div className="w-3 h-3 border-2 border-t-transparent border-orange-400 rounded-full animate-spin"></div>
                            {t('thinking')}...
                        </>
                    ) : (
                        <>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                           </svg>
                            {t('analyzeResponse')}
                        </>
                    )}
                </button>
                {isAnalysisPopoverOpen && (
                    <AnalysisPopover
                        onSelect={(lens) => {
                            onAnalyze(message.id, lens);
                            setIsAnalysisPopoverOpen(false);
                        }}
                        onClose={() => setIsAnalysisPopoverOpen(false)}
                        t={t}
                    />
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Message);