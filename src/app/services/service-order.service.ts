import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
export interface SOBody {
  address: {
    commune: string;
    others: string;
    street: string;
    street_number: number;
  };
  customer: {
    email: string;
    firstname: string;
    lastname: string;
    phonenumber: number;
    rut: number;
  };
  entry: { images: string[]; reason: string };
  vehicle: {
    brand: string;
    mileage: number;
    model: string;
    patent: string;
    vin: string;
    year: number;
  };
  authentication: { digitalSignature: string; userRut: number };
}

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderService {
  constructor(private http: HttpClient) {}

  public createServiceOrder(serviceOrder: SOBody): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(
      `${environment.apiUrl}/customer`,
      serviceOrder
    );
  }
}
