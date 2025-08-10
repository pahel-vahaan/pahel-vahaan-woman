import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Fingerprint } from 'lucide-react-native';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Implement actual signin logic with Firebase
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to main app
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      // TODO: Implement biometric authentication
      Alert.alert('Biometric Login', 'Biometric authentication will be implemented here');
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed');
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
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
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
            Welcome Back
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
              Sign In
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6B7280',
              lineHeight: 24,
            }}>
              Welcome back! Sign in to continue your safe journey with SafeRide
            </Text>
          </View>

          {/* Form */}
          <View style={{ marginBottom: 24 }}>
            {renderInput(
              'Email Address',
              formData.email,
              (text) => setFormData({ ...formData, email: text.toLowerCase() }),
              'email-address',
              false,
              Mail
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
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
          }}>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: rememberMe ? '#E91E63' : '#D1D5DB',
                backgroundColor: rememberMe ? '#E91E63' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}>
                {rememberMe && (
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
              <Text style={{
                fontSize: 14,
                color: '#6B7280',
              }}>
                Remember me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
              <Text style={{
                fontSize: 14,
                color: '#E91E63',
                fontWeight: '500',
              }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#F3F4F6' : '#E91E63',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 20,
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
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Biometric Login */}
          <TouchableOpacity
            onPress={handleBiometricLogin}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              marginBottom: 32,
            }}
          >
            <Fingerprint size={20} color="#6B7280" />
            <Text style={{
              fontSize: 16,
              color: '#6B7280',
              fontWeight: '500',
              marginLeft: 8,
            }}>
              Use Biometric Login
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 32,
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
              or
            </Text>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: '#E5E7EB',
            }} />
          </View>

          {/* Sign Up Link */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 16,
              color: '#6B7280',
            }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={{
                fontSize: 16,
                color: '#E91E63',
                fontWeight: '600',
              }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}