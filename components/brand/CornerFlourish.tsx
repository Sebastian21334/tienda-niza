"use client";

import { cn } from "@/lib/utils";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface CornerFlourishProps {
  /** Esquina donde se ancla el trazo */
  corner?: Corner;
  /** Tamaño del SVG en px (cuadrado) */
  size?: number;
  /** Opacidad del trazo dorado (0 a 1) */
  opacity?: number;
  /** Incluir el pequeño destello/estrella junto a la curva, como en las tarjetas */
  withSpark?: boolean;
  className?: string;
}

/**
 * CornerFlourish
 * -----------------------------------------------------------------------
 * La curva dorada fina que aparece en las tarjetas físicas de Niza,
 * llevada al lenguaje digital como firma visual de marca.
 *
 * Uso: se posiciona con `absolute` dentro de un contenedor `relative`.
 * Está pensado para vivir DETRÁS del contenido (z-0 / pointer-events-none),
 * nunca invadiendo texto o botones.
 *
 * Ejemplos:
 *   <section className="relative overflow-hidden">
 *     <CornerFlourish corner="top-right" />
 *     <CornerFlourish corner="bottom-left" withSpark />
 *     ...contenido...
 *   </section>
 */
export function CornerFlourish({
  corner = "top-right",
  size = 180,
  opacity = 0.35,
  withSpark = false,
  className,
}: CornerFlourishProps) {
  const rotationByCorner: Record<Corner, string> = {
    "top-left": "rotate-0",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90",
  };

  const positionByCorner: Record<Corner, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute select-none",
        positionByCorner[corner],
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        className={cn(rotationByCorner[corner])}
        style={{ opacity }}
      >
        <path
          d="M2 100C2 46 46 2 100 2"
          stroke="#B8935A"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M2 140C2 73 73 2 140 2"
          stroke="#B8935A"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.6"
        />

        {withSpark && (
          <g transform="translate(58 58)" stroke="#B8935A" strokeWidth="1" strokeLinecap="round">
            <path d="M0 -7V7" />
            <path d="M-7 0H7" />
          </g>
        )}
      </svg>
    </div>
  );
}
