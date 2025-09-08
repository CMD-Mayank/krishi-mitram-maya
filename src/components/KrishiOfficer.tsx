import { useState, useRef } from 'react';
import { Mic, MicOff, Send, Image as ImageIcon, Volume2, Heart, ThumbsUp, Frown, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/kerala-farming-hero.jpg';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  hasAudio?: boolean;
  image?: string;
}

interface InfoCard {
  id: string;
  title: string;
  titleMalayalam: string;
  content: string;
  icon: string;
  color: string;
}

const KrishiOfficer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി ഓഫീസറാണ്. എങ്ങനെ സഹായിക്കാം? (Hello! I am your Digital Krishi Officer. How can I help you?)',
      timestamp: new Date(),
      hasAudio: true
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const infoCards: InfoCard[] = [
    {
      id: '1',
      title: 'Weather Today',
      titleMalayalam: 'ഇന്നത്തെ കാലാവസ്ഥ',
      content: '28°C, Light Rain Expected. Good for transplanting paddy seedlings. മഴ പ്രതീക്ഷിക്കുന്നു - നെല്ല് നടാൻ അനുയോജ്യം',
      icon: '🌤️',
      color: 'bg-gradient-sky'
    },
    {
      id: '2',
      title: 'Crop Calendar',
      titleMalayalam: 'വിള കലണ്ടർ',
      content: 'Virippu Season: Rice planting optimal. പുതുവയൽ തയ്യാറാക്കാൻ സമയം. Prepare nursery beds, apply organic manure.',
      icon: '🌾',
      color: 'bg-gradient-earth'
    },
    {
      id: '3',
      title: 'Pest Alert',
      titleMalayalam: 'കീടമുന്നറിയിപ്പ്',
      content: 'Brown Plant Hopper detected in nearby farms. പുരു ഇലപ്പേൻ കണ്ടു. Use neem-based spray immediately.',
      icon: '🐛',
      color: 'bg-gradient-kerala'
    },
    {
      id: '4',
      title: 'Government Schemes',
      titleMalayalam: 'സർക്കാർ പദ്ധതികൾ',
      content: 'PM-KISAN ₹2000 installment due. ATMA training programs available. കൃഷി വായ്പ അനുമതി ലഭ്യം.',
      icon: '🏛️',
      color: 'bg-gradient-sky'
    },
    {
      id: '5',
      title: 'Market Prices',
      titleMalayalam: 'വിപണി വില',
      content: 'Rice: ₹32/kg ↗️ Coconut: ₹45/piece ↗️ Pepper: ₹650/kg →. കുരുമുളക് വില സ്ഥിരം.',
      icon: '💰',
      color: 'bg-gradient-earth'
    },
    {
      id: '6',
      title: 'Soil Health',
      titleMalayalam: 'മണ്ണിന്റെ ആരോഗ്യം',
      content: 'Monsoon leaching detected. Apply lime & organic matter. മണ്ണിന്റെ അസിഡിറ്റി കൂടിയിട്ടുണ്ട്.',
      icon: '🌱',
      color: 'bg-gradient-kerala'
    },
    {
      id: '7',
      title: 'Water Management',
      titleMalayalam: 'ജല പരിപാലനം',
      content: 'Reservoir 85% full. Good for direct seeding. പാടത്തിൽ വെള്ളം നിലനിർത്താൻ കാലുകൾ ഉയർത്തുക.',
      icon: '💧',
      color: 'bg-gradient-sky'
    },
    {
      id: '8',
      title: 'Organic Tips',
      titleMalayalam: 'ജൈവ കൃഷി',
      content: 'Prepare panchagavya for next week. പഞ്ചഗവ്യ തയ്യാറാക്കുക. Compost ready in 15 days.',
      icon: '🍃',
      color: 'bg-gradient-earth'
    }
  ];

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'നിങ്ങളുടെ ചോദ്യം മനസ്സിലായി. ഇതിനെ കുറിച്ച് കൂടുതൽ വിവരം തരാം... (I understand your question. Let me provide more information about this...)',
        'ഇത് വളരെ നല്ല ചോദ്യമാണ്. കൃഷിയിൽ ഇത്തരം പ്രശ്നങ്ങൾ സാധാരണമാണ്... (This is a very good question. Such problems are common in farming...)',
        'നിങ്ങളുടെ വിളയെ സംബന്ധിച്ച് എനിക്ക് സഹായിക്കാം. ആദ്യം ഇത് പരിശോധിക്കാം... (I can help you regarding your crops. Let\'s first examine this...)'
      ];

      const aiResponse: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        hasAudio: true
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Recording started",
        description: "ശബ്ദം റെക്കോർഡ് ചെയ്യുന്നു... (Recording voice...)",
      });
    } else {
      toast({
        title: "Recording stopped",
        description: "റെക്കോർഡിംഗ് നിർത്തി (Recording stopped)",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: 'ചിത്രം അപ്‌ലോഡ് ചെയ്തു - ഇത് പരിശോധിക്കാമോ? (Image uploaded - can you check this?)',
        timestamp: new Date(),
        image: imageUrl
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const playAudio = (messageId: string) => {
    setIsPlaying(true);
    toast({
      title: "Playing audio",
      description: "ശബ്ദം പ്ലേ ചെയ്യുന്നു... (Playing audio...)",
    });
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const provideFeedback = (messageId: string, type: 'helpful' | 'not-helpful' | 'loved') => {
    const feedbackText = {
      helpful: 'സഹായകരമായി! (Helpful!)',
      'not-helpful': 'കൂടുതൽ വിവരം വേണം (Need more info)',
      loved: 'വളരെ ഇഷ്ടപ്പെട്ടു! (Loved it!)'
    };
    
    toast({
      title: "Feedback received",
      description: feedbackText[type],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Kerala farming hero */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Kerala farming landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-2xl font-bold text-white mb-1">Digital Krishi Officer</h1>
          <p className="text-white/90 font-malayalam">ഡിജിറ്റൽ കൃഷി ഓഫീസർ</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {infoCards.map((card, index) => (
            <Card 
              key={card.id} 
              className={`${card.color} border-0 shadow-card hover:shadow-warm transition-all duration-500 cursor-pointer transform hover:scale-105 animate-slide-up group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 transform -skew-y-12 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="text-2xl mb-2 animate-float" style={{ animationDelay: `${index * 200}ms` }}>
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1 group-hover:scale-105 transition-transform duration-300">
                    {card.title}
                  </h3>
                  <p className="text-xs text-white/90 font-malayalam mb-2 font-medium">
                    {card.titleMalayalam}
                  </p>
                  <p className="text-xs text-white/95 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                    {card.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto scroll-smooth">
          {messages.map((message, index) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`max-w-xs md:max-w-md transform hover:scale-102 transition-all duration-300 ${
                message.type === 'user' 
                  ? 'bg-gradient-kerala text-white shadow-warm hover:shadow-card' 
                  : 'bg-card text-card-foreground shadow-card hover:shadow-warm border border-border/50'
              } rounded-2xl p-4 relative overflow-hidden group`}>
                
                {/* Animated background for user messages */}
                {message.type === 'user' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}
                
                {/* Message content */}
                <div className="relative z-10">
                  {message.image && (
                    <img 
                      src={message.image} 
                      alt="Uploaded" 
                      className="w-full rounded-lg mb-2 animate-scale-in hover:scale-105 transition-transform duration-300" 
                    />
                  )}
                  <p className="text-sm leading-relaxed animate-fade-in">{message.content}</p>
                  
                  {message.type === 'assistant' && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30 animate-fade-in" style={{ animationDelay: '200ms' }}>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => provideFeedback(message.id, 'helpful')}
                          className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 group"
                        >
                          <ThumbsUp className="h-3 w-3 group-hover:animate-bounce-gentle" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => provideFeedback(message.id, 'loved')}
                          className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 group"
                        >
                          <Heart className="h-3 w-3 group-hover:animate-pulse-soft text-red-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => provideFeedback(message.id, 'not-helpful')}
                          className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 group"
                        >
                          <Frown className="h-3 w-3 group-hover:animate-bounce-gentle" />
                        </Button>
                      </div>
                      {message.hasAudio && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playAudio(message.id)}
                          className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 group"
                          disabled={isPlaying}
                        >
                          <Volume2 className={`h-3 w-3 ${isPlaying ? 'animate-pulse-soft' : 'group-hover:animate-bounce-gentle'}`} />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <Card className="shadow-warm hover:shadow-card transition-all duration-300 animate-slide-up border border-border/30">
          <CardContent className="p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="നിങ്ങളുടെ ചോദ്യം എഴുതുക... എന്താണ് സഹായം വേണ്ടത്? (Type your question... What help do you need?)"
                  className="resize-none border-0 bg-muted/50 focus:bg-background transition-all duration-300 focus:shadow-inner rounded-lg"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3 gap-2">
                  <div className="flex space-x-2">
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={toggleRecording}
                      className={`gap-2 transition-all duration-300 hover:scale-105 ${
                        isRecording ? 'animate-pulse-soft shadow-warm' : 'hover:shadow-card'
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="h-4 w-4 animate-bounce-gentle" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                      <span className="hidden md:inline">
                        {isRecording ? 'നിർത്തുക' : 'സംസാരിക്കുക'}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2 hover:scale-105 transition-all duration-300 hover:shadow-card"
                    >
                      <Camera className="h-4 w-4" />
                      <span className="hidden md:inline">ചിത്രം</span>
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-gradient-kerala hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-warm hover:shadow-card disabled:opacity-50 disabled:scale-100"
                    disabled={!currentMessage.trim()}
                  >
                    <Send className={`h-4 w-4 ${currentMessage.trim() ? 'animate-bounce-gentle' : ''}`} />
                    <span className="ml-2 hidden md:inline">അയക്കുക</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {/* ElevenLabs ConvAI Voice Agent */}
        <div className="mt-6 mb-6">
          <elevenlabs-convai agent-id="agent_8401k4n6dhc4e5j9tw0e4dwghb7p"></elevenlabs-convai>
        </div>

        {/* Support section */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
          <Badge variant="secondary" className="mb-3 animate-pulse-soft hover:scale-105 transition-transform duration-300">
            സഹായം വേണ്ടേ? (Need help?)
          </Badge>
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/30 hover:shadow-warm transition-all duration-300">
            <p className="text-sm text-muted-foreground mb-2 font-malayalam">
              എനിക്ക് ഉത്തരം അറിയില്ലെങ്കിൽ, നിങ്ങളെ പ്രാദേശിക കൃഷി ഓഫീസറുമായി ബന്ധിപ്പിക്കാം 🤝
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              If I don't know the answer, I can connect you with a local agricultural officer
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">
                🌾 Crop Guidance
              </span>
              <span className="bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">
                🐛 Pest Control
              </span>
              <span className="bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">
                💰 Market Info
              </span>
              <span className="bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">
                🏛️ Schemes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KrishiOfficer;