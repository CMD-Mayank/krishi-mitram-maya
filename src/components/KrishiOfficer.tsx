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
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
    });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() && !uploadedImage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage || (uploadedImage ? 'Image uploaded for analysis' : ''),
      timestamp: new Date(),
      image: uploadedImage || undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Prepare the payload for Vertex AI
      const payload: any = {
        userPrompt: currentMessage || 'Please analyze this image and provide farming advice in Malayalam and English',
        endpointId: 'YOUR_ENDPOINT_ID', // You'll need to provide this
        projectId: 'YOUR_PROJECT_ID' // You'll need to provide this
      };

      // Add image if uploaded
      if (uploadedImage) {
        // Extract base64 data from the blob URL - this is a simplified approach
        // In a real app, you'd want to store the original base64 from upload
        payload.imageBase64 = uploadedImage.includes('data:') ? uploadedImage.split(',')[1] : uploadedImage;
      }

      // Call the Vertex AI edge function directly
      const response = await fetch('https://dyjrhrdjxeyslokcgnzu.supabase.co/functions/v1/vertex-ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5anJocmRqeGV5c2xva2Nnbnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODUxNTAsImV4cCI6MjA3Mzg2MTE1MH0.k3eQOYZf7-VmfUvTsGp4D4rXcYGbr_t3TN8jCTSIMzg`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: data.message || data.output || 'Response received from AI assistant',
        timestamp: new Date(),
        hasAudio: true
      };

      setMessages(prev => [...prev, aiResponse]);
      
      if (data.status === 'success') {
        toast({
          title: "Response received",
          description: "AI analysis completed successfully",
        });
      }

    } catch (error) {
      console.error('Error calling Vertex AI:', error);
      
      const errorResponse: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'ക്ഷമിക്കണം, ഇപ്പോൾ ഒരു സാങ്കേതിക പ്രശ്നമുണ്ട്. ദയവായി വീണ്ടും ശ്രമിക്കുക. (Sorry, there\'s a technical issue right now. Please try again.)',
        timestamp: new Date(),
        hasAudio: true
      };

      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setUploadedImage(null);
    }
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64Data = await convertImageToBase64(file);
        const imageUrl = URL.createObjectURL(file);
        setUploadedImage(`data:${file.type};base64,${base64Data}`);
        
        toast({
          title: "Image uploaded",
          description: "ചിത്രം അപ്‌ലോഡ് ചെയ്തു. ഇപ്പോൾ സന്ദേശം അയയ്ക്കുക. (Image uploaded. Now send your message.)",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Upload error",
          description: "ചിത്രം അപ്‌ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല (Failed to upload image)",
          variant: "destructive"
        });
      }
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
                    disabled={(!currentMessage.trim() && !uploadedImage) || isLoading}
                  >
                    <Send className={`h-4 w-4 ${(currentMessage.trim() || uploadedImage) && !isLoading ? 'animate-bounce-gentle' : ''}`} />
                    <span className="ml-2 hidden md:inline">
                      {isLoading ? 'അയക്കുന്നു...' : 'അയക്കുക'}
                    </span>
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