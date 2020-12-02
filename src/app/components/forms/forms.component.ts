import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Platform } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';

export interface RutOrPatent {
  type: 'rut' | 'patent';
  value: string | number;
}

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent {
  @Input() public titleForm = 'Sin nombre';
  @Input() public values: FormGroup;
  @Input() public customerFields: {
    name: string;
    placeholder: string;
    type: string;
  }[];
  @Input() public isImg = false;
  @Output() public formChange = new EventEmitter<FormGroup>();
  @Output() public rutOrPatentChange = new EventEmitter<RutOrPatent>();

  @Output() textareaChange = new EventEmitter<string>();
  @Output() imgLoadedChange = new EventEmitter<string[]>();

  public imgSaved: string[] = new Array<string>(5);
  public imgRefSaved: any[] = new Array<string>(5);

  private cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
  };

  constructor(
    private camera: Camera,
    private storage: AngularFireStorage,
    private platform: Platform
  ) {}

  public change(field: string, value: string | number): void {
    const obj = {};
    obj[`${field.toLowerCase()}`] = Number(value) || value;
    this.values.patchValue(obj);
    this.formChange.emit(this.values);

    this.changeRutOrPatent(field, value);
  }

  private changeRutOrPatent(field: string, value: string | number): void {
    if (field === 'rut') {
      this.rutOrPatentChange.emit({ type: 'rut', value });
    } else if (field === 'patent') {
      this.rutOrPatentChange.emit({ type: 'patent', value });
    }
  }

  public changeTextarea(event: any): void {
    this.textareaChange.emit(event.srcElement.value);
  }

  public getValueField(field: string): string | number {
    const value = this.values.value[`${field}`] || null;
    return Number(value) || value;
  }

  getCapture(index: number) {
    // if (!this.platform.is('android') && !this.platform.is('ios')) {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', () => {
      const file = input.files[0];
      const year = new Date().toISOString().split('T')[0].split('-')[0];
      const month = new Date().toISOString().split('T')[0].split('-')[1];
      const day = new Date().toISOString().split('T')[0].split('-')[2];
      const filePath = `${year}/${month}/${day}/${Date.now()}_img`;
      const fileRef = this.storage.ref(filePath);

      // Img to base64
      const FR = new FileReader();

      FR.addEventListener('load', (e) => {
        (document.querySelectorAll('.my-image')[
          index
        ] as HTMLDivElement).classList.add('square-box-with-img');
        (document.querySelectorAll('.my-image')[
          index
        ] as HTMLDivElement).classList.remove('square-box-img');
        (document.querySelectorAll('.my-image')[
          index
        ] as HTMLDivElement).style.backgroundImage = `url("${e.target.result}")`;
        (document.querySelectorAll('.my-image')[
          index
        ] as HTMLDivElement).style.backgroundPosition = 'center';
        (document.querySelectorAll('.my-image')[
          index
        ] as HTMLDivElement).style.backgroundSize = 'cover';
      });

      FR.readAsDataURL(file);

      const task = this.storage.upload(filePath, file);
      const upload$ = task.percentageChanges().subscribe((percent) => {
        if (percent === 100) {
          fileRef.getDownloadURL().subscribe((img) => {
            if (this.imgSaved[index] !== undefined) {
              this.imgRefSaved[index].delete();
            }
            this.imgSaved[index] = img + '';
            this.imgRefSaved[index] = fileRef;

            this.imgLoadedChange.emit(this.imgSaved);
          });
        }
      });
      task.snapshotChanges().pipe(finalize(() => upload$.unsubscribe()));
    });
    input.click();
    // }

    // this.camera.getPicture(this.cameraOptions).then(
    //   (imageData) => {
    //     // imageData is either a base64 encoded string or a file URI
    //     // If it's base64 (DATA_URL):
    //     const base64Image = 'data:image/jpeg;base64,' + imageData;
    //     console.log(base64Image);
    //   },
    //   (err) => {
    //     // Handle error
    //   }
    // );
  }
}
