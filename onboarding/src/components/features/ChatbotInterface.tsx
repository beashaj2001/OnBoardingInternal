
import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import { Send, ArrowDown, Loader } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timeStamp: Date;
}

const ChatbotInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I assist you today?',
      sender: 'bot',
      timeStamp: new Date(),
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const inNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!inNearBottom);
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timeStamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    fetch('http://0.0.0.0:8000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: inputValue }),
    })
      .then(res => res.json())
      .then(data => {
        const botResponse: Message = {
          id: Date.now().toString(),
          text: data.answer || 'No answer received.',
          sender: 'bot',
          timeStamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      })
      .catch(() => {
        const errorResponse: Message = {
          id: Date.now().toString(),
          text: "Oops! Something went wrong.",
          sender: 'bot',
          timeStamp: new Date(),
        };
        setMessages(prev => [...prev, errorResponse]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-[400px] flex flex-col">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`chat-bubble ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'} max-w-xs sm:max-w-sm md:max-w-md`}>
                <p>{message.text}</p>
                <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-teal-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {formatTime(message.timeStamp)}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-bubble chat-bubble-bot">
                <div className="flex items-center">
                  <div className="animate-pulse mr-1">
                    <Loader size={16} className="animate-spin" />
                  </div>
                  <span>Typing</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-4 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow-md"
          aria-label="Scroll to Bottom"
        >
          <ArrowDown size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <Button
            type="submit"
            className="rounded-l-none"
            icon={<Send size={16} />}
          >
            Send
          </Button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          This is AI assistant can answer questions about your training modules.
        </p>
      </div>
    </div>
  );
};

export default ChatbotInterface;
