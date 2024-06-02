import { ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl} from "@angular/forms";

export interface TableDataResponse {
  status: 'In Progress' | 'Pending' | 'Completed';
  orderNumber: number;
  productLine: string;
  product: string;
  quantity: string;
  dataRequested: number;
}

@Component({
  selector: 'app-responsive-table',
  templateUrl: './responsive-table.component.html',
  styleUrls: ['./responsive-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveTableComponent implements  OnInit {
  public  mockedData: TableDataResponse[] = [
    {
      status: 'In Progress',
      orderNumber: 2324,
      productLine: 'Line1',
      product: 'Product Name',
      quantity: '12 m3',
      dataRequested: 1717325038000,
    },
    {
      status: 'Completed',
      orderNumber: 132,
      productLine: 'Line2',
      product: 'Product Name 4',
      quantity: '17 m3',
      dataRequested: 1714646638000,
    },
    {
      status: 'In Progress',
      orderNumber:56,
      productLine: 'Line3',
      product: 'Product Name 67',
      quantity: '189 m3',
      dataRequested: 1712054638000
    },
    {
      status: 'Pending',
      orderNumber: 32,
      productLine: 'Line4',
      product: 'Product Name 4',
      quantity: '12 m3',
      dataRequested: 1709376238000
    },
    {
      status: 'In Progress',
      orderNumber: 7,
      productLine: 'Line4',
      product: 'Product Name 5',
      quantity: '17 TH',
      dataRequested: 1706870638000
    }
  ];

  public columnsMappings = [
    {id: 'status', headerTitle:  'Status'},
    {id: 'orderNumber', headerTitle:  'Order Number'},
    {id: 'productLine', headerTitle:  'Product Line'},
    {id: 'product', headerTitle:  'Product'},
    {id: 'quantity', headerTitle:  'Quantity'},
    {id: 'dataRequested', headerTitle:  'Data Requested'},
  ]

  public columns = this.columnsMappings.map(column => column.id);
  public dataSource = new MatTableDataSource(this.mockedData);

  public formGroup = this.formBuilder.group({
    inProgress: true,
    pending: true,
    completed: true,
    productLines:  new FormControl(),
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    orderNumberSearch: ''
  });
  public productLines!: string[];
  public productLinesSet: Set<string> = new Set();
  public selectedProductLines!: string[];
  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.createProductLinesFromMockData();
    this.formGroup.get('orderNumberSearch')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    this.formGroup.get('productLines')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    this.formGroup.get('inProgress')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    this.formGroup.get('pending')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    this.formGroup.get('completed')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    this.formGroup.get('dateFrom')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    this.formGroup.get('dateTo')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private applyFilters(): void {
    const searchString = this.formGroup.get('orderNumberSearch')?.value || '';
    const selectedLines = this.formGroup.get('productLines')?.value || [''];
    const inProgress = this.formGroup.get('inProgress')?.value ?? true;
    const pending = this.formGroup.get('pending')?.value ?? true;
    const completed = this.formGroup.get('completed')?.value ?? true;
    const dateFrom = this.formGroup.get('dateFrom')?.value || null;
    const dateTo = this.formGroup.get('dateTo')?.value || null;

    this.dataSource.data = this.mockedData.filter(item => {
      const matchesStatus =  (item.status === 'In Progress' && inProgress) || (item.status === 'Pending' && pending) || (item.status === 'Completed' && completed);
      const matchesOrderNumber = searchString ? item.orderNumber.toString().includes(searchString) : true;
      const matchesProductLine = selectedLines.length > 0 ? selectedLines.includes(item.productLine) : true;
      let matchesDateRange = true;
      if (dateFrom || dateTo) {
        if (dateFrom) {
          matchesDateRange = new Date(item.dataRequested).getTime() >= new Date(dateFrom).getTime();
        }
        if (dateTo) {
          matchesDateRange = matchesDateRange && new Date(item.dataRequested).getTime() <= new Date(dateTo).getTime();
        }
      }
      return matchesOrderNumber && matchesProductLine && matchesStatus && matchesDateRange;
    });
  }

  private createProductLinesFromMockData(): void {
    this.mockedData.forEach((item)=> {
      this.productLinesSet.add(item.productLine);
    });
    this.productLines = [...this.productLinesSet];
    if (this.productLines.length > 1) {
      this.formGroup.patchValue({
        productLines: this.productLines
      });
    }
  }
}
