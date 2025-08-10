/**
 * Authentication Service for SafeRide App
 * Handles OTP-based authentication using Firebase Phone Auth
 */
import { firebase } from "./firebase/config";
import { useAuthStore } from "../store/index";

/**
 * AuthService class provides authentication methods
 */
class AuthService {
  constructor() {
    this.unsubscribeAuth = null;
    this.init();
  }

  /**
   * Initialize authentication service
   */
  init() {
    // Listen for authentication state changes
    this.unsubscribeAuth = firebase.auth.onAuthStateChanged((user) => {
      const { setUser, setLoading } = useAuthStore.getState();
      setUser(user);
      setLoading(false);
    });
  }

  /**
   * Send OTP to phone number
   * @param {string} phoneNumber - Phone number with country code (+91xxxxxxxxxx)
   * @returns {Promise<string>} Verification ID for OTP verification
   */
  async sendOTP(phoneNumber) {
    const { setLoading, setError, setOtpVerificationId } =
      useAuthStore.getState();

    try {
      setLoading(true);
      setError(null);

      // Validate phone number format
      if (!this.isValidPhoneNumber(phoneNumber)) {
        throw new Error("Please enter a valid phone number");
      }

      // Format phone number (ensure it starts with +91)
      const formattedNumber = this.formatPhoneNumber(phoneNumber);

      // Send OTP via Firebase
      const verificationId = await firebase.auth.sendOTP(formattedNumber);

      // Store verification ID in store
      setOtpVerificationId(verificationId);

      // Log analytics event
      await firebase.analytics.logEvent("otp_sent", {
        phone_number_length: formattedNumber.length,
        country_code: "+91",
      });

      return verificationId;
    } catch (error) {
      console.error("Send OTP error:", error);
      setError(error.message || "Failed to send OTP");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Verify OTP and complete authentication
   * @param {string} verificationId - Verification ID from sendOTP
   * @param {string} otp - 6-digit OTP code
   * @returns {Promise<Object>} Authenticated user object
   */
  async verifyOTP(verificationId, otp) {
    const { setLoading, setError, setUser } = useAuthStore.getState();

    try {
      setLoading(true);
      setError(null);

      // Validate OTP format
      if (!this.isValidOTP(otp)) {
        throw new Error("Please enter a valid 6-digit OTP");
      }

      // Verify OTP with Firebase
      const user = await firebase.auth.verifyOTP(verificationId, otp);

      // Update user in store
      setUser(user);

      // Save user data to Firestore
      await this.saveUserToDatabase(user);

      // Log analytics event
      await firebase.analytics.logEvent("user_login", {
        method: "phone",
        user_id: user.uid,
      });

      // Set user properties for analytics
      await firebase.analytics.setUserProperties({
        user_id: user.uid,
        phone_verified: true,
        signup_method: "phone",
      });

      return user;
    } catch (error) {
      console.error("Verify OTP error:", error);
      setError(error.message || "Invalid OTP. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  async signOut() {
    const { setLoading, setError, clearAuth } = useAuthStore.getState();

    try {
      setLoading(true);
      setError(null);

      // Sign out from Firebase
      await firebase.auth.signOut();

      // Clear authentication state
      clearAuth();

      // Log analytics event
      await firebase.analytics.logEvent("user_logout");
    } catch (error) {
      console.error("Sign out error:", error);
      setError(error.message || "Failed to sign out");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Update user profile information
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated user object
   */
  async updateProfile(updates) {
    const { setLoading, setError, updateUser } = useAuthStore.getState();

    try {
      setLoading(true);
      setError(null);

      // Update profile in Firebase Auth
      const updatedUser = await firebase.auth.updateProfile(updates);

      // Update user in Firestore
      await this.updateUserInDatabase(updatedUser.uid, updates);

      // Update user in store
      updateUser(updates);

      // Log analytics event
      await firebase.analytics.logEvent("profile_updated", {
        user_id: updatedUser.uid,
        fields_updated: Object.keys(updates),
      });

      return updatedUser;
    } catch (error) {
      console.error("Update profile error:", error);
      setError(error.message || "Failed to update profile");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Add emergency contact for user
   * @param {Object} contact - Emergency contact details
   * @returns {Promise<Object>} Updated user object
   */
  async addEmergencyContact(contact) {
    const { user, updateUser } = useAuthStore.getState();

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const newContact = {
        id: `contact-${Date.now()}`,
        ...contact,
        createdAt: new Date(),
      };

      const updatedContacts = [...(user.emergencyContacts || []), newContact];

      // Update in database
      await this.updateUserInDatabase(user.uid, {
        emergencyContacts: updatedContacts,
      });

      // Update in store
      updateUser({ emergencyContacts: updatedContacts });

      // Log analytics event
      await firebase.analytics.logEvent("emergency_contact_added", {
        user_id: user.uid,
        total_contacts: updatedContacts.length,
      });

      return newContact;
    } catch (error) {
      console.error("Add emergency contact error:", error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} Current user or null
   */
  getCurrentUser() {
    return firebase.auth.getCurrentUser();
  }

  /**
   * Save user data to Firestore database
   * @param {Object} user - User object to save
   * @returns {Promise<void>}
   */
  async saveUserToDatabase(user) {
    try {
      await firebase.firestore
        .collection("users")
        .doc(user.uid)
        .set({
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName || "",
          email: user.email || null,
          isVerified: user.isVerified,
          emergencyContacts: user.emergencyContacts || [],
          savedAddresses: user.savedAddresses || [],
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
    } catch (error) {
      console.error("Failed to save user to database:", error);
      // Don't throw error as auth should still succeed
    }
  }

  /**
   * Update user data in Firestore database
   * @param {string} userId - User ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<void>}
   */
  async updateUserInDatabase(userId, updates) {
    try {
      await firebase.firestore
        .collection("users")
        .doc(userId)
        .update({
          ...updates,
          updatedAt: new Date(),
        });
    } catch (error) {
      console.error("Failed to update user in database:", error);
      throw error;
    }
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} True if valid
   */
  isValidPhoneNumber(phoneNumber) {
    // Indian phone number validation (10 digits after +91)
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber.replace(/\s+/g, ""));
  }

  /**
   * Format phone number to international format
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Remove all spaces and special characters
    let cleaned = phoneNumber.replace(/\s+/g, "").replace(/[^0-9+]/g, "");

    // Add +91 if not present
    if (!cleaned.startsWith("+91")) {
      if (cleaned.startsWith("91")) {
        cleaned = "+" + cleaned;
      } else if (cleaned.startsWith("+")) {
        // Already has + but not 91
        cleaned = "+91" + cleaned.substring(1);
      } else {
        // No country code
        cleaned = "+91" + cleaned;
      }
    }

    return cleaned;
  }

  /**
   * Validate OTP format
   * @param {string} otp - OTP to validate
   * @returns {boolean} True if valid
   */
  isValidOTP(otp) {
    // OTP should be exactly 6 digits
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  }

  /**
   * Resend OTP (with rate limiting)
   * @param {string} phoneNumber - Phone number to resend OTP
   * @returns {Promise<string>} New verification ID
   */
  async resendOTP(phoneNumber) {
    // Add 30-second rate limiting
    const lastOTPTime = localStorage.getItem("lastOTPTime");
    const now = Date.now();

    if (lastOTPTime && now - parseInt(lastOTPTime) < 30000) {
      const remainingTime = Math.ceil(
        (30000 - (now - parseInt(lastOTPTime))) / 1000,
      );
      throw new Error(
        `Please wait ${remainingTime} seconds before resending OTP`,
      );
    }

    // Store current time
    localStorage.setItem("lastOTPTime", now.toString());

    // Send new OTP
    return this.sendOTP(phoneNumber);
  }

  /**
   * Cleanup authentication service
   */
  cleanup() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }
  }
}

// Create and export auth service instance
export const authService = new AuthService();

export default authService;
