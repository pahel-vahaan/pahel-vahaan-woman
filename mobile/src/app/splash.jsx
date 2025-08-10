import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Shield, Heart } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#E91E63',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    }}>
      <StatusBar style="light" />
      
      {/* Logo and Brand */}
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        alignItems: 'center',
        marginBottom: 40,
      }}>
        <View style={{
          width: 120,
          height: 120,
          backgroundColor: '#FFFFFF',
          borderRadius: 60,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 10,
        }}>
          <Shield size={60} color="#E91E63" />
          <Heart size={24} color="#E91E63" style={{ position: 'absolute', bottom: 20, right: 20 }} />
        </View>
        
        <Text style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          SafeRide
        </Text>
        
        <Text style={{
          fontSize: 16,
          color: '#FFFFFF',
          textAlign: 'center',
          opacity: 0.9,
        }}>
          Women • Safety • Trust
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '600',
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: 12,
        }}>
          Safe Rides for Women
        </Text>
        
        <Text style={{
          fontSize: 16,
          color: '#FFFFFF',
          textAlign: 'center',
          opacity: 0.8,
          lineHeight: 22,
        }}>
          Your trusted companion for secure{'\n'}and comfortable journeys
        </Text>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View style={{
        position: 'absolute',
        bottom: 80,
        opacity: fadeAnim,
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 3,
          borderColor: '#FFFFFF',
          borderTopColor: 'transparent',
        }}>
          <Animated.View style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            borderWidth: 3,
            borderColor: 'transparent',
            borderTopColor: '#FFFFFF',
            transform: [{
              rotate: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            }],
          }} />
        </View>
      </Animated.View>
    </View>
  );
}