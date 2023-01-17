import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ProfileService } from "../services/profile.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: any;
  submitted = false;
  date1 : any;
  data : any;
  id : any = 0;
  user : any;
  image_show = false;
  path:any;
  selectedFiles:any;
  currentFile:any;

  constructor(private fb:FormBuilder, private profileService:ProfileService, public datepipe: DatePipe){}

  ngOnInit() {
    this.loadForm();
    if (localStorage.getItem('id')) {
      this.id = localStorage.getItem('id');
      this.getProfile();
    }
  }

  get f(){ return this.profileForm.controls; }

  getProfile(){
    this.profileService.get(this.id).subscribe(res=> {
      this.user = res;
      console.log(this.user);
      this.profileForm = this.fb.group({
        name : new FormControl(this.user.data.name),
        phone : new FormControl(this.user.data.mobile),
        email : new FormControl(this.user.data.email),
        dob : new FormControl(this.user.data.date_of_joining),
        userfile : new FormControl('', [])
      });
      if(this.user.data.image_url){
        this.image_show = true;
        // this.path = 'https://www.w3schools.com/html/pic_trulli.jpg';
        this.path = this.user.data.image_url;
      }
    });
  }

  loadForm(){
    this.profileForm = this.fb.group({
      email : new FormControl('', [Validators.required, Validators.email]),
      phone : new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      name : new FormControl('', [Validators.required]),
      dob : new FormControl('', [Validators.required]),
      userfile : new FormControl('', [])
    });
  }

  getErrorMessage(){
    if (this.f.email.hasError('requied')) {
      return 'You must enter value';
    }
    if (this.f.name.hasError('requird')) {
      return 'You must enter name';
    }
    if (this.f.phone.hasError('required')) {
      return 'You must enter a mobile number';
    }
    if (this.f.dob.hasError('required')) {
      return 'You must select a dob';
    }

    return this.f.email.hasError('email') ? 'Not a valid email' : '';
  }

  uploadFile(event:any){
    this.selectedFiles = event.target.files;
  }

  onSubmit(){
    var formData = new FormData();
    let getDatePicker1 = this.profileForm.value.dob;
    let dateFormat1 = this.datepipe.transform(getDatePicker1, 'yyyy-MM-dd');
    this.date1 = dateFormat1;
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      //console.log(file);

      if(file){
        this.currentFile = file;
      }
    }
    formData.append('user_id', this.id);
    formData.append('name', this.profileForm.value.name);
    formData.append('email', this.profileForm.value.email);
    formData.append('mobile', this.profileForm.value.phone);
    formData.append('date_of_joining', this.date1);
    formData.append('com_logo', this.currentFile);
    this.profileService.update(formData).subscribe(res=>{
      this.data = res;
      console.log(this.data);
      this.getProfile();
    });
  }

}
