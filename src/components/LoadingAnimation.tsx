import React from "react";

interface LoadingAnimationProps {
  isVisible: boolean;
  isAnimatingOut?: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  isVisible,
  isAnimatingOut = false,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-500 ${isAnimatingOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="loader">
        {/* 渐变定义 */}
        <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
          <defs xmlns="http://www.w3.org/2000/svg">
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="b"
            >
              <stop stopColor="#973BED" />
              <stop stopColor="#007CFF" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="0"
              x2="0"
              y1="64"
              x1="0"
              id="c"
            >
              <stop stopColor="#FFC800" />
              <stop stopColor="#F0F" offset="1" />
              <animateTransform
                repeatCount="indefinite"
                keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                dur="8s"
                values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                type="rotate"
                attributeName="gradientTransform"
              />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="d"
            >
              <stop stopColor="#00E0ED" />
              <stop stopColor="#00DA72" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="e"
            >
              <stop stopColor="#FF6B6B" />
              <stop stopColor="#4ECDC4" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="f"
            >
              <stop stopColor="#A8E6CF" />
              <stop stopColor="#88D8C0" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="g"
            >
              <stop stopColor="#FFD93D" />
              <stop stopColor="#FF6B6B" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="h"
            >
              <stop stopColor="#E056FD" />
              <stop stopColor="#686AED" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="i"
            >
              <stop stopColor="#F9CA24" />
              <stop stopColor="#F0932B" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="j"
            >
              <stop stopColor="#6AB04C" />
              <stop stopColor="#BADc58" offset="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* X */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#b)"
            d="M 12,12 L 52,52 M 52,12 L 12,52"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* i */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#c)"
            d="M 32,12 L 32,16 M 32,24 L 32,52"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* a */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#d)"
            d="M 16,52 L 16,32 Q 16,20 28,20 L 40,20 Q 48,20 48,32 L 48,52 M 16,40 L 48,40"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* o */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#e)"
            d="M 12,32 Q 12,12 32,12 Q 52,12 52,32 Q 52,52 32,52 Q 12,52 12,32"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* S */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#f)"
            d="M 48,16 Q 48,8 32,8 Q 12,8 12,20 Q 12,28 32,32 Q 52,36 52,44 Q 52,56 32,56 Q 12,56 12,48"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* h */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#g)"
            d="M 16,12 L 16,52 M 16,32 Q 16,20 32,20 Q 48,20 48,32 L 48,52"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* u */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#h)"
            d="M 12,20 L 12,52 Q 12,52 32,52 Q 52,52 52,40 L 52,20"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* a */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#i)"
            d="M 16,52 L 16,32 Q 16,20 28,20 L 40,20 Q 48,20 48,32 L 48,52 M 16,40 L 48,40"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* i */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#j)"
            d="M 32,12 L 32,16 M 32,24 L 32,52"
            className="dash"
            pathLength="360"
          />
        </svg>
      </div>

      <style jsx>{`
        .loader {
          display: flex;
          margin: 0.25em 0;
          gap: 0.2em;
        }

        .dash {
          animation:
            dashArray 2s ease-in-out infinite,
            dashOffset 2s linear infinite;
        }

        @keyframes dashArray {
          0% {
            stroke-dasharray: 0 1 359 0;
          }
          50% {
            stroke-dasharray: 0 359 1 0;
          }
          100% {
            stroke-dasharray: 359 1 0 0;
          }
        }

        @keyframes dashOffset {
          0% {
            stroke-dashoffset: 365;
          }
          100% {
            stroke-dashoffset: 5;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
