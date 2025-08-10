import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle, 
  Shield, 
  AlertTriangle,
  Send,
  Bot,
  User as UserIcon,
  Clock
} from 'lucide-react-native';

// Mock chat messages
const mockMessages = [
  {
    id: '1',
    type: 'bot',
    message: 'Hello! I\'m SafeRide Assistant. How can I help you today?',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    type: 'user',
    message: 'I need help with my recent ride booking',
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    type: 'bot',
    message: 'I\'d be happy to help you with your ride booking. Could you please provide me with your booking ID or tell me more about the issue you\'re experiencing?',
    timestamp: '10:31 AM',
  },
];

const supportOptions = [
  {
    id: '1',
    title: 'Emergency Support',
    subtitle: '24/7 immediate assistance',
    icon: Shield,
    color: '#EF4444',
    action: 'emergency',
  },
  {
    id: '2',
    title: 'Ride Issues',
    subtitle: 'Problems with current or past rides',
    icon: AlertTriangle,
    color: '#F59E0B',
    action: 'ride_issues',
  },
  {
    id: '3',
    title: 'Payment Help',
    subtitle: 'Billing and payment questions',
    icon: HelpCircle,
    color: '#10B981',
    action: 'payment_help',
  },
  {
    id: '4',
    title: 'Call Support',
    subtitle: 'Speak with our team',
    icon: Phone,
    color: '#3B82F6',
    action: 'call_support',
  },
  {
    id: '5',
    title: 'Email Support',
    subtitle: 'Send us a detailed message',
    icon: Mail,
    color: '#8B5CF6',
    action: 'email_support',
  },
  {
    id: '6',
    title: 'General Help',
    subtitle: 'FAQs and app guidance',
    icon: MessageCircle,
    color: '#E91E63',
    action: 'general_help',
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const [inputMessage, setInputMessage] = useState('');

  const handleSupportOption = (action) => {
    switch (action) {
      case 'emergency':
        Alert.alert(
          'Emergency Support',
          'For immediate emergency assistance, please call our 24/7 helpline or use the SOS button in the app.',
          [
            { text: 'Call Now', onPress: () => callEmergency() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        break;
      case 'call_support':
        Alert.alert(
          'Call Support',
          'Would you like to call our support team?',
          [
            { text: 'Call Now', onPress: () => callSupport() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        break;
      case 'email_support':
        Alert.alert('Email Support', 'Opening email client...');
        break;
      default:
        setShowChat(true);
        addBotMessage(`I'm here to help you with ${action.replace('_', ' ')}. What specific issue are you facing?`);
        break;
    }
  };

  const callEmergency = () => {
    // TODO: Implement emergency call functionality
    Alert.alert('Emergency Call', 'Calling emergency support...');
  };

  const callSupport = () => {
    // TODO: Implement support call functionality
    Alert.alert('Support Call', 'Calling support team...');
  };

  const addBotMessage = (message) => {
    const newMessage = {
      id: Date.now().toString(),
      type: 'bot',
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      addBotMessage('Thank you for your message. Our support team will get back to you shortly. Is there anything else I can help you with?');
    }, 1000);
  };

  const renderMessage = (message) => {
    const isBot = message.type === 'bot';
    
    return (
      <View
        key={message.id}
        style={{
          flexDirection: 'row',
          marginBottom: 16,
          alignItems: 'flex-start',
        }}
      >
        {isBot && (
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#E91E63',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Bot size={18} color="#FFFFFF" />
          </View>
        )}
        
        <View style={{
          flex: 1,
          alignItems: isBot ? 'flex-start' : 'flex-end',
        }}>
          <View style={{
            backgroundColor: isBot ? '#F3F4F6' : '#E91E63',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            maxWidth: '80%',
            borderBottomLeftRadius: isBot ? 4 : 16,
            borderBottomRightRadius: isBot ? 16 : 4,
          }}>
            <Text style={{
              fontSize: 16,
              color: isBot ? '#1F2937' : '#FFFFFF',
              lineHeight: 22,
            }}>
              {message.message}
            </Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
            marginHorizontal: 4,
          }}>
            <Clock size={12} color="#9CA3AF" />
            <Text style={{
              fontSize: 12,
              color: '#9CA3AF',
              marginLeft: 4,
            }}>
              {message.timestamp}
            </Text>
          </View>
        </View>
        
        {!isBot && (
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#6B7280',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 12,
          }}>
            <UserIcon size={18} color="#FFFFFF" />
          </View>
        )}
      </View>
    );
  };

  const renderSupportOption = (option) => {
    const IconComponent = option.icon;
    
    return (
      <TouchableOpacity
        key={option.id}
        onPress={() => handleSupportOption(option.action)}
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: `${option.color}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
            <IconComponent size={24} color={option.color} />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: 4,
            }}>
              {option.title}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
              lineHeight: 20,
            }}>
              {option.subtitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (showChat) {
    return (
      <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
        <View style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          paddingTop: insets.top,
        }}>
          <StatusBar style="dark" />
          
          {/* Chat Header */}
          <View style={{
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#1F2937',
              }}>
                SafeRide Support
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#10B981',
                marginTop: 2,
              }}>
                Online • Typically replies instantly
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => setShowChat(false)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: '#F3F4F6',
              }}
            >
              <Text style={{ fontSize: 14, color: '#6B7280' }}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
          </ScrollView>

          {/* Message Input */}
          <View style={{
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 20,
            paddingVertical: 16,
            paddingBottom: insets.bottom + 16,
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F9FAFB',
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}>
              <TextInput
                placeholder="Type your message..."
                value={inputMessage}
                onChangeText={setInputMessage}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: '#1F2937',
                }}
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={500}
              />
              
              <TouchableOpacity
                onPress={sendMessage}
                disabled={!inputMessage.trim()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: inputMessage.trim() ? '#E91E63' : '#E5E7EB',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 12,
                }}
              >
                <Send size={18} color={inputMessage.trim() ? '#FFFFFF' : '#9CA3AF'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingAnimatedView>
    );
  }

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
          marginBottom: 8,
        }}>
          Support & Help
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#6B7280',
          lineHeight: 22,
        }}>
          We're here to help you 24/7. Choose how you'd like to get support.
        </Text>
      </View>

      {/* Support Options */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {supportOptions.map(renderSupportOption)}
        
        {/* Additional Info */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginTop: 20,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: 8,
          }}>
            Need Immediate Help?
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6B7280',
            lineHeight: 20,
            marginBottom: 12,
          }}>
            For emergencies during a ride, use the SOS button on the home screen. For urgent support, call our 24/7 helpline.
          </Text>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FEF3F2',
            borderRadius: 8,
            padding: 12,
          }}>
            <Shield size={20} color="#EF4444" />
            <Text style={{
              fontSize: 14,
              color: '#DC2626',
              fontWeight: '500',
              marginLeft: 8,
            }}>
              Emergency Helpline: +91-911-SAFERIDE
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}