import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface User {
  rut: number;
  firstname: string;
  lastname: string;
  role: string;
}

interface ApiLoginResponse {
  ok: boolean;
  error?: string | {};
  user?: User;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  public searchRut(rut: number): Observable<ApiLoginResponse> {
    return this.http.get<ApiLoginResponse>(
      `${environment.apiUrl}/user/one?id=${rut}`
    );
  }
}
