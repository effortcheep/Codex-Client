import React, { useState, useRef, useEffect } from 'react';
import { 
  Button as HeroButton, ScrollShadow, Tooltip, Popover, PopoverTrigger, PopoverContent, Dropdown, Input, Chip
} from "@heroui/react";
import { HeroUIProvider } from "@heroui/system";
import { 
  Folder, Plus, Send, Bot, User, Settings, 
  MessageSquare, MoreVertical, Hash, ChevronRight, ChevronDown,
  LayoutGrid, Search, Sparkles, Cpu, ListFilter, PanelRight, PanelLeft,
  LogOut, CreditCard, Mail, FileCode, FileJson, FileText, Globe,
  Sun, Moon, Monitor, Zap, Puzzle, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Wrapper to bypass HeroUI 3.0.2 Button type issues with children in this environment
const Button = React.forwardRef((props: any, ref: any) => <HeroButton {...props} ref={ref} />);
Button.displayName = 'Button';
const PopoverRoot = (props: any) => <Popover {...props} />;
const PopoverTriggerWrapper = (props: any) => <PopoverTrigger {...props} />;
const PopoverContentWrapper = (props: any) => <PopoverContent {...props} />;
const DropdownRoot = (props: any) => <Dropdown {...props} />;
const DropdownTrigger = (props: any) => <Dropdown.Trigger {...props} />;
const DropdownMenu = (props: any) => <Dropdown.Menu {...props} />;
const DropdownItem = (props: any) => <Dropdown.Item {...props} />;

const initialProjects = [
  {
    id: 'p0',
    name: 'Getting Started',
    category: 'Default',
    isOpen: true,
    chats: [
      { id: 'c0', title: 'Welcome to Codex' },
    ]
  },
  {
    id: 'p1',
    name: 'E-commerce Platform',
    category: 'Web Apps',
    isOpen: true,
    chats: [
      { id: 'c1', title: 'Shopping Cart Logic' },
      { id: 'c2', title: 'Payment Gateway Integration' },
    ]
  },
  {
    id: 'p2',
    name: 'Internal Dashboard',
    category: 'Internal Tools',
    isOpen: true,
    chats: [
      { id: 'c3', title: 'User Analytics Chart' },
      { id: 'c4', title: 'Role-based Access Control' },
    ]
  }
];

const mockFiles = [
  { name: 'src', type: 'folder', children: [
    { name: 'App.tsx', type: 'file' },
    { name: 'index.css', type: 'file' },
  ]},
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
];

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [projects, setProjects] = useState(initialProjects);
  const [activeChatId, setActiveChatId] = useState('c1');
  const [chatInput, setChatInput] = useState('');
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('Codex-4-Turbo');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Codex AI assistant. How can I help you with your project today?' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (t: 'light' | 'dark') => {
      if (t === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { role: 'user', content: chatInput }]);
    setChatInput('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I understand. Here is a suggested solution for your request...' 
      }]);
    }, 1000);
  };

  const toggleProject = (projectId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, isOpen: !p.isOpen } : p
    ));
  };

  const activeChatTitle = projects.flatMap(p => p.chats).find(c => c.id === activeChatId)?.title || 'New Chat';

  return (
    <HeroUIProvider>
      <div className="flex h-screen bg-white dark:bg-[#0e0e0e] text-gray-700 dark:text-gray-300 font-sans overflow-hidden selection:bg-blue-500/30 transition-colors duration-300">
      
      {/* Left Sidebar - Project & Chat Management */}
      <AnimatePresence initial={false}>
        {leftSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex-shrink-0 bg-gray-50/50 dark:bg-[#111111] flex flex-col overflow-hidden border-r border-gray-200 dark:border-white/5"
          >
            {/* Sidebar Header - Static Menus */}
            <div className="p-3 flex flex-col gap-0.5 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group">
                <Search size={16} className="group-hover:text-blue-500 transition-colors" />
                <span className="text-sm font-medium">Search</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group">
                <Sparkles size={16} className="group-hover:text-purple-500 transition-colors" />
                <span className="text-sm font-medium">Skills</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group">
                <Cpu size={16} className="group-hover:text-green-500 transition-colors" />
                <span className="text-sm font-medium">Automation</span>
              </div>
            </div>

            {/* Projects Section Header */}
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Projects</span>
              <div className="flex items-center gap-0.5">
                <Button isIconOnly size="sm" variant="ghost" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white min-w-0 w-7 h-7 rounded-md">
                  <ListFilter size={14} />
                </Button>
                <Button isIconOnly size="sm" variant="ghost" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white min-w-0 w-7 h-7 rounded-md">
                  <Plus size={14} />
                </Button>
              </div>
            </div>

            {/* Sidebar Content - Categorized Projects */}
            <ScrollShadow className="flex-1 px-1.5 pb-2">
              <div className="flex flex-col gap-4">
                {['Default', 'Web Apps', 'Internal Tools'].map(cat => (
                  <div key={cat} className="flex flex-col gap-0.5">
                    <div className="px-2.5 py-1 text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-0.5">
                      {cat}
                    </div>
                    {projects.filter(p => p.category === cat).map(project => (
                      <div key={project.id} className="flex flex-col gap-0.5">
                        <div 
                          className="flex items-center justify-between px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer group transition-colors"
                          onClick={() => toggleProject(project.id)}
                        >
                          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                            {project.isOpen ? <ChevronDown size={12} className="text-gray-400 dark:text-gray-500" /> : <ChevronRight size={12} className="text-gray-400 dark:text-gray-500" />}
                            <Folder size={14} className="text-blue-500/70 dark:text-blue-400/80 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                            <span className="truncate">{project.name}</span>
                          </div>
                        </div>

                        {project.isOpen && (
                          <div className="flex flex-col gap-0.5 pl-6 pr-1.5">
                            {project.chats.map(chat => {
                              const isActive = activeChatId === chat.id;
                              return (
                                <div 
                                  key={chat.id}
                                  onClick={() => setActiveChatId(chat.id)}
                                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-[13px] transition-all duration-200 ${
                                    isActive 
                                      ? 'bg-gray-200/50 dark:bg-blue-500/10 text-gray-900 dark:text-blue-400 font-semibold' 
                                      : 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-300'
                                  }`}
                                >
                                  <MessageSquare size={12} className={isActive ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"} />
                                  <span className="truncate">{chat.title}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollShadow>

            {/* User Settings Area with Popover */}
            <div className="p-3 border-t border-gray-100 dark:border-white/5">
              <PopoverRoot placement="top-start">
                <PopoverTrigger>
                  <div className="flex items-center gap-2.5 px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-all active:scale-[0.98] group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-purple-500/10 group-hover:shadow-purple-500/20 transition-all">
                      U
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">User Account</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate font-medium">effortcheep@gmail.com</div>
                    </div>
                    <Settings size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 p-2 rounded-2xl shadow-2xl min-w-[240px]">
                  <div className="flex flex-col gap-1">
                    {/* Group 1: Email */}
                    <div className="px-3 py-2 flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-default">
                      <Mail size={16} />
                      <span className="text-sm truncate font-medium">effortcheep@gmail.com</span>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2" />
                    
                    {/* Group 2: Settings & Theme */}
                    <div className="px-3 py-2 flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                      <Settings size={16} />
                      <span className="text-sm font-medium">Account Settings</span>
                    </div>
                    
                    {/* Theme Switcher */}
                    <div className="px-1 py-1 bg-gray-100 dark:bg-white/5 rounded-xl flex gap-1 mt-1">
                      {[
                        { id: 'light', icon: Sun, label: 'Light' },
                        { id: 'dark', icon: Moon, label: 'Dark' },
                        { id: 'system', icon: Monitor, label: 'System' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id as any)}
                          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            theme === t.id 
                              ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white shadow-sm' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                          }`}
                        >
                          <t.icon size={14} />
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2" />

                    {/* Group 3: Credits & Logout */}
                    <div className="px-3 py-2 flex items-center justify-between text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-default">
                      <div className="flex items-center gap-3">
                        <CreditCard size={16} />
                        <span className="text-sm font-medium">Credits</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">1,240</span>
                    </div>
                    <div className="px-3 py-2 flex items-center gap-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-xl transition-colors cursor-pointer">
                      <LogOut size={16} />
                      <span className="text-sm font-bold">Logout</span>
                    </div>
                  </div>
                </PopoverContent>
              </PopoverRoot>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
        {/* Chat Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#0e0e0e] z-10">
          <div className="flex items-center gap-2">
            <Button 
              isIconOnly 
              variant="ghost" 
              size="sm" 
              className={`text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white min-w-0 w-8 h-8 rounded-lg transition-all flex items-center justify-center ${leftSidebarOpen ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : ''}`}
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            >
              <PanelLeft size={16} />
            </Button>
            <div className="flex items-center gap-2 ml-1">
              <Hash size={16} className="text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100 tracking-tight">{activeChatTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button 
              isIconOnly 
              variant="ghost" 
              size="sm" 
              className={`text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white min-w-0 w-8 h-8 rounded-lg transition-all flex items-center justify-center ${rightPanelOpen ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : ''}`}
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
            >
              <PanelRight size={16} />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollShadow className="flex-1 p-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-4 pb-2">
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div key={idx} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[90%] flex flex-col ${isAssistant ? 'items-start w-full' : 'items-end'}`}>
                    <div className={`text-[14px] leading-relaxed whitespace-pre-wrap px-3 py-2 rounded-xl transition-colors duration-200 ${
                      isAssistant 
                        ? 'bg-transparent text-gray-800 dark:text-gray-200 w-full text-left' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/5 shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollShadow>

        {/* Input Area */}
        <div className="p-3 pt-0">
          <div className="max-w-3xl mx-auto flex flex-col gap-2">
            <div className="relative bg-gray-50 dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-white/10 flex flex-col shadow-sm transition-all focus-within:border-blue-500/30">
              <textarea 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Message Codex..."
                className="w-full bg-transparent text-[14px] text-gray-800 dark:text-gray-200 p-3 outline-none resize-none min-h-[80px] max-h-[200px]"
              />
              <div className="flex items-center justify-between p-2 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-1.5">
                  <Tooltip content="Attach File" placement="top" showArrow closeDelay={0}>
                    <Button isIconOnly size="sm" variant="ghost" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white border-none h-7 w-7 min-w-0 rounded-md">
                      <Plus size={16} />
                    </Button>
                  </Tooltip>

                  <div className="h-3 w-[1px] bg-gray-200 dark:bg-white/10 mx-0.5" />

                  {/* Model Selection via Popover in Input Area */}
                  <div className="flex items-center gap-1">
                    <PopoverRoot placement="top-start">
                      <PopoverTriggerWrapper>
                        <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                          <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
                          <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-300">{selectedModel}</span>
                          <ChevronDown size={10} className="text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </PopoverTriggerWrapper>
                      <PopoverContentWrapper className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 p-1 rounded-xl shadow-2xl min-w-[160px]">
                        <div className="flex flex-col gap-0.5">
                          {[
                            { id: 'Codex-4-Turbo', label: 'Codex-4-Turbo' },
                            { id: 'Codex-3.5-Sonnet', label: 'Codex-3.5-Sonnet' },
                            { id: 'Gemini-1.5-Pro', label: 'Gemini-1.5-Pro' }
                          ].map((model) => (
                            <div 
                              key={model.id}
                              onClick={() => setSelectedModel(model.id)}
                              className="px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg flex items-center justify-between group cursor-pointer"
                            >
                              <span className="font-medium">{model.label}</span>
                              {selectedModel === model.id && <div className="w-1 h-1 rounded-full bg-blue-500" />}
                            </div>
                          ))}
                        </div>
                      </PopoverContentWrapper>
                    </PopoverRoot>

                    <div className="h-3 w-[1px] bg-gray-200 dark:bg-white/10 mx-0.5" />
                    
                    {/* Stats Indicators */}
                    <div className="flex items-center gap-0.5 ml-0.5">
                      {/* Skills */}
                      <PopoverRoot placement="top" showArrow>
                        <PopoverTriggerWrapper>
                          <Button variant="light" className="h-auto min-w-0 p-1 flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-white/5 rounded-md transition-colors group cursor-pointer">
                            <Zap size={12} className="text-amber-500" />
                            <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-300">12</span>
                          </Button>
                        </PopoverTriggerWrapper>
                        <PopoverContentWrapper className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 p-0 rounded-xl shadow-2xl">
                          <div className="p-2.5 min-w-[200px]">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Skills</span>
                                <span className="text-[9px] font-bold text-amber-500">12/20</span>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <div className="flex flex-col gap-0.5">
                                    {[
                                      { name: 'Web Search', scope: 'GLB' },
                                      { name: 'Python', scope: 'GLB' },
                                      { name: 'File Search', scope: 'PRJ' }
                                    ].map(skill => (
                                      <div key={skill.name} className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-300 px-1">
                                        <div className="flex items-center gap-1.5">
                                          <div className="w-1 h-1 rounded-full bg-amber-500" />
                                          {skill.name}
                                        </div>
                                        <span className="text-[8px] font-bold text-gray-400">{skill.scope}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </PopoverContentWrapper>
                      </PopoverRoot>

                      {/* MCP */}
                      <PopoverRoot placement="top" showArrow>
                        <PopoverTriggerWrapper>
                          <Button variant="light" className="h-auto min-w-0 p-1 flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-white/5 rounded-md transition-colors group cursor-pointer">
                            <Puzzle size={12} className="text-purple-500" />
                            <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-300">5</span>
                          </Button>
                        </PopoverTriggerWrapper>
                        <PopoverContentWrapper className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 p-0 rounded-xl shadow-2xl">
                          <div className="p-2.5 min-w-[200px]">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">MCP</span>
                                <span className="text-[9px] font-bold text-purple-500">5 Active</span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                {[
                                  { name: 'GitHub', scope: 'GLB' },
                                  { name: 'PostgreSQL', scope: 'PRJ' }
                                ].map(mcp => (
                                  <div key={mcp.name} className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-300 px-1">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-1 h-1 rounded-full bg-purple-500" />
                                      {mcp.name}
                                    </div>
                                    <span className="text-[8px] font-bold text-gray-400">{mcp.scope}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </PopoverContentWrapper>
                      </PopoverRoot>

                      {/* Usage */}
                      <PopoverRoot placement="top" showArrow>
                        <PopoverTriggerWrapper>
                          <Button variant="light" className="h-auto min-w-0 p-1 flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-white/5 rounded-md transition-colors group cursor-pointer">
                            <Activity size={12} className="text-emerald-500" />
                            <div className="w-8 h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[65%]" />
                            </div>
                          </Button>
                        </PopoverTriggerWrapper>
                        <PopoverContentWrapper className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 p-0 rounded-xl shadow-2xl">
                          <div className="p-2.5 min-w-[200px]">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Usage</span>
                                <span className="text-[9px] font-bold text-emerald-500">65%</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[65%]" />
                              </div>
                              <div className="flex justify-between text-[9px] text-gray-500">
                                <span>6.5k tokens</span>
                                <span>10k limit</span>
                              </div>
                            </div>
                          </div>
                        </PopoverContentWrapper>
                      </PopoverRoot>
                    </div>
                  </div>
                </div>
                <Button 
                  isIconOnly 
                  size="sm" 
                  className="h-7 w-7 min-w-0 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95 shadow-sm flex items-center justify-center"
                  onClick={handleSendMessage}
                >
                  <Send size={14} />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-end px-1">
              <div className="text-[9px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest">
                Codex AI v2.4
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel - File Directory */}
      <AnimatePresence>
        {rightPanelOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex-shrink-0 bg-gray-50/50 dark:bg-[#111111] overflow-hidden flex flex-col border-l border-gray-200 dark:border-white/5 transition-colors duration-300"
          >
            <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100 dark:border-white/5">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Files</span>
              <Button isIconOnly size="sm" variant="ghost" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white min-w-0 w-8 h-8 rounded-lg" onClick={() => setRightPanelOpen(false)}>
                <ChevronRight size={16} />
              </Button>
            </div>
            <ScrollShadow className="flex-1 p-2">
              <div className="flex flex-col gap-0.5">
                {mockFiles.map((file, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer group transition-colors">
                      {file.type === 'folder' ? <Folder size={14} className="text-blue-500/70 dark:text-blue-400/80" /> : <FileCode size={14} className="text-gray-400 dark:text-gray-500" />}
                      <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{file.name}</span>
                    </div>
                    {file.children && (
                      <div className="pl-5 flex flex-col gap-0.5 mt-0.5">
                        {file.children.map((child, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer group transition-colors">
                            <FileCode size={12} className="text-gray-400 dark:text-gray-500" />
                            <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">{child.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollShadow>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </HeroUIProvider>
  );
}
