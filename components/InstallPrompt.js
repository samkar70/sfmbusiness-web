'use client';
import { useEffect, useState } from 'react';

// Registers the service worker and offers "Add to Home Screen".
// - Android / Chromium: captures `beforeinstallprompt` and triggers the native prompt.
// - iOS Safari: no programmatic install, so shows a short how-to sheet.
// - Already installed (standalone): renders nothing.
export default function InstallPrompt({ t }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [platform, setPlatform] = useState(null); // 'ios' | 'android' | null
  const [show, setShow] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (standalone) return;

    let dismissed = false;
    try { dismissed = !!sessionStorage.getItem('sfm-install-dismissed'); } catch (e) { /* storage blocked */ }
    if (dismissed) return;

    const ua = navigator.userAgent || '';
    // iPadOS 13+ reports itself as "Macintosh" but has touch points.
    const isIos =
      /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(ua);
    setPlatform(isIos ? 'ios' : isAndroid ? 'android' : null);

    const onPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    const onInstalled = () => { setDeferredPrompt(null); setShow(false); setShowSteps(false); };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    let tm;
    if (isIos) tm = setTimeout(() => setShow(true), 4000);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      clearTimeout(tm);
    };
  }, []);

  const close = () => {
    try { sessionStorage.setItem('sfm-install-dismissed', '1'); } catch (e) { /* ignore */ }
    setShow(false);
    setShowSteps(false);
  };

  const install = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (e) { /* ignore */ }
      setDeferredPrompt(null);
      close();
    } else if (platform === 'ios') {
      setShowSteps(true);
    }
  };

  if (!show) return null;

  const canInstall = !!deferredPrompt || platform === 'ios';

  return (
    <>
      <div className="install" role="dialog" aria-label={t.install}>
        <div className="ic">SFM</div>
        <p><b>{t.install}</b>{platform === 'ios' && !deferredPrompt ? t.installIos : t.installSub}</p>
        {canInstall && (
          <button type="button" className="btn primary" style={{ flex: 'none' }} onClick={install}>
            {t.installBtn}
          </button>
        )}
        <button type="button" className="x" onClick={close} aria-label={t.dismiss}>×</button>
      </div>

      {showSteps && (
        <div
          role="dialog"
          aria-label={t.install}
          onClick={() => setShowSteps(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            padding: '12px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 496, background: 'var(--card2, #151b2b)',
              border: '1px solid var(--brand, #1d4ed8)', borderRadius: 20, padding: 18,
              color: 'var(--txt, #fff)', boxShadow: '0 12px 40px #000a',
            }}
          >
            <b style={{ display: 'block', fontSize: 16, marginBottom: 10 }}>{t.install}</b>
            <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 10, fontSize: 14, lineHeight: 1.4 }}>
              <li>
                {t.iosStep1}{' '}
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                  style={{ verticalAlign: 'middle' }}
                >
                  <path d="M12 3v12M8 7l4-4 4 4M5 11v9h14v-9" />
                </svg>
              </li>
              <li>{t.iosStep2}</li>
            </ol>
            <button
              type="button"
              className="btn primary"
              style={{ width: '100%', marginTop: 14 }}
              onClick={close}
            >
              {t.iosGotIt}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
