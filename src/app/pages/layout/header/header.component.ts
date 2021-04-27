import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '../../shared/utils.service';
import { TenantSettingsComponent } from '../../tenant-settings/tenant-settings.component';

@Component({
  selector: 'sapper-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  form: FormGroup;
  headerTextColor = '#ffffff';
  buttonColor = '#007bff';
  buttonTextColor = '#ffffff';
  headerActive = '#2929a5';
  headerTheme = 'linear-gradient(-45deg, rgb(3, 11, 92), rgb(32, 97, 233) 83%, rgb(3, 11, 92) 95%)';
  filename = '';
  logoPath = 'assets/images/SapperLogoTrans.png';
  tempImage = '';
  showImage = false;
  dialogRef;
  imageErrorMessage: string;
  @ViewChild('template') template: TemplateRef<any>;
  @ViewChild('uploadTemplate') uploadTemplate: TemplateRef<any>;


  constructor(
    public translate: TranslateService,
    public router: Router,
    private readonly utilsService: UtilsService,
    public dialog: MatDialog,
    private readonly formBuilder: FormBuilder
  ) {
    translate.addLangs(utilsService.getLangList());
    translate.use(utilsService.getDefaultLang());
  }

  ngOnInit() {
    // default values
    document.documentElement.style.setProperty('--header-text-color', this.headerTextColor);
    document.documentElement.style.setProperty('--button-color', this.buttonColor);
    document.documentElement.style.setProperty('--button-text-color', this.buttonTextColor);
    document.documentElement.style.setProperty('--header-theme-color', this.headerTheme);
    document.documentElement.style.setProperty('--header-active-color', this.headerActive);

    // values for dynamic color changes
    this.form = this.formBuilder.group({
      headerTextColor: [this.headerTextColor, Validators.required],
      buttonColor: [this.buttonColor, Validators.required],
      buttonTextColor: [this.buttonTextColor, Validators.required],
      headerTheme: [this.headerTheme, Validators.required],
      headerActive: [this.headerActive, Validators.required]
    });
  }

  // open material dialog box of setting
  openSettings(): void {
    this.dialogRef = this.dialog.open(TenantSettingsComponent, { data: { name: 'Tenant Settings'} });
  }

  // open material dialog box to change theme
  openModal(template: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(template, { width: '500px' });
  }

  // close dialog box on close button
  closeModal() {
    this.dialogRef.close();
  }

  /**
   * To change the logo
   * @param $event: any
   * @returns void
   */
  onFileChange($event): void {
    this.imageErrorMessage = '';
    const file = $event.target.files[0];
    const reader = new FileReader();
    const imageSize = $event.target.files[0].size;
    if (imageSize > 50000) {
      this.imageErrorMessage = 'Image size should not be greater than 50KB.';
    } else {
      reader.onloadend = (imageFile) => {
        this.tempImage = `${reader.result}`;
        this.showImage = true;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Save theme related inputs
   * @param value: any
   * @returns void
   */
  saveImage(value): void {
    this.imageErrorMessage = '';
    document.documentElement.style.setProperty('--header-text-color', value.headerTextColor);
    document.documentElement.style.setProperty('--header-theme-color', value.headerTheme);
    document.documentElement.style.setProperty('--header-active-color', value.headerActive);
    document.documentElement.style.setProperty('--button-color', value.buttonColor);
    document.documentElement.style.setProperty('--button-text-color', value.buttonTextColor);

    if (this.tempImage) {
      this.logoPath = this.tempImage;
    }
    this.closeModal();
  }
  /**
   * to change lang   *
   */
  changeLang(selectedLang) {
    this.translate.use(selectedLang);
    this.utilsService.setDefaultLang(selectedLang);
  }

  /**
   * logout method: should redirect to login page
   */
  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
