export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  bonus: number;
  tenure: number;
  performance: number; // 1-5
  gender: 'Male' | 'Female' | 'Non-binary';
  location: string;
}

export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Chen', role: 'Principal Software Engineer', department: 'Engineering', salary: 285000, bonus: 45000, tenure: 6, performance: 4.8, gender: 'Female', location: 'San Francisco' },
  { id: '2', name: 'James Wilson', role: 'VP Operations', department: 'Operations', salary: 310000, bonus: 85000, tenure: 8, performance: 4.5, gender: 'Male', location: 'New York' },
  { id: '3', name: 'Elena Rodriguez', role: 'Head of Data Science', department: 'Data', salary: 275000, bonus: 55000, tenure: 4, performance: 4.9, gender: 'Female', location: 'Austin' },
  { id: '4', name: 'David Kim', role: 'Senior Product Manager', department: 'Product', salary: 195000, bonus: 25000, tenure: 3, performance: 4.2, gender: 'Male', location: 'Seattle' },
  { id: '5', name: 'Amara Okafor', role: 'Design Director', department: 'Design', salary: 220000, bonus: 35000, tenure: 5, performance: 4.7, gender: 'Female', location: 'London' },
  { id: '6', name: 'Michael Brown', role: 'Cloud Architect', department: 'Engineering', salary: 185000, bonus: 20000, tenure: 2, performance: 4.0, gender: 'Male', location: 'Chicago' },
  { id: '7', name: 'Sofia Martinez', role: 'Sales Director', department: 'Sales', salary: 165000, bonus: 120000, tenure: 5, performance: 4.6, gender: 'Female', location: 'Miami' },
  { id: '8', name: 'Chris Evans', role: 'Security Analyst', department: 'Engineering', salary: 145000, bonus: 15000, tenure: 1, performance: 3.8, gender: 'Male', location: 'Berlin' },
  { id: '9', name: 'Yuki Tanaka', role: 'AI Researcher', department: 'Data', salary: 245000, bonus: 40000, tenure: 4, performance: 5.0, gender: 'Non-binary', location: 'Tokyo' },
  { id: '10', name: 'Lucia Rossi', role: 'Marketing Lead', department: 'Marketing', salary: 155000, bonus: 25000, tenure: 3, performance: 4.3, gender: 'Female', location: 'Rome' },
];

export const SALES_DATA = [
  { month: 'Jan', revenue: 45000, costs: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, costs: 34000, profit: 18000 },
  { month: 'Mar', revenue: 48000, costs: 31000, profit: 17000 },
  { month: 'Apr', revenue: 61000, costs: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, costs: 35000, profit: 20000 },
  { month: 'Jun', revenue: 67000, costs: 42000, profit: 25000 },
  { month: 'Jul', revenue: 72000, costs: 45000, profit: 27000 },
  { month: 'Aug', revenue: 68000, costs: 43000, profit: 25000 },
  { month: 'Sep', revenue: 75000, costs: 48000, profit: 27000 },
  { month: 'Oct', revenue: 81000, costs: 51000, profit: 30000 },
  { month: 'Nov', revenue: 85000, costs: 53000, profit: 32000 },
  { month: 'Dec', revenue: 95000, costs: 58000, profit: 37000 },
];

export const DEPT_REVENUE = [
  { name: 'SaaS', value: 450000 },
  { name: 'Consulting', value: 280000 },
  { name: 'Hardware', value: 150000 },
  { name: 'Support', value: 120000 },
];
