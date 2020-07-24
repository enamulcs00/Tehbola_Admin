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
import { VendorSalesReportComponent } from './vendor-sales-report/vendor-sales-report.component';
import { ReportGraphComponent } from './report-graph/report-graph.component';
import { TermofuseComponent } from './termofuse/termofuse.component';
import { TermofsalesComponent } from './termofsales/termofsales.component';
import { ConsumerprivacypolicyComponent } from './consumerprivacypolicy/consumerprivacypolicy.component';
import { WarrantypolicyComponent } from './warrantypolicy/warrantypolicy.component';
import { AuthGuard } from 'src/services/auth.guard';
import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';

const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   component: LoginComponent
  // },

  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
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
    component: ResetPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sidebar',
    component: SidebarComponent
  },
  {
    path: 'navbar',
    component: NavbarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manageUser',
    component: ManageUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'adduser',
    component: AdduserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addproduct',
    component: AddproductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addinventory',
    component: AddinventoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ordermanagement',
    component: OrdermanagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addordermanagement',
    component: AddordermanagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reportpage',
    component: ReportpageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'inventryManagement',
    component: InventryManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'viewinventory',
    component: ViewinventoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manageEarning',
    component: ManageEarningComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'refund',
    component: RefundComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manageReviews',
    component: ManageReviewsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'venderManagement',
    component: VenderManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addVender',
    component: AddVenderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bookingRequestHistory',
    component: BookingRequestHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'viewUser',
    component: ViewUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editUser',
    component: EditUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editProduct',
    component: EditProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'viewProduct',
    component: ViewProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editOrder',
    component: EditOrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'viewOrder',
    component: ViewOrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'viewVendor',
    component: ViewVendorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editVendor',
    component: EditVendorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'deals',
    component: DealsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'banner',
    component: BannerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editcategory',
    component: EditcategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addcategory',
    component: AddcategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'viewcategory',
    component: ViewcategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cms',
    component: CmsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'faq',
    component: FaqComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'subcategory',
    component: SubcategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editsubcategory',
    component: EditsubcategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'viewsubcategory',
    component: ViewsubcategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addsubcategory',
    component: AddsubcategoryComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'viewdiscount',
    component: ViewdiscountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editdiscount',
    component: EditdiscountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'offerdeals',
    component: OfferdealsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addoffers',
    component: AddoffersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notification',
    component: NotificationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'termcondition',
    component: TermconditionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contactus',
    component: ContactusComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'privacypolicy',
    component: PrivacypolicyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'returnpolicy',
    component: ReturnpolicyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ventorT',
    component: VentorTComponent,
    canActivate: [AuthGuard]
  },


  {
    path: 'salesreport',
    component: SalesreportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'revenuereport',
    component: RevenuereportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reveuegraph',
    component: ReveuegraphComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'salesgraph',
    component: SalesgraphComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'changepassword',
    component: ChangepasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editprofile',
    component: EditprofileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vendorSalesReport',
    component: VendorSalesReportComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'reportGraph',
    component: ReportGraphComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'termofuse',
    component: TermofuseComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'termofsales',
    component: TermofsalesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'consumerprivacypolicy',
    component: ConsumerprivacypolicyComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'warrantypolicy',
    component: WarrantypolicyComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'deliveryAddress',
    component: DeliveryAddressComponent,
    canActivate: [AuthGuard]

  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
