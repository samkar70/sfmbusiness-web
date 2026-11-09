'use client';
import { useEffect, useRef, useState } from 'react';

const MAX_ZOOM = 5;
const DOUBLE_TAP_ZOOM = 2.5;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/**
 * Photo viewer with zoom.
 * - Phone: pinch to zoom in/out, drag to move while zoomed, double-tap to zoom in/out.
 * - Not zoomed: swipe left/right calls onSwipe(+1 / -1) to change photo.
 * - Computer: mouse wheel / trackpad pinch zooms, drag to move, double-click, and +/- buttons.
 */
export default function ZoomableImage({ src, alt, onSwipe, zoomInLabel = 'Zoom in', zoomOutLabel = 'Zoom out' }) {
  const box = useRef(null);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const [busy, setBusy] = useState(false); // no easing while a finger is down
  const viewRef = useRef(view);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const moved = useRef(false);
  const lastTap = useRef({ t: 0, x: 0, y: 0 });

  const apply = (v) => { viewRef.current = v; setView(v); };

  // Keep the picture from being dragged completely out of view.
  const limit = (s, x, y) => {
    const r = box.current.getBoundingClientRect();
    const mx = ((s - 1) * r.width) / 2;
    const my = ((s - 1) * r.height) / 2;
    return { s, x: clamp(x, -mx, mx), y: clamp(y, -my, my) };
  };

  // Zoom to scale `s` while keeping the picture point under (cx, cy) fixed on screen.
  const zoomAt = (s, cx, cy) => {
    const r = box.current.getBoundingClientRect();
    const { s: s0, x: x0, y: y0 } = viewRef.current;
    const px = cx - (r.left + r.width / 2);
    const py = cy - (r.top + r.height / 2);
    const lx = (px - x0) / s0;
    const ly = (py - y0) / s0;
    const ns = clamp(s, 1, MAX_ZOOM);
    apply(ns <= 1.001 ? { s: 1, x: 0, y: 0 } : limit(ns, px - ns * lx, py - ns * ly));
  };

  const zoomCenter = (factor) => {
    const r = box.current.getBoundingClientRect();
    zoomAt(viewRef.current.s * factor, r.left + r.width / 2, r.top + r.height / 2);
  };

  // Mouse wheel / trackpad pinch (needs a non-passive listener to stop the page from scrolling).
  useEffect(() => {
    const el = box.current;
    const onWheel = (e) => {
      e.preventDefault();
      const speed = e.ctrlKey ? 0.01 : 0.0025;
      zoomAt(viewRef.current.s * Math.exp(-e.deltaY * speed), e.clientX, e.clientY);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (e) => {
    try { box.current.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointers */ }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = pointers.current.size > 1 ? true : false;
    setBusy(true);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const r = box.current.getBoundingClientRect();
      const mx = (a.x + b.x) / 2 - (r.left + r.width / 2);
      const my = (a.y + b.y) / 2 - (r.top + r.height / 2);
      const v = viewRef.current;
      gesture.current = {
        type: 'pinch',
        d0: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        s0: v.s,
        lx: (mx - v.x) / v.s,
        ly: (my - v.y) / v.s,
      };
    } else if (pointers.current.size === 1) {
      gesture.current = { type: viewRef.current.s > 1 ? 'pan' : 'swipe', sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY };
    }
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    if (g.type === 'pinch' && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const r = box.current.getBoundingClientRect();
      const mx = (a.x + b.x) / 2 - (r.left + r.width / 2);
      const my = (a.y + b.y) / 2 - (r.top + r.height / 2);
      const s = clamp((g.s0 * Math.hypot(a.x - b.x, a.y - b.y)) / g.d0, 1, MAX_ZOOM);
      apply(s <= 1.001 ? { s: 1, x: 0, y: 0 } : limit(s, mx - s * g.lx, my - s * g.ly));
      moved.current = true;
    } else if (g.type === 'pan') {
      const v = viewRef.current;
      apply(limit(v.s, v.x + (e.clientX - g.lx), v.y + (e.clientY - g.ly)));
      if (Math.hypot(e.clientX - g.sx, e.clientY - g.sy) > 6) moved.current = true;
      g.lx = e.clientX;
      g.ly = e.clientY;
    } else if (g.type === 'swipe') {
      if (Math.hypot(e.clientX - g.sx, e.clientY - g.sy) > 8) moved.current = true;
    }
  };

  const endPointer = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) { gesture.current = null; return; } // one finger of a pinch lifted
    setBusy(false);
    gesture.current = null;
    if (!g) return;
    if (viewRef.current.s < 1.02) apply({ s: 1, x: 0, y: 0 });
    if (e.type === 'pointercancel') return;

    const dx = e.clientX - g.sx;
    const dy = e.clientY - g.sy;
    if (g.type === 'swipe' && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      onSwipe?.(dx < 0 ? 1 : -1);
      return;
    }
    if (!moved.current && g.type !== 'pinch') {
      // Double tap / double click toggles zoom.
      const now = Date.now();
      const lt = lastTap.current;
      if (now - lt.t < 320 && Math.hypot(e.clientX - lt.x, e.clientY - lt.y) < 30) {
        if (viewRef.current.s > 1) apply({ s: 1, x: 0, y: 0 });
        else zoomAt(DOUBLE_TAP_ZOOM, e.clientX, e.clientY);
        lastTap.current = { t: 0, x: 0, y: 0 };
      } else {
        lastTap.current = { t: now, x: e.clientX, y: e.clientY };
      }
    }
  };

  const { s, x, y } = view;
  const stop = (e) => e.stopPropagation();

  return (
    <div
      ref={box}
      className="zoombox"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', touchAction: 'none', cursor: s > 1 ? 'grab' : 'zoom-in', userSelect: 'none' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          transform: `translate(${x}px, ${y}px) scale(${s})`,
          transformOrigin: 'center center',
          transition: busy ? 'none' : 'transform .18s ease',
        }}
      />
      <div style={zoomBtns} onPointerDown={stop} onPointerUp={stop}>
        <button type="button" aria-label={zoomOutLabel} onClick={() => zoomCenter(1 / 1.6)} disabled={s <= 1} style={zoomBtn}>−</button>
        <button type="button" aria-label={zoomInLabel} onClick={() => zoomCenter(1.6)} disabled={s >= MAX_ZOOM} style={zoomBtn}>+</button>
      </div>
    </div>
  );
}

const zoomBtns = {
  position: 'absolute',
  zIndex: 20,
  left: 10,
  bottom: 10,
  display: 'flex',
  gap: 6,
};

const zoomBtn = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  fontSize: 20,
  lineHeight: 1,
  cursor: 'pointer',
  opacity: 1,
};
