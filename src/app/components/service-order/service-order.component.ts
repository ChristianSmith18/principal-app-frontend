import { SOBody } from './../../services/service-order.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ModalController, ToastController } from '@ionic/angular';
import { clean, validate } from 'rut.js';
import { NgxSpinnerService } from 'ngx-spinner';

import { User } from '@services/login.service';
import { CustomerService, Vehicle } from '@services/customer.service';
import { RutOrPatent } from '@components/forms/forms.component';
import { ServiceOrderService } from '@src/app/services/service-order.service';
declare var UIkit: any;

@Component({
  selector: 'app-service-order',
  templateUrl: './service-order.component.html',
  styleUrls: ['./service-order.component.scss'],
})
export class ServiceOrderComponent implements AfterViewInit {
  private slideCount = 0;
  private vehicles: Vehicle[] = null;
  private myOrder: {
    customer: {
      rut: any;
      firstname: any;
      lastname: any;
      phonenumber: any;
      email: any;
    };
    address: { commune: any; street: any; street_number: any; others: any };
    vehicle: any;
    entry: { reason: string; images: string[] };
  };

  public secretKey = null;
  public user: User = JSON.parse(atob(localStorage.getItem('idrt'))).user;
  public showSlides = false;
  public showBackButton = false;
  public showEndButton = false;
  public textareaValue: string = null;
  public imagesLoaded: string[] = null;

  public enableNext = false;

  @ViewChild('slides', { static: false }) slides: IonSlides;
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  // Customer Form
  public customerForm = this.fb.group({
    rut: [
      null,
      [Validators.required, Validators.minLength(9), Validators.maxLength(10)],
    ],
    firstname: [null, [Validators.required, Validators.minLength(3)]],
    lastname: [null, [Validators.required, Validators.minLength(3)]],
    phonenumber: [
      null,
      [
        Validators.required,
        Validators.min(100000000),
        Validators.max(999999999),
      ],
    ],
    email: [null, [Validators.required, Validators.email]],
    commune: [null, [Validators.required, Validators.minLength(3)]],
    street: [null, [Validators.required, Validators.minLength(3)]],
    street_number: [null, [Validators.required, Validators.min(1)]],
    others: [null],
  });

  public customerFields: {
    name: string;
    placeholder: string;
    type: string;
  }[] = [
    { name: 'Rut', placeholder: 'Ej: 12345678-9', type: 'text' },
    { name: 'Nombre', placeholder: 'Ej: Juan', type: 'text' },
    { name: 'Apellido', placeholder: 'Ej: Perez', type: 'text' },
    { name: 'Teléfono', placeholder: 'Ej: 912345678', type: 'tel' },
    { name: 'Email', placeholder: 'Ej: ejemplo@ejemplo.com', type: 'email' },
    { name: 'Comuna', placeholder: 'Ej: Santiago Centro', type: 'text' },
    { name: 'Calle', placeholder: 'Ej: Moneda', type: 'text' },
    { name: 'Número', placeholder: 'Ej: 1234', type: 'tel' },
    {
      name: 'Otros',
      placeholder: 'Ej: Departamento 123, bloque 4B, etc..',
      type: 'text',
    },
  ];

