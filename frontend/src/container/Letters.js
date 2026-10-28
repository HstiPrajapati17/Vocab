import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import { FaVolumeUp } from 'react-icons/fa';
import { useApp } from '../App';
import { getAlphabetByLanguage } from '../api';

export default function Letters() {
    const { user } = useApp();
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [remoteAlphabet, setRemoteAlphabet] = useState(null);
    const [alphabetLoading, setAlphabetLoading] = useState(true);
    useEffect(() => {
        let active = true;
        setSelectedLetter(null);
        setRemoteAlphabet(null);
        setAlphabetLoading(true);
        getAlphabetByLanguage(user?.language || 'English')
            .then((data) => {
                if (active) setRemoteAlphabet(Array.isArray(data?.letters) ? data.letters : null);
            })
            .catch((error) => {
                console.error('Could not load alphabet:', error);
                if (active) setRemoteAlphabet(null);
            })
            .finally(() => {
                if (active) setAlphabetLoading(false);
            });
        return () => { active = false; };
    }, [user?.language]);

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

        Italian: [
            { letter: 'A', pronunciation: 'a', example: 'Amico (friend)' },
            { letter: 'B', pronunciation: 'bi', example: 'Bambino (child)' },
            { letter: 'C', pronunciation: 'ci', example: 'Casa (house)' },
            { letter: 'D', pronunciation: 'di', example: 'Dado (die)' },
            { letter: 'E', pronunciation: 'e', example: 'Elefante (elephant)' },
            { letter: 'F', pronunciation: 'effe', example: 'Fiore (flower)' },
            { letter: 'G', pronunciation: 'gi', example: 'Gatto (cat)' },
            { letter: 'H', pronunciation: 'acca', example: 'Hotel (hotel)' },
            { letter: 'I', pronunciation: 'i', example: 'Isola (island)' },
            { letter: 'J', pronunciation: 'i lunga', example: 'Jolly (joker)' },
            { letter: 'K', pronunciation: 'cappa', example: 'Kiwi (kiwi)' },
            { letter: 'L', pronunciation: 'elle', example: 'Luna (moon)' },
            { letter: 'M', pronunciation: 'emme', example: 'Mela (apple)' },
            { letter: 'N', pronunciation: 'enne', example: 'Nave (ship)' },
            { letter: 'O', pronunciation: 'o', example: 'Oca (goose)' },
            { letter: 'P', pronunciation: 'pi', example: 'Pane (bread)' },
            { letter: 'Q', pronunciation: 'cu', example: 'Quaderno (notebook)' },
            { letter: 'R', pronunciation: 'erre', example: 'Rosa (rose)' },
            { letter: 'S', pronunciation: 'esse', example: 'Sole (sun)' },
            { letter: 'T', pronunciation: 'ti', example: 'Tavolo (table)' },
            { letter: 'U', pronunciation: 'u', example: 'Uva (grape)' },
            { letter: 'V', pronunciation: 'vi', example: 'Vaso (vase)' },
            { letter: 'W', pronunciation: 'doppia vu', example: 'Walter (Walter)' },
            { letter: 'X', pronunciation: 'ics', example: 'Xilofono (xylophone)' },
            { letter: 'Y', pronunciation: 'ipsilon', example: 'Yoga (yoga)' },
            { letter: 'Z', pronunciation: 'zeta', example: 'Zaino (backpack)' },
        ],

        Spanish: [
            { letter: 'A', pronunciation: 'a', example: 'Amigo (friend)' },
            { letter: 'B', pronunciation: 'be', example: 'Barco (boat)' },
            { letter: 'C', pronunciation: 'ce', example: 'Casa (house)' },
            { letter: 'D', pronunciation: 'de', example: 'Dedo (finger)' },
            { letter: 'E', pronunciation: 'e', example: 'Elefante (elephant)' },
            { letter: 'F', pronunciation: 'efe', example: 'Flor (flower)' },
            { letter: 'G', pronunciation: 'ge', example: 'Gato (cat)' },
            { letter: 'H', pronunciation: 'hache', example: 'Hola (hello)' },
            { letter: 'I', pronunciation: 'i', example: 'Isla (island)' },
            { letter: 'J', pronunciation: 'jota', example: 'Jirafa (giraffe)' },
            { letter: 'K', pronunciation: 'ka', example: 'Koala (koala)' },
            { letter: 'L', pronunciation: 'ele', example: 'Luna (moon)' },
            { letter: 'M', pronunciation: 'eme', example: 'Mano (hand)' },
            { letter: 'N', pronunciation: 'ene', example: 'Nube (cloud)' },
            { letter: 'Ñ', pronunciation: 'eñe', example: 'Ñandú (rhea)' },
            { letter: 'O', pronunciation: 'o', example: 'Oso (bear)' },
            { letter: 'P', pronunciation: 'pe', example: 'Perro (dog)' },
            { letter: 'Q', pronunciation: 'cu', example: 'Queso (cheese)' },
            { letter: 'R', pronunciation: 'erre', example: 'Rosa (rose)' },
            { letter: 'S', pronunciation: 'ese', example: 'Sol (sun)' },
            { letter: 'T', pronunciation: 'te', example: 'Taza (cup)' },
            { letter: 'U', pronunciation: 'u', example: 'Uva (grape)' },
            { letter: 'V', pronunciation: 'uve', example: 'Vaca (cow)' },
            { letter: 'W', pronunciation: 'uve doble', example: 'Wafle (waffle)' },
            { letter: 'X', pronunciation: 'equis', example: 'Xilófono (xylophone)' },
            { letter: 'Y', pronunciation: 'ye', example: 'Yogur (yogurt)' },
            { letter: 'Z', pronunciation: 'zeta', example: 'Zapato (shoe)' },
        ],

        Portuguese: [
            { letter: 'A', pronunciation: 'á', example: 'Amigo (friend)' },
            { letter: 'B', pronunciation: 'bê', example: 'Bola (ball)' },
            { letter: 'C', pronunciation: 'cê', example: 'Casa (house)' },
            { letter: 'D', pronunciation: 'dê', example: 'Dado (die)' },
            { letter: 'E', pronunciation: 'é', example: 'Escola (school)' },
            { letter: 'F', pronunciation: 'éfe', example: 'Flor (flower)' },
            { letter: 'G', pronunciation: 'gê', example: 'Gato (cat)' },
            { letter: 'H', pronunciation: 'agá', example: 'Hoje (today)' },
            { letter: 'I', pronunciation: 'i', example: 'Ilha (island)' },
            { letter: 'J', pronunciation: 'jóta', example: 'Janela (window)' },
            { letter: 'K', pronunciation: 'cá', example: 'Kiwi (kiwi)' },
            { letter: 'L', pronunciation: 'éle', example: 'Lua (moon)' },
            { letter: 'M', pronunciation: 'ême', example: 'Mão (hand)' },
            { letter: 'N', pronunciation: 'êne', example: 'Navio (ship)' },
            { letter: 'O', pronunciation: 'ó', example: 'Ovo (egg)' },
            { letter: 'P', pronunciation: 'pê', example: 'Pato (duck)' },
            { letter: 'Q', pronunciation: 'quê', example: 'Queijo (cheese)' },
            { letter: 'R', pronunciation: 'érre', example: 'Rosa (rose)' },
            { letter: 'S', pronunciation: 'ésse', example: 'Sol (sun)' },
            { letter: 'T', pronunciation: 'tê', example: 'Tatu (armadillo)' },
            { letter: 'U', pronunciation: 'u', example: 'Uva (grape)' },
            { letter: 'V', pronunciation: 'vê', example: 'Vaca (cow)' },
            { letter: 'W', pronunciation: 'dáblio', example: 'Web (web)' },
            { letter: 'X', pronunciation: 'xis', example: 'Xícara (cup)' },
            { letter: 'Y', pronunciation: 'ípsilon', example: 'Yoga (yoga)' },
            { letter: 'Z', pronunciation: 'zê', example: 'Zebra (zebra)' },
        ],
    };

    const activeLanguage = user?.language || 'English';
    const localAlphabet = Object.entries(languageAlphabets)
        .find(([language]) => language.toLowerCase() === activeLanguage.trim().toLowerCase())?.[1];
    const currentAlphabets = remoteAlphabet?.length ? remoteAlphabet : localAlphabet || [];
    const currentLetter = currentAlphabets[selectedLetter];
    const speechLocales = {
        English: 'en-US',
        French: 'fr-FR',
        German: 'de-DE',
        Polish: 'pl-PL',
        Spanish: 'es-ES',
        Italian: 'it-IT',
        Portuguese: 'pt-PT',
        Vietnamese: 'vi-VN',
        Chinese: 'zh-CN',
        Japanese: 'ja-JP',
        Korean: 'ko-KR',
    };

    const speakLetter = (letter, pronunciation) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`${letter} - ${pronunciation}`);
            const language = Object.keys(speechLocales)
                .find((name) => name.toLowerCase() === activeLanguage.trim().toLowerCase());
            if (language) utterance.lang = speechLocales[language];
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };
    return (
        <div className="h_profile_inner min-h-auto">
            <div className="h_courses_header">
                <div>
                    <h1 className="h_courses_title">{user?.language || 'English'} Alphabet</h1>
                    <p className="text-muted small mb-0">Learn pronunciation and examples for each letter</p>
                </div>
            </div>
            {currentAlphabets.length === 0 && alphabetLoading ? (
                <Card className="h_profile_card border-0 shadow-sm">
                    <Card.Body className="p-4 d-flex align-items-center gap-2 text-muted">
                        <Spinner animation="border" size="sm" />
                        Loading alphabet…
                    </Card.Body>
                </Card>
            ) : currentAlphabets.length === 0 ? (
                <Card className="h_profile_card border-0 shadow-sm">
                    <Card.Body className="p-4 text-muted">
                        Alphabet and pronunciation content for {activeLanguage} is not available yet.
                    </Card.Body>
                </Card>
            ) : <Row className="g-4">
                {/* Alphabet Panel */}
                <Col xl={12}>
                    <Card className="h_profile_card border-0 shadow-sm mb-4">
                        <Card.Body className="p-4">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <FaVolumeUp /> Alphabet Letters
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
                            {currentLetter && (
                                <div className="h_alphabet_detail mt-3 p-3 bg-light rounded">
                                    <div className="h_alphabet_detail_letter">{currentLetter.letter}</div>
                                    <div className="h_alphabet_detail_pronunciation">{currentLetter.pronunciation}</div>
                                    <div className="h_alphabet_detail_example">{currentLetter.example}</div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>}
        </div >
    )
}
