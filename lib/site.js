export const SITE = {
  name: 'Pawhaven',
  hotline: process.env.NEXT_PUBLIC_HOTLINE || 'Add your hotline in .env',
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@yourdomain.ph',
  address: process.env.NEXT_PUBLIC_ADDRESS || 'Add your shelter address in .env',
  survey: process.env.NEXT_PUBLIC_SURVEY_URL || '',
  demo: process.env.NEXT_PUBLIC_DEMO !== 'false',
};
