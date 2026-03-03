import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  fillShortcut(email: string, password: string) {
    this.loginForm.patchValue({
      email: email,
      password: password,
      rememberMe: true
    });
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login({ email, password }).subscribe({
        next: (res) => {
          this.snackBar.open('Connexion réussie ! Redirection...', '', { duration: 2000 });
          // Decode token to find role
          try {
            const payload = JSON.parse(atob(res.token.split('.')[1]));
            this.authService.setToken(res.token, payload.profile);
            setTimeout(() => {
              if (payload.profile === 'ADMIN') {
                this.router.navigate(['/admin/dashboard']);
              } else if (payload.profile === 'SHOP') {
                this.router.navigate(['/shop/dashboard']);
              } else {
                this.router.navigate(['/client/home']);
              }
              this.isLoading.set(false);
            }, 500);
          } catch (e) {
            this.router.navigate(['/client/home']);
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Erreur de connexion', err);
          this.snackBar.open('Identifiants incorrects.', 'Fermer', { duration: 4000 });
        }
      });
    }
  }
}
