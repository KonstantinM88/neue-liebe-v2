export type GalleryRatio = 'wide' | 'tall' | 'square'

export type GalleryPhoto = {
  desktop: string
  mobile: string
  alt: string
  tag: string
  ratio: GalleryRatio
}

export type ManagedGalleryItem = GalleryPhoto & {
  id: string
  createdAt: string
}

export type AdminGalleryItem = ManagedGalleryItem & {
  source: 'upload' | 'static'
}
