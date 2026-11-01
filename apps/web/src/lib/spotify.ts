export interface Playlist {
  id: string;
  title: string;
  curator: string;
  tagline: string;
  genre: string;
  spotifyUri: string; // Spotify embed URI or ID
  spotifyUrl: string;
  coverImage?: string;
  tracksCount: string;
}

export const PLAYLISTS: Playlist[] = [
  {
    id: "pl-hardstyle-uptempo",
    title: "HARDSTYLE & UPTEMPO",
    curator: "Afreqa High-Velocity Lab",
    tagline: "150–200+ BPM high-octane energy. Relentless distorted kicks, raw reverse basslines, and euphoric festival screeches engineered for the fastest, most relentless dancefloors.",
    genre: "Hardstyle • Rawstyle • Uptempo (150-200 BPM)",
    spotifyUri: "playlist/6FNj0bNGhbA79LTcrLs5Wv",
    spotifyUrl: "https://open.spotify.com/playlist/6FNj0bNGhbA79LTcrLs5Wv",
    tracksCount: "High-BPM Festival Arsenal",
  },
  {
    id: "pl-progressive-edm",
    title: "PROGRESSIVE EDM (mostly)",
    curator: "Afreqa Mainstage Curators",
    tagline: "Pure anthemic festival euphoria. Soaring synth leads, emotional chord progressions, and uplifting hands-in-the-air drops inspired by legendary festival mainstage moments.",
    genre: "Progressive House • Melodic Festival EDM",
    spotifyUri: "playlist/1W4N8V5MXS6Zzr10EYeF4t",
    spotifyUrl: "https://open.spotify.com/playlist/1W4N8V5MXS6Zzr10EYeF4t",
    tracksCount: "Emotional Melodic Anthems",
  },
  {
    id: "pl-big-room",
    title: "BIG ROOM",
    curator: "Tomorrowland XP Soundsystem",
    tagline: "Massive stadium-filling electro drops, thunderous sub-bass kicks, and peak-time festival weapons engineered to make thousands of dancers jump in unison.",
    genre: "Big Room • Electro House • Stadium Anthems",
    spotifyUri: "playlist/5WtLBb8qEwR9XR5GCNYVqX",
    spotifyUrl: "https://open.spotify.com/playlist/5WtLBb8qEwR9XR5GCNYVqX",
    tracksCount: "Peak-Time Mainstage Bangers",
  },
  {
    id: "pl-hard-techno",
    title: "HARD TECHNO",
    curator: "Nocturnal Warehouse Series",
    tagline: "Raw industrial low-end, 140–155 BPM rolling kicks, screeching 303 acid synths, and dark hypnotic rhythms built for underground raves and 3 AM blacked-out dancefloors.",
    genre: "Hard Techno • Industrial • Acid Rave",
    spotifyUri: "playlist/6FeRaCsCMqiZngUYgKHOF6",
    spotifyUrl: "https://open.spotify.com/playlist/6FeRaCsCMqiZngUYgKHOF6",
    tracksCount: "Dark & Heavy Industrial Beats",
  },
];

export interface TrackOfTheWeekData {
  title: string;
  artist: string;
  remixOrMix?: string;
  genre: string;
  bpm: number;
  key: string;
  label?: string;
  spotifyTrackId: string;
  spotifyUrl: string;
  curatorNote: string;
  curator: string;
  weekNumber: string;
}

export const TRACK_OF_THE_WEEK: TrackOfTheWeekData = {
  title: "Push Up",
  artist: "Creeds",
  remixOrMix: "Original Club Edit",
  genre: "Hard Dance • Reverse Bass",
  bpm: 160,
  key: "F# Minor",
  label: "Rave Alert Records",
  spotifyTrackId: "0LUpXQGq7v5r4e25wRkFz5",
  spotifyUrl: "https://open.spotify.com/track/0LUpXQGq7v5r4e25wRkFz5",
  curatorNote: "The peak-time weapon decimating festival mainstages and underground warehouses across the globe. Powered by an unmistakable vocal hook, a punishing 160 BPM reverse bassline, and euphoric synth stabs, it represents the relentless energy that defines Afreqa dancefloors.",
  curator: "Afreqa Soundsystem",
  weekNumber: "OFFICIAL SELECTION • WEEK 44",
};
