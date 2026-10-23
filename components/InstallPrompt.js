'use client';
import { useEffect, useState } from 'react';

// Registers the service worker and offers "Add to Home Screen".
export default function InstallPrompt({ t }) {
  const [evt, setEvt] = useState(null);
  const [ios, setIos] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    if (standalone || sessionStorage.getItem('sfm-install-dismissed')) return;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const onPrompt = (e) => { e.preventDefault(); setEvt(e); setShow(true); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    let tm;
    if (isIos) { setIos(true); tm = setTimeout(() => setShow(true), 4000); }
    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); clearTimeout(tm); };
  }, []);

  const close = () => { sessionStorage.setItem('sfm-install-dismissed', '1'); setShow(false); };
  const install = async () => { if (!evt) return; evt.prompt(); await evt.userChoice; close(); };

  if (!show) return null;
  return (
    <div className="install" role="dialog" aria-label={t.install}>
      <div className="ic">SFM</div>
      <p><b>{t.install}</b>{ios ? t.installIos : t.installSub}</p>
      {evt && <button className="btn primary" style={{ flex: 'none' }} onClick={install}>{t.installBtn}</button>}
      <button className="x" onClick={close} aria-label={t.dismiss}>×</button>
    </div>
  );
}
