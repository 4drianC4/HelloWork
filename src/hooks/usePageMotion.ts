import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function usePageMotion() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const listeners: Array<() => void> = [];
      gsap.from('.hero-copy > *', {
        y: 18, opacity: 0, duration: .7, stagger: .09, ease: 'power2.out', clearProps: 'all',
      });
      // Never hide whole sections. Focus and anchor navigation must stay usable.
      const elements = gsap.utils.toArray<HTMLElement>(
        '.section-heading, .project-card, .service-card, .process-grid > li, .about-grid, .experience, .contact-row',
      );
      elements.forEach(element => {
        const siblingIndex = Array.from(element.parentElement?.children ?? []).indexOf(element);
        const staggered = element.matches('.project-card, .service-card, .process-grid > li, .experience');
        const reveal = gsap.from(element, {
          delay: staggered ? Math.min(Math.max(siblingIndex, 0), 3) * .09 : 0,
          y: 20, opacity: 0, duration: .6, paused: true, ease: 'power2.out', clearProps: 'all',
        });
        const trigger = ScrollTrigger.create({
          trigger: element, start: 'top 96%', once: true,
          onEnter: () => reveal.play(),
        });
        const onFocus = () => { reveal.progress(1); trigger.kill(); };
        element.addEventListener('focusin', onFocus);
        listeners.push(() => element.removeEventListener('focusin', onFocus));
      });
      gsap.fromTo('.timeline', { '--trail-progress': 0 }, {
        '--trail-progress': 1, ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 85%', end: 'bottom 65%', scrub: .6 },
      });
      return () => listeners.forEach(remove => remove());
    });
    return () => media.revert();
  }, []);
}
