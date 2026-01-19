import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import {
  Department,
  Ticketgroup,
} from 'src/app/Support/Models/TicketingSystem';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ticketgroup',
  templateUrl: './ticketgroup.component.html',
  styleUrls: ['./ticketgroup.component.css'],
  providers: [DatePipe],
})
export class TicketgroupComponent implements OnInit {
  formTitle = 'Ticket Group Master';
  formTitleHead;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  addFirstQuestion = false;
  parentLoading = false;
  departmentLoading = false;
  loadingRecords = false;
  mapFaqVisible = false;
  totalRecords = 1;
  filterQuery = '';
  faqs: any[] = [];
  ticketGroups: Ticketgroup[];
  ticketGroup: Ticketgroup;
  departments: Department[];
  ticketData: Ticketgroup = new Ticketgroup();
  ticketDat2: Ticketgroup = new Ticketgroup();
  isSpinning = false;
  date = new Date();
  date1: any = this.datePipe.transform(this.date, 'yyyyMMddHHmmss');
  fileDataLOGO_URL: any;
  folderName = 'ticketGroup';
  nodes: any = [];
  ID: number;
  ticketGroupId: number;
  dataList: any = [];
  columns: string[][] = [
    ['PARENT_VALUE', 'Parent Name'],
    ['DEPARTMENT_NAME', 'Department'],
    ['TYPE', 'Type'],
    ['VALUE', 'Value'],
    ['SEQ_NO', 'Sequence No'],
    ['IS_LAST_STATUS', 'Is Last'],
    ['TICKET_GROUP_STATUS', 'Status'],
    ['PRIORITY', 'Priority'],
  ];
  addOptionVisible = false;
  visibleAdd = true;
  NAME: string;
  Question: string;
  applicationId = Number(this.cookie.get('applicationId'));
  ticketId: number;
  name1 = 'None';
  newId = 0;
  loadingRecordsFaqs = false;
  item = {};
  parentId = 0;
  type = '';
  ticketQuestion: Ticketgroup[] = [];
  is_first = 0;
  title = '';
  clickedParentID = 0;
  parentTicketGroups: Ticketgroup[] = [];
  Title = '';
  FAQHead = 0;
  faqdataList: any = [];
  @ViewChild('treeComponent', { static: false })
  treeComponent!: NzTreeComponent;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  decrepteduserID = parseInt(this.decrepteduserIDString, 10);
  emailId = sessionStorage.getItem('emailId');
  decryptedEmail = this.emailId
    ? this.commonFunction.decryptdata(this.emailId)
    : '';
  MobileNo = sessionStorage.getItem('mobile');
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private router: Router,
    private message: NzNotificationService
  ) { }
  ngOnInit() {
    let get = ' AND APPLICATION_ID=' + this.applicationId;
    this.loadDepartments();
    var filterQuery = ' AND PARENT_ID=0 ';
    this.loadTicketGroups(filterQuery);
    this.api
      .getAllFaqHeads(
        0,
        0,
        'NAME',
        'ASC',
        ' AND STATUS = 1'
      )
      .subscribe(
        (data) => {
          if (data['status'] == '200' && data.body['count'] > 0) {
            this.faqdataList = data.body['data'];
            this.FAQHead = this.faqdataList[0]['ID'];
          } else {
            this.faqdataList = [];
            this.FAQHead = 0;
          }
        },
        (err) => { }
      );
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }
    this.sortKey = sortField;
    this.sortValue = sortOrder;
  }
  setFilter(event) {
    this.FAQHead = event;
    this.mapFaq3(this.ticketGroupId);
  }
  isFocused: any = '';
  Visible(n) {
    this.is_first = n;
    this.ticketData = Object.assign({}, this.ticketDat2);
    this.parentTicketGroups = [];
    if (this.ticketData.ID) {
      this.addFirstQuestion = true;
      this.newId = this.ticketData.PARENT_ID;
      this.name1 = 'None';
      this.Title = 'Update First Question';
    } else {
      this.newId = 0;
      this.name1 = 'None';
      this.ticketData.PARENT_ID = 0;
      this.ticketData.ID = undefined;
      this.ticketData.STATUS = true;
      this.ticketData.IS_LAST = false;
      this.ticketData.URL = '';
      this.ticketData.TYPE = 'Q';
      this.addFirstQuestion = true;
    }
  }
  loadDepartments() {
    var filter1 = ' AND APPLICATION_ID=' + this.applicationId;
    this.api
      .getAllDepartments(
        0,
        0,
        '',
        '',
        ' AND ORG_ID=1'
      )
      .subscribe(
        (departments) => {
          this.departments = departments.body['data'];
          this.departmentLoading = false;
        },
        (err) => {
          this.departmentLoading = false;
        }
      );
  }
  drawerClose(): void {
    this.is_first = 0;
    this.addFirstQuestion = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose1(): void {
    this.addOptionVisible = false;
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  drawerClose2(): void {
    this.mapFaqVisible = false;
  }
  get closeCallback2() {
    return this.drawerClose2.bind(this);
  }
  loadTicketGroups(filter?) {
    this.loadingRecords = true;
    this.parentLoading = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    if (this.searchText != '') {
      var likeQuery = this.filterQuery + ' AND ';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      filter = likeQuery;
    }
    this.dataList = [];
    this.ticketDat2 = new Ticketgroup();
    this.api
      .getAllTicketGroups(0, 0, '', '', filter + ' AND ORG_ID= 1')
      .subscribe(
        (ticketGroups) => {
          if (filter.match(' AND PARENT_ID=0')) {
            if (ticketGroups.body['count'] != 0) {
              this.ticketDat2 = Object.assign({}, ticketGroups.body['data'][0]);
              this.ticketId = this.ticketDat2.ID;
              this.nodes = ticketGroups.body['data'];
              this.nodes = [
                {
                  title:
                    ticketGroups.body['data'][0]['TYPE'] +
                    '.1) ' +
                    ticketGroups.body['data'][0]['VALUE'],
                  key: ticketGroups.body['data'][0]['ID'],
                  type: ticketGroups.body['data'][0]['TYPE'],
                  tickettype: ticketGroups.body['data'][0]['TICKET_TYPE'],
                  department: ticketGroups.body['data'][0]['DEPARTMENT_ID'],
                  islast: ticketGroups.body['data'][0]['IS_LAST_STATUS'],
                  parentID: ticketGroups.body['data'][0]['PARENT_ID'],
                  expanded:
                    ticketGroups.body['data'][0]['IS_LAST_STATUS'] == 'No'
                      ? true
                      : false,
                },
              ];
              this.expandFirstNode();
              this.loadingRecords = false;
            } else {
              this.ticketDat2 = new Ticketgroup();
            }
          } else {
            if (ticketGroups.body['count'] > 0) {
              this.ticketData.PARENT_ID = ticketGroups.body['data'][0]['ID'];
            } else {
              this.ticketDat2 = new Ticketgroup();
            }
            this.loadingRecords = false;
            this.totalRecords = ticketGroups.body['count'];
            this.ticketGroups = ticketGroups.body['data'];
            this.dataList = ticketGroups.body['data'];
          }
          this.parentLoading = false;
        },
        (err) => {
          this.loadingRecords = false;
          this.parentLoading = false;
        }
      );
  }
  loadTicketGroups2(filter?) {
    this.loadingRecords = true;
    this.parentLoading = false;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.searchText != '') {
      var likeQuery = this.filterQuery + ' AND ';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      filter = likeQuery;
    }
    this.ticketGroups = [];
    this.ticketQuestion = [];
    this.api
      .getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filter + ' AND ORG_ID= 1')
      .subscribe(
        (ticketGroups) => {
          if (ticketGroups['status'] == 200) {
            if (ticketGroups.body['count'] == 0) {
              this.totalRecords = 0;
              this.loadingRecords = false;
            } else {
              this.ticketQuestion = ticketGroups.body['data'].filter(
                (item) => item.TYPE == 'Q'
              );
              this.ticketGroups = ticketGroups.body['data'].filter(
                (item) => item.TYPE == 'O'
              );
              this.totalRecords = ticketGroups.body['count'];
              this.loadingRecords = false;
            }
          }
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error('Something went wrong. Please try again later.', '');
        }
      );
  }
  onFileSelectedURL(event) {
    this.fileDataLOGO_URL = <File>event.target.files[0];
    var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
  }
  close(accountMasterPage: NgForm) {
    accountMasterPage.form.reset();
    this.addFirstQuestion = false;
  }
  close2() {
    this.addFirstQuestion = false;
    this.filterQuery = ' AND PARENT_ID=0';
    this.loadTicketGroups(this.filterQuery);
  }
  save(addNew: boolean, accountMasterPage: NgForm) {
    var ok = true;
    this.ticketData['ORG_ID'] = Number(1);
    if (
      this.ticketData.VALUE != undefined &&
      this.ticketData.VALUE.toString().trim() != ''
    ) {
      if (this.ticketData.IS_LAST) {
        if (
          this.ticketData.PRIORITY != undefined &&
          this.ticketData.PRIORITY.toString().trim() != ''
        ) {
        } else {
          ok = false;
          this.message.error('Please Select Priority', '');
        }
      }
      if (this.ticketData.TYPE == 'O') {
        if (
          this.ticketData.SEQ_NO == undefined ||
          this.ticketData.SEQ_NO <= 0
        ) {
          ok = false;
          this.message.error('Please Enter Sequence No.', '');
        }
      } else {
        this.ticketData.SEQ_NO = 0;
      }
      if (this.ticketData.IS_LAST == 1) {
        if (
          this.ticketData.DEPARTMENT_ID == undefined ||
          this.ticketData.DEPARTMENT_ID.length == 0 ||
          this.ticketData.DEPARTMENT_ID == null ||
          !this.ticketData.DEPARTMENT_ID
        ) {
          ok = false;
          this.message.error('Please Select Department', '');
        }
      } else {
        this.ticketData.DEPARTMENT_ID = 0;
      }
      if (ok) {
        this.isSpinning = true;
        if (this.ticketData.ID) {
          if (this.fileDataLOGO_URL) {
            if (this.ticketData.URL == '') {
              this.ticketData.URL = this.genarateKeyLOGO_URL();
            } else {
              var str = this.ticketData.URL.substring(
                this.ticketData.URL.lastIndexOf('/') + 1
              ).split('.');
              var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
              var url = str[0] + '.' + fileExt;
              this.api.onUpload(this.folderName, this.fileDataLOGO_URL, url);
              this.ticketData.URL =
                this.api.retriveimgUrl + this.folderName + '/' + url;
            }
          } else {
            this.ticketData.URL = '';
          }
          this.api
            .updateTicketGroup1(this.ticketData)
            .subscribe((successCode) => {
              if (successCode['status'] == '200') {
                this.message.success('Ticket group update Successfully', '');
                accountMasterPage.form.reset();
                this.close2();
                setTimeout(() => this.expandFirstNode(), 1000);
                this.isSpinning = false;
              } else {
                this.message.error(
                  'Failed to update ticket group information',
                  ''
                );
                this.isSpinning = false;
              }
            });
        } else {
          if (this.fileDataLOGO_URL) {
            this.ticketData.URL = this.genarateKeyLOGO_URL();
          } else {
            this.ticketData.URL = '';
          }
          this.ticketData.URL = '';
          this.ticketData.PRIORITY = 'M';
          this.ticketData.ALERT_MSG = '';
          this.api
            .createTicketGroup(this.ticketData)
            .subscribe((successCode) => {
              if (successCode['status'] == '200') {
                this.message.success(
                  'Ticket Group information added successfully',
                  ''
                );
                if (!addNew) {
                  accountMasterPage.form.reset();
                  this.close2();
                  setTimeout(() => this.expandFirstNode(), 1000);
                } else {
                  this.ticketData = new Ticketgroup();
                  accountMasterPage.form.reset();
                  this.clearData();
                }
                this.isSpinning = false;
              } else {
                this.message.error(
                  'Failed to add ticket group information',
                  ''
                );
                this.isSpinning = false;
              }
            });
        }
      }
    } else {
      this.message.error('Please Fill All Required Fields', '');
      this.isSpinning = false;
    }
  }
  genarateKeyLOGO_URL() {
    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
    var url = this.date1 + number + '.' + fileExt;
    this.api.onUpload(this.folderName, this.fileDataLOGO_URL, url);
    this.ticketData.URL = this.api.retriveimgUrl + this.folderName + '/' + url;
    return this.ticketData.URL;
  }
  nzEvent(event) {
    if (event['eventName'] == 'expand') {
      let node = event['node'];
      this.clickedParentID = node.origin.parentID;
      if (node['key'] != undefined) {
        this.filterQuery = ' AND PARENT_ID=' + node['key'];
        this.api
          .getAllTicketGroups(0, 0, '', '', this.filterQuery + ' AND ORG_ID= 1')
          .subscribe((ticketGroups) => {
            if (ticketGroups.body['count'] > 0) {
              node.clearChildren(childrens);
              var childrens = ticketGroups.body['data'];
              for (var index = 0; index < ticketGroups.body['count']; index++) {
                childrens = [
                  {
                    title:
                      ticketGroups.body['data'][index]['TYPE'] +
                      '.' +
                      (index + 1) +
                      ') ' +
                      ticketGroups.body['data'][index]['VALUE'],
                    key: ticketGroups.body['data'][index]['ID'],
                    type: ticketGroups.body['data'][index]['TYPE'],
                    tickettype: ticketGroups.body['data'][0]['TICKET_TYPE'],
                    parentID: ticketGroups.body['data'][0]['PARENT_ID'],
                    department:
                      ticketGroups.body['data'][index]['DEPARTMENT_ID'],
                    islast: ticketGroups.body['data'][index]['IS_LAST_STATUS'],
                  },
                ];
                node.addChildren(childrens);
              }
            } else {
              this.message.info('No any Child', '');
            }
          });
      }
    }
  }
  expandFirstNode(): void {
    if (this.treeComponent) {
      const treeNodes = this.treeComponent.getTreeNodes();
      if (treeNodes.length > 0) {
        const firstNode = treeNodes[0]; 
        const fakeEvent = {
          node: firstNode,
          expanded: true,
          eventName: 'expand',
          keys: treeNodes.map((n) => n.key),
          nodes: treeNodes,
        };
        firstNode.isExpanded = true; 
        this.treeComponent.nzExpandChange.emit(fakeEvent);
      }
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => this.expandFirstNode(), 1500); 
  }
  editOption(event) {
    this.ID = event;
    this.parentId = this.ID;
    var data = new Ticketgroup();
    this.api
      .getAllTicketGroups(
        1,
        1,
        'ID',
        'DESC',
        ' AND ID=' + event + ' AND ORG_ID=1 '
      )
      .subscribe((ticketGroups) => {
        if (ticketGroups['status'] == 200) {
          data = ticketGroups.body['data'][0];
          this.api
            .getAllTicketGroups(
              1,
              1,
              'ID',
              'DESC',
              ' AND ID=' + data.PARENT_ID + ' AND ORG_ID= 1'
            )
            .subscribe((ticketGroups) => {
              if (
                ticketGroups['status'] == 200 &&
                ticketGroups.body['count'] > 0
              ) {
                this.clickedParentID = ticketGroups.body['data'][0].PARENT_ID;
                this.edit(data);
              } else {
                this.clickedParentID = 0;
                this.edit(data);
              }
            });
        }
      });
  }
  add() {
    this.is_first = 0;
    this.clearData();
    this.newId = 0;
    this.name1 = 'None';
    this.ticketData.PARENT_ID = this.ID;
    var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
    this.api
      .getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filterQuery + ' AND ORG_ID= 1')
      .subscribe(
        (ticketGroups) => {
          if (ticketGroups['status'] == 200) {
            this.parentTicketGroups = ticketGroups.body['data'];
          }
          this.addFirstQuestion = true;
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error('Something went wrong. Please try again later.', '');
        }
      );
  }
  add2(event, type, node) {
    this.is_first = 0;
    this.clearData();
    this.newId = 0;
    this.name1 = 'None';
    this.ticketData.PARENT_ID = Number(node.origin.key);
    this.ticketData.TYPE = type;
    this.ticketData.STATUS = true;
    this.ticketData.DEPARTMENT_ID = node.origin.department;
    this.clickedParentID = node.origin.parentID;
    this.ID = Number(node.origin.key);
    this.Title = type == 'O' ? 'Add New Option' : 'Add New Question';
    this.filterQuery = ' AND PARENT_ID=' + node.origin['key'];
    if (type == 'Q') {
      this.api
        .getAllTicketGroups(0, 0, '', '', this.filterQuery + ' AND ORG_ID= 1')
        .subscribe((ticketGroups) => {
          if (ticketGroups.body['count'] > 0) {
            this.message.info('You can add only one question to options.', '');
          } else {
            var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
            this.api
              .getAllTicketGroups(
                0,
                0,
                'SEQ_NO',
                'ASC',
                filterQuery + ' AND ORG_ID= 1'
              )
              .subscribe(
                (ticketGroups) => {
                  if (ticketGroups['status'] == 200) {
                    this.parentTicketGroups = ticketGroups.body['data'];
                  }
                  this.addFirstQuestion = true;
                },
                (err) => {
                  this.loadingRecords = false;
                  this.message.error('Something went wrong. Please try again later.', '');
                }
              );
          }
        });
    } else {
      var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
      this.api
        .getAllTicketGroups(
          0,
          0,
          'SEQ_NO',
          'ASC',
          filterQuery + ' AND ORG_ID= 1'
        )
        .subscribe(
          (ticketGroups) => {
            if (ticketGroups['status'] == 200) {
              this.parentTicketGroups = ticketGroups.body['data'];
            }
            this.addFirstQuestion = true;
          },
          (err) => {
            this.loadingRecords = false;
            this.message.error('Something went wrong. Please try again later.', '');
          }
        );
      this.api
        .getAllTicketGroups(
          0,
          0,
          'SEQ_NO',
          'DESC',
          ' AND PARENT_ID=' + this.ID + ' AND ORG_ID=1 '
        )
        .subscribe(
          (ticketGroups2) => {
            if (ticketGroups2['status'] == 200) {
              if (ticketGroups2.body['data'].length == 0) {
                this.ticketData.SEQ_NO = 1;
              } else {
                this.ticketData.SEQ_NO =
                  ticketGroups2.body['data'][0]['SEQ_NO'] + 1;
              }
            }
          },
          (err) => { }
        );
    }
  }
  clearData() {
    this.ticketData.ID = undefined;
    this.ticketData.DEPARTMENT_ID = undefined;
    this.ticketData.VALUE = '';
    this.ticketData.SEQ_NO = 0;
    this.ticketData.PRIORITY = 'M';
    this.ticketData.ALERT_MSG = '';
  }
  edit(data: Ticketgroup) {
    this.ticketData = data;
    this.ticketData['PARENT_ID'] = Number(data.PARENT_ID);
    this.newId = 0;
    this.name1 = 'None';
    this.Title =
      this.ticketData['TYPE'] == 'O' ? 'Update Option' : 'Update Question';
    var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
    this.api
      .getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filterQuery + ' AND ORG_ID= 1')
      .subscribe(
        (ticketGroups) => {
          if (ticketGroups['status'] == 200) {
            this.parentTicketGroups = ticketGroups.body['data'];
          }
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error('Something went wrong. Please try again later.', '');
        }
      );
    this.addFirstQuestion = true;
  }
  mapFaq(data: Ticketgroup) {
    this.loadingRecordsFaqs = true;
    this.ticketGroupId = data.ID;
    this.Question = data.VALUE;
    this.api.getMappingFaqs(data.ID, this.FAQHead, 'C').subscribe(
      (data) => {
        if ((data['status'] = '200')) {
          this.faqs = data.body['data'];
          this.loadingRecordsFaqs = false;
          this.mapFaqVisible = true;
        } else {
          this.loadingRecordsFaqs = false;
          this.message.error('Failed to load Mapped FAQ data', '');
        }
      },
      (err) => {
        this.loadingRecordsFaqs = false;
        this.message.error('Failed to load Mapped FAQ data', '');
      }
    );
  }
  mapFaq2(node) {
    this.loadingRecordsFaqs = true;
    this.ticketGroupId = node.key;
    this.Question = node.title;
    this.api.getMappingFaqs(node.key, this.FAQHead, 'C').subscribe(
      (data) => {
        if ((data['status'] = '200')) {
          this.faqs = data.body['data'];
          this.loadingRecordsFaqs = false;
          this.mapFaqVisible = true;
        } else {
          this.loadingRecordsFaqs = false;
          this.message.error('Failed to load Mapped FAQ data', '');
        }
      },
      (err) => {
        this.loadingRecordsFaqs = false;
        this.message.error('Failed to load Mapped FAQ data', '');
      }
    );
  }
  mapFaq3(node) {
    this.loadingRecordsFaqs = true;
    this.ticketGroupId = node;
    this.api.getMappingFaqs(node, this.FAQHead, 'C').subscribe(
      (data) => {
        if ((data['status'] = '200')) {
          this.faqs = data.body['data'];
          this.loadingRecordsFaqs = false;
          this.mapFaqVisible = true;
        } else {
          this.loadingRecordsFaqs = false;
          this.message.error('Failed to load Mapped FAQ data', '');
        }
      },
      (err) => {
        this.loadingRecordsFaqs = false;
        this.message.error('Failed to load Mapped FAQ data', '');
      }
    );
  }
  closeFaqMap() {
    this.mapFaqVisible = false;
  }
  isOk: any;
  saveMappping() {
    this.isOk = true;
    for (let i = 0; i < this.faqs.length; i++) {
      if (
        this.faqs[i].SEQ_NO === undefined ||
        this.faqs[i].SEQ_NO === null ||
        this.faqs[i].SEQ_NO <= 0
      ) {
        this.isOk = false;
        this.message.error('Please Enter Sequence No.', '');
        break;
      }
    }
    if (this.isOk) {
      this.isSpinning = true;
      this.api
        .addMappingFaqs(this.ticketGroupId, this.faqs)
        .subscribe((successCode) => {
          if (successCode['status'] == '200') {
            this.message.success('Faq Map Successfully ', '');
            this.closeFaqMap();
            this.isSpinning = false;
          } else {
            this.message.error('Faq Map assigning Failed', '');
            this.isSpinning = false;
          }
        });
    }
  }
}