import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Badge, Button, ProgressBar, Tab, Nav } from 'react-bootstrap';
import { 
  FaFire, FaStar, FaHeart, FaTrophy, FaMedal,
  FaEdit, FaCheck, FaGlobe, FaCalendar,
  FaChartBar, FaBook, FaCheckCircle, FaVolumeUp
} from 'react-icons/fa';
import { updateUser } from '../api';

const allAchievements = [
  { icon: '🔥', label: '7-Day Streak', desc: 'Practice 7 days in a row', check: (u) => (u.streak || 0) >= 7 },
  { icon: '⭐', label: 'First Lesson', desc: 'Complete your first lesson', check: (u) => (u.completedLessons || []).length >= 1 },
  { icon: '💎', label: '100 XP Club', desc: 'Earn 100 XP total', check: (u) => (u.xp || 0) >= 100 },
  { icon: '🏆', label: 'Top 10', desc: 'Reach top 10 on leaderboard', check: () => false },
  { icon: '🌟', label: 'Perfect Score', desc: 'Get 100% on a lesson', check: () => false },
  { icon: '📚', label: '10 Lessons', desc: 'Complete 10 lessons', check: (u) => (u.completedLessons || []).length >= 10 },
  { icon: '🚀', label: 'Level Up', desc: 'Advance to intermediate', check: (u) => u.level === 'Intermediate' || u.level === 'Advanced' },
  { icon: '🎯', label: 'Goal Setter', desc: 'Set a daily goal', check: (u) => !!u.dailyGoal },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Profile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || 'Learner');
  const [saving, setSaving] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  const completedLessons = user?.completedLessons || [];
  const maxXP = 500;
  const levelProgress = Math.min(Math.round(((user?.xp || 0) / maxXP) * 100), 100);

  const achievements = allAchievements.map(a => ({ ...a, earned: a.check(user) }));

  // Fake weekly data based on xp
  const activityData = weekDays.map((day, i) => ({
    day,
    xp: i < (user?.streak || 0) ? Math.floor(Math.random() * 80) + 10 : 0,
  }));

  // Language alphabets and pronunciation data
  const languageAlphabets = {
    Spanish: [
      { letter: 'A', pronunciation: 'ah', example: 'Amigo (friend)' },
      { letter: 'B', pronunciation: 'beh', example: 'Bueno (good)' },
      { letter: 'C', pronunciation: 'seh', example: 'Casa (house)' },
      { letter: 'D', pronunciation: 'deh', example: 'Día (day)' },
      { letter: 'E', pronunciation: 'eh', example: 'Espero (hope)' },
      { letter: 'F', pronunciation: 'eh-feh', example: 'Familia (family)' },
      { letter: 'G', pronunciation: 'heh', example: 'Gato (cat)' },
      { letter: 'H', pronunciation: 'ah-cheh', example: 'Hola (hello)' },
      { letter: 'I', pronunciation: 'ee', example: 'Igual (equal)' },
      { letter: 'J', pronunciation: 'ho-tah', example: 'Juego (game)' },
      { letter: 'K', pronunciation: 'kah', example: 'Kilo (kilo)' },
      { letter: 'L', pronunciation: 'eh-leh', example: 'Libro (book)' },
      { letter: 'M', pronunciation: 'eh-meh', example: 'Mesa (table)' },
      { letter: 'N', pronunciation: 'eh-neh', example: 'No (no)' },
      { letter: 'Ñ', pronunciation: 'eh-nyeh', example: 'Niño (child)' },
      { letter: 'O', pronunciation: 'oh', example: 'Oro (gold)' },
      { letter: 'P', pronunciation: 'peh', example: 'Perro (dog)' },
      { letter: 'Q', pronunciation: 'koo', example: 'Queso (cheese)' },
      { letter: 'R', pronunciation: 'eh-reh', example: 'Río (river)' },
      { letter: 'S', pronunciation: 'eh-seh', example: 'Sol (sun)' },
      { letter: 'T', pronunciation: 'teh', example: 'Tiempo (time)' },
      { letter: 'U', pronunciation: 'oo', example: 'Uno (one)' },
      { letter: 'V', pronunciation: 'veh', example: 'Vida (life)' },
      { letter: 'W', pronunciation: 'doh-bleh veh', example: 'Wáter (water)' },
      { letter: 'X', pronunciation: 'eh-kees', example: 'Xilófono (xylophone)' },
      { letter: 'Y', pronunciation: 'ee-greh-eh-gah', example: 'Yo (I)' },
      { letter: 'Z', pronunciation: 'seh-tah', example: 'Zapato (shoe)' },
    ],
    French: [
      { letter: 'A', pronunciation: 'ah', example: 'Ami (friend)' },
      { letter: 'B', pronunciation: 'beh', example: 'Bonjour (hello)' },
      { letter: 'C', pronunciation: 'seh', example: 'Chat (cat)' },
      { letter: 'D', pronunciation: 'deh', example: 'Dieu (god)' },
      { letter: 'E', pronunciation: 'uh', example: 'École (school)' },
      { letter: 'F', pronunciation: 'eff', example: 'Famille (family)' },
      { letter: 'G', pronunciation: 'zheh', example: 'Garçon (boy)' },
      { letter: 'H', pronunciation: 'ahsh', example: 'Homme (man)' },
      { letter: 'I', pronunciation: 'ee', example: 'Île (island)' },
      { letter: 'J', pronunciation: 'zhee', example: 'Jour (day)' },
      { letter: 'K', pronunciation: 'kah', example: 'Kilo (kilo)' },
      { letter: 'L', pronunciation: 'ell', example: 'Livre (book)' },
      { letter: 'M', pronunciation: 'em', example: 'Maison (house)' },
      { letter: 'N', pronunciation: 'en', example: 'Non (no)' },
      { letter: 'O', pronunciation: 'oh', example: 'Or (gold)' },
      { letter: 'P', pronunciation: 'peh', example: 'Père (father)' },
      { letter: 'Q', pronunciation: 'koo', example: 'Qui (who)' },
      { letter: 'R', pronunciation: 'air', example: 'Rouge (red)' },
      { letter: 'S', pronunciation: 'ess', example: 'Soir (evening)' },
      { letter: 'T', pronunciation: 'teh', example: 'Temps (time)' },
      { letter: 'U', pronunciation: 'oo', example: 'Un (one)' },
      { letter: 'V', pronunciation: 'veh', example: 'Voiture (car)' },
      { letter: 'W', pronunciation: 'doo-bleh veh', example: 'Week-end (weekend)' },
      { letter: 'X', pronunciation: 'eeks', example: 'Xylophone (xylophone)' },
      { letter: 'Y', pronunciation: 'ee-grek', example: 'Yoga (yoga)' },
      { letter: 'Z', pronunciation: 'zed', example: 'Zéro (zero)' },
    ],
    German: [
      { letter: 'A', pronunciation: 'ah', example: 'Apfel (apple)' },
      { letter: 'B', pronunciation: 'beh', example: 'Buch (book)' },
      { letter: 'C', pronunciation: 'tseh', example: 'Computer (computer)' },
      { letter: 'D', pronunciation: 'deh', example: 'Danke (thank you)' },
      { letter: 'E', pronunciation: 'eh', example: 'Ente (duck)' },
      { letter: 'F', pronunciation: 'eff', example: 'Fisch (fish)' },
      { letter: 'G', pronunciation: 'geh', example: 'Gut (good)' },
      { letter: 'H', pronunciation: 'hah', example: 'Haus (house)' },
      { letter: 'I', pronunciation: 'ee', example: 'Ich (I)' },
      { letter: 'J', pronunciation: 'yot', example: 'Ja (yes)' },
      { letter: 'K', pronunciation: 'kah', example: 'Kind (child)' },
      { letter: 'L', pronunciation: 'ell', example: 'Liebe (love)' },
      { letter: 'M', pronunciation: 'em', example: 'Mann (man)' },
      { letter: 'N', pronunciation: 'en', example: 'Nein (no)' },
      { letter: 'O', pronunciation: 'oh', example: 'Oma (grandma)' },
      { letter: 'P', pronunciation: 'peh', example: 'Pferd (horse)' },
      { letter: 'Q', pronunciation: 'koo', example: 'Quelle (source)' },
      { letter: 'R', pronunciation: 'err', example: 'Rot (red)' },
      { letter: 'S', pronunciation: 'ess', example: 'Sonne (sun)' },
      { letter: 'T', pronunciation: 'teh', example: 'Tisch (table)' },
      { letter: 'U', pronunciation: 'oo', example: 'Uhr (clock)' },
      { letter: 'V', pronunciation: 'fow', example: 'Vater (father)' },
      { letter: 'W', pronunciation: 'veh', example: 'Wasser (water)' },
      { letter: 'X', pronunciation: 'iks', example: 'Xylophon (xylophone)' },
      { letter: 'Y', pronunciation: 'üpsilon', example: 'Yoga (yoga)' },
      { letter: 'Z', pronunciation: 'tset', example: 'Zoo (zoo)' },
      { letter: 'Ä', pronunciation: 'eh', example: 'Ärger (trouble)' },
      { letter: 'Ö', pronunciation: 'ur', example: 'Öl (oil)' },
      { letter: 'Ü', pronunciation: 'oo', example: 'Über (over)' },
      { letter: 'ß', pronunciation: 'ess-tset', example: 'Straße (street)' },
    ],
    Japanese: [
      { letter: 'あ', pronunciation: 'a', example: 'あめ (ame - rain)' },
      { letter: 'い', pronunciation: 'i', example: 'いぬ (inu - dog)' },
      { letter: 'う', pronunciation: 'u', example: 'うま (uma - horse)' },
      { letter: 'え', pronunciation: 'e', example: 'え (e - picture)' },
      { letter: 'お', pronunciation: 'o', example: 'おか (oka - hill)' },
      { letter: 'か', pronunciation: 'ka', example: 'かさ (kasa - umbrella)' },
      { letter: 'き', pronunciation: 'ki', example: 'き (ki - tree)' },
      { letter: 'く', pronunciation: 'ku', example: 'くも (kumo - cloud)' },
      { letter: 'け', pronunciation: 'ke', example: 'け (ke - hair)' },
      { letter: 'こ', pronunciation: 'ko', example: 'こ (ko - child)' },
      { letter: 'さ', pronunciation: 'sa', example: 'さけ (sake - salmon)' },
      { letter: 'し', pronunciation: 'shi', example: 'しお (shio - salt)' },
      { letter: 'す', pronunciation: 'su', example: 'すし (sushi - sushi)' },
      { letter: 'せ', pronunciation: 'se', example: 'せき (seki - cough)' },
      { letter: 'そ', pronunciation: 'so', example: 'そら (sora - sky)' },
      { letter: 'た', pronunciation: 'ta', example: 'たまご (tamago - egg)' },
      { letter: 'ち', pronunciation: 'chi', example: 'ちず (chizu - map)' },
      { letter: 'つ', pronunciation: 'tsu', example: 'つき (tsuki - moon)' },
      { letter: 'て', pronunciation: 'te', example: 'て (te - hand)' },
      { letter: 'と', pronunciation: 'to', example: 'とり (tori - bird)' },
      { letter: 'な', pronunciation: 'na', example: 'なまえ (namae - name)' },
      { letter: 'に', pronunciation: 'ni', example: 'にく (niku - meat)' },
      { letter: 'ぬ', pronunciation: 'nu', example: 'ぬの (nuno - cloth)' },
      { letter: 'ね', pronunciation: 'ne', example: 'ねこ (neko - cat)' },
      { letter: 'の', pronunciation: 'no', example: 'のみ (nomi - drink)' },
      { letter: 'は', pronunciation: 'ha', example: 'はな (hana - flower)' },
      { letter: 'ひ', pronunciation: 'hi', example: 'ひと (hito - person)' },
      { letter: 'ふ', pronunciation: 'fu', example: 'ふね (fune - ship)' },
      { letter: 'へ', pronunciation: 'he', example: 'へや (heya - room)' },
      { letter: 'ほ', pronunciation: 'ho', example: 'ほん (hon - book)' },
      { letter: 'ま', pronunciation: 'ma', example: 'まち (machi - town)' },
      { letter: 'み', pronunciation: 'mi', example: 'みず (mizu - water)' },
      { letter: 'む', pronunciation: 'mu', example: 'むし (mushi - insect)' },
      { letter: 'め', pronunciation: 'me', example: 'め (me - eye)' },
      { letter: 'も', pronunciation: 'mo', example: 'もり (mori - forest)' },
      { letter: 'や', pronunciation: 'ya', example: 'やま (yama - mountain)' },
      { letter: 'ゆ', pronunciation: 'yu', example: 'ゆき (yuki - snow)' },
      { letter: 'よ', pronunciation: 'yo', example: 'よる (yoru - night)' },
      { letter: 'ら', pronunciation: 'ra', example: 'らくご (rakugo - comedy)' },
      { letter: 'り', pronunciation: 'ri', example: 'りんご (ringo - apple)' },
      { letter: 'る', pronunciation: 'ru', example: 'るす (rusu - absence)' },
      { letter: 'れ', pronunciation: 're', example: 'れい (rei - example)' },
      { letter: 'ろ', pronunciation: 'ro', example: 'ろく (roku - six)' },
      { letter: 'わ', pronunciation: 'wa', example: 'わたし (watashi - I)' },
      { letter: 'を', pronunciation: 'wo', example: 'を (wo - particle)' },
      { letter: 'ん', pronunciation: 'n', example: 'にほん (nihon - Japan)' },
    ],
    Hindi: [
      { letter: 'अ', pronunciation: 'a', example: 'अनार (anaar - pomegranate)' },
      { letter: 'आ', pronunciation: 'aa', example: 'आम (aam - mango)' },
      { letter: 'इ', pronunciation: 'i', example: 'इमली (imli - tamarind)' },
      { letter: 'ई', pronunciation: 'ee', example: 'ईख (eekh - sugarcane)' },
      { letter: 'उ', pronunciation: 'u', example: 'उल्लू (ullu - owl)' },
      { letter: 'ऊ', pronunciation: 'oo', example: 'ऊँट (oot - camel)' },
      { letter: 'ए', pronunciation: 'e', example: 'एक (ek - one)' },
      { letter: 'ऐ', pronunciation: 'ai', example: 'ऐनक (ainak - glasses)' },
      { letter: 'ओ', pronunciation: 'o', example: 'ओखल (okhal - mortar)' },
      { letter: 'औ', pronunciation: 'au', example: 'औरत (aurat - woman)' },
      { letter: 'अं', pronunciation: 'an', example: 'अंगूर (angoor - grape)' },
      { letter: 'अः', pronunciation: 'ah', example: 'अः (ah - visarga)' },
      { letter: 'क', pronunciation: 'ka', example: 'कमल (kamal - lotus)' },
      { letter: 'ख', pronunciation: 'kha', example: 'खटिया (khatiya - bed)' },
      { letter: 'ग', pronunciation: 'ga', example: 'गाय (gaay - cow)' },
      { letter: 'घ', pronunciation: 'gha', example: 'घड़ी (ghadi - clock)' },
      { letter: 'ङ', pronunciation: 'nga', example: 'ङ (nga - nasal)' },
      { letter: 'च', pronunciation: 'cha', example: 'चाय (chai - tea)' },
      { letter: 'छ', pronunciation: 'chha', example: 'छड़ी (chhadi - stick)' },
      { letter: 'ज', pronunciation: 'ja', example: 'जल (jal - water)' },
      { letter: 'झ', pronunciation: 'jha', example: 'झाड़ू (jhaadu - broom)' },
      { letter: 'ञ', pronunciation: 'nya', example: 'ञ (nya - nasal)' },
      { letter: 'ट', pronunciation: 'ta', example: 'टमाटर (tamatar - tomato)' },
      { letter: 'ठ', pronunciation: 'tha', example: 'ठंडा (thanda - cold)' },
      { letter: 'ड', pronunciation: 'da', example: 'डर (dar - fear)' },
      { letter: 'ढ', pronunciation: 'dha', example: 'ढोल (dhol - drum)' },
      { letter: 'ण', pronunciation: 'na', example: 'ण (na - nasal)' },
      { letter: 'त', pronunciation: 'ta', example: 'तारा (taara - star)' },
      { letter: 'थ', pronunciation: 'tha', example: 'थैला (thaila - bag)' },
      { letter: 'द', pronunciation: 'da', example: 'दरवाज़ा (darwaza - door)' },
      { letter: 'ध', pronunciation: 'dha', example: 'धन (dhan - money)' },
      { letter: 'न', pronunciation: 'na', example: 'नमक (namak - salt)' },
      { letter: 'प', pronunciation: 'pa', example: 'पानी (paani - water)' },
      { letter: 'फ', pronunciation: 'pha', example: 'फल (phal - fruit)' },
      { letter: 'ब', pronunciation: 'ba', example: 'बाजार (bazaar - market)' },
      { letter: 'भ', pronunciation: 'bha', example: 'भाई (bhai - brother)' },
      { letter: 'म', pronunciation: 'ma', example: 'मकान (makaan - house)' },
      { letter: 'य', pronunciation: 'ya', example: 'यार (yaar - friend)' },
      { letter: 'र', pronunciation: 'ra', example: 'रोटी (roti - bread)' },
      { letter: 'ल', pronunciation: 'la', example: 'लड़का (ladka - boy)' },
      { letter: 'व', pronunciation: 'va', example: 'वन (van - forest)' },
      { letter: 'श', pronunciation: 'sha', example: 'शेर (sher - lion)' },
      { letter: 'ष', pronunciation: 'ssha', example: 'षट्कोण (shatkona - hexagon)' },
      { letter: 'स', pronunciation: 'sa', example: 'सूरज (sooraj - sun)' },
      { letter: 'ह', pronunciation: 'ha', example: 'हाथi (haath - hand)' },
    ],
    Portuguese: [
      { letter: 'A', pronunciation: 'ah', example: 'Amigo (friend)' },
      { letter: 'B', pronunciation: 'beh', example: 'Bom (good)' },
      { letter: 'C', pronunciation: 'seh', example: 'Casa (house)' },
      { letter: 'D', pronunciation: 'deh', example: 'Dia (day)' },
      { letter: 'E', pronunciation: 'eh', example: 'Espero (hope)' },
      { letter: 'F', pronunciation: 'eh-fee', example: 'Família (family)' },
      { letter: 'G', pronunciation: 'zheh', example: 'Gato (cat)' },
      { letter: 'H', pronunciation: 'ah-gah', example: 'Homem (man)' },
      { letter: 'I', pronunciation: 'ee', example: 'Igual (equal)' },
      { letter: 'J', pronunciation: 'zhoh-tah', example: 'Jogo (game)' },
      { letter: 'K', pronunciation: 'kah', example: 'Kilo (kilo)' },
      { letter: 'L', pronunciation: 'eh-lee', example: 'Livro (book)' },
      { letter: 'M', pronunciation: 'eh-meh', example: 'Mesa (table)' },
      { letter: 'N', pronunciation: 'eh-neh', example: 'Não (no)' },
      { letter: 'O', pronunciation: 'oh', example: 'Ouro (gold)' },
      { letter: 'P', pronunciation: 'peh', example: 'Pão (bread)' },
      { letter: 'Q', pronunciation: 'keh', example: 'Queijo (cheese)' },
      { letter: 'R', pronunciation: 'eh-hah', example: 'Rio (river)' },
      { letter: 'S', pronunciation: 'eh-ss', example: 'Sol (sun)' },
      { letter: 'T', pronunciation: 'teh', example: 'Tempo (time)' },
      { letter: 'U', pronunciation: 'oo', example: 'Um (one)' },
      { letter: 'V', pronunciation: 'veh', example: 'Vida (life)' },
      { letter: 'W', pronunciation: 'doh-bleh veh', example: 'Wagner (Wagner)' },
      { letter: 'X', pronunciation: 'sheesh', example: 'Xícara (cup)' },
      { letter: 'Y', pronunciation: 'ee-greh-eh-gah', example: 'Ioga (yoga)' },
      { letter: 'Z', pronunciation: 'zeh', example: 'Zapato (shoe)' },
      { letter: 'Ç', pronunciation: 'seh', example: 'Coração (heart)' },
      { letter: 'Ã', pronunciation: 'ahn', example: 'Mãe (mother)' },
      { letter: 'Õ', pronunciation: 'ohn', example: 'Pão (bread)' },
      { letter: 'Á', pronunciation: 'ah', example: 'Água (water)' },
      { letter: 'É', pronunciation: 'eh', example: 'É (is)' },
      { letter: 'Í', pronunciation: 'ee', example: 'Índio (Indian)' },
      { letter: 'Ó', pronunciation: 'oh', example: 'Óleo (oil)' },
      { letter: 'Ú', pronunciation: 'oo', example: 'Útil (useful)' },
    ],
    Italian: [
      { letter: 'A', pronunciation: 'ah', example: 'Amico (friend)' },
      { letter: 'B', pronunciation: 'bee', example: 'Buono (good)' },
      { letter: 'C', pronunciation: 'chee', example: 'Casa (house)' },
      { letter: 'D', pronunciation: 'dee', example: 'Dieci (ten)' },
      { letter: 'E', pronunciation: 'eh', example: 'Erba (grass)' },
      { letter: 'F', pronunciation: 'eff-eh', example: 'Famiglia (family)' },
      { letter: 'G', pronunciation: 'jee', example: 'Gatto (cat)' },
      { letter: 'H', pronunciation: 'ahk-kah', example: 'Hotel (hotel)' },
      { letter: 'I', pronunciation: 'ee', example: 'Isola (island)' },
      { letter: 'J', pronunciation: 'ee-lon-gah', example: 'Jazz (jazz)' },
      { letter: 'K', pronunciation: 'kahp-pah', example: 'Kilo (kilo)' },
      { letter: 'L', pronunciation: 'ehl-leh', example: 'Libro (book)' },
      { letter: 'M', pronunciation: 'ehm-meh', example: 'Mela (apple)' },
      { letter: 'N', pronunciation: 'ehn-neh', example: 'Non (no)' },
      { letter: 'O', pronunciation: 'oh', example: 'Oro (gold)' },
      { letter: 'P', pronunciation: 'pee', example: 'Pane (bread)' },
      { letter: 'Q', pronunciation: 'koo', example: 'Quattro (four)' },
      { letter: 'R', pronunciation: 'ehr-reh', example: 'Rosa (rose)' },
      { letter: 'S', pronunciation: 'ehs-seh', example: 'Sole (sun)' },
      { letter: 'T', pronunciation: 'tee', example: 'Tempo (time)' },
      { letter: 'U', pronunciation: 'oo', example: 'Uva (grape)' },
      { letter: 'V', pronunciation: 'voo', example: 'Vino (wine)' },
      { letter: 'W', pronunciation: 'doh-bleh voo', example: 'Water (water)' },
      { letter: 'X', pronunciation: 'eeks', example: 'Xilofono (xylophone)' },
      { letter: 'Y', pronunciation: 'eep-see-lon', example: 'Yoga (yoga)' },
      { letter: 'Z', pronunciation: 'tseh-tah', example: 'Zucchero (sugar)' },
    ],
    Korean: [
      { letter: 'ㄱ', pronunciation: 'g/k', example: '가 (ga - go)' },
      { letter: 'ㄴ', pronunciation: 'n', example: '나 (na - I)' },
      { letter: 'ㄷ', pronunciation: 'd/t', example: '다 (da - all)' },
      { letter: 'ㄹ', pronunciation: 'r/l', example: '라 (ra - music)' },
      { letter: 'ㅁ', pronunciation: 'm', example: '마 (ma - horse)' },
      { letter: 'ㅂ', pronunciation: 'b/p', example: '바 (ba - bar)' },
      { letter: 'ㅅ', pronunciation: 's', example: '사 (sa - person)' },
      { letter: 'ㅇ', pronunciation: 'ng/-', example: '아 (a - child)' },
      { letter: 'ㅈ', pronunciation: 'j', example: '자 (ja - self)' },
      { letter: 'ㅊ', pronunciation: 'ch', example: '차 (cha - tea)' },
      { letter: 'ㅋ', pronunciation: 'k', example: '카 (ka - card)' },
      { letter: 'ㅌ', pronunciation: 't', example: '타 (ta - ride)' },
      { letter: 'ㅍ', pronunciation: 'p', example: '파 (pa - green onion)' },
      { letter: 'ㅎ', pronunciation: 'h', example: '하 (ha - do)' },
      { letter: 'ㅏ', pronunciation: 'a', example: '아 (a - child)' },
      { letter: 'ㅓ', pronunciation: 'eo', example: '어 (eo - fish)' },
      { letter: 'ㅗ', pronunciation: 'o', example: '오 (o - five)' },
      { letter: 'ㅜ', pronunciation: 'u', example: '우 (u - rain)' },
      { letter: 'ㅡ', pronunciation: 'eu', example: '으 (eu - upper)' },
      { letter: 'ㅣ', pronunciation: 'i', example: '이 (i - teeth)' },
      { letter: 'ㅐ', pronunciation: 'ae', example: '애 (ae - love)' },
      { letter: 'ㅔ', pronunciation: 'e', example: '에 (e - yes)' },
      { letter: 'ㅑ', pronunciation: 'ya', example: '야 (ya - night)' },
      { letter: 'ㅕ', pronunciation: 'yeo', example: '여 (yeo - woman)' },
      { letter: 'ㅛ', pronunciation: 'yo', example: '요 (yo - good)' },
      { letter: 'ㅠ', pronunciation: 'yu', example: '유 (yu - milk)' },
      { letter: 'ㅒ', pronunciation: 'yae', example: '얘 (yae - pretty)' },
      { letter: 'ㅖ', pronunciation: 'ye', example: '예 (ye - yes)' },
      { letter: 'ㅘ', pronunciation: 'wa', example: '와 (wa - come)' },
      { letter: 'ㅙ', pronunciation: 'wae', example: '왜 (wae - why)' },
      { letter: 'ㅚ', pronunciation: 'oe', example: '외 (oe - outside)' },
      { letter: 'ㅝ', pronunciation: 'wo', example: '워 (wo - work)' },
      { letter: 'ㅞ', pronunciation: 'we', example: '웨 (we - why)' },
      { letter: 'ㅟ', pronunciation: 'wi', example: '위 (wi - stomach)' },
      { letter: 'ㅢ', pronunciation: 'ui', example: '의 (ui - clothes)' },
    ],
    Russian: [
      { letter: 'А', pronunciation: 'ah', example: 'Анна (Anna)' },
      { letter: 'Б', pronunciation: 'b', example: 'Борщ (borscht)' },
      { letter: 'В', pronunciation: 'v', example: 'Вода (voda - water)' },
      { letter: 'Г', pronunciation: 'g', example: 'Город (gorod - city)' },
      { letter: 'Д', pronunciation: 'd', example: 'Дом (dom - house)' },
      { letter: 'Е', pronunciation: 'ye', example: 'Еда (yeda - food)' },
      { letter: 'Ё', pronunciation: 'yo', example: 'Ёлка (yolka - fir tree)' },
      { letter: 'Ж', pronunciation: 'zh', example: 'Жизнь (zhizn - life)' },
      { letter: 'З', pronunciation: 'z', example: 'Земля (zemlya - earth)' },
      { letter: 'И', pronunciation: 'ee', example: 'Имя (imya - name)' },
      { letter: 'Й', pronunciation: 'y', example: 'Мой (moy - my)' },
      { letter: 'К', pronunciation: 'k', example: 'Книга (kniga - book)' },
      { letter: 'Л', pronunciation: 'l', example: 'Луна (luna - moon)' },
      { letter: 'М', pronunciation: 'm', example: 'Мама (mama - mom)' },
      { letter: 'Н', pronunciation: 'n', example: 'Нет (net - no)' },
      { letter: 'О', pronunciation: 'oh', example: 'Око (oko - eye)' },
      { letter: 'П', pronunciation: 'p', example: 'Папа (papa - dad)' },
      { letter: 'Р', pronunciation: 'r', example: 'Рука (ruka - hand)' },
      { letter: 'С', pronunciation: 's', example: 'Солнце (solntse - sun)' },
      { letter: 'Т', pronunciation: 't', example: 'Ты (ty - you)' },
      { letter: 'У', pronunciation: 'oo', example: 'Ухо (ukho - ear)' },
      { letter: 'Ф', pronunciation: 'f', example: 'Флаг (flag - flag)' },
      { letter: 'Х', pronunciation: 'kh', example: 'Хлеб (khleb - bread)' },
      { letter: 'Ц', pronunciation: 'ts', example: 'Цвет (tsvet - color)' },
      { letter: 'Ч', pronunciation: 'ch', example: 'Чай (chai - tea)' },
      { letter: 'Ш', pronunciation: 'sh', example: 'Школа (shkola - school)' },
      { letter: 'Щ', pronunciation: 'shch', example: 'Щука (shchuka - pike)' },
      { letter: 'Ъ', pronunciation: 'hard sign', example: 'Подъезд (podyezd - entrance)' },
      { letter: 'Ы', pronunciation: 'i (back)', example: 'Мы (my - we)' },
      { letter: 'Ь', pronunciation: 'soft sign', example: 'Мать (mat - mother)' },
      { letter: 'Э', pronunciation: 'eh', example: 'Этаж (etazh - floor)' },
      { letter: 'Ю', pronunciation: 'yoo', example: 'Юг (yug - south)' },
      { letter: 'Я', pronunciation: 'ya', example: 'Яблоко (yabloko - apple)' },
    ],
    Chinese: [
      { letter: '一', pronunciation: 'yī', example: '一 (one)' },
      { letter: '二', pronunciation: 'èr', example: '二 (two)' },
      { letter: '三', pronunciation: 'sān', example: '三 (three)' },
      { letter: '四', pronunciation: 'sì', example: '四 (four)' },
      { letter: '五', pronunciation: 'wǔ', example: '五 (five)' },
      { letter: '六', pronunciation: 'liù', example: '六 (six)' },
      { letter: '七', pronunciation: 'qī', example: '七 (seven)' },
      { letter: '八', pronunciation: 'bā', example: '八 (eight)' },
      { letter: '九', pronunciation: 'jiǔ', example: '九 (nine)' },
      { letter: '十', pronunciation: 'shí', example: '十 (ten)' },
      { letter: '人', pronunciation: 'rén', example: '人 (person)' },
      { letter: '大', pronunciation: 'dà', example: '大 (big)' },
      { letter: '小', pronunciation: 'xiǎo', example: '小 (small)' },
      { letter: '水', pronunciation: 'shuǐ', example: '水 (water)' },
      { letter: '火', pronunciation: 'huǒ', example: '火 (fire)' },
      { letter: '山', pronunciation: 'shān', example: '山 (mountain)' },
      { letter: '日', pronunciation: 'rì', example: '日 (sun/day)' },
      { letter: '月', pronunciation: 'yuè', example: '月 (moon/month)' },
      { letter: '天', pronunciation: 'tiān', example: '天 (sky/day)' },
      { letter: '地', pronunciation: 'dì', example: '地 (earth/ground)' },
      { letter: '爱', pronunciation: 'ài', example: '爱 (love)' },
      { letter: '好', pronunciation: 'hǎo', example: '好 (good)' },
      { letter: '我', pronunciation: 'wǒ', example: '我 (I/me)' },
      { letter: '你', pronunciation: 'nǐ', example: '你 (you)' },
      { letter: '他', pronunciation: 'tā', example: '他 (he)' },
      { letter: '她', pronunciation: 'tā', example: '她 (she)' },
      { letter: '吃', pronunciation: 'chī', example: '吃 (eat)' },
      { letter: '喝', pronunciation: 'hē', example: '喝 (drink)' },
      { letter: '看', pronunciation: 'kàn', example: '看 (look/see)' },
      { letter: '听', pronunciation: 'tīng', example: '听 (listen)' },
      { letter: '说', pronunciation: 'shuō', example: '说 (speak)' },
      { letter: '读', pronunciation: 'dú', example: '读 (read)' },
      { letter: '写', pronunciation: 'xiě', example: '写 (write)' },
      { letter: '学', pronunciation: 'xué', example: '学 (learn/study)' },
      { letter: '习', pronunciation: 'xí', example: '习 (practice)' },
    ],
    Arabic: [
      { letter: 'ا', pronunciation: 'alif', example: 'أب (ab - father)' },
      { letter: 'ب', pronunciation: 'ba', example: 'بيت (bayt - house)' },
      { letter: 'ت', pronunciation: 'ta', example: 'كتاب (kitab - book)' },
      { letter: 'ث', pronunciation: 'tha', example: 'ثلاثة (thalatha - three)' },
      { letter: 'ج', pronunciation: 'jim', example: 'جمل (jamal - camel)' },
      { letter: 'ح', pronunciation: 'ha', example: 'حصان (hisan - horse)' },
      { letter: 'خ', pronunciation: 'kha', example: 'خبز (khubz - bread)' },
      { letter: 'د', pronunciation: 'dal', example: 'درس (dars - lesson)'},
      { letter: 'ذ', pronunciation: 'dhal', example: 'ذهب (dhahab - gold)' },
      { letter: 'ر', pronunciation: 'ra', example: 'رجل (rajul - man)' },
      { letter: 'ز', pronunciation: 'zay', example: 'زهرة (zahra - flower)' },
      { letter: 'س', pronunciation: 'sin', example: 'سماء (sama - sky)' },
      { letter: 'ش', pronunciation: 'shin', example: 'شمس (shams - sun)' },
      { letter: 'ص', pronunciation: 'sad', example: 'صديق (sadiq - friend)' },
      { letter: 'ض', pronunciation: 'dad', example: 'ضوء (daw - light)' },
      { letter: 'ط', pronunciation: 'ta', example: 'طائر (tair - bird)' },
      { letter: 'ظ', pronunciation: 'dha', example: 'ظرف (dhurf - envelope)' },
      { letter: 'ع', pronunciation: 'ain', example: 'عين (ain - eye)' },
      { letter: 'غ', pronunciation: 'ghain', example: 'غرب (gharb - west)' },
      { letter: 'ف', pronunciation: 'fa', example: 'فاكهة (fakha - fruit)' },
      { letter: 'ق', pronunciation: 'qaf', example: 'قلب (qalb - heart)' },
      { letter: 'ك', pronunciation: 'kaf', example: 'كتاب (kitab - book)' },
      { letter: 'ل', pronunciation: 'lam', example: 'ليمون (laymun - lemon)' },
      { letter: 'م', pronunciation: 'mim', example: 'ماء (ma - water)' },
      { letter: 'ن', pronunciation: 'nun', example: 'نور (nur - light)' },
      { letter: 'ه', pronunciation: 'ha', example: 'هلال (hilal - crescent)' },
      { letter: 'و', pronunciation: 'waw', example: 'وردة (warda - rose)' },
      { letter: 'ي', pronunciation: 'ya', example: 'يد (yad - hand)' },
    ],
    Dutch: [
      { letter: 'A', pronunciation: 'ah', example: 'Aardbei (strawberry)' },
      { letter: 'B', pronunciation: 'beh', example: 'Boek (book)' },
      { letter: 'C', pronunciation: 'seh', example: 'Computer (computer)' },
      { letter: 'D', pronunciation: 'deh', example: 'Dank (thank)' },
      { letter: 'E', pronunciation: 'eh', example: 'Eend (duck)' },
      { letter: 'F', pronunciation: 'eff', example: 'Familie (family)' },
      { letter: 'G', pronunciation: 'kh', example: 'Goed (good)' },
      { letter: 'H', pronunciation: 'hah', example: 'Huis (house)' },
      { letter: 'I', pronunciation: 'ee', example: 'Ijs (ice cream)' },
      { letter: 'J', pronunciation: 'yay', example: 'Ja (yes)' },
      { letter: 'K', pronunciation: 'kah', example: 'Kat (cat)' },
      { letter: 'L', pronunciation: 'ell', example: 'Lief (love)' },
      { letter: 'M', pronunciation: 'em', example: 'Man (man)' },
      { letter: 'N', pronunciation: 'en', example: 'Nee (no)' },
      { letter: 'O', pronunciation: 'oh', example: 'Oma (grandma)' },
      { letter: 'P', pronunciation: 'peh', example: 'Paard (horse)' },
      { letter: 'Q', pronunciation: 'koo', example: 'Quiz (quiz)' },
      { letter: 'R', pronunciation: 'err', example: 'Rood (red)' },
      { letter: 'S', pronunciation: 'ess', example: 'Schoon (clean)' },
      { letter: 'T', pronunciation: 'teh', example: 'Tafel (table)' },
      { letter: 'U', pronunciation: 'oo', example: 'Uur (hour)' },
      { letter: 'V', pronunciation: 'veh', example: 'Vader (father)' },
      { letter: 'W', pronunciation: 'veh', example: 'Water (water)' },
      { letter: 'X', pronunciation: 'eeks', example: 'Xylofoon (xylophone)' },
      { letter: 'Y', pronunciation: 'ee', example: 'Yoghurt (yogurt)' },
      { letter: 'Z', pronunciation: 'zet', example: 'Zon (sun)' },
      { letter: 'IJ', pronunciation: 'ay', example: 'Ijs (ice cream)' },
      { letter: 'AA', pronunciation: 'ah', example: 'Aap (monkey)' },
      { letter: 'EE', pronunciation: 'eh', example: 'Eend (duck)' },
      { letter: 'OE', pronunciation: 'oo', example: 'Boek (book)' },
      { letter: 'UU', pronunciation: 'oo', example: 'Uur (hour)' },
    ],
  };

  const currentAlphabets = languageAlphabets[user?.language] || languageAlphabets.Spanish;

  const speakLetter = (letter, pronunciation) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${letter} - ${pronunciation}`);
      utterance.lang = user?.language === 'Spanish' ? 'es-ES' : 
                        user?.language === 'French' ? 'fr-FR' :
                        user?.language === 'German' ? 'de-DE' :
                        user?.language === 'Japanese' ? 'ja-JP' :
                        user?.language === 'Hindi' ? 'hi-IN' :
                        user?.language === 'Portuguese' ? 'pt-BR' :
                        user?.language === 'Italian' ? 'it-IT' :
                        user?.language === 'Korean' ? 'ko-KR' :
                        user?.language === 'Russian' ? 'ru-RU' :
                        user?.language === 'Chinese' ? 'zh-CN' :
                        user?.language === 'Arabic' ? 'ar-SA' :
                        user?.language === 'Dutch' ? 'nl-NL' : 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveName = async () => {
    if (!displayName.trim() || !user?.id) { setEditing(false); return; }
    setSaving(true);
    try {
      const updated = await updateUser(user.id, { name: displayName.trim() });
      refreshUser(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  return (
    <div className="h_profile_inner">
        <Row className="g-4">
          {/* Profile Card */}
          <Col xl={8}>
            <Card className="h_profile_card text-center border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <div className="h_profile_avatar_wrap mb-3">
                  <div className="h_profile_avatar">{user?.avatar || '🧑'}</div>
                </div>

                {editing ? (
                  <div className="mb-3 d-flex gap-2 justify-content-center">
                    <input
                      className="h_edit_name_input text-center"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      autoFocus
                    />
                    <Button size="sm" variant="success" onClick={handleSaveName} disabled={saving}>
                      {saving ? '...' : 'Save'}
                    </Button>
                  </div>
                ) : (
                  <h4 className="fw-bold mb-1 d-flex align-items-center justify-content-center gap-2">
                    {displayName}
                    <FaEdit className="text-muted h_edit_name_icon" onClick={() => setEditing(true)} style={{ cursor: 'pointer' }} />
                  </h4>
                )}

                <div className="text-muted small mb-3">{user?.email || ''}</div>

                <Badge className="h_lang_badge mb-4">
                  <FaGlobe className="me-1" /> Learning {user?.language || 'Spanish'}
                </Badge>

                <div className="h_level_section mb-4">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold">Level: {user?.level || 'Beginner'}</span>
                    <span className="text-muted">{user?.xp || 0}/{maxXP} XP</span>
                  </div>
                  <ProgressBar now={levelProgress} className="h_level_bar" />
                </div>

                <Row className="g-2 text-center">
                  <Col xs={4}>
                    <div className="h_pstat">
                      <FaFire className="h_icon_fire" />
                      <div className="h_pstat_val fw-bold">{user?.streak || 0}</div>
                      <div className="h_pstat_lbl small text-muted">Streak</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="h_pstat">
                      <FaStar className="h_icon_xp" />
                      <div className="h_pstat_val fw-bold">{user?.xp || 0}</div>
                      <div className="h_pstat_lbl small text-muted">Total XP</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="h_pstat">
                      <FaTrophy className="text-warning" />
                      <div className="h_pstat_val fw-bold">#{user?.xp >= 300 ? 2 : user?.xp >= 100 ? 5 : 10}</div>
                      <div className="h_pstat_lbl small text-muted">Rank</div>
                    </div>
                  </Col>
                </Row>

                <hr className="my-3" />

                <Row className="g-2 text-center">
                  <Col xs={6}>
                    <div className="h_pstat">
                      <FaBook className="text-primary" />
                      <div className="h_pstat_val fw-bold">{completedLessons.length}</div>
                      <div className="h_pstat_lbl small text-muted">Lessons Done</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="h_pstat">
                      <FaCalendar className="text-info" />
                      <div className="h_pstat_val fw-bold">{user?.streak || 0}</div>
                      <div className="h_pstat_lbl small text-muted">Active Days</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm h_profile_card">
              <Card.Body className="p-3 text-center">
                <h6 className="fw-bold mb-2">Hearts</h6>
                <div className="h_hearts_row d-flex justify-content-center gap-2 mb-2">
                  {Array(5).fill(0).map((_, i) => (
                    <FaHeart key={i} className={i < (user?.hearts ?? 5) ? 'h_icon_heart' : 'h_icon_heart_empty'} />
                  ))}
                </div>
                <p className="text-muted small mb-2">
                  {(user?.hearts ?? 5) === 5 ? 'Fully charged' : `${user?.hearts ?? 0} hearts remaining`}
                </p>
                <Button size="sm" variant="outline-danger" className="w-100" onClick={() => navigate('dashboard')}>
                  Practice to Restore
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Alphabet Panel */}
          <Col xl={4}>
            <Card className="h_profile_card border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FaVolumeUp /> {user?.language || 'Spanish'} Alphabet
                </h6>
                <div className="h_alphabet_grid">
                  {currentAlphabets.map((item, index) => (
                    <button
                      key={index}
                      className={`h_alphabet_btn ${selectedLetter === index ? 'h_alphabet_selected' : ''}`}
                      onClick={() => {
                        setSelectedLetter(index);
                        speakLetter(item.letter, item.pronunciation);
                      }}
                    >
                      <span className="h_alphabet_letter">{item.letter}</span>
                      <span className="h_alphabet_pronunciation">{item.pronunciation}</span>
                    </button>
                  ))}
                </div>
                {selectedLetter !== null && (
                  <div className="h_alphabet_detail mt-3 p-3 bg-light rounded">
                    <div className="h_alphabet_detail_letter">{currentAlphabets[selectedLetter].letter}</div>
                    <div className="h_alphabet_detail_pronunciation">{currentAlphabets[selectedLetter].pronunciation}</div>
                    <div className="h_alphabet_detail_example">{currentAlphabets[selectedLetter].example}</div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Content */}
          <Col xl={12}>
            <Tab.Container defaultActiveKey="activity">
              <Nav variant="tabs" className="h_profile_tabs mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="activity" className="h_profile_tab">
                    <FaChartBar className="me-1" /> Activity
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="achievements" className="h_profile_tab">
                    <FaMedal className="me-1" /> Achievements
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="history" className="h_profile_tab">
                    <FaBook className="me-1" /> History
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                {/* Activity */}
                <Tab.Pane eventKey="activity">
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h6 className="fw-bold mb-4">Weekly XP Activity</h6>
                      <div className="h_activity_chart">
                        {activityData.map((d, i) => (
                          <div key={i} className="h_activity_bar_col text-center">
                            <div className="h_bar_wrap">
                              <div className="h_bar_fill" style={{ height: `${(d.xp / 100) * 100}%` }}></div>
                            </div>
                            <div className="h_bar_label small text-muted mt-1">{d.day}</div>
                            <div className="h_bar_xp small fw-semibold">{d.xp}</div>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>

                  <Row className="g-3">
                    {[
                      { label: 'Total XP', value: user?.xp || 0, icon: <FaStar className="h_icon_xp" />, change: 'Earned' },
                      { label: 'Best Streak', value: `${user?.streak || 0} days`, icon: <FaFire className="h_icon_fire" />, change: user?.streak > 0 ? 'Active' : 'Start!' },
                      { label: 'Lessons Done', value: completedLessons.length, icon: <FaCheckCircle style={{ color: 'var(--success)' }} />, change: `${completedLessons.length} total` },
                    ].map((s, i) => (
                      <Col xs={12} sm={4} key={i}>
                        <Card className="h_summary_card border-0 shadow-sm text-center">
                          <Card.Body className="p-3">
                            <div className="mb-1">{s.icon}</div>
                            <div className="fw-bold fs-5">{s.value}</div>
                            <div className="text-muted small">{s.label}</div>
                            <Badge bg="light" text="success" className="mt-1 small">{s.change}</Badge>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>

                {/* Achievements */}
                <Tab.Pane eventKey="achievements">
                  <Row className="g-3">
                    {achievements.map((a, i) => (
                      <Col xs={6} md={3} key={i}>
                        <Card className={`h_achievement_card text-center border-0 shadow-sm ${!a.earned ? 'h_achievement_locked' : ''}`}>
                          <Card.Body className="p-3">
                            <div className="h_achievement_big_icon mb-2">{a.icon}</div>
                            <div className="fw-bold small">{a.label}</div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>{a.desc}</div>
                            {a.earned && <FaCheck className="text-success mt-1" />}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>

                {/* History */}
                <Tab.Pane eventKey="history">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-0">
                      {completedLessons.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <FaBook size={32} className="mb-2" />
                          <p>No lessons completed yet. Start learning!</p>
                          <Button size="sm" className="h_btn_get_started" onClick={() => navigate('dashboard')}>
                            Go to Dashboard
                          </Button>
                        </div>
                      ) : (
                        completedLessons.map((lessonId, i) => (
                          <div key={i} className="h_history_row d-flex align-items-center gap-3 p-3">
                            <div className="h_history_icon">
                              <FaBook className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-semibold">Lesson {lessonId}</div>
                              <div className="text-muted small">Completed</div>
                            </div>
                            <Badge className="h_xp_earned">+10 XP</Badge>
                          </div>
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
    </div>
  );
};

export default Profile;
