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
              d="M28 28 Q50 0 72 28 L72 72 L28 72 Z"
              fill={hairColor}
            />
            <circle cx="50" cy="45" r="24" fill={skin} />
          </>
        );

      case "curly":
        return (
          <>
            <circle cx="36" cy="22" r="8" fill={hairColor} />
            <circle cx="50" cy="18" r="9" fill={hairColor} />
            <circle cx="64" cy="22" r="8" fill={hairColor} />
          </>
        );

      default:
        return (
          <path
            d="M26 38 Q50 8 74 38"
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
      {/* Clothes */}
      <path
        d="M20 118 L80 118 L72 80 L28 80 Z"
        fill={clothColor}
      />

      {/* Neck */}
      <rect
        x="45"
        y="68"
        width="10"
        height="10"
        fill={skin}
      />

      {/* Face */}
      <circle
        cx="50"
        cy="42"
        r="24"
        fill={skin}
      />

      {/* Hair */}
      <Hair />

      {/* Eyes */}
      <circle cx="42" cy="42" r="2" fill="#000" />
      <circle cx="58" cy="42" r="2" fill="#000" />

      {/* Mouth */}
      <Mouth />

      {/* Cap */}
      {headWear === "cap" && (
        <>
          <path
            d="M28 30 Q50 8 72 30"
            fill={headWearColor}
          />
          <rect
            x="28"
            y="28"
            width="44"
            height="6"
            fill={headWearColor}
          />
        </>
      )}

      {/* Pagdi */}
      {headWear === "pagdi" && (
        <>
          <ellipse
            cx="50"
            cy="24"
            rx="25"
            ry="12"
            fill={headWearColor}
          />
          <rect
            x="28"
            y="24"
            width="44"
            height="10"
            fill={headWearColor}
          />
        </>
      )}
    </svg>
  );
};

export default AvatarPreview;