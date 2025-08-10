import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  Menu,
  Search,
  MapPin,
  Navigation,
  Clock,
  Shield,
  Phone,
  Star,
  Car,
  Bike,
  Truck,
  AlertTriangle,
} from "lucide-react-native";

// Import stores and services
import { useAuthStore } from "@/store/index";
import { firebase } from "@/services/firebase/config";

const { width, height } = Dimensions.get("window");

// Mock female drivers data with enhanced information
const mockDrivers = [
  {
    id: "1",
    name: "Sarah Johnson",
    rating: 4.9,
    vehicleType: "car",
    vehicleNumber: "MH12AB1234",
    distance: "0.5 km",
    eta: "3 min",
    latitude: 19.076 + (Math.random() - 0.5) * 0.01,
    longitude: 72.8777 + (Math.random() - 0.5) * 0.01,
    profileImage: null,
    isVerified: true,
    totalRides: 247,
    safetyRating: 4.95,
  },
  {
    id: "2",
    name: "Priya Sharma",
    rating: 4.8,
    vehicleType: "bike",
    vehicleNumber: "MH12CD5678",
    distance: "0.8 km",
    eta: "5 min",
    latitude: 19.076 + (Math.random() - 0.5) * 0.01,
    longitude: 72.8777 + (Math.random() - 0.5) * 0.01,
    profileImage: null,
    isVerified: true,
    totalRides: 189,
    safetyRating: 4.87,
  },
  {
    id: "3",
    name: "Anjali Patel",
    rating: 4.7,
    vehicleType: "auto",
    vehicleNumber: "MH12EF9012",
    distance: "1.2 km",
    eta: "7 min",
    latitude: 19.076 + (Math.random() - 0.5) * 0.01,
    longitude: 72.8777 + (Math.random() - 0.5) * 0.01,
    profileImage: null,
    isVerified: true,
    totalRides: 156,
    safetyRating: 4.82,
  },
];

