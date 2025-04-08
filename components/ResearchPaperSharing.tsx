
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  ThumbsUp, 
  MessageSquare, 
  Share, 
  Bookmark, 
  FileText, 
  BookMarked, 
  Search, 
  PlusCircle, 
  Download, 
  Upload, 
  FileUp
} from "lucide-react";

interface User {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
}

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  fullText?: string;
  author: {
    name: string;
    institution: string;
    avatar?: string;
  };
  publishedDate: string;
  doi: string;
  journal: string;
  category: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  pdfUrl?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: string;
  content: string;
  timestamp: string;
  likes: number;
}

const samplePapers: ResearchPaper[] = [
  {
    id: "paper1",
    title: "Advancements in Cardiovascular Imaging Techniques for Early Disease Detection",
    abstract: "This paper presents novel imaging techniques for early detection of cardiovascular diseases. Using advanced AI algorithms, we demonstrate improved sensitivity and specificity in identifying early markers of atherosclerosis.",
    fullText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel massa eget nunc scelerisque iaculis vel ut diam. Suspendisse potenti. Nullam euismod urna eu eros consectetur, vel dapibus velit ultrices. Donec ac mauris in eros dictum ultrices in ut enim. Nullam faucibus mattis felis, at fermentum leo volutpat id. Sed faucibus turpis vel enim mollis, vel luctus nisl tincidunt. Nullam finibus quam vel enim facilisis, non maximus libero varius. In hac habitasse platea dictumst.\n\nMaecenas congue sapien at nibh tempus, ac convallis dolor dictum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla facilisi. Duis ut mattis lacus. Donec quis purus nec tellus condimentum pellentesque. Ut a enim nec mauris pretium tincidunt. Sed et metus et dui ultricies dictum at vel elit. Nullam ac ipsum quis lorem posuere lobortis vel ac nulla. Sed at venenatis velit.\n\nPraesent in metus eu elit eleifend ultricies. Aenean ac justo id enim aliquet cursus. Cras id eros feugiat, egestas est eu, semper lectus. Sed fermentum tellus at metus facilisis, non consectetur nisi sollicitudin. Donec facilisis vehicula orci, vel fermentum turpis venenatis id. Cras pharetra magna in dignissim fringilla. Praesent vestibulum vel purus eu commodo.",
    author: {
      name: "Dr. Meera Sharma",
      institution: "All India Institute of Medical Sciences",
      avatar: "/avatars/doctor-2.jpg"
    },
    publishedDate: "2023-04-15",
    doi: "10.1234/cardio.2023.0456",
    journal: "Journal of Cardiovascular Imaging",
    category: "Cardiology",
    likes: 123,
    comments: 18,
    isLiked: false,
    isBookmarked: true,
    pdfUrl: "data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PAovRmlsdGVyIC9GbGF0ZURlY29kZQovTGVuZ3RoIDM4Cj4+CnN0cmVhbQp4nCvkMlAwUDC1NNUzMVGwMDHUszRSKOQCABxHBD8KZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9NZWRpYUJveCBbMCAwIDU5NS4yNzYgODQxLjg5XQovUmVzb3VyY2VzIDw8Pj4KL0NvbnRlbnRzIDUgMCBSCi9QYXJlbnQgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyMjEgMDAwMDAgbiAKMDAwMDAwMDE3MiAwMDAwMCBuIAowMDAwMDAwMDAwIDAwMDAwIGYgCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDAwMCAwMDAwMCBuIAowMDAwMDAwMjcwIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNwovUm9vdCAxIDAgUgovSW5mbyA2IDAgUgo+PgpzdGFydHhyZWYKMzgxCiUlRU9GCg=="
  },
  {
    id: "paper2",
    title: "Efficacy of Combined Antibiotic Therapies in Treatment-Resistant Bacterial Infections",
    abstract: "This study evaluates the efficacy of novel combination antibiotic therapies in treating multi-drug resistant bacterial infections. Clinical trials conducted across five major hospitals demonstrate promising results for patients with limited treatment options.",
    author: {
      name: "Dr. Anil Kapoor",
      institution: "Post Graduate Institute of Medical Education and Research",
    },
    publishedDate: "2023-03-10",
    doi: "10.5678/antibio.2023.0123",
    journal: "International Journal of Infectious Diseases",
    category: "Infectious Diseases",
    likes: 87,
    comments: 12,
    isLiked: true,
    isBookmarked: false
  },
  {
    id: "paper3",
    title: "Early Markers for Alzheimer's Disease: A Longitudinal Study of Cognitive Decline",
    abstract: "This longitudinal study identifies early cognitive markers that may predict the onset of Alzheimer's disease. Tracking 500 patients over 10 years, we developed a predictive model that demonstrates 85% accuracy in identifying individuals at high risk for developing the disease.",
    author: {
      name: "Dr. Priya Verma",
      institution: "National Institute of Mental Health and Neurosciences",
    },
    publishedDate: "2023-02-05",
    doi: "10.9012/neuro.2023.7890",
    journal: "Neurology Research Journal",
    category: "Neurology",
    likes: 156,
    comments: 24,
    isLiked: false,
    isBookmarked: true
  },
  {
    id: "paper4",
    title: "Impact of Telemedicine Implementation on Rural Healthcare Access in India",
    abstract: "This paper analyzes the effects of telemedicine programs implemented across rural India between 2020-2022. Results show a 45% increase in access to specialist care and significant improvements in management of chronic conditions in underserved populations.",
    author: {
      name: "Dr. Rajesh Kumar",
      institution: "Christian Medical College, Vellore",
    },
    publishedDate: "2023-01-20",
    doi: "10.3456/telehealth.2023.5678",
    journal: "Digital Health Solutions",
    category: "Healthcare Systems",
    likes: 102,
    comments: 15,
    isLiked: true,
    isBookmarked: false
  },
  {
    id: "paper5",
    title: "Novel Approaches to Cancer Immunotherapy: Targeting Multiple Checkpoint Inhibitors",
    abstract: "This research presents findings from Phase II clinical trials of a novel cancer immunotherapy approach that simultaneously targets multiple immune checkpoint inhibitors. Data suggests significant improvement in treatment response for patients with advanced melanoma and lung cancer.",
    author: {
      name: "Dr. Sunita Patel",
      institution: "Tata Memorial Centre",
    },
    publishedDate: "2022-12-08",
    doi: "10.7890/oncol.2022.4567",
    journal: "Cancer Therapeutics Journal",
    category: "Oncology",
    likes: 198,
    comments: 32,
    isLiked: false,
    isBookmarked: false
  }
];

