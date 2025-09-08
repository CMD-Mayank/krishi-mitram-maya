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
      content: '28°C, Light Rain Expected',
      icon: '🌤️',
      color: 'bg-gradient-sky'
    },
    {
      id: '2',
      title: 'Crop Calendar',
      titleMalayalam: 'വിള കലണ്ടർ',
      content: 'Rice planting season begins',
      icon: '🌾',
      color: 'bg-gradient-earth'
    },
    {
      id: '3',
      title: 'Pest Alert',
      titleMalayalam: 'കീടമുന്നറിയിപ്പ്',
      content: 'Brown plant hopper spotted',
      icon: '🐛',
      color: 'bg-gradient-kerala'
    },
    {
      id: '4',
      title: 'Government Schemes',
      titleMalayalam: 'സർക്കാർ പദ്ധതികൾ',
      content: 'PM-KISAN subsidy available',
      icon: '🏛️',
      color: 'bg-gradient-sky'
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
          {infoCards.map((card) => (
            <Card key={card.id} className={`${card.color} border-0 shadow-card hover:shadow-warm transition-all duration-300 cursor-pointer`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{card.icon}</div>
                <h3 className="text-sm font-medium text-white mb-1">{card.title}</h3>
                <p className="text-xs text-white/80 font-malayalam mb-2">{card.titleMalayalam}</p>
                <p className="text-xs text-white/90">{card.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card text-card-foreground shadow-card'
              } rounded-2xl p-4`}>
                {message.image && (
                  <img src={message.image} alt="Uploaded" className="w-full rounded-lg mb-2" />
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {message.type === 'assistant' && (
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => provideFeedback(message.id, 'helpful')}
                        className="h-8 w-8 p-0 hover:bg-accent"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => provideFeedback(message.id, 'loved')}
                        className="h-8 w-8 p-0 hover:bg-accent"
                      >
                        <Heart className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => provideFeedback(message.id, 'not-helpful')}
                        className="h-8 w-8 p-0 hover:bg-accent"
                      >
                        <Frown className="h-3 w-3" />
                      </Button>
                    </div>
                    {message.hasAudio && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playAudio(message.id)}
                        className="h-8 w-8 p-0 hover:bg-accent"
                        disabled={isPlaying}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <Card className="shadow-warm">
          <CardContent className="p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="നിങ്ങളുടെ ചോദ്യം എഴുതുക... (Type your question...)"
                  className="resize-none border-0 bg-muted/50 focus:bg-background transition-colors"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-2">
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={toggleRecording}
                      className="gap-2"
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {isRecording ? 'നിർത്തുക' : 'സംസാരിക്കുക'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      ചിത്രം
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-gradient-kerala hover:opacity-90 transition-opacity"
                    disabled={!currentMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
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

        {/* Support section */}
        <div className="mt-6 text-center">
          <Badge variant="secondary" className="mb-2">
            സഹായം വേണ്ടേ? (Need help?)
          </Badge>
          <p className="text-sm text-muted-foreground">
            എനിക്ക് ഉത്തരം അറിയില്ലെങ്കിൽ, നിങ്ങളെ പ്രാദേശിക ഓഫീസറുമായി ബന്ധിപ്പിക്കാം
          </p>
          <p className="text-xs text-muted-foreground">
            If I don't know the answer, I can connect you with a local officer
          </p>
        </div>
      </div>
    </div>
  );
};

export default KrishiOfficer;