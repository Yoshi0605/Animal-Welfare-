import './globals.css';
import Nav from '@/components/Nav';
import ScrollFX from '@/components/ScrollFX';
import Gate from '@/components/Gate';
export const metadata = { title: 'Pawhaven — A home for every paw', description: 'Report stray animals, adopt, foster and donate.' };
export default function Root({ children }) {
  return (<html lang="en"><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Nunito:wght@400;700;800&family=Oswald:wght@600;700&display=swap" /></head>
    <body><a className="skip" href="#home">Skip to content</a><Gate /><Nav />{children}<ScrollFX /></body></html>);
}
