import { Component, inject, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../Core/Services/authentication.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private readonly _AuthenticationService = inject(AuthenticationService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);

  isLoading: boolean = false;
  errorMessage: string = '';
  successStatus: boolean = false;
  loginSubscription!: Subscription;

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  confirmUser(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginSubscription = this._AuthenticationService
        .checkUser(this.loginForm.value)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            console.log(res);
            if (res.message == 'success') {
              this.successStatus = true;
              setTimeout(() => {
                //Save Token
                localStorage.setItem('userToken', res.token);

                //decode Token
                this._AuthenticationService.saveUserData();
                this._Router.navigate(['/home']);
                this.successStatus = false;
              }, 1000);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error.message;
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}
