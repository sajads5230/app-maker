import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'فروشگاه هوشمند شیائومی اسمارت',
    short_name: 'شیائومی اسمارت',
    description: 'خرید انواع تجهیزات هوشمند خانگی، ساعت، دوربین و جارو رباتیک شیائومی با گارانتی رسمی',
    start_url: '/pwa',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#EF394E',
    lang: 'fa',
    dir: 'rtl',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
