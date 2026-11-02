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
  fanbaseRank: string;
  status: "live" | "curating";
  bpm?: string;
  soundReferences?: string;
}

/**
 * Ordered strictly by frequency of play at AFREQA and fanbase size:
 * 1. Progressive EDM (Tomorrowland anthems)
 * 2. Big Room
 * 3. African Tech
 * 4. Techno (From Acid to Hard to Industrial)
 * 5. Hardstyle and everything that falls under hardstyle (Uptempo, jumpstyle, rawstyle)
 * 6. Drum & Bass
 * 7. Dubstep
 */
export const PLAYLISTS: Playlist[] = [
  {
    id: "pl-progressive-edm",
    title: "PROGRESSIVE EDM (Tomorrowland Anthems)",
    curator: "Afreqa Mainstage Curators",
    tagline:
      "The undisputed anthem core and largest fanbase of AFREQA. Euphoric Tomorrowland-scale builds, soaring synth melodies, emotional vocal crescendos, and colossal hands-in-the-air mainstage drops uniting thousands into one frequency.",
    genre: "Progressive House • Tomorrowland Anthems",
    bpm: "128 – 132 BPM",
    fanbaseRank: "#1 Most Played • Largest Fanbase",
    status: "live",
    soundReferences:
      "Avicii, Martin Garrix, Alesso, Third Party, Swedish House Mafia, Matisse & Sadko",
    spotifyUri: "playlist/1W4N8V5MXS6Zzr10EYeF4t",
    spotifyUrl: "https://open.spotify.com/playlist/1W4N8V5MXS6Zzr10EYeF4t",
    tracksCount: "Official Tomorrowland Anthems",
  },
  {
    id: "pl-big-room",
    title: "BIG ROOM (Stadium Anthems)",
    curator: "Afreqa Colosseum Soundsystem",
    tagline:
      "Massive stadium electro power. Thunderous sub-bass kicks, brass synth drops, and colossal mainstage weapons engineered to get thousands of festival ravers jumping simultaneously to synchronized pyrotechnics.",
    genre: "Big Room • Stadium Electro • Peak-Time Festival",
    bpm: "128 – 130 BPM",
    fanbaseRank: "#2 Most Played • Stadium Power",
    status: "live",
    soundReferences:
      "Hardwell, Dimitri Vegas & Like Mike, Blasterjaxx, KSHMR, W&W",
    spotifyUri: "playlist/5WtLBb8qEwR9XR5GCNYVqX",
    spotifyUrl: "https://open.spotify.com/playlist/5WtLBb8qEwR9XR5GCNYVqX",
    tracksCount: "Stadium Festival Bangers",
  },
  {
    id: "pl-african-tech",
    title: "AFRICAN TECH",
    curator: "Afreqa Resident Selectors (Nairobi B2B Hub)",
    tagline:
      "Deep polyrhythmic percussion, authentic African electronic rhythms, and driving B2B power sets. Strictly authentic organic percussive groove powered by Nairobi's own resident selectors.",
    genre: "African Tech • Organic Percussive Electronic",
    bpm: "122 – 126 BPM",
    fanbaseRank: "#3 Most Played • Organic African Energy",
    status: "curating",
    soundReferences:
      "Coco Kahi, Mike Muema, Nayäkaze, Shock, Ryte, Z4V3 • Deep organic percussion & tribal synthesis",
    spotifyUri: "playlist/1W4N8V5MXS6Zzr10EYeF4t", // Fallback URI
    spotifyUrl: "https://open.spotify.com",
    tracksCount: "Resident B2B Curation Drop",
  },
  {
    id: "pl-hard-techno",
    title: "TECHNO (Acid • Hard • Industrial)",
    curator: "Nocturnal Warehouse Series",
    tagline:
      "Raw warehouse underground power. Spanning from screeching 303 acid synths to pummeling 140–155 BPM rolling kicks, hypnotic industrial low-ends, and relentless blacked-out 3 AM rave rhythms.",
    genre: "Hard Techno • 303 Acid Rave • Industrial",
    bpm: "140 – 155 BPM",
    fanbaseRank: "#4 Most Played • Dark Warehouse Edge",
    status: "live",
    soundReferences:
      "Sara Landry, Nico Moreno, alignment with dark European warehouse sounds, 303 Acid Rave",
    spotifyUri: "playlist/6FeRaCsCMqiZngUYgKHOF6",
    spotifyUrl: "https://open.spotify.com/playlist/6FeRaCsCMqiZngUYgKHOF6",
    tracksCount: "Dark Industrial Warehouse Beats",
  },
  {
    id: "pl-hardstyle-uptempo",
    title: "HARDSTYLE & UPTEMPO (Rawstyle • Jumpstyle)",
    curator: "Afreqa High-Velocity Lab",
    tagline:
      "150–200+ BPM pure kinetic velocity. Everything under hardstyle: punishing rawstyle kicks, high-octane uptempo drives, bouncy jumpstyle rhythms, and face-melting reverse bass for relentless dancefloor stamina.",
    genre: "Hardstyle • Rawstyle • Uptempo • Jumpstyle",
    bpm: "150 – 200+ BPM",
    fanbaseRank: "#5 Most Played • Peak-Velocity Catharsis",
    status: "live",
    soundReferences:
      "Creeds, Sub Zero Project, Rebelion, Warface, GPF, Sefa",
    spotifyUri: "playlist/6FNj0bNGhbA79LTcrLs5Wv",
    spotifyUrl: "https://open.spotify.com/playlist/6FNj0bNGhbA79LTcrLs5Wv",
    tracksCount: "150-200+ BPM Festival Arsenal",
  },
  {
    id: "pl-drum-and-bass",
    title: "DRUM & BASS (174 BPM Breaks)",
    curator: "Afreqa Velocity Operations",
    tagline:
      "174 BPM rolling amen breakbeats, deep sub-bass rollers, and liquid to neurofunk synthesis engineered for rapid-fire dancefloor energy and breathless momentum.",
    genre: "Drum & Bass • Liquid to Neurofunk",
    bpm: "174 BPM",
    fanbaseRank: "#6 Fanbase • High-Tempo Amen Energy",
    status: "curating",
    soundReferences: "Chase & Status, Sub Focus, Dimension, Andy C, Bou",
    spotifyUri: "playlist/1W4N8V5MXS6Zzr10EYeF4t", // Fallback URI
    spotifyUrl: "https://open.spotify.com",
    tracksCount: "174 BPM Amen Breakdown",
  },
  {
    id: "pl-dubstep",
    title: "DUBSTEP (Heavy Bass Weapons)",
    curator: "Afreqa Bass Sub-Command",
    tagline:
      "Sub-bass shockwaves, aggressive riddim chops, robotic metallic screeches, and festival trap drops designed to shake concrete foundations and rattle ribcages.",
    genre: "Dubstep • Heavy Riddim • Sub-Bass Impact",
    bpm: "140 – 150 BPM",
    fanbaseRank: "#7 Fanbase • Colossal Sub-Bass Shockwaves",
    status: "curating",
    soundReferences: "Excision, Subtronics, Virtual Riot, Ray Volpe, Wooli",
    spotifyUri: "playlist/1W4N8V5MXS6Zzr10EYeF4t", // Fallback URI
    spotifyUrl: "https://open.spotify.com",
    tracksCount: "Festival Bass Shockwaves",
  },
];

export const LIVE_PLAYLISTS = PLAYLISTS.filter((p) => p.status === "live");

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
  curatorNote:
    "The peak-time weapon decimating festival mainstages and underground warehouses across the globe. Powered by an unmistakable vocal hook, a punishing 160 BPM reverse bassline, and euphoric synth stabs, it represents the relentless energy that defines Afreqa dancefloors.",
  curator: "Afreqa Soundsystem",
  weekNumber: "OFFICIAL SELECTION • WEEK 44",
};
