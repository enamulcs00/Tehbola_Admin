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
      signUp: 'panel/signup',
      verifyPhoneNo: 'app/verifyPhone',
      adminLogin: 'admin/signin',
      forgotPassword: 'app/forgotPassword',
      resetPasswordPhone: 'panel/resetPasswordPhone',
      getCategoryList: 'admin/getAllCategories',
      setProfile: 'panel/profileSetup',
      getAllCategory: 'admin/categories',
      addCategory: 'admin/category',
      addSubCategory: 'admin/subCategory',
      softdelete: 'common/delete',
      getList: 'admin/getUsers',
      getVendorListForEndorsement: 'panel/getMerchantList',
      viewDocument: 'admin/documents',
      getEquipmentList: 'admin/equipments',
      getsubcategoryList: 'admin/subCategories',
      addBrand: 'admin/addItem',
      addEquipment: 'admin/equipment',
      viewBrand: 'admin/viewItem',
      viewEquipment: 'admin/equipment',
      editBrand: 'admin/editItem',
      approveReject: 'admin/approveReject',
      editUser: 'admin/editUser',
      changePassword: 'app/changePassword',
      getProducts: 'admin/product',
      getProductForBanner: 'admin/catProducts',
      editProduct: 'admin/product',
      addProduct: 'admin/product',
      getUser: 'admin/viewUser',
      addCelebrityVendor: 'admin/addVendor',
      getSubcategory: 'admin/subCategories',
      getCatByUser: 'admin/getUserCatAndSubCat',
      getBrandBySubcat: 'admin/getBrands',
      viewProduct: 'admin/product',
      deleteImage: 'admin/image',
      endorsementRequest: 'panel/endorseProduct',
      endorsementProduct: 'panel/getSellerEndorsements',
      approveEndorsementRequest: 'panel/approveEndorsement',
      getEndorsedProduct: 'panel/getCelebrityEndorsements',
      getAllBanner: 'admin/banner',
      getAllCategoriesforDiscount: 'admin/subCategories',
      getBrandListByCat: 'admin/getBrands',
      getBrandList: 'admin/getAllItem',
      getAllCategoryForDiscount: 'admin/categoryByVendor',
      addBanner: 'admin/banner',
      viewBanner: 'admin/banner',
      getAllPromo:'',
      profile: 'admin/getProfile',
      updateProfile: 'admin/editProfile',
      downloadUserCSV: 'admin/userCsv',
      downloadVendorCSV: 'admin/vendorCsv',
      getAllGeofence: 'admin/getAllGeofence',
      createGeofence: 'admin/geoFence',
      viewGeofence: 'admin/geoFence',
      updateGeofence: 'admin/geoFence',
      foodTruck: 'admin/foodTruck',
      getAllEquipmentCategories: 'admin/equipmentCategories',
      editEquipment: 'admin/equipment',
      addEquipmentCategory: 'admin/equipmentCategory',
      editEquipmentCategory: 'admin/editEquipmentCategory',
      getAssignementData: 'admin/assignmentData',
      addAssignment: 'admin/assignment',
      getAssignmentList: 'admin/assignments',
      SizeList: 'admin/size',
      teaType: 'admin/teaType',
      sugarLevel: 'admin/sugarLevel',

      //commonApi to change status of any user type
      status: 'common/status',


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
      .get<Response>("assets/data.json")
      .pipe(map(response => response));
  }


  singIn(body: any): Observable<any> {
    return this.http
      .post<any>(this.apiEndPoints.adminLogin, body)
      .pipe(
        catchError(this.handleError<any>('Login'))
      );
  }


  signUp(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.signUp, body).pipe(catchError(this.handleError<any>('Sign-Up')))
  }

  setUserDetails(body) {
    localStorage.setItem('User', body);
  }

  getUserDetails() {
    let data = localStorage.getItem('User')
    return data
  }

  verifyPhone(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.verifyPhoneNo, body).pipe(catchError(this.handleError('verify phone')))
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
  resetPasswordByPhone(data): Observable<any> {

    return this.http.
      post<any>(this.apiEndPoints.resetPasswordPhone, data)
      .pipe(
        catchError(this.handleError<any>('Forgot Password'))
      );
  }

  forgetPassword(data): Observable<any> {

    return this.http.
      post<any>(this.apiEndPoints.forgotPassword, data)
      .pipe(
        catchError(this.handleError<any>('Forgot Password'))
      );
  }

  setProfile(data): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.setProfile, data, this.getHeaders()).pipe(catchError(this.handleError()))

  }

  approveReject(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.approveReject, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }


  getList(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.getList, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }



  getVendorListForEndorsement(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.getVendorListForEndorsement, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }
  getCelebList(search, roles): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getList}?search=${search}&roles=${roles}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getCategoryList(): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getAllCategory}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }
  getBrandListBySubcat(catId): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getBrandBySubcat}?category=${catId}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getDocument(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.viewDocument, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  // Method start of Soft Delete
  // async  deleteData(url = '', data = {}) {
  //   const response = await fetch(url, {
  //     method: 'delete',
  //     mode: 'cors',
  //     cache: 'no-cache',
  //     credentials: 'same-origin',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': this.getToken(),

  //     },
  //     redirect: 'follow',
  //     referrerPolicy: 'no-referrer',
  //     body: JSON.stringify(data)
  //   });
  //   return response.json(); // parses JSON response into native JavaScript objects
  // }




  // flagDelete: boolean
  // data: any
  // async  deletemethod(body) {
  //   // this.flagDelete = false;

  //   await this.deleteData(this.apiEndPoints.softdelete, body)
  //     .then(data => {
  //       if (data.success) {
  //         console.log("passed")
  //         this.flagDelete = true;
  //         this.data = data
  //       } else {
  //         console.log("Failed")
  //         this.flagDelete == false
  //       }


  //     });

  // }

  delete(body): Observable<any> {

    return this.http.post<any>(this.apiEndPoints.softdelete, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  deleteImage(body): Observable<any> {
    return this.http.delete<any>(`${this.apiEndPoints.deleteImage}/${body.imageId}`, this.getHeaders()).pipe(catchError(this.handleError))
  }


  //Method End For Soft Delete

  back() {
    window.history.back()
  }


  //Method End For hard Delete
  // async  hardDeleteData(url = '', data = {}) {
  //   const response = await fetch(url, {
  //     method: 'delete',
  //     mode: 'cors',
  //     cache: 'no-cache',
  //     credentials: 'same-origin',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': this.getToken(),

  //     },
  //     redirect: 'follow',
  //     referrerPolicy: 'no-referrer',
  //     body: JSON.stringify(data)
  //   });
  //   return response.json(); // parses JSON response into native JavaScript objects
  // }




  // flaghardDelete: boolean
  // harddata: any
  // async deleteHard(body) {
  //   // this.flagDelete = false;

  //   await this.hardDeleteData(this.apiEndPoints.hardDelete, body)
  //     .then(data => {
  //       if (data.success) {
  //         console.log("passed")
  //         this.flagDelete = true;
  //         this.data = data
  //       } else {
  //         console.log("Failed")
  //         this.flagDelete == false
  //       }


  //     });

  // }
  //method end for hard delete



  setUser(user: any) {
    sessionStorage.setItem("Markat_User", user);
  }

  getUser() {
    return sessionStorage.getItem('Markat_User')
  }

  sendToken(token: string) {
    sessionStorage.setItem("token", token);
  }


  getToken() {
    return sessionStorage.getItem("token");
  }




  getAllPromoCode(page, count, filter, search): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getAllPromo}?page=${page}&count=${count}&filter=${filter}&search=${search}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }


  addPromoCode(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.addPromoCode, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getPromoCode(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getPromoCode}/${id}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  updatePromoCode(body, id): Observable<any> {
    return this.http.put<any>(`${this.apiEndPoints.addPromoCode}/${id}`, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }



  isLoggedIn() {
    return this.getToken() !== null;
  }


  addVendorCelebrity(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.addCelebrityVendor, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }


  //Products
  AddProduct(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.addProduct, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  updateProduct(body, id): Observable<any> {
    return this.http.put<any>(`${this.apiEndPoints.addProduct}/${id}`, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getAllProduct(page, count, search) {
    return this.http
      .get<any>(`${this.apiEndPoints.getAllProduct}?page=${page}&count=${count}&search=${search}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('All Product'))
      );
  }

  viewProduct(id: any) {
    return this.http
      .get<any>(`${this.apiEndPoints.viewProduct}/${id}`, this.getHeaders())
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
  getAllGeofence(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.getAllGeofence, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  createGeoFencing(geofenceData): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.createGeofence, geofenceData, this.getHeaders())
  }

  getGeofencing(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.viewGeofence}?id=${id}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  updateGeofencing(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.updateGeofence, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }
  deleteGeofence(id): Observable<any> {
    return this.http.delete<any>(`${this.apiEndPoints.viewGeofence}/${id}`, this.getHeaders()).pipe(catchError(this.handleError))

  }


  getAssignementData(): Observable<any> {
    return this.http.get<any>(this.apiEndPoints.getAssignementData, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  addAssignment(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.addAssignment, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getAssignmentList(isCompleted, isActive): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getAssignmentList}?isCompleted=${isCompleted}&status=${isActive}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  editBanner(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.addBanner, body, this.getHeaders()).
      pipe(
        catchError(this.handleError<any>("add bannner")))
  }

  EditBanner(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.addBanner, body, this.getHeaders()). //using end point add banner because of same end point
      pipe(
        catchError(this.handleError<any>("add bannner")))
  }
  updateBanner(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.addBanner, body, this.getHeaders()).
      pipe(
        catchError(this.handleError<any>("add bannner")))
  }

  getDisountDetails(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.viewBanner}/${id}`, this.getHeaders()).
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

  approveEndorsementRequest(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.approveEndorsementRequest, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getEndorsedProduct(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.getEndorsedProduct, body, this.getHeaders()).pipe(catchError(this.handleError()))

  }

  editCelebrity(body) {

    return this.http.put<any>(`${this.apiEndPoints.editUser}`, body, this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('User status')))

  }
  // 

  changeCelebrityStatus(body) {

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



  getVendorList(body, page, count, change) {

    return this.http.post<any>(this.apiEndPoints.getAllVendor, body,
      this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('No user'))
    );
  }

  getProducts(page, count, filter, isApproved, search,) {
    // console.log(id);
    return this.http.get<any>(`${this.apiEndPoints.getProducts}?page=${page}&count=${count}&filter=${filter}&isApproved=${isApproved}&search=${search}`,
      this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('Get Vendor Products'))
    );

  }


  getAllFoodTruck(filter, search, count, page): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.foodTruck}?page=${page}&count=${count}&search=${search}&filter=${filter}`, this.getHeaders()).pipe(catchError(this.handleError()))

  }

  addFoodTruck(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.foodTruck, body, this.getHeaders()).pipe(catchError(this.handleError())).pipe(catchError(this.handleError()))
  }

  editFoodTruck(body, id): Observable<any> {
    return this.http.put<any>(`${this.apiEndPoints.foodTruck}/${id}`, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }


  getFoodTruck(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.foodTruck}/${id}`, this.getHeaders()).pipe(catchError(this.handleError())).pipe(catchError(this.handleError()))
  }


  getProductsforBanner(category) {
    // console.log(id);
    return this.http.get<any>(`${this.apiEndPoints.getProductForBanner}?category=${category}`,
      this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('Get Vendor Products'))
    );

  }

  getProductsForEndorsement(page, count, filter, isApproved, search, seller, isEndorse) {
    // console.log(id);
    return this.http.get<any>(`${this.apiEndPoints.getProducts}?page=${page}&count=${count}&filter=${filter}&isApproved=${isApproved}&search=${search}&seller=${seller}&isEndorse=${isEndorse}`,
      this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('Get Vendor Products'))
    );

  }

  endorsementRequest(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.endorsementRequest, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getEndorsement(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.endorsementProduct, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getProductsWithoutApproved(page, count, filter, search,) {
    // console.log(id);
    return this.http.get<any>(`${this.apiEndPoints.getProducts}?page=${page}&count=${count}&filter=${filter}&search=${search}`,
      this.getHeaders()
    ).pipe(
      catchError(this.handleError<any>('Get Vendor Products'))
    );

  }

  editProduct(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.editProduct, body, this.getHeaders()).pipe(catchError(this.handleError()))

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

  getBrandListbyCat(selectedCategory, selectedSubCategory) {
    return this.http.get<any>(`${this.apiEndPoints.getBrandListByCat}?category=${selectedCategory}&subCategory=${selectedSubCategory}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>("list of vendor by category and sub-category")))
  }

  viewUser(id) {
    return this.http.get<any>(`${this.apiEndPoints.getUser}?id=${id}`,
      this.getHeaders()).
      pipe(catchError(this.handleError<any>('No user')));
  }

  getSubcategoryList(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.getsubcategoryList}?parentId=${id}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  viewBrand(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.viewBrand}?id=${id}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }


  viewEquipment(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.viewEquipment}/${id}`, this.getHeaders()).pipe(catchError(this.handleError()))
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
  getAllCategories() {
    return this.http
      .get<any>(this.apiEndPoints.getAllCategory, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('All Product'))
      );
  }

  getAllEquipmentCategories() {
    return this.http
      .get<any>(`${this.apiEndPoints.getAllEquipmentCategories}?page=${1}&count=${10000}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('All Product'))
      );
  }

  getAllCategoriesForPanel() {
    return this.http
      .get<any>(this.apiEndPoints.getAllCategoryForDiscount, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('All Product'))
      );
  }

  getAllSubCategoriesForDiscount(parentId) {

    return this.http.get<any>(`${this.apiEndPoints.getAllCategoriesforDiscount}?parentId=${parentId}`, this.getHeaders()).pipe(catchError(this.handleError("get all category for discount")))

  }



  // 

  addCategory(data) {
    return this.http
      .post<any>(this.apiEndPoints.addCategory, data, this.getHeaders())
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
      .put<any>(this.apiEndPoints.addCategory, data, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>('Edit Category'))
      );
  }

  viewCategory(id) {
    return this.http
      .get<any>(`${this.apiEndPoints.addCategory}?id=${id}`, this.getHeaders())
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


  getAllDiscount(bannerType, sellerId, isApproved, page, pageSize, search, filterBy) {
    return this.http.get<any>(`${this.apiEndPoints.getAllBanner}?bannerType=${bannerType}&seller=${sellerId}&isApproved=${isApproved}&page=${page}&count=${pageSize}&search=${search}&filter=${filterBy}`, this.getHeaders())
      .pipe(
        catchError(this.handleError<any>("get discount(banner)"))
      )
  }


  downloadUserCsv(): Observable<any> {
    return this.http.get<any>(this.apiEndPoints.downloadUserCSV, this.getHeaders()).pipe(catchError(this.handleError()))

  }

  downloadVendorCsv(): Observable<any> {
    return this.http.get<any>(this.apiEndPoints.downloadVendorCSV, this.getHeaders()).pipe(catchError(this.handleError()))

  }

  //Sales Module
  getSaleList(page, pageSize, search, filterBy): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.salesList}?page=${page}&count=${pageSize}&filter=${filterBy}&search=${search}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  updateStatus(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.status, body, this.getHeaders()).pipe(catchError(this.handleError))
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

  getEquipmentList(search, filter): Observable<any> {

    return this.http.get<any>(`${this.apiEndPoints.getEquipmentList}?page=1&count=10000&search=${search}&category=${filter}`, this.getHeaders()).pipe(catchError(this.handleError()))

  }
  getRawItemList(page, count, search): Observable<any> {

    return this.http.get<any>(`${this.apiEndPoints.getBrandList}?page=${page}&count=${count}&search=${search}`, this.getHeaders()).pipe(catchError(this.handleError()))

  }

  addBrand(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.addBrand, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }
  addEquipment(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.addEquipment, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  addEquipmentCategory(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.addEquipmentCategory, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  EditEquipmentCategory(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.editEquipmentCategory, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  editBrand(body): Observable<any> {
    return this.http.put<any>(this.apiEndPoints.editBrand, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  editEquipment(body, editableBrandId): Observable<any> {
    return this.http.put<any>(`${this.apiEndPoints.editEquipment}/${editableBrandId}`, body, this.getHeaders()).pipe(catchError(this.handleError()))
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

  addSize(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.SizeList, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }


  addTeaType(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.teaType, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }



  addSugarLevel(body): Observable<any> {
    return this.http.post<any>(this.apiEndPoints.sugarLevel, body, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getSizeList(): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.SizeList}?page=1&count=100000&search=`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getTeaList(): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.teaType}?page=1&count=100000&search=`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getSugarLevelList(): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.sugarLevel}?page=1&count=100000&search=`, this.getHeaders()).pipe(catchError(this.handleError()))
  }



  getSingleSize(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.SizeList}/${id}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getSingleTeaType(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.teaType}/${id}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  getSingleSugarLevel(id): Observable<any> {
    return this.http.get<any>(`${this.apiEndPoints.sugarLevel}/${id}`, this.getHeaders()).pipe(catchError(this.handleError()))
  }

  updateSize(body, id) {
    return this.http.put<any>(`${this.apiEndPoints.SizeList}/${id}`, body, this.getHeaders()).pipe(catchError(this.handleError()))

  }
  updateTeaType(body, id) {
    return this.http.put<any>(`${this.apiEndPoints.teaType}/${id}`, body, this.getHeaders()).pipe(catchError(this.handleError()))

  }

  updateSugarLevel(body, id) {
    return this.http.put<any>(`${this.apiEndPoints.sugarLevel}/${id}`, body, this.getHeaders()).pipe(catchError(this.handleError()))

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
