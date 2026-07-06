import React from "react";

const AvatarPreview = ({ avatar }) => {
  const {
    skin = "#F2C7A5",
    emotion = "happy",
    hairStyle = "short",
    hairColor = "#222",
    clothColor = "#4F46E5",
    headWear = "none",
    headWearColor = "#FF0000",
  } = avatar || {};

  const Mouth = () => {
    switch (emotion) {
      case "happy":
        return (
          <path
            d="M40 58 Q50 68 60 58"
            stroke="#000"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        );

      case "sad":
        return (
          <path
            d="M40 64 Q50 54 60 64"
            stroke="#000"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        );

      case "surprised":
        return <circle cx="50" cy="60" r="4" fill="#000" />;

      default:
        return (
          <line
            x1="42"
            y1="60"
            x2="58"
            y2="60"
            stroke="#000"
            strokeWidth="3"
          />
        );
    }
  };

  const Hair = () => {
    switch (hairStyle) {
      case "bald":
        return null;

      case "long":
        return (
          <>
            <path
              d="M25 30 Q50 5 75 30 L75 75 L25 75 Z"
              fill={hairColor}
            />
            <circle cx="50" cy="45" r="24" fill={skin} />
          </>
        );

      case "curly":
        return (
          <>
            <circle cx="35" cy="20" r="10" fill={hairColor} />
            <circle cx="50" cy="15" r="11" fill={hairColor} />
            <circle cx="65" cy="20" r="10" fill={hairColor} />
            <circle cx="30" cy="30" r="8" fill={hairColor} />
            <circle cx="70" cy="30" r="8" fill={hairColor} />
          </>
        );

      default:
        return (
          <path
            d="M25 35 Q50 10 75 35 L75 40 L25 40 Z"
            fill={hairColor}
          />
        );
    }
  };

  return (
    <svg
      width="220"
      height="260"
      viewBox="0 0 100 120"
      style={{
        maxWidth: "100%",
      }}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#f0f0f0" />
      
      {/* Clothes */}
      <path
        d="M15 118 L85 118 L75 80 L25 80 Z"
        fill={clothColor}
      />
      
      {/* Collar */}
      <path
        d="M35 80 L50 95 L65 80"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
      />

      {/* Neck */}
      <rect
        x="42"
        y="68"
        width="16"
        height="12"
        fill={skin}
      />
      
      {/* Neck shadow */}
      <rect
        x="42"
        y="68"
        width="16"
        height="4"
        fill="rgba(0,0,0,0.1)"
      />

      {/* Face */}
      <circle
        cx="50"
        cy="45"
        r="26"
        fill={skin}
      />
      
      {/* Face shadow */}
      <ellipse
        cx="50"
        cy="55"
        rx="20"
        ry="12"
        fill="rgba(0,0,0,0.05)"
      />

      {/* Hair */}
      <Hair />

      {/* Eyes */}
      <ellipse cx="42" cy="42" rx="3" ry="4" fill="#000" />
      <ellipse cx="58" cy="42" rx="3" ry="4" fill="#000" />
      
      {/* Eye shine */}
      <circle cx="43" cy="41" r="1" fill="#fff" />
      <circle cx="59" cy="41" r="1" fill="#fff" />

      {/* Eyebrows */}
      <path
        d="M38 36 Q42 34 46 36"
        stroke={hairColor}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M54 36 Q58 34 62 36"
        stroke={hairColor}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Nose */}
      <path
        d="M50 48 L50 52"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Mouth */}
      <Mouth />

      {/* Cheeks (for happy emotion) */}
      {emotion === "happy" && (
        <>
          <circle cx="35" cy="52" r="3" fill="rgba(255,182,193,0.5)" />
          <circle cx="65" cy="52" r="3" fill="rgba(255,182,193,0.5)" />
        </>
      )}

      {/* Cap */}
      {headWear === "cap" && (
        <>
          <path
            d="M25 28 Q50 5 75 28"
            fill={headWearColor}
          />
          <rect
            x="25"
            y="25"
            width="50"
            height="8"
            fill={headWearColor}
          />
          <path
            d="M25 33 L75 33 L80 38 L20 38 Z"
            fill={headWearColor}
          />
        </>
      )}

      {/* Pagdi */}
      {headWear === "pagdi" && (
        <>
          <ellipse
            cx="50"
            cy="22"
            rx="28"
            ry="14"
            fill={headWearColor}
          />
          <rect
            x="25"
            y="22"
            width="50"
            height="12"
            fill={headWearColor}
          />
          <path
            d="M30 28 Q50 35 70 28"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            fill="none"
          />
        </>
      )}
    </svg>
  );
};

export default AvatarPreview;
