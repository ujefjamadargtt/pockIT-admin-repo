import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-view-drawer',
  templateUrl: './view-drawer.component.html',
  styleUrls: ['./view-drawer.component.css']
})
export class ViewDrawerComponent {
  @Input() data;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  COMMENT;
  ButtonSpinning: boolean = false;
  userId = 1;
  isLoading: boolean = false;
  dataList: any = [
    {
      COMMENTER_ID: 1,
      COMMENTER_NAME: 'John Doe',
      COMMENT: 'This is my own comment.',
      COMMENT_DATETIME: new Date('2024-12-03T10:00:00'),
      TYPE: 'C'
    },
    {
      COMMENTER_ID: 2,
      COMMENTER_NAME: 'Jane Smith',
      COMMENT: 'This is a comment from another user.',
      COMMENT_DATETIME: new Date('2024-12-03T10:05:00'),
      TYPE: 'C'
    },
    {
      COMMENTER_ID: 1,
      COMMENTER_NAME: 'John Doe',
      COMMENT: 'Another one of my comments.',
      COMMENT_DATETIME: new Date('2024-12-03T10:15:00'),
      TYPE: 'C'
    },
    {
      COMMENTER_ID: 3,
      COMMENTER_NAME: 'Alex Brown',
      COMMENT: 'Ticket status updated to Ongoing by Admin on 2024-11-14 13:10:35 on 14/11/2024 13:10 PM',
      COMMENT_DATETIME: new Date('2024-12-03T10:30:00'),
      TYPE: 'A' 
    },
    {
      COMMENTER_ID: 2,
      COMMENTER_NAME: 'Jane Smith',
      COMMENT: 'Another insightful comment.',
      COMMENT_DATETIME: new Date('2024-12-03T11:00:00'),
      TYPE: 'C'
    }
  ];
  AddComment(): void {
    if (this.COMMENT.trim()) {
      this.ButtonSpinning = true;
      setTimeout(() => {
        this.dataList.push({
          COMMENTER_ID: this.userId,
          COMMENTER_NAME: 'Me',
          COMMENT: this.COMMENT.trim(),
          COMMENT_DATETIME: new Date(),
          TYPE: 'C'
        });
        this.COMMENT = ''; 
        this.ButtonSpinning = false;
      }, 1000);
    }
  }
  onPick() {
  }
  onTransfer() {
  }
  onClose() {
  }
  onHold() {
  }
}
