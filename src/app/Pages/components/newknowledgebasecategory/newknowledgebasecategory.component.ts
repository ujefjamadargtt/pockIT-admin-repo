import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-newknowledgebasecategory',
  templateUrl: './newknowledgebasecategory.component.html',
  styleUrls: ['./newknowledgebasecategory.component.css'],
})
export class NewknowledgebasecategoryComponent {
  isSpinning: boolean = false;
  public commonFunction = new CommonFunctionService();
  Emaiid = sessionStorage.getItem('emailId');
  decryptedEmail = this.Emaiid
    ? this.commonFunction.decryptdata(this.Emaiid)
    : '';
  userId = sessionStorage.getItem('userId');
  decryptedUserId = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  roleId = sessionStorage.getItem('roleId');
  decryptedroleId = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  userName = sessionStorage.getItem('userName');
  decrypteduserName = this.userName
    ? this.commonFunction.decryptdata(this.userName)
    : '';
  MobileNo = sessionStorage.getItem('mobile');
  decryptedMobile = this.MobileNo
    ? this.commonFunction.decryptdata(this.MobileNo)
    : '';
  isCollapsed = false;
  selectedContent: any = null;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  faqHeads: any;
  menuItems: any = [];
  categoryData: any;
  subcategoryData: any;
  ngOnInit() {
    this.api.getKnowledgeBaseCategoryData(0, 0, 'id', 'asc', '').subscribe(
      (data: HttpResponse<any>) => {
        const statusCode = data.status;
        const responseBody = data.body;
        this.categoryData = responseBody['data'];
        this.api
          .getKnowledgeBasesubCategoryData(0, 0, 'id', 'asc', '')
          .subscribe(
            (dataaaaa: HttpResponse<any>) => {
              this.subcategoryData = dataaaaa.body['data'];
              this.generateMenu();
              this.menuItems;
            },
            (err) => { }
          );
      },
      (err) => { }
    );
  }
  loadFaqData(itemId: number) {
    this.api
      .getAllFaqs(0, 0, 'id', 'asc', ' AND FAQ_HEAD_ID = ' + itemId)
      .subscribe(
        (data: HttpResponse<any>) => {
          if (data.status === 200) {
            this.selectedContent =
              data.body['data']?.map((faq: any) => ({
                ...faq,
                userLiked: faq.POSITIVE_COUNT > 0,
                userDisliked: faq.NEGATIVE_COUNT > 0,
                negativeFeedback: '',
              })) || [];
            this.selectedContentData = [...this.selectedContent];
          }
          this.isSpinning = false;
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }
  transformFaqData(faqHeads: any[]): any[] {
    const menuMap = new Map<number, any>();
    const menuItems: any[] = [];
    faqHeads?.forEach((faq) => {
      const menuItem = {
        id: faq.ID,
        title: faq.NAME,
        content: faq.DESCRIPTION || '',
        open: false,
        children: [],
      };
      menuMap.set(faq.ID, menuItem);
    });
    faqHeads?.forEach((faq) => {
      if (faq.PARENT_ID === 0) {
        menuItems.push(menuMap.get(faq.ID));
      } else {
        const parentItem = menuMap.get(faq.PARENT_ID);
        if (parentItem) {
          if (!parentItem.children.length) {
            parentItem.children.push({
              groupTitle: `Sub-items of ${parentItem.title}`,
              items: [],
            });
          }
          parentItem.children[0].items.push(menuMap.get(faq.ID));
        }
      }
    });
    return menuItems;
  }
  selectedContentData: any = [];
  ItemID: any;
  searchQuery: any = '';
  SearchSkill(data: any) {
    this.isSpinning = true;
    if (data && data.trim().length >= 3) {
      const searchTerm = data.toLowerCase();
      this.selectedContent = this.selectedContentData.filter((record) => {
        const titleMatch =
          record.TITLE?.toLowerCase().includes(searchTerm) || false;
        const descriptionMatch =
          record.DESCRIPTION?.toLowerCase().includes(searchTerm) || false;
        return titleMatch || descriptionMatch;
      });
    } else if (data.trim().length === 0) {
      this.selectedContent = [...this.selectedContentData];
    }
    this.isSpinning = false;
  }
  increaseNegative(faq: any) {
    faq.NEGATIVE_COUNT++;
  }
  clearSearch() {
    this.searchQuery = ''; 
    this.isSpinning = false;
    this.selectedContent = [...this.selectedContentData]; 
  }
  negativeFeedback: boolean = false;
  toggleTextArea(faq: any) {
    if (faq.userLiked) return;
    faq.showTextArea = !faq.showTextArea;
  }
  increasePositive(faq: any) {
    if (faq.userLiked) {
      if (faq.POSITIVE_COUNT > 0) faq.POSITIVE_COUNT--; 
      faq.userLiked = false;
      faq.STATUS = 'U'; 
    } else {
      faq.POSITIVE_COUNT++;
      if (faq.userDisliked) {
        faq.NEGATIVE_COUNT--; 
        faq.userDisliked = false;
        faq.showTextArea = false;
      }
      faq.userLiked = true;
      faq.STATUS = 'P'; 
      faq.negativeFeedback = '';
    }
    this.updateFeedback(faq);
  }
  submitNegativeResponse(faq: any) {
    if (faq.userDisliked) {
      if (faq.NEGATIVE_COUNT > 0) faq.NEGATIVE_COUNT--; 
      faq.userDisliked = false;
      faq.showTextArea = true;
      faq.STATUS = 'U'; 
    } else {
      faq.NEGATIVE_COUNT++;
      if (faq.userLiked) {
        faq.POSITIVE_COUNT--; 
        faq.userLiked = false;
      }
      faq.userDisliked = true;
      faq.showTextArea = true;
      faq.STATUS = 'N'; 
    }
    this.updateFeedback(faq);
  }
  updateFeedback(faq: any) {
    if (
      faq.userDisliked &&
      (!faq.negativeFeedback || faq.negativeFeedback.trim() === '')
    ) {
      this.message.info('Please enter some feedback before submitting.', '');
      return;
    }
    this.isSpinning = true;
    let feedbackData: any = {
      FAQ_MASTER_ID: faq.ID,
      USER_MOBILE: this.decryptedMobile,
      USER_EMAIL_ID: this.decryptedEmail,
      SUGGESTION: faq.negativeFeedback,
      STATUS: faq.STATUS, 
      USER_ID: '',
      CLIENT_ID: '',
      USER_TYPE: '',
      USER_NAME: '',
    };
    if (
      Number(this.decryptedroleId) === 1 ||
      Number(this.decryptedroleId) === 8
    ) {
      feedbackData.USER_ID = this.decryptedUserId;
      feedbackData.USER_NAME = this.decrypteduserName;
      feedbackData.USER_TYPE = 'A';
      this.submitFeedback(feedbackData);
      faq.showTextArea = false;
    } else if (Number(this.decryptedroleId) === 9) {
      this.api
        .getVendorData(0, 0, '', '', ' AND USER_ID = ' + this.decryptedUserId)
        .subscribe(
          (data) => {
            if (data && data['code'] == 200 && data.length > 0) {
              feedbackData.USER_ID = data[0]['ID'];
              feedbackData.USER_NAME = data[0]['NAME'];
              feedbackData.USER_TYPE = 'V';
              this.submitFeedback(feedbackData);
              faq.showTextArea = false;
            } else {
              this.message.error(
                'USER_NAME missing. Failed To Fetch Vendor Data...',
                ''
              );
            }
            this.isSpinning = false;
          },
          () => {
            this.message.error('Something went wrong.', '');
            this.isSpinning = false;
          }
        );
    } else {
      this.api
        .getBackOfficeData(
          0,
          0,
          '',
          '',
          ' AND USER_ID = ' + this.decryptedUserId
        )
        .subscribe(
          (data) => {
            if (data && data['code'] == 200 && data.length > 0) {
              feedbackData.USER_ID = data[0]['ID'];
              feedbackData.USER_NAME = data[0]['NAME'];
              feedbackData.USER_TYPE = 'B';
              this.submitFeedback(feedbackData);
              faq.showTextArea = false;
            } else {
              this.message.error(
                'USER_NAME missing. Failed To Fetch BackOffice Data...',
                ''
              );
            }
            this.isSpinning = false;
          },
          () => {
            this.message.error('Something went wrong.', '');
            this.isSpinning = false;
          }
        );
    }
  }
  submitFeedback(feedbackData: any) {
    this.api.submitNegativeFeedback(feedbackData).subscribe(
      () => {
        this.message.success('Feedback Updated Successfully', '');
        this.isSpinning = false;
      },
      (error) => {
        this.isSpinning = false;
      }
    );
  }
  submitNegativeData(faq: any) {
    const feedbackData = {
      FAQ_MASTER_ID: faq.ID,
      USER_MOBILE: this.decryptedMobile,
      USER_EMAIL_ID: this.decryptedEmail,
      SUGGESTION: faq.negativeFeedback,
      STATUS: 1,
    };
    this.api.updateFaq(faq).subscribe(
      (data: HttpResponse<any>) => {
        if (data.status == 200) {
          this.api.submitNegativeFeedback(feedbackData).subscribe(
            (response) => {
              this.message.success('Unlike Feedback Updated Successfully', '');
              this.onMenuItemClick(this.ItemID);
            },
            (error) => {
              this.message.error('Failed to submit feedback', '');
            }
          );
        } else {
          this.message.error('Failed to update response', '');
        }
        this.isSpinning = false;
      },
      (error) => {
        this.isSpinning = false;
      }
    );
  }
  generateMenu(): void {
    this.menuItems = this.categoryData.map((category) => {
      const relatedSubcategories = this.subcategoryData
        .filter(
          (sub) => Number(sub.KNOWLEDGEBASE_CATEGORY_ID) === Number(category.ID)
        )
        .map((sub) => ({
          id: sub.ID,
          title: sub.NAME,
        }));
      return {
        title: category.NAME,
        open: false,
        children: [
          {
            items: relatedSubcategories,
          },
        ],
      };
    });
  }
  onMenuItemClick(item: any): void {
    this.ItemID = item;
    this.api
      .getKnowledgeBaseData(
        0,
        0,
        'id',
        'asc',
        ' AND KNOWLEDGE_SUB_CATEGORY_ID = ' + item.id + ''
      )
      .subscribe(
        (data: HttpResponse<any>) => {
          const statusCode = data.status;
          const responseBody = data.body;
          this.selectedContent = responseBody['data'];
          this.selectedContentData = responseBody['data'];
        },
        (err) => { }
      );
  }
  openattachemnt(event: any) {
    window.open(this.api.retriveimgUrl + 'KnowledgeBaseDoc/' + event);
  }
}
