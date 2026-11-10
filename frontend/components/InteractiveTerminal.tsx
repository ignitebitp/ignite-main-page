import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, Copy, Check } from 'lucide-react';

interface HistoryItem {
  type: 'input' | 'output' | 'system' | 'success' | 'error' | 'flag';
  text: string;
}

const InteractiveTerminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'system', text: 'IGNITE Core OS v2.4.0 (x86_64-pc-linux-gnu)' },
    { type: 'system', text: 'Welcome to the BIT Mesra Technical Innovation Terminal.' },
    { type: 'system', text: 'Type "help" to view available terminal commands.' },
  ]);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isDecrypting]);

  const handleCopyFlag = (flagText: string) => {
    navigator.clipboard.writeText(flagText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || isDecrypting) return;

    const newHistory: HistoryItem[] = [...history, { type: 'input', text: `guest@ignite:~$ ${cmd}` }];
    setInput('');

    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      return;
    }

    if (lower === 'help') {
      newHistory.push({
        type: 'output',
        text: `Available commands:
  help            - List all available commands
  cat mission.txt - View the club mission and manifesto
  events          - List flagship events and hackathons
  members         - Display community stats & active roster
  whoami          - Inspect current session privilege level
  decrypt         - Attempt cryptographic bypass puzzle
  clear           - Clear terminal history buffer`,
      });
      setHistory(newHistory);
      return;
    }

    if (lower === 'cat mission.txt' || lower === 'cat challenge.txt') {
      newHistory.push({
        type: 'output',
        text: `[MISSION MANIFESTO]
Fostering innovation, collaboration, and technical excellence.
Demystifying engineering from kernel to cloud.
Less theory, more building. Break the boundary, not the rules.`,
      });
      setHistory(newHistory);
      return;
    }

    if (lower === 'events' || lower === 'ctf') {
      newHistory.push({
        type: 'output',
        text: `[FLAGSHIP STACK]
  1. Inginiux / Mega Events - Multi-track technical innovation hackathon
  2. CTF Practice & Drills  - Hands-on exploitation & security challenges
  3. Workshops & Bootcamps  - Web, AI, App, Hardware & IoT sessions
Navigate to /events in the navbar to explore schedules and registrations.`,
      });
      setHistory(newHistory);
      return;
    }

    if (lower === 'members') {
      newHistory.push({
        type: 'output',
        text: `[MEMBERSHIP TELEMETRY]
  Total Members:  200+
  Active Roster:  85+
  Events Hosted:  50+
  Status:         OPERATIONAL // BIT Mesra Technical Club`,
      });
      setHistory(newHistory);
      return;
    }

    if (lower === 'whoami') {
      newHistory.push({
        type: 'output',
        text: `uid=1000(guest) gid=1000(guest) groups=1000(guest),4(adm),27(sudo-pending)
Permission: Standard Interactive Shell. Run "decrypt" to escalate privileges.`,
      });
      setHistory(newHistory);
      return;
    }

    if (lower === 'decrypt') {
      setHistory(newHistory);
      setIsDecrypting(true);

      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      setTimeout(async () => {
        setHistory((prev) => [...prev, { type: 'system', text: '[*] Initializing quantum entropy seed...' }]);
        await delay(500);
        setHistory((prev) => [...prev, { type: 'system', text: '[*] Probing buffer offset: 0x7ffd9b8a34... OK' }]);
        await delay(600);
        setHistory((prev) => [...prev, { type: 'system', text: '[*] Defeating ASLR and canary protection... BYPASS' }]);
        await delay(650);
        setHistory((prev) => [...prev, { type: 'system', text: '[*] Decrypting payload stream with RSA-4096 key...' }]);
        await delay(750);
        setHistory((prev) => [
          ...prev,
          {
            type: 'flag',
            text: 'FLAG{1GN1T3_TH3_FUTURE_B1T_M3SR4}',
          },
          {
            type: 'success',
            text: '[+] Access Granted! You solved the interactive sandbox challenge.',
          },
        ]);
        setIsDecrypting(false);
      }, 300);

      return;
    }

    newHistory.push({
      type: 'error',
      text: `ignite: command not found: ${cmd}. Type "help" for a list of valid commands.`,
    });
    setHistory(newHistory);
  };

  return (
    <div className="w-full rounded-2xl glass-card overflow-hidden shadow-2xl border-t-[1.5px] border-t-white/40">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e1319] border-b border-white/10 select-none">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:opacity-100 transition-opacity" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:opacity-100 transition-opacity" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:opacity-100 transition-opacity" />
          <span className="ml-3 text-xs font-mono-code text-gray-400 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-primary" />
            guest@ignite-box:~
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono-code text-gray-500">
          <span className="hidden sm:inline">BASH 5.2</span>
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] border border-primary/20">
            SANDBOX
          </span>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        className="p-5 font-mono-code text-xs md:text-sm bg-[#0b0f14]/90 h-[360px] overflow-y-auto space-y-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item, index) => {
          if (item.type === 'input') {
            return (
              <div key={index} className="text-gray-200">
                <span className="text-primary font-bold">guest@ignite:~$</span>{' '}
                <span>{item.text.replace('guest@ignite:~$ ', '')}</span>
              </div>
            );
          }
          if (item.type === 'flag') {
            return (
              <div
                key={index}
                className="my-3 p-3 rounded-xl bg-cyber-green/10 border border-cyber-green/40 flex items-center justify-between text-cyber-green font-bold animate-pulse"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyber-green" />
                  <span>{item.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyFlag(item.text)}
                  className="px-2.5 py-1 text-xs rounded bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Flag'}
                </button>
              </div>
            );
          }
          if (item.type === 'success') {
            return (
              <div key={index} className="text-cyber-green font-semibold">
                {item.text}
              </div>
            );
          }
          if (item.type === 'error') {
            return (
              <div key={index} className="text-cyber-red">
                {item.text}
              </div>
            );
          }
          if (item.type === 'system') {
            return (
              <div key={index} className="text-gray-500">
                {item.text}
              </div>
            );
          }
          return (
            <pre key={index} className="text-gray-300 whitespace-pre-wrap font-mono-code leading-relaxed">
              {item.text}
            </pre>
          );
        })}

        {isDecrypting && (
          <div className="flex items-center space-x-2 text-primary animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" />
            <span>Executing exploit bypass chain...</span>
          </div>
        )}

        {/* Input prompt */}
        <form onSubmit={handleCommand} className="flex items-center space-x-2 pt-1">
          <span className="text-primary font-bold whitespace-nowrap">guest@ignite:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            disabled={isDecrypting}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none font-mono-code placeholder-gray-600 border-none p-0 focus:ring-0"
            placeholder={isDecrypting ? 'Executing...' : 'type a command (e.g. help, decrypt)'}
            autoFocus
          />
        </form>

        <div ref={bottomRef} />
      </div>

      {/* Terminal Footer Quick Actions */}
      <div className="px-4 py-2 bg-[#0e1319] border-t border-white/5 flex flex-wrap items-center gap-2 text-[11px] font-mono-code text-gray-400">
        <span className="text-gray-500">Quick run:</span>
        {['help', 'cat mission.txt', 'events', 'members', 'decrypt', 'clear'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => {
              setInput(cmd);
              inputRef.current?.focus();
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors border border-white/5"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTerminal;
