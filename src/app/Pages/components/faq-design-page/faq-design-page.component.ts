import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-faq-design-page',
  templateUrl: './faq-design-page.component.html',
  styleUrls: ['./faq-design-page.component.css'],
})
export class FAQDesignPageComponent {
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
  ngOnInit() {
    this.api.getAllFaqHeads(0, 0, 'id', 'asc', ' AND STATUS=1').subscribe(
      (data: HttpResponse<any>) => {
        const statusCode = data.status;
        const responseBody = data.body;

        if (statusCode === 200) {
          this.faqHeads = responseBody['data'];

          this.menuItems = this.transformFaqData(this.faqHeads);

          // Open the first menu and submenu if they exist
          if (this.menuItems.length > 0) {
            const firstMenu = this.menuItems[0];
            firstMenu.open = true; // Set the first menu open

            if (firstMenu.children?.length > 0) {
              const firstItem = firstMenu.children[0].items[0];

              if (firstItem) {
                this.ItemID = firstItem;
                this.loadFaqData(firstItem.id);
              }
            }
          }
        }
      },
      (err) => {
        //
      }
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
  /**
   * Transform API response into menuItems format.
   */
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
        // If it's a child, find its parent and add it to 'children'
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
  // Function to update FAQ content based on menu selection

  ItemID: any;
  onMenuItemClick(item: any) {
    this.isSpinning = true;
    this.ItemID = item;
    this.loadFaqData(item.id);
  }

  searchQuery: any = '';

  SearchSkill(data: any) {
    this.isSpinning = true;

    if (data && data.trim().length >= 3) {
      const searchTerm = data.toLowerCase();
      this.selectedContent = this.selectedContentData.filter((record) => {
        return (
          record.QUESTION && record.QUESTION.toLowerCase().includes(searchTerm)
        );
      });
      this.isSpinning = false;
    } else if (data.trim().length === 0) {
      this.isSpinning = false;
      this.selectedContent = [...this.selectedContentData];
    } else {
      // If less than 3 characters, do not filter and show the original data
      this.isSpinning = false;
    }
  }

  // Function to update negative feedback count
  increaseNegative(faq: any) {
    faq.NEGATIVE_COUNT++;
  }

  clearSearch() {
    this.searchQuery = ''; // Reset the search input
    this.isSpinning = false;
    this.selectedContent = [...this.selectedContentData]; // Restore original data
  }

  negativeFeedback: boolean = false;
  toggleTextArea(faq: any) {
    if (faq.userLiked) return;

    faq.showTextArea = !faq.showTextArea;
  }

  increasePositive(faq: any) {
    if (faq.userLiked) {
      // Undo Like
      if (faq.POSITIVE_COUNT > 0) faq.POSITIVE_COUNT--; // Prevent going below zero
      faq.userLiked = false;
      faq.STATUS = 'U'; // Reset status
    } else {
      // Like the FAQ
      faq.POSITIVE_COUNT++;

      if (faq.userDisliked) {
        faq.NEGATIVE_COUNT--; // Remove previous dislike
        faq.userDisliked = false;
        faq.showTextArea = false;
      }

      faq.userLiked = true;
      faq.STATUS = 'P'; // Set status to positive

      faq.negativeFeedback = '';
    }

    this.updateFeedback(faq);
  }

  submitNegativeResponse(faq: any) {
    if (faq.userDisliked) {
      // Undo Dislike
      if (faq.NEGATIVE_COUNT > 0) faq.NEGATIVE_COUNT--; // Prevent going below zero
      faq.userDisliked = false;
      // faq.showTextArea = false;
      faq.showTextArea = true;
      faq.STATUS = 'U'; // Reset status
    } else {
      // Dislike the FAQ
      faq.NEGATIVE_COUNT++;

      if (faq.userLiked) {
        faq.POSITIVE_COUNT--; // Remove previous like
        faq.userLiked = false;
      }

      faq.userDisliked = true;
      faq.showTextArea = true;
      faq.STATUS = 'N'; // Set status to negative
    }

    // Ensure feedback is provided for dislikes
    // if (
    //   faq.userDisliked &&
    //   (!faq.negativeFeedback || faq.negativeFeedback.trim() === '')
    // ) {
    //   this.message.error('Please enter some feedback before submitting.', '');
    //   return;
    // }

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
      STATUS: faq.STATUS, // Use 'P' for liked and 'N' for disliked
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
          // Submit negative feedback
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
}
