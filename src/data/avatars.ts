export interface AvatarOption {
  id: string;
  label: string;
  gender: 'male' | 'female';
  src: string;
  description: string;
}

export const AVATARS: AvatarOption[] = [
  {
    id: 'philosopher',
    label: 'The Philosopher',
    gender: 'male',
    src: '/avatars/philosopher.png',
    description: 'Seeker of truth through endless inquiry',
  },
  {
    id: 'poet',
    label: 'The Poet',
    gender: 'male',
    src: '/avatars/poet.png',
    description: 'Weaver of words, painter of feeling',
  },
  {
    id: 'scribe',
    label: 'The Scribe',
    gender: 'male',
    src: '/avatars/scribe.png',
    description: 'Keeper of ancient knowledge on parchment',
  },
  {
    id: 'alchemist',
    label: 'The Alchemist',
    gender: 'male',
    src: '/avatars/alchemist.png',
    description: 'Transmuter of elements, seeker of the elixir of wisdom',
  },
  {
    id: 'cartographer',
    label: 'The Cartographer',
    gender: 'male',
    src: '/avatars/cartographer.png',
    description: 'Mapper of uncharted lands and explorer of margins',
  },
  {
    id: 'scholar_female',
    label: 'The Scholar',
    gender: 'female',
    src: '/avatars/scholar_female.png',
    description: 'Devoted to the pursuit of literary mastery',
  },
  {
    id: 'librarian',
    label: 'The Librarian',
    gender: 'female',
    src: '/avatars/librarian.png',
    description: 'Guardian of every story ever told',
  },
  {
    id: 'muse',
    label: 'The Muse',
    gender: 'female',
    src: '/avatars/muse.png',
    description: 'Inspiration born from classical antiquity',
  },
  {
    id: 'archivist',
    label: 'The Archivist',
    gender: 'female',
    src: '/avatars/archivist.png',
    description: 'Preserver of forgotten chronicles and fragile memories',
  },
  {
    id: 'astronomer',
    label: 'The Astronomer',
    gender: 'female',
    src: '/avatars/astronomer.png',
    description: 'Decoder of the cosmic canvas and wanderer of constellations',
  },
];
