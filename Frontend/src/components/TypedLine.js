// src/components/TypedLine.jsx
import { useTypingEffect } from "../services/typingTextService";

export const TypedLine = ({
  text,
  start = false,
  onComplete = () => {},
  speed = 40,
  prefix = null,
  prefixClass = "",
}) => {
  // Use the typing effect on the text prop
  const typedText = useTypingEffect(text, speed, start, onComplete);

  // Don't render anything until it's time to start the animation
  if (!start) {
    return null;
  }

  return (
    <>
      {prefix && <b className={prefixClass}>{prefix} </b>}
      {typedText}
    </>
  );
};
