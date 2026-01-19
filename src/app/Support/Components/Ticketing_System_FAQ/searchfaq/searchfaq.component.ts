import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { Faq } from 'src/app/Support/Models/TicketingSystem';
@Component({
  selector: 'app-searchfaq',
  templateUrl: './searchfaq.component.html',
  styleUrls: ['./searchfaq.component.css']
})
export class SearchfaqComponent implements OnInit {
  SEARCH = ''
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = "desc";
  sortKey: string = "ID";
  searchText = ''
  searchText1 = ''
  columns: string[][] = [["FAQ_HEAD_NAME", "FAQ Head Name"], ["QUESTION", "Question"], ["ANSWER", "Answer"], ["TAGS", "Tags"]]
  faqHeads: any = []
  issearched = false;
  showFull = true;
  faqDetails: Faq = new Faq();
  inputValue = '';
  showSuggest = false
  constructor(public api: ApiServiceService) { }
  ngOnInit() {
    this.faqHeads = []
    this.issearched = false;
    this.showSuggest = false;
    this.inputValue = ''
    this.showFull = false;
    this.api.getAllFaqHeads(0, 0, 'ID', 'ASC', ' AND STATUS=1').subscribe(data => {
      if (data['code'] == 200) {
        this.faqHeads = data['data'];
      }
    }, err => {
    });
  }
  back2() {
    this.dataList = [];
    this.issearched = false;
  }
  back34() {
    this.getfaqhead();
    this.issearched = false;
    this.searchText1 = '';
  }
  getfaqhead() {
    this.api.getAllFaqHeads(0, 0, 'ID', 'ASC', ' AND STATUS=1').subscribe(data => {
      if (data['code'] == 200) {
        this.faqHeads = data['data'];
      }
    }, err => {
    });
  }
  search(ev) {
    this.searchText = ev;
    this.inputValue = ''
    this.showFull = false;
    this.showSuggest = false;
    this.faqDetails = new Faq();
    if (this.searchText != "") {
      var likeQuery = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)
      this.issearched = true;
      this.loadingRecords = true;
      this.api.getAllFaqs(this.pageIndex, this.pageSize, 'ID', 'ASC', likeQuery).subscribe(data => {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        if (data['code'] == 200)
          this.dataList = data['data'];
      }, err => {
      });
    } else {
      this.dataList = [];
      this.issearched = false;
    }
  }
  search1(id) {
    this.showFull = false;
    this.showSuggest = false;
    this.issearched = true;
    if (this.searchText1 = id.NAME) {
      var likeQuery = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText1 + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)
      this.loadingRecords = true;
      if (id.IS_PARENT == 1) {
        this.api.getAllFaqHeads(0, 0, 'ID', 'ASC', ' AND IS_PARENT=0 AND PARENT_ID = ' + id.ID).subscribe(data => {
          if (data['code'] == 200) {
            this.faqHeads = data['data'];
            this.issearched = false;
          }
        }, err => {
        });
      } else {
        this.api.getAllFaqs(this.pageIndex, this.pageSize, 'ID', 'ASC', ' AND FAQ_HEAD_ID = ' + id.ID).subscribe(data => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          if (data['code'] == 200)
            this.dataList = data['data'];
        }, err => {
        });
      }
    }
  }
  expandFAQ(dataList) {
    this.showFull = true;
    this.faqDetails = dataList;
  }
  back() {
    this.showFull = false;
    this.faqDetails = new Faq();
    this.showSuggest = false;
    this.inputValue = ''
  }
  no() {
    this.showSuggest = true;
  }
  cancel() {
    this.showSuggest = false;
    this.inputValue = ''
  }
  yes(key) {
    var d = {
      ID: 0,
      CLIENT_ID: 1,
      FAQ_MASTER_ID: this.faqDetails.ID,
      USER_MOBILE: '',
      USER_EMAIL_ID: sessionStorage.getItem('emailId'),
      SUGGESTION: key == 'y' ? '' : this.inputValue,
      STATUS: 1
    }
    this.api.createFaqResponse(d).subscribe(data => {
      if (data['code'] == 200) {
        this.showSuggest = false;
        this.inputValue = ''
      }
    }, err => {
    });
  }
  getUrl(url) {
    if (url)
      return this.api.baseUrl + "static/ticket/" + url
    else
      return ""
  }
}
