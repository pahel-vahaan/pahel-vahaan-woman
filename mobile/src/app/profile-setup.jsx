import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Mail, Phone, UserPlus, Camera, Shield, Users } from 'lucide-react-native';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';
import { useAuthStore } from '@/store/index';
import { authService } from '@/services/auth';

export default function ProfileSetupScreen() {
  const insets = useSafeAreaInsets();
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
  });
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phoneNumber: '',
    relationship: '',
  });
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Get auth state from store
  const { isLoading, user } = useAuthStore();

  const validateStep1 = () => {
    const newErrors = {};

    if (!profileData.displayName.trim()) {
      newErrors.displayName = 'Full name is required';
    } else if (profileData.displayName.trim().length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters';
    }

    if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!emergencyContact.name.trim()) {
      newErrors.emergencyName = 'Emergency contact name is required';
    }

    if (!emergencyContact.phoneNumber.trim()) {
      newErrors.emergencyPhone = 'Emergency contact phone is required';
    } else if (!/^[6-9]\d{9}$/.test(emergencyContact.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.emergencyPhone = 'Please enter a valid 10-digit phone number';
    }

    if (!emergencyContact.relationship.trim()) {
      newErrors.emergencyRelationship = 'Relationship is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setErrors({});
    }
  };

  const handleComplete = async () => {
    if (!validateStep2()) return;

    try {
      // Update user profile
      await authService.updateProfile({
        displayName: profileData.displayName.trim(),
        email: profileData.email.trim() || null,
      });

      // Add emergency contact
      await authService.addEmergencyContact({
        name: emergencyContact.name.trim(),
        phoneNumber: `+91${emergencyContact.phoneNumber.replace(/\s+/g, '')}`,
        relationship: emergencyContact.relationship.trim(),
      });

      Alert.alert(
        'Profile Setup Complete!',
        'Welcome to SafeRide. Your profile has been set up successfully.',
        [
          {
            text: 'Start Using SafeRide',
            onPress: () => router.replace('/(tabs)/home')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to setup profile');
    }
  };

  const renderStep1 = () => (
    <>
      {/* Header Text */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: 8,
        }}>
          Complete Your Profile
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#6B7280',
          lineHeight: 24,
        }}>
          Help us personalize your SafeRide experience with a few basic details
        </Text>
      </View>

      {/* Profile Picture */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <TouchableOpacity
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#E91E63',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            shadowColor: '#E91E63',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <User size={40} color="#FFFFFF" />
          <View style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#E91E63',
          }}>
            <Camera size={16} color="#E91E63" />
          </View>
        </TouchableOpacity>
        <Text style={{
          fontSize: 14,
          color: '#6B7280',
        }}>
          Add Profile Photo (Optional)
        </Text>
      </View>

      {/* Form Fields */}
      <View style={{ marginBottom: 32 }}>
        {/* Full Name */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#374151',
            marginBottom: 8,
          }}>
            Full Name *
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: errors.displayName ? '#EF4444' : '#E5E7EB',
          }}>
            <User size={20} color={errors.displayName ? '#EF4444' : '#6B7280'} />
            <TextInput
              placeholder="Enter your full name"
              value={profileData.displayName}
              onChangeText={(text) => setProfileData({ ...profileData, displayName: text })}
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 16,
                color: '#1F2937',
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {errors.displayName && (
            <Text style={{
              color: '#EF4444',
              fontSize: 14,
              marginTop: 4,
              marginLeft: 4,
            }}>
              {errors.displayName}
            </Text>
          )}
        </View>

        {/* Email */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#374151',
            marginBottom: 8,
          }}>
            Email Address (Optional)
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: errors.email ? '#EF4444' : '#E5E7EB',
          }}>
            <Mail size={20} color={errors.email ? '#EF4444' : '#6B7280'} />
            <TextInput
              placeholder="Enter your email address"
              value={profileData.email}
              onChangeText={(text) => setProfileData({ ...profileData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 16,
                color: '#1F2937',
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {errors.email && (
            <Text style={{
              color: '#EF4444',
              fontSize: 14,
              marginTop: 4,
              marginLeft: 4,
            }}>
              {errors.email}
            </Text>
          )}
        </View>

        {/* Phone Number (Read Only) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#374151',
            marginBottom: 8,
          }}>
            Phone Number
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F3F4F6',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}>
            <Phone size={20} color="#6B7280" />
            <Text style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: '#6B7280',
            }}>
              {user?.phoneNumber || '+91 9876543210'}
            </Text>
            <View style={{
              backgroundColor: '#10B981',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#FFFFFF',
                fontWeight: '600',
              }}>
                Verified
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      {/* Header Text */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: 8,
        }}>
          Safety First
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#6B7280',
          lineHeight: 24,
        }}>
          Add an emergency contact for your safety. They'll be notified in case of any emergency during your rides.
        </Text>
      </View>

      {/* Safety Icon */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#FEF3F2',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <Shield size={40} color="#E91E63" />
        </View>
      </View>

      {/* Emergency Contact Form */}
      <View style={{ marginBottom: 32 }}>
        {/* Contact Name */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#374151',
            marginBottom: 8,
          }}>
            Contact Name *
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: errors.emergencyName ? '#EF4444' : '#E5E7EB',
          }}>
            <Users size={20} color={errors.emergencyName ? '#EF4444' : '#6B7280'} />
            <TextInput
              placeholder="Enter contact's full name"
              value={emergencyContact.name}
              onChangeText={(text) => setEmergencyContact({ ...emergencyContact, name: text })}
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 16,
                color: '#1F2937',
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {errors.emergencyName && (
            <Text style={{
              color: '#EF4444',
              fontSize: 14,
              marginTop: 4,
              marginLeft: 4,
            }}>
              {errors.emergencyName}
            </Text>
          )}
        </View>

        {/* Contact Phone */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#374151',
            marginBottom: 8,
          }}>
            Phone Number *
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: errors.emergencyPhone ? '#EF4444' : '#E5E7EB',
          }}>
            <Phone size={20} color={errors.emergencyPhone ? '#EF4444' : '#6B7280'} />
            <View style={{
              backgroundColor: '#E5E7EB',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              marginLeft: 12,
              marginRight: 12,
            }}>
              <Text style={{
                fontSize: 16,
                color: '#374151',
                fontWeight: '600',
              }}>
                +91
              </Text>
            </View>
            <TextInput
              placeholder="Enter phone number"
              value={emergencyContact.phoneNumber}
              onChangeText={(text) => setEmergencyContact({ ...emergencyContact, phoneNumber: text })}
              keyboardType="phone-pad"
              maxLength={10}
              style={{
                flex: 1,
                fontSize: 16,
                color: '#1F2937',
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {errors.emergencyPhone && (
            <Text style={{
              color: '#EF4444',
              fontSize: 14,
              marginTop: 4,
              marginLeft: 4,
            }}>
              {errors.emergencyPhone}
            </Text>
          )}
        </View>

        {/* Relationship */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#374151',
            marginBottom: 8,
          }}>
            Relationship *
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: errors.emergencyRelationship ? '#EF4444' : '#E5E7EB',
          }}>
            <UserPlus size={20} color={errors.emergencyRelationship ? '#EF4444' : '#6B7280'} />
            <TextInput
              placeholder="e.g., Mother, Father, Spouse, Friend"
              value={emergencyContact.relationship}
              onChangeText={(text) => setEmergencyContact({ ...emergencyContact, relationship: text })}
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 16,
                color: '#1F2937',
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {errors.emergencyRelationship && (
            <Text style={{
              color: '#EF4444',
              fontSize: 14,
              marginTop: 4,
              marginLeft: 4,
            }}>
              {errors.emergencyRelationship}
            </Text>
          )}
        </View>
      </View>

      {/* Safety Note */}
      <View style={{
        backgroundColor: '#FEF3F2',
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
      }}>
        <Text style={{
          fontSize: 14,
          color: '#DC2626',
          lineHeight: 20,
        }}>
          <Text style={{ fontWeight: '600' }}>Important:</Text> This contact will be automatically notified if you use the SOS feature or in case of any safety emergency during your rides.
        </Text>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: insets.top,
      }}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}>
          {currentStep === 2 && (
            <TouchableOpacity
              onPress={handleBack}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18, color: '#1F2937' }}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#1F2937',
            marginLeft: currentStep === 2 ? 16 : 0,
          }}>
            Step {currentStep} of 2
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          marginBottom: 20,
        }}>
          <View style={{
            flex: 1,
            height: 4,
            backgroundColor: '#E91E63',
            borderRadius: 2,
          }} />
          <View style={{
            flex: 1,
            height: 4,
            backgroundColor: currentStep === 2 ? '#E91E63' : '#E5E7EB',
            borderRadius: 2,
            marginLeft: 8,
          }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 1 ? renderStep1() : renderStep2()}

          {/* Action Button */}
          <TouchableOpacity
            onPress={currentStep === 1 ? handleNext : handleComplete}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#F3F4F6' : '#E91E63',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              shadowColor: '#E91E63',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: isLoading ? 0 : 0.3,
              shadowRadius: 8,
              elevation: isLoading ? 0 : 8,
            }}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: isLoading ? '#9CA3AF' : '#FFFFFF',
            }}>
              {isLoading ? 'Setting up...' : currentStep === 1 ? 'Next' : 'Complete Setup'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}