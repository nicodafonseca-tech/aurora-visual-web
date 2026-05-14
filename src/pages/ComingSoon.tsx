import { useEffect, useRef, useState, FormEvent } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const WEB3FORMS_KEY = 'e55f9fe7-6f07-4e75-9e18-493f12b9082f';

const FADE = 0.5;

type Lang = 'es' | 'en';
type Status = 'idle' | 'sending' | 'success' | 'error';

const copy = {
  es: {
    eyebrow: 'Agencia de eMarketing · En construcción',
    headline: 'Próximamente,',
    headlineItalic: 'algo que vale la pena esperar.',
    desc: 'Posicionamos marcas ambiciosas con estrategia digital real. Webs, campañas y contenido que convierten visitas en clientes.',
    namePlaceholder: 'Tu nombre',
    emailPlaceholder: 'Tu email',
    messagePlaceholder: 'Cuéntanos tu proyecto',
    submit: 'Enviar mensaje',
    sending: 'Enviando…',
    note: 'Respondemos en menos de 24h',
    successTitle: 'Mensaje recibido.',
    successDesc: 'Te contactamos en menos de 24 horas.',
    errorMsg: 'Algo salió mal. Escríbenos a info@auroravisual.media',
    emailSubject: 'Nuevo contacto desde Aurora Visual',
    footer: 'Todos los derechos reservados',
    nav: 'Hablemos',
  },
  en: {
    eyebrow: 'eMarketing Agency · Under Construction',
    headline: 'Coming soon,',
    headlineItalic: 'something worth waiting for.',
    desc: 'We position ambitious brands with real digital strategy. Websites, campaigns and content that turn visits into clients.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Your email',
    messagePlaceholder: 'Tell us about your project',
    submit: 'Send message',
    sending: 'Sending…',
    note: 'We reply within 24h',
    successTitle: 'Message received.',
    successDesc: 'We\'ll get back to you within 24 hours.',
    errorMsg: 'Something went wrong. Email us at info@auroravisual.media',
    emailSubject: 'New contact from Aurora Visual',
    footer: 'All rights reserved',
    nav: 'Let\'s talk',
  },
};

const ComingSoon = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lang, setLang] = useState<Lang>('es');
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const t = copy[lang];

  // Video fade loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let raf: number;

    const tick = () => {
      const { currentTime, duration } = video;
      if (duration) {
        if (currentTime < FADE) {
          video.style.opacity = String(currentTime / FADE);
        } else if (currentTime > duration - FADE) {
          video.style.opacity = String((duration - currentTime) / FADE);
        } else {
          video.style.opacity = '1';
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => { video.currentTime = 0; video.play(); }, 100);
    };

    video.play().catch(() => {});
    raf = requestAnimationFrame(tick);
    video.addEventListener('ended', onEnded);
    return () => { cancelAnimationFrame(raf); video.removeEventListener('ended', onEnded); };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `${t.emailSubject} — ${form.name}`,
          name: form.name,
          email: form.email,
          message: form.message,
          lang,
        }),
      });

      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
      if (data.success) setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-transparent border-b border-[#555555] py-3 text-sm text-black placeholder-[#555555] ' +
    'outline-none focus:border-black transition-colors duration-200';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">

      {/* Video Background */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        className="absolute w-full object-cover z-0"
        style={{ top: '300px', inset: 'auto 0 0 0', opacity: 0 }}
      />

      {/* Gradientes sobre el vídeo */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #ffffff 0%, transparent 35%, transparent 65%, #ffffff 100%)',
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <span
          className="text-3xl tracking-tight"
          style={{ fontFamily: 'Instrument Serif, Georgia, serif', color: '#000000' }}
        >
          Aurora Visual<sup style={{ fontSize: '0.5em', verticalAlign: 'super' }}>®</sup>
        </span>

        {/* Language toggle */}
        <div className="flex items-center gap-1 text-xs tracking-widest uppercase">
          <button
            onClick={() => { setLang('es'); setStatus('idle'); }}
            className="transition-colors"
            style={{ color: lang === 'es' ? '#000000' : '#AAAAAA' }}
          >
            ES
          </button>
          <span style={{ color: '#D0D0D0' }}>|</span>
          <button
            onClick={() => { setLang('en'); setStatus('idle'); }}
            className="transition-colors"
            style={{ color: lang === 'en' ? '#000000' : '#AAAAAA' }}
          >
            EN
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        {/* Eyebrow */}
        <span
          className="mb-10 text-xs uppercase tracking-[0.3em] animate-fade-rise"
          style={{ color: '#6F6F6F' }}
        >
          {t.eyebrow}
        </span>

        {/* Headline */}
        <h1
          className="font-normal max-w-5xl animate-fade-rise text-5xl sm:text-7xl md:text-8xl"
          style={{
            fontFamily: 'Instrument Serif, Georgia, serif',
            lineHeight: 0.95,
            letterSpacing: '-2.46px',
            color: '#000000',
          }}
        >
          {t.headline}{' '}
          <span className="italic" style={{ color: '#6F6F6F' }}>
            {t.headlineItalic}
          </span>
        </h1>

        {/* Descripción */}
        <p
          className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay"
          style={{ color: '#6F6F6F' }}
        >
          {t.desc}
        </p>

        {/* Formulario */}
        <div className="w-full max-w-md mt-14 animate-fade-rise-delay-2">
          {status === 'success' ? (
            <div className="py-12 text-center">
              <p
                className="text-2xl mb-3"
                style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}
              >
                {t.successTitle}
              </p>
              <p className="text-sm" style={{ color: '#6F6F6F' }}>
                {t.successDesc}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
              <input
                type="text"
                placeholder={t.namePlaceholder}
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
              <textarea
                placeholder={t.messagePlaceholder}
                rows={3}
                required
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className={inputClass + ' resize-none'}
              />

              {status === 'error' && (
                <p className="text-xs text-red-500 -mt-2">{t.errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-2 rounded-full px-10 py-4 text-sm bg-black text-white transition-all hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed self-center"
              >
                {status === 'sending' ? t.sending : t.submit}
              </button>

              <p className="text-[10px] text-center uppercase tracking-widest" style={{ color: '#AAAAAA' }}>
                {t.note}
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p
          className="absolute bottom-10 text-[10px] uppercase tracking-widest"
          style={{ color: '#6F6F6F' }}
        >
          © {new Date().getFullYear()} Aurora Visual · {t.footer}
        </p>
      </section>

    </div>
  );
};

export default ComingSoon;
