/**
 * State Management using Zustand (Redux Toolkit alternative)
 * Provides centralized state for the SafeRide app
 */
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { RideStatus, PaymentStatus, VehicleType } from "../types/index";

/**
 * Authentication Store
 * Manages user authentication state and actions
 */
export const useAuthStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    user: null,
    isAuthenticated: false,
    isLoading: false,
    otpVerificationId: null,
    error: null,

    // Actions
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setOtpVerificationId: (otpVerificationId) => set({ otpVerificationId }),
    clearAuth: () =>
      set({
        user: null,
        isAuthenticated: false,
        otpVerificationId: null,
        error: null,
      }),
    updateUser: (userData) =>
      set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
  })),
);

/**
 * Ride Store
 * Manages ride booking, tracking, and history
 */
export const useRideStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    currentRide: null,
    rideHistory: [],
    availableDrivers: [],
    isBooking: false,
    isTracking: false,
    selectedVehicleType: VehicleType.BIKE,
    pickupLocation: null,
    dropLocation: null,
    estimatedFare: null,
    error: null,

    // Actions
    setCurrentRide: (ride) => set({ currentRide: ride }),
    addToHistory: (ride) =>
      set((state) => ({
        rideHistory: [ride, ...state.rideHistory],
      })),
    setAvailableDrivers: (drivers) => set({ availableDrivers: drivers }),
    setBooking: (isBooking) => set({ isBooking }),
    setTracking: (isTracking) => set({ isTracking }),
    setSelectedVehicleType: (vehicleType) =>
      set({ selectedVehicleType: vehicleType }),
    setPickupLocation: (location) => set({ pickupLocation: location }),
    setDropLocation: (location) => set({ dropLocation: location }),
    setEstimatedFare: (fare) => set({ estimatedFare: fare }),
    setError: (error) => set({ error }),
    clearRideData: () =>
      set({
        pickupLocation: null,
        dropLocation: null,
        estimatedFare: null,
        availableDrivers: [],
        error: null,
      }),
    updateRideStatus: (status) =>
      set((state) => ({
        currentRide: state.currentRide
          ? {
              ...state.currentRide,
              status,
              updatedAt: new Date(),
            }
          : null,
      })),
  })),
);

/**
 * Driver Store (for Driver App)
 * Manages driver-specific state and ride requests
 */
export const useDriverStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    driver: null,
    isOnline: false,
    currentRide: null,
    rideRequests: [],
    earnings: {
      todayEarnings: 0,
      weeklyEarnings: 0,
      monthlyEarnings: 0,
      totalEarnings: 0,
    },
    currentLocation: null,
    isLoading: false,
    error: null,

    // Actions
    setDriver: (driver) => set({ driver }),
    setOnlineStatus: (isOnline) => set({ isOnline }),
    setCurrentRide: (ride) => set({ currentRide: ride }),
    addRideRequest: (ride) =>
      set((state) => ({
        rideRequests: [...state.rideRequests, ride],
      })),
    removeRideRequest: (rideId) =>
      set((state) => ({
        rideRequests: state.rideRequests.filter((r) => r.id !== rideId),
      })),
    setEarnings: (earnings) => set({ earnings }),
    setCurrentLocation: (location) => set({ currentLocation: location }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    clearRideRequests: () => set({ rideRequests: [] }),
  })),
);

/**
 * Payment Store
 * Manages payment methods, transactions, and receipts
 */
export const usePaymentStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    paymentMethods: [],
    currentPayment: null,
    receipts: [],
    isProcessing: false,
    error: null,

    // Actions
    setPaymentMethods: (methods) => set({ paymentMethods: methods }),
    addPaymentMethod: (method) =>
      set((state) => ({
        paymentMethods: [...state.paymentMethods, method],
      })),
    setCurrentPayment: (payment) => set({ currentPayment: payment }),
    addReceipt: (receipt) =>
      set((state) => ({
        receipts: [receipt, ...state.receipts],
      })),
    setProcessing: (isProcessing) => set({ isProcessing }),
    setError: (error) => set({ error }),
    updatePaymentStatus: (status) =>
      set((state) => ({
        currentPayment: state.currentPayment
          ? {
              ...state.currentPayment,
              status,
            }
          : null,
      })),
  })),
);

/**
 * Location Store
 * Manages user location, permissions, and tracking
 */
export const useLocationStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    currentLocation: null,
    hasLocationPermission: false,
    isTrackingLocation: false,
    isLoading: false,
    error: null,

    // Actions
    setCurrentLocation: (location) => set({ currentLocation: location }),
    setLocationPermission: (hasPermission) =>
      set({ hasLocationPermission: hasPermission }),
    setTrackingLocation: (isTracking) =>
      set({ isTrackingLocation: isTracking }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  })),
);

/**
 * Notification Store
 * Manages push notifications and alerts
 */
export const useNotificationStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    notifications: [],
    unreadCount: 0,
    pushToken: null,
    hasPermission: false,

    // Actions
    addNotification: (notification) =>
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      })),
    markAsRead: (notificationId) =>
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
    markAllAsRead: () =>
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      })),
    setPushToken: (token) => set({ pushToken: token }),
    setPermission: (hasPermission) => set({ hasPermission }),
    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
  })),
);

/**
 * Chat Store
 * Manages in-app messaging between passenger and driver
 */
export const useChatStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    messages: [],
    activeRideChat: null,
    isTyping: false,
    unreadMessages: 0,

    // Actions
    addMessage: (message) =>
      set((state) => ({
        messages: [...state.messages, message],
        unreadMessages:
          message.senderType !== "self"
            ? state.unreadMessages + 1
            : state.unreadMessages,
      })),
    setActiveRideChat: (rideId) => set({ activeRideChat: rideId }),
    setTyping: (isTyping) => set({ isTyping }),
    markMessagesAsRead: (rideId) =>
      set((state) => ({
        messages: state.messages.map((m) =>
          m.rideId === rideId ? { ...m, read: true } : m,
        ),
        unreadMessages: 0,
      })),
    clearChat: (rideId) =>
      set((state) => ({
        messages: state.messages.filter((m) => m.rideId !== rideId),
      })),
  })),
);