  // Vehicle Form
  public vehicleForm = this.fb.group({
    patent: [
      null,
      [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
    ],
    brand: [null, [Validators.required, Validators.minLength(2)]],
    model: [null, [Validators.required, Validators.minLength(2)]],
    year: [
      null,
      [
        Validators.required,
        Validators.min(1800),
        Validators.max(new Date().getFullYear()),
      ],
    ],
    vin: [null, [Validators.required, Validators.minLength(3)]],
    mileage: [null, [Validators.required, Validators.min(0)]],
  });

  public vehicleFields: {
    name: string;
    placeholder: string;
    type: string;
  }[] = [
    {
      name: 'Patente',
      placeholder: `Ej: XX${this.randomKm(5, 5)}`,
      type: 'text',
    },
    { name: 'Marca', placeholder: 'Ej: Citroën', type: 'text' },
    { name: 'Modelo', placeholder: 'Ej: C3', type: 'text' },
    {
      name: 'Año',
      placeholder: `Ej: ${new Date().getFullYear()}`,
      type: 'tel',
    },
    { name: 'Vin', placeholder: 'Ej: 1HGBH41XMN109186', type: 'text' },
    {
      name: 'Kilometraje',
      placeholder: `Ej: ${this.randomKm(2, 6)}`,
      type: 'tel',
    },
  ];

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private _customer: CustomerService,
    private _serviceOrder: ServiceOrderService,
    private spinner: NgxSpinnerService,
    private toastController: ToastController
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showSlides = true;
      setTimeout(() => {
        this.slides.lockSwipes(true);
      }, 10);
    }, 0);
  }

  public changeForm(event: FormGroup) {
    if (event.value.rut) {
      this.customerForm = event;
    } else {
      this.vehicleForm = event;
    }
  }

  public closeModal() {
    setTimeout(() => {
      this.modalController.dismiss();
    }, 100);
  }

  public syncData(data: RutOrPatent) {
    if (data.type === 'rut') {
      this.spinner.show();
      if (validate(data.value + '')) {
        const rutCleaned = clean(data.value + '');
        const rut = Number(rutCleaned.substring(0, rutCleaned.length - 1));
        this._customer.searchCustomer(rut).subscribe(
          ({ ok, customer }) => {
            if (ok) {
              delete customer.rut;
              this.vehicles = customer.vehicles;
              delete customer.vehicles;

              const address = customer.addresses[customer.addresses.length - 1];
              this.customerForm.patchValue({ ...customer, ...address });
              this.spinner.hide();
            }
          },
          (err) => {
            this.spinner.hide();
          }
        );
      } else {
        this.spinner.hide();
      }
    } else {
      const index = this.vehicles?.findIndex(
        (vehicle) => vehicle.patent === (data.value + '').toUpperCase()
      );
      if (index !== -1 && this.vehicles !== null) {
        const newVehicle = this.vehicles[index];
        delete newVehicle.mileage;
        this.vehicleForm.patchValue(newVehicle);
      }
    }
  }

  public async backSlide() {
    this.slideCount--;
    this.validateButtons();
    this.slides.lockSwipes(false);
    this.slides.slideTo(this.slideCount);
    this.slides.lockSwipes(true);
  }

  public async nextSlide() {
    switch (this.slideCount) {
      case 0:
        if (!this.customerForm.valid) {
          document.getElementById('error-list').innerHTML = this.generateErrors(
            this.customerForm,
            true
          );
          UIkit.modal(document.getElementById('error-modal')).show();
          return;
        }
        break;

      case 1:
        if (!this.vehicleForm.valid) {
          document.getElementById('error-list').innerHTML = this.generateErrors(
            this.vehicleForm,
            false
          );
          UIkit.modal(document.getElementById('error-modal')).show();
          return;
        }
        break;
    }
    document.getElementById('error-list').innerHTML = '';

    if (this.slideCount !== (await this.slides.length()) - 1) {
      this.slideCount++;
    }
    this.validateButtons();
    this.slides.lockSwipes(false);
    this.slides.slideTo(this.slideCount);
    this.slides.lockSwipes(true);
  }

  private generateErrors(group: FormGroup, customer: boolean): string {
    let count = 0;
    let elemRef = '<ul>\n';
    // tslint:disable-next-line: forin
    for (const field in group.controls) {
      if (group.controls[`${field}`].invalid) {
        if (customer) {
          elemRef += `\t<li>El campo <b>${this.customerFields[count].name}</b> tiene un formato inválido.</li>\n`;
        } else {
          elemRef += `\t<li>El campo <b>${this.vehicleFields[count].name}</b> tiene un formato inválido.</li>\n`;
        }
      }
      count++;
    }
    return (elemRef += '</ul>');
  }

  public endSlide() {
    if (this.textareaValue === null || this.textareaValue.trim().length < 5) {
      document.getElementById('error-list').innerHTML = `
      <ul>
        <li>El campo <b>Motivo</b> necesita mínimo 5 caracteres.</li>
      </ul>
      `;
      UIkit.modal(document.getElementById('error-modal')).show();
    } else {
      document.getElementById('error-list').innerHTML = '';
      const address = {
        commune: this.customerForm.value.commune,
        street: this.customerForm.value.street,
        street_number: this.customerForm.value.street_number,
        others: this.customerForm.value.others,
      };

      const customer = {
        rut: this.customerForm.value.rut,
        firstname: this.customerForm.value.firstname,
        lastname: this.customerForm.value.lastname,
        phonenumber: this.customerForm.value.phonenumber,
        email: this.customerForm.value.email,
      };

      const finalObject = {
        customer,
        address,
        vehicle: this.vehicleForm.value,
        entry: {
          reason: this.textareaValue.trim(),
          images: this.imagesLoaded,
        },
      };
      this.myOrder = finalObject;
      UIkit.modal(document.getElementById('my-id')).show();
    }
  }

  private async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  public sendServiceOrder() {
    const finalObject = {
      ...this.myOrder,
      authentication: {
        digitalSignature: this.secretKey,
        userRut: JSON.parse(atob(localStorage.getItem('idrt'))).user.rut,
      },
    };

    this._serviceOrder.createServiceOrder(finalObject as SOBody).subscribe(
      ({ ok }) => {
        if (ok) {
          this.presentErrorToast('Se creó la orden de servicio correctamente!');
          this.closeModal();
        } else {
          this.presentErrorToast(
            'Hubo un problema al crear la orden de servicio!'
          );
        }
      },
      (err) => {
        this.presentErrorToast(
          'Hubo un problema al crear la orden de servicio:\t' +
            JSON.stringify(err)
        );
      }
    );
  }

  private async validateButtons() {
    if (this.slideCount === 0) {
      this.showBackButton = false;
    } else {
      this.showBackButton = true;
    }

    if (this.slideCount < (await this.slides.length()) - 1) {
      this.showEndButton = false;
    } else {
      this.showEndButton = true;
    }
  }

  private randomKm(min: number, max: number) {
    const value = Date.now().toString();
    return value.substring(
      value.length - Math.floor(Math.random() * (max - min + 1) + min),
      value.length - 1
    );
  }
}
