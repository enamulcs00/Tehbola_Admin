import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { AdduserComponent } from './adduser/adduser.component';
import { ProductComponent } from './product/product.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { AddinventoryComponent } from './addinventory/addinventory.component';
import { OrdermanagementComponent } from './ordermanagement/ordermanagement.component';
import { AddordermanagementComponent } from './addordermanagement/addordermanagement.component';
import { PaymentComponent } from './payment/payment.component';
import { ReportpageComponent } from './reportpage/reportpage.component';
import { InventryManagementComponent } from './inventry-management/inventry-management.component';
import { ViewinventoryComponent } from './viewinventory/viewinventory.component';
import { ManageEarningComponent } from './manage-earning/manage-earning.component';
import { RefundComponent } from './refund/refund.component';
import { ManageReviewsComponent } from './manage-reviews/manage-reviews.component';
import { VenderManagementComponent } from './vender-management/vender-management.component';
import { AddVenderComponent } from './add-vender/add-vender.component';
import { BookingRequestHistoryComponent } from './booking-request-history/booking-request-history.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { ViewVendorComponent } from './view-vendor/view-vendor.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { CategoryComponent } from './category/category.component';
import { DealsComponent } from './deals/deals.component';
import { BannerComponent } from './banner/banner.component';
import { EditcategoryComponent } from './editcategory/editcategory.component';
import { AddcategoryComponent } from './addcategory/addcategory.component';
import { ViewcategoryComponent } from './viewcategory/viewcategory.component';
import { CmsComponent } from './cms/cms.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { EditsubcategoryComponent } from './editsubcategory/editsubcategory.component';
import { ViewsubcategoryComponent } from './viewsubcategory/viewsubcategory.component';
import { AddsubcategoryComponent } from './addsubcategory/addsubcategory.component';
import { ViewdiscountComponent } from './viewdiscount/viewdiscount.component';
import { EditdiscountComponent } from './editdiscount/editdiscount.component';
import { OfferdealsComponent } from './offerdeals/offerdeals.component';
import { AddoffersComponent } from './addoffers/addoffers.component';
import { NotificationComponent } from './notification/notification.component';
import { TermconditionComponent } from './termcondition/termcondition.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { ReturnpolicyComponent } from './returnpolicy/returnpolicy.component';
import { VentorTComponent } from './ventor-t/ventor-t.component';
import { SalesreportComponent } from './salesreport/salesreport.component';
import { RevenuereportComponent } from './revenuereport/revenuereport.component';
import { ReveuegraphComponent } from './reveuegraph/reveuegraph.component';
import { SalesgraphComponent } from './salesgraph/salesgraph.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { EditprofileComponent } from './editprofile/editprofile.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'sidebar',
    component: SidebarComponent
  },
  {
    path: 'navbar',
    component: NavbarComponent
  },
  {
    path: 'manageUser',
    component: ManageUserComponent
  },
  {
    path: 'adduser',
    component: AdduserComponent
  },
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'addproduct',
    component: AddproductComponent
  },
  {
    path: 'addinventory',
    component: AddinventoryComponent
  },
  {
    path: 'ordermanagement',
    component: OrdermanagementComponent
  },
  {
    path: 'addordermanagement',
    component: AddordermanagementComponent
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path: 'reportpage',
    component: ReportpageComponent
  },
  {
    path: 'inventryManagement',
    component: InventryManagementComponent
  },
  {
    path: 'viewinventory',
    component: ViewinventoryComponent
  },
  {
    path: 'manageEarning',
    component: ManageEarningComponent
  },
  {
    path: 'refund',
    component: RefundComponent
  },
  {
    path: 'manageReviews',
    component: ManageReviewsComponent
  },
  {
    path: 'venderManagement',
    component: VenderManagementComponent
  },
  {
    path: 'addVender',
    component: AddVenderComponent
  },
  {
    path: 'bookingRequestHistory',
    component: BookingRequestHistoryComponent
  },
  {
    path: 'viewUser',
    component: ViewUserComponent
  },
  {
    path: 'editUser',
    component: EditUserComponent
  },
  {
    path: 'editProduct',
    component: EditProductComponent
  },
  {
    path: 'viewProduct',
    component: ViewProductComponent
  },
  {
    path: 'editOrder',
    component: EditOrderComponent
  },
  {
    path: 'viewOrder',
    component: ViewOrderComponent
  },
  {
    path: 'viewVendor',
    component: ViewVendorComponent
  },
  {
    path: 'editVendor',
    component: EditVendorComponent
  },
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'deals',
    component: DealsComponent
  },
  {
    path: 'banner',
    component: BannerComponent
  },
  {
    path: 'editcategory',
    component: EditcategoryComponent
  },
  {
    path: 'addcategory',
    component: AddcategoryComponent
  },
  {
    path: 'viewcategory',
    component: ViewcategoryComponent
  },
    {
    path: 'cms',
    component: CmsComponent
  },
      {
    path: 'about',
    component: AboutComponent
  },
     {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'subcategory',
    component: SubcategoryComponent
  },
  {
    path: 'editsubcategory',
    component: EditsubcategoryComponent
  },
  {
    path: 'viewsubcategory',
    component: ViewsubcategoryComponent
  },
  {
    path: 'addsubcategory',
    component: AddsubcategoryComponent
  },

  {
    path: 'viewdiscount',
    component: ViewdiscountComponent
  },
  {
    path: 'editdiscount',
    component: EditdiscountComponent
  },
  {
    path: 'offerdeals',
    component: OfferdealsComponent
  },
  {
    path: 'addoffers',
    component: AddoffersComponent
  },
  {
    path: 'notification',
    component: NotificationComponent
  },
  {
    path: 'termcondition',
    component: TermconditionComponent
  },
  {
    path: 'contactus',
    component: ContactusComponent
  },
  {
    path: 'privacypolicy',
    component: PrivacypolicyComponent
  },
  {
    path: 'returnpolicy',
    component: ReturnpolicyComponent
  },
  {
    path: 'ventorT',
    component: VentorTComponent
  },


  {
    path: 'salesreport',
    component: SalesreportComponent
  },
  {
    path: 'revenuereport',
    component: RevenuereportComponent
  },
  {
    path: 'reveuegraph',
    component: ReveuegraphComponent
  },
  {
    path: 'salesgraph',
    component: SalesgraphComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'changepassword',
    component: ChangepasswordComponent
  },
  {
    path: 'editprofile',
    component: EditprofileComponent
  },







];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
