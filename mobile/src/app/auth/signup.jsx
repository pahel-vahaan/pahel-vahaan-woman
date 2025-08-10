import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Phone, Lock, Eye, EyeOff, User } from 'lucide-react-native';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Implement actual signup logic with Firebase
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to OTP verification
      router.push({
        pathname: '/auth/otp-verification',
        params: { phone: formData.phone, email: formData.email }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    secureTextEntry = false,
    icon,
    showPasswordToggle = false
  ) => {
    const IconComponent = icon;
    const fieldName = placeholder.toLowerCase().replace(/\s+/g, '');
    const hasError = errors[fieldName];

    return (
      <View style={{ marginBottom: 20 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F9FAFB',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderWidth: 1,
          borderColor: hasError ? '#EF4444' : '#E5E7EB',
        }}>
          <IconComponent size={20} color={hasError ? '#EF4444' : '#6B7280'} />
          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: '#1F2937',
            }}
            placeholderTextColor="#9CA3AF"
          />
          {showPasswordToggle && (
            <TouchableOpacity
              onPress={() => {
                if (placeholder.includes('Confirm')) {
                  setShowConfirmPassword(!showConfirmPassword);
                } else {
                  setShowPassword(!showPassword);
                }
              }}
            >
              {(placeholder.includes('Confirm') ? showConfirmPassword : showPassword) ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          )}
        </View>
        {hasError && (
          <Text style={{
            color: '#EF4444',
            fontSize: 14,
            marginTop: 4,
            marginLeft: 4,
          }}>
            {hasError}
          </Text>
        )}
      </View>
    );
  };

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
            Create Account
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
          {/* Welcome Text */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: 8,
            }}>
              Join SafeRide
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6B7280',
              lineHeight: 24,
            }}>
              Create your account to start booking safe rides with verified female drivers
            </Text>
          </View>

          {/* Form */}
          <View style={{ marginBottom: 32 }}>
            {renderInput(
              'Full Name',
              formData.fullName,
              (text) => setFormData({ ...formData, fullName: text }),
              'default',
              false,
              User
            )}

            {renderInput(
              'Email Address',
              formData.email,
              (text) => setFormData({ ...formData, email: text.toLowerCase() }),
              'email-address',
              false,
              Mail
            )}

            {renderInput(
              'Phone Number',
              formData.phone,
              (text) => setFormData({ ...formData, phone: text }),
              'phone-pad',
              false,
              Phone
            )}

            {renderInput(
              'Password',
              formData.password,
              (text) => setFormData({ ...formData, password: text }),
              'default',
              !showPassword,
              Lock,
              true
            )}

            {renderInput(
              'Confirm Password',
              formData.confirmPassword,
              (text) => setFormData({ ...formData, confirmPassword: text }),
              'default',
              !showConfirmPassword,
              Lock,
              true
            )}
          </View>

          {/* Terms and Conditions */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 20,
            }}>
              By creating an account, you agree to our{' '}
              <Text style={{ color: '#E91E63', fontWeight: '500' }}>
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text style={{ color: '#E91E63', fontWeight: '500' }}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#F3F4F6' : '#E91E63',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 24,
              shadowColor: '#E91E63',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: loading ? 0 : 0.3,
              shadowRadius: 8,
              elevation: loading ? 0 : 8,
            }}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: loading ? '#9CA3AF' : '#FFFFFF',
            }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 16,
              color: '#6B7280',
            }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signin')}>
              <Text style={{
                fontSize: 16,
                color: '#E91E63',
                fontWeight: '600',
              }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}