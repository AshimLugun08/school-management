import React, { useState, useEffect } from 'react';
import { MapPin, School, Plus, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface School {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface FormData {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
}

interface ApiError {
  message: string;
}

function App() {
  const [schools, setSchools] = useState<School[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('list');
  const [locationLoading, setLocationLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});


  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // Get user's current location
  const getUserLocation = async () => {
    setLocationLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(location);
        setLocationLoading(false);
        fetchSchools(location);
      },
      (error) => {
        let errorMessage = 'Error getting location: ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timeout';
            break;
          default:
            errorMessage += 'Unknown error';
        }
        setError(errorMessage);
        setLocationLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Fetch schools from API
  const fetchSchools = async (location?: UserLocation) => {
    const currentLocation = location || userLocation;
    if (!currentLocation) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_BASE_URL}/listSchools?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSchools(data);
    } catch (err) {
      const error = err as ApiError;
      setError(`Failed to fetch schools: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'School name is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.latitude.trim()) {
      errors.latitude = 'Latitude is required';
    } else {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.latitude = 'Latitude must be between -90 and 90';
      }
    }

    if (!formData.longitude.trim()) {
      errors.longitude = 'Longitude is required';
    } else {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.longitude = 'Longitude must be between -180 and 180';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/addSchool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          address: formData.address.trim(),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess('School added successfully!');
      setFormData({ name: '', address: '', latitude: '', longitude: '' });
      setFormErrors({});
      
      // Refresh schools list if user location is available
      if (userLocation) {
        fetchSchools();
      }
    } catch (err) {
      const error = err as ApiError;
      setError(`Failed to add school: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Calculate distance for display
  const formatDistance = (distance?: number): string => {
    if (!distance) return '';
    return distance < 1 
      ? `${Math.round(distance * 1000)}m away`
      : `${distance.toFixed(1)}km away`;
  };

  useEffect(() => {
    // Clear messages after 5 seconds
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-black rounded-full">
              <School className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">School Management</h1>
          </div>
          <p className="text-lg text-gray-600">Add schools and find nearby educational institutions</p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'list'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Find Schools
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'add'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Add School
            </button>
          </div>
        </div>

        {/* Alert Messages */}
        {(error || success) && (
          <div className="mb-6 max-w-2xl mx-auto">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'list' ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Nearby Schools</h2>
                <button
                  onClick={getUserLocation}
                  disabled={locationLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {locationLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  {locationLoading ? 'Getting Location...' : 'Get My Location'}
                </button>
              </div>

              {userLocation && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-800">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                  </p>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                  <span className="ml-3 text-gray-600">Loading schools...</span>
                </div>
              ) : schools.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {schools.map((school) => (
                    <div
                      key={school.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{school.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{school.address}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        {/* <p>Lat: {school.latitude}, Lng: {school.longitude}</p> */}
                        {school.distance && (
                          <p className="text-black font-medium">
                            {formatDistance(school.distance)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : userLocation ? (
                <div className="text-center py-12">
                  <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No schools found in the database.</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Click "Get My Location" to find nearby schools.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Plus className="w-6 h-6 text-black" />
                <h2 className="text-2xl font-semibold text-gray-900">Add New School</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      School Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter school name"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                        formErrors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter school address"
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude * <span className="text-gray-500 text-xs">(-90 to 90)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                        formErrors.latitude ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 19.0760"
                    />
                    {formErrors.latitude && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.latitude}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude * <span className="text-gray-500 text-xs">(-180 to 180)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                        formErrors.longitude ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 72.8777"
                    />
                    {formErrors.longitude && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.longitude}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding School...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add School
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;