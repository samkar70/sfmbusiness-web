'use client';
import { useState } from 'react';

// Composes a WhatsApp message to the dealer (no backend / no stored personal data).
export default function ContactForm({ t, whatsapp, defaultMsg }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState(defaultMsg);
  const submit = (e) => {
    e.preventDefault();
    const text = `${msg}\n\n${name}${phone ? ` · ${phone}` : ''}`.trim();
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };
  return (
    <form className="form" onSubmit={submit} id="contact">
      <input required placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      <input type="tel" placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" />
      <textarea rows={3} required placeholder={t.yourMessage} value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button className="btn wa" type="submit">{t.send}</button>
    </form>
  );
}
