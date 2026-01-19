import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
export interface FilterCondition {
  field: string; 
  comparator: string; 
  value: any; 
}
export interface ConditionGroup {
  operator: 'AND' | 'OR'; 
  conditions: { condition: FilterCondition; operator?: 'AND' | 'OR' }[]; 
  groups?: ConditionGroup[]; 
}
export interface FilterField {
  key: string; 
  label: string; 
  type: 'text' | 'number' | 'date' | 'select'; 
  comparators: string[]; 
  options?: { value: any; display: string }[]; 
  placeholder?: string; 
}
@Component({
  selector: 'app-vendor-mainfilter',
  templateUrl: './vendor-mainfilter.component.html',
  styleUrls: ['./vendor-mainfilter.component.css']
})
export class VendorMainfilterComponent {
  @Input() fields: FilterField[] = [];
  @Input() filterGroups: ConditionGroup[] = [];
  @Input() TabId: number | null;
  @Input() drawerClose;
  @Input() drawerVisible: boolean = false;
  @Output() filterApplied = new EventEmitter<any>();
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  name = '';
  currentClientId = 1;
  loading: boolean = false;
  isVisible: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) {
    if (this.filterGroups.length === 0) {
      this.filterGroups.push({
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      });
    }
  }
  ngOnInit() {
    this.filterGroups = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
  }
  addGroup() {
    var groupIndex = this.filterGroups.length - 1;
    var j = this.filterGroups[groupIndex].conditions.length - 1;
    if (!this.filterGroups[groupIndex].conditions[j]['operator']) {
      this.message.error('Please fill all fields first', '');
    } else if (!this.filterGroups[groupIndex].conditions[j].condition.field) {
      this.message.error('Please fill all fields first', '');
    } else if (
      !this.filterGroups[groupIndex].conditions[j].condition.comparator
    ) {
      this.message.error('Please fill all fields first', '');
    } else if (
      this.filterGroups[groupIndex].conditions[j].condition.value ==
      undefined ||
      this.filterGroups[groupIndex].conditions[j].condition.value == null ||
      this.filterGroups[groupIndex].conditions[j].condition.value == ''
    ) {
      this.message.error('Please fill all fields first', '');
    } else {
      this.filterGroups.push({
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      });
    }
  }
  removeGroup(groupIndex: number) {
    this.filterGroups.splice(groupIndex, 1);
  }
  addCondition(groupIndex: number, j) {
    if (!this.filterGroups[groupIndex].conditions[j]['operator']) {
      this.message.error('Please select a operator', '');
    } else if (!this.filterGroups[groupIndex].conditions[j].condition.field) {
      this.message.error('Please select a field', '');
    } else if (
      !this.filterGroups[groupIndex].conditions[j].condition.comparator
    ) {
      this.message.error('Please select comparator', '');
    } else if (
      this.filterGroups[groupIndex].conditions[j].condition.value ==
      undefined ||
      this.filterGroups[groupIndex].conditions[j].condition.value == null ||
      this.filterGroups[groupIndex].conditions[j].condition.value == ''
    ) {
      this.message.error('Please enter value', '');
    } else {
      this.filterGroups[groupIndex].conditions.push({
        condition: {
          field: '',
          comparator: '',
          value: '',
        },
        operator: 'AND',
      });
    }
  }
  removeCondition(groupIndex: number, conditionIndex: number) {
    this.filterGroups[groupIndex].conditions.splice(conditionIndex, 1);
  }
  removeNestedGroup(groupIndex: number, nestedGroupIndex: number) {
    this.filterGroups[groupIndex].groups!.splice(nestedGroupIndex, 1);
  }
  getComparators(fieldKey: string): string[] {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.comparators || [];
  }
  getPlaceholder(fieldKey: string): string {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.placeholder || '';
  }
  getOptions(fieldKey: string): { value: any; display: string }[] {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.options || [];
  }
  isInputField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'text' || field?.type === 'number';
  }
  isDateField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'date';
  }
  isSelectField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'select';
  }
  onFieldChange(condition: FilterCondition) {
    condition.comparator = '';
    condition.value = '';
  }
  resetFilters() {
    this.filterGroups = [];
    this.filterGroups.push({
      operator: 'AND',
      conditions: [
        {
          condition: {
            field: '',
            comparator: '',
            value: '',
          },
          operator: 'AND',
        },
      ],
      groups: [],
    });
  }
  convertToQuery(filterGroups: ConditionGroup[]): string {
    const processGroup = (group: ConditionGroup): string => {
      const conditions = group.conditions.map((conditionObj) => {
        const { field, comparator, value } = conditionObj.condition;
        let processedValue = typeof value === 'string' ? `'${value}'` : value; 
        switch (comparator) {
          case 'Contains':
            return `${field} LIKE '%${value}%'`;
          case 'Does Not Contains':
            return `${field} NOT LIKE '%${value}%'`;
          case 'Starts With':
            return `${field} LIKE '${value}%'`;
          case 'Ends With':
            return `${field} LIKE '%${value}'`;
          default:
            return `${field} ${comparator} ${processedValue}`;
        }
      });
      const nestedGroups = (group.groups || []).map(processGroup);
      const allClauses = [...conditions, ...nestedGroups]
      return `(${allClauses.join(` ${group.operator} `)})`;
    };
    return filterGroups.map(processGroup).join(' AND ');
  }
  openNameModal() {
    var groupIndex = this.filterGroups.length - 1;
    var j = this.filterGroups[this.filterGroups.length - 1].conditions.length - 1;
    if (
      this.filterGroups[groupIndex].conditions[j]['operator'] == undefined ||
      this.filterGroups[groupIndex].conditions[j]['operator'] == null
    ) {
      this.message.error('Please fill all fields first', '');
    } else if (
      this.filterGroups[groupIndex].conditions[j].condition.field ==
      undefined ||
      this.filterGroups[groupIndex].conditions[j].condition.field == null
    ) {
      this.message.error('Please fill all fields first', '');
    } else if (
      this.filterGroups[groupIndex].conditions[j].condition.comparator ==
      undefined ||
      this.filterGroups[groupIndex].conditions[j].condition.comparator == null
    ) {
      this.message.error('Please fill all fields first', '');
    } else if (
      this.filterGroups[groupIndex].conditions[j].condition.value ==
      undefined ||
      this.filterGroups[groupIndex].conditions[j].condition.value == null ||
      this.filterGroups[groupIndex].conditions[j].condition.value == ''
    ) {
      this.message.error('Please fill all fields first', '');
    } else {
      this.isVisible = true;
      this.name = '';
    }
  }
  handleCancel() {
    this.isVisible = false;
  }
  handleOk() {
    if (this.name == null || this.name == undefined || this.name.trim() == '') {
      this.message.error('Enter name for filter.', '');
    } else {
      this.name = this.name.trim();
      var query = this.convertToQuery(this.filterGroups);
      this.saveFilter(query, false);
    }
  }
  saveFilter(query: string, addNew: boolean) {
    if (!this.name || this.name.trim() === '') {
      this.message.error('Please enter a valid filter name.', '');
      return;
    }
    const filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: this.name.trim(),
      FILTER_QUERY: query,
      FILTER_JSON: JSON.stringify(this.filterGroups),
    };
    this.loading = true;
    this.api.createFilterData(filterData).subscribe(
      (response) => {
        if (response.code === 200) {
          this.message.success('Filter saved successfully.', '');
          this.loading = false;
          this.filterApplied.emit();
          this.drawerClose(); 
          this.isVisible = false; 
        } else {
          this.message.error('Failed to save the filter.', '');
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        this.message.error('An error occurred while saving the filter.', '');
      }
    );
  }
}
