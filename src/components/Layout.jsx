import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, User, MapPin, AlertTriangle } from 'lucide-react';
import { initializeData } from '@/lib/mockData';

const Layout = () => {
  const [currentView, setCurrentView] = useState('tourist');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initializeData();
    
    // Determine current view from path
    if (location.pathname.startsWith('/officer')) {
      setCurrentView('officer');
    } else {
      setCurrentView('tourist');
    }
  }, [location.pathname]);

  const switchView = (view) => {
    setCurrentView(view);
    if (view === 'tourist') {
      navigate('/');
    } else {
      navigate('/officer');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Smart Safar</h1>
                <p className="text-sm text-muted-foreground">Tourist Safety Management System</p>
              </div>
            </div>
            
            {/* View Switcher */}
            <div className="flex items-center space-x-2 p-1 bg-muted rounded-lg">
              <Button
                variant={currentView === 'tourist' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchView('tourist')}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Tourist View</span>
              </Button>
              <Button
                variant={currentView === 'officer' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchView('officer')}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Officer Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {currentView === 'tourist' && (
        <nav className="border-b bg-card">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8">
              <Button
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                onClick={() => navigate('/')}
                className="rounded-none border-b-2 border-transparent py-4 px-0"
              >
                <User className="h-4 w-4 mr-2" />
                Digital ID
              </Button>
              <Button
                variant={location.pathname === '/map' ? 'default' : 'ghost'}
                onClick={() => navigate('/map')}
                className="rounded-none border-b-2 border-transparent py-4 px-0"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Map & Safety
              </Button>
              <Button
                variant={location.pathname === '/alerts' ? 'default' : 'ghost'}
                onClick={() => navigate('/alerts')}
                className="rounded-none border-b-2 border-transparent py-4 px-0"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Alerts
              </Button>
            </div>
          </div>
        </nav>
      )}

      {currentView === 'officer' && (
        <nav className="border-b bg-card">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8">
              <Button
                variant={location.pathname === '/officer' ? 'default' : 'ghost'}
                onClick={() => navigate('/officer')}
                className="rounded-none border-b-2 border-transparent py-4 px-4"
              >
                <Shield className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;