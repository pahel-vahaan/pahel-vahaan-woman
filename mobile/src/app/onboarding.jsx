import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Shield,
  MapPin,
  Phone,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    icon: Shield,
    title: "Welcome to SafeRide",
    subtitle: "Your Safety is Our Priority",
    description:
      "Experience secure rides with verified female drivers. Every journey is monitored for your peace of mind.",
    color: "#E91E63",
  },
  {
    id: 2,
    icon: MapPin,
    title: "Smart Ride Matching",
    subtitle: "Find Nearby Female Drivers",
    description:
      "Our intelligent system connects you with the nearest verified female drivers for quick and safe transportation.",
    color: "#9C27B0",
  },
  {
    id: 3,
    icon: Phone,
    title: "Emergency SOS",
    subtitle: "24/7 Safety Support",
    description:
      "One-tap emergency button instantly alerts your emergency contacts and local authorities with your live location.",
    color: "#FF5722",
  },
  {
    id: 4,
    icon: Star,
    title: "Trusted Community",
    subtitle: "Rate & Review Drivers",
    description:
      "Build a safer community by rating drivers and reading reviews from other women travelers.",
    color: "#4CAF50",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      router.replace("/auth/phone-login");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    router.replace("/auth/phone-login");
  };

  const renderOnboardingItem = (item, index) => {
    const IconComponent = item.icon;

    return (
      <View
        key={item.id}
        style={{
          width,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        }}
      >
        <View
          style={{
            width: 140,
            height: 140,
            backgroundColor: item.color,
            borderRadius: 70,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
            shadowColor: item.color,
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <IconComponent size={70} color="#FFFFFF" />
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#1F2937",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: item.color,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {item.subtitle}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#6B7280",
            textAlign: "center",
            lineHeight: 24,
            paddingHorizontal: 20,
          }}
        >
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: insets.top,
      }}
    >
      <StatusBar style="dark" />

      {/* Skip Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={handleSkip}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#6B7280",
              fontWeight: "500",
            }}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Onboarding Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {onboardingData.map((item, index) => renderOnboardingItem(item, index))}
      </ScrollView>

      {/* Bottom Section */}
      <View
        style={{
          paddingHorizontal: 40,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Page Indicators */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === index ? "#E91E63" : "#E5E7EB",
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: currentIndex === 0 ? "#F3F4F6" : "#E91E63",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChevronLeft
              size={24}
              color={currentIndex === 0 ? "#9CA3AF" : "#FFFFFF"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: "#E91E63",
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 28,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#E91E63",
              shadowOffset: {
                width: 0,
                height: 4,
              },
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
                marginRight: 8,
              }}
            >
              {currentIndex === onboardingData.length - 1
                ? "Get Started"
                : "Next"}
            </Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
