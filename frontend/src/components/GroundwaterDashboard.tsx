import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Droplets, TrendingUp, TrendingDown, AlertTriangle, MapPin, Search, Filter, Navigation, Clock, Satellite } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/theme-provider";
import Header from "@/components/ui/header";
import HistoryViewer from "@/components/HistoryViewer";
import ForecastViewer from "@/components/ForecastViewer";
import Footer from "@/components/ui/footer";

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
  <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 ring-1 ring-slate-200/50">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-xl font-bold text-slate-900">{value}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {trend === 'up' ? (
            <div className="p-1 rounded-full bg-emerald-50 ring-1 ring-emerald-200">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          ) : (
            <div className="p-1 rounded-full bg-red-50 ring-1 ring-red-200">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
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
  <Card className="border-0 shadow-md bg-white/95 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ring-1 ring-slate-200/50">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          <span className="font-semibold text-sm text-slate-900">{station.id}</span>
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
      <p className="text-sm text-slate-600 mb-3">{station.location}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">{station.level}m</span>
        {station.trend === 'up' ? (
          <div className="p-1 rounded-full bg-emerald-50 ring-1 ring-emerald-200">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
        ) : (
          <div className="p-1 rounded-full bg-red-50 ring-1 ring-red-200">
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
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
  const { theme } = useTheme();

  const chartStroke = theme === "dark" ? "#ffffff" : "#3b82f6";
  const chartFill   = theme === "dark" ? "rgba(255, 255, 255, 0.71)" : "rgba(59, 130, 246, 0.1)"; 
  const tooltipText = theme === "dark" ? "#ffffff" : "#1e293b";
  
  useEffect(() => {
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

          const res = await fetch("http://127.0.0.1:8000/stations");
          const { stations } = await res.json();

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
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen">
      {/* Title Section - positioned to be visible below navbar */}
      <div className="pt-24 pb-8 px-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1 space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent py-2">
              {t('groundwater_monitoring')}
            </h1>
            <p className="text-slate-700 text-lg font-medium">
              {t('realtime_data')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen p-4 space-y-6">
        {/* Live Location Section */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm ring-1 ring-slate-200/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-900">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                  <Navigation className="h-5 w-5 text-white" />
                </div>
                {t('live_location_data')}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full ring-1 ring-slate-200">
                <Clock className="h-4 w-4" />
                Updated {locationData?.lastUpdated || "—"}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {locationPermission === 'pending' && (
              <div className="text-center py-8">
                <Button 
                  onClick={requestLocation} 
                  className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg px-8 py-3 text-lg"
                >
                  <Satellite className="h-5 w-5 mr-2" />
                  {t('enable_location')}
                </Button>
                <p className="text-slate-600">
                  {t('allow_location')}
                </p>
              </div>
            )}
            
            {locationPermission === 'denied' && (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">
                  Location access denied. Showing general area data.
                </p>
                <Button 
                  variant="outline" 
                  onClick={requestLocation}
                  className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}

            {locationPermission === 'granted' && locationData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-100 ring-1 ring-blue-200 shadow-sm">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 w-fit mx-auto mb-3 shadow-lg">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{locationData?.currentLevel}m</p>
                  <p className="text-xs text-slate-600 font-medium">Current Level</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 ring-1 ring-emerald-200 shadow-sm">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 w-fit mx-auto mb-3 shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{locationData?.nearestStation}</p>
                  <p className="text-xs text-slate-600 font-medium">Nearest Station</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-100 ring-1 ring-purple-200 shadow-sm">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 w-fit mx-auto mb-3 shadow-lg">
                    <Navigation className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">{locationData?.coordinates}</p>
                  <p className="text-xs text-slate-600 font-medium">Coordinates</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-100 ring-1 ring-orange-200 shadow-sm">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 w-fit mx-auto mb-3 shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{locationData?.altitude}m</p>
                  <p className="text-xs text-slate-600 font-medium">Altitude</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nearby Stations */}
        {(locationPermission === 'granted' || locationPermission === 'denied') && (
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm ring-1 ring-slate-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-900">
                <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                {t('nearby_stations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
                {mockNearbyStations.map((station) => (
                  <div key={station.id} className="p-4 rounded-xl ring-1 ring-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={station.status === 'critical' ? 'destructive' : station.status === 'low' ? 'secondary' : 'default'}>
                        {station.status}
                      </Badge>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full font-medium ring-1 ring-slate-200">{station.distance}km away</span>
                    </div>
                    <h4 className="font-bold text-sm mb-1 text-slate-900">{station.id}</h4>
                    <p className="text-xs text-slate-600 mb-3">{station.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-slate-900">{station.level}m</span>
                      {station.trend === 'up' ? (
                        <div className="p-1.5 rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-full bg-red-50 ring-1 ring-red-200">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder={t('search_stations')}
              className="pl-12 pr-4 py-3 border-0 shadow-lg bg-white/95 backdrop-blur-sm text-slate-900 placeholder-slate-500 text-lg ring-1 ring-slate-200/50"
            />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm ring-1 ring-slate-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Historical Data</CardTitle>
            </CardHeader>
            <CardContent>
              <HistoryViewer />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm ring-1 ring-slate-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Forecast Data</CardTitle>
            </CardHeader>
            <CardContent>
              <ForecastViewer />
            </CardContent>
          </Card>
        </div>

        {/* Recent Stations */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm ring-1 ring-slate-200/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Recent Station Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockStations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg py-3 text-lg font-semibold">
            <MapPin className="h-5 w-5 mr-2" />
            View Station Map
          </Button>

          <Button 
            variant="secondary"
            className="flex-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 hover:from-slate-200 hover:to-slate-300 shadow-lg py-3 text-lg font-semibold ring-1 ring-slate-300"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}