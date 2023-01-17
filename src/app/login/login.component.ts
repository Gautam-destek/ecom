import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:any;
  data:any;
  submitted=false;

  constructor(private fb: FormBuilder,
    private loginService:LoginService,
    private router:Router, private routes: ActivatedRoute) { }

    ngOnInit() {
      this.loadForm();
    }

    get f() { return this.loginForm.controls; }

    loadForm() {
      this.loginForm = this.fb.group({
        email: ['',Validators.compose([Validators.required, Validators.email])],
        password: ['',Validators.compose([ Validators.required, Validators.minLength(2)])]
      });
    }

    emailValidator(control:any) {
      if (control.value) {
        const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
        return matches ? null : { 'invalidEmail': true };
      } else {
        return null;
      }
    }

    onSubmit() {
      this.submitted = true;
      if (this.loginForm.invalid) {
        return;
      }

      // console.log(this.loginForm.value.email);

      let formData = new FormData();
      formData.append('email', this.loginForm.value.email);
      formData.append('password', this.loginForm.value.password);

      this.loginService.login(formData).subscribe(res=> {
        this.data = res;

        localStorage.setItem('id', this.data.data.user_id);
        localStorage.setItem('name', this.data.data.name);
        localStorage.setItem('email', this.data.data.email);
        localStorage.setItem('role', this.data.data.role);
        // if (this.data.data.role == '2') {
          this.router.navigate(['/profile'], {relativeTo:this.routes});
        // }
        console.log(localStorage.getItem('role'));
      });

    }
}
