import { useState, useEffect, useRef } from 'react';
import { Phone, MessageSquare, Mail, Radio, Mic, Play, Pause, RotateCcw, Sparkles, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTestConversation } from '../services/genesysService';
import { getCurrentProvider } from '../services/ccasService';

const DEMO_SCENARIOS = {
  voice: [
    {
      from: '+1 (555) 234-5678',
      customerName: 'Sarah Mitchell',
      transcript: 'Hi, my HP LaserJet printer on floor 3 is offline and nothing is printing. The status light is blinking red.',
      duration: 8000,
      workflow: 'printer_offline',
      device: 'printer'
    },
    {
      from: '+1 (555) 891-2345',
      customerName: 'David Chen',
      transcript: 'My HP OfficeJet printer keeps getting paper jam errors every time we try to print labels. I cleared it twice but it keeps happening.',
      duration: 9000,
      workflow: 'paper_jam',
      device: 'printer'
    },
    {
      from: '+1 (555) 345-6789',
      customerName: 'Emily Johnson',
      transcript: 'My HP EliteBook laptop screen is flickering constantly. It started this morning and now I can barely see anything on the display.',
      duration: 10000,
      workflow: 'display_issue',
      device: 'laptop'
    },
    {
      from: '+1 (555) 567-8901',
      customerName: 'Michael Rodriguez',
      transcript: 'The HP printer says the cyan ink cartridge is not recognized even though I just installed a genuine HP cartridge this morning.',
      duration: 8500,
      workflow: 'ink_error',
      device: 'printer'
    },
    {
      from: '+1 (555) 789-0123',
      customerName: 'James Wilson',
      transcript: 'My HP Spectre laptop is running extremely slow. It takes forever to open applications and the fan is running constantly.',
      duration: 9500,
      workflow: 'slow_performance',
      device: 'laptop'
    },
    {
      from: '+1 (555) 333-4444',
      customerName: 'Patricia Miller',
      transcript: 'My HP ProBook laptop battery is draining very fast. It used to last 8 hours but now only lasts about 2 hours even when fully charged.',
      duration: 10500,
      workflow: 'battery_drain',
      device: 'laptop'
    },
    {
      from: '+1 (555) 555-1111',
      customerName: 'William Davis',
      transcript: 'My HP ZBook laptop is overheating constantly. It gets very hot after just 10 minutes of use and shuts down automatically.',
      duration: 11000,
      workflow: 'overheating',
      device: 'laptop'
    },
    {
      from: '+1 (555) 222-3333',
      customerName: 'Robert Taylor',
      transcript: 'My HP Envy laptop keyboard is not working properly. Several keys are stuck or not responding, especially the spacebar and enter key.',
      duration: 10000,
      workflow: 'keyboard_issue',
      device: 'laptop'
    },
    {
      from: '+1 (555) 777-8888',
      customerName: 'Jennifer Martinez',
      transcript: 'Our HP LaserJet printer on the 5th floor cannot connect to the network. The network status shows disconnected and we cannot print wirelessly.',
      duration: 9000,
      workflow: 'network_issue',
      device: 'printer'
    },
    {
      from: '+1 (555) 999-0000',
      customerName: 'Lisa Anderson',
      transcript: 'My HP EliteBook laptop cannot connect to the Wi-Fi network. It shows connected but there is no internet access and I cannot access any websites.',
      duration: 9500,
      workflow: 'network_issue',
      device: 'laptop'
    }
  ],
  sms: [
    {
      from: '+1 (555) 876-5432',
      customerName: 'Christopher Lee',
      message: 'My HP printer says the cyan cartridge is not recognized even though its a genuine HP cartridge. Just installed it yesterday.',
      delay: 12000,
      workflow: 'ink_error',
      device: 'printer'
    },
    {
      from: '+1 (555) 432-8765',
      customerName: 'Amanda White',
      message: 'The HP printer is printing everything with streaks and smudges. We just replaced the toner but the print quality is still terrible.',
      delay: 18000,
      workflow: 'print_quality',
      device: 'printer'
    },
    {
      from: '+1 (555) 210-9876',
      customerName: 'Robert Taylor',
      message: 'My HP ProBook laptop battery is draining very fast. It used to last 8 hours but now only lasts about 2 hours even when fully charged.',
      delay: 30000,
      workflow: 'battery_drain',
      device: 'laptop'
    },
    {
      from: '+1 (555) 654-3210',
      customerName: 'Michael Brown',
      message: 'My HP EliteBook laptop screen is flickering constantly. It started this morning and now I can barely see anything on the display.',
      delay: 20000,
      workflow: 'display_issue',
      device: 'laptop'
    },
    {
      from: '+1 (555) 111-2222',
      customerName: 'Emily Davis',
      message: 'My HP ZBook laptop is overheating. It gets very hot after just 10 minutes of use and shuts down automatically. This is urgent!',
      delay: 25000,
      workflow: 'overheating',
      device: 'laptop'
    },
    {
      from: '+1 (555) 333-4444',
      customerName: 'David Wilson',
      message: 'HP LaserJet printer on 5th floor cannot connect to the network. The network status shows disconnected and we cannot print wirelessly.',
      delay: 22000,
      workflow: 'network_issue',
      device: 'printer'
    }
  ],
  whatsapp: [
    {
      from: '+1 (555) 123-9876',
      customerName: 'Michael Brown',
      message: 'The HP LaserJet printer is extremely slow when printing PDF documents from email. Takes almost 5 minutes per page.',
      delay: 18000,
      workflow: 'slow_print',
      device: 'printer'
    },
    {
      from: '+1 (555) 987-6543',
      customerName: 'Jennifer Martinez',
      message: 'My HP Envy laptop keyboard is not working properly. Several keys are stuck or not responding, especially the spacebar.',
      delay: 22000,
      workflow: 'keyboard_issue',
      device: 'laptop'
    },
    {
      from: '+1 (555) 555-6666',
      customerName: 'Sarah Johnson',
      message: 'My HP Spectre laptop is running extremely slow. It takes forever to open applications and the fan is running constantly.',
      delay: 20000,
      workflow: 'slow_performance',
      device: 'laptop'
    },
    {
      from: '+1 (555) 777-8888',
      customerName: 'James Anderson',
      message: 'My HP EliteBook laptop cannot connect to the Wi-Fi network. It shows connected but there is no internet access.',
      delay: 25000,
      workflow: 'network_issue',
      device: 'laptop'
    }
  ],
  chat: [
    {
      sessionId: 'WEB-001',
      customerName: 'Emily Davis',
      message: 'Help! My HP printer has streaks and smudges on every page I print. The print quality is really bad and I have an important document to print.',
      delay: 30000,
      workflow: 'print_quality',
      device: 'printer'
    },
    {
      sessionId: 'WEB-002',
      customerName: 'David Chen',
      message: 'My HP ZBook laptop is overheating. It gets very hot after just 10 minutes of use and shuts down automatically. This is urgent!',
      delay: 35000,
      workflow: 'overheating',
      device: 'laptop'
    },
    {
      sessionId: 'WEB-003',
      customerName: 'Patricia Miller',
      message: 'My HP EliteBook laptop screen is flickering constantly. It started this morning and now I can barely see anything on the display.',
      delay: 32000,
      workflow: 'display_issue',
      device: 'laptop'
    },
    {
      sessionId: 'WEB-004',
      customerName: 'William Taylor',
      message: 'My HP ProBook laptop battery is draining very fast. It used to last 8 hours but now only lasts about 2 hours even when fully charged.',
      delay: 28000,
      workflow: 'battery_drain',
      device: 'laptop'
    },
    {
      sessionId: 'WEB-005',
      customerName: 'Lisa Anderson',
      message: 'Our HP LaserJet printer on the 5th floor cannot connect to the network. The network status shows disconnected and we cannot print wirelessly.',
      delay: 30000,
      workflow: 'network_issue',
      device: 'printer'
    }
  ]
};

