import React, { useRef } from "react";

const AvatarPreview = ({ avatar }) => {
  const uniqueId = useRef(`avatar-${Math.random().toString(36).substr(2, 9)}`);
  const {
    gender = "male",
    skin = "#F2C7A5",
    emotion = "happy",
    hairStyle = "short",
    hairColor = "#222",
    clothColor = "#4F46E5",
    headWear = "none",
    headWearColor = "#FF0000",
    eyeColor = "#4A4A4A",
    faceShape = "round",
    accessory = "none",
    accessoryColor = "#FFD700",
    size = 1,
    backgroundColor = "#ffffff",
    backgroundPattern = "none",
  } = avatar || {};

  const Mouth = () => {
    switch (emotion) {
      case "happy":
        return (
          <>
            <path
              d="M38 64 Q50 78 62 64"
              stroke="#8B4513"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M40 62 Q50 74 60 62"
              stroke="#D2691E"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );

      case "sad":
        return (
          <>
            <path
              d="M38 70 Q50 58 62 70"
              stroke="#8B4513"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M40 68 Q50 60 60 68"
              stroke="#D2691E"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );

      case "surprised":
        return (
          <>
            <ellipse cx="50" cy="67" rx="6" ry="7" fill="#8B4513" />
            <ellipse cx="50" cy="67" rx="4" ry="5" fill="#2C1810" />
          </>
        );

      case "excited":
        return (
          <>
            <path
              d="M38 62 Q50 77 62 62"
              stroke="#8B4513"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M40 60 Q50 74 60 60"
              stroke="#D2691E"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M33 54 L38 48"
              stroke="#8B4513"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M67 54 L62 48"
              stroke="#8B4513"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        );

      default:
        return (
          <line
            x1="40"
            y1="66"
            x2="60"
            y2="66"
            stroke="#8B4513"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
    }
  };

  const Eyes = () => {
    switch (emotion) {
      case "surprised":
        return (
          <>
            <circle cx="42" cy="44" r="7" fill="#fff" stroke="#8B4513" strokeWidth="2.5" />
            <circle cx="58" cy="44" r="7" fill="#fff" stroke="#8B4513" strokeWidth="2.5" />
            <circle cx="42" cy="44" r="4" fill={eyeColor} />
            <circle cx="58" cy="44" r="4" fill={eyeColor} />
            <circle cx="43" cy="42" r="1.5" fill="#fff" opacity="0.8" />
            <circle cx="59" cy="42" r="1.5" fill="#fff" opacity="0.8" />
            {gender === "female" && (
              <>
                <path d="M38 40 Q42 38 46 40" stroke="#333" strokeWidth="1.5" fill="none" />
                <path d="M54 40 Q58 38 62 40" stroke="#333" strokeWidth="1.5" fill="none" />
              </>
            )}
          </>
        );
      case "excited":
        return (
          <>
            <path d="M36 42 Q42 36 48 42" stroke="#8B4513" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M52 42 Q58 36 64 42" stroke="#8B4513" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            <ellipse cx="42" cy="45" rx={gender === "female" ? 5.5 : 5} ry={gender === "female" ? 6.5 : 6} fill={eyeColor} />
            <ellipse cx="58" cy="45" rx={gender === "female" ? 5.5 : 5} ry={gender === "female" ? 6.5 : 6} fill={eyeColor} />
            <circle cx="43" cy="43" r="2" fill="#fff" opacity="0.9" />
            <circle cx="59" cy="43" r="2" fill="#fff" opacity="0.9" />
            <ellipse cx="42" cy="45" rx={gender === "female" ? 5.5 : 5} ry={gender === "female" ? 6.5 : 6} fill="rgba(0,0,0,0.15)" />
            <ellipse cx="58" cy="45" rx={gender === "female" ? 5.5 : 5} ry={gender === "female" ? 6.5 : 6} fill="rgba(0,0,0,0.15)" />
            {gender === "female" && (
              <>
                <path d="M37 41 Q42 39 47 41" stroke="#333" strokeWidth="1.5" fill="none" opacity="0.7" />
                <path d="M53 41 Q58 39 63 41" stroke="#333" strokeWidth="1.5" fill="none" opacity="0.7" />
              </>
            )}
          </>
        );
    }
  };

  const Hair = () => {
    const hairDark = shadeColor(hairColor, -25);
    const hairLight = shadeColor(hairColor, 25);
    
    switch (hairStyle) {
      case "bald":
        return null;

      case "long":
        if (gender === "female") {
          return (
            <>
              <path
                d="M20 30 Q50 8 80 30 L80 95 Q80 105 70 105 L30 105 Q20 105 20 95 Z"
                fill={hairColor}
              />
              <path
                d="M20 30 Q50 8 80 30 L80 45 L20 45 Z"
                fill={hairLight}
                opacity="0.5"
              />
              <path
                d="M20 30 Q50 8 80 30 L80 35 L20 35 Z"
                fill={hairDark}
                opacity="0.2"
              />
              <path
                d="M25 35 Q50 20 75 35"
                stroke={hairLight}
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
            </>
          );
        }
        return (
          <>
            <path
              d="M24 34 Q50 10 76 34 L76 88 Q76 98 66 98 L34 98 Q24 98 24 88 Z"
              fill={hairColor}
            />
            <path
              d="M24 34 Q50 10 76 34 L76 42 L24 42 Z"
              fill={hairLight}
              opacity="0.6"
            />
            <path
              d="M24 34 Q50 10 76 34 L76 38 L24 38 Z"
              fill={hairDark}
              opacity="0.2"
            />
          </>
        );

      case "curly":
        return (
          <>
            <circle cx="35" cy="18" r="14" fill={hairColor} />
            <circle cx="33" cy="16" r="10" fill={hairLight} opacity="0.5" />
            <circle cx="50" cy="12" r="15" fill={hairColor} />
            <circle cx="48" cy="10" r="11" fill={hairLight} opacity="0.5" />
            <circle cx="65" cy="18" r="14" fill={hairColor} />
            <circle cx="63" cy="16" r="10" fill={hairLight} opacity="0.5" />
            <circle cx="26" cy="30" r="12" fill={hairColor} />
            <circle cx="24" cy="32" r="8" fill={hairDark} opacity="0.4" />
            <circle cx="74" cy="30" r="12" fill={hairColor} />
            <circle cx="76" cy="32" r="8" fill={hairDark} opacity="0.4" />
            <circle cx="40" cy="28" r="10" fill={hairColor} />
            <circle cx="38" cy="26" r="7" fill={hairLight} opacity="0.4" />
            <circle cx="60" cy="28" r="10" fill={hairColor} />
            <circle cx="62" cy="26" r="7" fill={hairLight} opacity="0.4" />
            {gender === "female" && (
              <>
                <circle cx="30" cy="38" r="8" fill={hairColor} />
                <circle cx="70" cy="38" r="8" fill={hairColor} />
              </>
            )}
          </>
        );

      case "spiky":
        return (
          <>
            <path d="M24 36 L30 12 L42 34 L50 6 L58 34 L70 12 L76 36 Z" fill={hairColor} />
            <path d="M24 36 L30 12 L42 34 L50 6 L58 34 L70 12 L76 36 Z" fill={hairLight} opacity="0.4" transform="translate(-2, -2)" />
            <path d="M24 36 L30 12 L42 34 L50 6 L58 34 L70 12 L76 36 Z" fill={hairDark} opacity="0.2" transform="translate(2, 2)" />
          </>
        );

      case "ponytail":
        if (gender === "female") {
          return (
            <>
              <path
                d="M22 32 Q50 10 78 32 L78 48 L22 48 Z"
                fill={hairColor}
              />
              <path
                d="M22 32 Q50 10 78 32 L78 48 L22 48 Z"
                fill={hairLight}
                opacity="0.5"
              />
              <ellipse cx="78" cy="60" rx="10" ry="25" fill={hairColor} />
              <ellipse cx="76" cy="58" rx="6" ry="20" fill={hairLight} opacity="0.4" />
              <ellipse cx="80" cy="62" rx="5" ry="21" fill={hairDark} opacity="0.3" />
              <circle cx="78" cy="85" r="4" fill={hairLight} opacity="0.6" />
            </>
          );
        }
        return (
          <>
            <path
              d="M24 34 Q50 10 76 34 L76 46 L24 46 Z"
              fill={hairColor}
            />
            <path
              d="M24 34 Q50 10 76 34 L76 46 L24 46 Z"
              fill={hairLight}
              opacity="0.5"
            />
            <ellipse cx="76" cy="58" rx="9" ry="22" fill={hairColor} />
            <ellipse cx="74" cy="56" rx="5" ry="17" fill={hairLight} opacity="0.4" />
            <ellipse cx="78" cy="60" rx="4" ry="18" fill={hairDark} opacity="0.3" />
          </>
        );

      case "braid":
        return (
          <>
            <path
              d="M22 32 Q50 10 78 32 L78 48 L22 48 Z"
              fill={hairColor}
            />
            <path
              d="M22 32 Q50 10 78 32 L78 48 L22 48 Z"
              fill={hairLight}
              opacity="0.5"
            />
            <path
              d="M78 50 Q85 60 82 75 Q79 90 85 100"
              stroke={hairColor}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M78 50 Q85 60 82 75 Q79 90 85 100"
              stroke={hairLight}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
            <circle cx="78" cy="55" r="3" fill={hairDark} opacity="0.3" />
            <circle cx="82" cy="75" r="3" fill={hairDark} opacity="0.3" />
            <circle cx="85" cy="95" r="3" fill={hairDark} opacity="0.3" />
          </>
        );

      case "bun":
        return (
          <>
            <path
              d="M22 32 Q50 10 78 32 L78 48 L22 48 Z"
              fill={hairColor}
            />
            <path
              d="M22 32 Q50 10 78 32 L78 48 L22 48 Z"
              fill={hairLight}
              opacity="0.5"
            />
            <circle cx="78" cy="35" r="12" fill={hairColor} />
            <circle cx="76" cy="33" r="8" fill={hairLight} opacity="0.4" />
            <circle cx="80" cy="37" r="6" fill={hairDark} opacity="0.3" />
            <circle cx="78" cy="35" r="4" fill={hairLight} opacity="0.6" />
          </>
        );

      default:
        if (gender === "female") {
          return (
            <>
              <path
                d="M22 34 Q50 12 78 34 L78 48 L22 48 Z"
                fill={hairColor}
              />
              <path
                d="M22 34 Q50 12 78 34 L78 42 L22 42 Z"
                fill={hairLight}
                opacity="0.6"
              />
              <path
                d="M22 34 Q50 12 78 34 L78 48 L22 48 Z"
                fill={hairDark}
                opacity="0.15"
              />
              <path
                d="M26 38 Q50 26 74 38"
                stroke={hairLight}
                strokeWidth="2"
                fill="none"
                opacity="0.5"
              />
            </>
          );
        }
        return (
          <>
            <path
              d="M24 36 Q50 14 76 36 L76 44 L24 44 Z"
              fill={hairColor}
            />
            <path
              d="M24 36 Q50 14 76 36 L76 40 L24 40 Z"
              fill={hairLight}
              opacity="0.6"
            />
            <path
              d="M24 36 Q50 14 76 36 L76 44 L24 44 Z"
              fill={hairDark}
              opacity="0.15"
            />
          </>
        );
    }
  };

  // Helper function to shade colors
  const shadeColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const FaceShape = () => {
    const skinDark = shadeColor(skin, -20);
    const skinLight = shadeColor(skin, 15);
    
    switch (faceShape) {
      case "oval":
        return (
          <>
            <ellipse cx="50" cy="50" rx={gender === "female" ? 26 : 28} ry={gender === "female" ? 34 : 32} fill={skin} />
            <ellipse cx="50" cy="58" rx="24" ry="22" fill={skinDark} opacity="0.2" />
            <ellipse cx="42" cy="42" rx="9" ry="7" fill={skinLight} opacity="0.4" />
            <ellipse cx="58" cy="42" rx="9" ry="7" fill={skinLight} opacity="0.4" />
            <ellipse cx="50" cy="38" rx="20" ry="8" fill={skinLight} opacity="0.2" />
            {gender === "female" && (
              <ellipse cx="50" cy="45" rx="18" ry="6" fill={skinLight} opacity="0.15" />
            )}
          </>
        );
      case "square":
        return (
          <>
            <rect x="24" y="22" width="52" height="56" rx="10" fill={skin} />
            <ellipse cx="50" cy="58" rx="22" ry="20" fill={skinDark} opacity="0.2" />
            <ellipse cx="42" cy="42" rx="9" ry="7" fill={skinLight} opacity="0.4" />
            <ellipse cx="58" cy="42" rx="9" ry="7" fill={skinLight} opacity="0.4" />
            <ellipse cx="50" cy="38" rx="20" ry="8" fill={skinLight} opacity="0.2" />
          </>
        );
      default:
        return (
          <>
            <circle cx="50" cy="50" r={gender === "female" ? 29 : 30} fill={skin} />
            <ellipse cx="50" cy="58" rx="24" ry="20" fill={skinDark} opacity="0.2" />
            <ellipse cx="42" cy="42" rx="9" ry="7" fill={skinLight} opacity="0.4" />
            <ellipse cx="58" cy="42" rx="9" ry="7" fill={skinLight} opacity="0.4" />
            <ellipse cx="50" cy="38" rx="20" ry="8" fill={skinLight} opacity="0.2" />
            {gender === "female" && (
              <ellipse cx="50" cy="45" rx="18" ry="6" fill={skinLight} opacity="0.15" />
            )}
          </>
        );
    }
  };

  const Headwear = () => {
    if (headWear === "none") return null;
    
    const hwDark = shadeColor(headWearColor, -20);
    const hwLight = shadeColor(headWearColor, 20);

    switch (headWear) {
      case "cap":
        return (
          <>
            {/* Cap dome */}
            <path
              d="M22 32 Q50 8 78 32"
              fill={headWearColor}
            />
            <path
              d="M22 32 Q50 8 78 32"
              fill={hwLight}
              opacity="0.4"
            />
            {/* Cap band */}
            <rect
              x="22"
              y="29"
              width="56"
              height="10"
              fill={headWearColor}
            />
            <rect
              x="22"
              y="29"
              width="56"
              height="3"
              fill={hwDark}
              opacity="0.3"
            />
            {/* Cap brim */}
            <path
              d="M22 39 L78 39 L84 44 L16 44 Z"
              fill={headWearColor}
            />
            <path
              d="M22 39 L78 39 L84 44 L16 44 Z"
              fill={hwLight}
              opacity="0.3"
            />
            <path
              d="M22 39 L78 39 L84 44 L16 44 Z"
              fill={hwDark}
              opacity="0.2"
              transform="translate(0, 2)"
            />
            {/* Cap button */}
            <circle cx="50" cy="32" r="3.5" fill={hwLight} opacity="0.6" />
            <circle cx="50" cy="32" r="2" fill={headWearColor} />
          </>
        );

      case "pagdi":
        return (
          <>
            <ellipse
              cx="50"
              cy="24"
              rx="30"
              ry="16"
              fill={headWearColor}
            />
            <ellipse
              cx="50"
              cy="24"
              rx="30"
              ry="16"
              fill={hwLight}
              opacity="0.3"
            />
            <rect
              x="22"
              y="24"
              width="56"
              height="14"
              fill={headWearColor}
            />
            <path
              d="M28 30 Q50 38 72 30"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M30 26 Q50 20 70 26"
              stroke={hwDark}
              strokeWidth="2"
              fill="none"
            />
            {/* Decorative band */}
            <rect
              x="22"
              y="30"
              width="56"
              height="4"
              fill={hwDark}
              opacity="0.3"
            />
          </>
        );

      case "crown":
        return (
          <>
            <path
              d="M26 36 L32 18 L42 32 L50 12 L58 32 L68 18 L74 36 Z"
              fill={headWearColor}
            />
            <path
              d="M26 36 L32 18 L42 32 L50 12 L58 32 L68 18 L74 36 Z"
              fill={hwLight}
              opacity="0.4"
            />
            <path
              d="M26 36 L32 18 L42 32 L50 12 L58 32 L68 18 L74 36 Z"
              stroke="#FFD700"
              strokeWidth="2.5"
              fill="none"
            />
            <circle cx="50" cy="24" r="4.5" fill="#FFD700" />
            <circle cx="50" cy="24" r="3" fill={hwLight} opacity="0.5" />
            {/* Crown jewels */}
            <circle cx="32" cy="28" r="2" fill="#FFD700" />
            <circle cx="68" cy="28" r="2" fill="#FFD700" />
            <circle cx="50" cy="32" r="2" fill="#FFD700" />
          </>
        );

      case "headband":
        return (
          <>
            <path
              d="M22 34 Q50 30 78 34"
              stroke={headWearColor}
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M22 34 Q50 30 78 34"
              stroke={hwLight}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="22" cy="34" r="4.5" fill={headWearColor} />
            <circle cx="22" cy="34" r="2.5" fill={hwLight} opacity="0.5" />
          </>
        );

      default:
        return null;
    }
  };

  const Accessory = () => {
    if (accessory === "none") return null;

    switch (accessory) {
      case "glasses":
        return (
          <>
            <rect x="32" y="38" width="16" height="12" rx="3" fill="none" stroke="#000" strokeWidth="2" />
            <rect x="52" y="38" width="16" height="12" rx="3" fill="none" stroke="#000" strokeWidth="2" />
            <line x1="48" y1="44" x2="52" y2="44" stroke="#000" strokeWidth="2" />
          </>
        );

      case "earrings":
        return (
          <>
            <circle cx="24" cy="48" r="3" fill={accessoryColor} />
            <circle cx="76" cy="48" r="3" fill={accessoryColor} />
          </>
        );

      case "necklace":
        return (
          <path
            d="M35 85 Q50 95 65 85"
            stroke={accessoryColor}
            strokeWidth="3"
            fill="none"
          />
        );

      default:
        return null;
    }
  };

  const BackgroundPattern = () => {
    if (backgroundPattern === "none") return null;
    
    const patternColor = shadeColor(backgroundColor, -15);
    const patternId = `${backgroundPattern}-${uniqueId.current}`;
    
    switch (backgroundPattern) {
      case "dots":
        return (
          <pattern id={patternId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.5" fill={patternColor} opacity="0.3" />
          </pattern>
        );
      case "stripes":
        return (
          <pattern id={patternId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="10" y2="10" stroke={patternColor} strokeWidth="1" opacity="0.2" />
          </pattern>
        );
      case "circles":
        return (
          <pattern id={patternId} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="6" fill="none" stroke={patternColor} strokeWidth="1" opacity="0.3" />
          </pattern>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={240 * size}
      height={280 * size}
      viewBox="0 0 100 120"
      style={{
        maxWidth: "100%",
        filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.15))",
      }}
    >
      <defs>
        <radialGradient id={`bgGradient-${uniqueId.current}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={backgroundColor} />
          <stop offset="100%" stopColor={shadeColor(backgroundColor, -10)} />
        </radialGradient>
        <linearGradient id={`clothGradient-${uniqueId.current}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={clothColor} />
          <stop offset="100%" stopColor={shadeColor(clothColor, -20)} />
        </linearGradient>
        <BackgroundPattern />
      </defs>
      
      {/* Background circle with gradient */}
      <circle cx="50" cy="50" r="48" fill={`url(#bgGradient-${uniqueId.current})`} />
      
      {/* Background pattern overlay */}
      {backgroundPattern !== "none" && (
        <circle cx="50" cy="50" r="48" fill={`url(#${backgroundPattern}-${uniqueId.current})`} />
      )}
      
      {/* Body/Clothes with gradient */}
      <path
        d="M12 118 L88 118 L78 78 L22 78 Z"
        fill={`url(#clothGradient-${uniqueId.current})`}
      />
      
      {/* Collar with shadow */}
      <path
        d="M35 78 L50 92 L65 78"
        stroke="#fff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M35 78 L50 92 L65 78"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        transform="translate(0, 2)"
      />
      
      {/* Clothes detail */}
      <path
        d="M50 92 L50 118"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />

      {/* Neck with shading */}
      <rect
        x="42"
        y="70"
        width="16"
        height="10"
        fill={skin}
      />
      <rect
        x="42"
        y="70"
        width="16"
        height="4"
        fill={shadeColor(skin, -20)}
        opacity="0.3"
      />
      <rect
        x="44"
        y="70"
        width="4"
        height="10"
        fill={shadeColor(skin, 10)}
        opacity="0.2"
      />

      {/* Face */}
      <FaceShape />

      {/* Hair */}
      <Hair />

      {/* Eyes */}
      <Eyes />
      
      {/* Eyebrows with gender-specific styling */}
      {gender === "female" ? (
        <>
          <path
            d="M38 40 Q44 37 50 40"
            stroke={shadeColor(hairColor, -30)}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M50 40 Q56 37 62 40"
            stroke={shadeColor(hairColor, -30)}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M38 40 Q44 36 50 40"
            stroke={shadeColor(hairColor, -30)}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M50 40 Q56 36 62 40"
            stroke={shadeColor(hairColor, -30)}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Nose with realistic shading */}
      <path
        d="M50 54 L50 59"
        stroke={shadeColor(skin, -25)}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="50"
        cy="59"
        rx="2"
        ry="1.5"
        fill={shadeColor(skin, -20)}
        opacity="0.4"
      />

      {/* Mouth */}
      <Mouth />

      {/* Lips for female avatars */}
      {gender === "female" && (
        <ellipse
          cx="50"
          cy="68"
          rx="8"
          ry="3"
          fill={shadeColor(skin, -10)}
          opacity="0.3"
        />
      )}

      {/* Cheeks with realistic blush */}
      {(emotion === "happy" || emotion === "excited") && (
        <>
          <ellipse cx="37" cy="58" rx="5" ry="4" fill="rgba(255,150,150,0.4)" />
          <ellipse cx="37" cy="58" rx="3" ry="2.5" fill="rgba(255,180,180,0.3)" />
          <ellipse cx="63" cy="58" rx="5" ry="4" fill="rgba(255,150,150,0.4)" />
          <ellipse cx="63" cy="58" rx="3" ry="2.5" fill="rgba(255,180,180,0.3)" />
        </>
      )}

      {/* Headwear */}
      <Headwear />

      {/* Accessories */}
      <Accessory />
    </svg>
  );
};

export default AvatarPreview;

