"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
const buttonEase = CustomEase.create("button-hover", "0.23, 1, 0.32, 1");

const REST_PATH =
  "M125.34559900074298,7.795111709562626 L125.34559900074298,7.795111709562626 Q152.13778629937102,7.791826836562791,152.13778629937102,34.584014336562795 L152.13778629937102,29.244110663437205 Q152.13778629937102,56.03629816343721,125.34559900074298,56.033013290437374 L27.82182642787484,56.02105632687199 Q1.029639129246803,56.01777145387216,1.029639129246803,29.225583953872153 L1.029639129246803,34.602541046127854 Q1.029639129246803,7.810353546127846,27.821826427874843,7.807068673128011 Z";

// Keep both command sequences aligned. The first Q rounds the top-right
// corner with the same four-unit inset as the other hover corners.
const HOVER_PATH =
  "M132.49253659567253,6.9301084815408895 L132.49253659567253,6.9301084815408895 Q136.48845271107174,7.110813762849752,136.67944004513453,11.106251641008738 L138.7428515302275,54.272634617267975 Q138.9338388642903,58.26807249542696,134.9346713689024,58.34967729818354 L17.311138687243737,60.74983813042892 Q13.311971191855847,60.8314429331855,13.157688399455989,56.834419438137054 L11.173654749455768,5.433812859377104 Q11.01937195705591,1.4367893643286571,15.015288072455117,1.6174946456375198 Z";

const Button = ({
  id,
  title,
  altTitle,
  rightIcon,
  leftIcon,
  containerClass,
  shapeMorph = false,
}: {
  id: string;
  title: string;
  altTitle?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  containerClass: string;
  shapeMorph?: boolean;
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const animateShape = (targetPath: string) => {
    const path = pathRef.current;
    if (!path) return;

    animationRef.current?.kill();
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      path.setAttribute("d", REST_PATH);
      return;
    }

    // GSAP starts from the currently rendered path when a hover is interrupted.
    animationRef.current = gsap.to(path, {
      attr: { d: targetPath },
      duration: 0.25,
      ease: buttonEase,
    });
  };

  useEffect(() => {
    if (!shapeMorph) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const resetShape = () => {
      animationRef.current?.kill();
      pathRef.current?.setAttribute("d", REST_PATH);
    };

    reducedMotion.addEventListener("change", resetShape);
    finePointer.addEventListener("change", resetShape);
    return () => {
      animationRef.current?.kill();
      reducedMotion.removeEventListener("change", resetShape);
      finePointer.removeEventListener("change", resetShape);
    };
  }, [shapeMorph]);

  return (
    <button
      id={id}
      onMouseEnter={() => shapeMorph && animateShape(HOVER_PATH)}
      onMouseLeave={() => shapeMorph && animateShape(REST_PATH)}
      className={`animated-button group relative z-10 inline-flex items-center justify-center text-black ${
        shapeMorph
          ? "h-[62px] min-w-[153px] bg-transparent px-8"
          : "w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3"
      } ${containerClass}`}
    >
      {shapeMorph && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 153 62"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d={REST_PATH}
            fill="#f5f3ff"
          />
        </svg>
      )}

      {leftIcon}

      {altTitle !== undefined || shapeMorph ? (
        <span className="relative z-10 inline-grid overflow-hidden font-general text-xs uppercase leading-none">
          <span className="button-label button-label-rest col-start-1 row-start-1 whitespace-nowrap">
            {title}
          </span>

          <span
            aria-hidden="true"
            className="button-label button-label-hover col-start-1 row-start-1 whitespace-nowrap"
          >
            {altTitle ?? title}
          </span>
        </span>
      ) : (
        <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
          {title}
        </span>
      )}

      {rightIcon}
    </button>
  );
};

export default Button;
