import { Injectable } from '@angular/core';
import {TableDataResponse} from "../model/order-data.model";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
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
  public getOrderHistory(): Observable<TableDataResponse[]> {
    return of(this.mockedData)
  }
}
