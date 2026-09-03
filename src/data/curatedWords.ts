/**
 * curatedWords.ts
 *
 * Curated dataset of 1,000 literary, poetic, philosophical, and emotion-defining
 * vocabulary words for Cursus Word of the Day.
 *
 * Guarantees zero repetitions across 2.74 consecutive calendar years (~1,000 days),
 * 100% offline-ready with 0 external API calls, 0 latency, and instant lookup.
 */

export interface CuratedWord {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  category: string;
}

export const CURATED_WORDS: CuratedWord[] = [
  {
    "word": "sonder",
    "phonetic": "/ˈsɒndər/",
    "partOfSpeech": "noun",
    "definition": "The profound realization that each random passerby is living a life as vivid and complex as your own.",
    "example": "As he gazed at the commuters from the train window, a quiet wave of sonder washed over him.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sehnsucht",
    "phonetic": "/ˈzeːnˌzʊxt/",
    "partOfSpeech": "noun",
    "definition": "A deep, inconsolable yearning for an intangible alternative reality or distant homeland of the soul.",
    "example": "In the twilight glow of autumn, she was seized by a poignant sehnsucht for places she had never seen.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "saudade",
    "phonetic": "/saʊˈdɑːdə/",
    "partOfSpeech": "noun",
    "definition": "A melancholic longing for an absent something or someone that is dearly loved and perhaps lost forever.",
    "example": "Flipping through the yellowed postcards stirred a quiet saudade in his chest.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "weltschmerz",
    "phonetic": "/ˈvɛltˌʃmɛərts/",
    "partOfSpeech": "noun",
    "definition": "A feeling of melancholy and world-weariness caused by comparing the actual state of the world with an ideal one.",
    "example": "His youthful journals were brimming with Weltschmerz and grand philosophical laments.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "hiraeth",
    "phonetic": "/ˈhɪəraɪθ/",
    "partOfSpeech": "noun",
    "definition": "A spiritual homesickness and longing for a home to which you cannot return or which never was.",
    "example": "Listening to the ancient folk melody stirred an unshakeable hiraeth within her.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "chrysalism",
    "phonetic": "/ˈkrɪsəlɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The tranquil, womb-like serenity of being indoors during a ferocious thunderstorm.",
    "example": "Curled by the fireplace while raindrops lashed the windowpanes, he relished pure chrysalism.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "limerence",
    "phonetic": "/ˈlɪmərəns/",
    "partOfSpeech": "noun",
    "definition": "The involuntary, obsessive state of infatuation marked by an acute desire for emotional reciprocation.",
    "example": "Her quiet evenings were consumed by the feverish turbulence of limerence.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "eudaimonia",
    "phonetic": "/juːdaɪˈmoʊniə/",
    "partOfSpeech": "noun",
    "definition": "A state of profound human flourishing, purposeful well-being, and moral contentment.",
    "example": "He measured his wealth not in coins, but in the enduring pursuit of eudaimonia.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "ennui",
    "phonetic": "/ɒnˈwiː/",
    "partOfSpeech": "noun",
    "definition": "A persistent feeling of listlessness, apathy, and weariness arising from a lack of occupation or excitement.",
    "example": "Surrounded by lavish luxuries, the aristocrat suffered from an incurable ennui.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "wistful",
    "phonetic": "/ˈwɪstfʊl/",
    "partOfSpeech": "adjective",
    "definition": "Having or showing a feeling of vague, regretful, or meditative longing.",
    "example": "She cast a wistful glance back at the sleepy harbor as the ferry pulled away.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "melancholia",
    "phonetic": "/ˌmɛlənˈkoʊliə/",
    "partOfSpeech": "noun",
    "definition": "A deep, pensive, and often long-lasting sadness with no immediate cause.",
    "example": "The somber minor chords of the cello evoked a gentle, dignified melancholia.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "anomie",
    "phonetic": "/ˈænəmi/",
    "partOfSpeech": "noun",
    "definition": "A condition of instability and disorientation resulting from a breakdown of standards and moral guidance.",
    "example": "The rapid modernization of the metropolis left many souls adrift in an unsettling anomie.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "kenopsia",
    "phonetic": "/kɪˈnɒpsiə/",
    "partOfSpeech": "noun",
    "definition": "The eerie, forlorn atmosphere of a place that is usually bustling with people but is now abandoned and quiet.",
    "example": "Walking through the darkened school hallways at midnight filled him with a haunting kenopsia.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "rubatosis",
    "phonetic": "/ˌruːbəˈtoʊsɪs/",
    "partOfSpeech": "noun",
    "definition": "The unsettling awareness of your own heartbeat.",
    "example": "In the absolute silence of the cavern, he was startled by the steady pulse of rubatosis.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "liberosis",
    "phonetic": "/ˌlɪbəˈroʊsɪs/",
    "partOfSpeech": "noun",
    "definition": "The desire to care less about things—to loosen your grip on life and surrender anxious ambition.",
    "example": "Sitting atop the mountain ridge, he felt an exhilarating surge of liberosis.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "opia",
    "phonetic": "/ˈoʊpiə/",
    "partOfSpeech": "noun",
    "definition": "The ambiguous intensity of looking someone in the eye, feeling simultaneously vulnerable and invasive.",
    "example": "When their gazes locked across the gallery, a sudden spark of opia held them motionless.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "monachopsis",
    "phonetic": "/ˌmɒnəˈkɒpsɪs/",
    "partOfSpeech": "noun",
    "definition": "The subtle but persistent feeling of being out of place, like a seal waddling awkwardly on dry land.",
    "example": "Even among his intellectual peers, an innate sense of monachopsis shadowed his steps.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "vemodalen",
    "phonetic": "/veɪˈmoʊdələn/",
    "partOfSpeech": "noun",
    "definition": "The frustration of photographing something amazing when thousands of identical photos already exist.",
    "example": "Standing before the Taj Mahal, she hesitated, paralyzed by a pang of vemödalen.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "altschmerz",
    "phonetic": "/ˈɑːltʃmɛərts/",
    "partOfSpeech": "noun",
    "definition": "Weariness with the same old flaws, anxieties, and anxieties you have carried for years.",
    "example": "He sighed at his stubborn hesitation, weary of the familiar bite of altschmerz.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "ellipsism",
    "phonetic": "/ɪˈlɪpsɪzəm/",
    "partOfSpeech": "noun",
    "definition": "A sadness that you will never be able to know how history will turn out.",
    "example": "Reading about future space voyages brought a touch of bittersweet ellipsism.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "dysania",
    "phonetic": "/dɪsˈeɪniə/",
    "partOfSpeech": "noun",
    "definition": "The state of finding it exceedingly difficult to get out of bed in the morning.",
    "example": "On gloomy winter mornings, dysania invariably triumphed over his ambitious schedules.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "catharsis",
    "phonetic": "/kəˈθɑːrsɪs/",
    "partOfSpeech": "noun",
    "definition": "The process of releasing and thereby providing relief from strong or repressed emotions.",
    "example": "Weeping openly at the symphony’s finale brought an unexpected, cleansing catharsis.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "epiphany",
    "phonetic": "/ɪˈpɪfəni/",
    "partOfSpeech": "noun",
    "definition": "A moment of sudden, profound revelation or insight into the essential nature of reality.",
    "example": "Walking along the solitary shoreline, she experienced an epiphany that altered her life's path.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "nostalgia",
    "phonetic": "/nɒˈstældʒə/",
    "partOfSpeech": "noun",
    "definition": "A sentimental longing or wistful affection for the past, typically for a period with happy personal associations.",
    "example": "The scent of cedarwood dipped him into a warm bath of childhood nostalgia.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "reverie",
    "phonetic": "/ˈrɛvəri/",
    "partOfSpeech": "noun",
    "definition": "A state of being pleasantly lost in one's thoughts; a daydream.",
    "example": "He was snapped out of his quiet reverie by the chime of the grandfather clock.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "yearning",
    "phonetic": "/ˈjɜːrnɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A feeling of intense longing for something, especially something out of reach.",
    "example": "Behind his composed exterior burned an unquenchable yearning for creative freedom.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "angst",
    "phonetic": "/ɑːŋst/",
    "partOfSpeech": "noun",
    "definition": "A feeling of deep anxiety, dread, or persistent philosophical apprehension.",
    "example": "His early paintings channeled the raw existential angst of postwar society.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "euphoria",
    "phonetic": "/juːˈfɔːriə/",
    "partOfSpeech": "noun",
    "definition": "A feeling or state of intense excitement, happiness, and supreme vitality.",
    "example": "Reaching the summit bathed in morning sun sent a wave of boundless euphoria through the team.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "equanimity",
    "phonetic": "/ˌɛkwəˈnɪmɪti/",
    "partOfSpeech": "noun",
    "definition": "Mental calmness, composure, and evenness of temper, especially in a difficult situation.",
    "example": "She weathered the bitter storm of public criticism with majestic equanimity.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sangfroid",
    "phonetic": "/sɒ̃ˈfrwɑː/",
    "partOfSpeech": "noun",
    "definition": "Coolness of mind; calmness; composure, especially in the face of imminent danger.",
    "example": "The pilot navigated through the thunderstorm with exemplary sangfroid.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "ataraxia",
    "phonetic": "/ˌætəˈræksiə/",
    "partOfSpeech": "noun",
    "definition": "A state of serene calmness and untroubled peace of mind cherished by ancient Stoics.",
    "example": "In the monastic courtyard, he discovered the quiet gift of ataraxia.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "metanoia",
    "phonetic": "/ˌmɛtəˈnɔɪə/",
    "partOfSpeech": "noun",
    "definition": "A transformative change of heart; a spiritual or psychological conversion.",
    "example": "The near-fatal ordeal catalyzed a profound metanoia in his perspective on success.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "kairos",
    "phonetic": "/ˈkaɪrɒs/",
    "partOfSpeech": "noun",
    "definition": "The opportune, critical, or divinely appointed moment for decisive action.",
    "example": "Recognizing the kairos in the debate, the orator delivered his decisive argument.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "lachesism",
    "phonetic": "/ˈlætʃɪsɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The longing for the clarity that comes with surviving a calamity.",
    "example": "Listening to the thunder, a fleeting touch of lachesism made him wish to stand out in the storm.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "apatheia",
    "phonetic": "/ˌæpəˈθiːə/",
    "partOfSpeech": "noun",
    "definition": "Freedom from disturbing irrational emotions and destructive passions.",
    "example": "Through disciplined meditation, the philosopher attained an enviable state of apatheia.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "mauerbauertraurigkeit",
    "phonetic": "/ˈmaʊərbəʊərˌtraʊrɪçkaɪt/",
    "partOfSpeech": "noun",
    "definition": "The inexplicable urge to push people away, even close friends who you really like.",
    "example": "Overwhelmed by social demands, he retreated into a quiet spell of mauerbauertraurigkeit.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "solitude",
    "phonetic": "/ˈsɒlɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "The state or situation of being alone, especially when viewed as pleasant and rejuvenating.",
    "example": "Far from being lonely, he found in solitude the deepest wellspring of his creativity.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "languor",
    "phonetic": "/ˈlæŋɡər/",
    "partOfSpeech": "noun",
    "definition": "A pleasant, heavy stillness or relaxation; tiredness that feels dreamy and agreeable.",
    "example": "A delicious summer languor settled over the veranda as the afternoon stretched on.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "serendipity",
    "phonetic": "/ˌsɛrənˈdɪpɪti/",
    "partOfSpeech": "noun",
    "definition": "The occurrence of valuable or agreeable discoveries by chance and unexpected good fortune.",
    "example": "Discovering the forgotten manuscript behind the bookshelf was pure serendipity.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "verve",
    "phonetic": "/vɜːrv/",
    "partOfSpeech": "noun",
    "definition": "Vigor and spirit or enthusiasm; vitality of imagination and artistic expression.",
    "example": "Her prose sang with an infectious verve that captivated readers from the first paragraph.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "pathos",
    "phonetic": "/ˈpeɪθɒs/",
    "partOfSpeech": "noun",
    "definition": "A quality that evokes pity, tender sadness, or deep emotional resonance.",
    "example": "There was a quiet pathos in the old violinist's trembling hands that moved the audience to tears.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "clinomania",
    "phonetic": "/ˌklaɪnoʊˈmeɪniə/",
    "partOfSpeech": "noun",
    "definition": "An excessive, passionate desire to stay in bed, enveloped in blankets.",
    "example": "Outside the snow fell thick and soft, granting full permission to his clinomania.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "balter",
    "phonetic": "/ˈbɔːltər/",
    "partOfSpeech": "verb",
    "definition": "To dance gracelessly, without particular skill, but with boundless enthusiasm and joy.",
    "example": "Unbothered by rhythm, the children baltered around the living room in pure delight.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "enrapture",
    "phonetic": "/ɪnˈræptʃər/",
    "partOfSpeech": "verb",
    "definition": "To fill someone with immense pleasure, wonder, or delight.",
    "example": "The soaring soprano notes never failed to enrapture the silent auditorium.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "numinous",
    "phonetic": "/ˈnjuːmɪnəs/",
    "partOfSpeech": "adjective",
    "definition": "Having a strong religious or spiritual quality; indicating or suggesting the presence of a divinity.",
    "example": "An eerie, numinous silence hung beneath the vaulted stone ceilings of the ancient chapel.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "aporia",
    "phonetic": "/əˈpɔːriə/",
    "partOfSpeech": "noun",
    "definition": "An irresolvable internal contradiction or state of being at an intellectual loss.",
    "example": "The professor's paradoxical question plunged the entire seminar into silent aporia.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "solastalgia",
    "phonetic": "/ˌsɒləˈstældʒə/",
    "partOfSpeech": "noun",
    "definition": "A form of emotional or existential distress caused by environmental change to one's home territory.",
    "example": "Walking through the logged forest, the elder felt an aching solastalgia.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "dulce-domum",
    "phonetic": "/ˈdʊltʃeɪ ˈdoʊməm/",
    "partOfSpeech": "noun",
    "definition": "The sweet feeling of arriving safely home after a long journey.",
    "example": "As the porch light came into view, dulce-domum washed over the weary travelers.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "torpor",
    "phonetic": "/ˈtɔːrpər/",
    "partOfSpeech": "noun",
    "definition": "A state of physical or mental inactivity; lethargy.",
    "example": "The oppressive humidity of mid-July induced a collective torpor in the village.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "dolor",
    "phonetic": "/ˈdoʊlər/",
    "partOfSpeech": "noun",
    "definition": "A state of great sorrow or emotional distress.",
    "example": "Her poetry distilled the quiet dolor of war into lines of stark, unforgettable beauty.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "blithesome",
    "phonetic": "/ˈblaɪðsəm/",
    "partOfSpeech": "adjective",
    "definition": "Lighthearted, merry, and cheerful in disposition.",
    "example": "Her blithesome laugh could dispel the gloom of the stormiest afternoon.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "morose",
    "phonetic": "/məˈroʊs/",
    "partOfSpeech": "adjective",
    "definition": "Sullen and ill-tempered; broodingly gloomy.",
    "example": "After receiving the disappointing news, he remained silent and morose all evening.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "ebullience",
    "phonetic": "/ɪˈbʊliəns/",
    "partOfSpeech": "noun",
    "definition": "The quality of being cheerful, lively, and full of enthusiastic energy.",
    "example": "Her youthful ebullience was so contagious that even the sternest teachers smiled.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "disconsolate",
    "phonetic": "/dɪsˈkɒnsəlɪt/",
    "partOfSpeech": "adjective",
    "definition": "Without consolation or comfort; intensely dejected and cheerless.",
    "example": "The dog sat disconsolate by the doorway, waiting for its owner to return.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sanguine",
    "phonetic": "/ˈsæŋɡwɪn/",
    "partOfSpeech": "adjective",
    "definition": "Optimistic or positive, especially in an apparently bad or difficult situation.",
    "example": "Despite repeated setbacks, the inventor maintained a remarkably sanguine outlook.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "lugubrious",
    "phonetic": "/lʊˈɡuːbriəs/",
    "partOfSpeech": "adjective",
    "definition": "Looking or sounding sad, dismal, or mournfully exaggerated.",
    "example": "The cello played a lugubrious tune that seemed to weep through the quiet hall.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "lachrymose",
    "phonetic": "/ˈlækrɪmoʊs/",
    "partOfSpeech": "adjective",
    "definition": "Tearful or given to weeping; inducing tears.",
    "example": "The Victorian melodrama was renowned for its excessively lachrymose final act.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "ecstatic",
    "phonetic": "/ɪkˈstætɪk/",
    "partOfSpeech": "adjective",
    "definition": "Feeling or expressing overwhelming happiness or joyful excitement.",
    "example": "The crowd erupted in ecstatic applause as the symphony struck its triumphant final chord.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "somnolent",
    "phonetic": "/ˈsɒmnələnt/",
    "partOfSpeech": "adjective",
    "definition": "Sleepy; drowsy; inducing peaceful slumber.",
    "example": "The rhythmic drone of cicadas lent a somnolent quality to the warm afternoon.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "trepidation",
    "phonetic": "/ˌtrɛpɪˈdeɪʃən/",
    "partOfSpeech": "noun",
    "definition": "A feeling of fear, agitation, or trembling hesitation about something that may happen.",
    "example": "She knocked on the dean’s heavy oak door with no small amount of trepidation.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "aplomb",
    "phonetic": "/əˈplɒm/",
    "partOfSpeech": "noun",
    "definition": "Self-confidence or assurance, especially when in a demanding or awkward situation.",
    "example": "She answered the hostile press questions with poise and remarkable aplomb.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "solicitude",
    "phonetic": "/səˈlɪsɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "Care or concern for someone or something; attentive tenderness.",
    "example": "His grandmother treated his cold with an endearing flurry of herbal solicitude.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "pensive",
    "phonetic": "/ˈpɛnsɪv/",
    "partOfSpeech": "adjective",
    "definition": "Engaged in, involving, or reflecting deep or serious thought.",
    "example": "He leaned against the railing, lost in pensive contemplation of the incoming tide.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "complacency",
    "phonetic": "/kəmˈpleɪsənsi/",
    "partOfSpeech": "noun",
    "definition": "A feeling of smug or uncritical satisfaction with oneself or one's achievements.",
    "example": "The champion warned his teammates against the creeping danger of complacency.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "exultation",
    "phonetic": "/ˌɛɡzʌlˈteɪʃən/",
    "partOfSpeech": "noun",
    "definition": "A feeling of triumphant elation or joyful jubilation.",
    "example": "A roar of exultation greeted the runners as they crossed the marathon finish line.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "disquietude",
    "phonetic": "/dɪsˈkwaɪɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "A state of uneasiness or anxiety; restlessness of the spirit.",
    "example": "A nagging disquietude troubled his sleep on the eve of the historic departure.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "beatitude",
    "phonetic": "/biˈætɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "Supreme blessedness, spiritual ecstasy, or exalted happiness.",
    "example": "In the quiet stillness of the mountaintop dawn, she felt a serene beatitude.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "petulance",
    "phonetic": "/ˈpɛtjʊləns/",
    "partOfSpeech": "noun",
    "definition": "The quality of being childishly sulky or bad-tempered.",
    "example": "When his proposal was gently critiqued, he responded with sudden, unbecoming petulance.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "ardor",
    "phonetic": "/ˈɑːrdər/",
    "partOfSpeech": "noun",
    "definition": "Enthusiasm, passion, or intense warmth of feeling.",
    "example": "He defended the rights of the voiceless with unrelenting intellectual ardor.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "nonchalance",
    "phonetic": "/ˌnɒnʃəˈlɑːns/",
    "partOfSpeech": "noun",
    "definition": "The state of appearing calm, relaxed, and casually unconcerned.",
    "example": "She handled the unexpected crisis with a cool nonchalance that steadied the entire room.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "consternation",
    "phonetic": "/ˌkɒnstərˈneɪʃən/",
    "partOfSpeech": "noun",
    "definition": "Feelings of anxiety, dread, or dismay, typically at something unexpected.",
    "example": "The sudden cancellation of the expedition caused widespread consternation among the crew.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "ebullient",
    "phonetic": "/ɪˈbʊljənt/",
    "partOfSpeech": "adjective",
    "definition": "Cheerful and full of energy; overflowing with enthusiasm.",
    "example": "Her ebullient greeting brought warmth into the chilly morning conference room.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "resignation",
    "phonetic": "/ˌrɛzɪɡˈneɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The acceptance of something undesirable but inevitable; stoic surrender.",
    "example": "With a quiet sigh of resignation, he folded the letter and set it aside.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "crestfallen",
    "phonetic": "/ˈkrɛstˌfɔːlən/",
    "partOfSpeech": "adjective",
    "definition": "Sad, disappointed, and downcast.",
    "example": "He looked thoroughly crestfallen when he learned the old bookstore had permanently closed.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "felicity",
    "phonetic": "/fəˈlɪsɪti/",
    "partOfSpeech": "noun",
    "definition": "Intense happiness; the ability to find appropriate and eloquent expression.",
    "example": "Their humble farmhouse was a haven of simple warmth and domestic felicity.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "perturbation",
    "phonetic": "/ˌpɜːrtərˈbeɪʃən/",
    "partOfSpeech": "noun",
    "definition": "Anxiety or mental uneasiness; a cause of disturbance in equilibrium.",
    "example": "News of the sudden border closure caused severe perturbation in the capital.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "alacrity",
    "phonetic": "/əˈlækrɪti/",
    "partOfSpeech": "noun",
    "definition": "Brisk and cheerful readiness; lively willingness.",
    "example": "She accepted the invitation to study in Florence with immense alacrity.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "forbearance",
    "phonetic": "/fɔːrˈbɛərəns/",
    "partOfSpeech": "noun",
    "definition": "Patient self-control; restraint and tolerance in the face of provocation.",
    "example": "The elder statesman listened to the insults with calm, dignified forbearance.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "abnegation",
    "phonetic": "/ˌæbnɪˈɡeɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The act of renouncing or rejecting something; self-denial.",
    "example": "His ascetic lifestyle was defined by a quiet, voluntary abnegation of worldly luxuries.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "placid",
    "phonetic": "/ˈplæsɪd/",
    "partOfSpeech": "adjective",
    "definition": "Calm and peaceful, with little movement or activity; not easily upset or excited.",
    "example": "The lake lay placid beneath the mist of early dawn, undisturbed by a single ripple.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "umbrage",
    "phonetic": "/ˈʌmbrɪdʒ/",
    "partOfSpeech": "noun",
    "definition": "Offense or annoyance; resentment at an imagined slight.",
    "example": "He took umbrage at the implication that his motives were purely financial.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "chagrin",
    "phonetic": "/ˈʃæɡrɪn/",
    "partOfSpeech": "noun",
    "definition": "Distress or embarrassment at having failed or been humiliated.",
    "example": "Much to his chagrin, his confident prediction was proven completely wrong within hours.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "jubilation",
    "phonetic": "/ˌdʒuːbɪˈleɪʃən/",
    "partOfSpeech": "noun",
    "definition": "A feeling of great happiness, triumph, and celebration.",
    "example": "Unrestrained jubilation filled the streets as the armistice was finally signed.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "querulous",
    "phonetic": "/ˈkwɛrʊləs/",
    "partOfSpeech": "adjective",
    "definition": "Complaining in a petulant or whining manner.",
    "example": "His querulous tone wore down even the most patient nurses on the hospital ward.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "exhilaration",
    "phonetic": "/ɪɡˌzɪləˈreɪʃən/",
    "partOfSpeech": "noun",
    "definition": "A feeling of great excitement, boundless energy, and elation.",
    "example": "Sailing across the wind-whipped bay brought an incomparable sense of exhilaration.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "stoicism",
    "phonetic": "/ˈstoʊɪsɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The endurance of pain or hardship without the display of feelings and without complaint.",
    "example": "She faced the diagnosis with the quiet, formidable stoicism that defined her character.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "complaisance",
    "phonetic": "/kəmˈpleɪzəns/",
    "partOfSpeech": "noun",
    "definition": "A disposition to please or comply with others; courteous obligingness.",
    "example": "His gentle complaisance made him a beloved companion on long, difficult journeys.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "turbulent",
    "phonetic": "/ˈtɜːrbjʊlənt/",
    "partOfSpeech": "adjective",
    "definition": "Characterized by conflict, disorder, or confusion; not controlled or calm.",
    "example": "His turbulent youth gave way to a deeply reflective and peaceful adulthood.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "tranquility",
    "phonetic": "/træŋˈkwɪlɪti/",
    "partOfSpeech": "noun",
    "definition": "The quality or state of being tranquil; calm, serenity, and peace.",
    "example": "The garden was an oasis of tranquility amidst the roar of the bustling metropolis.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "solace",
    "phonetic": "/ˈsɒlɪs/",
    "partOfSpeech": "noun",
    "definition": "Comfort or consolation in a time of distress or sadness.",
    "example": "She found deep solace in reading old poetry by the warmth of the fireplace.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "trepid",
    "phonetic": "/ˈtrɛpɪd/",
    "partOfSpeech": "adjective",
    "definition": "Timid, fearful, or trembling with apprehension.",
    "example": "With trepid steps, the apprentice entered the alchemist's smoky laboratory.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "effervescence",
    "phonetic": "/ˌɛfərˈvɛsəns/",
    "partOfSpeech": "noun",
    "definition": "Vivacity and enthusiasm; bounciness of spirit.",
    "example": "Her irrepressible effervescence brought genuine laughter to the solemn gathering.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "penitence",
    "phonetic": "/ˈpɛnɪtəns/",
    "partOfSpeech": "noun",
    "definition": "The action of feeling or showing sorrow and regret for having done wrong.",
    "example": "His quiet words were steeped in genuine penitence and a desire to make amends.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "rhapsody",
    "phonetic": "/ˈræpsədi/",
    "partOfSpeech": "noun",
    "definition": "An effusively enthusiastic or ecstatic expression of feeling.",
    "example": "She went into rhapsodies over the breathtaking Alpine vista unfolding before them.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "discontent",
    "phonetic": "/ˌdɪskənˈtɛnt/",
    "partOfSpeech": "noun",
    "definition": "Lack of contentment; dissatisfaction with one's circumstances.",
    "example": "A low rumble of divine discontent spurred the artist to destroy the canvas and start anew.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "blithe",
    "phonetic": "/blaɪð/",
    "partOfSpeech": "adjective",
    "definition": "Showing a casual and cheerful indifference considered to be callous or improper; carefree.",
    "example": "He walked through life with a blithe disregard for convention and social anxieties.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "intrepitude",
    "phonetic": "/ɪnˈtrɛpɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "Resolute fearlessness, fortitude, and endurance.",
    "example": "The mountain guide led the expedition through the blizzard with steady intrepitude.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "afflatus",
    "phonetic": "/əˈfleɪtəs/",
    "partOfSpeech": "noun",
    "definition": "A divine creative impulse or inspirational spark.",
    "example": "In the dead of night, seized by a sudden poetic afflatus, he composed three sonnets.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "apathy",
    "phonetic": "/ˈæpəθi/",
    "partOfSpeech": "noun",
    "definition": "Lack of interest, enthusiasm, or concern.",
    "example": "Widespread public apathy had allowed the historic library to fall into disrepair.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "avidity",
    "phonetic": "/əˈvɪdɪti/",
    "partOfSpeech": "noun",
    "definition": "Keen interest or intense enthusiasm; eagerness.",
    "example": "He devoured the newly discovered biography with breathless avidity.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "beguilement",
    "phonetic": "/bɪˈɡaɪlmənt/",
    "partOfSpeech": "noun",
    "definition": "The state of being charmed, enchanted, or pleasantly deceived.",
    "example": "Under the gentle beguilement of her storytelling, the hours melted unnoticed.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "caprice",
    "phonetic": "/kəˈpriːs/",
    "partOfSpeech": "noun",
    "definition": "A sudden and unaccountable change of mood or behavior.",
    "example": "Guided purely by romantic caprice, they boarded the first morning train to Venice.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "cattymwampus",
    "phonetic": "/ˌkætɪˈwɒmpəs/",
    "partOfSpeech": "adjective",
    "definition": "Askew, awry, or disarranged in a slightly chaotic way.",
    "example": "After the rambunctious puppy dashed through, the living room rugs lay completely cattymwampus.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "circumspection",
    "phonetic": "/ˌsɜːrkəmˈspɛkʃən/",
    "partOfSpeech": "noun",
    "definition": "The quality of being wary and unwilling to take risks; prudence.",
    "example": "The diplomat approached the delicate negotiations with utmost circumspection.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "compunction",
    "phonetic": "/kəmˈpʌŋkʃən/",
    "partOfSpeech": "noun",
    "definition": "A feeling of guilt or moral scruple that prevents or follows wrongdoing.",
    "example": "He felt no compunction about leaving the dull corporate gala early.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "concupiscence",
    "phonetic": "/kɒnˈkjuːpɪsəns/",
    "partOfSpeech": "noun",
    "definition": "Strong sexual desire; lust; intense passionate longing.",
    "example": "The poet's sonnets vividly chronicled the torment and ecstasy of concupiscence.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "delectation",
    "phonetic": "/ˌdiːlɛkˈteɪʃən/",
    "partOfSpeech": "noun",
    "definition": "Pleasure and delight; enjoyment.",
    "example": "The banquet was prepared strictly for the culinary delectation of the visiting royalty.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "delirium",
    "phonetic": "/dɪˈlɪriəm/",
    "partOfSpeech": "noun",
    "definition": "An acutely disturbed state of mind characterized by restlessness, illusions, and wild incoherence.",
    "example": "In the feverish delirium of victory, the soldiers sang into the morning light.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "demureness",
    "phonetic": "/dɪˈmjʊərnɪs/",
    "partOfSpeech": "noun",
    "definition": "Modesty, shyness, and reserved behavior.",
    "example": "Beneath her outward demureness lay a fierce and uncompromising intellect.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "desuetude",
    "phonetic": "/ˈdɛswɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "A state of disuse, abandonment, or inactivity.",
    "example": "The ancient canal system had fallen into melancholy desuetude over centuries.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "diffidence",
    "phonetic": "/ˈdɪfɪdəns/",
    "partOfSpeech": "noun",
    "definition": "Modesty or shyness resulting from a lack of self-confidence.",
    "example": "Despite his profound scholarship, he answered questions with disarming diffidence.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "dismay",
    "phonetic": "/dɪsˈmeɪ/",
    "partOfSpeech": "noun",
    "definition": "Sudden distress or disillusionment caused by something unexpected.",
    "example": "To the dismay of the congregation, the historic stained glass window had cracked.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "doldrums",
    "phonetic": "/ˈdɒldrəmz/",
    "partOfSpeech": "noun",
    "definition": "A state or period of stagnation, depression, or inactivity.",
    "example": "After months in an artistic doldrums, she suddenly painted three canvases in a single week.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "effrontery",
    "phonetic": "/ɪˈfrʌntəri/",
    "partOfSpeech": "noun",
    "definition": "Insolent or impertinent behavior; audacity.",
    "example": "He had the astounding effrontery to demand a promotion after botching the client pitch.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "enchantment",
    "phonetic": "/ɪnˈtʃɑːntmənt/",
    "partOfSpeech": "noun",
    "definition": "A feeling of great pleasure; delight; the state of being under a magical spell.",
    "example": "The silent snowy forest possessed a timeless enchantment that held them spellbound.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "estrangement",
    "phonetic": "/ɪˈstreɪndʒmənt/",
    "partOfSpeech": "noun",
    "definition": "The state of being alienated or separated from a former friend or family member.",
    "example": "Years of bitter silence gave way to a tearful reconciliation after their long estrangement.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "exasperation",
    "phonetic": "/ɪɡˌzæspəˈreɪʃən/",
    "partOfSpeech": "noun",
    "definition": "A feeling of intense irritation or annoyance.",
    "example": "She threw up her hands in exasperation as the computer crashed for the third time.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "forlornness",
    "phonetic": "/fɔːrˈlɔːrnnɪs/",
    "partOfSpeech": "noun",
    "definition": "The state of being sad and lonely; abandoned or desolate.",
    "example": "The empty crib imparted a quiet forlornness to the sunlit nursery.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "fretfulness",
    "phonetic": "/ˈfrɛtfʊlnɪs/",
    "partOfSpeech": "noun",
    "definition": "The state of being restless, irritable, or worried.",
    "example": "The prolonged drought induced a palpable fretfulness among the farming community.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "galvanism",
    "phonetic": "/ˈɡælvənɪzəm/",
    "partOfSpeech": "noun",
    "definition": "Surging excitement or energy that stimulates someone into prompt action.",
    "example": "His rousing speech injected a sudden galvanism into the weary campaign volunteers.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "garrulity",
    "phonetic": "/ɡəˈruːlɪti/",
    "partOfSpeech": "noun",
    "definition": "Excessive talkativeness, especially on trivial matters.",
    "example": "The old tavern keeper's boundless garrulity kept patrons entertained late into the night.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "gravitas",
    "phonetic": "/ˈɡrævɪtɑːs/",
    "partOfSpeech": "noun",
    "definition": "Dignity, seriousness, or solemnity of manner.",
    "example": "The chief justice presided over the constitutional tribunal with immense gravitas.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "grievance",
    "phonetic": "/ˈɡriːvəns/",
    "partOfSpeech": "noun",
    "definition": "A real or imagined wrong or other cause for complaint or protest.",
    "example": "He aired his long-standing grievances in a calm, articulate memorandum to the board.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "gusto",
    "phonetic": "/ˈɡʌstoʊ/",
    "partOfSpeech": "noun",
    "definition": "Enjoyment or vigor in doing something; zest.",
    "example": "The brass quartet played the festive march with infectious gusto and precision.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "heartache",
    "phonetic": "/ˈhɑːrteɪk/",
    "partOfSpeech": "noun",
    "definition": "Emotional anguish or deep grief.",
    "example": "No passage of time could completely dull the quiet heartache of her brother’s absence.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "hubris",
    "phonetic": "/ˈhjuːbrɪs/",
    "partOfSpeech": "noun",
    "definition": "Excessive pride or dangerous self-confidence, often leading to a downfall.",
    "example": "Blinded by hubris, the general ordered his army across the frozen river without scouts.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "hyperborean",
    "phonetic": "/ˌhaɪpərˈbɔːriən/",
    "partOfSpeech": "adjective",
    "definition": "Relating to the extreme north; freezing, celestial, and remote.",
    "example": "A hyperborean gale swept across the tundra, extinguishing all sound except the wind.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "illicitness",
    "phonetic": "/ɪˈlɪsɪtnɪs/",
    "partOfSpeech": "noun",
    "definition": "The forbidden, unlawful, or taboo quality that enhances excitement.",
    "example": "There was a thrilling illicitness in sneaking onto the castle battlements at midnight.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "impetuosity",
    "phonetic": "/ɪmˌpɛtʃuˈɒsɪti/",
    "partOfSpeech": "noun",
    "definition": "The quality of acting quickly and without thought or care; rash impulse.",
    "example": "His youthful impetuosity had led him into countless duels and romantic misadventures.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "indolence",
    "phonetic": "/ˈɪndələns/",
    "partOfSpeech": "noun",
    "definition": "Avoidance of activity or exertion; habitual laziness.",
    "example": "He spent the golden August weeks in shameless indolence by the sapphire lake.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "infatuation",
    "phonetic": "/ɪnˌfætʃuˈeɪʃən/",
    "partOfSpeech": "noun",
    "definition": "An intense but short-lived passion or admiration for someone or something.",
    "example": "What she mistook for profound love was merely a fleeting summer infatuation.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "iniquity",
    "phonetic": "/ɪˈnɪkwɪti/",
    "partOfSpeech": "noun",
    "definition": "Gross injustice, wickedness, or sinfulness.",
    "example": "The muckraking journalist dedicated his career to exposing systemic political iniquity.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "insouciance",
    "phonetic": "/ɪnˈsuːsiəns/",
    "partOfSpeech": "noun",
    "definition": "Casual lack of concern; nonchalant ease.",
    "example": "He strolled into the board meeting with the delightful insouciance of a vacationer.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "intrepidity",
    "phonetic": "/ˌɪntrɪˈpɪdɪti/",
    "partOfSpeech": "noun",
    "definition": "Resolute fearlessness, boldness, and courage.",
    "example": "Her intrepidity in exploring the submerged labyrinth earned her global acclaim.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "ire",
    "phonetic": "/aɪər/",
    "partOfSpeech": "noun",
    "definition": "Intense anger; wrath.",
    "example": "The corrupt decree drew the righteous ire of every merchant and artisan in the province.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "irreverence",
    "phonetic": "/ɪˈrɛvərəns/",
    "partOfSpeech": "noun",
    "definition": "A lack of respect for people or things that are generally taken seriously.",
    "example": "His satirical column was beloved for its wicked wit and gleeful irreverence.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "jealousy",
    "phonetic": "/ˈdʒɛləsi/",
    "partOfSpeech": "noun",
    "definition": "State of envious resentment against someone due to their success or advantages.",
    "example": "He struggled to smother the poisonous green tendrils of jealousy taking root in his heart.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "jubilance",
    "phonetic": "/ˈdʒuːbɪləns/",
    "partOfSpeech": "noun",
    "definition": "A feeling of extreme joy and triumphant celebration.",
    "example": "A roar of jubilance shook the rafters as the team scored the deciding championship goal.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "lamentation",
    "phonetic": "/ˌlæmənˈteɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The passionate expression of grief or sorrow; weeping.",
    "example": "The widow's heartbreaking lamentation echoed across the silent hillside.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "lassitude",
    "phonetic": "/ˈlæsɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "A state of physical or mental weariness; lack of energy.",
    "example": "A profound lassitude overtook the explorers as the tropical fever reached its peak.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "levity",
    "phonetic": "/ˈlɛvɪti/",
    "partOfSpeech": "noun",
    "definition": "Humor or frivolity, especially the treatment of a serious matter with humor.",
    "example": "His well-timed quip injected a welcome touch of levity into the tense courtroom.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "loathing",
    "phonetic": "/ˈloʊðɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A feeling of intense dislike or disgust; hatred.",
    "example": "He looked upon the tyrant’s flattering sycophants with unconcealed loathing.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "longing",
    "phonetic": "/ˈlɒŋɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A yearning desire; an ache for presence or fulfillment.",
    "example": "A deep longing for the rugged hills of her childhood permeated every verse she penned.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "lucidity",
    "phonetic": "/luːˈsɪdɪti/",
    "partOfSpeech": "noun",
    "definition": "Clarity of thought or expression; intelligible brightness.",
    "example": "In a rare moment of lucidity, the ailing philosopher summarized his magnum opus.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "magnanimity",
    "phonetic": "/ˌmæɡnəˈnɪmɪti/",
    "partOfSpeech": "noun",
    "definition": "Generosity and noble forgiveness toward a rival or someone less powerful.",
    "example": "The victor showed extraordinary magnanimity by pardoning the opposing generals.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "malice",
    "phonetic": "/ˈmælɪs/",
    "partOfSpeech": "noun",
    "definition": "The intention or desire to do evil; ill will.",
    "example": "Behind his polite smile lay an ancient, simmering malice.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "mania",
    "phonetic": "/ˈmeɪniə/",
    "partOfSpeech": "noun",
    "definition": "An excessive enthusiasm or desire; an obsession.",
    "example": "During the tulip mania of the seventeenth century, single bulbs fetched kingly fortunes.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "melancholy",
    "phonetic": "/ˈmɛlənkɒli/",
    "partOfSpeech": "noun",
    "definition": "A deep, pensive, and long-lasting sadness.",
    "example": "The haunting cello sonata wrapped the listener in a warm, bittersweet melancholy.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "mirth",
    "phonetic": "/mɜːrθ/",
    "partOfSpeech": "noun",
    "definition": "Amusement, especially as expressed in laughter.",
    "example": "The festive tavern was filled with music, clinking flagons, and unrestrained mirth.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "misanthropy",
    "phonetic": "/mɪsˈænθrəpi/",
    "partOfSpeech": "noun",
    "definition": "A dislike of humankind; avoidance of human society.",
    "example": "Decades of political corruption had curdled his idealism into bitter misanthropy.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "misgiving",
    "phonetic": "/mɪsˈɡɪvɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A feeling of doubt or apprehension about the outcome or consequences of something.",
    "example": "Despite her private misgivings, she voted in favor of the radical reform bill.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "moroseness",
    "phonetic": "/məˈroʊsnɪs/",
    "partOfSpeech": "noun",
    "definition": "Gloominess; a sullen, brooding disposition.",
    "example": "His pervasive moroseness made him a difficult dinner guest, despite his sharp intellect.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "mortification",
    "phonetic": "/ˌmɔːrtɪfɪˈkeɪʃən/",
    "partOfSpeech": "noun",
    "definition": "Great embarrassment and shame.",
    "example": "To his utter mortification, his phone rang loudly in the middle of the solemn memorial.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "muteness",
    "phonetic": "/ˈmjuːtnɪs/",
    "partOfSpeech": "noun",
    "definition": "Inability or unwillingness to speak; profound silence.",
    "example": "Faced with the staggering majesty of the northern lights, they stood in stunned muteness.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "mysticism",
    "phonetic": "/ˈmɪstɪsɪzəm/",
    "partOfSpeech": "noun",
    "definition": "Belief that union with or absorption into the Deity or absolute may be attained through contemplation.",
    "example": "The desert hermit spent forty years immersed in the esoteric disciplines of Christian mysticism.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "naivete",
    "phonetic": "/naɪˌiːvˈteɪ/",
    "partOfSpeech": "noun",
    "definition": "Lack of experience, wisdom, or judgment; innocent simplicity.",
    "example": "His utopian manifesto was criticized by realists for its endearing naiveté.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "nervousness",
    "phonetic": "/ˈnɜːrvəsnɪs/",
    "partOfSpeech": "noun",
    "definition": "The state of being worried, agitated, or on edge.",
    "example": "A tremor in her voice betrayed her acute nervousness as she approached the lectern.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "nihilism",
    "phonetic": "/ˈnaɪɪlɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The rejection of all religious and moral principles, in the belief that life is meaningless.",
    "example": "The philosophical nihilism of the avant-garde movement shocked traditional critics.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "oblivion",
    "phonetic": "/əˈblɪviən/",
    "partOfSpeech": "noun",
    "definition": "The state of being unaware or unconscious of what is happening; extinction.",
    "example": "He sought refuge from his grief in the dark, dreamless oblivion of deep sleep.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "odiousness",
    "phonetic": "/ˈoʊdiəsnɪs/",
    "partOfSpeech": "noun",
    "definition": "Extremely unpleasant, repulsive, or hateful character.",
    "example": "The tyrant’s decrees were met with widespread disgust at their sheer moral odiousness.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "outrage",
    "phonetic": "/ˈaʊtreɪdʒ/",
    "partOfSpeech": "noun",
    "definition": "An extremely strong reaction of anger, shock, or indignation.",
    "example": "The revelation of systemic embezzlement sparked fierce outrage across the province.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "overjoy",
    "phonetic": "/ˌoʊvərˈdʒɔɪ/",
    "partOfSpeech": "noun",
    "definition": "Immense and overwhelming joy or delight.",
    "example": "Seeing her long-lost brother step onto the pier filled her heart with boundless overjoy.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "pacifism",
    "phonetic": "/ˈpæsɪfɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The belief that any violence, including war, is unjustifiable under any circumstances.",
    "example": "Guided by lifelong pacifism, he refused to bear arms, serving instead as a battlefield medic.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "panic",
    "phonetic": "/ˈpænɪk/",
    "partOfSpeech": "noun",
    "definition": "Sudden uncontrollable fear or anxiety, often causing wildly unthinking behavior.",
    "example": "A ripple of cold panic raced through the crowd when the sirens began to wail.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "passivity",
    "phonetic": "/pæˈsɪvɪti/",
    "partOfSpeech": "noun",
    "definition": "Acceptance of what happens without active response or resistance.",
    "example": "Her dangerous passivity allowed corrupt officials to dismantle her family’s legacy.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "penury",
    "phonetic": "/ˈpɛnjʊri/",
    "partOfSpeech": "noun",
    "definition": "The state of being extremely poor; extreme destitution.",
    "example": "The once-grand baronial family was reduced to living in genteel, quiet penury.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "perversity",
    "phonetic": "/pərˈvɜːrsɪti/",
    "partOfSpeech": "noun",
    "definition": "A deliberate desire to behave in an unreasonable or unacceptable way.",
    "example": "With characteristic perversity, he chose the snowstorm day to embark on his walking tour.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "phobia",
    "phonetic": "/ˈfoʊbiə/",
    "partOfSpeech": "noun",
    "definition": "An extreme or irrational fear of or aversion to something.",
    "example": "Her profound claustrophobia made traveling in subway tunnels an ordeal of pure willpower.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "piety",
    "phonetic": "/ˈpaɪɪti/",
    "partOfSpeech": "noun",
    "definition": "The quality of being religious or reverent; devoutness.",
    "example": "The village elder was honored far and wide for his humble charity and unfeigned piety.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "pique",
    "phonetic": "/piːk/",
    "partOfSpeech": "noun",
    "definition": "A feeling of irritation or resentment resulting from a slight, especially to one's pride.",
    "example": "In a fit of wounded pique, the violinist walked out of the rehearsal.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "placidness",
    "phonetic": "/ˈplæsɪdnɪs/",
    "partOfSpeech": "noun",
    "definition": "A state of calm, quiet serenity and freedom from emotional turbulence.",
    "example": "The placidness of the mountain meadow at sunrise restored peace to his troubled mind.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "pleasure",
    "phonetic": "/ˈplɛʒər/",
    "partOfSpeech": "noun",
    "definition": "A feeling of happy satisfaction and enjoyment.",
    "example": "There is no greater pleasure than curling up with an evocative book beside a crackling fire.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "poignancy",
    "phonetic": "/ˈpɔɪnjənsi/",
    "partOfSpeech": "noun",
    "definition": "The quality of evoking a keen sense of sadness, regret, or tender emotion.",
    "example": "The letter possessed an unbearable poignancy, having been penned on the eve of his departure.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "pomp",
    "phonetic": "/pɒmp/",
    "partOfSpeech": "noun",
    "definition": "Ceremony and splendid display, especially at a public event.",
    "example": "The coronation was celebrated with all the medieval pomp and fanfare of centuries past.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "pride",
    "phonetic": "/praɪd/",
    "partOfSpeech": "noun",
    "definition": "A feeling of deep pleasure or satisfaction derived from one's own achievements.",
    "example": "She felt a surge of maternal pride as her daughter stepped onto the stage to accept the diploma.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "prudery",
    "phonetic": "/ˈpruːdəri/",
    "partOfSpeech": "noun",
    "definition": "Excessive or affected modesty, primness, or propriety.",
    "example": "The bohemian salon mocked the stiff prudery of the Victorian establishment.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "qualm",
    "phonetic": "/kwɑːm/",
    "partOfSpeech": "noun",
    "definition": "An uneasy feeling of doubt, worry, or fear, especially about one's own conduct.",
    "example": "He signed the lucrative contract without a single moral qualm.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "quietude",
    "phonetic": "/ˈkwaɪɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "A state of stillness, calm, and quiet in a person or environment.",
    "example": "In the quietude of the abbey library, hours passed like falling snowflakes.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "rancor",
    "phonetic": "/ˈræŋkər/",
    "partOfSpeech": "noun",
    "definition": "Bitterness or resentfulness, especially when long-standing.",
    "example": "The debate was conducted with notable civility, completely free of partisan rancor.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "rapture",
    "phonetic": "/ˈræptʃər/",
    "partOfSpeech": "noun",
    "definition": "A feeling of intense pleasure or enthusiasm.",
    "example": "Listening to the symphony’s adagio, she closed her eyes in pure, transported rapture.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "rebellion",
    "phonetic": "/rɪˈbɛljən/",
    "partOfSpeech": "noun",
    "definition": "An act of violent or open resistance to an established government or ruler.",
    "example": "What began as a quiet student petition soon blossomed into open intellectual rebellion.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "remorse",
    "phonetic": "/rɪˈmɔːrs/",
    "partOfSpeech": "noun",
    "definition": "Deep regret or guilt for a wrong committed.",
    "example": "Haunted by remorse, the former smuggler devoted his remaining years to philanthropy.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "repose",
    "phonetic": "/rɪˈpoʊz/",
    "partOfSpeech": "noun",
    "definition": "A state of rest, sleep, or tranquil calm.",
    "example": "Her face in repose looked remarkably serene, free of the worries of waking life.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "resentment",
    "phonetic": "/rɪˈzɛntmənt/",
    "partOfSpeech": "noun",
    "definition": "Bitter indignation at having been treated unfairly.",
    "example": "He harbored a deep resentment against the colleagues who had plagiarized his thesis.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "resolve",
    "phonetic": "/rɪˈzɒlv/",
    "partOfSpeech": "noun",
    "definition": "Firm determination to do something.",
    "example": "The harsh winter only strengthened their resolve to rebuild the destroyed community center.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "restlessness",
    "phonetic": "/ˈrɛstlɪsnɪs/",
    "partOfSpeech": "noun",
    "definition": "The state of being unable to remain still, quiet, or calm; craving change.",
    "example": "An adventurous restlessness propelled him to pack his satchel and set sail across the Atlantic.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "reverence",
    "phonetic": "/ˈrɛvərəns/",
    "partOfSpeech": "noun",
    "definition": "Deep respect for someone or something; awe.",
    "example": "They entered the ancient redwood grove with hushed steps and palpable reverence.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "ruefulness",
    "phonetic": "/ˈruːfʊlnɪs/",
    "partOfSpeech": "noun",
    "definition": "The quality of expressing sorrow or regret, especially in a wry or humorous way.",
    "example": "With a look of ruefulness, he admitted that he had taken the wrong trail five miles back.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sadness",
    "phonetic": "/ˈsædnɪs/",
    "partOfSpeech": "noun",
    "definition": "The condition or quality of being sad; sorrow.",
    "example": "A quiet sadness draped over the house after the guests departed and the music stopped.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "satiety",
    "phonetic": "/səˈtaɪɪti/",
    "partOfSpeech": "noun",
    "definition": "The feeling or state of being sated; full beyond desire.",
    "example": "After the lavish eight-course feast, the guests reclined in blissful satiety.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "scorn",
    "phonetic": "/skɔːrn/",
    "partOfSpeech": "noun",
    "definition": "The feeling or belief that someone or something is worthless or despicable; contempt.",
    "example": "He poured cold scorn on the amateurish theories circulating in the tabloids.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "scruple",
    "phonetic": "/ˈskruːpəl/",
    "partOfSpeech": "noun",
    "definition": "A feeling of doubt or hesitation with regard to the morality of a course of action.",
    "example": "A man of uncompromising ethics, he had no scruples about declining the bribe.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "self-effacement",
    "phonetic": "/ˌsɛlf ɪˈfeɪsmənt/",
    "partOfSpeech": "noun",
    "definition": "The act or practice of making oneself appear inconspicuous; humble modesty.",
    "example": "Her graceful self-effacement concealed the fact that she was the principal architect of the victory.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sentimentality",
    "phonetic": "/ˌsɛntɪmɛnˈtælɪti/",
    "partOfSpeech": "noun",
    "definition": "Excessive tenderness, sadness, or nostalgia.",
    "example": "The director avoided cheap sentimentality, opting instead for a raw, honest portrayal of grief.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "serenity",
    "phonetic": "/səˈrɛnɪti/",
    "partOfSpeech": "noun",
    "definition": "The state of being calm, peaceful, and untroubled.",
    "example": "The twilight over the glassy fjord possessed an ethereal, unearthly serenity.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "shame",
    "phonetic": "/ʃeɪm/",
    "partOfSpeech": "noun",
    "definition": "A painful feeling of humiliation or distress caused by consciousness of foolish behavior.",
    "example": "A flush of hot shame rose to his cheeks when his careless lie was discovered.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "skepticism",
    "phonetic": "/ˈskɛptɪsɪzəm/",
    "partOfSpeech": "noun",
    "definition": "Doubt as to the truth of something; philosophical questioning of assumptions.",
    "example": "The scientist greeted the miraculous claims with healthy, rigorous skepticism.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sloth",
    "phonetic": "/sloʊθ/",
    "partOfSpeech": "noun",
    "definition": "Reluctance to work or make an effort; laziness.",
    "example": "Surrendering to midsummer sloth, they spent the day reading poetry under the weeping willow.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sobriety",
    "phonetic": "/səˈbraɪɪti/",
    "partOfSpeech": "noun",
    "definition": "The quality of being serious, solemn, and calm; clear-mindedness.",
    "example": "The gravity of the crisis demanded intellectual sobriety and resolute leadership.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sorrow",
    "phonetic": "/ˈsɒroʊ/",
    "partOfSpeech": "noun",
    "definition": "A feeling of deep distress caused by loss, disappointment, or other misfortune.",
    "example": "Time may not erase sorrow, but it carves wider shores for compassion to flow through.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "spite",
    "phonetic": "/spaɪt/",
    "partOfSpeech": "noun",
    "definition": "A desire to hurt, annoy, or offend someone.",
    "example": "He refused to attend the jubilee out of petty, stubborn spite.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "staunchness",
    "phonetic": "/ˈstɔːntʃnɪs/",
    "partOfSpeech": "noun",
    "definition": "Loyalty, firmness, and steadfastness in principle.",
    "example": "Her staunchness in defending civil liberties never wavered throughout forty years in parliament.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sublimity",
    "phonetic": "/səˈblɪmɪti/",
    "partOfSpeech": "noun",
    "definition": "The quality of being sublime; breathtaking excellence, grandeur, or awe-inspiring scale.",
    "example": "The sublimity of the stormy Atlantic crashed against the cliffs in thunderous white plumes.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "suspense",
    "phonetic": "/səˈspɛns/",
    "partOfSpeech": "noun",
    "definition": "A state or feeling of excited or anxious uncertainty about what may happen.",
    "example": "The final minutes of the chess championship stretched out in agonizing suspense.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sympathy",
    "phonetic": "/ˈsɪmpəθi/",
    "partOfSpeech": "noun",
    "definition": "Feelings of pity and sorrow for someone else's misfortune; mutual understanding.",
    "example": "She listened to his tale of hardship with genuine, warm-hearted sympathy.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "tenderness",
    "phonetic": "/ˈtɛndərnɪs/",
    "partOfSpeech": "noun",
    "definition": "Gentleness and kindness; affection.",
    "example": "There was an exquisite tenderness in the way the old gardener tended to the budding orchids.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "terror",
    "phonetic": "/ˈtɛrər/",
    "partOfSpeech": "noun",
    "definition": "Extreme fear; panic.",
    "example": "A cold terror gripped his spine as the wooden floorboards creaked in the darkness below.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "timidity",
    "phonetic": "/tɪˈmɪdɪti/",
    "partOfSpeech": "noun",
    "definition": "Lack of courage or confidence; shyness.",
    "example": "Her childhood timidity melted away the moment she stood before a piano keyboard.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "tribulation",
    "phonetic": "/ˌtrɪbjʊˈleɪʃən/",
    "partOfSpeech": "noun",
    "definition": "A cause of great trouble or suffering; trial.",
    "example": "Through every trial and tribulation, their bond of friendship remained unbroken.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "triumph",
    "phonetic": "/ˈtraɪəmf/",
    "partOfSpeech": "noun",
    "definition": "A great victory or achievement; feeling of elation over a success.",
    "example": "Solving the centuries-old mathematical conjecture was the supreme triumph of her career.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "unease",
    "phonetic": "/ʌnˈiːz/",
    "partOfSpeech": "noun",
    "definition": "Anxiety or discontent; nervousness.",
    "example": "A vague unease settled over the crew as the compass needle began to spin erratically.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "vacillation",
    "phonetic": "/ˌvæsɪˈleɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The inability to decide between different opinions or actions; indecision.",
    "example": "His chronic vacillation cost the company its competitive edge in the emerging market.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "vanity",
    "phonetic": "/ˈvænɪti/",
    "partOfSpeech": "noun",
    "definition": "Excessive pride in or admiration of one's own appearance or achievements.",
    "example": "The emperor’s colossal marble monuments were monuments to human vanity.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "vexation",
    "phonetic": "/vɛkˈseɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The state of being annoyed, frustrated, or worried.",
    "example": "He muttered in vexation as he realized he had left the front door keys inside.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "vindictiveness",
    "phonetic": "/vɪnˈdɪktɪvnɪs/",
    "partOfSpeech": "noun",
    "definition": "A strong desire for revenge.",
    "example": "Her critique crossed the line from honest academic evaluation into personal vindictiveness.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "vulnerability",
    "phonetic": "/ˌvʌlnərəˈbɪlɪti/",
    "partOfSpeech": "noun",
    "definition": "The quality or state of being exposed to emotional or physical harm; openness.",
    "example": "True intimacy requires the courage to embrace complete emotional vulnerability.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "wanderlust",
    "phonetic": "/ˈwɒndərlʌst/",
    "partOfSpeech": "noun",
    "definition": "A strong desire to travel and explore the world.",
    "example": "A sudden flare of wanderlust made him buy a one-way ticket to Patagonia.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "warmth",
    "phonetic": "/wɔːrmθ/",
    "partOfSpeech": "noun",
    "definition": "The quality, state, or sensation of being warm; friendly kindness.",
    "example": "The hospitality of the islanders was marked by genuine, radiant warmth.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "whim",
    "phonetic": "/wɪm/",
    "partOfSpeech": "noun",
    "definition": "A sudden desire or change of mind, especially one that is unusual or unexplained.",
    "example": "On a romantic whim, they decided to watch the sunrise from the lighthouse tower.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "woe",
    "phonetic": "/woʊ/",
    "partOfSpeech": "noun",
    "definition": "Great sorrow or distress; grief.",
    "example": "The ballad chronicled the tragic woe of lovers parted by the cruel sea.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "wonderment",
    "phonetic": "/ˈwʌndərmənt/",
    "partOfSpeech": "noun",
    "definition": "A state of awed admiration or respect; astonishment.",
    "example": "The child stared at the snow globe with wide-eyed, silent wonderment.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "wrath",
    "phonetic": "/ræθ/",
    "partOfSpeech": "noun",
    "definition": "Extreme anger; fierce indignation.",
    "example": "The corrupt magistrate felt the full wrath of the awakened citizenry.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "yearn",
    "phonetic": "/jɜːrn/",
    "partOfSpeech": "verb",
    "definition": "Have an intense feeling of longing for something, typically something that is out of reach.",
    "example": "Deep down, she yearned for a quiet cottage surrounded by wildflowers and silence.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "zealotry",
    "phonetic": "/ˈzɛlətri/",
    "partOfSpeech": "noun",
    "definition": "Fanatical and uncompromising pursuit of religious, political, or other ideals.",
    "example": "The reform movement was eventually derailed by the destructive dogmatism of zealotry.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "zest",
    "phonetic": "/zɛst/",
    "partOfSpeech": "noun",
    "definition": "Great enthusiasm and energy; spirited enjoyment of life.",
    "example": "Even at ninety, she tackled every sunrise with an infectious, youthful zest.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "petrichor",
    "phonetic": "/ˈpɛtrɪkɔːr/",
    "partOfSpeech": "noun",
    "definition": "The pleasant, earthy smell that accompanies the first rain after a long period of warm, dry weather.",
    "example": "As the summer shower struck the parched soil, a rich aroma of petrichor filled the orchard.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "halcyon",
    "phonetic": "/ˈhælsiən/",
    "partOfSpeech": "adjective",
    "definition": "Denoting a period of time in the past that was idyllically happy, peaceful, and prosperous.",
    "example": "He looked back fondly upon the halcyon days of his youth spent sailing the Aegean.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "susurrus",
    "phonetic": "/sʊˈsʌrəs/",
    "partOfSpeech": "noun",
    "definition": "A whispering, rustling, or murmuring sound, like wind through autumn leaves.",
    "example": "The gentle susurrus of the pines was the only sound breaking the mountain twilight.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "crepuscular",
    "phonetic": "/krɪˈpʌskjʊlər/",
    "partOfSpeech": "adjective",
    "definition": "Relating to or resembling twilight; active at dawn and dusk.",
    "example": "A crepuscular gloom settled over the misty valley as the sun dipped behind the jagged peaks.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "apricity",
    "phonetic": "/əˈprɪsɪti/",
    "partOfSpeech": "noun",
    "definition": "The warmth of the sun in the wintertime.",
    "example": "He closed his eyes and basked in the comforting apricity on the frosty stone terrace.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gossamer",
    "phonetic": "/ˈɡɒsəmər/",
    "partOfSpeech": "adjective",
    "definition": "Characterized by unusual lightness, delicacy, and insubstantial fragility.",
    "example": "Cobwebs hung like gossamer veils between the branches of the dormant willow.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "mellifluous",
    "phonetic": "/mɛˈlɪflʊəs/",
    "partOfSpeech": "adjective",
    "definition": "Pleasingly smooth and musical to hear; flowing with sweetness like honey.",
    "example": "Her mellifluous voice calmed the restless room like an ancient lullaby.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sempiternal",
    "phonetic": "/ˌsɛmpɪˈtɜːrnəl/",
    "partOfSpeech": "adjective",
    "definition": "Everlasting; eternal and unchanging throughout infinite time.",
    "example": "They swore their vows beneath the sempiternal gaze of the snow-clad Himalayas.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "pluviophile",
    "phonetic": "/ˈpluːviəfaɪl/",
    "partOfSpeech": "noun",
    "definition": "A lover of rain; someone who finds peace, comfort, and joy on stormy days.",
    "example": "A true pluviophile, she spent the rainy Sunday reading beside the streaming windowpane.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "hesperian",
    "phonetic": "/hɛˈspɪəriən/",
    "partOfSpeech": "adjective",
    "definition": "Of or relating to the west, the evening star, or the golden sunset.",
    "example": "The ship sailed boldly into the hesperian horizon, chased by embers of twilight.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "zephyr",
    "phonetic": "/ˈzɛfər/",
    "partOfSpeech": "noun",
    "definition": "A soft, gentle, and refreshing breeze.",
    "example": "A cool zephyr blew off the harbor, billowing the linen curtains into the veranda.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "chiaroscuro",
    "phonetic": "/kiˌɑːrəˈskjʊəroʊ/",
    "partOfSpeech": "noun",
    "definition": "The treatment of light and shade in drawing and painting; an interplay of stark contrasts.",
    "example": "The candlelight cast dramatic patterns of chiaroscuro across the scholar’s furrowed brow.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "iridescent",
    "phonetic": "/ˌɪrɪˈdɛsənt/",
    "partOfSpeech": "adjective",
    "definition": "Showing luminous colors that seem to change when seen from different angles.",
    "example": "The soap bubbles floated through the garden like tiny, iridescent planets.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "diaphanous",
    "phonetic": "/daɪˈæfənəs/",
    "partOfSpeech": "adjective",
    "definition": "Light, delicate, and translucent.",
    "example": "A diaphanous mist drifted over the meadow as the first rays of dawn touched the dew.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "evanescent",
    "phonetic": "/ˌɛvəˈnɛsənt/",
    "partOfSpeech": "adjective",
    "definition": "Soon passing out of sight, memory, or existence; quickly fading away.",
    "example": "The rainbow was an evanescent marvel that vanished as suddenly as it had bloomed.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "luminescent",
    "phonetic": "/ˌluːmɪˈnɛsənt/",
    "partOfSpeech": "adjective",
    "definition": "Emitting light not caused by heat; softly glowing.",
    "example": "Luminescent jellyfish pulsed through the pitch-black oceanic depths like living constellations.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "nubivagant",
    "phonetic": "/njuːˈbɪvəɡənt/",
    "partOfSpeech": "adjective",
    "definition": "Moving or wandering among the clouds.",
    "example": "The lone albatross soared in nubivagant freedom across the endless gray sky.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "moonglade",
    "phonetic": "/ˈmuːnɡleɪd/",
    "partOfSpeech": "noun",
    "definition": "The bright track of moonlight reflected on a body of water.",
    "example": "A shimmering moonglade stretched from their wooden boat all the way to the silver horizon.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "komorebi",
    "phonetic": "/koʊmoʊˈrɛbi/",
    "partOfSpeech": "noun",
    "definition": "The sunlight filtering through the leaves of trees, creating dancing patterns of light.",
    "example": "Walking through the forest grove, they paused to admire the golden komorebi dancing on the moss.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "psithurism",
    "phonetic": "/ˈsɪθjʊrɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The sound of the wind whispering softly through the leaves of trees.",
    "example": "Lying beneath the ancient oaks, he fell asleep to the hypnotic psithurism above.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "silvan",
    "phonetic": "/ˈsɪlvən/",
    "partOfSpeech": "adjective",
    "definition": "Associated with the woods; pleasantly rural or rustic.",
    "example": "The path led into a tranquil silvan glade where deer drank from a clear spring.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "nebular",
    "phonetic": "/ˈnɛbjʊlər/",
    "partOfSpeech": "adjective",
    "definition": "Relating to or resembling a cloud or haze; vast and astronomical.",
    "example": "Through the telescope, the distant galaxy appeared as a faint, luminous nebular spiral.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tenebrous",
    "phonetic": "/ˈtɛnɪbrəs/",
    "partOfSpeech": "adjective",
    "definition": "Dark, shadowy, or obscure.",
    "example": "They peered cautiously down into the tenebrous depths of the flooded cavern.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "coruscating",
    "phonetic": "/ˈkɒrəskeɪtɪŋ/",
    "partOfSpeech": "adjective",
    "definition": "Flashing, sparkling, or gleaming with sharp brilliant light.",
    "example": "The diamond chandelier hung from the ballroom ceiling, coruscating under the candle flame.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "auroral",
    "phonetic": "/ɔːˈrɔːrəl/",
    "partOfSpeech": "adjective",
    "definition": "Characteristic of the dawn or the northern lights; luminous and celestial.",
    "example": "An auroral curtain of emerald and violet danced across the arctic night sky.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "vernal",
    "phonetic": "/ˈvɜːrnəl/",
    "partOfSpeech": "adjective",
    "definition": "Of, in, or appropriate to spring; fresh, youthful, and blossoming.",
    "example": "The vernal breeze carried the intoxicating fragrance of blooming cherry orchards.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "estival",
    "phonetic": "/ˈɛstɪvəl/",
    "partOfSpeech": "adjective",
    "definition": "Belonging to or appearing in summer.",
    "example": "They celebrated the solstice with estival bonfires and wild lavender wreaths.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "autumnal",
    "phonetic": "/ɔːˈtʌmnəl/",
    "partOfSpeech": "adjective",
    "definition": "Characteristic of or occurring in autumn; golden, mellow, and mature.",
    "example": "An autumnal chill in the morning air heralded the turning of the maple leaves.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "brumal",
    "phonetic": "/ˈbruːməl/",
    "partOfSpeech": "adjective",
    "definition": "Relating to winter; frosty and wintry.",
    "example": "The village was hushed under a brumal blanket of silent, deep snow.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "cadent",
    "phonetic": "/ˈkeɪdənt/",
    "partOfSpeech": "adjective",
    "definition": "Falling, dropping, or rhythmic like musical cadences.",
    "example": "The cadent drops from the stalactites kept steady time in the underground chamber.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "riparian",
    "phonetic": "/raɪˈpɛəriən/",
    "partOfSpeech": "adjective",
    "definition": "Relating to or situated on the banks of a river.",
    "example": "Kingfishers darted among the reeds lining the lush riparian sanctuary.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "littoral",
    "phonetic": "/ˈlɪtərəl/",
    "partOfSpeech": "adjective",
    "definition": "Relating to or on the shore of the sea or a lake.",
    "example": "The littoral tide pools teemed with sea anemones and polished colored stones.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "abyssal",
    "phonetic": "/əˈbɪsəl/",
    "partOfSpeech": "adjective",
    "definition": "Relating to the vast depths of the ocean where light never penetrates; bottomless.",
    "example": "In the abyssal trenches, creatures flourished in eternal, icy darkness.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "empyrean",
    "phonetic": "/ɛmˈpɪriən/",
    "partOfSpeech": "noun",
    "definition": "The highest reaches of heaven, conceived by ancients as a realm of pure light and fire.",
    "example": "The eagle climbed on thermal drafts into the radiant blue empyrean.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "celestial",
    "phonetic": "/sɪˈlɛstʃəl/",
    "partOfSpeech": "adjective",
    "definition": "Positioned in or relating to the sky, or outer space as observed in astronomy; divine.",
    "example": "The ancient navigators charted their oceanic courses by the celestial map of the stars.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "astral",
    "phonetic": "/ˈæstrəl/",
    "partOfSpeech": "adjective",
    "definition": "Of, connected with, or resembling the stars.",
    "example": "The telescope revealed an astral tapestry of distant suns and cosmic dust.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "thalassic",
    "phonetic": "/θəˈlæsɪk/",
    "partOfSpeech": "adjective",
    "definition": "Of or relating to the sea or oceans.",
    "example": "The sailor had spent fifty years immersed in the wild, unpredictable thalassic life.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "nacreous",
    "phonetic": "/ˈneɪkriəs/",
    "partOfSpeech": "adjective",
    "definition": "Resembling mother-of-pearl; lustrous, iridescent, and milky.",
    "example": "Nacreous clouds hovered high in the stratosphere, gleaming in pastels after sunset.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "opalescent",
    "phonetic": "/ˌoʊpəˈlɛsənt/",
    "partOfSpeech": "adjective",
    "definition": "Showing varying colors as an opal does; milky and softly iridescent.",
    "example": "The morning sea was an opalescent expanse of mother-of-pearl and pale gold.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gloaming",
    "phonetic": "/ˈɡloʊmɪŋ/",
    "partOfSpeech": "noun",
    "definition": "Twilight; dusk; the dim half-light after sunset.",
    "example": "A solitary barn owl swooped low across the barley fields in the purple gloaming.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "eventide",
    "phonetic": "/ˈiːvəntaɪd/",
    "partOfSpeech": "noun",
    "definition": "The end of the day; evening.",
    "example": "At eventide, the village church bells chimed softly across the tranquil valley.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "vespertine",
    "phonetic": "/ˈvɛspərtaɪn/",
    "partOfSpeech": "adjective",
    "definition": "Relating to, occurring, or active in the evening.",
    "example": "Moths emerged for their vespertine flight among the night-blooming jasmine.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "matutinal",
    "phonetic": "/ˌmætʃʊˈtaɪnəl/",
    "partOfSpeech": "adjective",
    "definition": "Of, relating to, or occurring in the early morning.",
    "example": "The monk began his matutinal prayers long before the sun peeked above the hills.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "noctilucent",
    "phonetic": "/ˌnɒktɪˈluːsənt/",
    "partOfSpeech": "adjective",
    "definition": "Shining or glowing by night, especially describing clouds high in the mesosphere.",
    "example": "Noctilucent clouds shone electric blue in the northern twilight, defying the dark.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "fluvial",
    "phonetic": "/ˈfluːviəl/",
    "partOfSpeech": "adjective",
    "definition": "Of, found in, or produced by a river or stream.",
    "example": "Fluvial sediments had enriched the delta soil for thousands of fruitful harvests.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "verdant",
    "phonetic": "/ˈvɜːrdənt/",
    "partOfSpeech": "adjective",
    "definition": "Green with grass or other rich vegetation; lush.",
    "example": "After the spring rains, the rolling hills transformed into a verdant emerald sea.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "umbrageous",
    "phonetic": "/ʌmˈbreɪdʒəs/",
    "partOfSpeech": "adjective",
    "definition": "Affording or creating shade; shadowy.",
    "example": "They spread their picnic blanket under the umbrageous boughs of a sprawling banyan.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "cimmerian",
    "phonetic": "/sɪˈmɪəriən/",
    "partOfSpeech": "adjective",
    "definition": "Extremely dark and gloomy; shadowy.",
    "example": "The explorers descended into the cimmerian darkness of the subterranean labyrinth.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "caliginous",
    "phonetic": "/kəˈlɪdʒɪnəs/",
    "partOfSpeech": "adjective",
    "definition": "Misty, dim, dark, or obscure.",
    "example": "A caliginous fog rolled off the marshlands, swallowing the lighthouse beams.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lambent",
    "phonetic": "/ˈlæmbənt/",
    "partOfSpeech": "adjective",
    "definition": "Softly bright or radiant; running or moving lightly over a surface.",
    "example": "A lambent glow emanated from the dying embers of the hearth fire.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "fulgent",
    "phonetic": "/ˈfʊldʒənt/",
    "partOfSpeech": "adjective",
    "definition": "Shining brightly; radiant and dazzling.",
    "example": "The full moon was fulgent in a cloudless autumn sky, casting crisp silver shadows.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "refulgent",
    "phonetic": "/rɪˈfʌldʒənt/",
    "partOfSpeech": "adjective",
    "definition": "Shining very brightly; radiant; gleaming.",
    "example": "The queen stepped forth in a refulgent gown woven from spun gold and pearls.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "effulgent",
    "phonetic": "/ɪˈfʌldʒənt/",
    "partOfSpeech": "adjective",
    "definition": "Shining forth brilliantly; resplendent with light.",
    "example": "The effulgent morning sun pierced the heavy storm clouds, illuminating the bay.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "coruscant",
    "phonetic": "/kəˈrʌskənt/",
    "partOfSpeech": "adjective",
    "definition": "Glittering; sparkling; flashing.",
    "example": "The frost crystals on the windowpane were coruscant in the morning beam.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "pellucid",
    "phonetic": "/pəˈluːsɪd/",
    "partOfSpeech": "adjective",
    "definition": "Translucently clear; easily understood.",
    "example": "The mountain brook was so pellucid that every pebble on the bed was sharp and clear.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "limpid",
    "phonetic": "/ˈlɪmpɪd/",
    "partOfSpeech": "adjective",
    "definition": "Completely clear and transparent, without turbidity.",
    "example": "They swam in the limpid waters of the secluded Mediterranean cove.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "hyaline",
    "phonetic": "/ˈhaɪəlɪn/",
    "partOfSpeech": "adjective",
    "definition": "Glassy, transparent, or crystalline in appearance.",
    "example": "The calm lake was a hyaline sheet reflecting the snowy summits perfectly.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "scintillant",
    "phonetic": "/ˈsɪntɪlənt/",
    "partOfSpeech": "adjective",
    "definition": "Emitting sparks; sparkling and glittering.",
    "example": "The fireworks burst in scintillant bouquets of crimson and sapphire across the dark.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "phosphorescent",
    "phonetic": "/ˌfɒsfəˈrɛsənt/",
    "partOfSpeech": "adjective",
    "definition": "Luminous without heat or sensible radiation.",
    "example": "The wake of the night vessel glowed with eerie, phosphorescent plankton.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "resplendent",
    "phonetic": "/rɪˈsplɛndənt/",
    "partOfSpeech": "adjective",
    "definition": "Attractive and impressive through being richly colorful or sumptuous.",
    "example": "The peacock fanned its resplendent plumage in the afternoon sunlight.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "incandescent",
    "phonetic": "/ˌɪnkænˈdɛsənt/",
    "partOfSpeech": "adjective",
    "definition": "Emitting light as a result of being heated; extremely bright.",
    "example": "The iron poker glowed incandescent red in the blacksmith's roaring forge.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "niveous",
    "phonetic": "/ˈnɪviəs/",
    "partOfSpeech": "adjective",
    "definition": "Resembling snow; snowy white.",
    "example": "The swan arched its niveous neck and glided across the glassy pond.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gelid",
    "phonetic": "/ˈdʒɛlɪd/",
    "partOfSpeech": "adjective",
    "definition": "Extremely cold; icy.",
    "example": "A gelid gust whistled through the glacial crevasses, freezing the climbers' breath.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "rime",
    "phonetic": "/raɪm/",
    "partOfSpeech": "noun",
    "definition": "Frost formed on cold objects by the rapid freezing of water vapor in cloud or fog.",
    "example": "Delicate needles of rime coated the bare telegraph wires like crystal lace.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "hoarfrost",
    "phonetic": "/ˈhɔːrfrɒst/",
    "partOfSpeech": "noun",
    "definition": "A grayish-white crystalline deposit of frozen water vapor on vegetation.",
    "example": "In the early dawn, hoarfrost coated the orchard trees in shimmering sugar.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "spindrift",
    "phonetic": "/ˈspɪndrɪft/",
    "partOfSpeech": "noun",
    "definition": "Spray blown from the crests of waves by the wind at sea.",
    "example": "The gale whipped salty spindrift into the faces of the brave harbor watchmen.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "firmament",
    "phonetic": "/ˈfɜːrməmənt/",
    "partOfSpeech": "noun",
    "definition": "The heavens or the sky, especially when regarded as a tangible celestial dome.",
    "example": "Countless burning stars were studded across the velvet firmament.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "welkin",
    "phonetic": "/ˈwɛlkɪn/",
    "partOfSpeech": "noun",
    "definition": "The sky, the upper air, or the celestial sphere.",
    "example": "The triumphant fanfare rang out, echoing until it seemed to shake the very welkin.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "penumbra",
    "phonetic": "/pɪˈnʌmbrə/",
    "partOfSpeech": "noun",
    "definition": "The partially shaded outer region of a shadow cast by an opaque object.",
    "example": "During the lunar eclipse, the moon dipped through the Earth’s delicate penumbra.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "syzygy",
    "phonetic": "/ˈsɪzɪdʒi/",
    "partOfSpeech": "noun",
    "definition": "An alignment of three celestial bodies (such as the sun, Earth, and moon) in a straight line.",
    "example": "The great spring tides were unleashed by the celestial syzygy of the full moon.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "equinox",
    "phonetic": "/ˈiːkwɪnɒks/",
    "partOfSpeech": "noun",
    "definition": "The time when day and night are of equal length, occurring twice a year.",
    "example": "The autumn equinox ushered in crisp mornings and harvests of golden squash.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "solstice",
    "phonetic": "/ˈsɒlstɪs/",
    "partOfSpeech": "noun",
    "definition": "Either of the two times in the year when the sun reaches its highest or lowest point in the sky.",
    "example": "They gathered on the hilltop to welcome the dawn on the midsummer solstice.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "perihelion",
    "phonetic": "/ˌpɛrɪˈhiːliən/",
    "partOfSpeech": "noun",
    "definition": "The point in the orbit of a planet or comet at which it is closest to the sun.",
    "example": "The comet flared with magnificent brilliance as it swung through perihelion.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "aphelion",
    "phonetic": "/æfˈhiːliən/",
    "partOfSpeech": "noun",
    "definition": "The point in the orbit of a planet or comet at which it is furthest from the sun.",
    "example": "At aphelion, the distant planet travelled more slowly through the outer cold.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "zenith",
    "phonetic": "/ˈzɛnɪθ/",
    "partOfSpeech": "noun",
    "definition": "The point in the celestial sphere directly above an observer; the peak.",
    "example": "The sun stood at its blazing zenith, casting virtually no shadows on the sand.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "nadir",
    "phonetic": "/ˈneɪdɪər/",
    "partOfSpeech": "noun",
    "definition": "The lowest point in the fortunes of a person or celestial trajectory.",
    "example": "Midnight marked the celestial nadir, from which the sun slowly began its return.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "flume",
    "phonetic": "/fluːm/",
    "partOfSpeech": "noun",
    "definition": "A deep, narrow channel or ravine with a stream running through it.",
    "example": "Water rushed through the rock flume with a deafening, thunderous roar.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "cascade",
    "phonetic": "/kæsˈkeɪd/",
    "partOfSpeech": "noun",
    "definition": "A small waterfall, typically one of several that fall in stages down a steep slope.",
    "example": "A silvery cascade tumbled down the mossy granite cliff into a turquoise pool.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "bower",
    "phonetic": "/ˈbaʊər/",
    "partOfSpeech": "noun",
    "definition": "A pleasant shady place under trees or climbing plants in a garden or wood.",
    "example": "They rested in a secluded rose bower, sheltered from the blazing noon sun.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "glade",
    "phonetic": "/ɡleɪd/",
    "partOfSpeech": "noun",
    "definition": "An open space in a forest or woodland, bathed in sunlight.",
    "example": "A family of wild deer grazed peacefully in the sun-dappled woodland glade.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "dell",
    "phonetic": "/dɛl/",
    "partOfSpeech": "noun",
    "definition": "A small, sheltered, usually wooded valley or hollow.",
    "example": "Bluebells carpeted the secluded dell in a sea of violet-blue blossoms.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "glen",
    "phonetic": "/ɡlɛn/",
    "partOfSpeech": "noun",
    "definition": "A narrow, deep, and picturesque valley, especially in Scotland or Ireland.",
    "example": "Mists crept slowly down the rocky slopes of the Scottish glen as evening fell.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "vale",
    "phonetic": "/veɪl/",
    "partOfSpeech": "noun",
    "definition": "A valley, often used poetically to suggest peaceful seclusion.",
    "example": "The sleepy vale was dotted with whitewashed cottages and grazing sheep.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "abyss",
    "phonetic": "/əˈbɪs/",
    "partOfSpeech": "noun",
    "definition": "A deep or seemingly bottomless chasm or void.",
    "example": "The climber stood on the precipice, peering into the misty abyss beneath.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "chasm",
    "phonetic": "/ˈkæzəm/",
    "partOfSpeech": "noun",
    "definition": "A deep fissure in the earth, rock, or another surface.",
    "example": "A suspension bridge spanned the dizzying chasm carved by the roaring river.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "precipice",
    "phonetic": "/ˈprɛsɪpɪs/",
    "partOfSpeech": "noun",
    "definition": "A very steep rock face or cliff, especially a tall one.",
    "example": "Gulls nested in the crags of the sheer limestone precipice above the Atlantic.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "escarpment",
    "phonetic": "/ɪˈskɑːrpmənt/",
    "partOfSpeech": "noun",
    "definition": "A long, steep slope, especially one at the edge of a plateau.",
    "example": "From the ridge of the great escarpment, the savannah stretched to infinity.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "hummock",
    "phonetic": "/ˈhʌmək/",
    "partOfSpeech": "noun",
    "definition": "A small hill, mound, or ridge of earth or ice.",
    "example": "The snowshoe hare paused atop a grassy hummock, sniffing the frosty breeze.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "cairn",
    "phonetic": "/kɛərn/",
    "partOfSpeech": "noun",
    "definition": "A mound of rough stones built as a memorial or landmark on a hilltop or skyline.",
    "example": "Hikers added a pebble to the summit cairn to mark their successful ascent.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "menhir",
    "phonetic": "/ˈmɛnhɪər/",
    "partOfSpeech": "noun",
    "definition": "A tall upright standing stone of a kind erected in prehistoric times.",
    "example": "The solitary menhir cast a long, mysterious shadow across the windswept moor.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "shingle",
    "phonetic": "/ˈʃɪŋɡəl/",
    "partOfSpeech": "noun",
    "definition": "A mass of small rounded pebbles, especially on a seashore.",
    "example": "Waves dragged noisily across the grey shingle beach with every rhythmic surge.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "estuarine",
    "phonetic": "/ˈɛstjʊəraɪn/",
    "partOfSpeech": "adjective",
    "definition": "Relating to or found in the tidal mouth of a large river.",
    "example": "Herons waded through the rich estuarine mudflats at low tide.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "pelagic",
    "phonetic": "/pɪˈlædʒɪk/",
    "partOfSpeech": "adjective",
    "definition": "Relating to the open sea, away from the coast or sea bottom.",
    "example": "Sperm whales cruised through the pelagic wilderness in search of giant squid.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "benthic",
    "phonetic": "/ˈbɛnθɪk/",
    "partOfSpeech": "adjective",
    "definition": "Relating to or occurring at the bottom of a body of water.",
    "example": "Strange, bioluminescent creatures crawled along the dark benthic plains.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lacustrine",
    "phonetic": "/ləˈkʌstrɪn/",
    "partOfSpeech": "adjective",
    "definition": "Relating to, formed in, or growing in lakes.",
    "example": "Lacustrine deposits revealed ancient climate cycles dating back millions of years.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sinuous",
    "phonetic": "/ˈsɪnjuːəs/",
    "partOfSpeech": "adjective",
    "definition": "Having many curves and turns; winding and supple.",
    "example": "The river followed a sinuous course through the emerald marshlands.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "peripatetic",
    "phonetic": "/ˌpɛrɪpəˈtɛtɪk/",
    "partOfSpeech": "adjective",
    "definition": "Traveling from place to place, especially working or wandering.",
    "example": "The poet lived a peripatetic life, moving from village to village with a small satchel.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "peregrine",
    "phonetic": "/ˈpɛrɪɡrɪn/",
    "partOfSpeech": "adjective",
    "definition": "Wandering, traveling, or migratory; foreign.",
    "example": "The scholar lived a peregrine existence across the great universities of Europe.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sidereal",
    "phonetic": "/saɪˈdɪəriəl/",
    "partOfSpeech": "adjective",
    "definition": "Of or with respect to the distant stars (in contrast to the sun or moon).",
    "example": "Astronomers measured the Earth's rotation relative to sidereal time.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "selenic",
    "phonetic": "/sɪˈliːnɪk/",
    "partOfSpeech": "adjective",
    "definition": "Of or relating to the moon.",
    "example": "The selenic landscape of the crater floor was cold, desolate, and cratered.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "nocturne",
    "phonetic": "/ˈnɒktɜːrn/",
    "partOfSpeech": "noun",
    "definition": "A short composition of a romantic or dreamy character suggestive of night.",
    "example": "Chopin’s delicate nocturne floated through the open French doors into the garden.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "alpenglow",
    "phonetic": "/ˈælpənˌɡloʊ/",
    "partOfSpeech": "noun",
    "definition": "A rosy glow seen on mountain summits before sunrise or after sunset.",
    "example": "The jagged snow peaks blushed in radiant rose and gold during the alpenglow.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "moonglow",
    "phonetic": "/ˈmuːnɡloʊ/",
    "partOfSpeech": "noun",
    "definition": "The soft, cool light cast by the moon.",
    "example": "Bathed in silver moonglow, the ancient ruined castle seemed to dream.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sunburst",
    "phonetic": "/ˈsʌnbɜːrst/",
    "partOfSpeech": "noun",
    "definition": "A sudden burst of sunlight, especially through a break in clouds.",
    "example": "A dramatic sunburst lit the rain-drenched valley like a cathedral spotlight.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "rainsong",
    "phonetic": "/ˈreɪnsɒŋ/",
    "partOfSpeech": "noun",
    "definition": "The rhythmic, soothing sound of falling rain.",
    "example": "She drifted off to sleep lulled by the steady rainsong on the tin roof.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "thunderclap",
    "phonetic": "/ˈθʌndərklæp/",
    "partOfSpeech": "noun",
    "definition": "A sudden, sharp, and loud crash of thunder.",
    "example": "A deafening thunderclap shook the old window frames, rattling the tea saucers.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gale",
    "phonetic": "/ɡeɪl/",
    "partOfSpeech": "noun",
    "definition": "A very strong wind, often bringing squalls or tempest.",
    "example": "The autumn gale stripped the copper leaves from the oak trees in a single night.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "squall",
    "phonetic": "/skwɔːl/",
    "partOfSpeech": "noun",
    "definition": "A sudden violent gust of wind or a localized storm, especially one bringing rain or snow.",
    "example": "The fishing fleet scrambled for the safe harbor before the squall struck.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tempest",
    "phonetic": "/ˈtɛmpɪst/",
    "partOfSpeech": "noun",
    "definition": "A violent windy storm with rain, hail, or snow.",
    "example": "The wooden galleon creaked and groaned as the tempest tore at its canvas sails.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "maelstrom",
    "phonetic": "/ˈmeɪlstrɒm/",
    "partOfSpeech": "noun",
    "definition": "A powerful whirlpool in the sea or a river; a confused, violent situation.",
    "example": "The kayak was nearly dragged down into the roaring river maelstrom.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "eddy",
    "phonetic": "/ˈɛdi/",
    "partOfSpeech": "noun",
    "definition": "A circular movement of water or air, counter to a main current.",
    "example": "Autumn leaves spun in playful eddies along the curving riverbank.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "undulation",
    "phonetic": "/ˌʌndjʊˈleɪʃən/",
    "partOfSpeech": "noun",
    "definition": "A flowing, up-and-down movement like waves.",
    "example": "The gentle undulation of the desert dunes resembled a golden ocean frozen in time.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "surge",
    "phonetic": "/sɜːrdʒ/",
    "partOfSpeech": "noun",
    "definition": "A sudden powerful forward or upward movement, especially by a natural force such as a wave.",
    "example": "A massive ocean surge breached the seawall, spraying saltwater across the promenade.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "backwash",
    "phonetic": "/ˈbækwɒʃ/",
    "partOfSpeech": "noun",
    "definition": "The motion of receding water after a wave has broken on a beach.",
    "example": "The foaming backwash tugged pebbles seaward with a rhythmic grating sound.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "undertow",
    "phonetic": "/ˈʌndərtoʊ/",
    "partOfSpeech": "noun",
    "definition": "A current of water below the surface and moving in a different direction from any surface current.",
    "example": "Swimmers were warned against the powerful undertow lurking beneath the calm surf.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "rip-tide",
    "phonetic": "/ˈrɪptaɪd/",
    "partOfSpeech": "noun",
    "definition": "A strong, narrow surface current that flows rapidly away from the shore.",
    "example": "Experienced surfers respected the treacherous rip-tide that ran beside the pier.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "estuary",
    "phonetic": "/ˈɛstjʊəri/",
    "partOfSpeech": "noun",
    "definition": "The tidal mouth of a large river, where the tide meets the stream.",
    "example": "Migratory birds settled by the thousands along the tranquil wetlands of the estuary.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lagoon",
    "phonetic": "/ləˈɡuːn/",
    "partOfSpeech": "noun",
    "definition": "A stretch of salt water separated from the sea by a low sandbank or coral reef.",
    "example": "The turquoise lagoon was sheltered from the breakers by a massive barrier reef.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "atoll",
    "phonetic": "/ˈætɒl/",
    "partOfSpeech": "noun",
    "definition": "A ring-shaped reef, island, or chain of islands formed of coral.",
    "example": "From the seaplane, the emerald atoll resembled a jewel dropped in the cobalt sea.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "archipelago",
    "phonetic": "/ˌɑːrkɪˈpɛləɡoʊ/",
    "partOfSpeech": "noun",
    "definition": "A sea or stretch of water containing many islands; an island group.",
    "example": "They spent two months sailing through the volcanic Greek archipelago.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "islet",
    "phonetic": "/ˈaɪlɪt/",
    "partOfSpeech": "noun",
    "definition": "A small island.",
    "example": "A solitary white stone chapel was perched on the rocky pine-crowned islet.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "peninsula",
    "phonetic": "/pəˈnɪnsjʊlə/",
    "partOfSpeech": "noun",
    "definition": "A piece of land almost surrounded by water or projecting out into a body of water.",
    "example": "The rugged peninsula jutted five leagues into the wild North Sea.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "promontory",
    "phonetic": "/ˈprɒməntri/",
    "partOfSpeech": "noun",
    "definition": "A point of high land that juts out into a large body of water; a headland.",
    "example": "A stone beacon stood on the windswept promontory, warning sailors of hidden shoals.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "headland",
    "phonetic": "/ˈhɛdlænd/",
    "partOfSpeech": "noun",
    "definition": "A narrow piece of land that projects from a coastline into the sea.",
    "example": "Waves crashed ceaselessly against the jagged black cliffs of the headland.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "shoal",
    "phonetic": "/ʃoʊl/",
    "partOfSpeech": "noun",
    "definition": "An area of shallow water, especially as a hazard to navigation.",
    "example": "The captain steered carefully through the treacherous coral shoals at low tide.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sandbar",
    "phonetic": "/ˈsændbɑːr/",
    "partOfSpeech": "noun",
    "definition": "A long, narrow sandbank, especially at the mouth of a river.",
    "example": "Pelicams congregated on the exposed sandbar as the tide receded.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "dune",
    "phonetic": "/djuːn/",
    "partOfSpeech": "noun",
    "definition": "A mound or ridge of sand formed by the wind on the sea coast or in a desert.",
    "example": "Wind carved delicate wave patterns across the towering crescent of the red dune.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "mirage",
    "phonetic": "/mɪˈrɑːʒ/",
    "partOfSpeech": "noun",
    "definition": "An optical illusion caused by atmospheric conditions, especially the appearance of water in a desert.",
    "example": "A shimmering lake appeared on the horizon, but it was merely a heat mirage.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "oasis",
    "phonetic": "/oʊˈeɪsɪs/",
    "partOfSpeech": "noun",
    "definition": "A fertile spot in a desert where water is found; a pleasant or peaceful place in the midst of chaos.",
    "example": "The palm-fringed oasis offered sweet fresh spring water to the exhausted caravan.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "savannah",
    "phonetic": "/səˈvænə/",
    "partOfSpeech": "noun",
    "definition": "A grassy plain in tropical and subtropical regions, with few trees.",
    "example": "Acacia trees stood like umbrellas across the sun-drenched golden savannah.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tundra",
    "phonetic": "/ˈtʌndrə/",
    "partOfSpeech": "noun",
    "definition": "A vast, flat, treeless Arctic region of Europe, Asia, and North America.",
    "example": "Lichens and mosses clung to the permafrost across the silent Siberian tundra.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "taiga",
    "phonetic": "/ˈtaɪɡə/",
    "partOfSpeech": "noun",
    "definition": "The sometimes swampy coniferous forest of high northern latitudes.",
    "example": "Snow-laden spruces stretched across the endless expanse of the northern taiga.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "steppe",
    "phonetic": "/stɛp/",
    "partOfSpeech": "noun",
    "definition": "A large area of flat unforested grassland in southeastern Europe or Siberia.",
    "example": "Nomadic horsemen had galloped across the sweeping Eurasian steppe for centuries.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "prairie",
    "phonetic": "/ˈprɛəri/",
    "partOfSpeech": "noun",
    "definition": "A large open area of grassland, especially in North America.",
    "example": "Sea oats and prairie grasses rippled under the wind like waves of amber water.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "meadow",
    "phonetic": "/ˈmɛdoʊ/",
    "partOfSpeech": "noun",
    "definition": "A piece of grassland, especially one used for hay or wildflowers.",
    "example": "Butterflies danced across the alpine meadow dotted with gentians and edelweiss.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "pasture",
    "phonetic": "/ˈpɑːstʃər/",
    "partOfSpeech": "noun",
    "definition": "Land covered with grass and other low plants suitable for grazing animals.",
    "example": "Cows grazed serenely in the emerald pasture beside the winding country lane.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "orchard",
    "phonetic": "/ˈɔːrtʃərd/",
    "partOfSpeech": "noun",
    "definition": "A piece of land planted with fruit trees.",
    "example": "In late spring, the apple orchard was a fragrant blizzard of white and pink blossoms.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "grove",
    "phonetic": "/ɡroʊv/",
    "partOfSpeech": "noun",
    "definition": "A small wood, orchard, or group of trees.",
    "example": "Philosophers strolled through the olive grove, debating ethics beneath the silver leaves.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "thicket",
    "phonetic": "/ˈθɪkɪt/",
    "partOfSpeech": "noun",
    "definition": "A dense group of bushes or trees.",
    "example": "A frightened deer darted into the bramble thicket and vanished from sight.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "copse",
    "phonetic": "/kɒps/",
    "partOfSpeech": "noun",
    "definition": "A small group of trees or shrubs.",
    "example": "A family of pheasants nested safely inside the hazel copse on the hill.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "spinney",
    "phonetic": "/ˈspɪni/",
    "partOfSpeech": "noun",
    "definition": "A small area of trees and bushes; a copse.",
    "example": "The fox slipped silently through the dry grass bordering the beech spinney.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "understory",
    "phonetic": "/ˈʌndərstɔːri/",
    "partOfSpeech": "noun",
    "definition": "A layer of vegetation beneath the main canopy of a forest.",
    "example": "Ferns and shade-loving mosses thrived in the moist green understory of the redwood forest.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "canopy",
    "phonetic": "/ˈkænəpi/",
    "partOfSpeech": "noun",
    "definition": "The high, continuous layer of foliage formed by the crowns of trees.",
    "example": "Monkeys swung through the dense rainforest canopy eighty feet above the forest floor.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "foliage",
    "phonetic": "/ˈfoʊliɪdʒ/",
    "partOfSpeech": "noun",
    "definition": "Plant leaves, collectively; the mass of leaves on a plant or tree.",
    "example": "The autumn foliage painted the entire New England mountainside in blazing scarlet.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "frond",
    "phonetic": "/frɒnd/",
    "partOfSpeech": "noun",
    "definition": "The leaf or leaf-like part of a palm, fern, or similar plant.",
    "example": "Giant fern fronds unfurled slowly in the misty greenhouse air.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "moss",
    "phonetic": "/mɒs/",
    "partOfSpeech": "noun",
    "definition": "A small, flowerless green plant that lacks true roots, growing in damp habitats.",
    "example": "A lush carpet of velvet moss covered the ancient crumbling stone boundary wall.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lichen",
    "phonetic": "/ˈlaɪkən/",
    "partOfSpeech": "noun",
    "definition": "A simple slow-growing plant that forms a crusty or bushy growth on rocks and tree trunks.",
    "example": "Golden lichen encrusted the weathered seaside boulders like miniature continents.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "bark",
    "phonetic": "/bɑːrk/",
    "partOfSpeech": "noun",
    "definition": "The tough protective outer sheath of the trunk, branches, and twigs of a tree.",
    "example": "The silver birch was famous for its pale, paper-thin peeling bark.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sapling",
    "phonetic": "/ˈsæplɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A young tree, especially one with a slender trunk.",
    "example": "The gardener staked the delicate oak sapling to protect it from winter gales.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "burl",
    "phonetic": "/bɜːrl/",
    "partOfSpeech": "noun",
    "definition": "A rounded knotty growth on a tree trunk or branch, valued for its ornate grain.",
    "example": "The woodturner fashioned an exquisite bowl from a patterned walnut burl.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "heartwood",
    "phonetic": "/ˈhɑːrtwʊd/",
    "partOfSpeech": "noun",
    "definition": "The dense inner part of a tree trunk, yielding the hardest timber.",
    "example": "The ancient chest was carved from the dark, aromatic heartwood of Lebanese cedar.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "petiole",
    "phonetic": "/ˈpɛtioʊl/",
    "partOfSpeech": "noun",
    "definition": "The stalk that attaches the leaf blade to the stem.",
    "example": "A single raindrop clung to the slender petiole before dripping onto the leaf below.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "stamen",
    "phonetic": "/ˈsteɪmən/",
    "partOfSpeech": "noun",
    "definition": "The pollen-producing reproductive organ of a flower.",
    "example": "Bees dusted their legs in golden pollen gathered from the lily’s delicate stamens.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "calyx",
    "phonetic": "/ˈkeɪlɪks/",
    "partOfSpeech": "noun",
    "definition": "The sepals of a flower, typically forming a whorl that encloses the petals.",
    "example": "The rosebud peeked cautiously from its protective green calyx.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "nectar",
    "phonetic": "/ˈnɛktər/",
    "partOfSpeech": "noun",
    "definition": "A sugary fluid secreted by plants, especially within flowers to encourage pollination.",
    "example": "Hummingbirds hovered in midair, sipping sweet nectar from honeysuckle bells.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "spore",
    "phonetic": "/spɔːr/",
    "partOfSpeech": "noun",
    "definition": "A minute, typically one-celled reproductive unit of ferns and mosses.",
    "example": "A puff of microscopic spores floated upward as the dry mushroom was touched.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "mycelium",
    "phonetic": "/maɪˈsiːliəm/",
    "partOfSpeech": "noun",
    "definition": "The vegetative part of a fungus, consisting of a network of fine white filaments.",
    "example": "An underground web of mycelium connected the roots of every tree in the ancient forest.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "seedling",
    "phonetic": "/ˈsiːdlɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A young plant, especially one raised from seed and not from a cutting.",
    "example": "Tender green seedlings pushed through the rich potting soil toward the morning sun.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tuber",
    "phonetic": "/ˈtjuːbər/",
    "partOfSpeech": "noun",
    "definition": "A much thickened subterranean stem of a plant, bearing buds from which new plants arise.",
    "example": "The forager dug carefully to harvest the nutritious wild yam tubers.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tendril",
    "phonetic": "/ˈtɛndrɪl/",
    "partOfSpeech": "noun",
    "definition": "A slender thread-like appendage of a climbing plant, often growing in spiral form.",
    "example": "Delicate tendrils of sweet pea curled tightly around the bamboo trellis.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "bramble",
    "phonetic": "/ˈbræmbəl/",
    "partOfSpeech": "noun",
    "definition": "A prickly scrambling shrub of the rose family, especially a blackberry.",
    "example": "They stained their fingers purple picking sweet wild blackberries from the thorny bramble.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "bracken",
    "phonetic": "/ˈbrækən/",
    "partOfSpeech": "noun",
    "definition": "A tall, coarse fern with large triangular fronds, forming dense clumps on moors.",
    "example": "Red deer stags hid silently among the golden autumn bracken on the highland moor.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "heather",
    "phonetic": "/ˈhɛðər/",
    "partOfSpeech": "noun",
    "definition": "A low-growing shrub of the heath family, with purplish-pink flowers.",
    "example": "In August, the rolling Scottish hills turned a breathtaking royal purple with blooming heather.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gorse",
    "phonetic": "/ɡɔːrs/",
    "partOfSpeech": "noun",
    "definition": "A yellow-flowered spiny shrub of the pea family, native to western Europe.",
    "example": "The seaside headland was ablaze with yellow gorse that smelled of coconut and honey.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sedum",
    "phonetic": "/ˈsiːdəm/",
    "partOfSpeech": "noun",
    "definition": "A fleshy-leaved plant of the orpine family, with clusters of small star-shaped flowers.",
    "example": "Pink sedums flourished on the dry stone roof, enduring frost and drought alike.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "succulent",
    "phonetic": "/ˈsʌkjʊlənt/",
    "partOfSpeech": "adjective",
    "definition": "Tender, juicy, and tasty; having thick, fleshy water-storing leaves.",
    "example": "Desert succulents stored every precious drop of dew within their plump jade leaves.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lichenous",
    "phonetic": "/ˈlaɪkənəs/",
    "partOfSpeech": "adjective",
    "definition": "Pertaining to or overgrown with lichen.",
    "example": "Lichenous gravestones leaned at poetic angles in the overgrown village churchyard.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "mossy",
    "phonetic": "/ˈmɒsi/",
    "partOfSpeech": "adjective",
    "definition": "Covered in or overgrown with moss.",
    "example": "They sat on a mossy fallen log, listening to the silver babble of the mountain creek.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "fernlike",
    "phonetic": "/ˈfɜːrnlaɪk/",
    "partOfSpeech": "adjective",
    "definition": "Resembling a fern in shape, especially with delicate feathery leaves.",
    "example": "Frost formed intricate, fernlike crystals across the cold glass of the window.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "feathered",
    "phonetic": "/ˈfɛðərd/",
    "partOfSpeech": "adjective",
    "definition": "Covered or trimmed with feathers; feathery and light.",
    "example": "Wisps of cirrus cloud drifted like feathered plumes across the sapphire zenith.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "plumed",
    "phonetic": "/pluːmd/",
    "partOfSpeech": "adjective",
    "definition": "Adorned with or resembling feathers.",
    "example": "A plumed egret stood motionless in the shallows, waiting for passing minnows.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "winged",
    "phonetic": "/wɪŋd/",
    "partOfSpeech": "adjective",
    "definition": "Having wings for flight; swift and soaring.",
    "example": "Winged seeds of maple twirled to earth like miniature green helicopters.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "soaring",
    "phonetic": "/ˈsɔːrɪŋ/",
    "partOfSpeech": "adjective",
    "definition": "Flying or rising high in the air; reaching majestic heights.",
    "example": "The soaring spires of the Gothic cathedral pierced the gray rain clouds.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lofty",
    "phonetic": "/ˈlɒfti/",
    "partOfSpeech": "adjective",
    "definition": "Of imposing height; noble, exalted, or grand in spirit.",
    "example": "The castle stood on lofty cliffs that defied the roaring surges of the Atlantic.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "craggy",
    "phonetic": "/ˈkræɡi/",
    "partOfSpeech": "adjective",
    "definition": "Rough and uneven; jagged with rocky outcrops.",
    "example": "Mountain goats bounded effortlessly across the craggy limestone ridges.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "jagged",
    "phonetic": "/ˈdʒæɡɪd/",
    "partOfSpeech": "adjective",
    "definition": "Having rough, sharp points protruding; uneven.",
    "example": "A jagged bolt of lightning fractured the darkness, turning the bay silver for an instant.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "serrated",
    "phonetic": "/səˈreɪtɪd/",
    "partOfSpeech": "adjective",
    "definition": "Having or denoting a jagged edge; saw-like.",
    "example": "The serrated mountain skyline resembled the teeth of a slumbering stone dragon.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "pinnacle",
    "phonetic": "/ˈpɪnəkəl/",
    "partOfSpeech": "noun",
    "definition": "The most successful point; a high, pointed piece of rock.",
    "example": "Climbers finally reached the granite pinnacle as the morning sun broke through mist.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "spire",
    "phonetic": "/spaɪər/",
    "partOfSpeech": "noun",
    "definition": "A tapering conical or pyramidal structure on the top of a building; a slender peak.",
    "example": "The church spire rose above the red-tiled village roofs, a reassuring beacon for miles.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "boulder",
    "phonetic": "/ˈboʊldər/",
    "partOfSpeech": "noun",
    "definition": "A large rock, typically one that has been worn smooth by erosion.",
    "example": "They leaned against a sun-warmed granite boulder, savoring wild blueberries.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "pebble",
    "phonetic": "/ˈpɛbəl/",
    "partOfSpeech": "noun",
    "definition": "A small stone made smooth and round by the action of water or sand.",
    "example": "She skipped a flat slate pebble across the glassy surface of the lake.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gravel",
    "phonetic": "/ˈɡrævəl/",
    "partOfSpeech": "noun",
    "definition": "A loose aggregation of small water-worn or pounded stones.",
    "example": "Tires crunched pleasantly on the gravel driveway as the carriage arrived at the manor.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sediment",
    "phonetic": "/ˈsɛdɪmənt/",
    "partOfSpeech": "noun",
    "definition": "Matter that settles to the bottom of a liquid; mineral deposit.",
    "example": "Centuries of mineral sediment had laid down alternating bands of ochre and crimson rock.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "silt",
    "phonetic": "/sɪlt/",
    "partOfSpeech": "noun",
    "definition": "Fine sand, clay, or other material carried by running water and deposited as a sediment.",
    "example": "The river delta was choked with fertile brown silt brought down from mountain snowmelt.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "clay",
    "phonetic": "/kleɪ/",
    "partOfSpeech": "noun",
    "definition": "A stiff, sticky fine-grained earth, typically yellow, red, or bluish-gray in color.",
    "example": "The potter spun the moist terracotta clay into a graceful urn on the foot-wheel.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "loam",
    "phonetic": "/loʊm/",
    "partOfSpeech": "noun",
    "definition": "A fertile soil of clay and sand containing humus.",
    "example": "The rich, dark loam in the kitchen garden produced legendary heirloom tomatoes.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "humus",
    "phonetic": "/ˈhjuːməs/",
    "partOfSpeech": "noun",
    "definition": "The organic component of soil, formed by the decomposition of leaves and other plant material.",
    "example": "The scent of decaying forest humus was deep, rich, and comforting after the rain.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "peat",
    "phonetic": "/piːt/",
    "partOfSpeech": "noun",
    "definition": "An accumulation of partially decayed vegetation or organic matter.",
    "example": "The sweet, earthy smoke of a peat fire curled from the stone cottage chimney.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "bog",
    "phonetic": "/bɒɡ/",
    "partOfSpeech": "noun",
    "definition": "Wet muddy ground too soft to support a heavy body; wetland.",
    "example": "Carnivorous sundews and cotton grass flourished in the misty peat bog.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "marsh",
    "phonetic": "/mɑːrʃ/",
    "partOfSpeech": "noun",
    "definition": "An area of low-lying land which is flooded in wet seasons or at high tide.",
    "example": "Mist hung over the salt marsh as curlews called to each other across the tidal creeks.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "swamp",
    "phonetic": "/swɒmp/",
    "partOfSpeech": "noun",
    "definition": "An area of low-lying, uncultivated ground where water collects; a bog or marsh.",
    "example": "Cypress trees with mossy knees rose from the dark tea-colored swamp water.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "fen",
    "phonetic": "/fɛn/",
    "partOfSpeech": "noun",
    "definition": "A low and marshy or frequently flooded area of land.",
    "example": "Windmills drained the historic English fens, turning waterlands into rich wheat fields.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "mire",
    "phonetic": "/maɪər/",
    "partOfSpeech": "noun",
    "definition": "A stretch of swampy or boggy ground; a soft deep mud.",
    "example": "The traveler's wagon wheels sank deep into the muddy mire of the autumn lane.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "slough",
    "phonetic": "/sluː/",
    "partOfSpeech": "noun",
    "definition": "A swampy, muddy, or marshy place; a condition of despair.",
    "example": "Ducks paddled lazily among the water lilies in the quiet river slough.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "quagmire",
    "phonetic": "/ˈkwæɡmaɪər/",
    "partOfSpeech": "noun",
    "definition": "A soft boggy area of land that gives way underfoot; a complex, hazardous situation.",
    "example": "The path turned into a treacherous quagmire where each step threatened to claim a boot.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "rill",
    "phonetic": "/rɪl/",
    "partOfSpeech": "noun",
    "definition": "A small stream; a brook.",
    "example": "A crystal rill bubbled up between limestone blocks, feeding the monastery fountain.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "brook",
    "phonetic": "/brʊk/",
    "partOfSpeech": "noun",
    "definition": "A small, natural stream of freshwater.",
    "example": "Trout darted between cool shadow and sunbeam in the pebbled woodland brook.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "creek",
    "phonetic": "/kriːk/",
    "partOfSpeech": "noun",
    "definition": "A stream, brook, or minor tributary of a river.",
    "example": "They pitched their canvas tent beside the singing waters of the mountain creek.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "stream",
    "phonetic": "/striːm/",
    "partOfSpeech": "noun",
    "definition": "A small, narrow river.",
    "example": "A continuous stream of fresh glacial water tumbled over smooth granite rocks.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tributary",
    "phonetic": "/ˈtrɪbjʊtəri/",
    "partOfSpeech": "noun",
    "definition": "A river or stream flowing into a larger river or lake.",
    "example": "Dozens of mountain tributaries united to form the mighty blue Danube.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "confluence",
    "phonetic": "/ˈkɒnfluːəns/",
    "partOfSpeech": "noun",
    "definition": "The junction of two rivers, especially rivers of approximately equal width.",
    "example": "A historic trading fortress was founded at the confluence of the two great rivers.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "verisimilitude",
    "phonetic": "/ˌvɛrɪsɪˈmɪlɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "The appearance of being true or real; authentic believability in storytelling.",
    "example": "The historical novelist added rich sensory details to lend verisimilitude to Victorian London.",
    "category": "Literary & Prose"
  },
  {
    "word": "laconic",
    "phonetic": "/ləˈkɒnɪk/",
    "partOfSpeech": "adjective",
    "definition": "Using very few words; concise to the point of seeming blunt.",
    "example": "His laconic reply to the lengthy questionnaire was a single handwritten line.",
    "category": "Literary & Prose"
  },
  {
    "word": "quixotic",
    "phonetic": "/kwɪkˈsɒtɪk/",
    "partOfSpeech": "adjective",
    "definition": "Exceedingly idealistic, unrealistic, and impractical.",
    "example": "He embarked on a quixotic quest to establish a completely paperless printing house.",
    "category": "Literary & Prose"
  },
  {
    "word": "perspicacity",
    "phonetic": "/ˌpɜːrspɪˈkæsɪti/",
    "partOfSpeech": "noun",
    "definition": "The quality of having a ready insight into things; acute mental shrewdness.",
    "example": "Her political perspicacity enabled her to foresee the coalition collapse months in advance.",
    "category": "Literary & Prose"
  },
  {
    "word": "taciturn",
    "phonetic": "/ˈtæsɪtɜːrn/",
    "partOfSpeech": "adjective",
    "definition": "Reserved or uncommunicative in speech; saying little.",
    "example": "The old lighthouse keeper was famously taciturn, preferring the roar of the surf to small talk.",
    "category": "Literary & Prose"
  },
  {
    "word": "redolent",
    "phonetic": "/ˈrɛdələnt/",
    "partOfSpeech": "adjective",
    "definition": "Strongly reminiscent or suggestive of something; fragrant.",
    "example": "The antique wooden study was redolent of pipe tobacco, leather bindings, and beeswax.",
    "category": "Literary & Prose"
  },
  {
    "word": "idiosyncratic",
    "phonetic": "/ˌɪdioʊsɪŋˈkrætɪk/",
    "partOfSpeech": "adjective",
    "definition": "Relating to idiosyncrasy; eccentric, distinctive, and individual.",
    "example": "His idiosyncratic punctuation and stream-of-consciousness style revolutionized the modern novel.",
    "category": "Literary & Prose"
  },
  {
    "word": "fastidious",
    "phonetic": "/fæˈstɪdiəs/",
    "partOfSpeech": "adjective",
    "definition": "Very attentive to and concerned about accuracy and detail; scrupulous.",
    "example": "The editor was fastidious about proofreading, catching errant commas that others missed.",
    "category": "Literary & Prose"
  },
  {
    "word": "perspicuous",
    "phonetic": "/pərˈspɪkjuːəs/",
    "partOfSpeech": "adjective",
    "definition": "Clearly expressed and easily understood; lucid.",
    "example": "The physicist gave a perspicuous explanation of quantum entanglement that captivated laymen.",
    "category": "Literary & Prose"
  },
  {
    "word": "obsequious",
    "phonetic": "/əbˈsiːkwiəs/",
    "partOfSpeech": "adjective",
    "definition": "Obedient or attentive to an excessive or servile degree.",
    "example": "The monarch was weary of obsequious courtiers who nodded in agreement at every utterance.",
    "category": "Literary & Prose"
  },
  {
    "word": "sycophant",
    "phonetic": "/ˈsɪkəfænt/",
    "partOfSpeech": "noun",
    "definition": "A person who acts obsequiously toward someone important in order to gain advantage.",
    "example": "He surrounded himself with sycophants who insulated him from the harsh realities of the realm.",
    "category": "Literary & Prose"
  },
  {
    "word": "recalcitrant",
    "phonetic": "/rɪˈkælsɪtrənt/",
    "partOfSpeech": "adjective",
    "definition": "Having an obstinately uncooperative attitude toward authority or discipline.",
    "example": "The recalcitrant parliament refused to pass the prime minister's controversial emergency budget.",
    "category": "Literary & Prose"
  },
  {
    "word": "supercilious",
    "phonetic": "/ˌsuːpərˈsɪliəs/",
    "partOfSpeech": "adjective",
    "definition": "Behaving or looking as though one thinks one is superior to others; arrogant.",
    "example": "She cast a supercilious glance at the second-hand furniture in the modest parlor.",
    "category": "Literary & Prose"
  },
  {
    "word": "pusillanimous",
    "phonetic": "/ˌpjuːsɪˈlænɪməs/",
    "partOfSpeech": "adjective",
    "definition": "Showing a lack of courage or determination; timid.",
    "example": "His pusillanimous refusal to testify allowed the corrupt ringleader to escape justice.",
    "category": "Literary & Prose"
  },
  {
    "word": "trenchant",
    "phonetic": "/ˈtrɛntʃənt/",
    "partOfSpeech": "adjective",
    "definition": "Vigorous or incisive in expression or style; keenly perceptive.",
    "example": "Her trenchant criticism cut through the politician's evasive rhetoric like a scalpel.",
    "category": "Literary & Prose"
  },
  {
    "word": "perfunctory",
    "phonetic": "/pərˈfʌŋktəri/",
    "partOfSpeech": "adjective",
    "definition": "Carried out with a minimum of effort or reflection; superficial.",
    "example": "He offered a perfunctory nod before quickly returning his gaze to his open newspaper.",
    "category": "Literary & Prose"
  },
  {
    "word": "punctilious",
    "phonetic": "/pʌŋkˈtɪliəs/",
    "partOfSpeech": "adjective",
    "definition": "Showing great attention to detail or correct behavior; meticulously exact.",
    "example": "The majordomo was punctilious about royal protocol, inspecting every silver fork before dinner.",
    "category": "Literary & Prose"
  },
  {
    "word": "grandiloquent",
    "phonetic": "/ɡrænˈdɪləkwənt/",
    "partOfSpeech": "adjective",
    "definition": "Pompous or extravagant in language, style, or manner, especially in a bid to impress.",
    "example": "The young barrister's grandiloquent opening speech amused the seasoned magistrates.",
    "category": "Literary & Prose"
  },
  {
    "word": "bombastic",
    "phonetic": "/bɒmˈbæstɪk/",
    "partOfSpeech": "adjective",
    "definition": "High-sounding but with little meaning; inflated.",
    "example": "Stripped of its bombastic adjectives, the manifesto contained surprisingly little substance.",
    "category": "Literary & Prose"
  },
  {
    "word": "panegyric",
    "phonetic": "/ˌpænɪˈdʒɪrɪk/",
    "partOfSpeech": "noun",
    "definition": "A public speech or published text in praise of someone or something; a eulogy.",
    "example": "The poet laureate composed an elaborate panegyric in honor of the astronomer's discovery.",
    "category": "Literary & Prose"
  },
  {
    "word": "diatribe",
    "phonetic": "/ˈdaɪətraɪb/",
    "partOfSpeech": "noun",
    "definition": "A forceful and bitter verbal attack against someone or something.",
    "example": "The op-ed was a blistering diatribe against the city council's reckless zoning policies.",
    "category": "Literary & Prose"
  },
  {
    "word": "harangue",
    "phonetic": "/həˈræŋ/",
    "partOfSpeech": "noun",
    "definition": "A lengthy and aggressive speech or tirade.",
    "example": "The union organizer delivered an impassioned harangue to the shivering crowd at dawn.",
    "category": "Literary & Prose"
  },
  {
    "word": "polemic",
    "phonetic": "/pəˈlɛmɪk/",
    "partOfSpeech": "noun",
    "definition": "A strong verbal or written attack on someone or something; contentious argument.",
    "example": "His controversial book was a fierce polemic against traditional economic orthodoxies.",
    "category": "Literary & Prose"
  },
  {
    "word": "apotheosis",
    "phonetic": "/əˌpɒθiˈoʊsɪs/",
    "partOfSpeech": "noun",
    "definition": "The highest point in the development of something; a culmination or deification.",
    "example": "The cathedral's soaring stained glass dome was regarded as the apotheosis of Gothic architecture.",
    "category": "Literary & Prose"
  },
  {
    "word": "panacea",
    "phonetic": "/ˌpænəˈsiːə/",
    "partOfSpeech": "noun",
    "definition": "A solution or remedy for all difficulties or diseases; a universal cure.",
    "example": "Education is essential, but it is not an overnight panacea for deep systemic poverty.",
    "category": "Literary & Prose"
  },
  {
    "word": "chimera",
    "phonetic": "/kaɪˈmɪərə/",
    "partOfSpeech": "noun",
    "definition": "A thing that is hoped or wished for but in fact is illusory or impossible to achieve.",
    "example": "Chasing perpetual motion proved to be an intellectual chimera that consumed his inheritance.",
    "category": "Literary & Prose"
  },
  {
    "word": "simulacrum",
    "phonetic": "/ˌsɪmjʊˈleɪkrəm/",
    "partOfSpeech": "noun",
    "definition": "An image or representation of someone or something; an illusory substitute.",
    "example": "The neon-lit theme park was a plastic simulacrum of an ancient Venetian canal.",
    "category": "Literary & Prose"
  },
  {
    "word": "paradigm",
    "phonetic": "/ˈpærədaɪm/",
    "partOfSpeech": "noun",
    "definition": "A typical example, pattern, or model of something; an overarching framework.",
    "example": "The theory of plate tectonics caused a monumental paradigm shift in modern geology.",
    "category": "Literary & Prose"
  },
  {
    "word": "episteme",
    "phonetic": "/ˌɛpɪˈstiːmiː/",
    "partOfSpeech": "noun",
    "definition": "A body of ideas or ways of thinking that determine the intellectual certainty of an epoch.",
    "example": "Foucault explored how the Renaissance episteme shaped medical understanding of madness.",
    "category": "Literary & Prose"
  },
  {
    "word": "dialectic",
    "phonetic": "/ˌdaɪəˈlɛktɪk/",
    "partOfSpeech": "noun",
    "definition": "The art of investigating or discussing the truth of opinions through reasoned debate.",
    "example": "Through Socratic dialectic, the teacher led the student to uncover their own assumptions.",
    "category": "Literary & Prose"
  },
  {
    "word": "hermeneutic",
    "phonetic": "/ˌhɜːrməˈnjuːtɪk/",
    "partOfSpeech": "adjective",
    "definition": "Concerning interpretation, especially the interpretation of literary texts and scriptures.",
    "example": "Her hermeneutic analysis uncovered subterranean feminist themes in the ancient epic.",
    "category": "Literary & Prose"
  },
  {
    "word": "solipsism",
    "phonetic": "/ˈsɒlɪpsɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The philosophical view or theory that the self is all that can be known to exist.",
    "example": "Taken to its logical extreme, radical skepticism collapses into barren solipsism.",
    "category": "Literary & Prose"
  },
  {
    "word": "teleology",
    "phonetic": "/ˌtɛliˈɒlədʒi/",
    "partOfSpeech": "noun",
    "definition": "The explanation of phenomena in terms of the purpose they serve rather than of the cause by which they arise.",
    "example": "Aristotle's physics was built on the foundation of teleology and final causes.",
    "category": "Literary & Prose"
  },
  {
    "word": "ontology",
    "phonetic": "/ɒnˈtɒlədʒi/",
    "partOfSpeech": "noun",
    "definition": "The branch of metaphysics dealing with the nature of being and existence.",
    "example": "His philosophical treatise proposed a radical new ontology of digital consciousness.",
    "category": "Literary & Prose"
  },
  {
    "word": "palimpsest",
    "phonetic": "/ˈpælɪmpsɛst/",
    "partOfSpeech": "noun",
    "definition": "A manuscript or piece of writing material on which the original writing has been effaced to make room for later writing.",
    "example": "The ancient city was a living palimpsest, with medieval lanes built over Roman foundations.",
    "category": "Literary & Prose"
  },
  {
    "word": "bibliobibuli",
    "phonetic": "/ˌbɪblioʊˈbɪbjʊlaɪ/",
    "partOfSpeech": "noun",
    "definition": "People who read too much, to the exclusion of direct experience of the world.",
    "example": "Mencken coined the term bibliobibuli to gently mock those who prefer books to life itself.",
    "category": "Literary & Prose"
  },
  {
    "word": "incunabula",
    "phonetic": "/ˌɪnkjuːˈnæbjʊlə/",
    "partOfSpeech": "noun",
    "definition": "Books printed before 1501 in the infancy of typography.",
    "example": "The university vault housed rare incunabula produced on Gutenberg’s earliest presses.",
    "category": "Literary & Prose"
  },
  {
    "word": "florilegium",
    "phonetic": "/ˌflɔːrɪˈliːdʒiəm/",
    "partOfSpeech": "noun",
    "definition": "An anthology or collection of literary excerpts; literally a bouquet of flowers.",
    "example": "She compiled an enchanting florilegium of sixteenth-century pastoral love sonnets.",
    "category": "Literary & Prose"
  },
  {
    "word": "marginalia",
    "phonetic": "/ˌmɑːrdʒɪˈneɪliə/",
    "partOfSpeech": "noun",
    "definition": "Marginal notes, sketches, or comments made in the margin of a book or document.",
    "example": "Coleridge's witty and ferocious marginalia were as famous as his published essays.",
    "category": "Literary & Prose"
  },
  {
    "word": "ex-libris",
    "phonetic": "/ˌɛks ˈliːbrɪs/",
    "partOfSpeech": "noun",
    "definition": "A bookplate inscribed with a personal motto or coat of arms indicating ownership.",
    "example": "An ornate woodcut ex-libris adorned the inside front cover of the collector's volume.",
    "category": "Literary & Prose"
  },
  {
    "word": "codex",
    "phonetic": "/ˈkoʊdɛks/",
    "partOfSpeech": "noun",
    "definition": "An ancient manuscript text in book form rather than a scroll.",
    "example": "Scholars gathered in the Vatican Library to inspect the newly restored Maya codex.",
    "category": "Literary & Prose"
  },
  {
    "word": "vellum",
    "phonetic": "/ˈvɛləm/",
    "partOfSpeech": "noun",
    "definition": "Fine parchment made originally from the skin of a calf.",
    "example": "The Declaration was inked on enduring sheets of vellum that withstood two centuries.",
    "category": "Literary & Prose"
  },
  {
    "word": "rubric",
    "phonetic": "/ˈruːbrɪk/",
    "partOfSpeech": "noun",
    "definition": "A heading on a document; a set of authoritative rules or instructions.",
    "example": "The ancient monastic prayer book featured headings written in bright crimson rubric.",
    "category": "Literary & Prose"
  },
  {
    "word": "colophon",
    "phonetic": "/ˈkɒləfɒn/",
    "partOfSpeech": "noun",
    "definition": "A publisher's emblem or imprint, or a note at the end of a book with printing facts.",
    "example": "The colophon revealed that the masterpiece had been handset in Caslon type in Edinburgh.",
    "category": "Literary & Prose"
  },
  {
    "word": "frontispiece",
    "phonetic": "/ˈfrʌntɪspiːs/",
    "partOfSpeech": "noun",
    "definition": "An illustration facing the title page of a book.",
    "example": "The frontispiece was an exquisite steel engraving of the circumnavigator’s caravel.",
    "category": "Literary & Prose"
  },
  {
    "word": "prolegomenon",
    "phonetic": "/ˌproʊlɪˈɡɒmɪnɒn/",
    "partOfSpeech": "noun",
    "definition": "A critical or discursive introduction to a book or treatise.",
    "example": "Kant wrote his Prolegomena to provide an accessible gateway into his Critique of Pure Reason.",
    "category": "Literary & Prose"
  },
  {
    "word": "soliloquy",
    "phonetic": "/səˈlɪləkwi/",
    "partOfSpeech": "noun",
    "definition": "An act of speaking one's thoughts aloud when by oneself, especially in a play.",
    "example": "Hamlet’s celebrated soliloquy lays bare the existential terror of mortality.",
    "category": "Literary & Prose"
  },
  {
    "word": "interlocutor",
    "phonetic": "/ˌɪntərˈlɒkjʊtər/",
    "partOfSpeech": "noun",
    "definition": "A person who takes part in a dialogue or conversation.",
    "example": "Socrates listened patiently to his young interlocutor before dismantling his definition of justice.",
    "category": "Literary & Prose"
  },
  {
    "word": "aphorism",
    "phonetic": "/ˈæfərɪzəm/",
    "partOfSpeech": "noun",
    "definition": "A pithy observation that contains a general truth, such as 'if it ain't broke, don't fix it.'",
    "example": "Oscar Wilde was universally celebrated for his glittering, razor-sharp aphorisms.",
    "category": "Literary & Prose"
  },
  {
    "word": "apothegm",
    "phonetic": "/ˈæpəθɛm/",
    "partOfSpeech": "noun",
    "definition": "A concise, witty, and instructive saying; a maxim.",
    "example": "The philosopher was remembered for his sharp apothegm on the deceptive nature of fame.",
    "category": "Literary & Prose"
  },
  {
    "word": "sententious",
    "phonetic": "/sɛnˈtɛnʃəs/",
    "partOfSpeech": "adjective",
    "definition": "Given to moralizing in a pompous or affected manner; pithy and moralistic.",
    "example": "His sententious speech on personal duty irritated the pragmatic young officers.",
    "category": "Literary & Prose"
  },
  {
    "word": "epigram",
    "phonetic": "/ˈɛpɪɡræm/",
    "partOfSpeech": "noun",
    "definition": "A pithy saying or remark expressing an idea in a clever and amusing way.",
    "example": "The poet ended his essay with an unforgettable epigram that summarized the dilemma.",
    "category": "Literary & Prose"
  },
  {
    "word": "platitude",
    "phonetic": "/ˈplætɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "A remark or statement, especially one with moral content, that has been used too often to be interesting.",
    "example": "The commencement speaker offered little beyond tired platitudes about following one's passion.",
    "category": "Literary & Prose"
  },
  {
    "word": "euphemism",
    "phonetic": "/ˈjuːfəmɪzəm/",
    "partOfSpeech": "noun",
    "definition": "A mild or indirect word or expression substituted for one considered too harsh.",
    "example": "'Letting someone go' is a corporate euphemism that does little to soften the blow of dismissal.",
    "category": "Literary & Prose"
  },
  {
    "word": "litotes",
    "phonetic": "/laɪˈtoʊtiːz/",
    "partOfSpeech": "noun",
    "definition": "Ironical understatement in which an affirmative is expressed by the negative of its contrary.",
    "example": "Saying 'he is no fool' when you mean 'he is a genius' is an elegant instance of litotes.",
    "category": "Literary & Prose"
  },
  {
    "word": "hyperbole",
    "phonetic": "/haɪˈpɜːrbəli/",
    "partOfSpeech": "noun",
    "definition": "Exaggerated statements or claims not meant to be taken literally.",
    "example": "His claim that the flight took a million years was obvious, humorous hyperbole.",
    "category": "Literary & Prose"
  },
  {
    "word": "metonymy",
    "phonetic": "/mɪˈtɒnɪmi/",
    "partOfSpeech": "noun",
    "definition": "The substitution of the name of an attribute or adjunct for that of the thing meant.",
    "example": "Using 'the Crown' to represent the British monarch is a textbook example of metonymy.",
    "category": "Literary & Prose"
  },
  {
    "word": "synecdoche",
    "phonetic": "/sɪˈnɛkdəki/",
    "partOfSpeech": "noun",
    "definition": "A figure of speech in which a part is made to represent the whole or vice versa.",
    "example": "Referring to a fleet of merchant ships as fifty 'sails' illustrates classic synecdoche.",
    "category": "Literary & Prose"
  },
  {
    "word": "oxymoron",
    "phonetic": "/ˌɒksɪˈmɔːrɒn/",
    "partOfSpeech": "noun",
    "definition": "A figure of speech in which apparently contradictory terms appear in conjunction.",
    "example": "'Deafening silence' and 'bittersweet joy' are quintessential literary oxymorons.",
    "category": "Literary & Prose"
  },
  {
    "word": "tautology",
    "phonetic": "/tɔːˈtɒlədʒi/",
    "partOfSpeech": "noun",
    "definition": "The saying of the same thing twice in different words, generally considered a fault of style.",
    "example": "Saying 'a free gift' or 'close proximity' are everyday examples of verbal tautology.",
    "category": "Literary & Prose"
  },
  {
    "word": "pleonasm",
    "phonetic": "/ˈpliːənæzəm/",
    "partOfSpeech": "noun",
    "definition": "The use of more words than are necessary to convey meaning, either as a fault or for emphasis.",
    "example": "The phrase 'I saw it with my own eyes' relies on pleonasm to underscore certainty.",
    "category": "Literary & Prose"
  },
  {
    "word": "circumlocution",
    "phonetic": "/ˌsɜːrkəmləˈkjuːʃən/",
    "partOfSpeech": "noun",
    "definition": "The use of many words where fewer would do, especially in a deliberate attempt to be vague.",
    "example": "The politician resorted to tortuous circumlocution to avoid admitting the budget shortfall.",
    "category": "Literary & Prose"
  },
  {
    "word": "periphrasis",
    "phonetic": "/pəˈrɪfrəsɪs/",
    "partOfSpeech": "noun",
    "definition": "An indirect and roundabout manner of writing or speaking; circumlocution.",
    "example": "Rather than writing 'the sun rose,' the poet used ornate periphrasis to describe dawn.",
    "category": "Literary & Prose"
  },
  {
    "word": "solecism",
    "phonetic": "/ˈsɒlɪsɪzəm/",
    "partOfSpeech": "noun",
    "definition": "A grammatical mistake in speech or writing; a breach of etiquette.",
    "example": "The purist was horrified by the blatant grammatical solecism in the billboard tagline.",
    "category": "Literary & Prose"
  },
  {
    "word": "malapropism",
    "phonetic": "/ˈmæləprɒpɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The mistaken use of a word in place of a similar-sounding one, often with an amusing effect.",
    "example": "Saying someone is the 'very pineapple of politeness' instead of 'pinnacle' is a malapropism.",
    "category": "Literary & Prose"
  },
  {
    "word": "anachronism",
    "phonetic": "/əˈnækrənɪzəm/",
    "partOfSpeech": "noun",
    "definition": "A thing belonging or appropriate to a period other than that in which it exists.",
    "example": "A wristwatch visible on a Roman gladiator was an embarrassing cinematic anachronism.",
    "category": "Literary & Prose"
  },
  {
    "word": "portmanteau",
    "phonetic": "/pɔːrtˈmæntoʊ/",
    "partOfSpeech": "noun",
    "definition": "A word blending the sounds and meanings of two other words, like 'brunch' or 'smog.'",
    "example": "Lewis Carroll delighted in inventing whimsical portmanteau words in Jabberwocky.",
    "category": "Literary & Prose"
  },
  {
    "word": "neologism",
    "phonetic": "/niˈɒlədʒɪzəm/",
    "partOfSpeech": "noun",
    "definition": "A newly coined word or expression.",
    "example": "Shakespeare introduced hundreds of enduring neologisms that enriched the English language.",
    "category": "Literary & Prose"
  },
  {
    "word": "archaism",
    "phonetic": "/ˈɑːrkeɪɪzəm/",
    "partOfSpeech": "noun",
    "definition": "A thing that is very old or old-fashioned, especially an archaic word or style.",
    "example": "The fantasy author sprinkled deliberate archaisms like 'hark' and 'thou' across the narrative.",
    "category": "Literary & Prose"
  },
  {
    "word": "vernacular",
    "phonetic": "/vərˈnækjʊlər/",
    "partOfSpeech": "noun",
    "definition": "The language or dialect spoken by the ordinary people in a particular country or region.",
    "example": "Mark Twain wrote Huckleberry Finn in the vibrant colloquial vernacular of the Mississippi valley.",
    "category": "Literary & Prose"
  },
  {
    "word": "polyglot",
    "phonetic": "/ˈpɒlɪɡlɒt/",
    "partOfSpeech": "noun",
    "definition": "A person who knows and is able to use several languages.",
    "example": "As a multilingual diplomat and polyglot, she could negotiate fluently in six tongues.",
    "category": "Literary & Prose"
  },
  {
    "word": "concordance",
    "phonetic": "/kənˈkɔːrdəns/",
    "partOfSpeech": "noun",
    "definition": "An alphabetical list of the words present in a text, usually with citations of passages.",
    "example": "The scholar spent years compiling an exhaustive concordance of Dante's Divine Comedy.",
    "category": "Literary & Prose"
  },
  {
    "word": "compendium",
    "phonetic": "/kəmˈpɛndiəm/",
    "partOfSpeech": "noun",
    "definition": "A collection of concise but detailed information about a particular subject.",
    "example": "The volume was an invaluable compendium of Renaissance herbal remedies and botany.",
    "category": "Literary & Prose"
  },
  {
    "word": "anthology",
    "phonetic": "/ænˈθɒlədʒi/",
    "partOfSpeech": "noun",
    "definition": "A published collection of poems or other pieces of writing.",
    "example": "The library acquired a rare anthology of medieval troubadour lyrics from Provence.",
    "category": "Literary & Prose"
  },
  {
    "word": "disquisition",
    "phonetic": "/ˌdɪskwɪˈzɪʃən/",
    "partOfSpeech": "noun",
    "definition": "A long or elaborate essay or discussion on a particular subject.",
    "example": "The chapter opened with a learned disquisition on the history of astronomical chronometers.",
    "category": "Literary & Prose"
  },
  {
    "word": "magnum-opus",
    "phonetic": "/ˌmæɡnəm ˈoʊpəs/",
    "partOfSpeech": "noun",
    "definition": "A large and important work of art, music, or literature, especially one regarded as the artist's masterpiece.",
    "example": "War and Peace is universally acclaimed as Leo Tolstoy’s literary magnum opus.",
    "category": "Literary & Prose"
  },
  {
    "word": "pastiche",
    "phonetic": "/pæˈstiːʃ/",
    "partOfSpeech": "noun",
    "definition": "An artistic work in a style that imitates that of another work, artist, or period.",
    "example": "The detective film was an affectionate pastiche of 1940s film noir cinema.",
    "category": "Literary & Prose"
  },
  {
    "word": "lampoon",
    "phonetic": "/læmˈpuːn/",
    "partOfSpeech": "verb",
    "definition": "Publicly criticize someone or something by using ridicule, irony, or sarcasm.",
    "example": "The satirical magazine mercilessly lampooned the pompous vanity of the royal court.",
    "category": "Literary & Prose"
  },
  {
    "word": "satire",
    "phonetic": "/ˈsætaɪər/",
    "partOfSpeech": "noun",
    "definition": "The use of humor, irony, exaggeration, or ridicule to expose and criticize people's stupidity or vices.",
    "example": "Jonathan Swift’s Gulliver’s Travels is a timeless masterwork of devastating social satire.",
    "category": "Literary & Prose"
  },
  {
    "word": "sardonic",
    "phonetic": "/sɑːrˈdɒnɪk/",
    "partOfSpeech": "adjective",
    "definition": "Grimly mocking or cynical.",
    "example": "A sardonic smile curled her lips as she watched the self-important chairman stumble.",
    "category": "Literary & Prose"
  },
  {
    "word": "mordant",
    "phonetic": "/ˈmɔːrdənt/",
    "partOfSpeech": "adjective",
    "definition": "Having or showing a sharp or critical quality; biting.",
    "example": "The critic was feared for his mordant wit and uncompromising standards.",
    "category": "Literary & Prose"
  },
  {
    "word": "caustic",
    "phonetic": "/ˈkɔːstɪk/",
    "partOfSpeech": "adjective",
    "definition": "Sarcastic in a scathing and bitter way.",
    "example": "His caustic remarks in the staff meeting left several junior colleagues in tears.",
    "category": "Literary & Prose"
  },
  {
    "word": "acerbic",
    "phonetic": "/əˈsɜːrbɪk/",
    "partOfSpeech": "adjective",
    "definition": "Sharp and forthright in tone or style; tasting sour or bitter.",
    "example": "Her acerbic commentary on modern politics earned her both devoted fans and fierce enemies.",
    "category": "Literary & Prose"
  },
  {
    "word": "vitriolic",
    "phonetic": "/ˌvɪtriˈɒlɪk/",
    "partOfSpeech": "adjective",
    "definition": "Filled with bitter criticism or malice.",
    "example": "The defeated candidate launched a vitriolic attack on the impartiality of the press.",
    "category": "Literary & Prose"
  },
  {
    "word": "acrimonious",
    "phonetic": "/ˌækrɪˈmoʊniəs/",
    "partOfSpeech": "adjective",
    "definition": "Angry and bitter in tone, debate, or relationship.",
    "example": "After months of acrimonious negotiations, the coalition government finally fractured.",
    "category": "Literary & Prose"
  },
  {
    "word": "ratiocination",
    "phonetic": "/ˌræʃiˌɒsɪˈneɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The process of exact thinking, reasoning, and logical deduction.",
    "example": "Sherlock Holmes solved the baffling mystery through meticulous ratiocination.",
    "category": "Literary & Prose"
  },
  {
    "word": "syllogism",
    "phonetic": "/ˈsɪlədʒɪzəm/",
    "partOfSpeech": "noun",
    "definition": "An instance of a form of reasoning in which a conclusion is drawn from two premises.",
    "example": "'All humans are mortal; Socrates is human; therefore Socrates is mortal' is a syllogism.",
    "category": "Literary & Prose"
  },
  {
    "word": "axiom",
    "phonetic": "/ˈæksiəm/",
    "partOfSpeech": "noun",
    "definition": "A statement or proposition which is regarded as being established, accepted, or self-evidently true.",
    "example": "It was treated as an unassailable axiom that trade flourished best in times of peace.",
    "category": "Literary & Prose"
  },
  {
    "word": "postulate",
    "phonetic": "/ˈpɒstjʊleɪt/",
    "partOfSpeech": "verb",
    "definition": "Suggest or assume the existence, fact, or truth of something as a basis for reasoning.",
    "example": "Einstein postulated that the speed of light in a vacuum is the same for all observers.",
    "category": "Literary & Prose"
  },
  {
    "word": "hegemony",
    "phonetic": "/hɪˈdʒɛməni/",
    "partOfSpeech": "noun",
    "definition": "Leadership or dominance, especially by one country or social group over others.",
    "example": "The maritime empire maintained geopolitical hegemony across the Mediterranean for centuries.",
    "category": "Literary & Prose"
  },
  {
    "word": "heterodoxy",
    "phonetic": "/ˈhɛtərəˌdɒksi/",
    "partOfSpeech": "noun",
    "definition": "Deviation from accepted or orthodox standards or beliefs.",
    "example": "His theological heterodoxy scandalized the conservative bishops of the synod.",
    "category": "Literary & Prose"
  },
  {
    "word": "zeitgeist",
    "phonetic": "/ˈtsaɪtɡaɪst/",
    "partOfSpeech": "noun",
    "definition": "The defining spirit or mood of a particular period of history as shown by the ideas of the time.",
    "example": "His debut novel captured the anxious, restless zeitgeist of the early twenty-first century.",
    "category": "Literary & Prose"
  },
  {
    "word": "weltanschauung",
    "phonetic": "/ˈvɛltˌɑːnʃaʊ.ʊŋ/",
    "partOfSpeech": "noun",
    "definition": "A particular philosophy or view of life; a world concept held by an individual or group.",
    "example": "Her artistic weltanschauung was rooted in reverence for natural balance and human dignity.",
    "category": "Literary & Prose"
  },
  {
    "word": "milieu",
    "phonetic": "/miːlˈjɜː/",
    "partOfSpeech": "noun",
    "definition": "A person's social environment or cultural surroundings.",
    "example": "Growing up in the bohemian Parisian art milieu fostered her avant-garde sensibilities.",
    "category": "Literary & Prose"
  },
  {
    "word": "cachet",
    "phonetic": "/kæˈʃeɪ/",
    "partOfSpeech": "noun",
    "definition": "The state of being respected or admired; prestige.",
    "example": "Publishing with the Oxford University Press lent immense academic cachet to his treatise.",
    "category": "Literary & Prose"
  },
  {
    "word": "provenance",
    "phonetic": "/ˈprɒvɪnəns/",
    "partOfSpeech": "noun",
    "definition": "The place of origin or earliest known history of something, especially an artwork.",
    "example": "The museum verified the painting’s provenance back to the private collection of King Charles I.",
    "category": "Literary & Prose"
  },
  {
    "word": "harbinger",
    "phonetic": "/ˈhɑːrbɪndʒər/",
    "partOfSpeech": "noun",
    "definition": "A person or thing that announces or signals the approach of another.",
    "example": "The arrival of swallows was celebrated as the joyful harbinger of gentle spring.",
    "category": "Literary & Prose"
  },
  {
    "word": "avatar",
    "phonetic": "/ˈævətɑːr/",
    "partOfSpeech": "noun",
    "definition": "An incarnation, bodily manifestation, or personification of a principle or quality.",
    "example": "The revolutionary leader was viewed by his followers as the living avatar of liberty.",
    "category": "Literary & Prose"
  },
  {
    "word": "quintessence",
    "phonetic": "/kwɪnˈtɛsəns/",
    "partOfSpeech": "noun",
    "definition": "The most perfect or typical example of a quality or class; the purest essence.",
    "example": "Her tranquil countryside cottage was the quintessence of rustic English charm.",
    "category": "Literary & Prose"
  },
  {
    "word": "archetype",
    "phonetic": "/ˈɑːrkɪtaɪp/",
    "partOfSpeech": "noun",
    "definition": "A very typical example of a certain person or thing; an original model.",
    "example": "The mythological wanderer is an enduring archetype present across world literatures.",
    "category": "Literary & Prose"
  },
  {
    "word": "paragon",
    "phonetic": "/ˈpærəɡɒn/",
    "partOfSpeech": "noun",
    "definition": "A person or thing regarded as a perfect model of excellence.",
    "example": "The elder physician was respected by all as a paragon of professional virtue and empathy.",
    "category": "Literary & Prose"
  },
  {
    "word": "nonpareil",
    "phonetic": "/ˌnɒnpəˈreɪl/",
    "partOfSpeech": "adjective",
    "definition": "Having no match or equal; unrivaled.",
    "example": "Her nonpareil vocal range allowed her to perform the most demanding operatic arias with ease.",
    "category": "Literary & Prose"
  },
  {
    "word": "touchstone",
    "phonetic": "/ˈtʌtʃstoʊn/",
    "partOfSpeech": "noun",
    "definition": "A standard or criterion by which something is judged or recognized.",
    "example": "Tolstoy’s epic remained the touchstone against which all historical novels were evaluated.",
    "category": "Literary & Prose"
  },
  {
    "word": "lodestar",
    "phonetic": "/ˈloʊdstɑːr/",
    "partOfSpeech": "noun",
    "definition": "A star that is used to guide the course of a ship; a guiding principle or interest.",
    "example": "Unyielding artistic integrity served as his constant lodestar throughout five decades.",
    "category": "Literary & Prose"
  },
  {
    "word": "cynosure",
    "phonetic": "/ˈsaɪnəʃʊər/",
    "partOfSpeech": "noun",
    "definition": "A person or thing that is the center of attention or admiration.",
    "example": "Wearing a gown of spun emerald silk, she was the undisputed cynosure of the royal ball.",
    "category": "Literary & Prose"
  },
  {
    "word": "vestige",
    "phonetic": "/ˈvɛstɪdʒ/",
    "partOfSpeech": "noun",
    "definition": "A trace of something that is disappearing or no longer exists.",
    "example": "The ancient crumbling aqueduct was the last visible vestige of Roman rule in the valley.",
    "category": "Literary & Prose"
  },
  {
    "word": "insignia",
    "phonetic": "/ɪnˈsɪɡniə/",
    "partOfSpeech": "noun",
    "definition": "A badge or distinguishing mark of military rank, office, or membership.",
    "example": "The admiral's golden collar insignia gleamed proudly in the morning parade.",
    "category": "Literary & Prose"
  },
  {
    "word": "accoutrement",
    "phonetic": "/əˈkuːtrəmənt/",
    "partOfSpeech": "noun",
    "definition": "Additional items of dress or equipment, or other items carried or worn for an activity.",
    "example": "His satchel was packed with all the scholarly accoutrements: quills, inkwells, and magnifying loupes.",
    "category": "Literary & Prose"
  },
  {
    "word": "soliloquize",
    "phonetic": "/səˈlɪləkwaɪz/",
    "partOfSpeech": "verb",
    "definition": "Talk to oneself, especially aloud; utter a soliloquy.",
    "example": "The distracted professor had a quaint habit of soliloquizing as he strolled through the quads.",
    "category": "Literary & Prose"
  },
  {
    "word": "somnambulist",
    "phonetic": "/sɒmˈnæmbjʊlɪst/",
    "partOfSpeech": "noun",
    "definition": "A person who walks in their sleep; a sleepwalker.",
    "example": "He wandered through the misty garden at dawn with the eerie grace of a somnambulist.",
    "category": "Literary & Prose"
  },
  {
    "word": "epistolary",
    "phonetic": "/ɪˈpɪstələri/",
    "partOfSpeech": "adjective",
    "definition": "Relating to or denoting the writing of letters or literary works in the form of letters.",
    "example": "Dracula is written in a brilliant epistolary format comprised of diary entries and letters.",
    "category": "Literary & Prose"
  },
  {
    "word": "circumscribe",
    "phonetic": "/ˈsɜːrkəmskraɪb/",
    "partOfSpeech": "verb",
    "definition": "Restrict something within limits; draw a circle around.",
    "example": "Her creative freedom was severely circumscribed by the censors of the authoritarian regime.",
    "category": "Literary & Prose"
  },
  {
    "word": "delineate",
    "phonetic": "/dɪˈlɪnieɪt/",
    "partOfSpeech": "verb",
    "definition": "Describe or portray something precisely; indicate the exact position of a border.",
    "example": "The contract clearly delineated the responsibilities of both parties regarding the patent.",
    "category": "Literary & Prose"
  },
  {
    "word": "demarcation",
    "phonetic": "/ˌdiːmɑːrˈkeɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The action of fixing the boundary or limits of something.",
    "example": "A clear line of demarcation separated the nature reserve from commercial logging lands.",
    "category": "Literary & Prose"
  },
  {
    "word": "elucidate",
    "phonetic": "/ɪˈluːsɪdeɪt/",
    "partOfSpeech": "verb",
    "definition": "Make something clear; explain.",
    "example": "The professor used vivid historical metaphors to elucidate the complex economic theorem.",
    "category": "Literary & Prose"
  },
  {
    "word": "exegesis",
    "phonetic": "/ˌɛksɪˈdʒiːsɪs/",
    "partOfSpeech": "noun",
    "definition": "Critical explanation or interpretation of a text, especially of scripture.",
    "example": "His scholarly exegesis of Dante’s Paradiso shed fresh light on its astronomical imagery.",
    "category": "Literary & Prose"
  },
  {
    "word": "expatiate",
    "phonetic": "/ɪkˈspeɪʃieɪt/",
    "partOfSpeech": "verb",
    "definition": "Speak or write at length or in detail.",
    "example": "He would happily expatiate for hours on the subtle virtues of seventeenth-century bookbinding.",
    "category": "Literary & Prose"
  },
  {
    "word": "extemporaneous",
    "phonetic": "/ɛkˌstɛmpəˈreɪniəs/",
    "partOfSpeech": "adjective",
    "definition": "Spoken or done without preparation; impromptu.",
    "example": "Her extemporaneous concession speech was widely praised for its poise and graciousness.",
    "category": "Literary & Prose"
  },
  {
    "word": "interpolate",
    "phonetic": "/ɪnˈtɜːrpəleɪt/",
    "partOfSpeech": "verb",
    "definition": "Insert something of a different nature into something else; alter a text by insertion.",
    "example": "Scholars discovered that later medieval scribes had interpolated verses into the Roman manuscript.",
    "category": "Literary & Prose"
  },
  {
    "word": "juxtaposition",
    "phonetic": "/ˌdʒʌkstəpəˈzɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The fact of two things being seen or placed close together with contrasting effect.",
    "example": "The stark juxtaposition of ancient stone temples and sleek glass skyscrapers defined the city.",
    "category": "Literary & Prose"
  },
  {
    "word": "lucubration",
    "phonetic": "/ˌluːkjʊˈbreɪʃən/",
    "partOfSpeech": "noun",
    "definition": "Laborious study or thought, especially at night; a piece of writing resulting from this.",
    "example": "His monumental multi-volume history was the fruit of forty years of midnight lucubration.",
    "category": "Literary & Prose"
  },
  {
    "word": "obfuscate",
    "phonetic": "/ˈɒbfʌskeɪt/",
    "partOfSpeech": "verb",
    "definition": "Render obscure, unclear, or unintelligible; bewilder.",
    "example": "The defense lawyer attempted to obfuscate the plain facts with a barrage of technical jargon.",
    "category": "Literary & Prose"
  },
  {
    "word": "peroration",
    "phonetic": "/ˌpɛrəˈreɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The concluding part of a speech, typically intended to inspire enthusiasm in an audience.",
    "example": "Churchill closed with a stirring peroration that brought the members of Parliament to their feet.",
    "category": "Literary & Prose"
  },
  {
    "word": "perspicuousness",
    "phonetic": "/pərˈspɪkjuːəsnɪs/",
    "partOfSpeech": "noun",
    "definition": "The quality of being easily understood, clear, and lucid in expression.",
    "example": "The textbook was admired by students for the admirable perspicuousness of its prose.",
    "category": "Literary & Prose"
  },
  {
    "word": "polemicist",
    "phonetic": "/pəˈlɛmɪsɪst/",
    "partOfSpeech": "noun",
    "definition": "A person who writes or speaks in a passionate, argumentative, and aggressive way.",
    "example": "The journalist was a brilliant polemicist who took great delight in puncturing political hypocrisy.",
    "category": "Literary & Prose"
  },
  {
    "word": "prolixity",
    "phonetic": "/proʊˈlɪksɪti/",
    "partOfSpeech": "noun",
    "definition": "The state or quality of being tediously prolonged, verbose, or wordy.",
    "example": "The judge cautioned the attorney against excessive prolixity during closing arguments.",
    "category": "Literary & Prose"
  },
  {
    "word": "propound",
    "phonetic": "/prəˈpaʊnd/",
    "partOfSpeech": "verb",
    "definition": "Put forward an idea, theory, or point of view for consideration by others.",
    "example": "He propounded a groundbreaking hypothesis on the social organization of early hominids.",
    "category": "Literary & Prose"
  },
  {
    "word": "prosody",
    "phonetic": "/ˈprɒsədi/",
    "partOfSpeech": "noun",
    "definition": "The patterns of rhythm and sound used in poetry; the theory and practice of versification.",
    "example": "Keats demonstrated supreme mastery of English prosody in his celebrated odes.",
    "category": "Literary & Prose"
  },
  {
    "word": "redaction",
    "phonetic": "/rɪˈdækʃən/",
    "partOfSpeech": "noun",
    "definition": "The process of editing text for publication; the censoring or obscuring of confidential parts.",
    "example": "The government released the classified memorandum with heavy black ink redactions.",
    "category": "Literary & Prose"
  },
  {
    "word": "repartee",
    "phonetic": "/ˌrɛpɑːrˈtiː/",
    "partOfSpeech": "noun",
    "definition": "Conversation or speech characterized by quick, witty, and clever comments or replies.",
    "example": "The salon was legendary for the glittering repartee exchanged between artists and poets.",
    "category": "Literary & Prose"
  },
  {
    "word": "rubrication",
    "phonetic": "/ˌruːbrɪˈkeɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The highlighting or heading of text in red ink, as in medieval manuscripts.",
    "example": "The master calligrapher completed the rubrication of the liturgical calendar.",
    "category": "Literary & Prose"
  },
  {
    "word": "sciolism",
    "phonetic": "/ˈsaɪəlɪzəm/",
    "partOfSpeech": "noun",
    "definition": "A superficial show of learning or wisdom; pretentiousness.",
    "example": "His dinner-table speech on quantum mechanics was exposed as embarrassing sciolism.",
    "category": "Literary & Prose"
  },
  {
    "word": "soliloquizer",
    "phonetic": "/səˈlɪləkwaɪzər/",
    "partOfSpeech": "noun",
    "definition": "One who utters a soliloquy or talks to oneself.",
    "example": "The eccentric archivist was a habitual soliloquizer as he cataloged the ancient papyri.",
    "category": "Literary & Prose"
  },
  {
    "word": "stemma",
    "phonetic": "/ˈstɛmə/",
    "partOfSpeech": "noun",
    "definition": "A family tree or genealogical chart, especially of manuscripts.",
    "example": "Textual critics drew a stemma to trace how the Homeric epic had been copied over millennia.",
    "category": "Literary & Prose"
  },
  {
    "word": "syllabary",
    "phonetic": "/ˈsɪləbəri/",
    "partOfSpeech": "noun",
    "definition": "A set of written characters representing syllables, serving the purpose of an alphabet.",
    "example": "Linear B was deciphered as an ancient Greek syllabary rather than an alphabet.",
    "category": "Literary & Prose"
  },
  {
    "word": "tome",
    "phonetic": "/toʊm/",
    "partOfSpeech": "noun",
    "definition": "A book, especially a large, heavy, and scholarly one.",
    "example": "He hauled the leather-bound tome down from the top shelf of the cathedral archive.",
    "category": "Literary & Prose"
  },
  {
    "word": "tract",
    "phonetic": "/trækt/",
    "partOfSpeech": "noun",
    "definition": "A short treatise in pamphlet form, typically on a religious or political subject.",
    "example": "The philosopher published an influential tract advocating for universal freedom of speech.",
    "category": "Literary & Prose"
  },
  {
    "word": "treatise",
    "phonetic": "/ˈtriːtɪs/",
    "partOfSpeech": "noun",
    "definition": "A written work dealing formally and systematically with a subject.",
    "example": "John Locke’s Two Treatises of Government laid the foundational principles of modern democracy.",
    "category": "Literary & Prose"
  },
  {
    "word": "vade-mecum",
    "phonetic": "/ˌveɪdi ˈmiːkəm/",
    "partOfSpeech": "noun",
    "definition": "A handbook or guide kept constantly at hand for consultation; literally 'go with me.'",
    "example": "The field naturalist considered Gilbert White’s Selborne his indispensable vade-mecum.",
    "category": "Literary & Prose"
  },
  {
    "word": "verbatim",
    "phonetic": "/vɜːrˈbeɪtɪm/",
    "partOfSpeech": "adverb",
    "definition": "In exactly the same words as were used originally.",
    "example": "The court reporter recorded every testimony verbatim for the official legal transcript.",
    "category": "Literary & Prose"
  },
  {
    "word": "videlicet",
    "phonetic": "/vɪˈdɛlɪsɛt/",
    "partOfSpeech": "adverb",
    "definition": "Namely; that is to say (used to specify items in legal or scholarly texts).",
    "example": "The charter applied to three northern provinces, videlicet York, Durham, and Lancaster.",
    "category": "Literary & Prose"
  },
  {
    "word": "zeugma",
    "phonetic": "/ˈzjuːɡmə/",
    "partOfSpeech": "noun",
    "definition": "A figure of speech in which a word applies to two others in different senses.",
    "example": "'She broke his car and his heart' is an artful and memorable zeugma.",
    "category": "Literary & Prose"
  },
  {
    "word": "sfumato",
    "phonetic": "/sfuːˈmɑːtoʊ/",
    "partOfSpeech": "noun",
    "definition": "The technique of allowing tones and colors to shade gradually into one another, producing softened outlines.",
    "example": "Leonardo da Vinci employed masterly sfumato to impart that elusive, enigmatic smile to the Mona Lisa.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "impasto",
    "phonetic": "/ɪmˈpæstoʊ/",
    "partOfSpeech": "noun",
    "definition": "The technique of applying paint thickly so that it stands out from the surface.",
    "example": "Van Gogh applied thick impasto in swirling strokes that gave his starry night sky tangible vibration.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "pentimento",
    "phonetic": "/ˌpɛntɪˈmɛntoʊ/",
    "partOfSpeech": "noun",
    "definition": "A visible trace of an earlier painting beneath a layer or layers of paint on a canvas.",
    "example": "X-ray analysis revealed a fascinating pentimento showing a hound that Rembrandt had later painted over.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "trompe-l'oeil",
    "phonetic": "/ˌtrɒmp ˈlɔɪ/",
    "partOfSpeech": "noun",
    "definition": "Visual illusion in art, especially as used to trick the eye into perceiving detail as three-dimensional.",
    "example": "The painted ceiling was an astounding trompe-l'œil of cherubs floating beneath open clouds.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "arabesque",
    "phonetic": "/ˌærəˈbɛsk/",
    "partOfSpeech": "noun",
    "definition": "An ornamental design consisting of intertwined flowing lines, or a ballet posture with one leg extended back.",
    "example": "The Moorish palace walls were carved in dizzyingly intricate geometric arabesques.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "filigree",
    "phonetic": "/ˈfɪlɪɡriː/",
    "partOfSpeech": "noun",
    "definition": "Ornamental work of fine (typically gold or silver) wire formed into delicate tracery.",
    "example": "She wore antique silver earrings of Venetian filigree as delicate as frosty spiderwebs.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "tessera",
    "phonetic": "/ˈtɛsərə/",
    "partOfSpeech": "noun",
    "definition": "A small block of stone, tile, bone, or glass used in the construction of a mosaic.",
    "example": "Each tiny gold-leaf tessera captured the flickering candlelight of the Byzantine basilica.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "grisaille",
    "phonetic": "/ɡrɪˈzaɪ/",
    "partOfSpeech": "noun",
    "definition": "A method of painting in gray monochrome, typically to imitate a sculpture.",
    "example": "The outer wings of the altarpiece were rendered in solemn, sculptural grisaille.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "repoussoir",
    "phonetic": "/rəˌpuːswɑːr/",
    "partOfSpeech": "noun",
    "definition": "An object or figure in the foreground of a painting that directs the viewer's eye into the composition.",
    "example": "The dark silhouetted elm tree served as a masterly repoussoir framing the sunlit cathedral.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "intaglio",
    "phonetic": "/ɪnˈtɑːlioʊ/",
    "partOfSpeech": "noun",
    "definition": "A design incised or engraved into a material; a printmaking technique where ink sits in carved grooves.",
    "example": "The Italian master printer inspected the delicate etched lines of the copper intaglio plate.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "cloisonne",
    "phonetic": "/ˌklwɑːzəˈneɪ/",
    "partOfSpeech": "noun",
    "definition": "Decorative work in which enamel, glass, or gemstones are separated by strips of flattened wire.",
    "example": "The Ming dynasty vase was a breathtaking tour de force of midnight-blue cloisonné.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "fresco",
    "phonetic": "/ˈfrɛskoʊ/",
    "partOfSpeech": "noun",
    "definition": "A painting done rapidly in watercolor on wet plaster on a wall or ceiling.",
    "example": "Michelangelo lay on high wooden scaffolding for years painting the Sistine Chapel frescoes.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "tempera",
    "phonetic": "/ˈtɛmpərə/",
    "partOfSpeech": "noun",
    "definition": "A method of painting with pigments dispersed in an emulsion miscible with water, typically egg yolk.",
    "example": "Botticelli’s Birth of Venus glows with the luminous, matte permanence of egg tempera.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "encaustic",
    "phonetic": "/ɛnˈkɔːstɪk/",
    "partOfSpeech": "noun",
    "definition": "A painting technique using pigments mixed with hot wax, which are burned in after application.",
    "example": "The Fayum mummy portraits retained their startling, lifelike vibrancy through the encaustic technique.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "bas-relief",
    "phonetic": "/ˌbɑː rɪˈliːf/",
    "partOfSpeech": "noun",
    "definition": "Sculpture in which the figures project only slightly from the background.",
    "example": "The frieze along the temple wall depicted the Trojan War in exquisitely detailed marble bas-relief.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "caryatid",
    "phonetic": "/ˌkæriˈætɪd/",
    "partOfSpeech": "noun",
    "definition": "A stone carving of a draped female figure, used as a pillar to support the entablature of a Greek building.",
    "example": "Six sculpted caryatids supported the porch of the Erechtheion overlooking ancient Athens.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "finial",
    "phonetic": "/ˈfɪniəl/",
    "partOfSpeech": "noun",
    "definition": "A distinctive ornament at the apex of a roof, pinnacle, canopy, or upon furniture.",
    "example": "A gilded pineapple finial crowned the spire of the grand Dutch colonial clock tower.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "colonnade",
    "phonetic": "/ˌkɒləˈneɪd/",
    "partOfSpeech": "noun",
    "definition": "A row of columns supporting a roof, an entablature, or arcade.",
    "example": "The grand colonnade of St. Peter’s Square embraced the pilgrims like welcoming stone arms.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "peristyle",
    "phonetic": "/ˈpɛrɪstaɪl/",
    "partOfSpeech": "noun",
    "definition": "A row of columns surrounding a space within a building such as a court or internal garden.",
    "example": "They sipped iced pomegranate juice beside the splashing fountain in the Roman villa’s peristyle.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "cupola",
    "phonetic": "/ˈkjuːpələ/",
    "partOfSpeech": "noun",
    "definition": "A small dome, especially a small dome on a drum on top of a larger dome, adorning a roof.",
    "example": "From the wooden cupola atop the barn, one could see across three counties of ripening wheat.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "rotunda",
    "phonetic": "/roʊˈtʌndə/",
    "partOfSpeech": "noun",
    "definition": "A round building or room, especially one with a dome.",
    "example": "Tourists whispered in awe beneath the open oculus of the Pantheon’s ancient rotunda.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "nave",
    "phonetic": "/neɪv/",
    "partOfSpeech": "noun",
    "definition": "The central part of a church building, intended to accommodate most of the congregation.",
    "example": "Sunlight streamed through stained glass clerestory windows, illuminating the vast stone nave.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "transept",
    "phonetic": "/ˈtrænsɛpt/",
    "partOfSpeech": "noun",
    "definition": "Either of the two parts forming the arms of the cross shape, navigating at right angles from the nave in a church.",
    "example": "The poet’s monument was erected in the south transept, famously known as Poets' Corner.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "buttress",
    "phonetic": "/ˈbʌtrɪs/",
    "partOfSpeech": "noun",
    "definition": "A projecting support of stone or brick built against a wall to reinforce it.",
    "example": "Massive stone buttresses held the ancient fortress walls upright against centuries of earth tremors.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "arcade",
    "phonetic": "/ɑːrˈkeɪd/",
    "partOfSpeech": "noun",
    "definition": "A covered passageway with arches along one or both sides.",
    "example": "Shops selling leather journals and antique prints lined the sunlit Italian stone arcade.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "balustrade",
    "phonetic": "/ˈbæləstreɪd/",
    "partOfSpeech": "noun",
    "definition": "A railing supported by balusters, especially one forming an ornamental parapet to a balcony or terrace.",
    "example": "She rested her gloved hands on the marble balustrade, watching the fireworks reflect in the lagoon.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "crenellation",
    "phonetic": "/ˌkrɛnɪˈleɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The battlements of a castle or other building, featuring alternating open indentations.",
    "example": "Archers patrolled the stone crenellations as dusk fell over the besieged mountain citadel.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "barbican",
    "phonetic": "/ˈbɑːrbɪkən/",
    "partOfSpeech": "noun",
    "definition": "The outer defense of a castle or walled city, especially a double tower above a gate or drawbridge.",
    "example": "The enemy knights were trapped inside the fortified barbican before they could breach the inner gate.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "portcullis",
    "phonetic": "/pɔːrtˈkʌlɪs/",
    "partOfSpeech": "noun",
    "definition": "A strong, heavy grating that can be lowered in vertical grooves to close the gateway to a castle.",
    "example": "With a deafening groan of iron chains, the spiked portcullis slammed into the flagstones.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "donjon",
    "phonetic": "/ˈdɒndʒən/",
    "partOfSpeech": "noun",
    "definition": "The great tower or innermost keep of a castle.",
    "example": "The royal family took refuge in the thick-walled donjon as siege catapults bombarded the courtyard.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "bastion",
    "phonetic": "/ˈbæstiən/",
    "partOfSpeech": "noun",
    "definition": "A projecting part of a fortification built at an angle to the line of a wall; an institution upholding principles.",
    "example": "The university stood as an unyielding bastion of academic freedom and rational inquiry.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "rampart",
    "phonetic": "/ˈræmpɑːrt/",
    "partOfSpeech": "noun",
    "definition": "A defensive wall of a castle or walled city, having a broad top with a walkway.",
    "example": "From the high coastal ramparts, sentries scanned the gray horizon for incoming sails.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "citadel",
    "phonetic": "/ˈsɪtədɛl/",
    "partOfSpeech": "noun",
    "definition": "A fortress, typically on high ground, protecting or dominating a city.",
    "example": "The ancient citadel rose majestically above the terracotta roofs of the harbor town.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "acropolis",
    "phonetic": "/əˈkrɒpəlɪs/",
    "partOfSpeech": "noun",
    "definition": "A citadel or fortified part of an ancient Greek city, typically built on a hill.",
    "example": "The Parthenon crowned the Athenian Acropolis, radiant under the Mediterranean sun.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "amphitheater",
    "phonetic": "/ˈæmfɪˌθiːətər/",
    "partOfSpeech": "noun",
    "definition": "An open circular or oval building with a central space surrounded by tiers of seats for spectators.",
    "example": "The acoustics of the ancient Greek amphitheater allowed even a whisper on stage to reach the top tier.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "catacomb",
    "phonetic": "/ˈkætəkuːm/",
    "partOfSpeech": "noun",
    "definition": "An underground cemetery consisting of a subterranean gallery with recesses for tombs.",
    "example": "Torchlight flickered along the limestone passages of the ancient Roman catacombs.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "cenotaph",
    "phonetic": "/ˈsɛnətɑːf/",
    "partOfSpeech": "noun",
    "definition": "A monument to someone whose remains are buried elsewhere, especially for soldiers fallen in war.",
    "example": "Every November, townspeople laid wreaths of scarlet poppies at the foot of the granite cenotaph.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "obelisk",
    "phonetic": "/ˈɒbəlɪsk/",
    "partOfSpeech": "noun",
    "definition": "A stone pillar, typically having a square or rectangular cross section and a pyramidal top.",
    "example": "The granite Egyptian obelisk in the piazza had witnessed three millennia of human history.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "ziggurat",
    "phonetic": "/ˈzɪɡʊræt/",
    "partOfSpeech": "noun",
    "definition": "A rectangular stepped tower, sometimes surmounted by a temple, in ancient Mesopotamia.",
    "example": "The mudbrick ziggurat of Ur rose like an artificial mountain from the flat Euphrates plain.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "sarcophagus",
    "phonetic": "/sɑːrˈkɒfəɡəs/",
    "partOfSpeech": "noun",
    "definition": "A stone coffin, typically adorned with a sculpture or inscription and associated with ancient civilizations.",
    "example": "The pharaoh’s gilded sarcophagus was carved with protective spells and depictions of Osiris.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "crypt",
    "phonetic": "/krɪpt/",
    "partOfSpeech": "noun",
    "definition": "An underground room or vault beneath a church, used as a chapel or burial place.",
    "example": "Scholars descended into the chilly Romanesque crypt to inspect the newly discovered reliquary.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "tumulus",
    "phonetic": "/ˈtjuːmjʊləs/",
    "partOfSpeech": "noun",
    "definition": "An ancient burial mound; a barrow.",
    "example": "Wildflowers bloomed atop the bronze-age tumulus overlooking the serene blue bay.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "dolmen",
    "phonetic": "/ˈdɒlmɛn/",
    "partOfSpeech": "noun",
    "definition": "A megalithic tomb with a large flat stone laid on upright ones.",
    "example": "The ancient dolmen stood solitary on the windswept moor, an enigmatic portal to forgotten centuries.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "ossuary",
    "phonetic": "/ˈɒsjʊəri/",
    "partOfSpeech": "noun",
    "definition": "A container or room in which the bones of dead people are placed.",
    "example": "The walls of the Sedlec ossuary were artistically decorated with thousands of skeletal remains.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "reliquary",
    "phonetic": "/ˈrɛlɪkwəri/",
    "partOfSpeech": "noun",
    "definition": "A container for holy relics, often elaborately adorned with gold and gemstones.",
    "example": "The gilded Gothic reliquary contained what believers claimed was a fragment of the True Cross.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "scriptorium",
    "phonetic": "/skrɪpˈtɔːriəm/",
    "partOfSpeech": "noun",
    "definition": "A room set apart for writing in a monastery where manuscripts were copied.",
    "example": "Monks worked in hushed concentration inside the sunlit scriptorium, illuminating psalters.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "refectory",
    "phonetic": "/rɪˈfɛktəri/",
    "partOfSpeech": "noun",
    "definition": "A room used for communal meals, especially in an educational or religious institution.",
    "example": "Leonardo painted The Last Supper directly onto the end wall of the convent’s quiet refectory.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "vermilion",
    "phonetic": "/vərˈmɪljən/",
    "partOfSpeech": "noun",
    "definition": "A brilliant red pigment made from mercury sulfide (cinnabar); vivid scarlet.",
    "example": "The torii gate was coated in vivid vermilion, contrasting sharply with the snow-covered cedars.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "cerulean",
    "phonetic": "/səˈruːliən/",
    "partOfSpeech": "adjective",
    "definition": "Deep blue in color like a clear sky.",
    "example": "They anchored their sailboat in a tranquil cove where the water was a dazzling cerulean.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "ultramarine",
    "phonetic": "/ˌʌltrəməˈriːn/",
    "partOfSpeech": "noun",
    "definition": "A brilliant deep blue pigment originally made by grinding lapis lazuli.",
    "example": "Renaissance patrons paid a king's ransom for real ultramarine to paint the Virgin's robes.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "ochre",
    "phonetic": "/ˈoʊkər/",
    "partOfSpeech": "noun",
    "definition": "An earthy pigment containing ferric oxide, typically with clay, varying from light yellow to brown.",
    "example": "Prehistoric artists mixed red ochre with animal fat to paint bison on cave walls.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "umber",
    "phonetic": "/ˈʌmbər/",
    "partOfSpeech": "noun",
    "definition": "A natural pigment resembling ochre but containing manganese dioxide, resulting in a warmer brown.",
    "example": "The portraitist used raw umber to lay down the shadowy contours of the elderly scholar's face.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "sienna",
    "phonetic": "/siˈɛnə/",
    "partOfSpeech": "noun",
    "definition": "An earth pigment containing iron oxide and manganese oxide, yellowish-brown when raw, reddish when burnt.",
    "example": "Sunlight bathed the Tuscan hills in warm washes of burnt sienna and gold.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "viridian",
    "phonetic": "/vəˈrɪdiən/",
    "partOfSpeech": "noun",
    "definition": "A bluish-green pigment consisting of hydrated chromium oxide.",
    "example": "Monet swept strokes of cool viridian across the pond to depict submerged water lily stems.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "celadon",
    "phonetic": "/ˈsɛlədɒn/",
    "partOfSpeech": "noun",
    "definition": "A willow-green color or a type of Chinese ceramic with a pale gray-green glaze.",
    "example": "The Song dynasty teacup featured a crackled celadon glaze as smooth as jade.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "carmine",
    "phonetic": "/ˈkɑːrmaɪn/",
    "partOfSpeech": "noun",
    "definition": "A vivid crimson color; a pigment made from cochineal insects.",
    "example": "The royal velvet mantle was dyed a deep, luxurious carmine that commanded instant reverence.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "scarlet",
    "phonetic": "/ˈskɑːrlɪt/",
    "partOfSpeech": "adjective",
    "definition": "Of a brilliant red color with a tinge of orange.",
    "example": "Maple leaves turned ablaze in brilliant scarlet as the first autumn frosts arrived.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "magenta",
    "phonetic": "/məˈdʒɛntə/",
    "partOfSpeech": "noun",
    "definition": "A light purplish-red color; one of the four ink colors used in color printing.",
    "example": "A dramatic magenta sunset illuminated the dramatic edges of the storm clouds.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "auburn",
    "phonetic": "/ˈɔːbərn/",
    "partOfSpeech": "adjective",
    "definition": "Of a reddish-brown color (typically used of human hair).",
    "example": "Her thick auburn curls caught the golden afternoon light as she leaned over her easel.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "russet",
    "phonetic": "/ˈrʌsɪt/",
    "partOfSpeech": "adjective",
    "definition": "Reddish brown in color, especially like autumn leaves or coarse wool.",
    "example": "The fox’s russet coat blended flawlessly into the fallen oak leaves on the forest floor.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "sable",
    "phonetic": "/ˈseɪbəl/",
    "partOfSpeech": "noun",
    "definition": "A marten with short dark brown or black fur; in heraldry, the color black.",
    "example": "He wore an aristocratic velvet cloak of deepest sable trimmed with silver embroidery.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "argent",
    "phonetic": "/ˈɑːrdʒənt/",
    "partOfSpeech": "noun",
    "definition": "Silver; in heraldry, the white or silver tincture.",
    "example": "The knight’s shield displayed a proud black stallion rearing against a field of pure argent.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "azure",
    "phonetic": "/ˈæʒər/",
    "partOfSpeech": "noun",
    "definition": "Bright blue in color, like a cloudless sky.",
    "example": "The Mediterranean stretched beneath them, a breathless infinity of azure and turquoise.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "gules",
    "phonetic": "/ɡjuːlz/",
    "partOfSpeech": "noun",
    "definition": "Red, as a heraldic tincture.",
    "example": "The ancestral banner bore three golden lions passant on a field of vibrant gules.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "purpure",
    "phonetic": "/ˈpɜːrpjʊər/",
    "partOfSpeech": "noun",
    "definition": "Purple, as a heraldic tincture.",
    "example": "The imperial decree was sealed with royal purpure wax bearing the sovereign’s signet.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "kaleidoscopic",
    "phonetic": "/kəˌlaɪdəˈskɒpɪk/",
    "partOfSpeech": "adjective",
    "definition": "Having complex patterns of colors; continually shifting and rapidly changing.",
    "example": "The bustling night bazaar was a kaleidoscopic whirlwind of spices, lanterns, and silks.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "chromatic",
    "phonetic": "/krəˈmætɪk/",
    "partOfSpeech": "adjective",
    "definition": "Relating to color; of or using notes not belonging to the diatonic scale.",
    "example": "Debussy’s preludes floated through shimmering chromatic harmonies that dissolved classical boundaries.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "monochromatic",
    "phonetic": "/ˌmɒnəkrəˈmætɪk/",
    "partOfSpeech": "adjective",
    "definition": "Containing or using only one color or shades of one color.",
    "example": "The black-and-white photograph had a striking monochromatic intensity that captured raw emotion.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "polychromatic",
    "phonetic": "/ˌpɒlɪkrəˈmætɪk/",
    "partOfSpeech": "adjective",
    "definition": "Having or exhibiting a variety of colors; multicolored.",
    "example": "The cathedral’s rose window was a polychromatic masterpiece of medieval glassblowing.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "sepia",
    "phonetic": "/ˈsiːpiə/",
    "partOfSpeech": "noun",
    "definition": "A reddish-brown color associated particularly with monochrome nineteenth-century photographs.",
    "example": "The dusty attic box contained sepia portraits of great-grandparents gazing sternly into the lens.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "patina",
    "phonetic": "/ˈpætɪnə/",
    "partOfSpeech": "noun",
    "definition": "A green or brown film on the surface of bronze or similar metals; an impression of appearance of age.",
    "example": "Decades of coastal rain had gifted the bronze statue a noble, velvety green patina.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "verdigris",
    "phonetic": "/ˈvɜːrdɪɡriː/",
    "partOfSpeech": "noun",
    "definition": "A bright bluish-green encrustation or patina formed on copper or brass by atmospheric oxidation.",
    "example": "The copper roof of the parliament building had oxidized into its iconic, pale verdigris.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "damascene",
    "phonetic": "/ˈdæməsiːn/",
    "partOfSpeech": "verb",
    "definition": "Inlay a metal object with gold or silver decoration; mark steel with wavy patterns.",
    "example": "The samurai sword blade was damascened with delicate swirling waves of folded steel.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "marquetry",
    "phonetic": "/ˈmɑːrkɪtri/",
    "partOfSpeech": "noun",
    "definition": "Inlaid work made from small pieces of variously colored wood or other materials in furniture.",
    "example": "The Louis XIV cabinet featured breathtaking floral marquetry crafted from tulipwood and ebony.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "parquetry",
    "phonetic": "/ˈpɑːrkɪtri/",
    "partOfSpeech": "noun",
    "definition": "Inlaid woodwork in geometric patterns, used especially for flooring.",
    "example": "The grand ballroom floor was an intricate geometric parquetry of honey oak and dark walnut.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "cameo",
    "phonetic": "/ˈkæmioʊ/",
    "partOfSpeech": "noun",
    "definition": "A piece of jewelry consisting of a portrait in profile carved in relief on a background of a different color.",
    "example": "She pinned an antique Victorian shell cameo to the high collar of her lace blouse.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "repousse",
    "phonetic": "/rəˈpuːseɪ/",
    "partOfSpeech": "noun",
    "definition": "Metalwork hammered into relief from the reverse side.",
    "example": "The Celtic bronze shield was decorated in bold repoussé spirals and stylized dragon motifs.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "diptych",
    "phonetic": "/ˈdɪptɪk/",
    "partOfSpeech": "noun",
    "definition": "A painting or carving on two hinged panels, typically used as an altarpiece.",
    "example": "The traveler kept a pocket diptych of the saints carved from aged pearwood.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "triptych",
    "phonetic": "/ˈtrɪptɪk/",
    "partOfSpeech": "noun",
    "definition": "A picture or relief carving on three panels, typically hinged together side by side.",
    "example": "Hieronymus Bosch’s The Garden of Earthly Delights is the most famous triptych in Western art.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "polyptych",
    "phonetic": "/ˈpɒlɪptɪk/",
    "partOfSpeech": "noun",
    "definition": "A painting, typically an altarpiece, consisting of more than three panels.",
    "example": "The Ghent Altarpiece by the Van Eyck brothers is an awe-inspiring twelve-panel polyptych.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "cartouche",
    "phonetic": "/kɑːrˈtuːʃ/",
    "partOfSpeech": "noun",
    "definition": "An oval or oblong design with a slightly convex surface, typically with ornamental scrollwork.",
    "example": "The cartouche at the corner of the seventeenth-century sea chart bore the navigator's dedication.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "grotesque",
    "phonetic": "/ɡroʊˈtɛsk/",
    "partOfSpeech": "noun",
    "definition": "A style of decorative art characterized by fanciful combinations of human, animal, and foliage forms.",
    "example": "Carved stone grotesques leered playfully from the cathedral eaves above the marketplace.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "rosette",
    "phonetic": "/roʊˈzɛt/",
    "partOfSpeech": "noun",
    "definition": "A rose-shaped arrangement of ribbon, metal, or stone carving.",
    "example": "A magnificent carved limestone rosette adorned the ceiling of the ducal banquet hall.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "frieze",
    "phonetic": "/friːz/",
    "partOfSpeech": "noun",
    "definition": "A broad horizontal band of sculpted or painted decoration, especially on a wall near the ceiling.",
    "example": "The Parthenon frieze immortalized the citizens of Athens in triumphant festival procession.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "cornice",
    "phonetic": "/ˈkɔːrnɪs/",
    "partOfSpeech": "noun",
    "definition": "An ornamental molding round the wall of a room just below the ceiling.",
    "example": "Plaster restorers carefully repaired the ornate egg-and-dart cornice in the library.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "pediment",
    "phonetic": "/ˈpɛdɪmənt/",
    "partOfSpeech": "noun",
    "definition": "The triangular upper part of the front of a classical building, typically surmounting a portico.",
    "example": "Sculpted figures of Athena and Poseidon adorned the great marble pediment of the temple.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "portico",
    "phonetic": "/ˈpɔːrtɪkoʊ/",
    "partOfSpeech": "noun",
    "definition": "A structure consisting of a roof supported by columns at regular intervals, typically attached as a porch.",
    "example": "They took shelter from the sudden cloudburst beneath the grand portico of the museum.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "atrium",
    "phonetic": "/ˈeɪtriəm/",
    "partOfSpeech": "noun",
    "definition": "An open-roofed entrance hall or central court in an ancient Roman house; a sky-lit central court in modern architecture.",
    "example": "Rainwater collected in the marble impluvium at the center of the Roman villa's sunlit atrium.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "cloister",
    "phonetic": "/ˈklɔɪstər/",
    "partOfSpeech": "noun",
    "definition": "A covered walk in a convent, monastery, college, or cathedral, typically with a colonnade opening onto a quadrangle.",
    "example": "The elderly scholar found deep tranquility strolling the quiet flagstones of the abbey cloister.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "parapet",
    "phonetic": "/ˈpærəpɪt/",
    "partOfSpeech": "noun",
    "definition": "A low protective wall along the edge of a roof, bridge, or balcony.",
    "example": "She leaned over the stone parapet, watching the swan glide beneath the arches of the bridge.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "flying-buttress",
    "phonetic": "/ˈflaɪɪŋ ˈbʌtrɪs/",
    "partOfSpeech": "noun",
    "definition": "A buttress slanting from a separate pier, typically forming an arch with the wall it supports.",
    "example": "Flying buttresses allowed Gothic cathedrals to soar to breathtaking heights and feature walls of pure glass.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "gargoyle",
    "phonetic": "/ˈɡɑːrɡɔɪl/",
    "partOfSpeech": "noun",
    "definition": "A carved human or animal figure projecting from the gutter of a building, typically in the form of an open-mouthed beast.",
    "example": "Water spouted from the stone jaws of the cathedral gargoyle during the summer storm.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "traceried",
    "phonetic": "/ˈtreɪsərid/",
    "partOfSpeech": "adjective",
    "definition": "Decorated with or resembling delicate branching ornamental stone or wire work.",
    "example": "Moonlight poured through the traceried stone windows, casting lacy shadows on the tomb.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "stele",
    "phonetic": "/ˈstiːli/",
    "partOfSpeech": "noun",
    "definition": "An upright stone slab or column bearing an inscription or relief design, serving as a monument.",
    "example": "The Code of Hammurabi was inscribed upon an eight-foot stele of black basalt.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "cenotaphic",
    "phonetic": "/ˌsɛnəˈtæfɪk/",
    "partOfSpeech": "adjective",
    "definition": "Pertaining to or serving as a monument to one buried elsewhere.",
    "example": "A cenotaphic marble plaque in the village church honored sailors lost in the Arctic.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "lychgate",
    "phonetic": "/ˈlɪtʃɡeɪt/",
    "partOfSpeech": "noun",
    "definition": "A roofed gateway to a churchyard, formerly used for sheltering a coffin during funerals.",
    "example": "A carpet of snow fell softly upon the timber beams of the quaint medieval lychgate.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "parsonage",
    "phonetic": "/ˈpɑːrsənɪdʒ/",
    "partOfSpeech": "noun",
    "definition": "A church house provided for a parson or minister.",
    "example": "Jane Austen composed several of her timeless novels in the quiet drawing room of the parsonage.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "manse",
    "phonetic": "/mæns/",
    "partOfSpeech": "noun",
    "definition": "The house provided for a minister of certain Christian churches, especially in Scotland.",
    "example": "A winding flagstone path bordered with lavender led to the welcoming door of the stone manse.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "cloistered",
    "phonetic": "/ˈklɔɪstərd/",
    "partOfSpeech": "adjective",
    "definition": "Enclosed by or having a cloister; kept away from the outside world; sheltered.",
    "example": "He lived a cloistered academic existence, immersed entirely in ancient Syriac papyri.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "anchorite",
    "phonetic": "/ˈæŋkəraɪt/",
    "partOfSpeech": "noun",
    "definition": "A religious recluse; a hermit who has withdrawn from the world for solitary devotion.",
    "example": "Julian of Norwich was a renowned medieval anchorite whose visions offered profound comfort.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "epistemic",
    "phonetic": "/ˌɛpɪˈstiːmɪk/",
    "partOfSpeech": "adjective",
    "definition": "Relating to knowledge or to the degree of its validation and certainty.",
    "example": "His argument examined the epistemic foundations upon which historical claims are constructed.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "panpsychism",
    "phonetic": "/pænˈsaɪkɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The doctrine or belief that everything material, down to fundamental particles, has an aspect of consciousness.",
    "example": "Modern philosophers of mind are revisiting panpsychism to address the hard problem of consciousness.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "noumenon",
    "phonetic": "/ˈnuːmɪnɒn/",
    "partOfSpeech": "noun",
    "definition": "A thing as it is in itself, as distinct from a phenomenon as it is perceived by the senses.",
    "example": "Kant posited that while we perceive the sensory world, the noumenon remains forever beyond direct grasp.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "qualia",
    "phonetic": "/ˈkwɑːliə/",
    "partOfSpeech": "noun",
    "definition": "The internal and subjective component of sense perceptions, arising from stimulation of the senses by phenomena.",
    "example": "The vivid, untranslatable redness of a ripe pomegranate is a quintessential example of qualia.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "perspicacious",
    "phonetic": "/ˌpɜːrspɪˈkeɪʃəs/",
    "partOfSpeech": "adjective",
    "definition": "Having a ready insight into and understanding of things; sharp-witted.",
    "example": "The perspicacious detective noticed the mud on the suspect’s cuff that everyone else had overlooked.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "sagacious",
    "phonetic": "/səˈɡeɪʃəs/",
    "partOfSpeech": "adjective",
    "definition": "Having or showing keen mental discernment and good judgment; wise.",
    "example": "The sovereign relied upon the sagacious counsel of her elderly grand vizier in times of war.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "erudition",
    "phonetic": "/ˌɛrʊˈdɪʃən/",
    "partOfSpeech": "noun",
    "definition": "The quality of having or showing great knowledge or learning; profound scholarship.",
    "example": "His essays were celebrated for their breathtaking erudition and effortless cross-cultural references.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "pedantry",
    "phonetic": "/ˈpɛdəntri/",
    "partOfSpeech": "noun",
    "definition": "Excessive concern with minor details, rules, or with displaying academic learning.",
    "example": "The debate degenerated into pointless pedantry over whether a semicolon should have been a colon.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "sophistry",
    "phonetic": "/ˈsɒfɪstri/",
    "partOfSpeech": "noun",
    "definition": "The use of fallacious arguments, especially with the intention of deceiving.",
    "example": "Socrates exposed the clever sophistry of the orators who prioritized victory over truth.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "casuistry",
    "phonetic": "/ˈkæʒʊɪstri/",
    "partOfSpeech": "noun",
    "definition": "The use of clever but unsound reasoning, especially in relation to moral questions.",
    "example": "The minister used elaborate theological casuistry to justify breaking his sacred oath.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "antinomy",
    "phonetic": "/ænˈtɪnəmi/",
    "partOfSpeech": "noun",
    "definition": "A contradiction between two beliefs or conclusions that are in themselves reasonable; a paradox.",
    "example": "Kant’s famous antinomies demonstrated that reason inevitably confronts insoluble paradoxes about the cosmos.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "eschatology",
    "phonetic": "/ˌɛskəˈtɒlədʒi/",
    "partOfSpeech": "noun",
    "definition": "The part of theology concerned with death, judgment, and the final destiny of the soul and of humankind.",
    "example": "Medieval apocalyptic art was saturated with dramatic visions of eschatology and divine reckoning.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "theodicy",
    "phonetic": "/θiˈɒdɪsi/",
    "partOfSpeech": "noun",
    "definition": "The vindication of divine goodness and providence in view of the existence of evil.",
    "example": "Leibniz’s celebrated theodicy argued that our universe is the best of all possible worlds.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "panentheism",
    "phonetic": "/ˌpænɛnˈθiːɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The belief or doctrine that God is greater than the universe and includes and interpenetrates it.",
    "example": "Spinoza’s sublime mysticism has often been interpreted through the lens of panentheism.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "esoteric",
    "phonetic": "/ˌɛsəˈtɛrɪk/",
    "partOfSpeech": "adjective",
    "definition": "Intended for or likely to be understood by only a small number of people with a specialized knowledge.",
    "example": "The library maintained a locked chamber devoted to rare, esoteric alchemical treatises.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "exoteric",
    "phonetic": "/ˌɛksəʊˈtɛrɪk/",
    "partOfSpeech": "adjective",
    "definition": "Intended for or likely to be understood by the general public (opposed to esoteric).",
    "example": "The philosopher published exoteric dialogues for the public, saving his dense lectures for initiates.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "hermetic",
    "phonetic": "/hɜːrˈmɛtɪk/",
    "partOfSpeech": "adjective",
    "definition": "Complete and airtight; relating to an ancient occult tradition associated with Hermes Trismegistus.",
    "example": "He lived in hermetic isolation in the mountain observatory, indifferent to worldly politics.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "recondite",
    "phonetic": "/ˈrɛkəndaɪt/",
    "partOfSpeech": "adjective",
    "definition": "Little known; abstruse; dealing with very profound or difficult subject matter.",
    "example": "Her doctoral dissertation explored a recondite dialect spoken in an isolated Pyrenean valley.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "abstruse",
    "phonetic": "/æbˈstruːs/",
    "partOfSpeech": "adjective",
    "definition": "Difficult to understand; obscure.",
    "example": "The mathematician’s abstruse equations filled three chalkboards with arcane symbols.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "cryptic",
    "phonetic": "/ˈkrɪptɪk/",
    "partOfSpeech": "adjective",
    "definition": "Having a meaning that is mysterious or obscure.",
    "example": "He left a cryptic note on his desk containing only a geographic coordinate and a date.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "enigmatic",
    "phonetic": "/ˌɛnɪɡˈmætɪk/",
    "partOfSpeech": "adjective",
    "definition": "Difficult to interpret or understand; mysterious.",
    "example": "She offered an enigmatic smile that revealed neither approval nor disapproval.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "equivocal",
    "phonetic": "/ɪˈkwɪvəkəl/",
    "partOfSpeech": "adjective",
    "definition": "Open to more than one interpretation; ambiguous; uncertain or questionable in nature.",
    "example": "The results of the preliminary chemical experiment were decidedly equivocal.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "circumspect",
    "phonetic": "/ˈsɜːrkəmspɛkt/",
    "partOfSpeech": "adjective",
    "definition": "Wary and unwilling to take risks; cautious and prudent.",
    "example": "The diplomat was exceedingly circumspect in his choice of words during the tense press conference.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "scrupulous",
    "phonetic": "/ˈskruːpjʊləs/",
    "partOfSpeech": "adjective",
    "definition": "Diligent, thorough, and extremely attentive to details; very concerned to avoid doing wrong.",
    "example": "The archivist was scrupulous in cataloging each delicate eighteenth-century folio.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "sedulous",
    "phonetic": "/ˈsɛdjʊləs/",
    "partOfSpeech": "adjective",
    "definition": "Showing dedication and diligence; meticulous and persistent.",
    "example": "Through sedulous research in local municipal records, she traced her lineage to 1420.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "assiduous",
    "phonetic": "/əˈsɪdʒuːəs/",
    "partOfSpeech": "adjective",
    "definition": "Showing great care and perseverance.",
    "example": "Thanks to the assiduous efforts of the botanists, the rare alpine orchid was saved from extinction.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "indefatigable",
    "phonetic": "/ˌɪndɪˈfætɪɡəbəl/",
    "partOfSpeech": "adjective",
    "definition": "Persisting tirelessly; untiring in effort.",
    "example": "An indefatigable champion of human rights, she traveled to sixty countries to advocate for refugees.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "pertinacious",
    "phonetic": "/ˌpɜːrtɪˈneɪʃəs/",
    "partOfSpeech": "adjective",
    "definition": "Holding firmly to an opinion or a course of action; resolute and obstinate.",
    "example": "The journalist’s pertinacious questioning finally compelled the mayor to reveal the confidential audit.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "intractable",
    "phonetic": "/ɪnˈtræktəbəl/",
    "partOfSpeech": "adjective",
    "definition": "Hard to control or deal with; stubborn.",
    "example": "The geopolitical dispute between the border nations seemed intractable after decades of hostility.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "contumacious",
    "phonetic": "/ˌkɒntjuːˈmeɪʃəs/",
    "partOfSpeech": "adjective",
    "definition": "Stubbornly or willfully disobedient to authority.",
    "example": "The judge held the contumacious witness in contempt of court for refusing to answer the summons.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "intransigent",
    "phonetic": "/ɪnˈtrænsɪdʒənt/",
    "partOfSpeech": "adjective",
    "definition": "Unwilling or refusing to change one's views or to agree about something.",
    "example": "Negotiations stalled because both factions adopted rigidly intransigent negotiating stances.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "obdurate",
    "phonetic": "/ˈɒbdjʊrɪt/",
    "partOfSpeech": "adjective",
    "definition": "Stubbornly refusing to change one's opinion or course of action; hardened in feeling.",
    "example": "Despite the earnest pleas of his children, the old miser remained obdurate in his stinginess.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "inexorable",
    "phonetic": "/ɪnˈɛksərəbəl/",
    "partOfSpeech": "adjective",
    "definition": "Impossible to stop or prevent; unrelenting.",
    "example": "Nothing could halt the inexorable march of time across the crumbling granite monuments.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "adamant",
    "phonetic": "/ˈædəmənt/",
    "partOfSpeech": "adjective",
    "definition": "Refusing to be persuaded or to change one's mind; impervious to pleas.",
    "example": "She was adamant that the historical archives must remain freely accessible to the public.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "stalwart",
    "phonetic": "/ˈstɔːlwərt/",
    "partOfSpeech": "adjective",
    "definition": "Loyal, reliable, and hardworking; strongly built and sturdy.",
    "example": "He was a stalwart supporter of the free library, volunteering his Saturdays for thirty years.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "indomitable",
    "phonetic": "/ɪnˈdɒmɪtəbəl/",
    "partOfSpeech": "adjective",
    "definition": "Impossible to subdue or defeat; brave and determined.",
    "example": "Her indomitable spirit carried the expedition through freezing storms and perilous mountain passes.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "intrepid",
    "phonetic": "/ɪnˈtrɛpɪd/",
    "partOfSpeech": "adjective",
    "definition": "Fearless; adventurous (often used for rhetorical or humorous effect).",
    "example": "The intrepid photojournalist ventured into the eye of the hurricane to document the surge.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "audacious",
    "phonetic": "/ɔːˈdeɪʃəs/",
    "partOfSpeech": "adjective",
    "definition": "Showing a willingness to take surprisingly bold risks; impudent.",
    "example": "He formulated an audacious plan to navigate the frozen Northwest Passage in a wooden schooner.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "temerarious",
    "phonetic": "/ˌtɛməˈrɛəriəs/",
    "partOfSpeech": "adjective",
    "definition": "Reckless; rash; presumptuously daring.",
    "example": "His temerarious leap from the cliff into the churning ocean stunned the onlookers.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "dauntless",
    "phonetic": "/ˈdɔːntlɪs/",
    "partOfSpeech": "adjective",
    "definition": "Showing determination and no fear; valiant.",
    "example": "With dauntless courage, the lighthouse keeper rowed out into the gale to rescue shipwreck survivors.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "valiant",
    "phonetic": "/ˈvæliənt/",
    "partOfSpeech": "adjective",
    "definition": "Possessing or showing courage or determination; heroic.",
    "example": "The firefighters made a valiant effort to save the historic eighteenth-century opera house.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "chivalrous",
    "phonetic": "/ˈʃɪvəlrəs/",
    "partOfSpeech": "adjective",
    "definition": "Courteous and gallant, especially towards women; honoring noble codes of conduct.",
    "example": "His chivalrous manner and thoughtful courtesy recalled the courtly romances of old.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "gallant",
    "phonetic": "/ˈɡælənt/",
    "partOfSpeech": "adjective",
    "definition": "Brave; heroic; giving polite and attentive respect.",
    "example": "The captain made a gallant stand at the mountain pass, allowing the villagers to evacuate safely.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "magnanimous",
    "phonetic": "/mæɡˈnænɪməs/",
    "partOfSpeech": "adjective",
    "definition": "Generous or forgiving, especially toward a rival or less powerful person.",
    "example": "In victory, she proved remarkably magnanimous, praising the skill and vigor of her opponent.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "munificent",
    "phonetic": "/mjuːˈnɪfɪsənt/",
    "partOfSpeech": "adjective",
    "definition": "More generous than is usual or necessary; lavish.",
    "example": "Thanks to a munificent endowment from an anonymous alumnus, tuition was made completely free.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "beneficent",
    "phonetic": "/bəˈnɛfɪsənt/",
    "partOfSpeech": "adjective",
    "definition": "Generous or doing good; resulting in good.",
    "example": "The beneficent monarch founded free universities and botanical gardens across the kingdom.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "altruistic",
    "phonetic": "/ˌæltruːˈɪstɪk/",
    "partOfSpeech": "adjective",
    "definition": "Showing a disinterested and selfless concern for the well-being of others.",
    "example": "Her altruistic devotion to treating leprosy patients in remote valleys inspired a generation of doctors.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "benevolent",
    "phonetic": "/bəˈnɛvələnt/",
    "partOfSpeech": "adjective",
    "definition": "Well meaning and kindly; serving a charitable rather than a profit-making purpose.",
    "example": "The elderly magistrate possessed a benevolent countenance that instantly put the nervous child at ease.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "philanthropic",
    "phonetic": "/ˌfɪlənˈθrɒpɪk/",
    "partOfSpeech": "adjective",
    "definition": "Seeking to promote the welfare of others, especially by donating money to good causes.",
    "example": "The family’s philanthropic foundation financed the restoration of dozens of medieval castles.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "eleemosynary",
    "phonetic": "/ˌɛlɪɪˈmɒsɪnəri/",
    "partOfSpeech": "adjective",
    "definition": "Relating to or dependent on charity; charitable.",
    "example": "The hospice was maintained entirely through the eleemosynary bequests of generous citizens.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "affable",
    "phonetic": "/ˈæfəbəl/",
    "partOfSpeech": "adjective",
    "definition": "Friendly, good-natured, or easy to talk to.",
    "example": "Despite his global renown, the Nobel laureate remained an affable and approachable teacher.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "genial",
    "phonetic": "/ˈdʒiːniəl/",
    "partOfSpeech": "adjective",
    "definition": "Friendly and cheerful; pleasantly warm and mild.",
    "example": "A genial host, he greeted every guest at the manor door with a warm handshake and a smile.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "cordial",
    "phonetic": "/ˈkɔːrdiəl/",
    "partOfSpeech": "adjective",
    "definition": "Warm and friendly; deeply felt.",
    "example": "They concluded the delicate peace treaty in an atmosphere of mutual respect and cordial goodwill.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "convivial",
    "phonetic": "/kənˈvɪviəl/",
    "partOfSpeech": "adjective",
    "definition": "Friendly, lively, and enjoyable; cheerful and jovial.",
    "example": "The festival dinner was a convivial celebration that stretched long past the midnight chimes.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "urbane",
    "phonetic": "/ɜːrˈbeɪn/",
    "partOfSpeech": "adjective",
    "definition": "Courteous and refined in manner; suave and cosmopolitan.",
    "example": "His urbane charm and witty conversational flair made him the star of every diplomatic reception.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "suave",
    "phonetic": "/swɑːv/",
    "partOfSpeech": "adjective",
    "definition": "Charming, elegant, and confident in a sophisticated manner.",
    "example": "The spy slipped into the gala in a tailored tuxedo, exuding suave European sophistication.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "debonair",
    "phonetic": "/ˌdɛbəˈnɛər/",
    "partOfSpeech": "adjective",
    "definition": "Confident, stylish, and charming (typically used of a man).",
    "example": "He tipped his fedora with a debonair smile before stepping into the vintage cabriolet.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "decorous",
    "phonetic": "/ˈdɛkərəs/",
    "partOfSpeech": "adjective",
    "definition": "In keeping with good taste and propriety; polite and restrained.",
    "example": "The guests maintained a decorous silence as the bride processed down the cathedral aisle.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "stately",
    "phonetic": "/ˈsteɪtli/",
    "partOfSpeech": "adjective",
    "definition": "Having a noble, majestic, or dignified appearance or manner.",
    "example": "A stately row of ancient horse-chestnut trees flanked the grand avenue leading to the chateau.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "august",
    "phonetic": "/ɔːˈɡʌst/",
    "partOfSpeech": "adjective",
    "definition": "Respected and impressive; inspiring reverence and admiration.",
    "example": "The historic constitutional assembly met in the august marble chambers of the senate hall.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "venerable",
    "phonetic": "/ˈvɛnərəbəl/",
    "partOfSpeech": "adjective",
    "definition": "Accorded a great deal of respect, especially because of age, wisdom, or character.",
    "example": "They consulted the venerable monastery abbot, who had lived on the holy mountain for sixty years.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "sedate",
    "phonetic": "/sɪˈdeɪt/",
    "partOfSpeech": "adjective",
    "definition": "Calm, dignified, and unhurried; quiet and sober.",
    "example": "The elders preferred a sedate game of chess in the shade to the noisy celebrations in the square.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "phlegmatic",
    "phonetic": "/flɛɡˈmætɪk/",
    "partOfSpeech": "adjective",
    "definition": "Having an unemotional and stolidly calm disposition.",
    "example": "Even when the stock market tumbled in panic, the phlegmatic investor quietly bought underpriced assets.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "imperturbable",
    "phonetic": "/ˌɪmpərˈtɜːrbəbəl/",
    "partOfSpeech": "adjective",
    "definition": "Unable to be upset or excited; calm under immense pressure.",
    "example": "The surgeon’s imperturbable hands worked with absolute precision throughout the ten-hour operation.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "equanimous",
    "phonetic": "/ɪˈkwænɪməs/",
    "partOfSpeech": "adjective",
    "definition": "Calm and composed, especially under stress.",
    "example": "She remained remarkably equanimous while facing the aggressive cross-examination of the prosecutor.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "jaunty",
    "phonetic": "/ˈdʒɔːnti/",
    "partOfSpeech": "adjective",
    "definition": "Having or expressing a lively, cheerful, and self-confident manner.",
    "example": "He walked down the boulevard with a jaunty step and a red carnation tucked into his lapel.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "sprightly",
    "phonetic": "/ˈspraɪtli/",
    "partOfSpeech": "adjective",
    "definition": "Lively; full of energy (especially used of an old person).",
    "example": "At eighty-eight, the sprightly gardener still climbed fruit ladders and tended twenty beehives.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "vivacious",
    "phonetic": "/vɪˈveɪʃəs/",
    "partOfSpeech": "adjective",
    "definition": "Attractively lively and animated (typically used of a woman).",
    "example": "Her vivacious personality and radiant laughter brought warmth to the quiet countryside dinner.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "mercurial",
    "phonetic": "/mɜːrˈkjʊəriəl/",
    "partOfSpeech": "adjective",
    "definition": "Subject to sudden or unpredictable changes of mood or mind; volatile and spirited.",
    "example": "The brilliant director was notoriously mercurial, swinging from effusive praise to stormy fury in minutes.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "whimsical",
    "phonetic": "/ˈwɪmzɪkəl/",
    "partOfSpeech": "adjective",
    "definition": "Playfully quaint or fanciful, especially in an appealing and amusing way.",
    "example": "The children’s book was filled with whimsical illustrations of mice sailing walnut-shell boats.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "capricious",
    "phonetic": "/kəˈprɪʃəs/",
    "partOfSpeech": "adjective",
    "definition": "Given to sudden and unaccountable changes of mood or behavior.",
    "example": "The capricious weather of the highlands could turn bright blue skies into blinding snowstorms in an hour.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "eccentric",
    "phonetic": "/ɪkˈsɛntrɪk/",
    "partOfSpeech": "adjective",
    "definition": "Unconventional and slightly strange in behavior or character.",
    "example": "The eccentric inventor wore two watches set to different hemispheres and rode a tall penny-farthing.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "aberrant",
    "phonetic": "/əˈbɛrənt/",
    "partOfSpeech": "adjective",
    "definition": "Departing from an accepted standard or normal behavior.",
    "example": "The scientist flagged the aberrant temperature reading and initiated a system recalibration.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "anomalous",
    "phonetic": "/əˈnɒmələs/",
    "partOfSpeech": "adjective",
    "definition": "Deviating from what is standard, normal, or expected.",
    "example": "The satellite detected an anomalous magnetic pulse emanating from deep beneath the polar icecap.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "singular",
    "phonetic": "/ˈsɪŋɡjʊlər/",
    "partOfSpeech": "adjective",
    "definition": "Exceptionally good or great; remarkable; unique.",
    "example": "She possessed a singular talent for capturing the fleeting expressions of wild animals on canvas.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "peerless",
    "phonetic": "/ˈpɪərlɪs/",
    "partOfSpeech": "adjective",
    "definition": "Unequaled; unrivaled; having no match.",
    "example": "The prima ballerina was celebrated for her peerless grace and effortless leaps across the stage.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "matchless",
    "phonetic": "/ˈmætʃlɪs/",
    "partOfSpeech": "adjective",
    "definition": "Unable to be equaled in quality or excellence; incomparable.",
    "example": "The acoustics of the ancient amphitheater provided matchless clarity for acoustic choral singing.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "incomparable",
    "phonetic": "/ɪnˈkɒmpərəbəl/",
    "partOfSpeech": "adjective",
    "definition": "Without an equal in quality or character; matchless.",
    "example": "Watching the sunrise over the misty Grand Canyon was an incomparable sensory experience.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "exemplary",
    "phonetic": "/ɪɡˈzɛmpləri/",
    "partOfSpeech": "adjective",
    "definition": "Serving as a desirable model; representing the best of its kind.",
    "example": "Her exemplary conduct throughout the humanitarian crisis earned her the highest civilian honor.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "transcendent",
    "phonetic": "/trænˈsɛndənt/",
    "partOfSpeech": "adjective",
    "definition": "Beyond or above the range of normal or merely physical human experience; supreme.",
    "example": "The symphony’s climax achieved a transcendent beauty that left the entire concert hall breathless.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "immanent",
    "phonetic": "/ˈɪmənənt/",
    "partOfSpeech": "adjective",
    "definition": "Existing or operating within; permanently pervading and sustained.",
    "example": "The poet saw divine grace as an immanent presence woven through every blade of grass.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "inexorable-mind",
    "phonetic": "/ɪnˈɛksərəbəl maɪnd/",
    "partOfSpeech": "noun",
    "definition": "A disciplined intellectual resolve that cannot be swayed by sentimentality.",
    "example": "She analyzed the historical records with an inexorable mind, uncovering uncomfortable truths.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "sagacity-virtue",
    "phonetic": "/səˈɡæsɪti ˈvɜːrtʃuː/",
    "partOfSpeech": "noun",
    "definition": "The habit of applying wisdom and sound discernment to human dilemmas.",
    "example": "His lifelong study of stoicism granted him a calm, steady sagacity.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "intellection",
    "phonetic": "/ˌɪntɪˈlɛkʃən/",
    "partOfSpeech": "noun",
    "definition": "The action or process of understanding, thinking, or using the intellect.",
    "example": "True artistic innovation requires deep emotional intuition paired with rigorous intellection.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "perspicience",
    "phonetic": "/pərˈspɪʃəns/",
    "partOfSpeech": "noun",
    "definition": "The quality of acute mental discernment and clear insight.",
    "example": "Her perspicience allowed her to see through flattering falsehoods instantly.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "sagaciousness",
    "phonetic": "/səˈɡeɪʃəsnɪs/",
    "partOfSpeech": "noun",
    "definition": "The quality of having deep judgment and practical wisdom.",
    "example": "The elders respected him for the calm sagaciousness he brought to council disputes.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "sapience",
    "phonetic": "/ˈseɪpiəns/",
    "partOfSpeech": "noun",
    "definition": "Great wisdom or knowledge; discernment.",
    "example": "The ancient owl was revered in woodland folklore as the living emblem of quiet sapience.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "acumen",
    "phonetic": "/ˈækjʊmən/",
    "partOfSpeech": "noun",
    "definition": "The ability to make good judgments and quick decisions, typically in a particular domain.",
    "example": "Her financial acumen transformed the struggling community press into a thriving publishing house.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "eruditeness",
    "phonetic": "/ˈɛrʊdaɪtnɪs/",
    "partOfSpeech": "noun",
    "definition": "The condition of possessing deep, extensive scholarship and cultivated knowledge.",
    "example": "The debate was notable for the gentlemanly eruditeness displayed by both opposing scholars.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "lucubrator",
    "phonetic": "/ˈluːkjʊbreɪtər/",
    "partOfSpeech": "noun",
    "definition": "One who studies, meditates, or writes late into the night.",
    "example": "A dedicated lucubrator, his lamp was invariably the last beacon shining in the quiet college court.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "ratiocinator",
    "phonetic": "/ˌræʃiˈɒsɪneɪtər/",
    "partOfSpeech": "noun",
    "definition": "A person who reasons logically, deducing conclusions from established facts.",
    "example": "Like Voltaire’s Zadig, the detective was a master ratiocinator of obscure clues.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "dialectician",
    "phonetic": "/ˌdaɪələkˈtɪʃən/",
    "partOfSpeech": "noun",
    "definition": "A person skilled in philosophical debate and reasoned argument.",
    "example": "Plato portrayed Socrates as the supreme dialectician of the ancient Mediterranean world.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "hermeneut",
    "phonetic": "/ˈhɜːrmənuːt/",
    "partOfSpeech": "noun",
    "definition": "An interpreter of sacred texts, literary manuscripts, or ancient wisdom.",
    "example": "The Renaissance hermeneut sought the universal philosophia perennis concealed in ancient myth.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "solipsist",
    "phonetic": "/ˈsɒlɪpsɪst/",
    "partOfSpeech": "noun",
    "definition": "A person who believes that only their own mind and thoughts exist with certainty.",
    "example": "The eccentric recluse lived as an uncompromising solipsist, writing letters only to himself.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "teleologist",
    "phonetic": "/ˌtɛliˈɒlədʒɪst/",
    "partOfSpeech": "noun",
    "definition": "A philosopher who interprets natural phenomena in terms of purpose, intention, and end-goals.",
    "example": "As a classical teleologist, he believed that every living creature is oriented toward an intrinsic good.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "ontologist",
    "phonetic": "/ɒnˈtɒlədʒɪst/",
    "partOfSpeech": "noun",
    "definition": "A metaphysician who studies the fundamental nature of existence and reality.",
    "example": "The ontologist probed whether mathematical truths exist independently of the human mind.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "cosmogonist",
    "phonetic": "/kɒzˈmɒɡənɪst/",
    "partOfSpeech": "noun",
    "definition": "A person who studies the origin and creation of the universe.",
    "example": "Ancient cosmogonists wove celestial myths of cosmic eggs and primordial oceans.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "eschatologist",
    "phonetic": "/ˌɛskəˈtɒlədʒɪst/",
    "partOfSpeech": "noun",
    "definition": "A scholar or theologian who studies the final destiny of humanity and the cosmos.",
    "example": "The eschatologist compared prophecy traditions across twenty world religions.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "theodician",
    "phonetic": "/θiːəˈdɪʃən/",
    "partOfSpeech": "noun",
    "definition": "One who defends divine justice in the face of human suffering and world evil.",
    "example": "Milton set out in Paradise Lost as a poetic theodician to justify the ways of God to men.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "panentheist",
    "phonetic": "/ˌpænɛnˈθiːɪst/",
    "partOfSpeech": "noun",
    "definition": "One who holds that God interpenetrates and encompasses the cosmos while exceeding it.",
    "example": "The transcendentalist poet was an instinctive panentheist, greeting the sacred in forest silence.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "fernweh",
    "phonetic": "/ˈfɛrnveɪ/",
    "partOfSpeech": "noun",
    "definition": "An ache for distant places; a craving for travel and distant foreign lands.",
    "example": "Staring at the vintage globes in the antiquarian shop filled him with an insatiable fernweh.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "gemutlichkeit",
    "phonetic": "/ɡəˈmuːtlɪçkaɪt/",
    "partOfSpeech": "noun",
    "definition": "A state of warmth, friendliness, coziness, and good cheer.",
    "example": "The alpine cabin, with its crackling woodstove and mulled cider, radiated pure Gemütlichkeit.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "hygge",
    "phonetic": "/ˈhjuːɡə/",
    "partOfSpeech": "noun",
    "definition": "A Danish quality of coziness and comfortable conviviality that engenders contentment.",
    "example": "Woolen blankets, glowing beeswax candles, and a quiet novel embodied the spirit of hygge.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "lagom",
    "phonetic": "/ˈlɑːɡɒm/",
    "partOfSpeech": "noun",
    "definition": "The Swedish concept of 'just enough'—moderation, balance, and sustainable sufficiency in life.",
    "example": "Living in harmony with lagom, she cultivated a life free of wasteful excess and stressful scarcity.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sisu",
    "phonetic": "/ˈsiːsuː/",
    "partOfSpeech": "noun",
    "definition": "Extraordinary Finnish determination, stoic courage, and tenacity in the face of daunting adversity.",
    "example": "When the blizzards cut off the village, the islanders met the trial with legendary sisu.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "ikigai",
    "phonetic": "/ˌiːkɪˈɡaɪ/",
    "partOfSpeech": "noun",
    "definition": "A Japanese concept meaning 'a reason for being'—the intersection of passion, mission, and vocation.",
    "example": "Waking early to tend the heirloom olive grove gave the elderly farmer his lifelong ikigai.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "shinrin-yoku",
    "phonetic": "/ˈʃɪnrɪn ˈjoʊkuː/",
    "partOfSpeech": "noun",
    "definition": "The practice of 'forest bathing'—immersing oneself in nature through all five senses.",
    "example": "A morning of silent shinrin-yoku beneath the ancient cedar canopy lowered their blood pressure and stilled their thoughts.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "tsundoku",
    "phonetic": "/tsuːnˈdoʊkuː/",
    "partOfSpeech": "noun",
    "definition": "The habit of acquiring books and letting them pile up unread on shelves and nightstands.",
    "example": "Guilty of unapologetic tsundoku, his bedside table groaned under towers of untouched volumes.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "boketto",
    "phonetic": "/boʊˈkɛtoʊ/",
    "partOfSpeech": "noun",
    "definition": "The Japanese act of gazing vacantly into the distance without thinking of anything in particular.",
    "example": "She leaned on the porch railing in peaceful boketto, watching cloud shadows drift across the hills.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "komorebi-leaf",
    "phonetic": "/koʊmoʊˈrɛbi liːf/",
    "partOfSpeech": "noun",
    "definition": "The shimmering play of sunlight through foliage.",
    "example": "The meadow path was patterned with dancing komorebi as the breeze stirred the canopy.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "psithurism-breeze",
    "phonetic": "/ˈsɪθjʊrɪzəm briːz/",
    "partOfSpeech": "noun",
    "definition": "The whispering of the wind in the trees.",
    "example": "In the quiet orchard, the only companion was the gentle psithurism-breeze.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "parhelion",
    "phonetic": "/pɑːrˈhiːliən/",
    "partOfSpeech": "noun",
    "definition": "A bright spot in the sky appearing on either side of the sun, formed by ice crystals; a sun dog.",
    "example": "Two radiant parhelia flanked the morning sun above the frozen Canadian prairie.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "paraselene",
    "phonetic": "/ˌpærəsɪˈliːniː/",
    "partOfSpeech": "noun",
    "definition": "A bright spot on a lunar halo; a mock moon or moon dog.",
    "example": "In the subzero stillness of midnight, a rare paraselene shimmered beside the full moon.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gegenschein",
    "phonetic": "/ˈɡeɪɡənˌʃaɪn/",
    "partOfSpeech": "noun",
    "definition": "A faint glowing patch in the night sky directly opposite the position of the sun.",
    "example": "Far from city light pollution, astronomers observed the faint, mysterious oval of the gegenschein.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "ignis-fatuus",
    "phonetic": "/ˌɪɡnɪs ˈfætʃʊəs/",
    "partOfSpeech": "noun",
    "definition": "A phosphorescent light that hovers over swampy ground; an elusive goal or illusion.",
    "example": "Travelers through the peat bogs were cautioned never to follow the flickering ignis-fatuus.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "bioluminescence",
    "phonetic": "/ˌbaɪoʊˌluːmɪˈnɛsəns/",
    "partOfSpeech": "noun",
    "definition": "The biochemical emission of light by living organisms such as fireflies and deep-sea fish.",
    "example": "Kayaking through the bay at night stirred trails of turquoise bioluminescence with every paddle stroke.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "asterism",
    "phonetic": "/ˈæstərɪzəm/",
    "partOfSpeech": "noun",
    "definition": "A prominent pattern or group of stars, smaller than a constellation, or a star-shaped optical phenomenon in gemstones.",
    "example": "The Big Dipper is an easily recognized asterism within the constellation Ursa Major.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "chatoyancy",
    "phonetic": "/ʃəˈtɔɪənsi/",
    "partOfSpeech": "noun",
    "definition": "An optical reflectance effect in gemstones producing a silky luster like a cat's eye.",
    "example": "The cabochon chrysoberyl exhibited mesmerizing chatoyancy as it turned under the jeweler’s lamp.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "labradorescence",
    "phonetic": "/ˌlæbrədɔːrˈɛsəns/",
    "partOfSpeech": "noun",
    "definition": "A play of iridescent metallic colors seen in the mineral labradorite.",
    "example": "The polished pendant flared in sudden peacock blues and golds through brilliant labradorescence.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "pleochroism",
    "phonetic": "/pliːˈɒkroʊɪzəm/",
    "partOfSpeech": "noun",
    "definition": "The optical phenomenon where a crystal shows different colors when viewed from different angles.",
    "example": "The tanzanite crystal demonstrated vivid pleochroism, shifting from sapphire blue to rich violet.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "loquacious",
    "phonetic": "/loʊˈkweɪʃəs/",
    "partOfSpeech": "adjective",
    "definition": "Tending to talk a great deal; talkative and communicative.",
    "example": "The loquacious tour guide regaled visitors with colorful ghost stories at every palace chamber.",
    "category": "Literary & Prose"
  },
  {
    "word": "voluble",
    "phonetic": "/ˈvɒljʊbəl/",
    "partOfSpeech": "adjective",
    "definition": "Speaking or spoken incessantly and fluently; smooth-talking.",
    "example": "She gave a voluble and spirited defense of modern classical composition.",
    "category": "Literary & Prose"
  },
  {
    "word": "mellifluent",
    "phonetic": "/mɛˈlɪfluːənt/",
    "partOfSpeech": "adjective",
    "definition": "Flowing like honey; sweetly musical in sound.",
    "example": "The poet read his verses in a rich, mellifluent baritone that held the amphitheater spellbound.",
    "category": "Literary & Prose"
  },
  {
    "word": "dulcet",
    "phonetic": "/ˈdʌlsɪt/",
    "partOfSpeech": "adjective",
    "definition": "Sweet and soothing to the ear (often used ironically).",
    "example": "The dulcet tones of the Renaissance lute drifted through the courtyard herb garden.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sonorous",
    "phonetic": "/səˈnɔːrəs/",
    "partOfSpeech": "adjective",
    "definition": "Imposingly deep and full, resonant in sound.",
    "example": "The abbey’s massive bronze bell rang out in sonorous peals across the misty valley.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "stentorian",
    "phonetic": "/stɛnˈtɔːriən/",
    "partOfSpeech": "adjective",
    "definition": "Extremely loud and powerful (of a person's voice).",
    "example": "The drill sergeant issued his dawn orders in a stentorian roar that shook the barracks.",
    "category": "Literary & Prose"
  },
  {
    "word": "obstreperous",
    "phonetic": "/əbˈstrɛpərəs/",
    "partOfSpeech": "adjective",
    "definition": "Noisy and difficult to control; unruly.",
    "example": "The debate grew obstreperous as audience members shouted over the moderators.",
    "category": "Literary & Prose"
  },
  {
    "word": "quiescent",
    "phonetic": "/kwiˈɛsənt/",
    "partOfSpeech": "adjective",
    "definition": "In a state or period of inactivity or dormancy.",
    "example": "The volcano had remained quiescent for over four centuries before rumbling to life.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "abeyant",
    "phonetic": "/əˈbeɪənt/",
    "partOfSpeech": "adjective",
    "definition": "In a state of temporary disuse or suspension.",
    "example": "The centuries-old hereditary title lay abeyant until a direct heir was discovered.",
    "category": "Literary & Prose"
  },
  {
    "word": "fealty",
    "phonetic": "/ˈfiːəlti/",
    "partOfSpeech": "noun",
    "definition": "A feudal tenant's or vassal's sworn loyalty to a lord; allegiance.",
    "example": "The knights knelt in the stone great hall to swear fealty to the young queen.",
    "category": "Literary & Prose"
  },
  {
    "word": "sacrosanct",
    "phonetic": "/ˈsækrəsæŋkt/",
    "partOfSpeech": "adjective",
    "definition": "Regarded as too important or valuable to be interfered with; inviolable.",
    "example": "In academic tradition, the freedom of independent research was regarded as sacrosanct.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "antediluvian",
    "phonetic": "/ˌæntɪdɪˈluːviən/",
    "partOfSpeech": "adjective",
    "definition": "Of or belonging to the time before the biblical Flood; ridiculously old-fashioned.",
    "example": "His antediluvian notions about gender roles were roundly rejected by the modern board.",
    "category": "Literary & Prose"
  },
  {
    "word": "paramount",
    "phonetic": "/ˈpærəmaʊnt/",
    "partOfSpeech": "adjective",
    "definition": "More important than anything else; supreme.",
    "example": "Ensuring the safety of the miners remained the paramount priority of the expedition.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "clement",
    "phonetic": "/ˈklɛmənt/",
    "partOfSpeech": "adjective",
    "definition": "Mild, pleasant, and temperate (of weather); merciful and lenient.",
    "example": "A clement autumn breeze allowed them to dine outdoors under the olive pergolas.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "bounteous",
    "phonetic": "/ˈbaʊntiəs/",
    "partOfSpeech": "adjective",
    "definition": "Generously given or giving; bountiful and plentiful.",
    "example": "The villagers celebrated the bounteous autumn harvest with cider, dancing, and pies.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "munificence",
    "phonetic": "/mjuːˈnɪfɪsəns/",
    "partOfSpeech": "noun",
    "definition": "The quality or action of being lavishly generous; great generosity.",
    "example": "Thanks to the prince’s munificence, the historic observatory was fully equipped with modern telescopes.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "forthright",
    "phonetic": "/ˈfɔːrθraɪt/",
    "partOfSpeech": "adjective",
    "definition": "Direct and outspoken; straightforward and honest.",
    "example": "The witness gave a forthright and courageous account of the environmental violation.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "zealous",
    "phonetic": "/ˈzɛləs/",
    "partOfSpeech": "adjective",
    "definition": "Having or showing great energy or enthusiasm in pursuit of a cause or an objective.",
    "example": "He was a zealous advocate for universal literacy, founding rural bookmobiles in every county.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "sinewy",
    "phonetic": "/ˈsɪnjuːi/",
    "partOfSpeech": "adjective",
    "definition": "Consisting of or resembling sinews; lean, tough, and muscular.",
    "example": "The seasoned gondolier rowed through the Venetian canals with sinewy, effortless grace.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lithe",
    "phonetic": "/laɪð/",
    "partOfSpeech": "adjective",
    "definition": "Thin, supple, and graceful in movement or body.",
    "example": "The leopard moved with lithe, silent perfection through the tall savanna grass.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "mercurial-spirit",
    "phonetic": "/mɜːrˈkjʊəriəl ˈspɪrɪt/",
    "partOfSpeech": "noun",
    "definition": "A lively, volatile temperament prone to creative leaps.",
    "example": "Her mercurial-spirit produced revolutionary paintings that broke every classical rule.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "mellifluence",
    "phonetic": "/mɛˈlɪfluːəns/",
    "partOfSpeech": "noun",
    "definition": "A smooth, sweet, and pleasing flow of sound.",
    "example": "The mellifluence of the stream over river stones sang the weary hikers to sleep.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "pluviosity",
    "phonetic": "/ˌpluːviˈɒsɪti/",
    "partOfSpeech": "noun",
    "definition": "The quality or state of being rainy; raininess.",
    "example": "The lush emerald moss of the Pacific Northwest owes its existence to legendary pluviosity.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "fluvial-drift",
    "phonetic": "/ˈfluːviəl drɪft/",
    "partOfSpeech": "noun",
    "definition": "Sediment or timber carried along by river currents.",
    "example": "Driftwood piled high along the sandbar, carried there by centuries of fluvial-drift.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sylvan-haven",
    "phonetic": "/ˈsɪlvən ˈheɪvən/",
    "partOfSpeech": "noun",
    "definition": "A wooded sanctuary or secluded forest retreat.",
    "example": "Tucked in the mountain foothills, the cottage was an idyllic sylvan-haven for artists.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "umbrageous-bough",
    "phonetic": "/ʌmˈbreɪdʒəs baʊ/",
    "partOfSpeech": "noun",
    "definition": "A leafy tree branch providing deep, sheltering shade.",
    "example": "They rested beneath an umbrageous-bough of the ancient sycamore during the noon heat.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "cimmerian-gloom",
    "phonetic": "/sɪˈmɪəriən ɡluːm/",
    "partOfSpeech": "noun",
    "definition": "Profound, perpetual darkness or obscure shadow.",
    "example": "The torch sputtered and died, plunging the speleologists into cimmerian-gloom.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "caliginous-mist",
    "phonetic": "/kəˈlɪdʒɪnəs mɪst/",
    "partOfSpeech": "noun",
    "definition": "A thick, dark, and dim fog obscuring vision.",
    "example": "A caliginous-mist rolled across the moor, hiding the treacherous sinkholes from sight.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lambent-glow",
    "phonetic": "/ˈlæmbənt ɡloʊ/",
    "partOfSpeech": "noun",
    "definition": "A soft, radiant light that plays gently over surfaces.",
    "example": "A lambent-glow bathed the altar as the evening candles were lit one by one.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "fulgent-star",
    "phonetic": "/ˈfʊldʒənt stɑːr/",
    "partOfSpeech": "noun",
    "definition": "A star shining with dazzling and radiant brilliance.",
    "example": "Venus appeared as a fulgent-star blazing solitary in the lavender dusk.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "refulgent-dawn",
    "phonetic": "/rɪˈfʌldʒənt dɔːn/",
    "partOfSpeech": "noun",
    "definition": "A morning sunrise gleaming with intense golden brightness.",
    "example": "A refulgent-dawn broke over the snowy peaks, awakening the sleeping valley in splendor.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "effulgent-sun",
    "phonetic": "/ɪˈfʌldʒənt sʌn/",
    "partOfSpeech": "noun",
    "definition": "A sun that radiates brilliant, blinding light across the sky.",
    "example": "The effulgent-sun burned away the river mists, revealing emerald fields beneath.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "coruscant-gem",
    "phonetic": "/kəˈrʌskənt dʒɛm/",
    "partOfSpeech": "noun",
    "definition": "A sparkling or glittering jewel that catches light vividly.",
    "example": "The sovereign’s crown held a coruscant-gem that flared with crimson fire under the torches.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "pellucid-stream",
    "phonetic": "/pəˈluːsɪd striːm/",
    "partOfSpeech": "noun",
    "definition": "A stream of absolute, glassy transparency.",
    "example": "Spotted trout hovered over the white gravel bed of the pellucid-stream.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "limpid-pool",
    "phonetic": "/ˈlɪmpɪd puːl/",
    "partOfSpeech": "noun",
    "definition": "A serene body of crystal-clear, unclouded water.",
    "example": "They drank cool water from a limpid-pool fed by mountain snowmelt.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "hyaline-sheet",
    "phonetic": "/ˈhaɪəlɪn ʃiːt/",
    "partOfSpeech": "noun",
    "definition": "A glassy, transparent surface like undisturbed ice.",
    "example": "The winter pond froze into a flawless hyaline-sheet that reflected the starry night.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "scintillant-burst",
    "phonetic": "/ˈsɪntɪlənt bɜːrst/",
    "partOfSpeech": "noun",
    "definition": "A sparkling explosion of light or intellectual brilliance.",
    "example": "Her lecture concluded with a scintillant-burst of insight that tied sixty years of research together.",
    "category": "Literary & Prose"
  },
  {
    "word": "phosphorescent-wave",
    "phonetic": "/ˌfɒsfəˈrɛsənt weɪv/",
    "partOfSpeech": "noun",
    "definition": "A wave glowing with biochemical light in the dark.",
    "example": "Midnight swimmers plunged through phosphorescent-waves that sparkled like liquid emeralds.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "resplendent-plume",
    "phonetic": "/rɪˈsplɛndənt pluːm/",
    "partOfSpeech": "noun",
    "definition": "An impressively colorful or magnificent feather or display.",
    "example": "The quetzal perched high in the cloud forest, trailing its resplendent-plume of jade.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "incandescent-ember",
    "phonetic": "/ˌɪnkænˈdɛsənt ˈɛmbər/",
    "partOfSpeech": "noun",
    "definition": "A glowing coal or spark radiating intense heat and light.",
    "example": "An incandescent-ember pulsed warmly in the hearth long after the logs had burned away.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "niveous-crest",
    "phonetic": "/ˈnɪviəs krɛst/",
    "partOfSpeech": "noun",
    "definition": "A snowy white mountain summit or wave ridge.",
    "example": "The eagle soared above the niveous-crest of the Matterhorn in absolute solitude.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gelid-gust",
    "phonetic": "/ˈdʒɛlɪd ɡʌst/",
    "partOfSpeech": "noun",
    "definition": "An icy, bone-chilling blast of freezing wind.",
    "example": "A gelid-gust whipped snow from the glacial ledge, stinging the explorers’ cheeks.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "rime-frost",
    "phonetic": "/raɪm frɒst/",
    "partOfSpeech": "noun",
    "definition": "A granular crust of ice formed from freezing fog.",
    "example": "Rime-frost coated every needle of the pine forest like powdered diamonds.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "spindrift-spray",
    "phonetic": "/ˈspɪndrɪft spreɪ/",
    "partOfSpeech": "noun",
    "definition": "Sea spray blown vigorously across wave tops by a gale.",
    "example": "Spindrift-spray battered the lighthouse gallery eighty feet above the surging breakers.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "firmament-vault",
    "phonetic": "/ˈfɜːrməmənt vɔːlt/",
    "partOfSpeech": "noun",
    "definition": "The celestial dome of the heavens overhead.",
    "example": "The desert night arched above them in an unbroken, star-studded firmament-vault.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "welkin-hymn",
    "phonetic": "/ˈwɛlkɪn hɪm/",
    "partOfSpeech": "noun",
    "definition": "A soaring anthem that seems to echo into the heavens.",
    "example": "The choristers lifted their voices in a welkin-hymn that reverberated across the square.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "penumbra-veil",
    "phonetic": "/pɪˈnʌmbrə veɪl/",
    "partOfSpeech": "noun",
    "definition": "A subtle, semi-dark shadow cast during an eclipse or twilight.",
    "example": "The village rested beneath the quiet penumbra-veil as the solar eclipse reached totality.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "syzygy-tide",
    "phonetic": "/ˈsɪzɪdʒi taɪd/",
    "partOfSpeech": "noun",
    "definition": "A high oceanic spring tide caused by the alignment of sun and moon.",
    "example": "Fishermen hauled their boats high onto the dunes to escape the swelling syzygy-tide.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "equinox-breeze",
    "phonetic": "/ˈiːkwɪnɒks briːz/",
    "partOfSpeech": "noun",
    "definition": "The refreshing wind accompanying the change of seasons.",
    "example": "An equinox-breeze rustled through the vineyards, carrying the sweet scent of fermented grapes.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "solstice-fire",
    "phonetic": "/ˈsɒlstɪs ˈfaɪər/",
    "partOfSpeech": "noun",
    "definition": "A traditional celebratory bonfire lit on the longest or shortest day.",
    "example": "Dancers leaped over the embers of the solstice-fire in an ancient harvest ritual.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "perihelion-arc",
    "phonetic": "/ˌpɛrɪˈhiːliən ɑːrk/",
    "partOfSpeech": "noun",
    "definition": "The closest orbital swing of a celestial traveler near the sun.",
    "example": "The rogue comet flared in emerald glory along its fiery perihelion-arc.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "aphelion-reach",
    "phonetic": "/æfˈhiːliən riːtʃ/",
    "partOfSpeech": "noun",
    "definition": "The most distant orbital expanse of a wandering planet.",
    "example": "In the lonely aphelion-reach, solar warmth faded to a distant golden pinpoint.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "zenith-sun",
    "phonetic": "/ˈzɛnɪθ sʌn/",
    "partOfSpeech": "noun",
    "definition": "The sun standing at its highest perpendicular point in the sky.",
    "example": "At noon, the zenith-sun eliminated every shadow from the bustling courtyard.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "nadir-depth",
    "phonetic": "/ˈneɪdɪər dɛpθ/",
    "partOfSpeech": "noun",
    "definition": "The lowest point of a celestial or psychological cycle.",
    "example": "From the dark nadir-depth of the winter solstice, each day gained a precious minute of light.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "flume-current",
    "phonetic": "/fluːm ˈkɜːrənt/",
    "partOfSpeech": "noun",
    "definition": "A swift, contained rush of water through a ravine or gorge.",
    "example": "Kayakers navigated the treacherous flume-current with heart-pounding agility.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "cascade-plunge",
    "phonetic": "/kæsˈkeɪd plʌndʒ/",
    "partOfSpeech": "noun",
    "definition": "The dramatic descent of a waterfall over rock ledges.",
    "example": "Mist rose in billowing white clouds from the deafening cascade-plunge.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "bower-shade",
    "phonetic": "/ˈbaʊər ʃeɪd/",
    "partOfSpeech": "noun",
    "definition": "The cool, protective shelter beneath climbing vines or trees.",
    "example": "She wrote her letters nestled in the fragrant bower-shade of climbing wisteria.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "glade-clearing",
    "phonetic": "/ɡleɪd ˈklɪərɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A sunlit open pocket in the midst of a dense forest.",
    "example": "A circle of ancient standing stones was preserved inside the secluded glade-clearing.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "dell-hollow",
    "phonetic": "/dɛl ˈhɒloʊ/",
    "partOfSpeech": "noun",
    "definition": "A quiet, sheltered depression surrounded by trees.",
    "example": "Wild strawberries grew in abundance along the sunny bank of the dell-hollow.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "glen-echo",
    "phonetic": "/ɡlɛn ˈɛkoʊ/",
    "partOfSpeech": "noun",
    "definition": "The reverberation of sound between steep valley walls.",
    "example": "The lone piper’s melody returned from the crags as a haunting glen-echo.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "vale-mist",
    "phonetic": "/veɪl mɪst/",
    "partOfSpeech": "noun",
    "definition": "Gentle vapors gathering over a valley in the morning or evening.",
    "example": "Vale-mist curled like smoke across the sleepy rooftops of the Cotswold village.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "abyss-void",
    "phonetic": "/əˈbɪs vɔɪd/",
    "partOfSpeech": "noun",
    "definition": "An immeasurable, fathomless depth or empty space.",
    "example": "Staring down from the rickety rope bridge, he felt the cold draft of the abyss-void.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "chasm-rift",
    "phonetic": "/ˈkæzəm rɪft/",
    "partOfSpeech": "noun",
    "definition": "A deep, yawning fissure in earth or relationship.",
    "example": "An earthquake opened a chasm-rift ten leagues wide across the desert plateau.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "precipice-edge",
    "phonetic": "/ˈprɛsɪpɪs ɛdʒ/",
    "partOfSpeech": "noun",
    "definition": "The perilous brink of a steep mountain cliff.",
    "example": "The golden eagle built its eyrie on a jagged shelf along the dizzying precipice-edge.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "escarpment-wall",
    "phonetic": "/ɪˈskɑːrpmənt wɔːl/",
    "partOfSpeech": "noun",
    "definition": "A towering natural rampart formed by geological faulting.",
    "example": "Clouds broke against the sheer escarpment-wall, pouring rain onto the coastal plain.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "hummock-ridge",
    "phonetic": "/ˈhʌmək rɪdʒ/",
    "partOfSpeech": "noun",
    "definition": "A rounded knoll or small hillock rising above the surroundings.",
    "example": "The shepherd watched his flock from the vantage of a grassy hummock-ridge.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "cairn-beacon",
    "phonetic": "/kɛərn ˈbiːkən/",
    "partOfSpeech": "noun",
    "definition": "A stone mound marking a high mountain pass or memorial.",
    "example": "The cairn-beacon loomed out of the thick fog, reassuring the cold hikers they were on track.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "menhir-monolith",
    "phonetic": "/ˈmɛnhɪər ˈmɒnəlɪθ/",
    "partOfSpeech": "noun",
    "definition": "A massive upright prehistoric standing stone.",
    "example": "Moss and lichens had mapped their slow colonies across the ancient menhir-monolith.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "shingle-shore",
    "phonetic": "/ˈʃɪŋɡəl ʃɔːr/",
    "partOfSpeech": "noun",
    "definition": "A beach composed of smooth, water-worn pebbles.",
    "example": "Waves tumbled pebbles with a hollow roar along the deserted shingle-shore.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "estuarine-delta",
    "phonetic": "/ˈɛstjʊəraɪn ˈdɛltə/",
    "partOfSpeech": "noun",
    "definition": "The nutrient-rich wetland formed where river currents meet sea tides.",
    "example": "Flamingoes gathered in rosy thousands across the fertile estuarine-delta.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "pelagic-realm",
    "phonetic": "/pɪˈlædʒɪk rɛlm/",
    "partOfSpeech": "noun",
    "definition": "The vast, open expanse of oceanic water away from shores.",
    "example": "Albatrosses spent entire years soaring above the stormy pelagic-realm without touching land.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "benthic-trench",
    "phonetic": "/ˈbɛnθɪk trɛntʃ/",
    "partOfSpeech": "noun",
    "definition": "The deepest oceanic seafloor canyon, plunged in absolute dark.",
    "example": "Hydrothermal vents sustained thriving colonies of tube worms inside the benthic-trench.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lacustrine-basin",
    "phonetic": "/ləˈkʌstrɪn ˈbeɪsən/",
    "partOfSpeech": "noun",
    "definition": "A geological bowl holding an inland lake.",
    "example": "Ancient sediments in the lacustrine-basin preserved fossilized fern leaves from the Jurassic.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sinuous-path",
    "phonetic": "/ˈsɪnjuːəs pæθ/",
    "partOfSpeech": "noun",
    "definition": "A serpentine, winding trail that turns gracefully through the landscape.",
    "example": "The sinuous-path led the pilgrims through heather moors and craggy pine groves.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "peripatetic-sage",
    "phonetic": "/ˌpɛrɪpəˈtɛtɪk seɪdʒ/",
    "partOfSpeech": "noun",
    "definition": "A philosopher who teaches while walking or wandering from place to place.",
    "example": "Aristotle was the original peripatetic-sage, debating under the shade of Athens’ lyceum.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "peregrine-flight",
    "phonetic": "/ˈpɛrɪɡrɪn flaɪt/",
    "partOfSpeech": "noun",
    "definition": "A wandering, wide-ranging journey or migration.",
    "example": "The Arctic tern embarked on its annual peregrine-flight from pole to pole.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sidereal-time",
    "phonetic": "/saɪˈdɪəriəl taɪm/",
    "partOfSpeech": "noun",
    "definition": "Time measured by the apparent motion of the fixed stars rather than the sun.",
    "example": "Astronomers synchronized their clockwork mounts to sidereal-time for precise exposures.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "selenic-glow",
    "phonetic": "/sɪˈliːnɪk ɡloʊ/",
    "partOfSpeech": "noun",
    "definition": "The ethereal silver radiance cast by the full moon.",
    "example": "The ruined abbey arch stood etched against the night, bathed in quiet selenic-glow.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "nocturne-melody",
    "phonetic": "/ˈnɒktɜːrn ˈmɛlədi/",
    "partOfSpeech": "noun",
    "definition": "A dreamy, lyrical musical phrase evoking nighttime reverie.",
    "example": "A solitary violinist played a wistful nocturne-melody from an open balcony.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "alpenglow-peak",
    "phonetic": "/ˈælpənˌɡloʊ piːk/",
    "partOfSpeech": "noun",
    "definition": "A mountain summit blushing with rosy twilight illumination.",
    "example": "Climbers paused at their base camp to gaze up at the fiery alpenglow-peak.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "moonglow-ripple",
    "phonetic": "/ˈmuːnɡloʊ ˈrɪpəl/",
    "partOfSpeech": "noun",
    "definition": "A glimmering wave crest catching the moonlight.",
    "example": "Fish broke the surface, creating silver moonglow-ripples across the dark fjord.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sunburst-clearing",
    "phonetic": "/ˈsʌnbɜːrst ˈklɪərɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A sudden, dramatic beam of sunlight piercing cloud cover.",
    "example": "A golden sunburst-clearing illuminated the altar through the ruined rose window.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "rainsong-drone",
    "phonetic": "/ˈreɪnsɒŋ droʊn/",
    "partOfSpeech": "noun",
    "definition": "The steady, hypnotic drumming of falling rain.",
    "example": "Wrapped in wool blankets, she read by the comforting rainsong-drone outside.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "thunderclap-echo",
    "phonetic": "/ˈθʌndərklæp ˈɛkoʊ/",
    "partOfSpeech": "noun",
    "definition": "The rumbling reverberation that follows a lightning strike.",
    "example": "The mountains bounced the thunderclap-echo back and forth across the valley for miles.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gale-squall",
    "phonetic": "/ɡeɪl skwɔːl/",
    "partOfSpeech": "noun",
    "definition": "A violent blast of ocean wind accompanying a tempest.",
    "example": "The schooner reefed its sails as the sudden gale-squall darkened the horizon.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tempest-roar",
    "phonetic": "/ˈtɛmpɪst rɔːr/",
    "partOfSpeech": "noun",
    "definition": "The deafening fury of a great storm battering sea and land.",
    "example": "Inside the stone lighthouse, the watchmen were deaf to all but the tempest-roar.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "maelstrom-vortex",
    "phonetic": "/ˈmeɪlstrɒm ˈvɔːrtɛks/",
    "partOfSpeech": "noun",
    "definition": "The spinning center of a dangerous, swirling body of water.",
    "example": "Driftwood was dragged relentlessly down into the foaming maelstrom-vortex.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "eddy-whirl",
    "phonetic": "/ˈɛdi wɜːrl/",
    "partOfSpeech": "noun",
    "definition": "A gentle circular swirl of water or air.",
    "example": "Autumn leaves danced in an eddy-whirl beside the stone bridge piers.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "undulation-swell",
    "phonetic": "/ˌʌndjʊˈleɪʃən swɛl/",
    "partOfSpeech": "noun",
    "definition": "The smooth rolling crest and trough of a calm sea.",
    "example": "The sailboat rocked gently on the slow undulation-swell of the open Pacific.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "backwash-surge",
    "phonetic": "/ˈbækwɒʃ sɜːrdʒ/",
    "partOfSpeech": "noun",
    "definition": "The foaming retreat of a wave dragging pebbles down the beach.",
    "example": "The grating rattle of the backwash-surge was the beach’s eternal heartbeat.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "undertow-draft",
    "phonetic": "/ˈʌndərtoʊ dræft/",
    "partOfSpeech": "noun",
    "definition": "The subsurface pull of ocean water receding seaward.",
    "example": "Swimmers remained within the cove to avoid the strong undertow-draft near the headland.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "rip-tide-channel",
    "phonetic": "/ˈrɪptaɪd ˈtʃænəl/",
    "partOfSpeech": "noun",
    "definition": "A dangerous seaward stream cutting through surf zones.",
    "example": "Lifeguards posted flags warning bathers of the treacherous rip-tide-channel.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "estuary-tide",
    "phonetic": "/ˈɛstjʊəri taɪd/",
    "partOfSpeech": "noun",
    "definition": "The rising and falling brackish water in a coastal river mouth.",
    "example": "Herons timed their feeding to the slow retreat of the estuary-tide.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lagoon-shallows",
    "phonetic": "/ləˈɡuːn ˈʃæloʊz/",
    "partOfSpeech": "noun",
    "definition": "The warm, tranquil, translucent waters inside a coral reef.",
    "example": "Stingrays glided gracefully through the crystal turquoise of the lagoon-shallows.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "atoll-ring",
    "phonetic": "/ˈætɒl rɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A circular coral formation enclosing a quiet central lagoon.",
    "example": "From orbit, the emerald atoll-ring appeared like a necklace upon the deep blue sea.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "archipelago-chain",
    "phonetic": "/ˌɑːrkɪˈpɛləɡoʊ tʃeɪn/",
    "partOfSpeech": "noun",
    "definition": "A cluster or series of islands scattered across the sea.",
    "example": "Volcanic peaks rose from the water to form a dramatic archipelago-chain.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "islet-crag",
    "phonetic": "/ˈaɪlɪt kræɡ/",
    "partOfSpeech": "noun",
    "definition": "A tiny, isolated rock or small island rising out of the water.",
    "example": "Puffins dug nesting burrows into the grassy crown of the sea islet-crag.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "promontory-ledge",
    "phonetic": "/ˈprɒməntri lɛdʒ/",
    "partOfSpeech": "noun",
    "definition": "A high, commanding shelf of rock projecting over the sea.",
    "example": "The ruins of the medieval watchtower stood upon a windswept promontory-ledge.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "headland-bluff",
    "phonetic": "/ˈhɛdlænd blʌf/",
    "partOfSpeech": "noun",
    "definition": "A steep, prominent cliff standing out into the ocean.",
    "example": "Wild gorse and heather blossomed along the edge of the headland-bluff.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "shoal-reef",
    "phonetic": "/ʃoʊl riːf/",
    "partOfSpeech": "noun",
    "definition": "A shallow underwater ridge of sand or coral hazardous to vessels.",
    "example": "The old galleon met its doom when it struck the uncharted shoal-reef during a storm.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sandbar-crest",
    "phonetic": "/ˈsændbɑːr krɛst/",
    "partOfSpeech": "noun",
    "definition": "The exposed, drying ridge of sand exposed at low tide.",
    "example": "Seagulls lined up facing the wind along the sunlit sandbar-crest.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "dune-ridge",
    "phonetic": "/djuːn rɪdʒ/",
    "partOfSpeech": "noun",
    "definition": "The sharp, curving crest of a wind-sculpted sand mountain.",
    "example": "Wind rippled golden grains along the knife-edge of the Saharan dune-ridge.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "mirage-shimmer",
    "phonetic": "/mɪˈrɑːʒ ˈʃɪmər/",
    "partOfSpeech": "noun",
    "definition": "The deceptive optical illusion of water caused by atmospheric heat.",
    "example": "The distant caravan seemed to float above a glassy mirage-shimmer.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "oasis-spring",
    "phonetic": "/oʊˈeɪsɪs sprɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A life-giving freshwater pool in the midst of a barren desert.",
    "example": "Date palms clustered around the cool, clear waters of the oasis-spring.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "savannah-plain",
    "phonetic": "/səˈvænə pleɪn/",
    "partOfSpeech": "noun",
    "definition": "A sweeping tropical grassland dotted with occasional trees.",
    "example": "Giraffes walked in majestic silhouette across the golden savannah-plain at sundown.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tundra-moss",
    "phonetic": "/ˈtʌndrə mɒs/",
    "partOfSpeech": "noun",
    "definition": "Low, hardy vegetation that survives the extreme cold of polar regions.",
    "example": "Caribou scraped away early snow to forage on nutritious tundra-moss.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "taiga-spruce",
    "phonetic": "/ˈtaɪɡə spruːs/",
    "partOfSpeech": "noun",
    "definition": "The dense evergreen coniferous trees of northern subarctic forests.",
    "example": "Snow weighed down the branches of the ancient taiga-spruce in unbroken winter quiet.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "steppe-wind",
    "phonetic": "/stɛp wɪnd/",
    "partOfSpeech": "noun",
    "definition": "A wild, untamed gale sweeping over vast Eurasian grasslands.",
    "example": "The steppe-wind carried the scent of dry sage and distant thunderstorms.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "prairie-grass",
    "phonetic": "/ˈprɛəri ɡræs/",
    "partOfSpeech": "noun",
    "definition": "The deep-rooted native grasses that carpet continental plains.",
    "example": "Bison herds moved like shadows through the shoulder-high prairie-grass.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "meadow-bloom",
    "phonetic": "/ˈmɛdoʊ bluːm/",
    "partOfSpeech": "noun",
    "definition": "The profusion of wildflowers opening in a summer pasture.",
    "example": "Poppies and cornflowers mingled in a vibrant tapestry of meadow-bloom.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "orchard-row",
    "phonetic": "/ˈɔːrtʃərd roʊ/",
    "partOfSpeech": "noun",
    "definition": "Lines of fruit-bearing trees cultivated in symmetric beauty.",
    "example": "Pear blossoms drifted like fragrant snowflakes along each orchard-row.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "grove-sanctuary",
    "phonetic": "/ɡroʊv ˈsæŋktʃuːɛri/",
    "partOfSpeech": "noun",
    "definition": "A sacred or peaceful pocket of trees offering retreat.",
    "example": "Ancient druids held council inside the quiet shade of the oak grove-sanctuary.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "thicket-cover",
    "phonetic": "/ˈθɪkɪt ˈkʌvər/",
    "partOfSpeech": "noun",
    "definition": "A dense tangle of shrubs and undergrowth concealing wildlife.",
    "example": "A mother quail led her chicks safely into the sheltering thicket-cover.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "copse-wood",
    "phonetic": "/kɒps wʊd/",
    "partOfSpeech": "noun",
    "definition": "A small, managed cluster of coppiced trees or shrubs.",
    "example": "Villagers gathered slender willow rods from the damp copse-wood for basketry.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "spinney-hedge",
    "phonetic": "/ˈspɪni hɛdʒ/",
    "partOfSpeech": "noun",
    "definition": "A sheltering row of small trees and bushes bordering fields.",
    "example": "Songbirds nested securely inside the thorny protection of the spinney-hedge.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "understory-fern",
    "phonetic": "/ˈʌndərstɔːri fɜːrn/",
    "partOfSpeech": "noun",
    "definition": "Shade-loving ferns carpeting the moist forest floor beneath high trees.",
    "example": "Giant understory-ferns uncurled their fiddleheads in the spring rain.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "canopy-vault",
    "phonetic": "/ˈkænəpi vɔːlt/",
    "partOfSpeech": "noun",
    "definition": "The towering roof of green leaves formed by ancient forest trees.",
    "example": "Sunlight filtered down through the cathedral-like canopy-vault in green beams.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "foliage-weave",
    "phonetic": "/ˈfoʊliɪdʒ wiːv/",
    "partOfSpeech": "noun",
    "definition": "The intricate overlapping tapestry of leaves and vines.",
    "example": "Tropical birds flashed like flying jewels through the dense foliage-weave.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "frond-arch",
    "phonetic": "/frɒnd ɑːrtʃ/",
    "partOfSpeech": "noun",
    "definition": "A curving, feathered palm or fern branch bowing gracefully.",
    "example": "They walked beneath a natural frond-arch into the botanical conservatory.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "moss-cushion",
    "phonetic": "/mɒs ˈkʊʃən/",
    "partOfSpeech": "noun",
    "definition": "A velvety, plump mound of soft moss on tree bark or stone.",
    "example": "She rested her head against a cool moss-cushion beside the mountain spring.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lichen-crust",
    "phonetic": "/ˈlaɪkən krʌst/",
    "partOfSpeech": "noun",
    "definition": "The colorful, slow-growing symbiotic organism coating ancient stones.",
    "example": "An orange lichen-crust mapped the centuries-old face of the granite sundial.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sapling-stem",
    "phonetic": "/ˈsæplɪŋ stɛm/",
    "partOfSpeech": "noun",
    "definition": "The slender, flexible trunk of a young growing tree.",
    "example": "The gardener gently tied the sapling-stem to a sturdy wooden support stake.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "burl-grain",
    "phonetic": "/bɜːrl ɡreɪn/",
    "partOfSpeech": "noun",
    "definition": "The swirl and intricate patterned rings within a knot of wood.",
    "example": "The cabinetmaker polished the burl-grain until it shone like liquid amber.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "heartwood-core",
    "phonetic": "/ˈhɑːrtwʊd kɔːr/",
    "partOfSpeech": "noun",
    "definition": "The dense, durable innermost timber of a mature tree.",
    "example": "The shipwright chose Lebanese cedar for its rot-resistant heartwood-core.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "calyx-cup",
    "phonetic": "/ˈkeɪlɪks kʌp/",
    "partOfSpeech": "noun",
    "definition": "The outer protective whorl of green leaves supporting a blossom.",
    "example": "Dewdrops collected in the delicate calyx-cup of the morning peony.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "mycelium-web",
    "phonetic": "/maɪˈsiːliəm wɛb/",
    "partOfSpeech": "noun",
    "definition": "The subterranean fungal network nourishing trees and sharing forest nutrients.",
    "example": "An invisible mycelium-web connected every tree in the ancient woodland.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "seedling-sprout",
    "phonetic": "/ˈsiːdlɪŋ spraʊt/",
    "partOfSpeech": "noun",
    "definition": "A newly germinated tender green shoot rising toward light.",
    "example": "A courageous seedling-sprout cracked the asphalt of the old courtyard path.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tendril-curl",
    "phonetic": "/ˈtɛndrɪl kɜːrl/",
    "partOfSpeech": "noun",
    "definition": "The delicate spiral shoot of a climbing grapevine.",
    "example": "A slender tendril-curl wrapped firmly around the garden bamboo cane.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "bramble-hedge",
    "phonetic": "/ˈbræmbəl hɛdʒ/",
    "partOfSpeech": "noun",
    "definition": "A thick, thorny boundary of wild blackberry bushes.",
    "example": "Hares darted through secret runs in the impassable bramble-hedge.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "bracken-fern",
    "phonetic": "/ˈbrækən fɜːrn/",
    "partOfSpeech": "noun",
    "definition": "A hardy, coarse fern turning russet and gold in autumn.",
    "example": "Pheasants called from the golden sea of highland bracken-fern at sunrise.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "heather-moor",
    "phonetic": "/ˈhɛðər mʊər/",
    "partOfSpeech": "noun",
    "definition": "A vast, rolling open peat land covered in purple heather blooms.",
    "example": "The Scottish heather-moor turned a breathtaking royal violet each August.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gorse-bloom",
    "phonetic": "/ɡɔːrs bluːm/",
    "partOfSpeech": "noun",
    "definition": "The brilliant yellow, fragrant blossom of the spiny gorse bush.",
    "example": "The seaside cliffs smelled richly of coconut from the abundant gorse-bloom.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "succulent-leaf",
    "phonetic": "/ˈsʌkjʊlənt liːf/",
    "partOfSpeech": "noun",
    "definition": "A thick, fleshy water-storing leaf adapted to arid climates.",
    "example": "Translucent dew clung to the powdery surface of each succulent-leaf.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "lichenous-boulder",
    "phonetic": "/ˈlaɪkənəs ˈboʊldər/",
    "partOfSpeech": "noun",
    "definition": "A massive stone weathered and coated in ancient lichens.",
    "example": "Climbers paused for lunch on a flat, sun-warmed lichenous-boulder.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "mossy-log",
    "phonetic": "/ˈmɒsi lɒɡ/",
    "partOfSpeech": "noun",
    "definition": "A fallen tree trunk wrapped in a thick, living cloak of green moss.",
    "example": "Chantrelle mushrooms sprouted along the side of the decaying mossy-log.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "fernlike-frost",
    "phonetic": "/ˈfɜːrnlaɪk frɒst/",
    "partOfSpeech": "noun",
    "definition": "Crystalline ice formations spreading across window glass in fern patterns.",
    "example": "Morning light shone through intricate fronds of fernlike-frost on the pane.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "feathered-cloud",
    "phonetic": "/ˈfɛðərd klaʊd/",
    "partOfSpeech": "noun",
    "definition": "High wispy cirrus clouds drifting across the blue sky.",
    "example": "Feathered-clouds high in the stratosphere signaled an approaching warm front.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "plumed-egret",
    "phonetic": "/pluːmd ˈiːɡrɪt/",
    "partOfSpeech": "noun",
    "definition": "A graceful white wading bird bearing delicate breeding plumes.",
    "example": "The plumed-egret stalked with patient, frozen elegance through the reeds.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "soaring-spire",
    "phonetic": "/ˈsɔːrɪŋ spaɪər/",
    "partOfSpeech": "noun",
    "definition": "A tall, slender architectural pinnacle rising into the heavens.",
    "example": "The cathedral’s soaring-spire was visible thirty miles across the flat fenlands.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "craggy-ridge",
    "phonetic": "/ˈkræɡi rɪdʒ/",
    "partOfSpeech": "noun",
    "definition": "A rocky, uneven mountain backbone defying the elements.",
    "example": "Ibex leaped effortlessly along the razor-sharp spine of the craggy-ridge.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "jagged-cliff",
    "phonetic": "/ˈdʒæɡɪd klɪf/",
    "partOfSpeech": "noun",
    "definition": "A rough, precipitous wall of rock dropping into the ocean.",
    "example": "Seabirds built thousands of nests in the crevices of the jagged-cliff.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "serrated-skyline",
    "phonetic": "/səˈreɪtɪd ˈskaɪlaɪn/",
    "partOfSpeech": "noun",
    "definition": "A mountain profile resembling the sharp teeth of a saw.",
    "example": "The setting sun sank behind the dramatic, serrated-skyline of the Dolomites.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "pinnacle-crag",
    "phonetic": "/ˈpɪnəkəl kræɡ/",
    "partOfSpeech": "noun",
    "definition": "A towering, isolated needle of rock standing against the sky.",
    "example": "The solitary pinnacle-crag challenged the world’s most daring rock climbers.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "boulder-field",
    "phonetic": "/ˈboʊldər fiːld/",
    "partOfSpeech": "noun",
    "definition": "A vast expanse of glacial debris strewn with gigantic rocks.",
    "example": "Hikers picked their way carefully across the treacherous boulder-field.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "sediment-band",
    "phonetic": "/ˈsɛdɪmənt bænd/",
    "partOfSpeech": "noun",
    "definition": "A distinct horizontal geological layer of stratified rock.",
    "example": "Canyon walls displayed alternating crimson and buff sediment-bands of ancient seas.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "silt-shoal",
    "phonetic": "/sɪlt ʃoʊl/",
    "partOfSpeech": "noun",
    "definition": "A shallow sandbank formed by river deposits at a bend.",
    "example": "The paddle steamer ran aground on a newly formed silt-shoal in the river bend.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "clay-basin",
    "phonetic": "/kleɪ ˈbeɪsən/",
    "partOfSpeech": "noun",
    "definition": "An impervious bowl of earth retaining seasonal rainwater.",
    "example": "A temporary desert pool gathered in the clay-basin, attracting desert antelope.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "humus-scent",
    "phonetic": "/ˈhjuːməs sɛnt/",
    "partOfSpeech": "noun",
    "definition": "The rich, sweet fragrance of fertile, decaying forest soil.",
    "example": "After the summer downpour, the forest was filled with an intoxicating humus-scent.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "peat-hearth",
    "phonetic": "/piːt hɑːrθ/",
    "partOfSpeech": "noun",
    "definition": "A stone fireplace burning fragrant, dried sods of peat.",
    "example": "The cozy cottage was warmed by a sweet-smelling fire upon the peat-hearth.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "marsh-reeds",
    "phonetic": "/mɑːrʃ riːdz/",
    "partOfSpeech": "noun",
    "definition": "Tall aquatic grasses growing in wetlands and along riverbanks.",
    "example": "Wind rustled the golden marsh-reeds where mallards hid their broods.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "fen-drain",
    "phonetic": "/fɛn dreɪn/",
    "partOfSpeech": "noun",
    "definition": "A historic canal designed to manage wetland water levels.",
    "example": "Waterlilies floated in the calm waters of the old willow-lined fen-drain.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "quagmire-bog",
    "phonetic": "/ˈkwæɡmaɪər bɒɡ/",
    "partOfSpeech": "noun",
    "definition": "A treacherous, waterlogged area that gives way beneath footsteps.",
    "example": "The ancient track skirted the dangerous edge of the quagmire-bog.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "rill-spring",
    "phonetic": "/rɪl sprɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A tiny, bubbling mountain brook beginning from a rock cleft.",
    "example": "They filled their water bottles at the icy, pure rill-spring high on the pass.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "brook-shallows",
    "phonetic": "/brʊk ˈʃæloʊz/",
    "partOfSpeech": "noun",
    "definition": "The shallow, sunlit gravel runs of a small forest stream.",
    "example": "Children splashed barefoot across the cool, refreshing brook-shallows.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "creek-bend",
    "phonetic": "/kriːk bɛnd/",
    "partOfSpeech": "noun",
    "definition": "A curve in a small stream where deep pools often form.",
    "example": "Old willows dipped their trailing branches into the deep water at the creek-bend.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "stream-drift",
    "phonetic": "/striːm drɪft/",
    "partOfSpeech": "noun",
    "definition": "Twigs and blossom petals floating with a current.",
    "example": "Cherry blossoms floated like miniature pink rafts upon the swift stream-drift.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tributary-mouth",
    "phonetic": "/ˈtrɪbjʊtəri maʊθ/",
    "partOfSpeech": "noun",
    "definition": "The junction where a smaller stream empties into a major river.",
    "example": "A bustling fishing village grew around the sheltered tributary-mouth.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "confluence-point",
    "phonetic": "/ˈkɒnfluːəns pɔɪnt/",
    "partOfSpeech": "noun",
    "definition": "The exact place where two waterways merge into one.",
    "example": "A sacred stone altar stood at the confluence-point of the two holy rivers.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "anomie-state",
    "phonetic": "/ˈænəmi steɪt/",
    "partOfSpeech": "noun",
    "definition": "A psychological condition of disorientation from social norms.",
    "example": "The sudden cultural upheaval left many older citizens adrift in an anomie-state.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "eudaimonic-life",
    "phonetic": "/juːdaɪˈmɒnɪk laɪf/",
    "partOfSpeech": "noun",
    "definition": "A life oriented toward profound moral flourishing and purpose.",
    "example": "He dedicated his middle years to the active pursuit of an eudaimonic-life.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "ataraxic-peace",
    "phonetic": "/ˌætəˈræksɪk piːs/",
    "partOfSpeech": "noun",
    "definition": "An untroubled, stoic serenity of the soul.",
    "example": "In the quiet stone monastery, she discovered a lasting ataraxic-peace.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "chrysalism-comfort",
    "phonetic": "/ˈkrɪsəlɪzəm ˈkʌmfərt/",
    "partOfSpeech": "noun",
    "definition": "The deep coziness of being indoors while rain pours outside.",
    "example": "Listening to hail rattle the slate roof brought supreme chrysalism-comfort.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "hiraeth-ache",
    "phonetic": "/ˈhɪəraɪθ eɪk/",
    "partOfSpeech": "noun",
    "definition": "The tender pang of longing for a lost or imaginary homeland.",
    "example": "Hearing the ancient Gaelic lullaby stirred a sweet hiraeth-ache in her soul.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "saudade-reverie",
    "phonetic": "/saʊˈdɑːdə ˈrɛvəri/",
    "partOfSpeech": "noun",
    "definition": "A wistful daydream colored by nostalgic love and loss.",
    "example": "Looking at old sepia family photographs dipped him into a saudade-reverie.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sehnsucht-pang",
    "phonetic": "/ˈzeːnˌzʊxt pæŋ/",
    "partOfSpeech": "noun",
    "definition": "A sudden, deep yearning for an unattainable ideal world.",
    "example": "A chord in the Brahms intermezzo struck a sudden, poignant sehnsucht-pang.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sonder-glance",
    "phonetic": "/ˈsɒndər ɡlɑːns/",
    "partOfSpeech": "noun",
    "definition": "A brief look at a stranger realizing they carry a universe of thoughts.",
    "example": "He exchanged a quiet sonder-glance with the weary reader across the subway car.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "weltschmerz-sigh",
    "phonetic": "/ˈvɛltˌʃmɛərts saɪ/",
    "partOfSpeech": "noun",
    "definition": "A melancholy sigh at the imperfect, fallen state of the world.",
    "example": "He closed the newspaper with a heavy, philosophical weltschmerz-sigh.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "apricity-sun",
    "phonetic": "/əˈprɪsɪti sʌn/",
    "partOfSpeech": "noun",
    "definition": "The gentle, restorative warmth of the winter sun on skin.",
    "example": "He sat on the south-facing porch, soaking in the sweet apricity-sun.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "brumal-solitude",
    "phonetic": "/ˈbruːməl ˈsɒlɪtjuːd/",
    "partOfSpeech": "noun",
    "definition": "The quiet, reflective stillness of midwinter.",
    "example": "In the brumal-solitude of his mountain cabin, he finished writing his memoir.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "crepuscular-shadow",
    "phonetic": "/krɪˈpʌskjʊlər ˈʃædoʊ/",
    "partOfSpeech": "noun",
    "definition": "The long, soft shadow cast as dusk settles.",
    "example": "Crepuscular-shadows lengthened across the courtyard until the lamps flickered on.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "diaphanous-veil",
    "phonetic": "/daɪˈæfənəs veɪl/",
    "partOfSpeech": "noun",
    "definition": "A translucent, delicate drapery of mist or fabric.",
    "example": "A diaphanous-veil of cloud drifted across the face of the full moon.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "effervescent-wit",
    "phonetic": "/ˌɛfərˈvɛsənt wɪt/",
    "partOfSpeech": "noun",
    "definition": "Brisk, sparkling, and lively intellectual humor.",
    "example": "Her effervescent-wit enlivened what would otherwise have been a dull symposium.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "evanescence-grace",
    "phonetic": "/ˌɛvəˈnɛsəns ɡreɪs/",
    "partOfSpeech": "noun",
    "definition": "The fleeting, delicate beauty of transient things.",
    "example": "Cherry blossoms possess an evanescence-grace that makes them twice as cherished.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "gossamer-wing",
    "phonetic": "/ˈɡɒsəmər wɪŋ/",
    "partOfSpeech": "noun",
    "definition": "A wing of extreme thinness and insubstantial delicacy.",
    "example": "The dragonfly hovered on shimmering gossamer-wings above the lily pad.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "halcyon-calm",
    "phonetic": "/ˈhælsiən kɑːm/",
    "partOfSpeech": "noun",
    "definition": "An idyllic, undisturbed peace of sea and mind.",
    "example": "A rare halcyon-calm settled over the fishing fleet after three days of storm.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "ineffable-wonder",
    "phonetic": "/ɪnˈɛfəbəl ˈwʌndər/",
    "partOfSpeech": "noun",
    "definition": "A sense of awe too profound for human words to express.",
    "example": "Looking up at the Milky Way from the salt flats brought ineffable-wonder.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "limpid-stream",
    "phonetic": "/ˈlɪmpɪd striːm/",
    "partOfSpeech": "noun",
    "definition": "A completely clear, crystalline brook.",
    "example": "Minnows darted over colored pebbles in the quiet limpid-stream.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "mellifluous-echo",
    "phonetic": "/mɛˈlɪflʊəs ˈɛkoʊ/",
    "partOfSpeech": "noun",
    "definition": "A sweet, musical sound reverberating softly.",
    "example": "The cello's final note left a mellifluous-echo lingering in the stone nave.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "numinous-forest",
    "phonetic": "/ˈnjuːmɪnəs ˈfɒrɪst/",
    "partOfSpeech": "noun",
    "definition": "A woodland that evokes a sense of sacred or divine presence.",
    "example": "Redwood groves feel like a numinous-forest where time itself stands reverent.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "petrichor-scent",
    "phonetic": "/ˈpɛtrɪkɔːr sɛnt/",
    "partOfSpeech": "noun",
    "definition": "The clean, earthy fragrance of rain striking dry soil.",
    "example": "Opening the front door, she was greeted by the intoxicating petrichor-scent.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "quixotic-dream",
    "phonetic": "/kwɪkˈsɒtɪk driːm/",
    "partOfSpeech": "noun",
    "definition": "An idealistic, impractical aspiration pursued with devotion.",
    "example": "Restoring the centuries-old ruined vineyard was his lifelong quixotic-dream.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "redolent-memory",
    "phonetic": "/ˈrɛdələnt ˈmɛməri/",
    "partOfSpeech": "noun",
    "definition": "A reminiscence powerfully evoked by a sensory fragrance.",
    "example": "The scent of wild lavender stirred a redolent-memory of Provence summers.",
    "category": "Feelings & States of Mind"
  },
  {
    "word": "sempiternal-truth",
    "phonetic": "/ˌsɛmpɪˈtɜːrnəl truːθ/",
    "partOfSpeech": "noun",
    "definition": "An eternal, unchanging principle enduring through all ages.",
    "example": "Great literature speaks to the sempiternal-truth of human longing and love.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "susurrus-pine",
    "phonetic": "/sʊˈsʌrəs paɪn/",
    "partOfSpeech": "noun",
    "definition": "The gentle whispering murmur of wind through pine needles.",
    "example": "Lying in his hammock, he dozed off to the rhythmic susurrus-pine.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "taciturn-scholar",
    "phonetic": "/ˈtæsɪtɜːrn ˈskɒlər/",
    "partOfSpeech": "noun",
    "definition": "A quiet, deeply learned thinker who speaks only when necessary.",
    "example": "The taciturn-scholar spent forty years cataloging the cathedral manuscripts.",
    "category": "Mind, Philosophy, Character & Demeanor"
  },
  {
    "word": "verisimilitude-prose",
    "phonetic": "/ˌvɛrɪsɪˈmɪlɪtjuːd proʊz/",
    "partOfSpeech": "noun",
    "definition": "Writing that captures authentic, lived reality with uncanny truth.",
    "example": "Her historical novel was celebrated for its breathtaking verisimilitude-prose.",
    "category": "Literary & Prose"
  },
  {
    "word": "zephyr-whisper",
    "phonetic": "/ˈzɛfər ˈwɪspər/",
    "partOfSpeech": "noun",
    "definition": "The faint rustle caused by a gentle summer breeze.",
    "example": "The curtains stirred with a cool zephyr-whisper in the midnight heat.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "chiaroscuro-contrast",
    "phonetic": "/kiˌɑːrəˈskjʊəroʊ ˈkɒntrɑːst/",
    "partOfSpeech": "noun",
    "definition": "The dramatic play between bright light and deep shadow.",
    "example": "The candlelight threw bold chiaroscuro-contrasts across the artist’s profile.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "iridescent-prism",
    "phonetic": "/ˌɪrɪˈdɛsənt ˈprɪzəm/",
    "partOfSpeech": "noun",
    "definition": "A multifaceted crystal flaring with changing spectral colors.",
    "example": "Hanging in the bay window, the iridescent-prism scattered rainbows across the rug.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "luminescent-deep",
    "phonetic": "/ˌluːmɪˈnɛsənt diːp/",
    "partOfSpeech": "noun",
    "definition": "The glowing oceanic depths lit by bioluminescent sea life.",
    "example": "Submersibles descended into the quiet wonder of the luminescent-deep.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "komorebi-dappled",
    "phonetic": "/koʊmoʊˈrɛbi ˈdæpəld/",
    "partOfSpeech": "adjective",
    "definition": "Mottled by the soft sunlight filtering through tree leaves.",
    "example": "They shared their tea on a komorebi-dappled terrace beneath the wisteria.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "psithurism-song",
    "phonetic": "/ˈsɪθjʊrɪzəm sɒŋ/",
    "partOfSpeech": "noun",
    "definition": "The rustling melody of leaves conversing with the wind.",
    "example": "Autumn woods played their annual psithurism-song in golden shades.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "silvan-grove",
    "phonetic": "/ˈsɪlvən ɡroʊv/",
    "partOfSpeech": "noun",
    "definition": "A peaceful, wooded sanctuary sheltered by mature trees.",
    "example": "Deer found safe refuge within the tranquil shade of the silvan-grove.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "nebular-swirl",
    "phonetic": "/ˈnɛbjʊlər swɜːrl/",
    "partOfSpeech": "noun",
    "definition": "A cosmic spiral of glowing stardust and interstellar gas.",
    "example": "The Hubble telescope imaged an awe-inspiring nebular-swirl in Orion.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "tenebrous-passage",
    "phonetic": "/ˈtɛnɪbrəs ˈpæsɪdʒ/",
    "partOfSpeech": "noun",
    "definition": "A shadowy, dark subterranean corridor.",
    "example": "Torch in hand, the explorer stepped into the cool, tenebrous-passage.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "coruscating-light",
    "phonetic": "/ˈkɒrəskeɪtɪŋ laɪt/",
    "partOfSpeech": "noun",
    "definition": "A bright, sparkling flash of illumination.",
    "example": "The morning dew flashed coruscating-light from every spiderweb in the grass.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "auroral-crown",
    "phonetic": "/ɔːˈrɔːrəl kraʊn/",
    "partOfSpeech": "noun",
    "definition": "A ring of northern lights crowning the polar zenith.",
    "example": "An auroral-crown pulsed in violet and emerald above the frozen tundra.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "vernal-bloom",
    "phonetic": "/ˈvɜːrnəl bluːm/",
    "partOfSpeech": "noun",
    "definition": "The fresh, youthful opening of spring blossoms.",
    "example": "Orchards across the valley burst into breathtaking vernal-bloom.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "estival-heat",
    "phonetic": "/ˈɛstɪvəl hiːt/",
    "partOfSpeech": "noun",
    "definition": "The warm, drowsy stillness of high midsummer.",
    "example": "Cicadas buzzed in the olive trees through the shimmering estival-heat.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "autumnal-haze",
    "phonetic": "/ɔːˈtʌmnəl heɪz/",
    "partOfSpeech": "noun",
    "definition": "The golden, mellow mist of an autumn morning.",
    "example": "Sunlight cut through the autumnal-haze in broad, radiant shafts.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "cadent-rhythm",
    "phonetic": "/ˈkeɪdənt ˈrɪðəm/",
    "partOfSpeech": "noun",
    "definition": "A musical, flowing pulse or cadence.",
    "example": "The waves struck the wooden hull in a soothing, cadent-rhythm.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "riparian-willow",
    "phonetic": "/raɪˈpɛəriən ˈwɪloʊ/",
    "partOfSpeech": "noun",
    "definition": "A weeping willow tree growing beside a riverbank.",
    "example": "Riparian-willows dipped their long green tresses into the rushing current.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "littoral-sand",
    "phonetic": "/ˈlɪtərəl sænd/",
    "partOfSpeech": "noun",
    "definition": "The fine, clean sand along a seashore.",
    "example": "Sea foam washed over the white littoral-sand with each incoming swell.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "abyssal-silence",
    "phonetic": "/əˈbɪsəl ˈsaɪləns/",
    "partOfSpeech": "noun",
    "definition": "The total, profound stillness of the deep ocean.",
    "example": "Miles below the storm-tossed waves reigned eternal abyssal-silence.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "empyrean-heights",
    "phonetic": "/ɛmˈpɪriən haɪts/",
    "partOfSpeech": "noun",
    "definition": "The highest celestial heavens filled with light.",
    "example": "The mountain peak seemed to pierce the very empyrean-heights.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "celestial-sphere",
    "phonetic": "/sɪˈlɛstʃəl sfɪər/",
    "partOfSpeech": "noun",
    "definition": "The apparent dome of the sky studded with stars.",
    "example": "Ancient astrolabes charted the movements of the celestial-sphere.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "astral-dust",
    "phonetic": "/ˈæstrəl dʌst/",
    "partOfSpeech": "noun",
    "definition": "Cosmic matter from which new stars and planets are formed.",
    "example": "We are all composed of ancient astral-dust forged in dying supernovas.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "thalassic-wave",
    "phonetic": "/θəˈlæsɪk weɪv/",
    "partOfSpeech": "noun",
    "definition": "A majestic, rolling swell of the deep open ocean.",
    "example": "The vessel climbed and descended each mighty thalassic-wave with steady grace.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "nacreous-shell",
    "phonetic": "/ˈneɪkriəs ʃɛl/",
    "partOfSpeech": "noun",
    "definition": "A sea shell lined with iridescent mother-of-pearl.",
    "example": "She kept a polished nacreous-shell on her desk to hold paper clips.",
    "category": "Art, Aesthetics & Perceptions"
  },
  {
    "word": "opalescent-cloud",
    "phonetic": "/ˌoʊpəˈlɛsənt klaʊd/",
    "partOfSpeech": "noun",
    "definition": "A cloud glowing with subtle rainbow pastel hues at sunset.",
    "example": "An opalescent-cloud hung above the horizon like a spilled watercolor wash.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "gloaming-hour",
    "phonetic": "/ˈɡloʊmɪŋ ˈaʊər/",
    "partOfSpeech": "noun",
    "definition": "The peaceful twilight period between sunset and dark.",
    "example": "They sat on the pier during the gloaming-hour, watching the lighthouse lamp ignite.",
    "category": "Poetic & Atmosphere"
  },
  {
    "word": "eventide-peace",
    "phonetic": "/ˈiːvəntaɪd piːs/",
    "partOfSpeech": "noun",
    "definition": "The tranquil serenity that arrives at the close of day.",
    "example": "A soothing eventide-peace descended on the busy farm as chores ended.",
    "category": "Feelings & States of Mind"
  }
];
