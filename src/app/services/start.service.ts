import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StartService {

  constructor(private http:HttpClient) { }
  public addResult(resultData:any){
    return this.http.post('http://localhost:8080/result/',resultData);
  }
}
