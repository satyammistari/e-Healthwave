
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Heart, Share2, Send, PlusCircle, ThumbsUp, Clock, AlertCircle, BookmarkPlus, MoreHorizontal, Image as ImageIcon, Paperclip, Smile } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
  specialty?: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  timestamp: Date;
  likes: number;
}

interface Post {
  id: string;
  author: Author;
  content: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  shares: number;
  hasImage: boolean;
  image?: string;
}

// Demo user data
const currentUser = {
  id: "user1",
  name: "Rahul Mehta",
  avatar: "https://ui-avatars.com/api/?name=Rahul+Mehta&background=FF453A&color=fff",
  role: "patient"
};

// Demo posts data
const initialPosts: Post[] = [
  {
    id: "post1",
    author: {
      id: "doctor1",
      name: "Dr. Priya Sharma",
      avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=0A84FF&color=fff",
      role: "doctor",
      specialty: "Cardiologist"
    },
    content: "Heart health tip of the day: Adding 30 minutes of moderate exercise to your daily routine can significantly reduce the risk of heart disease. Simple activities like brisk walking, swimming, or cycling can make a big difference!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 45,
    comments: [
      {
        id: "comment1",
        author: {
          id: "user2",
          name: "Amit Kumar",
          avatar: "https://ui-avatars.com/api/?name=Amit+Kumar&background=30D158&color=fff",
          role: "patient"
        },
        content: "Thank you for the tip, Dr. Sharma! I've started walking every morning and feel much better already.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        likes: 5
      },
      {
        id: "comment2",
        author: {
          id: "doctor2",
          name: "Dr. Rajesh Patel",
          avatar: "https://ui-avatars.com/api/?name=Rajesh+Patel&background=30D158&color=fff",
          role: "doctor",
          specialty: "Neurologist"
        },
        content: "Great advice! I'd also add that consistency is key. Better to walk 20 minutes daily than 1 hour once a week.",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        likes: 8
      }
    ],
    shares: 12,
    hasImage: false
  },
  {
    id: "post2",
    author: {
      id: "user3",
      name: "Meera Singh",
      avatar: "https://ui-avatars.com/api/?name=Meera+Singh&background=FFD60A&color=fff",
      role: "patient"
    },
    content: "I've been suffering from frequent migraines for the past month. Has anyone tried any effective remedies or medications that helped them? Any advice would be appreciated.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    likes: 32,
    comments: [
      {
        id: "comment3",
        author: {
          id: "doctor3",
          name: "Dr. Ananya Singh",
          avatar: "https://ui-avatars.com/api/?name=Ananya+Singh&background=FF9F0A&color=fff",
          role: "doctor",
          specialty: "Neurologist"
        },
        content: "Hi Meera, migraines can be triggered by various factors including stress, certain foods, or sleep patterns. I would recommend keeping a diary to track potential triggers. For immediate relief, try resting in a dark, quiet room and stay hydrated. Please consult with a neurologist for proper diagnosis and treatment.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        likes: 15
      }
    ],
    shares: 8,
    hasImage: false
  },
  {
    id: "post3",
    author: {
      id: "doctor4",
      name: "Dr. Vikram Reddy",
      avatar: "https://ui-avatars.com/api/?name=Vikram+Reddy&background=64D2FF&color=fff",
      role: "doctor",
      specialty: "Dietitian"
    },
    content: "Just published a new article on 'Balanced Diet for Indian Diabetic Patients' with culturally appropriate food recommendations. Check it out for practical tips on managing diabetes while enjoying traditional Indian meals.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    likes: 78,
    comments: [
      {
        id: "comment4",
        author: {
          id: "user4",
          name: "Sunita Gupta",
          avatar: "https://ui-avatars.com/api/?name=Sunita+Gupta&background=FFD60A&color=fff",
          role: "patient"
        },
        content: "This is exactly what I needed! As someone recently diagnosed with type 2 diabetes, I've been struggling to adapt my diet while still enjoying our traditional food.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7),
        likes: 10
      },
      {
        id: "comment5",
        author: {
          id: "doctor1",
          name: "Dr. Priya Sharma",
          avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=0A84FF&color=fff",
          role: "doctor",
          specialty: "Cardiologist"
        },
        content: "Great resource, Dr. Reddy! I'll be sharing this with my patients who have both cardiac and diabetic concerns.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        likes: 12
      }
    ],
    shares: 45,
    hasImage: true,
    image: "https://ui-avatars.com/api/?name=Diabetes+Diet&size=300&background=FF9F0A&color=fff"
  }
];

