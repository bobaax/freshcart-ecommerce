import { AuthService } from './../services/auth.service';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  errorMsg: string = '';
  isLoading = false;
  registerform!: FormGroup;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  confirmPassword(group: AbstractControl) {
    if (group.get('password')?.value === group.get('rePassword')?.value) { return null; }
    else {
      group.get('rePassword')?.setErrors({ missMatch: true });
      return { missMatch: true };
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerform = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
      rePassword: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]) // ✅ إصلاح: تم إضافة validation للهاتف
    }, { validators: this.confirmPassword });
  }

  submitForm(): void {
    if (this.registerform.valid) {
      this.isLoading = true;
      this.authService.registerForm(this.registerform.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            if (res.message === 'success') {
              this.errorMsg = '';
              this.isLoading = false;
              this.registerform.reset();
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 1000);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMsg = err.error.message;
          }
        });
    } else {
      this.registerform.markAllAsTouched();
    }
  }
}

