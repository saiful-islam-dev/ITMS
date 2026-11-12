import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal as TerminalIcon, Play, RefreshCw, Maximize2, Trash2 } from 'lucide-react';
import { Facility } from '../../types';

interface RemoteTerminalModalProps {
  isOpen: boolean;
  facility: Facility | null;
  onClose: () => void;
}

interface CommandLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

export const RemoteTerminalModal: React.FC<RemoteTerminalModalProps> = ({
  isOpen,
  facility,
  onClose
}) => {
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'Connected via SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4 (Encrypted TLS 1.3)'
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Apex Garments Secure Gateway | Fortinet & Cisco Fabric OS v7.4.2'
    },
    {
      id: 'init-3',
      type: 'output',
      text: 'Type "help" to display supported operational diagnostic commands.'
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen || !facility) return null;

  const hostname = `${facility.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-gw01`;

  const runCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newLogs: CommandLog[] = [
      ...logs,
      {
        id: `in-${Date.now()}`,
        type: 'input',
        text: `${hostname}# ${trimmed}`
      }
    ];

    const parts = trimmed.toLowerCase().split(' ');
    const cmd = parts[0];

    if (cmd === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    }

    let outputText = '';
    let logType: CommandLog['type'] = 'output';

    if (cmd === 'help') {
      outputText = `Supported Diagnostic Commands:
  show vlan              - Display configured VLANs and port memberships
  show ip route          - Display local routing table & SD-WAN gateway
  show environment       - Display temperature sensors, fan speed and PSU status
  show interface status  - Show physical fiber and copper interface links
  ping <target_ip>       - Send ICMP echo packets to destination host
  traceroute <target_ip> - Trace multi-hop network path
  show sdwan status      - Display FortiGate IPsec tunnel health & jitter
  clear                  - Clear terminal screen`;
    } else if (cmd === 'show' && parts[1] === 'vlan') {
      outputText = `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi1/0/1-4
10   CORPORATE-MGMT                   active    Gi1/0/5-12, Te1/1/1
20   GARMENT-ASSEMBLY-IOT             active    Gi1/0/13-28, Te1/1/2
40   CHEMICAL-WASH-PLANT              active    Gi1/0/29-40 [ALERT: HIGH TRAFFIC]
60   WAREHOUSE-LOGISTICS-RFID         active    Gi1/0/41-48
99   GUEST-WIFI-ISOLATED              active    Te1/1/3`;
    } else if (cmd === 'show' && (parts[1] === 'environment' || parts[1] === 'env')) {
      const therm = facility.thermalData;
      outputText = `System Environmental Diagnostics for [${facility.name}]:
-----------------------------------------------------------------
Thermal Sensor: ${therm?.idfCabinet || 'MAIN-IDF'}
Core Temp:      ${therm?.tempC || 24.5}°C [Threshold: 35.0°C]
Ambient RH:     ${therm?.humidity || 52}% [Max allowed: 65%]
Moisture Alert: ${therm?.moistureDetected ? 'ACTIVE FAULT DETECTED' : 'CLEAR (Dry)'}
Fan Tray 1:     ${therm?.fanSpeedRpm || 3200} RPM (Status: OK)
PSU 1 (AC):     Operational (230V / 50Hz, Draw: 184W)
PSU 2 (Redund): Standby / Healthy`;
    } else if (cmd === 'show' && parts[1] === 'sdwan') {
      outputText = `FortiGate SD-WAN Tunnel Statistics (Hub: FortiGate-DC-01):
-----------------------------------------------------------------
Peer Subnet:     ${facility.subnet}
Tunnel Status:   UP (Active / Synchronized)
Uplink Path:     ${facility.uplinks}
Latency:         ${facility.pingMs}ms
Jitter:          ${facility.jitterMs}ms
Packet Loss:     ${facility.packetLossPercent}%
SLA Target:      ${facility.slaTarget} (Met: PASS)`;
    } else if (cmd === 'show' && parts[1] === 'interface') {
      outputText = `Port      Name               Status       Vlan       Duplex  Speed Type
Te1/1/1   Uplink-To-HQ       connected    trunk      full    10G   10Gbase-SR
Te1/1/2   Starlink-Backup    connected    trunk      full    1G    1000Base-T
Gi1/0/1   Core-Switch-Stack  connected    trunk      full    1000  1000Base-TX
Gi1/0/2   Zebra-Printer-Pool connected    20         full    100   10/100Base-TX
Gi1/0/3   RFID-Gate-Antenna  connected    20         full    1000  1000Base-TX`;
    } else if (cmd === 'ping') {
      const target = parts[1] || '10.14.0.1';
      outputText = `Sending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = ${facility.pingMs - 1}/${facility.pingMs}/${facility.pingMs + 2} ms`;
    } else if (cmd === 'show' && parts[1] === 'ip' && parts[2] === 'route') {
      outputText = `Codes: C - connected, S - static, B - BGP, O - OSPF, * - candidate default
Gateway of last resort is 10.14.0.254 to network 0.0.0.0

B*   0.0.0.0/0 [20/0] via 10.14.0.254, 4d18h
C    ${facility.subnet} is directly connected, Vlan10
B    10.14.0.0/18 [200/0] via 10.14.0.1 (Apex HQ Core DC)
B    10.14.20.0/20 [200/0] via 10.14.20.1 (Factory A)
B    10.14.40.0/20 [200/0] via 10.14.40.1 (Factory B)
B    10.14.60.0/21 [200/0] via 10.14.60.1 (Warehouse Hub)`;
    } else {
      logType = 'error';
      outputText = `% Invalid command or unrecognized subcommand: "${trimmed}". Type "help" for a list of commands.`;
    }

    newLogs.push({
      id: `out-${Date.now()}`,
      type: logType,
      text: outputText
    });

    setLogs(newLogs);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx =
          historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputVal('');
        } else {
          setHistoryIndex(nextIdx);
          setInputVal(commandHistory[nextIdx]);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#090d16] border border-slate-700 rounded-2xl shadow-level-3 overflow-hidden z-10 flex flex-col h-[82vh] font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="px-4 py-3 bg-[#111827] border-b border-slate-800 flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <TerminalIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-semibold">
                SSH://admin@{facility.code.toLowerCase()}.apexgarments.internal:22
              </span>
              <span className="text-[10px] text-emerald-400 px-1.5 py-0.2 bg-emerald-950 border border-emerald-500/40 rounded">
                TLS ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLogs([])}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Clear screen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Suggestions Pill Toolbar */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0">Quick run:</span>
          {['show vlan', 'show environment', 'show sdwan status', 'ping 10.14.0.1', 'show interface status', 'show ip route'].map(
            (cmd) => (
              <button
                key={cmd}
                onClick={() => runCommand(cmd)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded whitespace-nowrap transition-colors border border-slate-700"
              >
                {cmd}
              </button>
            )
          )}
        </div>

        {/* Output Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-slate-200">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`leading-relaxed whitespace-pre-wrap ${
                log.type === 'system'
                  ? 'text-indigo-300 italic'
                  : log.type === 'input'
                  ? 'text-emerald-400 font-bold'
                  : log.type === 'error'
                  ? 'text-rose-400 font-semibold'
                  : 'text-slate-200'
              }`}
            >
              {log.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Interactive Command Input */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold">{hostname}#</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command (e.g. show vlan, show environment, ping 10.14.0.1)..."
            className="flex-1 bg-transparent text-white outline-none text-xs placeholder-slate-600 font-mono"
          />
          <button
            onClick={() => runCommand(inputVal)}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-xs flex items-center gap-1 transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>Exec</span>
          </button>
        </div>
      </div>
    </div>
  );
};

