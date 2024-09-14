import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../Core/Services/authentication.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly _AuthenticationService = inject(AuthenticationService);
  private readonly _Router = inject(Router);

  errorMessage: string = '';
  isLoading: boolean = false;
  successStatus: boolean = false;
  registerSubscription!: Subscription;

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^.{6,}$/),
      ]),
      rePassword: new FormControl(null),
    },
    this.confirmPassword
  );

  confirmPassword(g: AbstractControl) {
    if (g.get('password')?.value === g.get('rePassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }

  registerSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerSubscription = this._AuthenticationService
        .createUser(this.registerForm.value)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.message == 'success') {
              this.successStatus = true;
              setTimeout(() => {
                this._Router.navigate(['/login']);
                this.successStatus = false;
              }, 1000);
            }
          },
          error: (err) => {
            this.errorMessage = err.error.message;
            this.isLoading = false;
          },
        });
    } else {
      this.registerForm.setErrors({ mismatch: true });
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.registerSubscription?.unsubscribe();
  }
}
