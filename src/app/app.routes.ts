import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './Layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './Layouts/blank-layout/blank-layout.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { ProductsComponent } from './Components/products/products.component';
import { CartComponent } from './Components/cart/cart.component';
import { BrandsComponent } from './Components/brands/brands.component';
import { CategoriesComponent } from './Components/categories/categories.component';
import { authGuard } from './Core/guards/auth.guard';
import { safeGuard } from './Core/guards/safe.guard';
import { DetailsComponent } from './Components/details/details.component';
import { ResetComponent } from './Components/reset/reset.component';
import { AllordersComponent } from './Components/allorders/allorders.component';
import { OrdersComponent } from './Components/orders/orders.component';
import { detailsDataResolver } from './Core/guards/details-data.resolver';
import { WishlistComponent } from './Components/wishlist/wishlist.component';

export const routes: Routes = [
    {path:'',component:AuthLayoutComponent, canActivate:[safeGuard] , children:[
        {path:'',redirectTo:'login',pathMatch:'full'},
        {path:'login', component:LoginComponent},
        {path:'register', component:RegisterComponent},
        {path:'reset', component:ResetComponent}
    ]},
    {path:'',component:BlankLayoutComponent, canActivate:[authGuard] , children:[
        {path:'',redirectTo:'home',pathMatch:'full'},
        {path:'home',component:HomeComponent},
        {path:'products',component:ProductsComponent},
        {path:'cart',component:CartComponent},
        {path:'brands',component:BrandsComponent},
        {path:'categories',component:CategoriesComponent},
        {path:'details/:id',component:DetailsComponent, resolve:{details:detailsDataResolver}},
        {path:'allorders',component:AllordersComponent},
        {path:'orders/:cart_id',component:OrdersComponent},
        {path:'wishlist',component:WishlistComponent},

    ]},
    {path:'',component:AuthLayoutComponent, children:[
        {path:'**',component:NotfoundComponent}
    ]}
    
    
];
