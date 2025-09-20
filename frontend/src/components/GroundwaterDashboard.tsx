import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Droplets, TrendingUp, TrendingDown, AlertTriangle, MapPin, Search, Filter, Navigation, Clock, Satellite } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/theme-provider"; // ✅ import theme context
import Header from "@/components/ui/header";
import HistoryViewer from "@/components/HistoryViewer";
import ForecastViewer from "@/components/ForecastViewer";

// import { AIAssistant } from "@/components/ai-assistant/AIAssistant";

const mockWaterLevelData = [
  { date: '2024-01', level: 15.2, recharge: 2.1 },
  { date: '2024-02', level: 14.8, recharge: 1.8 },
  { date: '2024-03', level: 16.5, recharge: 3.2 },
  { date: '2024-04', level: 18.2, recharge: 4.5 },
  { date: '2024-05', level: 17.9, recharge: 3.8 },
  { date: '2024-06', level: 16.1, recharge: 2.4 },
];

const mockStations = [
  { id: 'DWLR001', location: 'Gujarat - Ahmedabad', level: 15.2, status: 'normal', trend: 'up' as const, distance: 2.5, lat: 23.0225, lng: 72.5714 },
  { id: 'DWLR002', location: 'Maharashtra - Pune', level: 8.4, status: 'low', trend: 'down' as const, distance: 5.8, lat: 18.5204, lng: 73.8567 },
  { id: 'DWLR003', location: 'Tamil Nadu - Chennai', level: 22.1, status: 'high', trend: 'up' as const, distance: 12.3, lat: 13.0827, lng: 80.2707 },
  { id: 'DWLR004', location: 'Rajasthan - Jaipur', level: 6.2, status: 'critical', trend: 'down' as const, distance: 8.1, lat: 26.9124, lng: 75.7873 },
  { id: 'DWLR005', location: 'Your Area - Local Station', level: 18.7, status: 'normal', trend: 'up' as const, distance: 0.8, lat: 19.0760, lng: 72.8777 },
];

const mockNearbyStations = [
  { id: 'DWLR005', location: 'Haryana-Kurukshetra', level: 18.7, status: 'normal', trend: 'up' as const, distance: 0.8 },
  { id: 'DWLR001', location: 'Gujarat - Ahmedabad', level: 15.2, status: 'normal', trend: 'up' as const, distance: 2.5 },
  { id: 'DWLR002', location: 'Maharashtra - Pune', level: 8.4, status: 'low', trend: 'down' as const, distance: 5.8 },
];

const mockLocationData = {
  currentLevel: 18.7,
  lastUpdated: '2 minutes ago',
  coordinates: '19.0760°N, 72.8777°E',
  altitude: 14,
  nearestStation: 'DWLR005',
  airQuality: 'Good',
  temperature: 28,
  humidity: 72
};

interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  trend: 'up' | 'down';
  status: string;
}

const StatsCard = ({ icon: Icon, title, value, trend, status }: StatsCardProps) => (
  <Card className="border-0 shadow-[0_4px_12px_-2px_hsl(210_85%_35%/0.1)] bg-gradient-to-br from-card to-muted/30">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-critical" />
          )}
          <Badge variant={status === 'critical' ? 'destructive' : status === 'low' ? 'secondary' : 'default'}>
            {status}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface StationCardProps {
  station: {
    id: string;
    location: string;
    level: number;
    status: string;
    trend: 'up' | 'down';
  };
}

