import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../../shared/components/input/input.component";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  verifyEmail!: FormGroup;
  verifyCode!: FormGroup;
  resetPassword!: FormGroup;

  step: number = 1;

  ngOnInit(): void {
    this.initforms();
  }

  initforms(): void {
    this.verifyEmail = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
    this.verifyCode = this.fb.group({
      resetCode: [null, [Validators.required, Validators.pattern(/^\w{4,10}$/)]]
    });
    this.resetPassword = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      newPassword: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
    });
  }

  formStepOne(): void {
    if (this.verifyEmail.valid) {
      this.authService.submitVerifyEmail(this.verifyEmail.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (_res) => {
            this.step = 2;
          },
          error: (err) => {
            console.error('Error verifying email:', err);
          }
        });
    }
  }

  formStepTwo(): void {
    if (this.verifyCode.valid) {
      this.authService.submitVerifyCode(this.verifyCode.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (_res) => {
            this.step = 3;
          },
          error: (err) => {
            console.error('Error verifying code:', err);
          }
        });
    }
  }

  formStepThree(): void {
    if (this.resetPassword.valid) {
      this.authService.submitResetPassword(this.resetPassword.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (_res) => {
            // ✅ إصلاح: لا نحفظ token مؤقت — نوجّه المستخدم لتسجيل الدخول بكلمة المرور الجديدة
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error resetting password:', err);
          }
        });
    }
  }
}