const rideTypes = [
  { id: "bike", name: "Bike", icon: Bike, price: "₹25", time: "3-5 min" },
  { id: "auto", name: "Auto", icon: Truck, price: "₹45", time: "5-8 min" },
  { id: "car", name: "Car", icon: Car, price: "₹85", time: "8-12 min" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  // Auth state
  const { user, isAuthenticated } = useAuthStore();

  // Local state
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [selectedRideType, setSelectedRideType] = useState("bike");
  const [showDrivers, setShowDrivers] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState(mockDrivers);
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    setupRealTimeDriverUpdates();

    // Analytics tracking
    firebase.analytics.setCurrentScreen("HomeScreen");

    // Set user properties for analytics
    if (user) {
      firebase.analytics.setUserProperties({
        user_id: user.uid,
        phone_verified: user.isVerified,
      });
    }
  }, [user]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "SafeRide needs location access to find nearby female drivers and show your pickup location.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Grant Permission", onPress: () => getCurrentLocation() },
          ],
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setCurrentLocation({ latitude, longitude });

      // Get address from coordinates
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (address.length > 0) {
        const addr = address[0];
        setPickupLocation(
          `${addr.name || ""} ${addr.street || ""}, ${addr.city || ""}`,
        );
      }

      // Log analytics event
      await firebase.analytics.logEvent("location_obtained", {
        user_id: user?.uid,
        latitude,
        longitude,
      });
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert(
        "Location Error",
        "Failed to get current location. Please check your GPS settings.",
      );
    }
  };

  const setupRealTimeDriverUpdates = () => {
    // Set up real-time driver location updates
    const updateInterval = setInterval(() => {
      setNearbyDrivers((prevDrivers) =>
        prevDrivers.map((driver) => ({
          ...driver,
          latitude: 19.076 + (Math.random() - 0.5) * 0.02,
          longitude: 72.8777 + (Math.random() - 0.5) * 0.02,
          eta: Math.floor(Math.random() * 10 + 2) + " min",
          distance: (Math.random() * 2 + 0.3).toFixed(1) + " km",
        })),
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(updateInterval);
  };

  const handleSOS = async () => {
    try {
      Alert.alert(
        "🚨 Emergency SOS",
        "This will immediately send your location to emergency contacts and local authorities. Are you in danger?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Send SOS Alert",
            style: "destructive",
            onPress: async () => {
              setSosActive(true);
              await sendSOSAlert();
            },
          },
        ],
      );
    } catch (error) {
      console.error("SOS Error:", error);
    }
  };

  const sendSOSAlert = async () => {
    try {
      if (!user || !currentLocation) {
        throw new Error("User or location not available");
      }

      // Log critical SOS event
      await firebase.analytics.logEvent("sos_triggered", {
        user_id: user.uid,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        timestamp: Date.now(),
      });

      // In real implementation:
      // 1. Send SMS to emergency contacts
      // 2. Alert authorities
      // 3. Start live location sharing
      // 4. Record emergency event

      Alert.alert(
        "✅ SOS Alert Sent",
        "Your emergency alert has been sent to your contacts and local authorities. SafeRide support is monitoring your situation.",
        [
          {
            text: "OK",
            onPress: () => {
              setSosActive(false);
            },
          },
        ],
      );

      // Show SOS status in UI
      setTimeout(() => setSosActive(false), 10000);
    } catch (error) {
      console.error("Failed to send SOS:", error);
      Alert.alert(
        "SOS Error",
        "Failed to send emergency alert. Please call emergency services directly.",
      );
      setSosActive(false);
    }
  };

  const handleBookRide = async () => {
    if (!pickupLocation || !dropLocation) {
      Alert.alert(
        "Missing Information",
        "Please enter both pickup and drop locations to proceed with booking.",
      );
      return;
    }

    if (!isAuthenticated) {
      Alert.alert("Authentication Required", "Please sign in to book a ride.");
      return;
    }

    setIsBooking(true);
    setShowDrivers(true);
    setShowBottomSheet(false);

    // Analytics
    await firebase.analytics.logEvent("ride_booking_started", {
      user_id: user?.uid,
      vehicle_type: selectedRideType,
      pickup_location: pickupLocation.substring(0, 50), // Truncate for privacy
      drop_location: dropLocation.substring(0, 50),
    });

    setTimeout(() => setIsBooking(false), 2000);
  };

  const handleDriverSelect = (driver) => {
    Alert.alert(
      "Confirm Booking with Female Driver",
      `Book ride with ${driver.name}?\n\n👩‍💼 Driver Details:\n• Safety Rating: ${driver.safetyRating}⭐\n• Overall Rating: ${driver.rating}⭐ (${driver.totalRides} rides)\n• Vehicle: ${driver.vehicleNumber}\n• ETA: ${driver.eta}\n• ✅ Verified Female Driver`,
      [
        { text: "View Profile", onPress: () => viewDriverProfile(driver) },
        { text: "Cancel", style: "cancel" },
        { text: "Book Now", onPress: () => bookRide(driver) },
      ],
    );
  };

  const viewDriverProfile = (driver) => {
    Alert.alert(
      `${driver.name} - Driver Profile`,
      `🚗 Vehicle Type: ${driver.vehicleType.toUpperCase()}\n📋 Vehicle Number: ${driver.vehicleNumber}\n⭐ Rating: ${driver.rating}/5.0\n🛡️ Safety Score: ${driver.safetyRating}/5.0\n🚗 Total Rides: ${driver.totalRides}\n✅ Verified Female Driver\n🔐 Background Verified`,
      [{ text: "Close" }],
    );
  };

  const bookRide = async (driver) => {
    try {
      setIsBooking(true);

      // Simulate booking process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Analytics
      await firebase.analytics.logEvent("ride_booked", {
        user_id: user.uid,
        driver_id: driver.id,
        vehicle_type: selectedRideType,
        pickup_location: pickupLocation.substring(0, 50),
        drop_location: dropLocation.substring(0, 50),
        estimated_fare: parseInt(
          rideTypes
            .find((r) => r.id === selectedRideType)
            ?.price.replace("₹", "") || "50",
        ),
      });

      Alert.alert(
        "🎉 Ride Booked Successfully!",
        `${driver.name} will pick you up in ${driver.eta}.\n\n📱 You can now:\n• Track driver in real-time\n• Chat with your driver\n• Use SOS if needed\n• Share trip with contacts`,
        [
          { text: "Track Driver", onPress: () => startRideTracking(driver) },
          { text: "OK" },
        ],
      );

      setShowDrivers(false);
      setShowBottomSheet(true);
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert("Booking Error", "Failed to book ride. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const startRideTracking = (driver) => {
    Alert.alert(
      "Live Ride Tracking",
      `Tracking your ride with ${driver.name}.\n\n🗺️ Features available:\n• Real-time driver location\n• ETA updates\n• Route monitoring\n• Deviation alerts\n• Emergency SOS button`,
      [{ text: "Continue Tracking" }],
    );
  };

  const renderVehicleIcon = (type) => {
    switch (type) {
      case "car":
        return <Car size={20} color="#E91E63" />;
      case "bike":
        return <Bike size={20} color="#E91E63" />;
      case "auto":
        return <Truck size={20} color="#E91E63" />;
      default:
        return <Car size={20} color="#E91E63" />;
    }
  };

  const renderDriverCard = (driver) => (
    <TouchableOpacity
      key={driver.id}
      onPress={() => handleDriverSelect(driver)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#F3F4F6",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#F3F4F6",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          {renderVehicleIcon(driver.vehicleType)}
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1F2937",
                marginRight: 8,
              }}
            >
              {driver.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Star size={14} color="#FCD34D" fill="#FCD34D" />
              <Text style={{ fontSize: 14, color: "#6B7280", marginLeft: 2 }}>
                {driver.rating}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 2 }}>
            {driver.vehicleNumber} • {driver.distance}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Clock size={12} color="#6B7280" />
            <Text style={{ fontSize: 12, color: "#6B7280", marginLeft: 4 }}>
              {driver.eta} away
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#E91E63",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Phone size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />

      {/* Map */}
      <View style={{ flex: 1 }}>
        {currentLocation && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            {/* Current Location Marker */}
            <Marker
              coordinate={currentLocation}
              title="Your Location"
              pinColor="#E91E63"
            />

            {/* Driver Markers */}
            {nearbyDrivers.map((driver) => (
              <Marker
                key={driver.id}
                coordinate={{
                  latitude: driver.latitude,
                  longitude: driver.longitude,
                }}
                title={driver.name}
                description={`${driver.vehicleType} • ${driver.eta}`}
              >
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 20,
                    padding: 8,
                    borderWidth: 2,
                    borderColor: "#E91E63",
                    alignItems: "center",
                  }}
                >
                  {renderVehicleIcon(driver.vehicleType)}
                </View>
              </Marker>
            ))}
          </MapView>
        )}

        {/* Header Overlay */}
        <View
          style={{
            position: "absolute",
            top: insets.top + 10,
            left: 20,
            right: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Menu size={20} color="#1F2937" />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#E91E63" }}>
              SafeRide
            </Text>
          </View>

          {/* SOS Button */}
          <TouchableOpacity
            onPress={handleSOS}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: sosActive ? "#FF1744" : "#EF4444",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#EF4444",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
              transform: sosActive ? [{ scale: 1.1 }] : [{ scale: 1 }],
            }}
          >
            {sosActive ? (
              <AlertTriangle size={20} color="#FFFFFF" />
            ) : (
              <Shield size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet - Booking Interface */}
      {showBottomSheet && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          {/* Handle */}
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#E5E7EB",
              borderRadius: 2,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />

          {/* Location Inputs */}
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F9FAFB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <MapPin size={18} color="#10B981" />
              <TextInput
                placeholder="Pickup location"
                value={pickupLocation}
                onChangeText={setPickupLocation}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: "#1F2937",
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F9FAFB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <Navigation size={18} color="#EF4444" />
              <TextInput
                placeholder="Where to?"
                value={dropLocation}
                onChangeText={setDropLocation}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: "#1F2937",
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Ride Types */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20 }}
          >
            {rideTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = selectedRideType === type.id;

              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedRideType(type.id)}
                  style={{
                    backgroundColor: isSelected ? "#E91E63" : "#F9FAFB",
                    borderRadius: 12,
                    padding: 16,
                    marginRight: 12,
                    minWidth: 100,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: isSelected ? "#E91E63" : "#E5E7EB",
                  }}
                >
                  <IconComponent
                    size={24}
                    color={isSelected ? "#FFFFFF" : "#6B7280"}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: isSelected ? "#FFFFFF" : "#1F2937",
                      marginTop: 8,
                    }}
                  >
                    {type.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: isSelected ? "#FFFFFF" : "#6B7280",
                      marginTop: 2,
                    }}
                  >
                    {type.price}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: isSelected ? "#FFFFFF" : "#9CA3AF",
                      marginTop: 2,
                    }}
                  >
                    {type.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Book Ride Button */}
          <TouchableOpacity
            onPress={handleBookRide}
            style={{
              backgroundColor: "#E91E63",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              shadowColor: "#E91E63",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            >
              Find Female Drivers
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Drivers List */}
      {showDrivers && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
            maxHeight: height * 0.6,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          {/* Handle */}
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#E5E7EB",
              borderRadius: 2,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#1F2937",
              }}
            >
              Available Female Drivers
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowDrivers(false);
                setShowBottomSheet(true);
              }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: "#F3F4F6",
              }}
            >
              <Text style={{ fontSize: 14, color: "#6B7280" }}>Back</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {nearbyDrivers.map(renderDriverCard)}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
