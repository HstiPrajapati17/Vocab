import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { FaVolumeUp } from 'react-icons/fa';
import { useApp } from '../App';

export default function Letters() {
    const { user, refreshUser } = useApp();
    const [selectedLetter, setSelectedLetter] = useState(null);

    // Language alphabets and pronunciation data
    const languageAlphabets = {
  English: [
    { letter: 'A', pronunciation: 'ay', example: 'Apple' },
    { letter: 'B', pronunciation: 'bee', example: 'Ball' },
    { letter: 'C', pronunciation: 'see', example: 'Cat' },
    { letter: 'D', pronunciation: 'dee', example: 'Dog' },
    { letter: 'E', pronunciation: 'ee', example: 'Egg' },
    { letter: 'F', pronunciation: 'eff', example: 'Fish' },
    { letter: 'G', pronunciation: 'gee', example: 'Goat' },
    { letter: 'H', pronunciation: 'aych', example: 'Hat' },
    { letter: 'I', pronunciation: 'eye', example: 'Ice' },
    { letter: 'J', pronunciation: 'jay', example: 'Juice' },
    { letter: 'K', pronunciation: 'kay', example: 'Kite' },
    { letter: 'L', pronunciation: 'ell', example: 'Lamp' },
    { letter: 'M', pronunciation: 'em', example: 'Moon' },
    { letter: 'N', pronunciation: 'en', example: 'Nest' },
    { letter: 'O', pronunciation: 'oh', example: 'Orange' },
    { letter: 'P', pronunciation: 'pee', example: 'Pen' },
    { letter: 'Q', pronunciation: 'cue', example: 'Queen' },
    { letter: 'R', pronunciation: 'ar', example: 'Rabbit' },
    { letter: 'S', pronunciation: 'ess', example: 'Sun' },
    { letter: 'T', pronunciation: 'tee', example: 'Tiger' },
    { letter: 'U', pronunciation: 'you', example: 'Umbrella' },
    { letter: 'V', pronunciation: 'vee', example: 'Violin' },
    { letter: 'W', pronunciation: 'double you', example: 'Water' },
    { letter: 'X', pronunciation: 'eks', example: 'X-ray' },
    { letter: 'Y', pronunciation: 'wye', example: 'Yogurt' },
    { letter: 'Z', pronunciation: 'zee', example: 'Zebra' },
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

  French: [
    { letter: 'A', pronunciation: 'ah', example: 'Amour (love)' },
    { letter: 'B', pronunciation: 'bay', example: 'Bateau (boat)' },
    { letter: 'C', pronunciation: 'say', example: 'Chat (cat)' },
    { letter: 'D', pronunciation: 'day', example: 'Daniel' },
    { letter: 'E', pronunciation: 'uh', example: 'Ecole (school)' },
    { letter: 'F', pronunciation: 'eff', example: 'Fleur (flower)' },
    { letter: 'G', pronunciation: 'zhey', example: 'Gâteau (cake)' },
    { letter: 'H', pronunciation: 'ahsh', example: 'Hôtel (hotel)' },
    { letter: 'I', pronunciation: 'ee', example: 'Île (island)' },
    { letter: 'J', pronunciation: 'zhee', example: 'Jardin (garden)' },
    { letter: 'K', pronunciation: 'kah', example: 'Kangourou (kangaroo)' },
    { letter: 'L', pronunciation: 'ell', example: 'Lune (moon)' },
    { letter: 'M', pronunciation: 'em', example: 'Montagne (mountain)' },
    { letter: 'N', pronunciation: 'en', example: 'Neige (snow)' },
    { letter: 'O', pronunciation: 'oh', example: 'Océan (ocean)' },
    { letter: 'P', pronunciation: 'pay', example: 'Pomme (apple)' },
    { letter: 'Q', pronunciation: 'koo', example: 'Question' },
    { letter: 'R', pronunciation: 'air', example: 'Rivière (river)' },
    { letter: 'S', pronunciation: 'ess', example: 'Soleil (sun)' },
    { letter: 'T', pronunciation: 'tay', example: 'Table' },
    { letter: 'U', pronunciation: 'oo', example: 'Univers (universe)' },
    { letter: 'V', pronunciation: 'vay', example: 'Voiture (car)' },
    { letter: 'W', pronunciation: 'doo-bluh-vay', example: 'Week-end (weekend)' },
    { letter: 'X', pronunciation: 'eeks', example: 'Xylophone' },
    { letter: 'Y', pronunciation: 'ee-grek', example: 'Yacht' },
    { letter: 'Z', pronunciation: 'zedd', example: 'Zèbre (zebra)' },
  ],

  Polish: [
    { letter: 'A', pronunciation: 'ah', example: 'Ananas (pineapple)' },
    { letter: 'B', pronunciation: 'beh', example: 'Banan (banana)' },
    { letter: 'C', pronunciation: 'tseh', example: 'Czapka (hat)' },
    { letter: 'D', pronunciation: 'deh', example: 'Dom (house)' },
    { letter: 'E', pronunciation: 'eh', example: 'Edukacja (education)' },
    { letter: 'F', pronunciation: 'eff', example: 'Foka (seal)' },
    { letter: 'G', pronunciation: 'geh', example: 'Góra (mountain)' },
    { letter: 'H', pronunciation: 'hah', example: 'Hala (hall)' },
    { letter: 'I', pronunciation: 'ee', example: 'Igła (needle)' },
    { letter: 'J', pronunciation: 'yeh', example: 'Jabłko (apple)' },
    { letter: 'K', pronunciation: 'kah', example: 'Kwiat (flower)' },
    { letter: 'L', pronunciation: 'ell', example: 'Lampa (lamp)' },
    { letter: 'M', pronunciation: 'em', example: 'Miś (teddy bear)' },
    { letter: 'N', pronunciation: 'en', example: 'Noga (leg)' },
    { letter: 'O', pronunciation: 'oh', example: 'Oko (eye)' },
    { letter: 'P', pronunciation: 'peh', example: 'Pies (dog)' },
    { letter: 'Q', pronunciation: 'koo', example: 'Quiz' },
    { letter: 'R', pronunciation: 'err', example: 'Rower (bike)' },
    { letter: 'S', pronunciation: 'ess', example: 'Słoń (elephant)' },
    { letter: 'T', pronunciation: 'teh', example: 'Tata (dad)' },
    { letter: 'U', pronunciation: 'oo', example: 'Ulica (street)' },
    { letter: 'V', pronunciation: 'fau', example: 'Vulkan' },
    { letter: 'W', pronunciation: 'veh', example: 'Woda (water)' },
    { letter: 'X', pronunciation: 'iks', example: 'Xylofon (xylophone)' },
    { letter: 'Y', pronunciation: 'igrek', example: 'Yeti' },
    { letter: 'Z', pronunciation: 'zed', example: 'Zegar (clock)' },
  ],
};

    const currentAlphabets = languageAlphabets[user?.language] || languageAlphabets.English;

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
    return (
        <div className="h_profile_inner">
            <Row className="g-4">
                {/* Alphabet Panel */}
                <Col xl={12}>
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
            </Row>
        </div >
    )
}
