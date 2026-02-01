import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
}

export function TypewriterText({ text }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const typeSpeed = 150;
    const deleteSpeed = 100;
    const pauseTime = 2000;
    const restartPause = 1000;

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < text.length) {
            setDisplayText(text.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          } else {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          if (currentIndex > 0) {
            setDisplayText(text.slice(0, currentIndex - 1));
            setCurrentIndex(currentIndex - 1);
          } else {
            setTimeout(() => setIsDeleting(false), restartPause);
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed,
    );

    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, text]);

  return (
    <span className="inline-block">
      {displayText.split(" ").map((word, wordIndex) => {
        if (word === "前端") {
          return (
            <span
              key={wordIndex}
              className="bg-gradient-to-br from-[var(--primary-start)] to-[var(--primary-end)] bg-clip-text text-transparent"
            >
              {word}
            </span>
          );
        }
        return (
          <span key={wordIndex}>
            {word}
            {wordIndex < displayText.split(" ").length - 1 ? " " : ""}
          </span>
        );
      })}
      <span className="animate-pulse text-[var(--primary-end)] pl-[10px] pb-[4px]">|</span>
    </span>
  );
}
