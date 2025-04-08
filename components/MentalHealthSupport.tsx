import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Music, Play, Pause, SkipForward, SkipBack, Volume2, Volume1, VolumeX, Bookmark, ThumbsUp, MessageSquare, Calendar, Clock, Info, PlayCircle, Star, PlusCircle, Smile, Frown, Meh, Phone, PhoneCall } from 'lucide-react';

// Music data
const musicData = [
  {
    id: 1,
    title: "Morning Meditation",
    artist: "Healing Sounds",
    duration: "5:32",
    imageUrl: "https://ui-avatars.com/api/?name=Morning+Meditation&background=gradient",
    youtubeId: "qzQoWUzYkxs",
    tags: ["meditation", "morning", "peaceful"]
  },
  {
    id: 2,
    title: "Deep Sleep Waves",
    artist: "Nature Sounds",
    duration: "8:15",
    imageUrl: "https://ui-avatars.com/api/?name=Deep+Sleep&background=gradient",
    youtubeId: "EHytp9jOzQY",
    tags: ["sleep", "waves", "night"]
  },
  {
    id: 3,
    title: "Anxiety Relief",
    artist: "Calm Mind",
    duration: "10:05",
    imageUrl: "https://ui-avatars.com/api/?name=Anxiety+Relief&background=gradient",
    youtubeId: "tEmt1Znux58",
    tags: ["anxiety", "relief", "breathing"]
  },
  {
    id: 4,
    title: "Focus & Concentration",
    artist: "Study Music",
    duration: "25:40",
    imageUrl: "https://ui-avatars.com/api/?name=Focus+Music&background=gradient",
    youtubeId: "WHqXHFvIyhI",
    tags: ["focus", "study", "concentration"]
  },
  {
    id: 5,
    title: "Nature Sounds",
    artist: "Peaceful Ambience",
    duration: "15:22",
    imageUrl: "https://ui-avatars.com/api/?name=Nature+Sounds&background=gradient",
    youtubeId: "eKFTSSKCzWA",
    tags: ["nature", "birds", "forest"]
  },
  {
    id: 6,
    title: "Stress Relief",
    artist: "Calm Therapy",
    duration: "12:18",
    imageUrl: "https://ui-avatars.com/api/?name=Stress+Relief&background=gradient",
    youtubeId: "lFcSrYw-ARY",
    tags: ["stress", "relief", "calm"]
  }
];

// Spotify playlists
const spotifyPlaylists = [
  {
    id: "spotify:playlist:37i9dQZF1DX3Ogo9pFvBkY",
    title: "Ambient Relaxation",
    description: "Calming ambient tracks to help you unwind and relax",
    imageUrl: "https://ui-avatars.com/api/?name=Ambient+Relaxation&background=gradient",
    tracks: 45,
    duration: "3hr 15min"
  },
  {
    id: "spotify:playlist:37i9dQZF1DWZqd5JICZI0u",
    title: "Peaceful Piano",
    description: "Peaceful piano to help you slow down, breathe, and relax",
    imageUrl: "https://ui-avatars.com/api/?name=Peaceful+Piano&background=gradient",
    tracks: 87,
    duration: "4hr 32min"
  },
  {
    id: "spotify:playlist:37i9dQZF1DZ06evO05tE88",
    title: "Meditation Moments",
    description: "Guided meditations and relaxing sounds for your daily practice",
    imageUrl: "https://ui-avatars.com/api/?name=Meditation+Moments&background=gradient",
    tracks: 28,
    duration: "2hr 45min"
  }
];

// Therapists data
const therapists = [
  {
    id: 1,
    name: "Dr. Maya Sharma",
    specialization: "Anxiety & Depression",
    experience: "12 years",
    imageUrl: "https://ui-avatars.com/api/?name=Maya+Sharma&background=0A84FF&color=fff",
    availability: "Available Today",
    rating: 4.8
  },
  {
    id: 2,
    name: "Dr. Rahul Verma",
    specialization: "Stress Management",
    experience: "8 years",
    imageUrl: "https://ui-avatars.com/api/?name=Rahul+Verma&background=30D158&color=fff",
    availability: "Available Tomorrow",
    rating: 4.7
  },
  {
    id: 3,
    name: "Dr. Priya Kapoor",
    specialization: "Mindfulness & CBT",
    experience: "15 years",
    imageUrl: "https://ui-avatars.com/api/?name=Priya+Kapoor&background=FF453A&color=fff",
    availability: "Available Today",
    rating: 4.9
  }
];

// Mood tracker data
const moodOptions = [
  { value: "happy", label: "Happy", icon: <Smile className="h-6 w-6 text-yellow-500" /> },
  { value: "neutral", label: "Neutral", icon: <Meh className="h-6 w-6 text-blue-500" /> },
  { value: "sad", label: "Sad", icon: <Frown className="h-6 w-6 text-purple-500" /> },
  { value: "anxious", label: "Anxious", icon: <Frown className="h-6 w-6 text-red-500" /> },
  { value: "energetic", label: "Energetic", icon: <Smile className="h-6 w-6 text-green-500" /> }
];

