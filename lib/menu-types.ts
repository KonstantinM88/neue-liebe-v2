export type MenuCategory = {
  key: string
  de: string
  en: string
}

export type MenuDish = {
  id: string
  imgDesktop: string
  imgMobile: string
  tagDe: string
  tagEn: string
  nameDe: string
  nameEn: string
  descDe: string
  descEn: string
  price: string
  category: string
}

export type ManagedMenuCategory = MenuCategory & {
  createdAt: string
}

export type ManagedMenuDish = MenuDish & {
  createdAt: string
}

export type ManagedMenuData = {
  categories: ManagedMenuCategory[]
  dishes: ManagedMenuDish[]
}

export type AdminMenuCategory = MenuCategory & {
  source: 'static' | 'upload'
  createdAt?: string
}

export type AdminMenuDish = MenuDish & {
  source: 'static' | 'upload'
  createdAt?: string
}
