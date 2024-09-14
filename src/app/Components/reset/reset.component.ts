import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../Core/Services/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss',
})
export class ResetComponent implements OnDestroy{
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthenticationService = inject(AuthenticationService);
  private readonly _Router = inject(Router);

  isLoading: boolean = false;
  errorMessage: string = '';
  successStatus: boolean = false;
  emailCheckSubscription!: Subscription;
  newPasswordSubscription!: Subscription;
  codeCheckSubscription!: Subscription;
  step: number = 1;

  emailCheckForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.email, Validators.required]],
  });

  codeCheckForm: FormGroup = this._FormBuilder.group({
    resetCode: [null, [Validators.pattern(/^[0-9]{6}$/), Validators.required]],
  });

  newPasswordForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.email, Validators.required]],
    newPassword: [null, [Validators.required, Validators.pattern(/^.{6,}$/)]],
  });

  emailSubmit(): void {
    let email = this.emailCheckForm.get('email')?.value;
    this.newPasswordForm.get('email')?.patchValue(email);

    if (this.emailCheckForm.valid) {
      this.isLoading = true;
      this.emailCheckSubscription = this._AuthenticationService
        .resetPasswordSendEmail(this.emailCheckForm.value)
        .subscribe({
          next: (res) => {
            if (res.statusMsg === 'success') {
              this.step++;
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.log(err);
            this.isLoading = false;
          },
        });
    } else {
      this.emailCheckForm.markAllAsTouched();
    }
  }

  codeSubmit(): void {
    if (this.codeCheckForm.valid) {
      this.isLoading = true;
      this.codeCheckSubscription = this._AuthenticationService
        .resetPasswordCheckCode(this.codeCheckForm.value)
        .subscribe({
          next: (res) => {
            if (res.status === 'Success') {
              this.step++;
            }
            this.isLoading = false;
            this.errorMessage = '';
          },
          error: (err) => {
            this.errorMessage = err.error.message;
            this.isLoading = false;
          },
        });
    } else {
      this.codeCheckForm.markAllAsTouched();
    }
  }

  newPasswordSubmit(): void {
    if (this.newPasswordForm.valid) {
      this.isLoading = true;
      this.newPasswordSubscription = this._AuthenticationService
        .resetPasswordNewPassword(this.newPasswordForm.value)
        .subscribe({
          next: (res) => {
            localStorage.setItem('userToken', res.token);
            this._AuthenticationService.saveUserData();
            this.step++;
            this.isLoading = false;
            this._Router.navigate(['/home']);
          },
          error: (err) => {
            this.errorMessage = err.error.message;
            this.isLoading = false;
          },
        });
    } else {
      this.newPasswordForm.markAllAsTouched();
    }
  }
 
  ngOnDestroy(): void {
      this.emailCheckSubscription?.unsubscribe();
      this.codeCheckSubscription?.unsubscribe();
      this.newPasswordSubscription?.unsubscribe();
  }
}
