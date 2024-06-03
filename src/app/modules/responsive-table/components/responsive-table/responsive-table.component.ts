import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {merge, Subject, takeUntil} from "rxjs";
import {TableDataResponse} from "../../model/order-data.model";
import {OrderHistoryService} from "../../services/order-history.service";

@Component({
  selector: 'app-responsive-table',
  templateUrl: './responsive-table.component.html',
  styleUrls: ['./responsive-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveTableComponent implements  OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public  mockedData!: TableDataResponse[];
  public dataSource!: TableDataResponse[];
  public columnsMappings = [
    {id: 'status', headerTitle:  'Status'},
    {id: 'orderNumber', headerTitle:  'Order Number'},
    {id: 'productLine', headerTitle:  'Product Line'},
    {id: 'product', headerTitle:  'Product'},
    {id: 'quantity', headerTitle:  'Quantity'},
    {id: 'dataRequested', headerTitle:  'Data Requested'},
  ];
  public columns = this.columnsMappings.map(column => column.id);
  public formGroup = this.formBuilder.group({
    inProgress: new FormControl(true),
    pending: new FormControl(true),
    completed: new FormControl(true),
    productLines:  new FormControl(),
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    orderNumberSearch: new FormControl(''),
  });
  public productLines!: string[];
  public productLinesSet: Set<string> = new Set();
  public selectedProductLines!: string[];
  constructor(private formBuilder: FormBuilder, private orderHistoryService: OrderHistoryService) {}

  public ngOnInit(): void {
    this.orderHistoryService.getOrderHistory().pipe(takeUntil(this.destroy$)).subscribe(
      (response)=>{
        this.mockedData = response;
        this.dataSource = response;
        this.createProductLinesFromMockData();
        const observables = [
          this.formGroup.get('orderNumberSearch')?.valueChanges,
          this.formGroup.get('productLines')?.valueChanges,
          this.formGroup.get('inProgress')?.valueChanges,
          this.formGroup.get('pending')?.valueChanges,
          this.formGroup.get('completed')?.valueChanges,
          this.formGroup.get('dateFrom')?.valueChanges,
          this.formGroup.get('dateTo')?.valueChanges,
        ].filter(Boolean);
        merge(...observables).pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.applyFilters();
        })
      }
    )

  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getGridTemplateColumns(): string {
    return `repeat(${this.columnsMappings.length}, 1fr)`;
  }

  private applyFilters(): void {
    const searchString = this.formGroup.get('orderNumberSearch')?.value || '';
    const selectedLines = this.formGroup.get('productLines')?.value || [''];
    const inProgress = this.formGroup.get('inProgress')?.value ?? true;
    const pending = this.formGroup.get('pending')?.value ?? true;
    const completed = this.formGroup.get('completed')?.value ?? true;
    const dateFrom = this.formGroup.get('dateFrom')?.value || null;
    const dateTo = this.formGroup.get('dateTo')?.value || null;

    this.dataSource = this.mockedData.filter(item => {
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
