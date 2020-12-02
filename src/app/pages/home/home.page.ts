import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceOrderComponent } from '@components/service-order/service-order.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private modalController: ModalController) {}

  async openFormsModal() {
    const modal = await this.modalController.create({
      component: ServiceOrderComponent,
      mode: 'md',
      swipeToClose: true,
    });

    return await modal.present();
  }
}
