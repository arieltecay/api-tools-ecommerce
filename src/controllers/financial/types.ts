// DTOs para Operating Expense
export interface ICreateOperatingExpenseDto {
  description: string;
  amount: number;
  date: Date;
  category: string;
}

export interface IUpdateOperatingExpenseDto {
  description?: string;
  amount?: number;
  date?: Date;
  category?: string;
}

// DTOs para Capital Contribution
export interface ICreateCapitalContributionDto {
  description: string;
  amount: number;
  date: Date;
}

export interface IUpdateCapitalContributionDto {
  description?: string;
  amount?: number;
  date?: Date;
}

// DTOs para Financial Reports
export interface IFinancialReportQueryDto {
  startDate?: string;
  endDate?: string;
}
