'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import styles from './carousel.module.scss';

interface CarouselProps {
  children: ReactNode;
  ariaLabel?: string;
  /** Number of slides visible at once on desktop. Defaults to 6. */
  slidesToShow?: number;
  /** Number of slides per arrow click. Defaults to 1 (one-by-one). */
  slidesToScroll?: number;
  /** Tailwind-style breakpoint overrides for slidesToShow. Mobile-first not required — uses max-width media queries internally. */
  responsive?: {
    /** ≤1024px */ lg?: number;
    /** ≤768px */ md?: number;
    /** ≤480px */ sm?: number;
  };
  className?: string;
}

/**
 * Generic horizontal carousel powered by Embla. Snaps page-by-page so a slide
 * is never cut in half, and shows a fixed number of slides per view.
 */
export const Carousel = ({
  children,
  ariaLabel = 'Carousel',
  slidesToShow = 6,
  slidesToScroll = 1,
  responsive,
  className,
}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: slidesToScroll,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Sync initial scroll-state from Embla without triggering a cascading render.
  const [lastApi, setLastApi] = useState<typeof emblaApi>(undefined);
  if (emblaApi && lastApi !== emblaApi) {
    setLastApi(emblaApi);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const cssVars: CSSProperties & Record<string, string | number> = {
    '--slides-to-show': slidesToShow,
    '--slides-to-show-lg': responsive?.lg ?? Math.min(4, slidesToShow),
    '--slides-to-show-md': responsive?.md ?? Math.min(3, slidesToShow),
    '--slides-to-show-sm': responsive?.sm ?? Math.min(2, slidesToShow),
  };

  return (
    <div className={[styles.carousel, className].filter(Boolean).join(' ')} style={cssVars}>
      <button
        type='button'
        className={styles.carouselBtn}
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        aria-label='Scroll left'
      >
        <ChevronLeft size={20} />
      </button>

      <div ref={emblaRef} className={styles.viewport} role='region' aria-label={ariaLabel}>
        <div className={styles.track}>{children}</div>
      </div>

      <button
        type='button'
        className={styles.carouselBtn}
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        aria-label='Scroll right'
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
