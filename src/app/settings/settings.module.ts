import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';

import { SettingsPageRoutingModule } from './settings-routing.module';
import { LogoComponent } from '../components/logo/logo.component';
import { SectionComponent } from '../components/section/section.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SettingsPageRoutingModule],
  declarations: [SettingsPage , LogoComponent, SectionComponent],
})
export class SettingsPageModule {}
