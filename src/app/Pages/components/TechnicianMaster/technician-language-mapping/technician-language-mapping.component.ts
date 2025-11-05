import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
export class Data {
  LANGUAGE_ID: any = [];
  LANGUAGE_NAME: string;
  PROFICIENCY_LEVEL: string;
  IS_PRIMARY: string;
  IS_ACTIVE: boolean = false;
}
@Component({
  selector: 'app-technician-language-mapping',
  templateUrl: './technician-language-mapping.component.html',
  styleUrls: ['./technician-language-mapping.component.css'],
})
export class TechnicianLanguageMappingComponent {
  @Input() data;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  Languagedata: any[] = [];
  LanguagessMappingdata: any[] = [];
  isSpinning = false;
  isLoading = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe // private modal: NzModalService
  ) { }
  LANGUAGE_PROFICIENCY_LEVEL = [
    { Id: 'B', Name: 'Beginner' },
    { Id: 'I', Name: 'Intermediate' },
    { Id: 'A', Name: 'Advanced' },
    { Id: 'P', Name: 'Proficient or Native' },
  ];

  ngOnInit(): void {
    this.getLanguageData();
    this.getLanguageDataforMapping();
  }
  getLanguageData() {
    const technicianId = this.data.ID;

    if (!technicianId) {
      this.message.error('Invalid Technician ID', '');
      return;
    }
    this.api
      .getLanguageData(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE=1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Languagedata = data['data'];
          } else {
            this.Languagedata = [];
            this.message.error('Failed To Get Language Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  getFilteredLanguageData(): any[] {
    return this.Languagedata.filter(
      (Language) =>
        !this.LanguagessMappingdata.some(
          (entry) => entry.LANGUAGE_ID === Language.ID
        )
    );
  }
  getLanguageDataforMapping() {
    this.isLoading = true;
    this.api
      .getTechnicianLanguageData(
        0,
        0,
        '',
        'asc',
        ' AND TECHNICIAN_ID=' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.LanguagessMappingdata = data['data'];
            this.isLoading = false;

          } else {
            this.LanguagessMappingdata = [];
            this.message.error('Failed To Get Language Data', '');
            this.isLoading = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  saveData: any = new Data();
  issaveSpinning = false;
  isSkillSpinning = false;

  add(Languagemaster: NgForm): void {
    if (!this.saveData.LANGUAGE_ID || this.saveData.LANGUAGE_ID.length === 0) {
      this.message.error('Please select language.', '');
      return;
    }

    this.issaveSpinning = true;

    // Iterate through the selected LANGUAGE_IDs
    const newEntries = this.saveData.LANGUAGE_ID.map((LanguageId: number) => {
      const selectedLanguage = this.Languagedata.find(
        (Language) => Language.ID === LanguageId
      );

      if (!selectedLanguage) {
        return null; // Skip invalid skills
      }

      return {
        LANGUAGE_NAME: selectedLanguage.NAME,
        LANGUAGE_ID: LanguageId,
        IS_ACTIVE: true, // Default status
      };
    }).filter((entry) => entry !== null); // Filter out invalid entries

    if (newEntries.length === 0) {
      this.message.error('Invalid Language selection.', '');
      this.issaveSpinning = false;
      return;
    }

    // Prevent duplicate entries
    newEntries.forEach((entry) => {
      const exists = this.LanguagessMappingdata.some(
        (item) => item.LANGUAGE_ID === entry.LANGUAGE_ID
      );
      if (!exists) {
        this.LanguagessMappingdata.push(entry);
      }
    });

    // Update the data array and reset the form
    this.LanguagessMappingdata = [...this.LanguagessMappingdata];

    this.resetDrawer(Languagemaster);

    // Notify success
    this.message.success('Language added successfully.', '');
    this.issaveSpinning = false;
  }

  resetDrawer(technicianmaster: NgForm) {
    this.saveData.LANGUAGE_ID = null;
    technicianmaster.form.markAsPristine();
    technicianmaster.form.markAsUntouched();
  }
  close() {
    this.drawerClose();
  }
  // save() {
  //   this.isSpinning = true;

  //   // Proceed with saving data if all entries are valid

  //   const dataToSave = this.LanguagessMappingdata.filter(
  //     (data) => data.IS_ACTIVE === true || data.IS_ACTIVE == '1'
  //   ).map((data) => ({
  //     LANGUAGE_ID: data.LANGUAGE_ID,
  //     PROFICIENCY_LEVEL: data.PROFICIENCY_LEVEL,
  //     IS_PRIMARY:
  //       data.IS_PRIMARY == null ||
  //       data.IS_PRIMARY == false ||
  //       data.IS_PRIMARY == undefined
  //         ? 0
  //         : 1,
  //     IS_ACTIVE:
  //       data.IS_ACTIVE == null ||
  //       data.IS_ACTIVE == false ||
  //       data.IS_ACTIVE == undefined
  //         ? 0
  //         : 1,
  //   }));

  //   this.api
  //     .addsLanguagesTeachniacianMapping(this.data.ID, dataToSave)
  //     .subscribe(
  //       (successCode) => {
  //         if (successCode['code'] === 200) {
  //           this.message.success(
  //             'Technican Successfully Mapped to the Language.',
  //             ''
  //           );
  //           this.isSpinning = false;
  //           this.drawerClose();
  //         } else {
  //           this.message.error('Failed to Map Technician to the Language', '');
  //         }
  //         this.isSpinning = false;
  //       },
  //       () => {
  //         this.isSpinning = false;
  //         this.message.error('Something Went Wrong.', '');
  //       }
  //     );
  // }
  save() {
    this.isSpinning = true;

    // Filter and prepare data to save
    const dataToSave = this.LanguagessMappingdata.filter(
      (data) => data.IS_ACTIVE === true || data.IS_ACTIVE == '1'
    ).map((data) => ({
      LANGUAGE_ID: data.LANGUAGE_ID,
      PROFICIENCY_LEVEL: data.PROFICIENCY_LEVEL,
      IS_PRIMARY:
        data.IS_PRIMARY == null ||
          data.IS_PRIMARY == false ||
          data.IS_PRIMARY == undefined
          ? 0
          : 1,
      IS_ACTIVE:
        data.IS_ACTIVE == null ||
          data.IS_ACTIVE == false ||
          data.IS_ACTIVE == undefined
          ? 0
          : 1,
    }));

    // Check if there's data in the table
    if (this.LanguagessMappingdata.length === 0) {
      this.isSpinning = false;
      this.message.error('At least one language needs to be added.', '');
      return; // Exit early
    }

    // // Check if there's data to save
    // if (dataToSave.length === 0) {
    //   this.isSpinning = false;
    //   this.message.error('At least one language needs to be active.', '');
    //   return; // Exit early
    // }

    // Call API to save data
    this.api
      .addsLanguagesTeachniacianMapping(this.data.ID, dataToSave)
      .subscribe(
        (successCode) => {
          if (successCode['code'] === 200) {
            this.message.success(
              'Technician Successfully Mapped to the Language.',
              ''
            );
            this.isSpinning = false;
            this.drawerClose();
          } else {
            this.message.error('Failed to Map Technician to the Language', '');
          }
          this.isSpinning = false;
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something Went Wrong.', '');
        }
      );
  }



  onPrimaryChange(selectedData: any): void {
    if (selectedData.IS_PRIMARY) {
      // Set all other IS_PRIMARY values to false
      this.LanguagessMappingdata.forEach((item) => {
        if (item !== selectedData) {
          item.IS_PRIMARY = false;
        }
      });
    }
  }



}
