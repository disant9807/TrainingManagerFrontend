export type TOrder = 'Asc' | 'Desc';

export type TVuetifyOptionsList = {
  text: string,
  value: string
}

export type THeaderItem = {
  text: string
  value: string
  sortable?: boolean
  align?: string
}

export type TFormValues = Record<string, Record<string, any>>
export type TSelection = { id: string, title: string }
