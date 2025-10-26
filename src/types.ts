export interface AttributeDefinition {
  key: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'date'
  required: boolean
  options?: string[]
  defaultValue?: string | number | boolean
}
export interface Category {
  id: string
  name: string
  icon: string
  color: string
  schema: AttributeDefinition[]
}

export interface Product {
  id: string
  name: string
  categoryId: string
  price: number
  stock: number
  attributes: Record<string, string | number | boolean>
}

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  order: number;
  width?: number;
}

export interface FilterConfig {
  attributeKey: string;
  operator: 'eq' | 'contains' | 'gt' | 'lt' | 'between' | 'in';
  value: string | number | boolean;
}