const SocialFeed: React.FC = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  
  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Handle post creation
  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Empty post",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }
    
    const newPost: Post = {
      id: `post${Date.now()}`,
      author: currentUser,
      content: newPostContent,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      shares: 0,
      hasImage: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setShowNewPostDialog(false);
    
    toast({
      title: "Post created",
      description: "Your post has been published successfully.",
      variant: "default",
    });
  };
  
  // Handle comment creation
  const handleCreateComment = (postId: string) => {
    if (!newCommentContent.trim()) {
      toast({
        description: "Please add some content to your comment.",
        variant: "destructive",
      });
      return;
    }
    
    const newComment: Comment = {
      id: `comment${Date.now()}`,
      author: currentUser,
      content: newCommentContent,
      timestamp: new Date(),
      likes: 0
    };
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    setNewCommentContent("");
    setActiveCommentPostId(null);
    
    toast({
      description: "Your comment has been added.",
    });
  };
  
  // Handle post like
  const handleLikePost = (postId: string) => {
    const isLiked = likedPosts.includes(postId);
    
    if (isLiked) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes - 1
          };
        }
        return post;
      }));
    } else {
      setLikedPosts([...likedPosts, postId]);
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes + 1
          };
        }
        return post;
      }));
      
      toast({
        description: "Post liked",
      });
    }
  };
  
  // Handle save post
  const handleSavePost = (postId: string) => {
    const isSaved = savedPosts.includes(postId);
    
    if (isSaved) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
      toast({
        description: "Post removed from saved",
      });
    } else {
      setSavedPosts([...savedPosts, postId]);
      toast({
        description: "Post saved",
      });
    }
  };
  
  // Handle share post
  const handleSharePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          shares: post.shares + 1
        };
      }
      return post;
    }));
    
    toast({
      title: "Post shared",
      description: "Post has been shared to your timeline.",
    });
  };
  
  // Filter posts based on active tab
  const getFilteredPosts = () => {
    switch (activeTab) {
      case "doctors":
        return posts.filter(post => post.author.role === "doctor");
      case "patients":
        return posts.filter(post => post.author.role === "patient");
      case "saved":
        return posts.filter(post => savedPosts.includes(post.id));
      default:
        return posts;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Feed</h2>
        <Button 
          onClick={() => setShowNewPostDialog(true)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="doctors">From Doctors</TabsTrigger>
          <TabsTrigger value="patients">From Patients</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {getFilteredPosts().length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No posts available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === "saved" 
                    ? "You haven't saved any posts yet." 
                    : "There are no posts in this category."}
                </p>
                {activeTab === "all" && (
                  <Button 
                    className="mt-4"
                    onClick={() => setShowNewPostDialog(true)}
                  >
                    Create Your First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            getFilteredPosts().map(post => (
              <Card key={post.id} className="mb-6">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{post.author.name}</CardTitle>
                          {post.author.role === "doctor" && post.author.specialty && (
                            <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
                              {post.author.specialty}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(post.timestamp)}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap mb-4">{post.content}</p>
                  
                  {post.hasImage && post.image && (
                    <div className="rounded-lg overflow-hidden mb-4 border">
                      <img 
                        src={post.image}
                        alt="Post attachment"
                        className="w-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{post.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{post.comments.length} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="p-0">
                  <div className="grid grid-cols-3 w-full">
                    <Button 
                      variant="ghost" 
                      className={`rounded-none py-2 ${likedPosts.includes(post.id) ? 'text-blue-600' : ''}`}
                      onClick={() => handleLikePost(post.id)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${likedPosts.includes(post.id) ? 'fill-current text-blue-600' : ''}`} />
                      Like
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="rounded-none py-2"
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="rounded-none py-2"
                      onClick={() => handleSharePost(post.id)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardFooter>
                
                {/* Save Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => handleSavePost(post.id)}
                >
                  <BookmarkPlus className={`h-5 w-5 ${savedPosts.includes(post.id) ? 'fill-primary text-primary' : ''}`} />
                </Button>
                
                {/* Comments Section */}
                {(post.comments.length > 0 || activeCommentPostId === post.id) && (
                  <div className="px-4 py-2 border-t bg-muted/20">
                    {post.comments.length > 0 && (
                      <ScrollArea className="max-h-60 pr-4">
                        <div className="space-y-4 py-2">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">{comment.author.name}</span>
                                    {comment.author.role === "doctor" && (
                                      <Badge variant="outline" className="text-xs py-0 h-5">
                                        Dr
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                  <span>{formatDate(comment.timestamp)}</span>
                                  <button className="hover:text-primary">Like ({comment.likes})</button>
                                  <button className="hover:text-primary">Reply</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                    
                    {activeCommentPostId === post.id && (
                      <div className="flex items-start gap-3 pt-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex">
                          <Input
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-muted/50 border-0 focus-visible:ring-1"
                          />
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="ml-2"
                            onClick={() => handleCreateComment(post.id)}
                            disabled={!newCommentContent.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Post Dialog */}
      <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share your health query, tip, or experience with the community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentUser.name}</p>
                <Badge variant="outline" className="text-xs py-0 h-5">
                  {currentUser.role === "doctor" ? "Doctor" : "Patient"}
                </Badge>
              </div>
            </div>
            
            <Textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[120px]"
            />
            
            <div className="flex justify-between items-center bg-muted/20 rounded-lg p-2">
              <span className="text-sm font-medium">Add to your post</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ImageIcon className="h-4 w-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4 text-blue-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4 text-amber-500" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNewPostDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePost}
              disabled={!newPostContent.trim()}
            >
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialFeed;
