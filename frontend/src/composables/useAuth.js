"use client"

import { ref, computed } from "vue"

// Create a reactive state that will be shared across components
const user = ref(null)
const isAuthenticated = computed(() => !!user.value)

// Initialize from localStorage if available
try {
  const savedUser = localStorage.getItem("user")
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
} catch (error) {
  console.error("Error loading auth state:", error)
}

export function useAuth() {
  // Login function
  const login = (userData) => {
    user.value = {
      ...userData,
      id: Date.now().toString(), // Generate a fake user ID
    }

    // Save to localStorage if rememberMe is true
    if (userData.rememberMe) {
      localStorage.setItem("user", JSON.stringify(user.value))
    }
  }

  // Logout function
  const logout = () => {
    user.value = null
    localStorage.removeItem("user")
  }

  // Update user profile
  const updateProfile = (profileData) => {
    if (user.value) {
      user.value = {
        ...user.value,
        ...profileData,
      }

      // Update localStorage if user was remembered
      if (localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(user.value))
      }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile,
  }
}

