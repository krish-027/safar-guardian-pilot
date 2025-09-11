import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Globe, Bell, Shield, Code } from 'lucide-react';
import { readData, updateSettings, toggleDeveloperMode, runDemoScript } from '@/lib/storageHelper';
import { useToast } from '@/hooks/use-toast';

const TouristSettings = () => {
  const { toast } = useToast();
  const data = readData();
  const { settings } = data;

  const handleLanguageChange = (language: 'en' | 'hi') => {
    updateSettings({ language });
    toast({
      title: 'Language Updated',
      description: `Language changed to ${language === 'en' ? 'English' : 'Hindi'}`,
    });
  };

  const handleNotificationToggle = (notifications: boolean) => {
    updateSettings({ notifications });
    toast({
      title: notifications ? 'Notifications Enabled' : 'Notifications Disabled',
      description: notifications 
        ? 'You will receive safety alerts and updates' 
        : 'Notifications have been turned off',
    });
  };

  const handleLocationToggle = (shareLocation: boolean) => {
    updateSettings({ shareLocation });
    toast({
      title: shareLocation ? 'Location Sharing Enabled' : 'Location Sharing Disabled',
      description: shareLocation 
        ? 'Your location will be shared for safety monitoring' 
        : 'Location sharing has been disabled',
      variant: shareLocation ? 'default' : 'destructive'
    });
  };

  const handleDeveloperModeToggle = () => {
    const newMode = toggleDeveloperMode();
    toast({
      title: newMode ? 'Developer Mode Enabled' : 'Developer Mode Disabled',
      description: newMode 
        ? 'Debug features are now visible' 
        : 'Debug features are now hidden',
    });
    // Force re-render
    window.location.reload();
  };

  const handleRunDemoScript = async () => {
    try {
      await runDemoScript();
      toast({
        title: 'Demo Script Executed',
        description: 'Check the console and alerts page for demo events',
      });
    } catch (error) {
      toast({
        title: 'Demo Script Failed',
        description: 'Failed to run demo script',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your Smart Safar preferences and privacy settings</p>
      </div>

      <div className="grid gap-6">
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Choose your preferred language for the interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Interface Language</p>
                <p className="text-sm text-muted-foreground">Select your preferred language</p>
              </div>
              <Select value={settings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Control how you receive safety alerts and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Safety Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts for geofence violations and emergencies</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={handleNotificationToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Safety
            </CardTitle>
            <CardDescription>
              Manage your location sharing and privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Share Location</p>
                <p className="text-sm text-muted-foreground">
                  Allow real-time location sharing for safety monitoring
                </p>
                {!settings.shareLocation && (
                  <Badge variant="destructive" className="mt-1">Location sharing disabled</Badge>
                )}
              </div>
              <Switch
                checked={settings.shareLocation}
                onCheckedChange={handleLocationToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Developer Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Developer Mode
              {settings.developerMode && <Badge variant="secondary">Active</Badge>}
            </CardTitle>
            <CardDescription>
              Enable debug features and advanced controls for development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Developer Features</p>
                  <p className="text-sm text-muted-foreground">Show debug panels and advanced options</p>
                </div>
                <Switch
                  checked={settings.developerMode}
                  onCheckedChange={handleDeveloperModeToggle}
                />
              </div>

              {/* Developer-only controls */}
              {settings.developerMode && (
                <div className="dev-only border-t pt-4 space-y-3">
                  <h4 className="font-medium text-sm">Debug Controls</h4>
                  <div className="grid gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRunDemoScript}
                      className="justify-start"
                    >
                      Run Demo Script
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('storage-update'));
                        toast({ title: 'Officer Refresh Forced', description: 'Storage update event dispatched' });
                      }}
                      className="justify-start"
                    >
                      Force Officer Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('Current smartSafarData:', readData());
                        toast({ title: 'Data Logged', description: 'Check browser console for data dump' });
                      }}
                      className="justify-start"
                    >
                      Log Storage Data
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TouristSettings;