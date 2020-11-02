import { Injectable, forwardRef } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders, HTTP_INTERCEPTORS } from "@angular/common/http";
import { UrlService } from "./url.service";
//import { LoginBody } from "../../requests/login-body";
import { CommonService } from "./common.service";
import { Observable } from 'rxjs/internal/Observable';
import { HttpRequest } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { of, pipe, Subject } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ApiService {
  BASE_URL: any = this.url.SERVER_URL + '/api/';
  apiEndPoints: any;
  countryCode: any;
  userData = new Subject<any>()

  constructor(
    private http: HttpClient,
    private url: UrlService,
    private comm: CommonService,
    private router: Router,
  ) {
    this.apiEndPoints = {
      //Admin Account
      adminLogin: 'admin/signin',
      adminLogout: 'admin/logout',
      changePassword: 'admin/changePassword',
      forgetPassword: 'app/forgotPassword',
      profile: 'admin/getProfile',
      updateProfile: 'admin/editProfile',
      //User Management
      getAllUser: 'admin/user',
      getUser: 'admin/viewUser',
      editUser: 'admin/user',

      viewOrderHistory: "admin/userOrderHistory",
      status: "admin/status",
      userAddress: "admin/userAddress",
      //Delete
      delete: 'admin/delete',
      //Hard Delete
      hardDelete: 'admin/hardDelete',
      //Products
      getAllProduct: 'admin/product',
      viewProduct: 'admin/viewProduct',

      //Categories
      getAllCategories: 'admin/categories',
      addCategories: 'admin/category',
      viewCategory: 'admin/category',

      //Sub Category
      addSubCategory: 'admin/subCategory',

      //Vendor Management
      getAllVendor: 'admin/getVendors',
      getVendorProducts: 'admin/vendorProducts',

      addVendor: 'admin/vendor',
      vendorsCategory: 'admin/getVendorCategories',
      vendorSubcategory: 'admin/getVendorSubCategories',

      //Banner(Discount)
      getAllBanner: 'admin/banner',
      getAllCategoriesforDiscount: 'admin/getAllCategories',
      getVendorListByCat: 'admin/getVendorsByCat',
      getProductByVendor: 'admin/getProductsByCatOrVendor',
      addBanner: 'admin/banner',
      viewBanner: 'admin/viewBanner',

      //Sales Module Routes
      salesList: 'admin/adminSales',
      processOrder: 'admin/processOrder',
      getSale: 'admin/viewSales',
      salesGraph: 'admin/adminSalesGraph',
      vendorSales: 'admin/graph',
      adminReview: 'admin/reviews',
      updateCms: 'admin/addStaticPage',
      getAllCms: 'admin/getAllStaticPages',
      // dashBoard
      getDashboard: 'admin/adminDashboard',
      //Brand Module
      getBrandList: 'admin/getAllBrand',
      addBrand: 'admin/addBrand',
      editBrand: 'admin/editBrand',

      //get and push notification
      getNotificationList: 'app/notificationListing',
      broadcast: 'admin/broadcast',

      // setting module
      getCountry: 'app/getCountries',
      postShippingCharge: 'admin/shippingCharges',
      getShippingChargesList: 'admin/shippingCharges',
      getSingleShippingCharges: 'admin/viewShippingCharges',
      getTax: 'app/settings',
      updateTax: 'admin/settings',

      //payment module
      getPaymentOfvendor: "admin/payoutsData",
      //revene report
      revenuereport: "admin/revenueReport"

    }
    for (let key in this.apiEndPoints) {
      this.apiEndPoints[key] = this.BASE_URL + this.apiEndPoints[key];
    }
    this.getCountryCode();
  }

  protected getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': this.getToken(),
        'enctype': 'multipart/form-data'
      })
    };
  }


  getCountryCode() {
    return this.http
      .get<Response>("assets/json/countryCode.json")
      .pipe(map(response => response));
  }


  singIn(body: any): Observable<any> {
    return this.http
      .post<any>(this.apiEndPoints.adminLogin, body)
      .pipe(
        catchError(this.handleError<any>('Login'))
      );
  }

  setUserDetails(body) {
    localStorage.setItem('User', body);
  }

  getUserDetails() {
    let data = localStorage.getItem('User')
    return data
  }

  singOut(): Observable<any> {
    return this.http
      .post<any>(this.apiEndPoints.adminLogout, {}, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('Logout'))
      );
  }


  changePassword(body: any): Observable<any> {
    console.log(body);
    return this.http
      .put<any>(this.apiEndPoints.changePassword, body, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('Login'))
      );
  }

  forgetPassword(email): Observable<any> {
    const data = {
      "email": email
    }
    return this.http.
      post<any>(this.apiEndPoints.forgetPassword, data, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('Forgot Password'))
      );
  }

  // Method start of Soft Delete
  async  deleteData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'delete',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getToken(),

      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }




  flagDelete: boolean
  data: any
  async delete(body) {
    // this.flagDelete = false;

    await this.deleteData(this.apiEndPoints.delete, body)
      .then(data => {
        if (data.success) {
          console.log("passed")
          this.flagDelete = true;
          this.data = data
        } else {
          console.log("Failed")
          this.flagDelete == false
        }


      });

  }

  back() {
    window.history.back()
  }
  //Method End For Soft Delete

  //Method End For hard Delete
  async  hardDeleteData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'delete',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getToken(),

      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }




  flaghardDelete: boolean
  harddata: any
  async deleteHard(body) {
    // this.flagDelete = false;

    await this.hardDeleteData(this.apiEndPoints.hardDelete, body)
      .then(data => {
        if (data.success) {
          console.log("passed")
          this.flagDelete = true;
          this.data = data
        } else {
          console.log("Failed")
          this.flagDelete == false
        }


      });

  }
  //method end for hard delete



  setUser(user: any) {
    localStorage.setItem("Rupee_Admin", user);
  }

  getUser() {
    return localStorage.getItem('Rupee_Admin')
  }

  sendToken(token: string) {
    localStorage.setItem("token", token);
  }


  getToken() {
    return localStorage.getItem("token");
  }


  isLoggedIn() {
    return this.getToken() !== null;
  }


  //Products
  getAllProduct(page, count, search) {
    return this.http
      .get<any>(`${this.apiEndPoints.getAllProduct}?page=${page}&count=${count}&search=${search}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('All Product'))
      );
  }

  viewProduct(id: any) {
    return this.http
      .get<any>(`${this.apiEndPoints.viewProduct}?id=${id}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('All Product'))
      );
  }

  getProductByVendor(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.getProductByVendor, body, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('get product by vendor')))

  }

  addBanner(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.addBanner, body, this.getHeaders()).
      pipe(
        catchError(this.handleError<any>("add bannner")))
  }

  updateBanner(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.addBanner, body, this.getHeaders()).
      pipe(
        catchError(this.handleError<any>("add bannner")))
  }

  getDisountDetails(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.viewBanner}?id=${id}`, this.getHeaders()).
      pipe(
        catchError(this.handleError<any>('get discount details')))
  }

  getAllUser(page, count, search, filter) {

    return this.http.get<any>(`${this.apiEndPoints.getAllUser}?page=${page}&count=${count}&search=${search}&filter=${filter}`,
      this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('No user'))
    );

  }

  changeUserStatus(body) {

    return this.http.put<any>(`${this.apiEndPoints.status}`, body, this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('User status')))

  }

  getProfile() {
    return this.http.get<any>(`${this.apiEndPoints.profile}`, this.getHeaders())
      .pipe(catchError(this.handleError<any>('Get Profile')))
  }


  getUserAddress(id) {
    return this.http.get<any>(`${this.apiEndPoints.userAddress}?id=${id}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('user address')))
  }

  updateAddress(body) {
    return this.http.put<any>(`${this.apiEndPoints.userAddress}`, body, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('user address')))
  }



  getVendorList(page, count, filter, search) {

    return this.http.get<any>(`${this.apiEndPoints.getAllVendor}?page=${page}&count=${count}&search=${search}&filter=${filter}`,
      this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('No user'))
    );
  }

  getVendorProduct(id, page, count, search, filter, categoryId, subCategoryId) {
    console.log(id);
    return this.http.get<any>(`${this.apiEndPoints.getVendorProducts}?id=${id}&page=${page}&count=${count}&search=${search}&filter=${filter}&category=${categoryId}&subCategory=${subCategoryId}`,
      this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('Get Vendor Products'))
    );

  }

  getVendorsCategory(id) {

    return this.http.get<any>(`${this.apiEndPoints.vendorsCategory}?id=${id}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('get vendors category')))

  }

  getVendorSubcategory(vendorId, categoryId) {
    return this.http.get<any>(`${this.apiEndPoints.vendorSubcategory}?id=${vendorId}&category=${categoryId}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('get vendors category')))

  }

  getVendorListbyCat(body) {
    return this.http.post<any>(this.apiEndPoints.getVendorListByCat, body, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>("list of vendor by category and sub-category")))
  }

  viewUser(id) {
    return this.http.get<any>(`${this.apiEndPoints.getUser}?id=${id}`,
      this.getHeaders()).
      pipe(catchError(this.handleError<any>('No user')));
  }


  editUser(userUpdate): Observable<any> {
    console.log(userUpdate)
    return this.http.put<any>(this.apiEndPoints.editUser, userUpdate, this.getHeaders()).pipe(
      catchError(this.handleError<any>('Edit User'))
    )
  }

  viewPurchaseHistory(page, count, id, filter, search) {
    console.log(id);
    return this.http.get<any>(`${this.apiEndPoints.viewOrderHistory}?page=${page}&count=${count}&id=${id}&filter=${filter}&search=${search}`,
      this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('No user'))
    );

  }

  //Categories
  getAllCategories(page, count) {
    return this.http
      .get<any>(`${this.apiEndPoints.getAllCategories}?page=${page}&count=${count}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('All Product'))
      );
  }

  getAllCategoriesForDiscount(parentId) {

    return this.http.get<any>(`${this.apiEndPoints.getAllCategoriesforDiscount}?parentId=${parentId}`, this.getHeaders()).pipe(catchError(this.handleError("get all category for discount")))

  }


  addCategory(data) {
    return this.http
      .post<any>(this.apiEndPoints.addCategories, data, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('Add Category'))
      );
  }

  editCategory(data) {
    // const data: FormData = new FormData();
    // data.append('id', category.id);
    // data.append('name', category.name);
    // data.append('name_ar', category.name_ar);
    // data.append('image', category.img);

    return this.http
      .put<any>(this.apiEndPoints.viewCategory, data, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('Edit Category'))
      );
  }

  viewCategory(id) {
    return this.http
      .get<any>(`${this.apiEndPoints.viewCategory}?id=${id}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('View Category'))
      );
  }


  //Sub Category
  addSubCategory(data) {
    return this.http
      .post<any>(this.apiEndPoints.addSubCategory, data, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('Add Category'))
      );
  }

  addVendor(data) {

    console.log(data);

    return this.http
      .post<any>(this.apiEndPoints.addVendor, data, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('Add Vendor'))
      );

  }

  updateProfile(body) {
    console.log(body)

    return this.http.put<any>(`${this.apiEndPoints.updateProfile}`, body, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>("update profile")))
  }


  getAllDiscount(page, pageSize, search, filterBy) {
    return this.http.get<any>(`${this.apiEndPoints.getAllBanner}?page=${page}&count=${pageSize}&search=${search}&filter=${filterBy}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>("get discount(banner)"))
      )
  }

  //Sales Module
  getSaleList(page, pageSize, search, filterBy): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.salesList}?page=${page}&count=${pageSize}&filter=${filterBy}&search=${search}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  updateStatus(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.processOrder, body, this.getHeaders()).pipe(catchError(this.handleError))
  }

  getSale(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getSale}?id=${id}`, this.getHeaders()).pipe(catchError(this.handleError))

  }

  getSalesGraph(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.salesGraph, body, this.getHeaders()).pipe(catchError(this.handleError))
  }

  getVendortSalesGraph(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.vendorSales, body, this.getHeaders()).pipe(catchError(this.handleError))
  }


  getReviewList(page, pageSize, search, filterBy): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.adminReview}?page=${page}&count=${pageSize}&search=${search}&filter=${filterBy}`, this.getHeaders()).pipe(catchError(this.handleError))
  }


  updateCMS(body): Observable<any> {// method to update CMS Pages
    return this.http.post<any>(this.apiEndPoints.updateCms, body, this.getHeaders()).pipe(catchError(this.handleError()));
  }


  getAllCMs(): Observable<any> { // Method  to get All CMS Pages
    return this.http.get<any>(this.apiEndPoints.getAllCms, this.getHeaders()).pipe(catchError(this.handleError));
  }


  getDashboardData(page, pageSize, search, filterBy, type, typeGraph, revenueFilter): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getDashboard}?page=${page}&count=${pageSize}&search=${search}&filter=${filterBy}&type=${type}&vendorGraphType=${typeGraph}&revenueType=${revenueFilter}`, this.getHeaders()).pipe(catchError(this.handleError));

  }

  getBrandList(): Observable<any> {

    return this.http.get<any>(this.apiEndPoints.getBrandList, this.getHeaders()).pipe(catchError(this.handleError()))

  }

  addBrand(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.addBrand, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  editBrand(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.editBrand, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getNotification(type, page, count): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getNotificationList}?page=${page}&count=${count}&type=${type}`, this.getHeaders()).pipe(catchError(this.handleError))
  }

  broadcastNotification(value): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.broadcast, value, this.getHeaders()).pipe(catchError(this.handleError()))
  }
  getCountryList(data): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getCountry}?page=1&count=10&search=${data}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  addShippingRate(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.postShippingCharge, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getShippingRateList(): Observable<any> {
    return this.http.get<any>(this.apiEndPoints.getShippingChargesList, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getSingleShippingCharge(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getSingleShippingCharges}?id=${id}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  updateShippingRate(body) {
    return this.http.put<any>(this.apiEndPoints.postShippingCharge, body, this.getHeaders()).pipe(catchError(this.handleError()))

  }

  getTax(): Observable<any> {
    return this.http.get<any>(this.apiEndPoints.getTax, this.getHeaders()).pipe(catchError(this.handleError))
  }

  updateTax(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.updateTax, body, this.getHeaders()).pipe(catchError(this.handleError))
  }

  getRevenueReport(page, count, search, filter): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.revenuereport}?page=${page}&count=${count}&search=${search}&filter=${filter}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getPaymentDaTA(page, count, search, filter): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getPaymentOfvendor}?page=${page}&count=${count}&search=${search}&filter=${filter}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }
  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 400) {
        this.comm.errorToast(error.error.message)
        // localStorage.clear();
        // this.router.navigateByUrl("/login");
      }
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      return;
    };
  }
}
