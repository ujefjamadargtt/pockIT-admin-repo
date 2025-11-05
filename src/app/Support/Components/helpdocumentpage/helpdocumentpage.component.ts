import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DomSanitizer } from '@angular/platform-browser';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-helpdocumentpage',
  templateUrl: './helpdocumentpage.component.html',
  styleUrls: ['./helpdocumentpage.component.css'],
})
export class HelpdocumentpageComponent {
  isSpinning: boolean = false;
  public commonFunction = new CommonFunctionService();
  Emaiid = sessionStorage.getItem('emailId');
  decryptedEmail = this.Emaiid
    ? this.commonFunction.decryptdata(this.Emaiid)
    : '';

  MobileNo = sessionStorage.getItem('mobile');

  decryptedMobile = this.MobileNo
    ? this.commonFunction.decryptdata(this.MobileNo)
    : '';

  isCollapsed = false;
  selectedContent: any = [];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }
  faqHeads: any;
  menuItems: any = [];
  isFirstLoad: boolean = true;

  ngOnInit() {
    this.api
      .gethelpDocumentCategory(0, 0, 'id', 'asc', ' AND IS_ACTIVE=1')
      .subscribe((data: any) => {
        if (data.status == 200) {
          this.faqHeads = data.body['data'];
          this.menuItems = this.transformFaqData(this.faqHeads);

          if (this.menuItems.length > 0) {
            const firstMenu = this.menuItems[0];
            firstMenu.open = true;
            this.ItemID = firstMenu['id'];

            this.getSubCategories(firstMenu, true);
          }
        }
      });
  }

  getSubCategories(event, boolean) {
    this.isSpinning = true;
    this.selectedContent = [];

    if (boolean) {
      this.api
        .gethelpDocumentsubCategory(
          0,
          0,
          '',
          'desc',
          ' AND STATUS=1 AND CATEGORY_ID= ' + event.id
        )
        .subscribe((data) => {
          if (data.status == 200) {
            this.menuItems.forEach((dataa) => {
              if (dataa.id == event.id) {
                dataa.children = [];
                dataa.children.push(...data.body.data);
              }
            });

            if (this.isFirstLoad) {
              const firstChild = this.menuItems.find(
                (item) => item.id == event.id
              )?.children?.[0];
              if (firstChild) {
                this.ItemID = firstChild;
                this.loadHelpData(firstChild);
              }
              this.isFirstLoad = false;
            }
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
            this.selectedContent = [];
            this.menuItems = [];
          }
        });
    }
  }

  /**
   * Transform API response into menuItems format.
   */
  transformFaqData(faqHeads: any[]): any[] {
    const categoryMap = new Map<number, any>(); // Stores categories
    const menuItems: any[] = []; // Final structured menu

    faqHeads.forEach((faq) => {
      // Only process items that belong to a category
      if (faq.ID) {
        // If the category doesn't exist in map, create it
        if (!categoryMap.has(faq.ID)) {
          categoryMap.set(faq.ID, {
            id: faq.ID,
            title: faq.HELP_CATEGORY_NAME || 'Uncategorized',
            open: false,
            children: [],
          });
          menuItems.push(categoryMap.get(faq.ID)); // Add category to menu
        }
      }
    });

    return menuItems;
  }

  selectedContentData: any = [];
  // Function to update FAQ content based on menu selection

  ItemID: any;
  onMenuItemClick(item: any) {
    this.isSpinning = true;
    this.ItemID = item;
    this.loadHelpData(item);
  }

  loadHelpData(item: any) {
    this.api
      .getHelpDoc(
        0,
        0,
        'id',
        'asc',
        ' AND CATEGORY_ID = ' +
        item.CATEGORY_ID +
        ' AND SUBCATEGORY_ID= ' +
        item.ID
      )
      .subscribe(
        (data: any) => {
          const statusCode = data.code;
          const responseBody = data.data;

          if (statusCode === 200) {
            this.selectedContent = responseBody;
            // this.selectedContent = Array.from({ length: 50 }, (_, i) => ({
            //   ID: i + 1,
            //   NAME: `Document ${i + 1}`,
            //   TYPE: i % 2 === 0 ? 'D' : 'L', // आर्धे Documents, आर्धे Links
            //   CATEGORY_ID: 1,
            //   SUBCATEGORY_ID: 1,
            // }));
          }
          this.isSpinning = false;
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }

  isModalVisible = false;
  selectedItem: any;
  // fullImageUrl: string = '';
  retriveImageurl = appkeys.retriveimgUrl;
  fullImageUrl;

  pdfUrl: any;
  loaddocs: boolean = false;
  openDocument(item: any): void {
    this.loaddocs = true;

    if (item.TYPE === 'D') {
      this.selectedItem = item;

      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${this.retriveImageurl}HelpDocument/${item.DOCUMENT}#toolbar=0&navpanes=0&scrollbar=0`
      );

      this.isModalVisible = true;
      this.loaddocs = false;

      // Force Angular to detect changes
      // this.cdr.detectChanges();
    } else if (item.TYPE === 'L' && item.LINK) {
      window.open(item.LINK, '_blank');
      this.loaddocs = false;
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }
}
