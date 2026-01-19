import { Component, Input } from '@angular/core';
import { whatsapptemplate } from 'src/app/Pages/Models/whatsapptemplate';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-templatepreview',
  templateUrl: './templatepreview.component.html',
  styleUrls: ['./templatepreview.component.css'],
})
export class TemplatepreviewComponent {
  @Input() data: whatsapptemplate;
  @Input() drawerClose1;
  inputBody: string = '';
  formattedBodyText: string = '';
  upload = '';
  TYPE: string = '';
  inputValue;
  video = '';
  image = '';
  Date;
  parsedButtonValues: Array<{ type: string; buttonText: string }> = [];
  constructor(private api: ApiServiceService) { }
  ngOnInit() {
    this.replacePlaceholders();
    if (this.data && this.data.BODY_TEXT) {
      this.data.BODY_TEXT = this.data.BODY_TEXT.replaceAll('\n', '<br>');
    }
    if (this.data && this.data.BUTTON_VALUES) {
      try {
        if (
          typeof this.data.BUTTON_VALUES === 'string' &&
          this.data.BUTTON_VALUES.trim()
        ) {
          this.data.BUTTON_VALUES = JSON.parse(this.data.BUTTON_VALUES);
        } else {
        }
      } catch (error) {
      }
    } else {
    }
    if (
      this.data.HEADER_VALUES !== null &&
      this.data.HEADER_VALUES !== undefined &&
      this.data.HEADER_TYPE == 'V'
    ) {
      this.video =
        this.api.retriveimgUrl +
        'WhatsAppTemplateImages/' +
        this.data.HEADER_VALUES;
    }
    if (
      this.data.HEADER_VALUES !== null &&
      this.data.HEADER_VALUES !== undefined &&
      this.data.HEADER_TYPE == 'I'
    ) {
      this.image =
        this.api.retriveimgUrl +
        'WhatsAppTemplateImages/' +
        this.data.HEADER_VALUES;
    }
    if (
      this.data.HEADER_VALUES !== null &&
      this.data.HEADER_VALUES !== undefined &&
      this.data.HEADER_TYPE == 'D'
    ) {
      this.upload =
        this.api.retriveimgUrl +
        'WhatsAppTemplateImages/' +
        this.data.HEADER_VALUES;
    }
    const fileExtension = this.getFileExtension(this.data.HEADER_VALUES);
    this.TYPE = fileExtension;
  }
  getFileExtension(fileName: string): string {
    if (fileName && fileName.includes('.')) {
      const extension = fileName.split('.').pop();
      return extension || '';
    }
    return '';
  }
  showfile() { }
  check(inputValue: any) {
    if (inputValue) {
      const pattern = /{{\d+}/g;
      const matches = inputValue.match(pattern);
      if (matches && this.data.HEADER_VALUES != undefined) {
        for (let i = 0; i < matches.length; i++) {
          inputValue = inputValue.replace(
            matches[i].toString() ? matches[i].toString() : inputValue,
            this.data.HEADER_VALUES[i]
              ? this.data.HEADER_VALUES[i]
              : matches[i].toString()
          );
          inputValue = inputValue.replace(
            this.data.HEADER_VALUES[i] + '}',
            this.data.HEADER_VALUES[i]
          );
        }
      } else {
        inputValue = inputValue;
      }
    }
    return inputValue;
  }
  check1() {
    const pattern = /{{\d+}/g;
    const matches = this.data.BODY_TEXT.match(pattern);
    if (matches && this.data.BODY_VALUES != undefined) {
      for (let i = 0; i < matches.length; i++) {
        this.inputBody = this.inputBody.replace(
          matches[i].toString() ? matches[i].toString() : this.inputBody,
          this.data.BODY_VALUES[i]
            ? this.data.BODY_VALUES[i]
            : matches[i].toString()
        );
        this.inputBody = this.inputBody.replace(
          this.data.BODY_VALUES[i] + '}',
          this.data.BODY_VALUES[i] + ' '
        );
      }
    } else {
      this.inputBody = this.data.BODY_TEXT;
    }
  }
  convertMarkdownToHTML(text: any, BODY_VALUES: any): string {
    if (text) {
      text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
      text = text.replace(/_([^_]+?)_/g, '<em>$1</em>');
      text = text.replace(/<br\s*[\/]?>/gi, '\n');
      text = text.replace(/\n/g, '<br>');
      const pattern = /{{\d+}/g;
      const matches = text.match(pattern);
      if (matches && BODY_VALUES != undefined) {
        for (let i = 0; i < matches.length; i++) {
          text = text.replace(
            matches[i].toString() ? matches[i].toString() : text,
            BODY_VALUES[i] ? BODY_VALUES[i] : matches[i].toString()
          );
          text = text.replace(BODY_VALUES[i] + '}', BODY_VALUES[i] + ' ');
        }
      } else {
        text = text;
      }
    }
    return text;
  }
  replacePlaceholders() {
    let text = this.data?.BODY_TEXT || ''; 
    let bodyValues: string[] = [];
    if (this.data?.BODY_VALUES && typeof this.data.BODY_VALUES === 'string') {
      try {
        bodyValues = JSON.parse(this.data.BODY_VALUES);
      } catch (error) {
        bodyValues = []; 
      }
    } else {
    }
    const pattern = /{{\d+}}/g; 
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((placeholder, index) => {
        const value = bodyValues[index] || placeholder; 
        text = text.replace(placeholder, value);
      });
    } else {
    }
    this.formattedBodyText = text;
  }
}
