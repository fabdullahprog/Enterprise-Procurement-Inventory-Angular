import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Model object containing all required fields for registration
  registerData: RegisterRequest = {
    fullName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '' // Added to resolve "Confirm password is required" error
  };

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  /**
   * Handles the registration form submission
   */
  onRegister(): void {
    // Client-side validation to ensure passwords match before calling the API
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: (res: any) => {
        console.log('Registration Success', res);
        alert('Registration Successful!');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Registration failed', err);
        // Extracting specific error message from server response if available
        const msg = err.error?.errors?.ConfirmPassword?.[0] || 'Registration failed. Please try again.';
        alert(msg);
      }
    });
  }
}