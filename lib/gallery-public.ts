import 'server-only'

import { STATIC_GALLERY_PHOTOS } from '@/lib/gallery-static'
import { readManagedGalleryItems } from '@/lib/gallery-store'
import type { GalleryPhoto } from '@/lib/gallery-types'
import type { SiteLocale } from '@/lib/site-locale'

const GALLERY_TAG_TRANSLATIONS: Record<string, string> = {
  Events: 'Events',
  Business: 'Business',
  Tanz: 'Dance',
  Hochzeit: 'Wedding',
  Saal: 'Hall',
  Atmosphäre: 'Atmosphere',
  Kulinarik: 'Cuisine',
  Terrasse: 'Terrace',
  Küche: 'Kitchen',
  Vorspeise: 'Starter',
  Klassiker: 'Classics',
  Burger: 'Burger',
  Steak: 'Steak',
  Snacks: 'Snacks',
  Drinks: 'Drinks',
}

const GALLERY_ALT_TRANSLATIONS: Record<string, string> = {
  'Events am Abend': 'Evening Events',
  Firmenveranstaltungen: 'Corporate Events',
  'Tanz und Musik Event': 'Dance and Music Event',
  'Hochzeit im Restaurant': 'Wedding at the Restaurant',
  Bankettsaal: 'Banquet Hall',
  'Atmosphäre im Restaurant': 'Restaurant Atmosphere',
  'Fine Dining Teller': 'Fine Dining Plate',
  Terrasse: 'Terrace',
  'Gericht der Küche': 'Signature Dish',
  'Spezialität des Hauses': 'House Specialty',
  'Vorspeise Suppe': 'Starter Soup',
  'Würzfleisch': 'Wuerzfleisch',
  Schnitzel: 'Schnitzel',
  Schnitzelgericht: 'Schnitzel Dish',
  'Schnitzel au four': 'Schnitzel au four',
  Hacksteak: 'Minced Steak',
  Pfannenschaschlik: 'Skillet Shashlik',
  'Schüsselsülze': 'Jellied Pork Bowl',
  Currywurst: 'Currywurst',
  'Burger St. Georg': 'Burger St. George',
  Backfisch: 'Fried Fish',
  Geschnetzeltes: 'Sliced Chicken in Cream Sauce',
  'Nebraer Biersteak': 'Nebra Beer Steak',
  Schweinemedaillons: 'Pork Medallions',
  'Zigeuner-Steak': 'Pepper Steak',
  Bauernfrühstück: "Farmer's Breakfast",
  'Strammer Max': 'Strammer Max',
  'Snacks zum Bier': 'Beer Snacks',
  'Bier und Drinks': 'Beer and Drinks',
}

function localizeGalleryPhoto(photo: GalleryPhoto, locale: SiteLocale): GalleryPhoto {
  if (locale === 'de') {
    return photo
  }

  return {
    ...photo,
    alt: GALLERY_ALT_TRANSLATIONS[photo.alt] ?? photo.alt,
    tag: GALLERY_TAG_TRANSLATIONS[photo.tag] ?? photo.tag,
  }
}

export async function getPublicGalleryPhotos(locale: SiteLocale): Promise<GalleryPhoto[]> {
  const managedPhotos = await readManagedGalleryItems()
  const photos: GalleryPhoto[] = [
    ...managedPhotos.map((item) => ({
      desktop: item.desktop,
      mobile: item.mobile,
      alt: item.alt,
      tag: item.tag,
      ratio: item.ratio,
    })),
    ...STATIC_GALLERY_PHOTOS,
  ]

  return photos.map((photo) => localizeGalleryPhoto(photo, locale))
}
