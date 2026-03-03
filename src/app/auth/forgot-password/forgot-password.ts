import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
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
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.css',
})
export class ForgotPassword {
    forgotPasswordForm: FormGroup;
    submitted = false;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    onSubmit() {
        if (this.forgotPasswordForm.valid && !this.isLoading) {
            this.isLoading = true;
            this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
                next: (res) => {
                    this.submitted = true;
                    this.isLoading = false;
                    this.snackBar.open(res.message, 'Fermer', { duration: 5000 });
                },
                error: (err) => {
                    this.isLoading = false;
                    this.snackBar.open(err.error?.message || 'Une erreur est survenue', 'Fermer', { duration: 5000 });
                }
            });
        }
    }
}
