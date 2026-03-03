import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        RouterLink,
    ],
    templateUrl: './reset-password.html',
    styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
    resetPasswordForm: FormGroup;
    isLoading = false;
    token: string | null = null;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.resetPasswordForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validator: this.passwordMatchValidator });
    }

    ngOnInit() {
        this.token = this.route.snapshot.queryParamMap.get('token');
        if (!this.token) {
            this.snackBar.open('Lien de réinitialisation invalide ou expiré', 'Fermer', { duration: 5000 });
            this.router.navigate(['/auth/login']);
        }
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    onSubmit() {
        if (this.resetPasswordForm.valid && this.token && !this.isLoading) {
            this.isLoading = true;
            this.authService.resetPassword(this.token, this.resetPasswordForm.value.password).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    this.snackBar.open(res.message, 'Fermer', { duration: 5000 });
                    this.router.navigate(['/auth/login']);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.snackBar.open(err.error?.message || 'Une erreur est survenue', 'Fermer', { duration: 5000 });
                }
            });
        }
    }
}
