import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Calendar, 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  Car, 
  Bike, 
  Truck,
  CreditCard,
  AlertCircle,
  Filter
} from 'lucide-react-native';

// Mock ride history data
const mockRideHistory = [
  {
    id: '1',
    date: '2024-01-15',
    time: '09:30 AM',
    driverName: 'Sarah Johnson',
    driverRating: 4.9,
    vehicleType: 'car',
    vehicleNumber: 'MH12AB1234',
    pickup: 'Home - Bandra West',
    drop: 'Office - Andheri East',
    distance: '12.5 km',
    duration: '35 min',
    fare: '₹285',
    paymentMethod: 'UPI',
    status: 'completed',
    rating: 5,
  },
  {
    id: '2',
    date: '2024-01-14',
    time: '07:15 PM',
    driverName: 'Priya Sharma',
    driverRating: 4.8,
    vehicleType: 'bike',
    vehicleNumber: 'MH12CD5678',
    pickup: 'Mall - Linking Road',
    drop: 'Home - Bandra West',
    distance: '8.2 km',
    duration: '22 min',
    fare: '₹125',
    paymentMethod: 'Cash',
    status: 'completed',
    rating: 4,
  },
  {
    id: '3',
    date: '2024-01-13',
    time: '02:45 PM',
    driverName: 'Anjali Patel',
    driverRating: 4.7,
    vehicleType: 'auto',
    vehicleNumber: 'MH12EF9012',
    pickup: 'Restaurant - Juhu',
    drop: 'Friend\'s Place - Versova',
    distance: '6.8 km',
    duration: '18 min',
    fare: '₹95',
    paymentMethod: 'Wallet',
    status: 'completed',
    rating: 5,
  },
  {
    id: '4',
    date: '2024-01-12',
    time: '11:20 AM',
    driverName: 'Meera Singh',
    driverRating: 4.6,
    vehicleType: 'car',
    vehicleNumber: 'MH12GH3456',
    pickup: 'Airport - Terminal 2',
    drop: 'Home - Bandra West',
    distance: '15.3 km',
    duration: '42 min',
    fare: '₹350',
    paymentMethod: 'Card',
    status: 'completed',
    rating: 4,
  },
  {
    id: '5',
    date: '2024-01-10',
    time: '06:30 PM',
    driverName: 'Kavya Reddy',
    driverRating: 4.9,
    vehicleType: 'bike',
    vehicleNumber: 'MH12IJ7890',
    pickup: 'Office - Andheri East',
    drop: 'Gym - Bandra West',
    distance: '11.2 km',
    duration: '28 min',
    fare: '₹165',
    paymentMethod: 'UPI',
    status: 'cancelled',
    rating: null,
  },
];

