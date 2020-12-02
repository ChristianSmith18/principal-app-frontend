import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

export interface Vehicle {
  patent: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
}

export interface Address {
  id: number;
  commune: string;
  street: string;
  street_number: number;
  others: string;
  createdAt: Date;
}

export interface Customer {
  rut: number;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: number;
  addresses: Address[];
  vehicles: Vehicle[];
}

interface ApiCustomerResponse {
  ok: boolean;
  error?: string | {};
  customer?: Customer;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  public searchCustomer(rut: number): Observable<ApiCustomerResponse> {
    return this.http.get<ApiCustomerResponse>(
      `${environment.apiUrl}/customer/one?id=${rut}`
    );
  }
}
