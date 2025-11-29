import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './core/layouts/blank-layout/blank-layout.component';
// import { LoginComponent } from './core/auth/login/login.component';
// import { RegisterComponent } from './core/auth/register/register.component';
// import { HomeComponent } from './features/home/home.component';
// import { CartComponent } from './features/cart/cart.component';
// import { ProductsComponent } from './features/products/products.component';
// import { BrandsComponent } from './features/brands/brands.component';
// import { CategoriesComponent } from './features/categories/categories.component';
import { DetailsComponent } from './features/details/details.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { authGuard } from './core/guards/auth-guard';
import { isLoggedGuard } from './core/guards/is-logged-guard';
// import { AllordersComponent } from './features/allorders/allorders.component';
// import { ForgetPasswordComponent } from './core/auth/forget-password/forget-password.component';


export const routes: Routes = [
    {path: '',redirectTo:'home',pathMatch:'full',title:"Home Page"},
    {path:'', component: AuthLayoutComponent , canActivate: [isLoggedGuard]  , children:[
        {path:'login',loadComponent:() => import('./core/auth/login/login.component').then(m => m.LoginComponent), title:"Login Page"},
        {path:'register',loadComponent:() => import('./core/auth/register/register.component').then(m => m.RegisterComponent) , title:"Register Page"},
        {path:'forget',loadComponent:() => import('./core/auth/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent) , title:"ForgetPassword Page"}
    ]},
    {path:'', component: BlankLayoutComponent ,canActivate: [authGuard] , children:[
        {path:'home', loadComponent:() => import('./features/home/home.component').then(m => m.HomeComponent), title:"Home Page"},
        {path:'cart', loadComponent:() => import('./features/cart/cart.component').then(m => m.CartComponent), title:"Cart Page"},
        {path:'products', loadComponent:() => import('./features/products/products.component').then(m => m.ProductsComponent), title:"Products Page"},
        {path:'brands', loadComponent:() => import('./features/brands/brands.component').then(m => m.BrandsComponent), title:"Brand Page"},
        {path:'categories', loadComponent:() => import('./features/categories/categories.component').then(m => m.CategoriesComponent), title:"Categories Page"},
        {path:'allorders', loadComponent:() => import('./features/allorders/allorders.component').then(m => m.AllordersComponent), title:"All Orders Page"},
        {path:'details/:slug/:id', component: DetailsComponent , title:"Details Page"},
        {path:'details/:id', component: DetailsComponent , title:"Details Page"},
        {path:'checkout/:id', component: CheckoutComponent , title:"Checkout Page"},
    ]},
    {path:'**', component: NotfoundComponent , title:"404 Not Found"}
];
