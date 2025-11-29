import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators ,FormGroup, AbstractControl} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  errorMsg:string = '';
  isLoading = false;
  loginForm!:FormGroup;
  subscription:Subscription = new Subscription();

  ngOnInit(): void {
    this.initLoginForm();
  }

  private readonly authService = inject(AuthService);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  confirmPassword(group: AbstractControl) {

  return group.get('password')?.value === group.get('rePassword')?.value ? null : { missMatch: true };

}


  initLoginForm():void {
    this.loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
    } ); }
  

  submitLoginForm():void {
    if (this.loginForm.valid) {
      this.subscription.unsubscribe();
      this.isLoading = true;
      this.subscription = this.authService.loginForm(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          if (res.message === 'success') {
            this.errorMsg = '';
            this.cookieService.set('token', res.token);
            console.log(this.authService.decodeToken());
            setTimeout(() => {
            this.router.navigate(['/home']);
            }, 1000);
            this.isLoading = true;
            this.loginForm.reset();
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          this.isLoading = false;
          this.errorMsg = err.error.message;
        }
      });
    }
    
  }

  
  
}
