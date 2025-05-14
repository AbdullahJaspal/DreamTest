import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {requestLocationPermission} from '../../../../utils/chatUtils';
import styles from '../styles/locationPickerStyles';
import Text from '../../../../components/Text';

// Default region (will be replaced with user location)
const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

interface LocationDetail {
  latitude: number;
  longitude: number;
  name: string;
}

/**
 * Location picker component for sharing locations in chat
 */
const LocationPicker: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const mapRef = useRef<MapView>(null);

  // State
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  });
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Get current location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Request permissions and get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        setIsLoading(false);
        Alert.alert(
          t('Permission Required'),
          t('Location permission is required to use this feature'),
          [{text: t('OK'), onPress: () => navigation.goBack()}],
        );
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setRegion(newRegion);
          setMarkerPosition({latitude, longitude});
          setIsLoading(false);

          // Geocode the location to get the address
          fetchLocationName(latitude, longitude);
        },
        error => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          Alert.alert(
            t('Location Error'),
            t(
              'Failed to get your current location. Please try again or select manually.',
            ),
            [{text: t('OK')}],
          );
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.error('Error in getCurrentLocation:', error);
      setIsLoading(false);
    }
  }, [navigation, t]);

  // Use reverse geocoding to get location name
  const fetchLocationName = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        // This would ideally use a geocoding service API
        // For simplicity, we'll just set a placeholder name
        setLocationName(
          `${t('Location at')} ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        );

        // Actual implementation would use something like Google Maps Geocoding API:
        /*
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setLocationName(data.results[0].formatted_address);
      }
      */
      } catch (error) {
        console.error('Error fetching location name:', error);
      }
    },
    [t],
  );

  // Handle map drag and update marker position
  const handleMapDrag = useCallback(
    newRegion => {
      setRegion(newRegion);
      setMarkerPosition({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      });
      fetchLocationName(newRegion.latitude, newRegion.longitude);
    },
    [fetchLocationName],
  );

  // Send location back to chat screen
  const handleSendLocation = useCallback(() => {
    if (isSending) return;

    setIsSending(true);

    try {
      const locationData: LocationDetail = {
        latitude: markerPosition.latitude,
        longitude: markerPosition.longitude,
        name: locationName || t('Location'),
      };

      // Get the onLocationSelect callback from route params
      const onLocationSelect = route.params?.onLocationSelect;

      if (onLocationSelect) {
        onLocationSelect(locationData);
      }

      // Navigate back to chat
      navigation.goBack();
    } catch (error) {
      console.error('Error sending location:', error);
      Alert.alert(
        t('Error'),
        t('Failed to share location. Please try again.'),
        [{text: t('OK')}],
      );
      setIsSending(false);
    }
  }, [isSending, markerPosition, locationName, navigation, route.params, t]);

  // Recenter the map to current location
  const handleRecenter = useCallback(() => {
    setIsLoading(true);
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('Share Location')}</Text>

        <TouchableOpacity
          style={styles.recenterButton}
          onPress={handleRecenter}
          activeOpacity={0.7}>
          <MaterialIcons name="my-location" size={24} color="#54AD7A" />
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#54AD7A" />
            <Text style={styles.loadingText}>
              {t('Getting your location...')}
            </Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={region}
            onRegionChangeComplete={handleMapDrag}>
            <Marker coordinate={markerPosition} pinColor="#54AD7A" />
          </MapView>
        )}

        {/* Marker at center for visual feedback during dragging */}
        {!isLoading && (
          <View style={styles.centerMarker}>
            <MaterialIcons name="location-pin" size={40} color="#54AD7A" />
          </View>
        )}
      </View>

      {/* Location Input and Send Button */}
      <View style={styles.footer}>
        <View style={styles.locationInfoContainer}>
          <MaterialIcons
            name="place"
            size={24}
            color="#54AD7A"
            style={styles.locationIcon}
          />

          <TextInput
            style={styles.locationInput}
            value={locationName}
            onChangeText={setLocationName}
            placeholder={t('Enter location name')}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            (isLoading || isSending) && styles.disabledButton,
          ]}
          onPress={handleSendLocation}
          disabled={isLoading || isSending}
          activeOpacity={0.7}>
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="send" size={22} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LocationPicker;
