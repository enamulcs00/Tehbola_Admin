import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from 'src/services/common.service';
import Swal from "sweetalert2";
import { UrlService } from 'src/services/url.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: any;
  imageFile: any;
  addCategoryForm: FormGroup;
  editCategoryForm: FormGroup;
  addSubcategoryForm: FormGroup;
  categoryImage: any;
  subCategoryImage: any;
  submitted: any;
  id: any;
  image: any;
  imageUrl: any

  //@ViewChild('categoryImage', { static: true }) categoryImageComp: ElementRef




  constructor(private router: Router,
    private apiService: ApiService,
    private commonService: CommonService,
    private formBuilder: FormBuilder, private serverUrl: UrlService) {
    this.getAllCategories();
  }

  ngOnInit() {
    this.imageUrl = this.serverUrl.imageUrl
    this.addCategoryForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required, Validators.maxLength(20), Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      name_ar: new FormControl("", [Validators.required, Validators.maxLength(20)]),
      image: new FormControl("", [Validators.required]),
    });
    this.editCategoryForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required, Validators.maxLength(20), Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      name_ar: new FormControl("", [Validators.required, Validators.maxLength(20)]),
      image: new FormControl("", [Validators.required]),
    });
    this.addSubcategoryForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required, Validators.maxLength(20), Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      name_ar: new FormControl("", [Validators.required, Validators.maxLength(20)]),
      image: new FormControl("", [Validators.required]),
    });
  }
  getAllCategories() {
    this.apiService.getAllCategories(1, 10).subscribe(res => {
      this.categories = res.data;
      console.log(this.categories);
      this.submitted = false;
    })
  }

  goToaddcategory() {
    this.router.navigate(['addcategory'])
  }
  goToviewcategory() {
    this.router.navigate(['viewcategory'])
  }
  goToeditcategory() {
    this.router.navigate(['editcategory'])
  }
  //   goTosubcategory() {
  //   this.router.navigate(['/subcategory'])
  // }
  async profilePic(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        if (this.id) {
          this.image = event.target.result;
        } else {
          this.categoryImage = event.target.result;
        }
        this.addCategoryForm.controls['image'].setValue(this.categoryImage);
      };
    }
  }
  async subCategoryPic(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.subCategoryImage = event.target.result;
        this.addSubcategoryForm.controls['image'].setValue(this.imageFile);
      };

    }
  }
  onAddCategory() {
    this.submitted = true;
    if (this.submitted && this.addCategoryForm.valid) {
      const data = this.addCategoryForm.value;
      data['img'] = this.imageFile;
      this.apiService.addCategory(data).subscribe(res => {
        if (res) {
          this.getAllCategories();
          this.commonService.successToast("Category added successfully");
          this.submitted = false;
          this.addCategoryForm.reset();
          this.imageFile = null;
          //this.categoryImage = null
          //  this.image = null;
          this.categoryImage = null



        }
      });
    }
  }


  onUpdateCategory() {
    this.submitted = true;
    if (this.submitted && this.editCategoryForm.valid) {
      const data = this.editCategoryForm.value;
      data['img'] = this.imageFile;
      data['id'] = this.id;
      console.log(data);
      this.apiService.editCategory(data).subscribe(res => {
        if (res) {
          this.getAllCategories();
          this.commonService.successToast(res.message);
          this.submitted = false;
          this.editCategoryForm.reset();
          this.image = null;
          this.imageFile = null
        }
      });
    }
  }

  onAddSubCategory() {

    this.submitted = true;
    if (this.submitted && this.addSubcategoryForm.valid) {
      const data = this.addSubcategoryForm.value;
      data['img'] = this.imageFile;
      data['parentId'] = this.id;
      this.apiService.addSubCategory(data).subscribe(res => {
        if (res) {
          this.getAllCategories();
          this.commonService.successToast(res.message);
          this.submitted = false;
          this.addSubcategoryForm.reset();
          this.imageFile = null;
          this.subCategoryImage = null

        }
      });
    }
  }

  viewCategory(id) {
    this.apiService.viewCategory(id).subscribe(res => {
      this.editCategoryForm.patchValue(res.data);
      this.image = res.data.image;
      this.imageFile = res.data.image;
      //console.log(this.image);

    })

  }
  editCategory(id) {
    this.id = id;
    this.viewCategory(id);
  }

  result: any

  deleteCategory(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      allowOutsideClick: true
    }).then(result => {
      if (result.value) {
        this.result = result;
        console.log(id)
        const data = {
          "id": id,
          "model": "Category"
        }
        this.apiService.delete(data);

        this.deleteFromList(id)

      } else {
        console.log("cancelled");
      }
    });
  }

  cancelClicked() {
    console.log("hi")
  }

  deleteSubcategory(id) {
    Swal.clickCancel();
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Subcategory!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      allowOutsideClick: false
    }).then(result => {
      if (result.value) {
        this.result = result;
        console.log(id)
        const data = {
          "id": id,
          "model": "Category"
        }

        console.log(data)


        this.apiService.delete(data);

        this.deleteFromList(id)

      } else {
        console.log("cancelled");
      }
    });
  }



  deleteFromList(i) {
    setTimeout(() => {
      let temp = this.apiService.flagDelete;
      if (temp == true) {
        // this.categories.splice(i, 1);
        this.getAllCategories()
        console.log(this.categories)
        if (this.result) {
          this.commonService.successToast("Cateogry Deleted");
          console.log("service is not called")
        }
      }
      else {
        console.log("error");
        this.commonService.errorToast("Error Occured")
      }
    }, 2000);


  }


  onAddSubCategoryBtn(id) {
    this.id = id;
  }


}
