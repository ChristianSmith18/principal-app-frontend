import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { clean, validate } from 'rut.js';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  @ViewChild('rutInput') public rutInput: ElementRef;
  public isLoading = false;

  constructor(
    private _login: LoginService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async presentErrorToast(message: string) {
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

  checkRut() {
    this.isLoading = true;
    const inputText = this.rutInput.nativeElement.value;
    if (!validate(inputText)) {
      this.isLoading = false;
      this.presentErrorToast('El rut es inválido.');
      return;
    }

    const textCleaned = clean(inputText);
    const rut = Number(textCleaned.substring(0, textCleaned.length - 1));

    this._login.searchRut(rut).subscribe(
      ({ ok }) => {
        if (ok) {
          this.router.navigate(['tabs']);
        } else {
          this.presentErrorToast('El rut es inválido.');
        }
        this.isLoading = false;
      },
      (err) => {
        this.presentErrorToast('El rut no está registrado.');
        this.isLoading = false;
      }
    );
  }
}
