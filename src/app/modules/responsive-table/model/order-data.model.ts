export interface TableDataResponse {
  status: 'In Progress' | 'Pending' | 'Completed';
  orderNumber: number;
  productLine: string;
  product: string;
  quantity: string;
  dataRequested: number;
}
