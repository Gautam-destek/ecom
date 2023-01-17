import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http:HttpClient) { }

  update(data:any){
    return this.http.post(`${environment.baseurl}update_profile`,data);
  }

  get(data:any){
    return this.http.get(`${environment.baseurl}get_profile?user_id=`+data);
  }
}