const filterOptions = ['All', 'Completed', 'Cancelled'];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [rideHistory, setRideHistory] = useState(mockRideHistory);

  const filteredRides = rideHistory.filter(ride => {
    if (selectedFilter === 'All') return true;
    return ride.status === selectedFilter.toLowerCase();
  });

  const renderVehicleIcon = (type) => {
    switch (type) {
      case 'car': return <Car size={18} color="#E91E63" />;
      case 'bike': return <Bike size={18} color="#E91E63" />;
      case 'auto': return <Truck size={18} color="#E91E63" />;
      default: return <Car size={18} color="#E91E63" />;
    }
  };

  const renderPaymentIcon = (method) => {
    return <CreditCard size={14} color="#6B7280" />;
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            color={star <= rating ? '#FCD34D' : '#E5E7EB'}
            fill={star <= rating ? '#FCD34D' : 'transparent'}
          />
        ))}
      </View>
    );
  };

  const handleReportIssue = (rideId) => {
    Alert.alert(
      'Report Issue',
      'What issue would you like to report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Driver Behavior', onPress: () => reportIssue(rideId, 'driver') },
        { text: 'Payment Issue', onPress: () => reportIssue(rideId, 'payment') },
        { text: 'Route Issue', onPress: () => reportIssue(rideId, 'route') },
        { text: 'Other', onPress: () => reportIssue(rideId, 'other') },
      ]
    );
  };

  const reportIssue = (rideId, issueType) => {
    // TODO: Implement actual issue reporting
    Alert.alert('Issue Reported', 'Your issue has been reported. Our support team will contact you soon.');
  };

  const handleRebookRide = (ride) => {
    Alert.alert(
      'Rebook Ride',
      `Rebook ride from ${ride.pickup} to ${ride.drop}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => rebookRide(ride) }
      ]
    );
  };

  const rebookRide = (ride) => {
    // TODO: Implement actual rebooking logic
    Alert.alert('Ride Rebooked', 'Your ride has been rebooked successfully!');
  };

  const renderRideCard = (ride) => (
    <View
      key={ride.id}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
      }}
    >
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Calendar size={16} color="#6B7280" />
          <Text style={{
            fontSize: 14,
            color: '#6B7280',
            marginLeft: 6,
          }}>
            {ride.date} • {ride.time}
          </Text>
        </View>
        
        <View style={{
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          backgroundColor: ride.status === 'completed' ? '#D1FAE5' : '#FEE2E2',
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: ride.status === 'completed' ? '#065F46' : '#DC2626',
            textTransform: 'capitalize',
          }}>
            {ride.status}
          </Text>
        </View>
      </View>

      {/* Driver Info */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#F3F4F6',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}>
          {renderVehicleIcon(ride.vehicleType)}
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: 2,
          }}>
            {ride.driverName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
              marginRight: 8,
            }}>
              {ride.vehicleNumber}
            </Text>
            <Star size={12} color="#FCD34D" fill="#FCD34D" />
            <Text style={{
              fontSize: 12,
              color: '#6B7280',
              marginLeft: 2,
            }}>
              {ride.driverRating}
            </Text>
          </View>
        </View>
        
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1F2937',
        }}>
          {ride.fare}
        </Text>
      </View>

      {/* Route Info */}
      <View style={{ marginBottom: 12 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}>
          <MapPin size={16} color="#10B981" />
          <Text style={{
            fontSize: 14,
            color: '#1F2937',
            marginLeft: 8,
            flex: 1,
          }}>
            {ride.pickup}
          </Text>
        </View>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
          <Navigation size={16} color="#EF4444" />
          <Text style={{
            fontSize: 14,
            color: '#1F2937',
            marginLeft: 8,
            flex: 1,
          }}>
            {ride.drop}
          </Text>
        </View>
      </View>

      {/* Trip Details */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Clock size={14} color="#6B7280" />
          <Text style={{
            fontSize: 12,
            color: '#6B7280',
            marginLeft: 4,
          }}>
            {ride.duration}
          </Text>
        </View>
        
        <Text style={{
          fontSize: 12,
          color: '#6B7280',
        }}>
          {ride.distance}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {renderPaymentIcon(ride.paymentMethod)}
          <Text style={{
            fontSize: 12,
            color: '#6B7280',
            marginLeft: 4,
          }}>
            {ride.paymentMethod}
          </Text>
        </View>
      </View>

      {/* Rating & Actions */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {ride.rating && (
            <>
              <Text style={{
                fontSize: 12,
                color: '#6B7280',
                marginRight: 6,
              }}>
                Your rating:
              </Text>
              {renderStars(ride.rating)}
            </>
          )}
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => handleReportIssue(ride.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: '#FEF3F2',
              marginRight: 8,
            }}
          >
            <Text style={{
              fontSize: 12,
              color: '#DC2626',
              fontWeight: '500',
            }}>
              Report Issue
            </Text>
          </TouchableOpacity>
          
          {ride.status === 'completed' && (
            <TouchableOpacity
              onPress={() => handleRebookRide(ride)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: '#F0FDF4',
              }}
            >
              <Text style={{
                fontSize: 12,
                color: '#16A34A',
                fontWeight: '500',
              }}>
                Rebook
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#F9FAFB',
      paddingTop: insets.top,
    }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: 16,
        }}>
          Ride History
        </Text>
        
        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 8 }}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: selectedFilter === filter ? '#E91E63' : '#F3F4F6',
                marginRight: 12,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: selectedFilter === filter ? '#FFFFFF' : '#6B7280',
              }}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Rides List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredRides.length > 0 ? (
          filteredRides.map(renderRideCard)
        ) : (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
          }}>
            <AlertCircle size={48} color="#9CA3AF" />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#6B7280',
              marginTop: 16,
              marginBottom: 8,
            }}>
              No rides found
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#9CA3AF',
              textAlign: 'center',
              lineHeight: 20,
            }}>
              {selectedFilter === 'All' 
                ? 'You haven\'t taken any rides yet.\nBook your first safe ride now!'
                : `No ${selectedFilter.toLowerCase()} rides found.`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}