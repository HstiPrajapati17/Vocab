import usFlag from "../assets/USFlag.webp";
import franceFlag from "../assets/FranceFlag.png";
import germanyFlag from "../assets/GermanyFlag.jpg";
import polandFlag from "../assets/PolandFlag.png";
import chinaFlag from "../assets/ChinaFlag.svg";
import ukFlag from "../assets/UKFlag.svg";
import italyFlag from "../assets/ItalyFlag.svg";
import japanFlag from "../assets/JapanFlag.svg";
import koreaFlag from "../assets/KoreaFlag.svg";
import portugalFlag from "../assets/PortugalFlag.svg";
import spainFlag from "../assets/SpainFlag.svg";
import vietnamFlag from "../assets/VietnamFlag.svg";
import otherFlag from "../assets/more.jpg";

const flagsByCountry = {
  us: usFlag,
  usa: usFlag,
  "united states": usFlag,
  "united states of america": usFlag,
  english: usFlag,
  "american english": usFlag,
  gb: ukFlag,
  uk: ukFlag,
  "united kingdom": ukFlag,
  "british english": ukFlag,
  fr: franceFlag,
  france: franceFlag,
  french: franceFlag,
  de: germanyFlag,
  germany: germanyFlag,
  german: germanyFlag,
  pl: polandFlag,
  poland: polandFlag,
  polish: polandFlag,
  cn: chinaFlag,
  china: chinaFlag,
  chinese: chinaFlag,
  mandarin: chinaFlag,
  it: italyFlag,
  italy: italyFlag,
  italian: italyFlag,
  jp: japanFlag,
  japan: japanFlag,
  japanese: japanFlag,
  kr: koreaFlag,
  korea: koreaFlag,
  "south korea": koreaFlag,
  korean: koreaFlag,
  pt: portugalFlag,
  portugal: portugalFlag,
  portuguese: portugalFlag,
  es: spainFlag,
  spain: spainFlag,
  spanish: spainFlag,
  vn: vietnamFlag,
  vietnam: vietnamFlag,
  vietnamese: vietnamFlag,
  other: otherFlag,
};

const byAssetName = {
  "usflag.webp": usFlag,
  "franceflag.png": franceFlag,
  "germanyflag.jpg": germanyFlag,
  "polandflag.png": polandFlag,
  "chinaflag.svg": chinaFlag,
  "ukflag.svg": ukFlag,
  "italyflag.svg": italyFlag,
  "japanflag.svg": japanFlag,
  "koreaflag.svg": koreaFlag,
  "portugalflag.svg": portugalFlag,
  "spainflag.svg": spainFlag,
  "vietnamflag.svg": vietnamFlag,
};

const normalize = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim()
  .toLowerCase();

export const getLanguageFlag = (name, assetHint) => {
  const imageUrl = String(assetHint || "").trim();
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  const hint = normalize(imageUrl).split(/[\\/]/).pop();
  return byAssetName[hint] || flagsByCountry[normalize(name)] || otherFlag;
};
