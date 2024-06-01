import { ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder} from "@angular/forms";

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
      dataRequested: 1717685490
    },
    {
      status: 'Completed',
      orderNumber: 132,
      productLine: 'Line2',
      product: 'Product Name 4',
      quantity: '17 m3',
      dataRequested: 1747085490
    },
    {
      status: 'In Progress',
      orderNumber:56,
      productLine: 'Line3',
      product: 'Product Name 67',
      quantity: '189 m3',
      dataRequested: 17178085490
    },
    {
      status: 'Pending',
      orderNumber: 32,
      productLine: 'Line4',
      product: 'Product Name 4',
      quantity: '12 m3',
      dataRequested: 1717485490
    },
    {
      status: 'In Progress',
      orderNumber: 7,
      productLine: 'Line4',
      product: 'Product Name 5',
      quantity: '17 TH',
      dataRequested: 1717085450
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
    inProgress: false,
    pending: false,
    completed: false,
    productLines: [''],
    orderNumberSearch: ''
  });
  public productLines!: string[];
  public productLinesSet: Set<string> = new Set();
  public selectedProductLines!: string[];
  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.createProductLinesFromMockData();
    this.formGroup.get('orderNumberSearch')!.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    this.formGroup.get('productLines')!.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private applyFilters(): void {
    let searchString = this.formGroup.get('orderNumberSearch')?.value || '';
    let selectedLines = this.formGroup.get('productLines')?.value || [''];

    this.dataSource.data = this.mockedData.filter(item => {
      let matchesOrderNumber = searchString ? item.orderNumber.toString().includes(searchString) : true;
      let matchesProductLine = selectedLines.length > 0 ? selectedLines.includes(item.productLine) : true;
      return matchesOrderNumber && matchesProductLine;
    });
  }
  private createProductLinesFromMockData(): void {
    this.mockedData.forEach((item)=>{
      this.productLinesSet.add(item.productLine)
    });
    this.productLines = [...this.productLinesSet];
  }
}
