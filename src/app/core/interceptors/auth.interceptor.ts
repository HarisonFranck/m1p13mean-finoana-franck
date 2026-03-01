import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { SessionTimeoutDialog } from '../../shared/components/session-timeout-dialog';
import { AuthService } from '../services/auth.service';

let isDialogShowing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const dialog = inject(MatDialog);
    const authService = inject(AuthService);

    const token = authService.getToken();
    let authReq = req;

    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !isDialogShowing) {
                isDialogShowing = true;
                authService.logout(); // Clear token locally

                const dialogRef = dialog.open(SessionTimeoutDialog, {
                    disableClose: true,
                    panelClass: 'premium-dialog-surface'
                });

                dialogRef.afterClosed().subscribe(() => {
                    isDialogShowing = false;
                });
            }
            return throwError(() => error);
        })
    );
};