export default function LiveDemoController({ onInteractionCapture, onCreateGenesysConversation }) {
  const [demoMode, setDemoMode] = useState('auto');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  
  // For live voice mode
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechAPI, setHasSpeechAPI] = useState(false);
  const finalTranscriptRef = useRef(''); // Store final transcript for Genesys creation

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setHasSpeechAPI(!!SpeechRecognition);
  }, []);

  // Auto mode - simulates realistic interaction scenarios
  useEffect(() => {
    if (!isPlaying || demoMode !== 'auto') return;

    let timeouts = [];

    // For auto mode, drive a single clear story: printer inkjet issue via SMS
    const smsScenario = DEMO_SCENARIOS.sms[scenarioIndex % DEMO_SCENARIOS.sms.length];
    timeouts.push(setTimeout(() => {
      receiveMessage('sms', smsScenario);
    }, 2000));

    // Loop scenarios (spaced out so each run can fully complete)
    timeouts.push(setTimeout(() => {
      setScenarioIndex(prev => prev + 1);
    }, 40000));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isPlaying, demoMode, scenarioIndex]);

  // Timer for active session
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const startVoiceSimulation = (scenario) => {
    setCurrentChannel({
      type: 'voice',
      from: scenario.from,
      customerName: scenario.customerName,
      status: 'active'
    });

    // Simulate live transcription - word by word
    const words = scenario.transcript.split(' ');
    const msPerWord = scenario.duration / words.length;

    words.forEach((word, index) => {
      setTimeout(() => {
        setLiveTranscript(prev => {
          const updated = prev ? `${prev} ${word}` : word;
          
          // Feed to intent brain progressively
          if (updated.split(' ').length >= 4) {
            onInteractionCapture({
              channel: 'voice',
              text: updated,
              from: scenario.from,
              customerName: scenario.customerName,
              workflow: scenario.workflow,
              device: scenario.device || 'printer',
              isLive: true
            });
          }
          
          return updated;
        });
      }, index * msPerWord);
    });

    // End call
    setTimeout(() => {
      setCurrentChannel(null);
      setLiveTranscript('');
    }, scenario.duration + 2000);
  };

  const receiveMessage = (channel, scenario) => {
    onInteractionCapture({
      channel,
      text: scenario.message,
      from: scenario.from,
      customerName: scenario.customerName,
      workflow: scenario.workflow,
      device: scenario.device || 'printer'
    });
  };

  // Live voice mode using Web Speech API
  const startLiveVoice = () => {
    if (!hasSpeechAPI) {
      alert('Web Speech API not supported in this browser. Use Chrome for live voice input.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setCurrentChannel({
        type: 'voice',
        from: 'LIVE',
        customerName: 'Live Voice Input',
        status: 'active'
      });
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Accumulate final transcript
      if (finalTranscript) {
        finalTranscriptRef.current += finalTranscript;
      }

      const fullTranscript = (finalTranscriptRef.current + interimTranscript).trim();
      setLiveTranscript(fullTranscript);

      if (fullTranscript.split(' ').length >= 4) {
        // Detect device type and workflow from transcript
        const textLower = fullTranscript.toLowerCase();
        let device = 'printer';
        let workflow = 'printer_offline';
        
        if (textLower.includes('laptop') || textLower.includes('notebook') || textLower.includes('elitebook') || textLower.includes('probook') || textLower.includes('spectre') || textLower.includes('zbook') || textLower.includes('envy')) {
          device = 'laptop';
          if (textLower.includes('flicker') || textLower.includes('screen') || textLower.includes('display')) {
            workflow = 'display_issue';
          } else if (textLower.includes('slow') || textLower.includes('performance')) {
            workflow = 'slow_performance';
          } else if (textLower.includes('battery') || textLower.includes('drain')) {
            workflow = 'battery_drain';
          } else if (textLower.includes('overheat') || textLower.includes('hot') || textLower.includes('shut down')) {
            workflow = 'overheating';
          } else if (textLower.includes('keyboard') || textLower.includes('key')) {
            workflow = 'keyboard_issue';
          } else if (textLower.includes('network') || textLower.includes('wifi') || textLower.includes('wi-fi') || textLower.includes('connect')) {
            workflow = 'network_issue';
          }
        } else if (textLower.includes('network') || textLower.includes('wifi') || textLower.includes('wi-fi') || textLower.includes('connect')) {
          workflow = 'network_issue';
        } else if (textLower.includes('ink') || textLower.includes('cartridge') || textLower.includes('cyan')) {
          workflow = 'ink_error';
        } else if (textLower.includes('paper jam') || textLower.includes('jam')) {
          workflow = 'paper_jam';
        } else if (textLower.includes('slow') || textLower.includes('speed')) {
          workflow = 'slow_print';
        } else if (textLower.includes('quality') || textLower.includes('streak') || textLower.includes('smudge')) {
          workflow = 'print_quality';
        }
        
        onInteractionCapture({
          channel: 'voice',
          text: fullTranscript,
          from: 'LIVE',
          customerName: 'Live Voice Input',
          workflow: workflow,
          device: device,
          isLive: true
        });
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = async () => {
      setIsListening(false);
      
      // When recognition ends, create Genesys conversation if we have a final transcript
      const finalText = finalTranscriptRef.current.trim();
      if (finalText && finalText.split(' ').length >= 4 && getCurrentProvider() === 'genesys') {
        try {
          // Detect device type and workflow from transcript
          const textLower = finalText.toLowerCase();
          let device = 'printer';
          let workflow = 'printer_offline';
          
          if (textLower.includes('laptop') || textLower.includes('notebook') || textLower.includes('elitebook') || textLower.includes('probook') || textLower.includes('spectre') || textLower.includes('zbook') || textLower.includes('envy')) {
            device = 'laptop';
            if (textLower.includes('flicker') || textLower.includes('screen') || textLower.includes('display')) {
              workflow = 'display_issue';
            } else if (textLower.includes('slow') || textLower.includes('performance')) {
              workflow = 'slow_performance';
            } else if (textLower.includes('battery') || textLower.includes('drain')) {
              workflow = 'battery_drain';
            } else if (textLower.includes('overheat') || textLower.includes('hot') || textLower.includes('shut down')) {
              workflow = 'overheating';
            } else if (textLower.includes('keyboard') || textLower.includes('key')) {
              workflow = 'keyboard_issue';
            } else if (textLower.includes('network') || textLower.includes('wifi') || textLower.includes('wi-fi') || textLower.includes('connect')) {
              workflow = 'network_issue';
            }
          } else if (textLower.includes('network') || textLower.includes('wifi') || textLower.includes('wi-fi') || textLower.includes('connect')) {
            workflow = 'network_issue';
          } else if (textLower.includes('ink') || textLower.includes('cartridge') || textLower.includes('cyan')) {
            workflow = 'ink_error';
          } else if (textLower.includes('paper jam') || textLower.includes('jam')) {
            workflow = 'paper_jam';
          } else if (textLower.includes('slow') || textLower.includes('speed')) {
            workflow = 'slow_print';
          } else if (textLower.includes('quality') || textLower.includes('streak') || textLower.includes('smudge')) {
            workflow = 'print_quality';
          }
          
          // Create Genesys conversation
          const result = await createTestConversation({
            phoneNumber: '+1 (555) LIVE-VOICE',
            customerName: 'Live Voice Customer',
            transcript: finalText,
            workflow: workflow,
            device: device,
          });
          
          if (result.success && onCreateGenesysConversation) {
            // Callback to refresh Genesys panel or auto-select
            onCreateGenesysConversation(result.conversation);
          }
        } catch (error) {
          console.error('Error creating Genesys conversation from live voice:', error);
        }
      }
      
      // Reset final transcript for next session
      finalTranscriptRef.current = '';
      setCurrentChannel(null);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopLiveVoice = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    // When manually stopped, also create Genesys conversation if we have transcript
    const finalText = finalTranscriptRef.current.trim();
    if (finalText && finalText.split(' ').length >= 4 && getCurrentProvider() === 'genesys') {
      try {
        // Detect device type and workflow from transcript
        const textLower = finalText.toLowerCase();
        let device = 'printer';
        let workflow = 'printer_offline';
        
        if (textLower.includes('laptop') || textLower.includes('notebook') || textLower.includes('elitebook') || textLower.includes('probook') || textLower.includes('spectre') || textLower.includes('zbook') || textLower.includes('envy')) {
          device = 'laptop';
          if (textLower.includes('flicker') || textLower.includes('screen') || textLower.includes('display')) {
            workflow = 'display_issue';
          } else if (textLower.includes('slow') || textLower.includes('performance')) {
            workflow = 'slow_performance';
          } else if (textLower.includes('battery') || textLower.includes('drain')) {
            workflow = 'battery_drain';
          } else if (textLower.includes('overheat') || textLower.includes('hot') || textLower.includes('shut down')) {
            workflow = 'overheating';
          } else if (textLower.includes('keyboard') || textLower.includes('key')) {
            workflow = 'keyboard_issue';
          } else if (textLower.includes('network') || textLower.includes('wifi') || textLower.includes('wi-fi') || textLower.includes('connect')) {
            workflow = 'network_issue';
          }
        } else if (textLower.includes('network') || textLower.includes('wifi') || textLower.includes('wi-fi') || textLower.includes('connect')) {
          workflow = 'network_issue';
        } else if (textLower.includes('ink') || textLower.includes('cartridge') || textLower.includes('cyan')) {
          workflow = 'ink_error';
        } else if (textLower.includes('paper jam') || textLower.includes('jam')) {
          workflow = 'paper_jam';
        } else if (textLower.includes('slow') || textLower.includes('speed')) {
          workflow = 'slow_print';
        } else if (textLower.includes('quality') || textLower.includes('streak') || textLower.includes('smudge')) {
          workflow = 'print_quality';
        }
        
        const result = await createTestConversation({
          phoneNumber: '+1 (555) LIVE-VOICE',
          customerName: 'Live Voice Customer',
          transcript: finalText,
          workflow: workflow,
          device: device,
        });
        
        if (result.success && onCreateGenesysConversation) {
          onCreateGenesysConversation(result.conversation);
        }
      } catch (error) {
        console.error('Error creating Genesys conversation from live voice:', error);
      }
    }
    
    setIsListening(false);
    setLiveTranscript('');
    finalTranscriptRef.current = '';
    setCurrentChannel(null);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setElapsedTime(0);
    setLiveTranscript('');
    setCurrentChannel(null);
    setScenarioIndex(0);
  };

  return (
    <div className="h-full flex flex-col">
      {/* AI-Powered Interaction Monitor */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden border-2 border-gray-300"
      >
        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] border-b-2 border-gray-300">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
            <div>
              <div className="text-white font-bold text-xs">AI Interaction Hub</div>
              <div className="text-white/80 text-[9px] font-medium">Multi-Channel Intelligence</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              ACTIVE
            </motion.div>
            <div className="text-[9px] font-mono text-white bg-white/30 px-2 py-0.5 rounded backdrop-blur-sm font-bold">
              {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Mode Selection - Compact */}
        <div className="px-2 py-1.5 bg-gray-50 border-b-2 border-gray-300">
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setDemoMode('auto')}
              className={`px-1.5 py-1 rounded text-[9px] font-bold transition-all ${
                demoMode === 'auto'
                  ? 'bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400'
              }`}
            >
              <Sparkles className="w-3 h-3 mx-auto mb-0.5" />
              <span className="text-[8px]">Auto</span>
            </button>
            <button
              onClick={() => setDemoMode('manual')}
              className={`px-1.5 py-1 rounded text-[9px] font-bold transition-all ${
                demoMode === 'manual'
                  ? 'bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400'
              }`}
            >
              <Zap className="w-3 h-3 mx-auto mb-0.5" />
              <span className="text-[8px]">Manual</span>
            </button>
            <button
              onClick={() => setDemoMode('live-voice')}
              className={`px-1.5 py-1 rounded text-[9px] font-bold transition-all ${
                demoMode === 'live-voice'
                  ? 'bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400'
              }`}
            >
              <Mic className="w-3 h-3 mx-auto mb-0.5" />
              <span className="text-[8px]">Live</span>
            </button>
          </div>
        </div>

        {/* Controls and Active Channels - Compact */}
        <div className="px-2 py-1.5 flex-1 flex flex-col bg-gradient-to-b from-white via-purple-50/30 to-white min-h-0 overflow-y-auto">
          {demoMode === 'auto' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] text-white rounded font-bold hover:shadow-lg transition-all shadow-md text-[9px]"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isPlaying ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetDemo}
                  className="px-2 py-1.5 bg-white hover:bg-gray-100 text-[#2E2E2E] rounded transition-all border border-gray-300 hover:border-gray-400"
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
              
              {/* Active Channels Status - Compact */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-1.5">
                <div className="text-[9px] font-bold text-purple-900 mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Channels
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex items-center gap-1 bg-white rounded px-1.5 py-0.5 border border-purple-200">
                    <Phone className="w-2.5 h-2.5 text-purple-600" />
                    <span className="text-[8px] font-semibold text-gray-700">Voice</span>
                    <span className="ml-auto w-1 h-1 bg-green-500 rounded-full"></span>
                  </div>
                  <div className="flex items-center gap-1 bg-white rounded px-1.5 py-0.5 border border-purple-200">
                    <MessageSquare className="w-2.5 h-2.5 text-purple-600" />
                    <span className="text-[8px] font-semibold text-gray-700">SMS</span>
                    <span className="ml-auto w-1 h-1 bg-green-500 rounded-full"></span>
                  </div>
                  <div className="flex items-center gap-1 bg-white rounded px-1.5 py-0.5 border border-purple-200">
                    <MessageSquare className="w-2.5 h-2.5 text-purple-600" />
                    <span className="text-[8px] font-semibold text-gray-700">WhatsApp</span>
                    <span className="ml-auto w-1 h-1 bg-green-500 rounded-full"></span>
                  </div>
                  <div className="flex items-center gap-1 bg-white rounded px-1.5 py-0.5 border border-purple-200">
                    <Mail className="w-2.5 h-2.5 text-purple-600" />
                    <span className="text-[8px] font-semibold text-gray-700">Chat</span>
                    <span className="ml-auto w-1 h-1 bg-green-500 rounded-full"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {demoMode === 'live-voice' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={isListening ? stopLiveVoice : startLiveVoice}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded font-bold transition-all shadow-md text-[9px] ${
                    isListening
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                      : 'bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] text-white hover:shadow-lg'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  {isListening ? 'Stop' : 'Start'}
                </button>
                {!hasSpeechAPI && (
                  <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200 font-semibold">
                    Chrome
                  </span>
                )}
              </div>
              {getCurrentProvider() === 'genesys' && (
                <div className="text-[8px] text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded px-1.5 py-1">
                  <span className="font-semibold">💡</span> Auto-creates Genesys conversation when finished.
                </div>
              )}
            </div>
          )}

          {demoMode === 'manual' && (
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => startVoiceSimulation(DEMO_SCENARIOS.voice[0])}
                className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded text-[8px] font-bold transition-all border border-gray-300 hover:border-gray-400 shadow-sm"
              >
                <Phone className="w-3 h-3 text-[#780096]" />
                Voice
              </button>
              <button
                onClick={() => receiveMessage('sms', DEMO_SCENARIOS.sms[0])}
                className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded text-[8px] font-bold transition-all border border-gray-300 hover:border-gray-400 shadow-sm"
              >
                <MessageSquare className="w-3 h-3 text-[#780096]" />
                SMS
              </button>
              <button
                onClick={() => receiveMessage('whatsapp', DEMO_SCENARIOS.whatsapp[0])}
                className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 bg-white hover:bg-purple-50 text-gray-700 rounded text-[8px] font-bold transition-all border border-purple-200 hover:border-purple-300 shadow-sm"
              >
                <MessageSquare className="w-3 h-3 text-[#780096]" />
                WhatsApp
              </button>
              <button
                onClick={() => receiveMessage('chat', DEMO_SCENARIOS.chat[0])}
                className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded text-[8px] font-bold transition-all border border-gray-300 hover:border-gray-400 shadow-sm"
              >
                <Mail className="w-3 h-3 text-[#780096]" />
                Chat
              </button>
            </div>
          )}

        </div>
      </motion.div>

      {/* Active Call Banner - Outside, Always Visible */}
      <AnimatePresence>
        {currentChannel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-2.5 text-white shadow-xl border-2 border-red-400"
          >
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="relative"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-white rounded-full">
                      <span className="absolute inset-0 bg-white rounded-full animate-ping" />
                    </span>
                  </motion.div>
                  <div className="flex-1">
                    <div className="font-bold text-[10px]">
                      {currentChannel.type === 'voice' ? '📞 ACTIVE CALL' : `📱 ${currentChannel.type.toUpperCase()}`}
                    </div>
                    <div className="text-[9px] opacity-90 font-medium">
                      {currentChannel.customerName}
                    </div>
                  </div>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="px-2 py-0.5 bg-white/20 rounded text-[8px] font-bold backdrop-blur border border-white/30"
                  >
                    ⬤ LIVE
                  </motion.div>
                </div>

                {liveTranscript && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-black/30 backdrop-blur rounded mt-1.5 p-1.5 border border-white/20"
                  >
                    <div className="text-[8px] font-bold opacity-90 mb-0.5 flex items-center gap-1">
                      <Radio className="w-2 h-2 animate-pulse" />
                      TRANSCRIPTION
                    </div>
                    <div className="text-[10px] font-medium">
                      "{liveTranscript}"
                      <motion.span 
                        className="inline-block w-0.5 h-3 bg-white ml-1 align-middle"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.7, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