const MentalHealthSupport = () => {
  const { toast } = useToast();
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTab, setSelectedTab] = useState("music");
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [savedTracks, setSavedTracks] = useState<number[]>([]);
  const audioRef = useRef<HTMLIFrameElement>(null);

  // Handle track selection
  const handlePlayTrack = (trackId: number) => {
    setCurrentTrack(trackId);
    setIsPlaying(true);
    
    toast({
      title: "Now playing",
      description: `${musicData.find(track => track.id === trackId)?.title}`,
      variant: "default",
    });
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  // Save/bookmark track
  const saveTrack = (trackId: number) => {
    if (savedTracks.includes(trackId)) {
      setSavedTracks(savedTracks.filter(id => id !== trackId));
      toast({
        description: "Removed from your saved tracks",
        variant: "default",
      });
    } else {
      setSavedTracks([...savedTracks, trackId]);
      toast({
        description: "Added to your saved tracks",
        variant: "default",
      });
    }
  };

  // Record mood
  const recordMood = (mood: string) => {
    setTodayMood(mood);
    toast({
      title: "Mood recorded",
      description: `You're feeling ${mood} today. Thanks for sharing!`,
      variant: "default",
    });
  };

  // Open Spotify playlist
  const openSpotifyPlaylist = (playlistId: string) => {
    window.open(`https://open.spotify.com/embed/playlist/${playlistId.split(':').pop()}`, '_blank');
    toast({
      description: "Opening Spotify playlist",
      variant: "default",
    });
  };

  // Book therapist appointment
  const bookTherapist = (therapistId: number) => {
    toast({
      title: "Appointment Requested",
      description: `Your appointment with ${therapists.find(t => t.id === therapistId)?.name} has been requested.`,
      variant: "default",
    });
  };

  // Get current track
  const getCurrentTrack = () => {
    return currentTrack ? musicData.find(track => track.id === currentTrack) : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mental Health Support</h2>
        <Button 
          onClick={() => setSelectedTab("therapy")}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Heart className="h-4 w-4 mr-2" />
          Talk to a Therapist
        </Button>
      </div>
      
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">How are you feeling today?</h3>
            <p className="text-muted-foreground">Tracking your mood helps us recommend the right content for you</p>
            
            <div className="flex flex-wrap gap-3 pt-3">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  variant={todayMood === mood.value ? "default" : "outline"}
                  className="flex flex-col items-center px-6 py-4 h-auto gap-2"
                  onClick={() => recordMood(mood.value)}
                >
                  {mood.icon}
                  <span>{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="music">Music Therapy</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="therapy">Talk Therapy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="music" className="space-y-6">
          {/* Current Playing Track */}
          {currentTrack && (
            <Card className="bg-secondary/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden">
                    <img 
                      src={getCurrentTrack()?.imageUrl} 
                      alt={getCurrentTrack()?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{getCurrentTrack()?.title}</h3>
                    <p className="text-sm text-muted-foreground">{getCurrentTrack()?.artist}</p>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setCurrentTrack(prev => prev ? (prev > 1 ? prev - 1 : musicData.length) : 1)}
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setCurrentTrack(prev => prev ? (prev < musicData.length ? prev + 1 : 1) : 1)}
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {volume === 0 ? (
                          <VolumeX className="h-4 w-4 text-muted-foreground" />
                        ) : volume < 50 ? (
                          <Volume1 className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Slider
                          value={[volume]}
                          min={0}
                          max={100}
                          step={1}
                          className="w-24"
                          onValueChange={handleVolumeChange}
                        />
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 ml-auto"
                        onClick={() => saveTrack(currentTrack)}
                      >
                        <Bookmark className={`h-4 w-4 ${
                          savedTracks.includes(currentTrack) ? 'fill-primary text-primary' : ''
                        }`} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* YouTube Player */}
                <div className="mt-4 w-full aspect-video rounded-md overflow-hidden">
                  {isPlaying && currentTrack && (
                    <iframe
                      ref={audioRef}
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getCurrentTrack()?.youtubeId}?autoplay=1&controls=1&rel=0`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Track List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {musicData.map((track) => (
              <Card 
                key={track.id} 
                className={`hover:shadow-md transition-all ${
                  currentTrack === track.id ? 'border-primary' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden group">
                      <img 
                        src={track.imageUrl} 
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 text-white"
                          onClick={() => handlePlayTrack(track.id)}
                        >
                          {currentTrack === track.id && isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                      <p className="text-xs text-muted-foreground mt-1">{track.duration}</p>
                      
                      <div className="flex items-center gap-1 mt-2">
                        {track.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => saveTrack(track.id)}
                    >
                      <Bookmark className={`h-4 w-4 ${
                        savedTracks.includes(track.id) ? 'fill-primary text-primary' : ''
                      }`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Spotify Playlists */}
          <h3 className="text-xl font-semibold mt-8 mb-4">Spotify Playlists</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spotifyPlaylists.map((playlist) => (
              <Card key={playlist.id} className="hover:shadow-md transition-all">
                <CardContent className="p-0">
                  <div className="h-40 bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={playlist.imageUrl} 
                      alt={playlist.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{playlist.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{playlist.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{playlist.tracks} tracks</span>
                      <span>{playlist.duration}</span>
                    </div>
                    <Button 
                      className="w-full mt-3"
                      onClick={() => openSpotifyPlaylist(playlist.id)}
                    >
                      <Music className="h-4 w-4 mr-2" />
                      Open in Spotify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="meditation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guided Meditation</CardTitle>
              <CardDescription>
                Follow these guided meditation sessions to reduce stress and improve focus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {musicData.filter(track => track.tags.includes('meditation')).map((meditation) => (
                  <Card key={meditation.id} className="overflow-hidden">
                    <div className="relative h-40 bg-muted">
                      <img 
                        src={meditation.imageUrl} 
                        alt={meditation.title}
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80"
                        onClick={() => handlePlayTrack(meditation.id)}
                      >
                        <PlayCircle className="h-6 w-6 text-primary" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{meditation.title}</h3>
                      <p className="text-sm text-muted-foreground">{meditation.duration}</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs text-muted-foreground ml-2">4.0 (120 ratings)</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-secondary/10 p-4">
                <h3 className="font-semibold">Daily Meditation Challenge</h3>
                <p className="text-sm text-muted-foreground mb-2">Complete 7 days of meditation to earn rewards</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                        i < 3 ? 'bg-primary text-white' : 'bg-secondary'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <Progress value={42} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">3/7 days completed</p>
              </Card>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Breathing Exercises</CardTitle>
              <CardDescription>
                Simple breathing techniques to manage stress and anxiety
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="font-medium">4-7-8 Breathing</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds
                    </p>
                    <Button onClick={() => toast({ description: "Breathing exercise started" })}>
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="font-medium">Box Breathing</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Inhale, hold, exhale, and hold again for equal counts of 4
                    </p>
                    <Button onClick={() => toast({ description: "Breathing exercise started" })}>
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="therapy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find a Therapist</CardTitle>
              <CardDescription>
                Connect with licensed mental health professionals for personalized support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {therapists.map((therapist) => (
                  <Card key={therapist.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-3">
                          <AvatarImage src={therapist.imageUrl} alt={therapist.name} />
                          <AvatarFallback>{therapist.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium">{therapist.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {therapist.specialization}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {therapist.experience} experience
                        </p>
                        <div className="flex items-center mb-3">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm ml-1">{therapist.rating}</span>
                        </div>
                        <Badge className="mb-3 bg-green-50 text-green-600 border-green-200">
                          {therapist.availability}
                        </Badge>
                        <Button 
                          variant="outline" 
                          className="w-full text-primary border-primary/20"
                          onClick={() => bookTherapist(therapist.id)}
                        >
                          Book Appointment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Self-Help Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Understanding Anxiety</h4>
                    <p className="text-sm text-muted-foreground">
                      Learn about the causes, symptoms, and management techniques
                    </p>
                    <Button variant="link" className="px-0 h-auto text-primary">
                      Read More
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Mindfulness Practices</h4>
                    <p className="text-sm text-muted-foreground">
                      Simple mindfulness exercises you can incorporate into daily life
                    </p>
                    <Button variant="link" className="px-0 h-auto text-primary">
                      Read More
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Sleep Hygiene</h4>
                    <p className="text-sm text-muted-foreground">
                      Tips for getting better sleep and improving your mental health
                    </p>
                    <Button variant="link" className="px-0 h-auto text-primary">
                      Read More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Mental Wellness Webinars</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Stress Management in Daily Life</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>May 25, 2023</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>6:00 PM</span>
                      </div>
                    </div>
                    <Badge>Free</Badge>
                  </div>
                  <Button className="mt-3 w-full" onClick={() => toast({ description: "Registered for webinar" })}>
                    Register
                  </Button>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Building Emotional Resilience</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>June 10, 2023</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>5:30 PM</span>
                      </div>
                    </div>
                    <Badge>Free</Badge>
                  </div>
                  <Button className="mt-3 w-full" onClick={() => toast({ description: "Registered for webinar" })}>
                    Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>24/7 Crisis Support</CardTitle>
              <CardDescription>
                If you're experiencing a mental health crisis, please reach out to these resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="justify-start h-auto py-4" variant="outline">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <Phone className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">National Helpline</p>
                      <p className="text-sm text-muted-foreground">1800-599-0019</p>
                    </div>
                  </div>
                </Button>
                
                <Button className="justify-start h-auto py-4" variant="outline">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Crisis Text Line</p>
                      <p className="text-sm text-muted-foreground">Text HOME to 741741</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentalHealthSupport;
