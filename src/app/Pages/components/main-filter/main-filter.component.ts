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
  selector: 'app-main-filter',
  templateUrl: './main-filter.component.html',
  styleUrls: ['./main-filter.component.css'],
  providers: [DatePipe],
})
export class MainFilterComponent {
  @Input() fields: FilterField[] = [];
  @Input() filterGroups: ConditionGroup[] = [];
  @Input() filterGroups2: ConditionGroup[] = [];
  @Input() filterData: any = [];
  @Input() editButton: any;
  @Input() name: any;
  @Input() data: any;

  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    public datePipe: DatePipe
  ) {
    this.filterGroups = [];

    // if (this.filterGroups.length === 0) {
    //   this.filterGroups.push({
    //     operator: "AND",
    //     conditions: [
    //       {
    //         condition: {
    //           field: "",
    //           comparator: "",
    //           value: "",
    //         },
    //         operator: "AND",
    //       },
    //     ],
    //     groups: [],
    //   });
    // }

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

  ngOnInit() { }
  @Output() filterApplied = new EventEmitter<any>();

  previewQuery() {
    this.filterData.SHOW_QUERY = this.convertToQuery2(this.filterGroups2, 's');
  }

  // handleOk() {
  //   if (this.name == null || this.name == undefined || this.name.trim() == '') {
  //     this.message.error('Enter name for filter.', '');
  //   } else {
  //     // this.isVisible = false;
  //     this.name = this.name.trim();

  //     // Start loading
  //     //this.loading = true;
  //     // Generate the query string from filter groups
  //     var obj = [...[], ...this.filterGroups];
  //     var query = this.convertToQuery(obj);

  //     // Pass the query to saveFilter

  //     this.saveFilter(query, false);
  //   }
  // }

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
      this.filterData.SHOW_QUERY = this.convertToQuery2(
        this.filterGroups2,
        's'
      );
      // Pass the query to saveFilter
      this.saveFilter(query, false);
    }
  }

  // updateFilter(query: any, addNew: boolean) {
  //   var obj = [...[], ...this.filterGroups];
  //   var query = this.convertToQuery(obj);

  //   // Pass the query to saveFilter
  //   //
  //   this.saveFilter(query, false);
  // }

  updateFilter(updateButton: any, ID: any) {
    var query = this.convertToQuery(this.filterGroups, 'f');
    this.filterData.SHOW_QUERY = this.convertToQuery2(this.filterGroups2, 's');

    this.saveFilter(query, false);

    this.updateButton = updateButton;

    // sessionStorage.setItem('ID', this.filterData['ID']);
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
  }

  removeNestedGroup(groupIndex: number, nestedGroupIndex: number) {
    this.filterGroups[groupIndex].groups!.splice(nestedGroupIndex, 1);
    this.filterGroups2[groupIndex].groups!.splice(nestedGroupIndex, 1);
  }

  getComparators(fieldKey: string): { value: any; display: string }[] {
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

  isTimeField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'time';
  }

  isSelectField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'select';
  }

  isSearchField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'search';
  }

  onFieldChange(condition: FilterCondition, event, i, j) {
    // Reset comparator and value when the field changes
    // condition.comparator = '';
    // condition.value = '';
    this.filterGroups[i].conditions[j].condition.field = event;
    this.filterGroups[i].conditions[j].condition.comparator = '';
    this.filterGroups[i].conditions[j].condition.value = '';
    this.filteredOptions = [];
    var d3 = this.fields;
    var d = d3.filter((item) => item.key == event);
    this.filterGroups2[i].conditions[j].condition.field = d['0']['label'];
    this.filterGroups2[i].conditions[j].condition.comparator = '';
    this.filterGroups2[i].conditions[j].condition.value = '';
    this.filteredOptions = [];
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

  formatDate(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toISOString().split('T')[0]; // Extract only the date part (YYYY-MM-DD)
  }

  convertToQuery(filterGroups: ConditionGroup[], type): string {
    if (
      this.TabId === '6784f557b5d32a2987e5d416' ||
      this.TabId === '678c8276d5fa6d645850e972' ||
      this.TabId === '67ce938026fe415bc5612796'
    ) {
      var d = this.convertToMongoFilter(filterGroups, type);

      return d;
    } else {
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
          if (field === 'APPLIED_DATE_TIME') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'TRANSACTION_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'DATE_TIME') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'INWARD_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'ADJUSTED_DATETIME') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'VERIFICATION_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'REQUESTED_DATE_TIME') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (
            field === 'DATE' ||
            field === 'DATE_OF_ENTRY' ||
            field === 'ORDER_DATE_TIME' ||
            field === 'TRANSACTION_DATE'
          ) {
            // Ensure the value is a valid Date object

            let dateValue = value instanceof Date ? value : new Date(value);
            if (!isNaN(dateValue.getTime())) {
              // Format the date to 'yyyy-MM-dd' using datePipe
              const formattedDate = this.datePipe.transform(
                dateValue,
                'yyyy-MM-dd'
              );
              processedValue = formattedDate ? `'${formattedDate}'` : null;
              return `DATE(${field}) ${comparator} ${processedValue}`;
            } else {
              // If the value is not a valid date, return null or handle error
              return '';
            }
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'TRANSACTION_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'LOG_DATE_TIME') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'REQUESTED_DATETIME') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'START_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'ISSUED_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'CREATED_MODIFIED_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'LAST_RESPONDED') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }

          if (field === 'DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'EXPIRY_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'FEEDBACK_DATE_TIME') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'ACTION_DATE_TIME') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }

          if (field === 'JOB_CREATED_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'ASSIGNED_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }

          if (field === 'ORDER_DATE_TIME') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }

          if (field === 'CANCEL_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }

          if (field === 'REGISTRATION_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'REQUESTED_DATE') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }
          if (field === 'SCHEDULED_DATE_TIME') {
            // Wrap the date field in DATE() and format the value
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            processedValue = formattedDate ? `'${formattedDate}'` : null;
            return `DATE(${field}) ${comparator} ${processedValue}`;
          } else {
            // Process other fields
            processedValue = typeof value === 'string' ? `'${value}'` : value;
          }

          if (field === 'START_TIME') {
            const formattedTime = this.datePipe.transform(value, 'HH:mm:00'); // Format time as 'HH:mm:00'
            if (formattedTime) {
              processedValue = `time_format('${formattedTime}', '%H:%i')`;
              return `${field} ${comparator} ${processedValue}`;
            }
            return null; // Return null if the value cannot be formatted
          }

          if (field === 'END_TIME') {
            const formattedTime = this.datePipe.transform(value, 'HH:mm:00'); // Format time as 'HH:mm:00'
            if (formattedTime) {
              processedValue = `time_format('${formattedTime}', '%H:%i')`;
              return `${field} ${comparator} ${processedValue}`;
            }
            return null; // Return null if the value cannot be formatted
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

  convertToQuery2(filterGroups: ConditionGroup[], type): string {
    const processGroup = (group: ConditionGroup): string => {
      const conditions = group.conditions.map((conditionObj) => {
        const { field, comparator, value } = conditionObj.condition;
        let processedValue = typeof value === 'string' ? `'${value}'` : value; // Add quotes for strings
        if (field === 'LOG_DATE_TIME' || field === 'Log Created Date') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
          processedValue = formattedDate ? `'${formattedDate}'` : '';

          return `(DATE(${field}) ${comparator} ${processedValue})`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }

        if (
          field === 'END_TIME' ||
          field === 'End Time' ||
          field === 'START_TIME' ||
          field === 'Start Time'
        ) {
          const formattedTime = this.datePipe.transform(value, 'HH:mm:00'); // Format time as 'HH:mm:00'
          if (formattedTime) {
            processedValue = formattedTime ? `'${formattedTime}'` : null;
            return `${field} ${comparator} ${processedValue}`;
          }
          return null; // Return null if the value cannot be formatted
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
  convertToMongoFilter(json2: any, type): any {
    var query: any[] = [];
    var query2: any[] = [];
    var currentOperator2: string = '$and'; // Default operator is AND if none provided
    var nextOperator2: string = '';
    var json = Object.assign([], json2);
    json.forEach((item, i) => {
      let groupStack: any[] = [];
      var queryStack: any[] = [];
      var currentOperator: string = '$and'; // Default operator is AND if none provided
      var condition3;

      // Default operator is AND if none provided
      item.conditions.forEach((condition: any, index: number) => {
        const { field, comparator, value } = condition.condition;
        const nextOperator = condition.operator === 'AND' ? '$and' : '$or';
        var condition2 = {};
        const processedValue = typeof value === 'string' ? value.trim() : value;
        if (type == 'f') {
          if (field === 'LOG_DATE_TIME' || field === 'DATE_OF_ENTRY') {
            // Format the input date to 'yyyy-MM-dd'
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            if (formattedDate) {
              // Create the condition for each comparator

              switch (comparator) {
                case '=':
                  condition2 = {
                    $expr: {
                      $eq: [
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: `$${field}`,
                          },
                        },
                        formattedDate,
                      ],
                    },
                  };
                  break;
                case '!=':
                  condition2 = {
                    $expr: {
                      $ne: [
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: `$${field}`,
                          },
                        },
                        formattedDate,
                      ],
                    },
                  };
                  break;
                case '>':
                  condition2 = {
                    $expr: {
                      $gt: [
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: `$${field}`,
                          },
                        },
                        formattedDate,
                      ],
                    },
                  };
                  break;
                case '>=':
                  condition2 = {
                    $expr: {
                      $gte: [
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: `$${field}`,
                          },
                        },
                        formattedDate,
                      ],
                    },
                  };
                  break;
                case '<':
                  condition2 = {
                    $expr: {
                      $lt: [
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: `$${field}`,
                          },
                        },
                        formattedDate,
                      ],
                    },
                  };
                  break;
                case '<=':
                  condition2 = {
                    $expr: {
                      $lte: [
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: `$${field}`,
                          },
                        },
                        formattedDate,
                      ],
                    },
                  };
                  break;
                default:
                  throw new Error(
                    `Unsupported comparator for LOG_DATE_TIME: ${comparator}`
                  );
              }
            } else {
              throw new Error('Invalid date format');
            }
          } else if (field === 'START_TIME' || field === 'END_TIME') {
            const inputTime = new Date(value); // Parse the input time
            const hours = String(inputTime.getHours()).padStart(2, '0');
            const minutes = String(inputTime.getMinutes()).padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`; // Format as HH:mm:00

            switch (comparator) {
              case '=':
                condition2 = { [field]: formattedTime };
                break;
              case '!=':
                condition2 = { [field]: { $ne: formattedTime } };
                break;
              case '>':
                condition2 = { [field]: { $gt: formattedTime } };
                break;
              case '>=':
                condition2 = { [field]: { $gte: formattedTime } };
                break;
              case '<':
                condition2 = { [field]: { $lt: formattedTime } };
                break;
              case '<=':
                condition2 = { [field]: { $lte: formattedTime } };
                break;
              default:
                throw new Error(
                  `Unsupported comparator for ${field}: ${comparator}`
                );
            }
          } else {
            // Handle other fields and comparators
            switch (comparator) {
              case '=':
                condition2 = { [field]: value }; // Equality condition2
                break;
              case '!=':
                condition2 = { [field]: { $ne: value } }; // Not equal condition2
                break;
              case 'Contains':
                condition2 = { [field]: { $regex: value, $options: 'i' } }; // Contains
                break;
              case 'Does Not Contains':
                condition2 = {
                  [field]: { $not: { $regex: value, $options: 'i' } },
                }; // Does not contain
                break;
              case 'Starts With':
                condition2 = {
                  [field]: { $regex: `^${value}`, $options: 'i' },
                }; // Starts with
                break;
              case 'Ends With':
                condition2 = {
                  [field]: { $regex: `${value}$`, $options: 'i' },
                }; // Ends with
                break;
              case '>':
                condition2 = { [field]: { $gt: value } }; // Greater than
                break;
              case '>=':
                condition2 = { [field]: { $gte: value } }; // Greater than or equal
                break;
              case '<':
                condition2 = { [field]: { $lt: value } }; // Less than
                break;
              case '<=':
                condition2 = { [field]: { $lte: value } }; // Less than or equal
                break;
              default:
                throw new Error(`Unsupported comparator: ${comparator}`);
            }
          }
        } else {
          condition2 = '';
        }
        // If it's the first condition2, start the group
        if (item.conditions.length == 1) {
          queryStack.push(condition2);

          query.push(queryStack[0]);
        } else if (item.conditions.length == 2) {
          if (index == 1) {
            queryStack.push({
              // [nextOperator]: [item.conditions[0].condition, condition2],
              [nextOperator]: [condition3, condition2],
            });
            query.push(queryStack[0]);
          }
        } else {
          if (index <= 1) {
            groupStack.push(condition2);
            currentOperator = condition.operator === 'AND' ? '$and' : '$or';
          } else if (index == item.conditions.length - 1) {
            if (queryStack.length > 0 && queryStack[0] != undefined) {
              var oldgroup = queryStack[0];
              groupStack.push(oldgroup);
              queryStack = [];
            }

            queryStack.push({
              [nextOperator]: [condition2, { [currentOperator]: groupStack }],
            });
            query.push(queryStack[0]);
          } else if (index > 1 && nextOperator === currentOperator) {
            groupStack.push(condition2);
            // Add to the same group if the operator is the same
          } else {
            if (queryStack.length > 0 && queryStack[0] != undefined) {
              var oldgroup = queryStack[0];
              groupStack.push(oldgroup);
              queryStack = [];
            }
            // If operator changes (from AND to OR or vice versa), push the current group and start a new group
            queryStack.push({ [currentOperator]: groupStack });
            groupStack = []; // Reset group
            groupStack.push(condition2);
            currentOperator = nextOperator;
          }
        }
        condition3 = condition2;
      });
      nextOperator2 = item.operator === 'AND' ? '$and' : '$or';
      // Push the last group if conditions are left
      // if (groupStack.length > 0) {
      //   queryStack.push({ [currentOperator]: groupStack });
      // }
      if (json.length == 1) {
        query2 = [query[0]];
      } else if (json.length == 2) {
        if (i == 1) {
          query2.push({
            [nextOperator2]: [query[0], query[i]],
          });
        }
      } else {
        if (i < 2) {
          groupStack.push(query[i]);
          currentOperator = item.operator === 'AND' ? '$and' : '$or';
        } else if (i > 1 && nextOperator2 === currentOperator2) {
          groupStack.push(query[i]);
          // Add to the same group if the operator is the same
        } else if (i == json.length - 1) {
          if (queryStack.length > 0 && queryStack[0] != undefined) {
            var oldgroup = queryStack[0];
            groupStack.push(oldgroup);
            queryStack = [];
          }

          queryStack.push({
            [nextOperator2]: [query[i], { [currentOperator]: groupStack }],
          });
          query2.push(queryStack[0]);
        } else {
          if (queryStack.length > 0 && queryStack[0] != undefined) {
            var oldgroup = queryStack[0];
            groupStack.push(oldgroup);
            queryStack = [];
          }
          // If operator changes (from AND to OR or vice versa), push the current group and start a new group
          queryStack.push({ [currentOperator2]: groupStack });
          groupStack = []; // Reset group
          groupStack.push(query[i]);
          currentOperator = nextOperator2;
        }
      }
    });

    // Return the full query structure if multiple groups exist

    return JSON.stringify(query2[0]);
  }

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
  @Input() TabId: any;
  //currentTabId = this.TabId; // Holds the current tab ID
  currentUserId: number; // Holds the current user ID
  currentClientId = 1; // Holds the current client ID
  filterQuery;

  // saveFilter(query: string, addNew: boolean) {
  //   var groupIndex = this.filterGroups.length - 1;
  //   var j =
  //     this.filterGroups[this.filterGroups.length - 1].conditions.length - 1;

  //   if (
  //     this.filterGroups[groupIndex].conditions[j]['operator'] == undefined ||
  //     this.filterGroups[groupIndex].conditions[j]['operator'] == null
  //   ) {
  //     this.message.error('Please fill all fields first', '');
  //   } else if (
  //     this.filterGroups[groupIndex].conditions[j].condition.field ==
  //       undefined ||
  //     this.filterGroups[groupIndex].conditions[j].condition.field == null
  //   ) {
  //     this.message.error('Please fill all fields first', '');
  //   } else if (
  //     this.filterGroups[groupIndex].conditions[j].condition.comparator ==
  //       undefined ||
  //     this.filterGroups[groupIndex].conditions[j].condition.comparator ==
  //       null ||
  //     this.filterGroups[groupIndex].conditions[j].condition.comparator == ''
  //   ) {
  //     this.message.error('Please fill all fields first', '');
  //   } else if (
  //     this.filterGroups[groupIndex].conditions[j].condition.value ==
  //       undefined ||
  //     this.filterGroups[groupIndex].conditions[j].condition.value == null ||
  //     this.filterGroups[groupIndex].conditions[j].condition.value == ''
  //   ) {
  //     this.message.error('Please fill all fields first', '');
  //   } else if (!this.name || this.name.trim() === '') {
  //     this.message.error('Please enter a valid filter name.', '');
  //     return;
  //   } else {
  //     const filterData = {
  //       TAB_ID: this.TabId,
  //       USER_ID: this.commonFunction.decryptdata(this.userId || ''),
  //       CLIENT_ID: this.currentClientId,
  //       FILTER_NAME: this.name.trim(),
  //       ID: this.data.ID,
  //       FILTER_QUERY: query,
  //       SHOW_QUERY: this.filterData.SHOW_QUERY,
  //       FILTER_JSON: JSON.stringify(this.filterGroups),
  //     };
  //     this.loading = true;

  //     if (this.editButton == 'Y') {
  //       this.api.updateFilterData(filterData).subscribe(
  //         (response) => {
  //           // Stop loading
  //           if (response.code === 200) {
  //             this.message.success('Filter Updated successfully.', '');
  //             this.loading = false;
  //             this.drawerClose(this.buttonType); // Close drawer
  //             this.isVisible = false; // Close modal
  //           } else {
  //             this.message.error('Failed to Update the filter.', '');
  //             this.loading = false;
  //           }
  //         },
  //         (error) => {
  //           this.loading = false; // Stop loading
  //           this.message.error(
  //             'An error occurred while saving the filter.',
  //             ''
  //           );
  //         }
  //       );
  //     } else {
  //       this.api.createFilterData(filterData).subscribe(
  //         (response) => {
  //           // Stop loading
  //           if (response.code === 200) {
  //             this.message.success('Filter saved successfully.', '');
  //             this.loading = false;
  //             this.drawerClose(this.buttonType); // Close drawer
  //             this.isVisible = false; // Close modal
  //           } else {
  //             this.message.error('Failed to save the filter.', '');
  //             this.loading = false;
  //           }
  //         },
  //         (error) => {
  //           this.loading = false; // Stop loading
  //           this.message.error(
  //             'An error occurred while saving the filter.',
  //             ''
  //           );
  //         }
  //       );
  //     }
  //   }
  // }
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




            this.drawerClose(this.buttonType, this.updateButton); // Close drawer
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
  inputValue?: string;
  options1: any = [];

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