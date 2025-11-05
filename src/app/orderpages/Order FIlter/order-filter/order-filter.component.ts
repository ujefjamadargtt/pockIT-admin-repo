import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
export interface FilterCondition {
  field: string; // Field key
  comparator: string; // Comparison operator, e.g., '=', '>', '<'
  value: any; // Value to compare with
}

export interface ConditionGroup {
  operator: 'AND' | 'OR'; // Logical operator for the group
  conditions: { condition: FilterCondition; operator?: 'AND' | 'OR' }[]; // List of conditions in the group with logical operators
  groups?: ConditionGroup[]; // Nested condition groups
}

export interface FilterField {
  key: string; // Unique identifier for the field
  label: string; // Label displayed to the user
  type: 'text' | 'number' | 'date' | 'select' | 'time' | 'search'; // Field type
  comparators: { value: any; display: string }[]; // List of comparators applicable to the field
  options?: { value: any; display: string }[]; // Options for select type fields
  placeholder?: string; // Placeholder for input fields
}

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.css'],
})
export class OrderFilterComponent {
  @Input() fields: FilterField[] = [];
  @Input() filterGroups: ConditionGroup[] = [];
  @Input() filterGroups2: ConditionGroup[] = [];
  @Input() filterData: any = [];
  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    public datePipe: DatePipe
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
      this.filterGroups2.push({
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
  }
  @Output() filterApplied = new EventEmitter<any>();

  updateFilter(updateButton: any, ID: any) {
    var query = this.convertToQuery(this.filterGroups, 'f');
    this.filterData.SHOW_QUERY = this.convertToQuery(this.filterGroups2, 's');

    this.saveFilter(query, false);
    this.updateButton = updateButton;
  }

  previewQuery() {
    this.filterData.SHOW_QUERY = this.convertToQuery(this.filterGroups2, 's');
  }

  handleOk() {
    if (this.name == null || this.name == undefined || this.name.trim() == '') {
      this.message.error('Enter name for filter.', '');
    } else {
      // this.isVisible = false;
      this.name = this.name.trim();

      // Start loading
      //this.loading = true;
      // Generate the query string from filter groups
      var query = this.convertToQuery(this.filterGroups, 'f');
      this.filterData.SHOW_QUERY = this.convertToQuery(this.filterGroups2, 's');

      // Pass the query to saveFilter
      this.saveFilter(query, false);
    }
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
      this.filterGroups2.push({
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
      this.previewQuery();
    }
  }

  removeGroup(groupIndex: number) {
    this.filterGroups.splice(groupIndex, 1);
    this.filterGroups2.splice(groupIndex, 1);
    this.previewQuery();
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
      this.filterGroups2[groupIndex].conditions.push({
        condition: {
          field: '',
          comparator: '',
          value: '',
        },
        operator: 'AND',
      });
      this.previewQuery();
    }
  }

  removeCondition(groupIndex: number, conditionIndex: number) {
    this.filterGroups[groupIndex].conditions.splice(conditionIndex, 1);
    this.filterGroups2[groupIndex].conditions.splice(conditionIndex, 1);
    this.previewQuery();
  }

  removeNestedGroup(groupIndex: number, nestedGroupIndex: number) {
    this.filterGroups[groupIndex].groups!.splice(nestedGroupIndex, 1);
    this.filterGroups2[groupIndex].groups!.splice(nestedGroupIndex, 1);
    this.previewQuery();
  }

  getComparators(fieldKey: string): { value: any; display: string }[] {
    const field = this.fields?.find((f) => f?.key === fieldKey);
    return field?.comparators || [];
  }

  getPlaceholder(fieldKey: string): string {
    const field = this.fields?.find((f) => f?.key === fieldKey);
    return field?.placeholder || '';
  }

  getOptions(fieldKey: string): { value: any; display: string }[] {
    const field = this.fields?.find((f) => f?.key === fieldKey);
    return field?.options || [];
  }

  isInputField(fieldKey: string): boolean {
    const field = this.fields?.find((f) => f?.key === fieldKey);
    return field?.type === 'text' || field?.type === 'number';
  }

  isDateField(fieldKey: string): boolean {
    const field = this.fields?.find((f) => f?.key === fieldKey);
    return field?.type === 'date';
  }

  isTimeField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f?.key === fieldKey);
    return field?.type === 'time';
  }

  isSelectField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f?.key === fieldKey);
    return field?.type === 'select';
  }

  isSearchField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f?.key === fieldKey);
    return field?.type === 'search';
  }

  onFieldChange(condition: FilterCondition, event, i, j) {
    this.filterGroups[i].conditions[j].condition.field = event;
    this.filterGroups[i].conditions[j].condition.comparator = '';
    this.filterGroups[i].conditions[j].condition.value = '';
    // this.filterGroups[i].conditions[j].condition['filteredOptions'] = []
    this.filteredOptions = [];

    var d3 = this.fields;
    var d = d3.filter((item) => item.key == event);
    this.filterGroups2[i].conditions[j].condition.field = d['0']['label'];
    this.filterGroups2[i].conditions[j].condition.comparator = '';
    this.filterGroups2[i].conditions[j].condition.value = '';
    // this.filterGroups[i].conditions[j].condition['filteredOptions'] = [];
    this.filteredOptions = [];
    this.previewQuery();
  }

  setValue(operator, i, j, event) {
    var names = operator.split('.');
    if (names.length == 1) {
      this.filterGroups[i].conditions[j]['' + names[0]] = event;
      this.filterGroups2[i].conditions[j]['' + names[0]] = event;
    } else {
      this.filterGroups[i].conditions[j]['' + names[0]]['' + names[1]] = event;
      if (names[1] == 'comparator')
        this.filterGroups2[i].conditions[j]['' + names[0]]['' + names[1]] =
          event;
      else {
        this.filterGroups2[i].conditions[j]['' + names[0]]['' + names[1]] =
          event;
      }
    }
    this.previewQuery();
  }

  setValue2(operator, i, j, event) {
    this.filterGroups[i].conditions[j].condition.value = event;

    var d = this.getOptions(
      this.filterGroups[i].conditions[j].condition.field
    ).filter((item) => item.value == event);
    this.filterGroups2[i].conditions[j].condition.value = d[0]['display'];

    this.previewQuery();
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
    this.filterGroups2 = [];
    this.filterGroups2.push({
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
    this.previewQuery();
  }

  convertToQuery(filterGroups: ConditionGroup[], type): string {
    const processGroup = (group: ConditionGroup): string => {
      const conditions = group.conditions.map((conditionObj) => {
        const { field, comparator, value } = conditionObj.condition;
        let processedValue = typeof value === 'string' ? `'${value}'` : value; // Add quotes for strings
        if (field === 'ORDER_DATE_TIME' || field === 'Order Date Time') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
          processedValue = formattedDate ? `'${formattedDate}'` : '';

          return `(DATE(${field}) ${comparator} ${processedValue})`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }

        if (field === 'EXPECTED_DATE_TIME' || field === 'Service Date Time') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
          processedValue = formattedDate ? `'${formattedDate}'` : null;
          return `DATE(${field}) ${comparator} ${processedValue}`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }

        if (type == 'f') {
          switch (comparator) {
            case 'Contains':
              return `(${field} LIKE '%${value}%')`;
            case 'Does Not Contains':
              return `(${field} NOT LIKE '%${value}%')`;
            case 'Starts With':
              return `(${field} LIKE '${value}%')`;
            case 'Ends With':
              return `(${field} LIKE '%${value}')`;
            default:
              return `(${field} ${comparator} ${processedValue})`;
          }
        } else {
          return `(${field} ${comparator} ${processedValue})`;
        }
      });

      // const nestedGroups = (group.groups || []).map(processGroup);
      // Join conditions with their respective operators, but no operator before the first condition
      const allClauses = conditions.map((condition, index) => {
        const operator = group.conditions[index]?.operator;
        // Only prepend the operator if it's not the first condition (index > 0)
        if (operator && index > 0) {
          return `${operator} ${condition}`;
        } else {
          return condition; // No operator for the first condition
        }
      });

      return allClauses.length > 0
        ? `(${allClauses.join(' ')})` // Join without additional operator between clauses
        : '';
    };

    // Manually join top-level groups with their respective operator
    let queryParts: string[] = [];

    filterGroups.forEach((group, index) => {
      const groupQuery = processGroup(group); // Process each group
      if (index > 0) {
        // Add the operator (AND/OR) for subsequent groups
        queryParts.push(` ${group.operator} `);
      }
      queryParts.push(groupQuery); // Add the processed query for the group
    });

    // Return the combined query
    return queryParts.join('');
    // return filterGroups.map(processGroup).join(' AND '); // Top-level groups are combined with 'AND'
  }

  name = '';
  isVisible: boolean = false;
  buttonType;
  updateButton;

  openNameModal(buttonType: any, updateButton: any) {
    var groupIndex = this.filterGroups.length - 1;
    var j =
      this.filterGroups[this.filterGroups.length - 1].conditions.length - 1;

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
      this.filterGroups[groupIndex].conditions[j].condition.comparator ==
      null ||
      this.filterGroups[groupIndex].conditions[j].condition.comparator == ''
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
      this.buttonType = buttonType;
      this.updateButton = updateButton;
      this.name = '';
    }
  }

  openNameModalForApply(buttonType: any, updateButton: any) {
    var groupIndex = this.filterGroups.length - 1;
    var j =
      this.filterGroups[this.filterGroups.length - 1].conditions.length - 1;

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
      this.filterGroups[groupIndex].conditions[j].condition.comparator ==
      null ||
      this.filterGroups[groupIndex].conditions[j].condition.comparator == ''
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
      this.buttonType = buttonType;
      this.updateButton = updateButton;
      this.name = '';
    }
  }

  @Input() drawerClose;
  @Input() drawerVisible: boolean = false;

  handleCancel() {
    this.isVisible = false;
  }

  loading: boolean = false;

  userId = sessionStorage.getItem('userId');
  @Input() TabId: number;
  //currentTabId = this.TabId; // Holds the current tab ID
  currentUserId: number; // Holds the current user ID
  currentClientId = 1; // Holds the current client ID
  filterQuery;
  saveFilter(query: string, addNew: boolean) {
    if (this.filterData['ID'] != null && this.filterData['ID'] != undefined) {
      this.loading = true;
      this.filterData['FILTER_QUERY'] = query;
      this.filterData['FILTER_JSON'] = JSON.stringify([
        this.filterGroups,
        this.filterGroups2,
      ]);
      this.filterData.SHOW_QUERY = this.filterData.SHOW_QUERY;
      this.api.updateFilterData(this.filterData).subscribe(
        (response) => {
          // Stop loading
          if (response.code === 200) {
            this.message.success('Filter updated successfully.', '');
            this.loading = false;


            this.drawerClose(this.buttonType, this.updateButton); // Close drawer
            this.isVisible = false; // Close modal
          } else {
            this.message.error('Failed to update the filter.', '');
            this.loading = false;
          }
        },
        (error) => {
          this.loading = false; // Stop loading
          this.message.error('An error occurred while saving the filter.', '');
        }
      );
    } else {
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
        SHOW_QUERY: this.filterData.SHOW_QUERY,
        FILTER_JSON: JSON.stringify([this.filterGroups, this.filterGroups2]),
      };
      this.loading = true;
      this.api.createFilterData(filterData).subscribe(
        (response) => {
          // Stop loading
          if (response.code === 200) {
            this.message.success('Filter saved successfully.', '');
            this.loading = false;



            this.drawerClose(this.buttonType); // Close drawer
            this.isVisible = false; // Close modal
          } else {
            this.message.error('Failed to save the filter.', '');
            this.loading = false;
          }
        },
        (error) => {
          this.loading = false; // Stop loading
          this.message.error('An error occurred while saving the filter.', '');
        }
      );
    }
  }

  // Sanjana
  inputValue?: string;
  options1: any = [];
  // filteredOptions: string[] = [];

  // onInput(event: Event,i,j): void {
  //   const value = (event.target as HTMLInputElement).value;
  //   
  //   
  //     this.filterGroups[i].conditions[j].condition.field
  //   ));

  //   var d = this.getOptions(
  //     this.filterGroups[i].conditions[j].condition.field
  //   )
  //   if (value && d) {
  //     this.filteredOptions = d
  //       .map((item: any) => item.display)
  //       .filter((option: string) => option.toLowerCase().includes(value.toLowerCase()));

  //       this.filterGroups[i].conditions[j].condition['options1'] = this.filteredOptions;
  //   } else {
  //     this.filterGroups[i].conditions[j].condition['options1'] = []; // Set to empty array if no match
  //   }

  //   
  // }

  filteredOptions: string[] = []; // Global array to store filtered options

  onInput(event: Event, i: number, j: number): void {
    const value = (event.target as HTMLInputElement).value;




    const options = this.getOptions(
      this.filterGroups[i].conditions[j].condition.field
    );


    if (value && options) {
      this.filteredOptions = options
        .map((item: any) => item.display)
        .filter((option: string) =>
          option.toLowerCase().includes(value.toLowerCase())
        );
    } else {
      this.filteredOptions = [];
    }


  }

  onSelect(event: any, i: number, j: number): void {
    this.filterGroups[i].conditions[j].condition.value = event; // Use event directly
  }
}
