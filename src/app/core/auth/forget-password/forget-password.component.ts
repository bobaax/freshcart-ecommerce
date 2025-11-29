import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../../shared/components/input/input.component";
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);
  
  private readonly fb = inject(FormBuilder)
  verifyEmail!:FormGroup;
  verifyCode!:FormGroup;
  resetPassword!:FormGroup;

  step:number =1;

  ngOnInit(): void {
    this.initforms();
  }

  initforms():void {
    this.verifyEmail = this.fb.group({
      email:[null , [Validators.required , Validators.email]]
    });
    this.verifyCode = this.fb.group({
      resetCode:[null , [Validators.required, Validators.pattern(/^\w{4,10}$/)]]
    });
    this.resetPassword = this.fb.group({
      email:[null , [Validators.required , Validators.email]],
      newPassword:[null , [Validators.required , Validators.pattern(/^\w{6,}$/)]],
    });
  }
  formStepOne():void {
    if(this.verifyEmail.valid){
      this.authService.submitVerifyEmail(this.verifyEmail.value).subscribe({
      next:(res)=>{
        console.log(res);
        this.step=2;
      }
    })
    }
  }

  formStepTwo():void {
    if(this.verifyCode.valid){
      this.authService.submitVerifyCode(this.verifyCode.value).subscribe({
      next:(res)=>{
        console.log(res);
        this.step=3;
      }
    })
    }
  }
  formStepThree():void {
    if(this.resetPassword.valid){
      this.authService.submitResetPassword(this.resetPassword.value).subscribe({
      next:(res)=>{
        console.log(res);
        this.cookieService.set('token', res.token);
        this.router.navigate(['/login']);
      }
    })
    }
  }

}
