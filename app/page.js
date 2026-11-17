import { q } from '@/lib/db';
import { SITE } from '@/lib/site';
import Animals from '@/components/Animals';
import ReportForm from '@/components/ReportForm';
import DonateForm from '@/components/DonateForm';
import FeedbackForm from '@/components/FeedbackForm';
export const dynamic = 'force-dynamic';
const STEPS = [['Report', 'Spot an animal in need? Send a photo and location in two minutes.'], ['Rescue', 'Our team is dispatched and you can follow every step.'], ['Rehabilitate', 'Food, vet care, healing and a lot of love.'], ['Adopt or foster', 'Meet them online and give them a forever home.']];
const WHY = [['Animals go unseen', 'Too many animals are left hungry, injured or abandoned.'], ['Nobody knows where to report', 'Helpers often do not know where to report, how to start or who to trust.'], ['Better together', 'Compassion, organization and transparency can change that.']];
const PROCESS = [['Apply online', 'Choose an animal and complete the four-step application.'], ['Review', 'Our team reviews every application and may call or message you.'], ['Home visit or call', 'We make sure the home is safe and a good match.'], ['Meet and adopt', 'Meet your new family member and finalize the adoption.']];
const TIPS = [['Stay safe', 'Keep your distance from a frightened or injured animal. Do not corner or chase it.'], ['Take a clear photo', 'A photo helps our team judge the condition quickly.'], ['Note the exact place', 'Landmarks, street names and a Google Maps pin help us find the animal.'], ['Go easy on food', 'If the animal looks seriously hurt, wait for guidance before offering food.']];
const GIVE = [['Food and supplies', 'Daily meals, clean water, bedding and carriers.'], ['Veterinary care', 'Check-ups, vaccinations, treatment and sterilization.'], ['Shelter and rescue', 'Transport, shelter upkeep and emergency rescues.']];
const FAQ = [['How do I report an animal?', 'Use the Report section. Describe the situation, pin the location, add a photo and your contact details. You receive a tracking code immediately.'], ['Is my personal information safe?', 'Your contact details are used only to follow up on your report, adoption application or donation, and are visible only to our staff.'], ['How long does adoption take?', 'It depends on the animal and the number of applications. Each application is reviewed by our team, followed by a call or home visit.'], ['Can I foster instead of adopting?', 'Yes. Foster care is part of our goal. Tell us in your application or message us through the contact section.'], ['How do I know my donation was received?', 'After you submit your payment details, our team confirms the payment and the status changes in the strip at the top of the page.'], ['Can I volunteer?', 'Yes. Send us a message in the contact section with how you would like to help.']];
export default async function Home() {
  let animals = [], s = { rescued: 0, adopted: 0, raised: 0 };
  try {
    animals = await q('SELECT id,name,species,age,sex,description,photo FROM animals WHERE status="available" ORDER BY id DESC');
    const n = async (x) => +Object.values((await q(x))[0])[0] || 0;
    s = { rescued: await n('SELECT COUNT(*) FROM reports WHERE status IN ("rescued","closed")'), adopted: await n('SELECT COUNT(*) FROM animals WHERE status="adopted"'), raised: await n('SELECT SUM(amount) FROM donations WHERE status="confirmed"') };
  } catch (e) { }
  const Mini = ({ l }) => <div className="mini">{l.map(([t, d]) => <div className="rv" key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>;
  return (<main>
    <section id="home" className="hero"><div className="wrap hgrid"><div>
      <h1>Be part of<br />the change</h1><p className="script">for animals in need.</p>
      <p className="lead">Report strays, adopt a new family member, or donate. Every report and every peso is tracked from start to finish.</p>
      <p className="cta"><a className="btn" href="#report">Report an animal</a><a className="btn ghost" href="#adopt">Meet adoptable pets</a><a className="btn gold" href="#donate">Donate</a></p>
      {SITE.demo && <p className="demo" style={{ marginTop: '1.2rem', maxWidth: '34rem' }}>Prototype for a research survey. Reports, applications and donations made here are for testing.</p>}</div>
      <div className="photo"><div className="img" role="img" aria-label="A puppy and a kitten together" style={{ backgroundImage: 'url(/hero.jpg)' }} /><div className="float"><b>{s.adopted}</b> animals found homes</div></div></div></section>
    <section className="intro"><div className="wrap rv"><p><b>{SITE.name}</b> is a community rescue and shelter project. Here you can <b>report</b> an animal in need, <b>adopt</b> or foster, and <b>donate</b>, then follow every step.</p></div></section>
    <section id="how" className="sec alt"><div className="wrap"><h2 className="rv">How it works</h2>
      <div className="steps">{STEPS.map(([t, d], i) => <div className="step rv" key={t}><span>{i + 1}</span><h3>{t}</h3><p>{d}</p></div>)}</div>
      <div className="strip rv"><div><b>{s.rescued}</b>animals rescued</div><div><b>{s.adopted}</b>found homes</div><div><b>₱{s.raised.toLocaleString()}</b>donated and confirmed</div></div>
      <h3 className="sub rv">Why this matters</h3><Mini l={WHY} /></div></section>
    <section id="adopt" className="sec"><div className="wrap"><h2 className="rv">Ready for a home</h2><p className="script rv">meet someone who needs you.</p><Animals animals={animals} />
      <h3 className="sub rv">How adoption works</h3><Mini l={PROCESS} /></div></section>
    <section id="report" className="sec alt"><div className="wrap"><ReportForm /><h3 className="sub rv">Found an animal? Start here</h3><Mini l={TIPS} /></div></section>
    <section id="donate" className="sec dark"><div className="wrap"><DonateForm /><h3 className="sub rv" style={{ color: '#fff' }}>Where your donation goes</h3><p className="rv" style={{ color: '#e9e2cf', maxWidth: '40rem' }}>Your donation supports the shelter's overall work. Here is what it helps with.</p><Mini l={GIVE} /></div></section>
    <section id="faq" className="sec"><div className="wrap"><h2 className="rv" style={{ textAlign: 'center' }}>Frequently asked questions</h2><div className="faq">{FAQ.map(([t, a]) => <details className="rv" key={t}><summary>{t}</summary><p>{a}</p></details>)}</div></div></section>
    <section id="contact" className="sec alt"><div className="wrap split"><div className="side rv"><h2>Contact and feedback</h2><p className="script">we would love to hear from you.</p>
      <div className="cinfo"><p><b>Hotline</b>{SITE.hotline}</p><p><b>Email</b>{SITE.email}</p><p><b>Address</b>{SITE.address}</p></div>
      {SITE.survey && <p style={{ marginTop: '1.2rem' }}><a className="btn gold" href={SITE.survey} target="_blank" rel="noreferrer">Take the survey</a></p>}</div><FeedbackForm /></div></section>
    <footer className="foot"><div className="wrap"><div className="fgrid">
      <div><h4>{SITE.name}</h4><p>A future of compassion. A home for every paw.</p><p>Rescue, rehabilitation, adoption and foster care for stray, abandoned and neglected animals.</p></div>
      <div><h4>Explore</h4><a href="#home">Home</a><a href="#how">How it works</a><a href="#adopt">Adopt</a><a href="#faq">FAQ</a></div>
      <div><h4>Get involved</h4><a href="#report">Report an animal</a><a href="#donate">Donate</a><a href="#contact">Volunteer or give feedback</a><a href="/admin">Staff login</a></div>
      <div><h4>Contact</h4><p>{SITE.hotline}</p><p>{SITE.email}</p><p>{SITE.address}</p></div></div>
      <div className="fine"><span>© 2026 {SITE.name}. A future advocacy project.</span><a href="#home">Back to top</a></div></div></footer></main>);
}
