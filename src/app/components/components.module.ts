import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { KeysPipe } from '@pipes/keys.pipe';

import { LogoComponent } from './logo/logo.component';
import { CardComponent } from './card/card.component';
import { FormsComponent } from './forms/forms.component';
import { ServiceOrderComponent } from './service-order/service-order.component';

const c = [
  LogoComponent,
  CardComponent,
  FormsComponent,
  KeysPipe,
  ServiceOrderComponent,
];

@NgModule({
  declarations: [...c],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
  ],
  exports: [...c],
})
export class ComponentsModule {}
