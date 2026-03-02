import React, { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * HorizontalCarousel
 * Envuelve cualquier lista de tarjetas en un scroll horizontal con:
 *  - scroll suave
 *  - scrollbar minimalista (visible solo en hover)
 *  - botones de flecha para navinar con teclado/mouse
 *  - scroll táctil nativo en móviles
 */
const HorizontalCarousel = ({ children, className = '' }) => {
    const trackRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const SCROLL_AMOUNT = 320; // px por clic

    const updateArrows = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    const scrollLeft = () => { trackRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' }); };
    const scrollRight = () => { trackRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' }); };

    return (
        <div className={`carousel-wrapper ${className}`}>
            {/* Botón izquierdo */}
            <button
                className={`carousel-arrow carousel-arrow--left ${canScrollLeft ? 'carousel-arrow--visible' : ''}`}
                onClick={scrollLeft}
                aria-label="Desplazar izquierda"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Track con scroll horizontal */}
            <div
                ref={trackRef}
                className="carousel-track"
                onScroll={updateArrows}
            >
                {children}
            </div>

            {/* Botón derecho */}
            <button
                className={`carousel-arrow carousel-arrow--right ${canScrollRight ? 'carousel-arrow--visible' : ''}`}
                onClick={scrollRight}
                aria-label="Desplazar derecha"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default HorizontalCarousel;