const sampleComments: Record<string, Comment[]> = {
  "paper1": [
    {
      id: "comment1",
      userId: "user1",
      userName: "Dr. Anil Gupta",
      userAvatar: "/avatars/doctor-3.jpg",
      userRole: "Cardiologist",
      content: "This methodology could revolutionize early detection protocols. I'd be interested to see more specificity data for patients with existing cardiovascular conditions.",
      timestamp: "2023-04-16T14:30:00",
      likes: 8
    },
    {
      id: "comment2",
      userId: "user2",
      userName: "Dr. Priya Shah",
      userRole: "Radiologist",
      content: "Excellent work. How does this compare to current CT angiography in terms of radiation exposure?",
      timestamp: "2023-04-17T09:15:00",
      likes: 5
    },
    {
      id: "comment3",
      userId: "user3",
      userName: "Dr. Rahul Mehta",
      userRole: "Researcher",
      content: "I noticed the AI algorithm was trained primarily on data from South Asian populations. Would you expect similar predictive power in other ethnic groups?",
      timestamp: "2023-04-18T16:45:00",
      likes: 3
    }
  ]
};

interface ResearchPaperSharingProps {
  currentUser: User;
}

const ResearchPaperSharing: React.FC<ResearchPaperSharingProps> = ({ currentUser }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [papers, setPapers] = useState<ResearchPaper[]>(samplePapers);
  const [activePaper, setActivePaper] = useState<ResearchPaper | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>(sampleComments);
  const [newComment, setNewComment] = useState('');
  const [addPaperDialogOpen, setAddPaperDialogOpen] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: '',
    abstract: '',
    category: 'Cardiology',
    journal: '',
    doi: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewMode, setViewMode] = useState<'feed' | 'details' | 'upload'>('feed');

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || paper.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Cardiology', 'Neurology', 'Oncology', 'Infectious Diseases', 'Healthcare Systems', 'Pediatrics', 'Surgery'];

  const handleLikePaper = (paperId: string) => {
    setPapers(papers.map(paper => {
      if (paper.id === paperId) {
        const isLiked = paper.isLiked || false;
        return {
          ...paper,
          likes: isLiked ? paper.likes - 1 : paper.likes + 1,
          isLiked: !isLiked
        };
      }
      return paper;
    }));
    
    toast({
      title: "Paper Liked",
      description: "Your feedback has been recorded",
    });
  };

  const handleBookmarkPaper = (paperId: string) => {
    setPapers(papers.map(paper => {
      if (paper.id === paperId) {
        return {
          ...paper,
          isBookmarked: !(paper.isBookmarked || false)
        };
      }
      return paper;
    }));
    
    toast({
      title: "Paper Bookmarked",
      description: "This paper has been saved to your bookmarks",
    });
  };

  const handleViewPaper = (paper: ResearchPaper) => {
    setActivePaper(paper);
    setViewMode('details');
  };

  const handleSubmitComment = () => {
    if (!activePaper || !newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: `comment${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.specialty,
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    const updatedComments = {
      ...comments,
      [activePaper.id]: [
        ...(comments[activePaper.id] || []),
        newCommentObj
      ]
    };
    
    setComments(updatedComments);
    setNewComment('');
    
    // Update comment count in papers
    setPapers(papers.map(paper => {
      if (paper.id === activePaper.id) {
        return {
          ...paper,
          comments: paper.comments + 1
        };
      }
      return paper;
    }));
    
    toast({
      title: "Comment Posted",
      description: "Your comment has been added to the discussion",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitPaper = () => {
    const newPaperObj: ResearchPaper = {
      id: `paper${Date.now()}`,
      title: newPaper.title,
      abstract: newPaper.abstract,
      author: {
        name: currentUser.name,
        institution: "Your Institution",
        avatar: currentUser.avatar
      },
      publishedDate: new Date().toISOString().split('T')[0],
      doi: newPaper.doi || `10.xxxx/preprint.${Date.now()}`,
      journal: newPaper.journal || "Preprint",
      category: newPaper.category,
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
      pdfUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined
    };
    
    setPapers([newPaperObj, ...papers]);
    setAddPaperDialogOpen(false);
    setNewPaper({
      title: '',
      abstract: '',
      category: 'Cardiology',
      journal: '',
      doi: '',
    });
    setSelectedFile(null);
    
    toast({
      title: "Paper Published",
      description: "Your research paper has been published successfully",
    });
  };

  const handleDownloadPaper = (paper: ResearchPaper) => {
    if (paper.pdfUrl) {
      const link = document.createElement('a');
      link.href = paper.pdfUrl;
      link.download = `${paper.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Downloading Paper",
        description: "The research paper is being downloaded",
      });
    } else {
      toast({
        title: "Download Failed",
        description: "This paper does not have a downloadable PDF version",
        variant: "destructive",
      });
    }
  };

  const renderFeed = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 w-full sm:w-[300px]"
            placeholder="Search research papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button onClick={() => setViewMode('upload')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Upload Paper
          </Button>
        </div>
      </div>

      {filteredPapers.length === 0 ? (
        <div className="text-center py-10">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No papers found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPapers.map(paper => (
            <Card key={paper.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle 
                      className="text-xl hover:text-primary cursor-pointer"
                      onClick={() => handleViewPaper(paper)}
                    >
                      {paper.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{paper.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Published: {paper.publishedDate}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleBookmarkPaper(paper.id)}
                    className={paper.isBookmarked ? "text-primary" : ""}
                  >
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={paper.author.avatar} />
                    <AvatarFallback>{paper.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{paper.author.name}</p>
                    <p className="text-sm text-muted-foreground">{paper.author.institution}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{paper.abstract}</p>
                <div className="mt-2 text-sm flex flex-wrap gap-4">
                  <span className="text-muted-foreground">Journal: {paper.journal}</span>
                  <span className="text-muted-foreground">DOI: {paper.doi}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={paper.isLiked ? "text-primary" : ""}
                    onClick={() => handleLikePaper(paper.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {paper.likes}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewPaper(paper)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {paper.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewPaper(paper)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderPaperDetails = () => {
    if (!activePaper) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setViewMode('feed')}
          >
            ← Back to Research Feed
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleBookmarkPaper(activePaper.id)}
              className={activePaper.isBookmarked ? "text-primary" : ""}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {activePaper.isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            {activePaper.pdfUrl && (
              <Button onClick={() => handleDownloadPaper(activePaper)}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="text-2xl">{activePaper.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{activePaper.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Published: {activePaper.publishedDate}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3 pb-3 border-b">
              <Avatar>
                <AvatarImage src={activePaper.author.avatar} />
                <AvatarFallback>{activePaper.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{activePaper.author.name}</p>
                <p className="text-sm text-muted-foreground">{activePaper.author.institution}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Abstract</h3>
              <p className="text-muted-foreground">{activePaper.abstract}</p>
            </div>
            
            {activePaper.fullText && (
              <div>
                <h3 className="text-lg font-medium mb-2">Full Text</h3>
                <div className="text-muted-foreground whitespace-pre-line">
                  {activePaper.fullText}
                </div>
              </div>
            )}
            
            <div className="pt-3 border-t grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Journal:</p>
                <p className="text-muted-foreground">{activePaper.journal}</p>
              </div>
              <div>
                <p className="font-medium">DOI:</p>
                <p className="text-muted-foreground">{activePaper.doi}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex gap-3">
            <Button 
              variant="ghost" 
              className={activePaper.isLiked ? "text-primary" : ""}
              onClick={() => handleLikePaper(activePaper.id)}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {activePaper.likes} Likes
            </Button>
            <Button variant="ghost">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Discussion ({activePaper.comments})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {comments[activePaper.id]?.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-6">
                    {comments[activePaper.id].map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={comment.userAvatar} />
                          <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                            <div>
                              <span className="font-medium">{comment.userName}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                {comment.userRole}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                          <div className="mt-2">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {comment.likes}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
            
            <div className="mt-6 flex gap-3">
              <Avatar>
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Add to the discussion..."
                  className="resize-none mb-2"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  Post Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderUploadPaper = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => setViewMode('feed')}
        >
          ← Back to Research Feed
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload Research Paper</CardTitle>
          <CardDescription>Share your research with the medical community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Paper Title</label>
              <Input 
                placeholder="Enter the title of your research paper"
                value={newPaper.title}
                onChange={(e) => setNewPaper({...newPaper, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Abstract</label>
              <Textarea 
                placeholder="Enter the abstract of your paper"
                className="min-h-[150px]"
                value={newPaper.abstract}
                onChange={(e) => setNewPaper({...newPaper, abstract: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={newPaper.category}
                  onChange={(e) => setNewPaper({...newPaper, category: e.target.value})}
                >
                  {categories.filter(c => c !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Journal (Optional)</label>
                <Input 
                  placeholder="Journal name if published"
                  value={newPaper.journal}
                  onChange={(e) => setNewPaper({...newPaper, journal: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">DOI (Optional)</label>
              <Input 
                placeholder="Digital Object Identifier if available"
                value={newPaper.doi}
                onChange={(e) => setNewPaper({...newPaper, doi: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Upload PDF</label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your PDF file here, or click to browse
                </p>
                {selectedFile ? (
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Browse Files
                  </Button>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button 
            onClick={handleSubmitPaper}
            disabled={!newPaper.title || !newPaper.abstract}
          >
            <Upload className="h-4 w-4 mr-2" />
            Publish Paper
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Research Paper Sharing</h2>
        <p className="text-muted-foreground">
          Discover, discuss, and share the latest medical research
        </p>
      </div>
      
      {viewMode === 'feed' && renderFeed()}
      {viewMode === 'details' && renderPaperDetails()}
      {viewMode === 'upload' && renderUploadPaper()}
    </div>
  );
};

export default ResearchPaperSharing;
