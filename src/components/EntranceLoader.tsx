import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import iphoneImg from '../assets/iphone-mockup.png';

interface EntranceLoaderProps {
  onComplete: () => void;
}

const EntranceLoader: React.FC<EntranceLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iphoneRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Wait a bit after animations before moving to home
        setTimeout(onComplete, 1000);
      }
    });

    // 1. Counter Animation
    const counterObj = { value: 0 };
    gsap.to(counterObj, {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.floor(counterObj.value))
    });

    // 2. Initial Reveal Phase
    tl.to(counterRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 2.6
    })
    .to(containerRef.current, {
      backgroundColor: "#ffffff",
      duration: 1,
      ease: "power4.inOut"
    }, "-=0.2")
    
    // 3. iPhone and Text Reveal
    .fromTo(iphoneRef.current, 
      { y: 100, opacity: 0, scale: 0.9, rotateX: 20 },
      { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: "expo.out" }
    )
    .fromTo(textRef.current?.querySelectorAll('span') ?? [],
      { y: "100%" },
      { y: "0%", duration: 1, ease: "expo.out", stagger: 0.1 },
      "-=1"
    )
    .fromTo(subtextRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.5"
    );

    // Subtle floating animation for iPhone
    gsap.to(iphoneRef.current, {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Exit Animation
    tl.to(contentRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power4.inOut",
      delay: 1.5
    });

  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="grain-overlay"></div>
      
      {/* Percentage Counter */}
      <div 
        ref={counterRef}
        className="mono text-white text-sm tracking-[0.2em]"
      >
        [ {progress.toString().padStart(2, '0')}% ]
      </div>

      {/* Main Content Reveal */}
      <div 
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="relative w-full max-w-lg px-6 flex flex-col items-center">
          <img 
            ref={iphoneRef}
            src={iphoneImg} 
            alt="iPhone Mockup" 
            className="w-[280px] md:w-[320px] drop-shadow-2xl mb-12"
            style={{ perspective: '1000px' }}
          />
          
          <div className="text-center max-w-md">
            <h1 
              ref={textRef}
              className="serif text-4xl md:text-5xl leading-tight mb-4 reveal-text"
            >
              <div className="overflow-hidden"><span>toda tu marca</span></div>
              <div className="overflow-hidden"><span>pasa por aquí</span></div>
            </h1>
            <p 
              ref={subtextRef}
              className="text-zinc-500 text-lg font-light tracking-wide italic"
            >
              y como aprovecharlo es nuestra tarea
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntranceLoader;
