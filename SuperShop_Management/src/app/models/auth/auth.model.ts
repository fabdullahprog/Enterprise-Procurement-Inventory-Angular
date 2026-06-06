/**
 * Interface for user login credentials
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface for successful authentication response from API
 */
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    userName: string;
    email: string;
  };
}

/**
 * Interface for new user registration data
 * Added to resolve the error in image_b502be.jpg
 */
export interface RegisterRequest {
  fullName?: string;
  userName: string;
  email: string;
  password: string;
}

// Updated RegisterRequest interface
export interface RegisterRequest {
  fullName?: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string; // Add this line
}