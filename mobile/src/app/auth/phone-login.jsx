import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, MessageSquare, Shield, RotateCcw } from 'lucide-react-native';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';
import { useAuthStore } from '@/store/index';
import { authService } from '@/services/auth';

export default function PhoneLoginScreen() {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [verificationId, setVerificationId] = useState(null);

  // Get auth state from store
  const { isLoading, error, otpVerificationId, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validatePhoneNumber = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneNumber.trim()) {
      return 'Phone number is required';
    }
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      return 'Please enter a valid 10-digit mobile number';
    }
    return null;
  };

  const handleSendOTP = async () => {
    const phoneError = validatePhoneNumber();
    if (phoneError) {
      Alert.alert('Invalid Phone Number', phoneError);
      return;
    }

    try {
      const formattedNumber = `+91${phoneNumber.replace(/\s+/g, '')}`;
      const verifyId = await authService.sendOTP(formattedNumber);
      setVerificationId(verifyId);
      setShowOTPInput(true);
      setCountdown(30); // 30 second countdown
      Alert.alert(
        'OTP Sent Successfully',
        `A 6-digit OTP has been sent to ${formattedNumber}. Please check your messages.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }

    try {
      const user = await authService.verifyOTP(verificationId || otpVerificationId, otp);
      
      Alert.alert(
        'Login Successful!',
        'Welcome to SafeRide. Your account has been verified.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // Check if profile is complete
              if (!user.displayName) {
                router.replace('/profile-setup');
              } else {
                router.replace('/(tabs)/home');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP');
      setOtp(''); // Clear OTP input
    }
  };

  const handleResendOTP = async () => {
    try {
      const formattedNumber = `+91${phoneNumber.replace(/\s+/g, '')}`;
      await authService.resendOTP(formattedNumber);
      setCountdown(30);
      Alert.alert('OTP Resent', 'A new OTP has been sent to your phone number');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleBackToPhone = () => {
    setShowOTPInput(false);
    setOtp('');
    setVerificationId(null);
    setCountdown(0);
  };

  const renderPhoneInput = () => (
    <>
      {/* Welcome Text */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: 8,
        }}>
          Welcome to SafeRide
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#6B7280',
          lineHeight: 24,
        }}>
          Enter your mobile number to continue with secure OTP verification
        </Text>
      </View>

      {/* Phone Input */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#374151',
          marginBottom: 8,
        }}>
          Mobile Number
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F9FAFB',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderWidth: 1,
          borderColor: error ? '#EF4444' : '#E5E7EB',
        }}>
          <Phone size={20} color={error ? '#EF4444' : '#6B7280'} />
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 12,
            flex: 1,
          }}>
            <View style={{
              backgroundColor: '#E5E7EB',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
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
              placeholder="Enter mobile number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
              style={{
                flex: 1,
                fontSize: 16,
                color: '#1F2937',
                fontWeight: '500',
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        
        {error && (
          <Text style={{
            color: '#EF4444',
            fontSize: 14,
            marginTop: 4,
            marginLeft: 4,
          }}>
            {error}
          </Text>
        )}
        
        <Text style={{
          fontSize: 12,
          color: '#6B7280',
          marginTop: 4,
          marginLeft: 4,
        }}>
          Example: 9876543210
        </Text>
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity
        onPress={handleSendOTP}
        disabled={isLoading || !phoneNumber}
        style={{
          backgroundColor: isLoading || !phoneNumber ? '#F3F4F6' : '#E91E63',
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 24,
          shadowColor: '#E91E63',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: isLoading || !phoneNumber ? 0 : 0.3,
          shadowRadius: 8,
          elevation: isLoading || !phoneNumber ? 0 : 8,
        }}
      >
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: isLoading || !phoneNumber ? '#9CA3AF' : '#FFFFFF',
        }}>
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>

      {/* Security Info */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
      }}>
        <Shield size={20} color="#16A34A" style={{ marginTop: 2 }} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#16A34A',
            marginBottom: 4,
          }}>
            Your Privacy is Protected
          </Text>
          <Text style={{
            fontSize: 12,
            color: '#15803D',
            lineHeight: 16,
          }}>
            Your number is secure and will only be used for verification and essential ride-related communication.
          </Text>
        </View>
      </View>
    </>
  );

  const renderOTPInput = () => (
    <>
      {/* OTP Verification Text */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: 8,
        }}>
          Enter OTP
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#6B7280',
          lineHeight: 24,
        }}>
          We've sent a 6-digit verification code to{'\n'}
          <Text style={{ fontWeight: '600', color: '#1F2937' }}>
            +91 {phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}
          </Text>
        </Text>
      </View>

      {/* OTP Input */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#374151',
          marginBottom: 8,
        }}>
          Verification Code
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F9FAFB',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderWidth: 1,
          borderColor: error ? '#EF4444' : '#E5E7EB',
        }}>
          <MessageSquare size={20} color={error ? '#EF4444' : '#6B7280'} />
          <TextInput
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 18,
              color: '#1F2937',
              letterSpacing: 4,
              fontWeight: '600',
              textAlign: 'center',
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        {error && (
          <Text style={{
            color: '#EF4444',
            fontSize: 14,
            marginTop: 4,
            marginLeft: 4,
          }}>
            {error}
          </Text>
        )}
        
        <Text style={{
          fontSize: 12,
          color: '#6B7280',
          marginTop: 4,
          marginLeft: 4,
        }}>
          Enter the code received via SMS
        </Text>
      </View>

      {/* Verify OTP Button */}
      <TouchableOpacity
        onPress={handleVerifyOTP}
        disabled={isLoading || otp.length !== 6}
        style={{
          backgroundColor: isLoading || otp.length !== 6 ? '#F3F4F6' : '#E91E63',
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 20,
          shadowColor: '#E91E63',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: isLoading || otp.length !== 6 ? 0 : 0.3,
          shadowRadius: 8,
          elevation: isLoading || otp.length !== 6 ? 0 : 8,
        }}
      >
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: isLoading || otp.length !== 6 ? '#9CA3AF' : '#FFFFFF',
        }}>
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </Text>
      </TouchableOpacity>

      {/* Resend OTP */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <Text style={{ fontSize: 14, color: '#6B7280' }}>
          Didn't receive the code?{' '}
        </Text>
        {countdown > 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RotateCcw size={14} color="#9CA3AF" />
            <Text style={{ fontSize: 14, color: '#9CA3AF', marginLeft: 4 }}>
              Resend in {countdown}s
            </Text>
          </View>
        ) : (
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={{
              fontSize: 14,
              color: '#E91E63',
              fontWeight: '600',
            }}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Back to Phone */}
      <TouchableOpacity
        onPress={handleBackToPhone}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{
          fontSize: 14,
          color: '#6B7280',
          textDecorationLine: 'underline',
        }}>
          Change phone number
        </Text>
      </TouchableOpacity>
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#F3F4F6',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ArrowLeft size={20} color="#1F2937" />
          </TouchableOpacity>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#1F2937',
            marginLeft: 16,
          }}>
            {showOTPInput ? 'Verify Your Number' : 'Phone Login'}
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {showOTPInput ? renderOTPInput() : renderPhoneInput()}

          {!showOTPInput && (
            <>
              {/* Divider */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
              }}>
                <View style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: '#E5E7EB',
                }} />
                <Text style={{
                  fontSize: 14,
                  color: '#6B7280',
                  paddingHorizontal: 16,
                }}>
                  New user?
                </Text>
                <View style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: '#E5E7EB',
                }} />
              </View>

              {/* Sign Up Link */}
              <TouchableOpacity 
                onPress={() => router.push('/auth/signup')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text style={{
                  fontSize: 16,
                  color: '#E91E63',
                  fontWeight: '600',
                }}>
                  Create New Account
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}