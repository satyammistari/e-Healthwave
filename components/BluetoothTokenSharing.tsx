
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useDeviceSharing } from "@/hooks/use-device-sharing";
import { BluetoothTokenService, BluetoothToken } from "@/utils/bluetoothTokenService";
import { Bluetooth, Shield, Clock, Copy, RefreshCw, Smartphone, Check, X, Info, Timer } from 'lucide-react';

interface BluetoothTokenSharingProps {
  patientId: string;
  patientName: string;
}

const BluetoothTokenSharing: React.FC<BluetoothTokenSharingProps> = ({ patientId, patientName }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTokens, setActiveTokens] = useState<BluetoothToken[]>([]);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [currentToken, setCurrentToken] = useState<BluetoothToken | null>(null);
  const [tokenValidity, setTokenValidity] = useState<number>(30);
  const [accessLevel, setAccessLevel] = useState<'read' | 'write'>('read');
  const [dataScope, setDataScope] = useState<'full' | 'limited' | 'emergency'>('limited');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { 
    isBluetoothAvailable,
    shareViaBluetooth,
    bluetoothDevices,
    scanForBluetoothDevices
  } = useDeviceSharing({
    onShareSuccess: (method) => {
      console.log(`Successfully shared via ${method}`);
      toast({
        title: "Sharing Successful",
        description: `Health records shared via ${method} with token authentication`,
      });
    }
  });
  
  // Load active tokens when component mounts
  useEffect(() => {
    loadActiveTokens();
  }, [patientId]);
  
  // Load active tokens
  const loadActiveTokens = () => {
    const tokens = BluetoothTokenService.getActiveTokens(patientId);
    setActiveTokens(tokens);
  };
  
  // Generate a new token
  const handleGenerateToken = () => {
    setIsGenerating(true);
    
    try {
      const newToken = BluetoothTokenService.generateToken(
        patientId,
        tokenValidity,
        accessLevel,
        dataScope
      );
      
      setCurrentToken(newToken);
      setShowTokenDialog(true);
      loadActiveTokens();
      
      toast({
        title: "Token Generated",
        description: "Your Bluetooth sharing token has been created",
      });
    } catch (error) {
      toast({
        title: "Token Generation Failed",
        description: "Failed to generate sharing token",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Revoke a token
  const handleRevokeToken = (tokenId: string) => {
    try {
      const revoked = BluetoothTokenService.revokeToken(tokenId);
      
      if (revoked) {
        loadActiveTokens();
        toast({
          title: "Token Revoked",
          description: "The sharing token has been revoked",
        });
      }
    } catch (error) {
      toast({
        title: "Revocation Failed",
        description: "Failed to revoke token",
        variant: "destructive"
      });
    }
  };
  
  // Revoke all tokens
  const handleRevokeAllTokens = () => {
    try {
      const count = BluetoothTokenService.revokeAllTokens(patientId);
      
      loadActiveTokens();
      toast({
        title: "Tokens Revoked",
        description: `${count} sharing tokens have been revoked`,
      });
    } catch (error) {
      toast({
        title: "Revocation Failed",
        description: "Failed to revoke tokens",
        variant: "destructive"
      });
    }
  };
  
  // Copy token to clipboard
  const copyTokenToClipboard = () => {
    if (currentToken) {
      const formattedToken = BluetoothTokenService.formatTokenForDisplay(currentToken);
      navigator.clipboard.writeText(formattedToken);
      toast({
        title: "Copied to Clipboard",
        description: "Token copied to clipboard",
      });
    }
  };
  
  // Format expiry time
  const formatExpiryTime = (expiresAt: number) => {
    const now = Date.now();
    const remainingMs = expiresAt - now;
    
    if (remainingMs <= 0) {
      return "Expired";
    }
    
    const remainingMins = Math.ceil(remainingMs / (1000 * 60));
    
    if (remainingMins < 60) {
      return `${remainingMins} minute${remainingMins !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(remainingMins / 60);
    const mins = remainingMins % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
  };
  
  // Get badge color based on token scope
  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'full': return "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500";
      case 'limited': return "bg-green-500/10 hover:bg-green-500/20 text-green-500";
      case 'emergency': return "bg-red-500/10 hover:bg-red-500/20 text-red-500";
      default: return "";
    }
  };
  
  // Simulate Bluetooth sharing with a token
  const handleBluetoothShare = async () => {
    if (!currentToken) return;
    
    setIsConnecting(true);
    
    try {
      // In a real implementation, the token would be verified by the recipient
      // and would enable secure Bluetooth data transfer
      
      // Share via Bluetooth using our existing hook
      const result = await shareViaBluetooth(
        patientId, 
        patientName,
        true,
        tokenValidity
      );
      
      if (result) {
        // Mark token as used
        BluetoothTokenService.useToken(currentToken.tokenId, "provider_test");
        loadActiveTokens();
        
        setShowTokenDialog(false);
        toast({
          title: "Shared Successfully",
          description: "Records shared via Bluetooth with token authentication",
        });
      }
    } catch (error) {
      toast({
        title: "Sharing Failed",
        description: "Failed to share records via Bluetooth",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bluetooth className="mr-2 h-5 w-5" />
          Token-Based Bluetooth Sharing
        </CardTitle>
        <CardDescription>
          Generate secure tokens for sharing health records via Bluetooth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-500/10 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>Secure Sharing</AlertTitle>
          <AlertDescription>
            Generate a token to securely share your health records with healthcare providers via Bluetooth.
            The recipient will need to enter this token to access your records.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="token-validity">Token Validity</Label>
              <Select value={tokenValidity.toString()} onValueChange={(value) => setTokenValidity(parseInt(value))}>
                <SelectTrigger id="token-validity">
                  <SelectValue placeholder="Select validity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="1440">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="access-level">Access Level</Label>
              <Select value={accessLevel} onValueChange={(value) => setAccessLevel(value as 'read' | 'write')}>
                <SelectTrigger id="access-level">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read Only</SelectItem>
                  <SelectItem value="write">Read & Write</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data-scope">Data Scope</Label>
              <Select value={dataScope} onValueChange={(value) => setDataScope(value as 'full' | 'limited' | 'emergency')}>
                <SelectTrigger id="data-scope">
                  <SelectValue placeholder="Select data scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limited">Limited (Basic Info)</SelectItem>
                  <SelectItem value="full">Full Records</SelectItem>
                  <SelectItem value="emergency">Emergency Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateToken} 
            disabled={isGenerating || !isBluetoothAvailable}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Sharing Token"}
          </Button>
          
          {!isBluetoothAvailable && (
            <p className="text-xs text-destructive text-center">
              Bluetooth is not available on this device
            </p>
          )}
        </div>
        
        {activeTokens.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Active Tokens</h3>
              {activeTokens.length > 1 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRevokeAllTokens}
                >
                  Revoke All
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {activeTokens.map((token) => (
                <div key={token.tokenId} className="flex items-center justify-between border rounded-md p-3">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="font-mono text-xs">
                        {BluetoothTokenService.formatTokenForDisplay(token)}
                      </span>
                      <Badge variant="outline" className={`ml-2 ${getScopeColor(token.dataScope)}`}>
                        {token.dataScope}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Expires in {formatExpiryTime(token.expiresAt)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRevokeToken(token.tokenId)}
                    title="Revoke token"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Token Display Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Sharing Token</DialogTitle>
            <DialogDescription>
              Share this token with a healthcare provider to give them secure access to your health records.
            </DialogDescription>
          </DialogHeader>
          {currentToken && (
            <div className="py-6">
              <div className="bg-muted p-4 rounded-lg text-center w-full mb-4">
                <h3 className="font-mono text-xl tracking-wider font-bold">
                  {BluetoothTokenService.formatTokenForDisplay(currentToken)}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span>Valid for {tokenValidity} minutes</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="border rounded-md p-2 text-center">
                  <div className="text-xs text-muted-foreground">Access Level</div>
                  <div className="font-medium">
                    {accessLevel === 'read' ? 'Read Only' : 'Read & Write'}
                  </div>
                </div>
                <div className="border rounded-md p-2 text-center">
                  <div className="text-xs text-muted-foreground">Data Scope</div>
                  <div className="font-medium">
                    {dataScope === 'full' ? 'Full Records' : 
                     dataScope === 'limited' ? 'Limited Info' : 'Emergency Only'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={copyTokenToClipboard}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Token
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={handleBluetoothShare}
                  disabled={isConnecting}
                >
                  <Bluetooth className="h-4 w-4 mr-2" />
                  {isConnecting ? "Connecting..." : "Share via Bluetooth"}
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowTokenDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BluetoothTokenSharing;
