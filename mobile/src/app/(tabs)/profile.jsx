import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  User, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Award,
  Users,
  Heart
} from 'lucide-react-native';

// Mock user data
const mockUser = {
  name: 'Jessica Smith',
  email: 'jessica.smith@email.com',
  phone: '+91 98765 43210',
  profileImage: null,
  memberSince: 'January 2024',
  totalRides: 47,
  rating: 4.9,
  savedLocations: 3,
  emergencyContacts: 2,
};

const profileStats = [
  { label: 'Total Rides', value: mockUser.totalRides, icon: MapPin },
  { label: 'Your Rating', value: mockUser.rating, icon: Star },
  { label: 'Saved Places', value: mockUser.savedLocations, icon: Heart },
  { label: 'Emergency Contacts', value: mockUser.emergencyContacts, icon: Shield },
];

const menuSections = [
  {
    title: 'Account',
    items: [
      { id: 'edit_profile', title: 'Edit Profile', subtitle: 'Update your personal information', icon: Edit3 },
      { id: 'emergency_contacts', title: 'Emergency Contacts', subtitle: 'Manage your safety contacts', icon: Shield },
      { id: 'saved_places', title: 'Saved Places', subtitle: 'Home, work, and favorite locations', icon: MapPin },
    ],
  },
  {
    title: 'Payments & Billing',
    items: [
      { id: 'payment_methods', title: 'Payment Methods', subtitle: 'Cards, wallets, and UPI', icon: CreditCard },
      { id: 'ride_receipts', title: 'Ride Receipts', subtitle: 'Download and view receipts', icon: Award },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', title: 'Notifications', subtitle: 'Manage your alerts', icon: Bell },
      { id: 'privacy_settings', title: 'Privacy & Safety', subtitle: 'Control your data and safety', icon: Shield },
      { id: 'app_settings', title: 'App Settings', subtitle: 'Language, theme, and more', icon: Settings },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help_center', title: 'Help Center', subtitle: 'FAQs and support articles', icon: HelpCircle },
      { id: 'refer_friends', title: 'Refer Friends', subtitle: 'Invite friends and earn rewards', icon: Users },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(mockUser);

  const handleMenuPress = (itemId) => {
    switch (itemId) {
      case 'edit_profile':
        Alert.alert('Edit Profile', 'Profile editing screen will be implemented here');
        break;
      case 'emergency_contacts':
        Alert.alert('Emergency Contacts', 'Emergency contacts management will be implemented here');
        break;
      case 'saved_places':
        Alert.alert('Saved Places', 'Saved places management will be implemented here');
        break;
      case 'payment_methods':
        Alert.alert('Payment Methods', 'Payment methods management will be implemented here');
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Notification settings will be implemented here');
        break;
      case 'privacy_settings':
        Alert.alert('Privacy & Safety', 'Privacy and safety settings will be implemented here');
        break;
      case 'help_center':
        Alert.alert('Help Center', 'Help center will be implemented here');
        break;
      case 'refer_friends':
        Alert.alert('Refer Friends', 'Referral system will be implemented here');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature will be available soon');
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => performLogout() }
      ]
    );
  };

  const performLogout = () => {
    // TODO: Implement actual logout logic
    Alert.alert('Signed Out', 'You have been signed out successfully');
  };

  const renderStatCard = (stat) => {
    const IconComponent = stat.icon;
    
    return (
      <View
        key={stat.label}
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginHorizontal: 4,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}
      >
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#FEF3F2',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <IconComponent size={20} color="#E91E63" />
        </View>
        
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: 4,
        }}>
          {stat.value}
        </Text>
        
        <Text style={{
          fontSize: 12,
          color: '#6B7280',
          textAlign: 'center',
        }}>
          {stat.label}
        </Text>
      </View>
    );
  };

  const renderMenuItem = (item) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleMenuPress(item.id)}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F9FAFB',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
            <IconComponent size={20} color="#6B7280" />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: 2,
            }}>
              {item.title}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
            }}>
              {item.subtitle}
            </Text>
          </View>
          
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderMenuSection = (section) => (
    <View key={section.title} style={{ marginBottom: 24 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
        paddingHorizontal: 4,
      }}>
        {section.title}
      </Text>
      {section.items.map(renderMenuItem)}
    </View>
  );

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#F9FAFB',
      paddingTop: insets.top,
    }}>
      <StatusBar style="dark" />
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={{
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 20,
          paddingVertical: 24,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#E91E63',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <User size={40} color="#FFFFFF" />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: 4,
              }}>
                {user.name}
              </Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Mail size={14} color="#6B7280" />
                <Text style={{
                  fontSize: 14,
                  color: '#6B7280',
                  marginLeft: 6,
                }}>
                  {user.email}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Phone size={14} color="#6B7280" />
                <Text style={{
                  fontSize: 14,
                  color: '#6B7280',
                  marginLeft: 6,
                }}>
                  {user.phone}
                </Text>
              </View>
              
              <Text style={{
                fontSize: 12,
                color: '#9CA3AF',
              }}>
                Member since {user.memberSince}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => handleMenuPress('edit_profile')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Edit3 size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {/* Stats */}
          <View style={{ flexDirection: 'row', marginHorizontal: -4 }}>
            {profileStats.map(renderStatCard)}
          </View>
        </View>

        {/* Menu Sections */}
        <View style={{ padding: 20 }}>
          {menuSections.map(renderMenuSection)}
          
          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
              borderWidth: 1,
              borderColor: '#FEE2E2',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <LogOut size={20} color="#EF4444" />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#EF4444',
                marginLeft: 8,
              }}>
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* App Version */}
          <View style={{
            alignItems: 'center',
            marginTop: 24,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
          }}>
            <Text style={{
              fontSize: 14,
              color: '#9CA3AF',
              marginBottom: 4,
            }}>
              SafeRide for Women
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#D1D5DB',
            }}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}