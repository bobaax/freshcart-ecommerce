import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InputComponent } from "../../../shared/components/input/input.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  errorMsg: string = '';
  isLoading = false;
  loginForm!: FormGroup;

  private readonly authService = inject(AuthService);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
    });
  }

  submitLoginForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.loginForm(this.loginForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            if (res.message === 'success') {
              this.errorMsg = '';
              this.cookieService.set('token', res.token);
              this.isLoading = false; // ✅ إصلاح: كانت true بالخطأ
              this.loginForm.reset();
              setTimeout(() => {
                this.router.navigate(['/home']);
              }, 1000);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMsg = err.error.message;
          }
        });
    }
  }
}

