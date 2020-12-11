import { Component } from '@angular/core';
import { User } from '@services/login.service';

interface SettingsOption {
  titleContent: string;
  imgUrl: string;
  description: string;
}
@Component({
  selector: 'app-tab2',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  public options: SettingsOption[] = [
    {
      titleContent: 'Perfil',
      imgUrl: 'assets/ion-icons/user.png',
      description: 'Nombre, Apellido, Rut, Tipo Usuario, Cambiar Clave...',
    },
    {
      titleContent: 'Administrar',
      imgUrl: 'assets/ion-icons/setting.png',
      description: 'Agregar Usuarios, Modificar Usuarios, Ver Órdenes...',
    },
    {
      titleContent: 'Ir a TallerPrincipal.cl',
      imgUrl: 'assets/ion-icons/web.png',
      description: 'Redirige a la pagina web',
    },
    {
      titleContent: 'Ayuda',
      imgUrl: 'assets/ion-icons/help.png',
      description: 'Preguntas frecuentes y otras ayudas',
    },
  ];
  public user: User = JSON.parse(atob(localStorage.getItem('idrt'))).user;

  constructor() {}

  public doSomething(index: number) {
    switch (index) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        open('http://tallerprincipal.cl/', '_blank');
        break;
      default:
        break;
    }
    console.log(index);
  }
}
