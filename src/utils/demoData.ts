import { db } from '../firebase';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import type { Book } from '../types/book';

const DEMO_BOOKS: Omit<Book, 'id'>[] = [
  // Currently Reading
  {
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    genre: 'Mystery & Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    notes: 'Barcelona, 1945. A haunting mystery surrounding the Cemetery of Forgotten Books.',
    status: 'reading',
    favorite: true,
    totalPages: 486,
    currentPage: 284,
    dateAdded: '2026-02-01',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Sci-Fi',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    notes: 'Fear is the mind-killer. Epic sci-fi worldbuilding on Arrakis.',
    status: 'reading',
    favorite: false,
    totalPages: 688,
    currentPage: 312,
    dateAdded: '2026-02-10',
  },
  // On Shelf
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    notes: 'An easy & proven way to build good habits and break bad ones.',
    status: 'on-shelf',
    favorite: true,
    totalPages: 320,
    dateAdded: '2026-01-15',
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'History',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    notes: 'How Homo sapiens conquered Earth through cognitive, agricultural & scientific revolutions.',
    status: 'on-shelf',
    favorite: false,
    totalPages: 443,
    dateAdded: '2026-01-20',
  },
  // Finished / Read
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    genre: 'Psychology',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    notes: 'Masterpiece on human judgment, decision-making, System 1 and System 2 thinking.',
    status: 'read',
    favorite: true,
    rating: 5,
    totalPages: 499,
    currentPage: 499,
    dateAdded: '2026-01-01',
    dateFinished: '2026-02-14',
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    notes: 'Between life and death there is a library with infinite shelves of alternative lives.',
    status: 'read',
    favorite: false,
    rating: 4,
    totalPages: 304,
    currentPage: 304,
    dateAdded: '2026-01-05',
    dateFinished: '2026-03-01',
  },
  // Wishlist / The Hunt List
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Sci-Fi',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    notes: 'A lone astronaut must save Earth from extinction. High recommended by sci-fi readers!',
    status: 'wishlist',
    favorite: false,
    totalPages: 496,
    dateAdded: '2026-02-15',
  },
  {
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    genre: 'Contemporary Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
    notes: 'A story about video game designers, creativity, love, and decades-long friendship.',
    status: 'wishlist',
    favorite: false,
    totalPages: 416,
    dateAdded: '2026-02-18',
  },
];

export async function seedDemoDataIfEmpty(userId: string) {
  try {
    const booksRef = collection(db, 'users', userId, 'books');
    const existingBooksSnap = await getDocs(booksRef);

    // Only seed if zero books exist in demo account
    if (!existingBooksSnap.empty) return;

    const batch = writeBatch(db);

    // 1. Seed Demo Books
    DEMO_BOOKS.forEach((bookData, idx) => {
      const bookDocRef = doc(booksRef, `demo-book-${idx + 1}`);
      batch.set(bookDocRef, {
        id: `demo-book-${idx + 1}`,
        ...bookData,
      });
    });

    // 2. Seed Daily Goal (30 pages per day)
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyGoalRef = doc(db, 'users', userId, 'settings', 'dailyGoal');
    batch.set(dailyGoalRef, {
      dailyGoal: 30,
      dailyGoalDate: todayStr,
      history: {
        [todayStr]: 30,
      },
    });

    // 3. Seed Yearly Goal (12 books target for 2026)
    const currentYear = new Date().getFullYear();
    const yearlyGoalRef = doc(db, 'users', userId, 'settings', 'goal');
    batch.set(yearlyGoalRef, {
      yearlyGoal: 12,
      yearlyGoalYear: currentYear,
      history: {
        [String(currentYear)]: 12,
      },
    });

    // 4. Seed Reading Streaks log
    const streaksRef = doc(db, 'users', userId, 'streaks', 'log');
    const streakData: Record<string, { pages?: number; minutes?: number }> = {};
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      streakData[ds] = { pages: 25 + i * 5, minutes: 30 };
    }
    batch.set(streaksRef, { log: streakData }, { merge: true });

    // 5. Seed Word Library vocabulary in settings/wordLibrary
    const wordLibRef = doc(db, 'users', userId, 'settings', 'wordLibrary');
    const demoWords = [
      {
        id: 'serendipity',
        entries: [
          {
            word: 'Serendipity',
            phonetic: '/ˌser.ənˈdɪp.ə.ti/',
            phonetics: [
              {
                text: '/ˌser.ənˈdɪp.ə.ti/',
                audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/serendipity-us.mp3',
              },
            ],
            meanings: [
              {
                partOfSpeech: 'noun',
                definitions: [
                  {
                    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
                    synonyms: [],
                    antonyms: [],
                  },
                ],
                synonyms: [],
                antonyms: [],
              },
            ],
          },
        ],
        savedAt: new Date().toISOString(),
      },
      {
        id: 'ephemeral',
        entries: [
          {
            word: 'Ephemeral',
            phonetic: '/ɪˈfem.ər.əl/',
            phonetics: [
              {
                text: '/ɪˈfem.ər.əl/',
                audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/ephemeral-us.mp3',
              },
            ],
            meanings: [
              {
                partOfSpeech: 'adjective',
                definitions: [
                  {
                    definition: 'Lasting for a very short time; fleeting and transitory.',
                    synonyms: [],
                    antonyms: [],
                  },
                ],
                synonyms: [],
                antonyms: [],
              },
            ],
          },
        ],
        savedAt: new Date().toISOString(),
      },
      {
        id: 'mellifluous',
        entries: [
          {
            word: 'Mellifluous',
            phonetic: '/məˈlɪf.lu.əs/',
            phonetics: [
              {
                text: '/məˈlɪf.lu.əs/',
                audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/mellifluous-us.mp3',
              },
            ],
            meanings: [
              {
                partOfSpeech: 'adjective',
                definitions: [
                  {
                    definition: 'Sweet or musical; pleasant to hear.',
                    synonyms: [],
                    antonyms: [],
                  },
                ],
                synonyms: [],
                antonyms: [],
              },
            ],
          },
        ],
        savedAt: new Date().toISOString(),
      },
    ];
    batch.set(wordLibRef, { words: demoWords }, { merge: true });

    await batch.commit();
    console.log('Successfully populated rich demo data for Demo user!');
  } catch (err) {
    console.error('Error seeding demo data:', err);
  }
}
