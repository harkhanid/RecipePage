import { useState, useEffect, useRef } from "react";

export function useTypingEffect(
  fullText,
  speed = 50,
  start = true,
  onComplete = () => {}
) {
  const [displayedText, setDisplayedText] = useState("");
  const prevTextRef = useRef(fullText);
  const counterRef = useRef(0);
  useEffect(() => {
    console.log("1 useTypingEffect called with:", fullText, displayedText);
  });
  useEffect(() => {
    // Only restart if fullText changes or start flips
    if (!start || !fullText || prevTextRef.current === fullText) return;

    prevTextRef.current = fullText;
    counterRef.current = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (prev.length < fullText.length)
          return prev + fullText.charAt(prev.length);
        else {
          clearInterval(interval);
          onComplete();
          return prev;
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, start]);

  return displayedText;
}