const StationCard = ({ station }: StationCardProps) => (
  <Card className="border-0 shadow-[0_4px_12px_-2px_hsl(210_85%_35%/0.1)] hover:shadow-[0_8px_25px_-5px_hsl(210_85%_35%/0.15)] transition-all duration-200">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{station.id}</span>
        </div>
        <Badge 
          variant={
            station.status === 'critical' ? 'destructive' : 
            station.status === 'low' ? 'secondary' : 
            'default'
          }
        >
          {station.status}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{station.location}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{station.level}m</span>
        {station.trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-success" />
        ) : (
          <TrendingDown className="h-4 w-4 text-critical" />
        )}
      </div>
    </CardContent>
  </Card>
);
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function GroundwaterDashboard() {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationData, setLocationData] = useState<any>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { theme } = useTheme(); // ✅ detect current theme

  // Pick colors based on theme
  const chartStroke = theme === "dark" ? "#ffffff" : "#FFD700"; // white in dark, yellow in light
  const chartFill   = theme === "dark" ? "rgba(255, 255, 255, 0.71)" : "rgba(253, 216, 6, 0.65)"; 
  const tooltipText = theme === "dark" ? "#ffffff" : "#000000";
  useEffect(() => {
    // Auto-update timestamp every minute
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const requestLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        setUserLocation({ lat: userLat, lng: userLon });
        setLocationPermission("granted");

        // Fetch real stations from backend
        const res = await fetch("http://127.0.0.1:8000/stations");
        const { stations } = await res.json();

        // Find nearest
        let nearest = stations[0];
        let minDist = Infinity;
        stations.forEach((s: any) => {
          const dist = haversine(userLat, userLon, s.lat, s.lon);
          if (dist < minDist) {
            minDist = dist;
            nearest = s;
          }
        });

        console.log("Nearest station:", nearest, "at", minDist.toFixed(2), "km");
        const latestRes = await fetch(`http://127.0.0.1:8000/latest/${nearest.station_id}`);
        const latestJson = await latestRes.json();
        const roundedLevel = latestJson.currentLevel !== null && latestJson.currentLevel !== undefined
        ? Number(latestJson.currentLevel).toFixed(2)
        : "N/A";


        setLocationData({
          currentLevel: roundedLevel,
          lastUpdated: latestJson.ts ? new Date(latestJson.ts).toLocaleString() : "just now",
          // use lat/lon coming directly from backend response
          coordinates: latestJson.lat && latestJson.lon
          ? `${latestJson.lat.toFixed(4)}°N, ${latestJson.lon.toFixed(4)}°E`
          : "N/A",
          altitude: 14,
          nearestStation: latestJson.name || latestJson.station_id,
          distance: minDist.toFixed(1)
        });

      },
      () => {
        setLocationPermission("denied");
      }
    );
  }
};


  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 p-4 space-y-6">
      {/* <NavBar/>  */}
      
      <div className="flex items-center justify-between">
        <div className="text-center flex-1 space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent py-17">
            {t('groundwater_monitoring')}
          </h1>
          <p className="text-muted-foreground">
            {t('realtime_data')}
          </p>
        </div>
      </div>

      {/* Live Location Section */}
      
      <Card className="border-0 shadow-[0_4px_12px_-2px_hsl(210_85%_35%/0.1)] bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              {t('live_location_data')}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Updated {locationData?.lastUpdated || "—"}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {locationPermission === 'pending' && (
            <div className="text-center py-4">
              <Button onClick={requestLocation} className="mb-3">
                <Satellite className="h-4 w-4 mr-2" />
                {t('enable_location')}
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('allow_location')}
              </p>
            </div>
          )}
          
          {locationPermission === 'denied' && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">
                Location access denied. Showing general area data.
              </p>
              <Button variant="outline" onClick={requestLocation}>
                <Navigation className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {locationPermission === 'granted' && locationData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-card/50">
                <Droplets className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{locationData?.currentLevel}m</p>
                <p className="text-xs text-muted-foreground">Current Level</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/50">
                <MapPin className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="text-sm font-semibold">{locationData?.nearestStation}</p>
                <p className="text-xs text-muted-foreground">Nearest Station</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/50">
                <Navigation className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-xs font-medium">{locationData?.coordinates}</p>
                <p className="text-xs text-muted-foreground">Coordinates</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/50">
                <TrendingUp className="h-6 w-6 text-success mx-auto mb-2" />
                <p className="text-sm font-semibold">{locationData?.altitude}m</p>
                <p className="text-xs text-muted-foreground">Altitude</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nearby Stations */}
      {(locationPermission === 'granted' || locationPermission === 'denied') && (
        <Card className="border-0 shadow-[0_4px_12px_-2px_hsl(210_85%_35%/0.1)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t('nearby_stations')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-3">
              {mockNearbyStations.map((station) => (
                <div key={station.id} className="p-4 rounded-lg border bg-gradient-to-br from-card to-muted/30 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={station.status === 'critical' ? 'destructive' : station.status === 'low' ? 'secondary' : 'default'}>
                      {station.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{station.distance}km away</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{station.id}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{station.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{station.level}m</span>
                    {station.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-critical" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('search_stations')}
            className=" px-5 pl-10 border-0 shadow-[0_4px_12px_-2px_hsl(210_85%_35%/0.1)]"
          />
        </div>
        <Button variant="outline" className="border-0 shadow-[0_4px_12px_-2px_hsl(210_85%_35%/0.1)]">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard 
          icon={Droplets}
          title={t('active_stations')}
          value="5,260"
          trend="up"
          status="normal"
        />
        <StatsCard 
          icon={TrendingUp}
          title={t('avg_water_level')}
          value="14.2m"
          trend="up"
          status="normal"
        />
        <StatsCard 
          icon={AlertTriangle}
          title={t('critical_stations')}
          value="847"
          trend="down"
          status="critical"
        />
        <StatsCard 
          icon={TrendingUp}
          title={t('recharge_rate')}
          value="2.8m/yr"
          trend="up"
          status="good"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-[0_4px_12px_-2px_hsl(210_85%_35%/0.1)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Historical Data</CardTitle>
          </CardHeader>
          <CardContent>
            <HistoryViewer />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[0_4px_12px_-2px_hsl(210_85%_35%/0.1)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Forecast Data</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastViewer />
          </CardContent>
        </Card>
      </div>

      {/* Recent Stations */}
      <Card className="border-0 shadow-[0_4px_12px_-2px_hsl(210_85%_35%/0.1)]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Station Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {mockStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          className={`flex-1 ${
            theme === "dark" ? "bg-white text-black hover:bg-gray-200" : ""
          }`}
        >
          <MapPin className="h-4 w-4 mr-2" />
          View Station Map
        </Button>

        <Button 
          variant="secondary"
          className={`flex-1 ${
            theme === "dark" ? "bg-white text-black hover:bg-gray-200" : ""
          }`}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>
      {/* AI Assistant */}
      {/* <AIAssistant /> */}
    </div>
    </>
  );
}