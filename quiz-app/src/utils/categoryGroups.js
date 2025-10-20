// OpenTDB categories reference:
//  9  General Knowledge
// 10  Books
// 11  Film
// 12  Music
// 13  Musicals & Theatres
// 14  Television
// 15  Video Games
// 16  Board Games
// 17  Science & Nature
// 18  Computers
// 19  Mathematics
// 20  Mythology
// 21  Sports
// 22  Geography
// 23  History
// 24  Politics
// 25  Art
// 26  Celebrities
// 27  Animals
// 28  Vehicles
// 29  Comics
// 30  Gadgets  <-- excluded (too niche / low volume)
// 31  Anime & Manga
// 32  Cartoon & Animations

export const CATEGORY_GROUPS = [
  {
    id: "entertainment",
    name: "Entertainment",
    categoryIds: [11, 12, 14, 15, 29, 31, 32, 26], // Film, Music, TV, Video Games, Comics, Anime, Cartoons, Celebrities
    specifics: [
      { id: 31, name: "Anime & Manga" },
      { id: 15, name: "Video Games" },
      { id: 11, name: "Film" },
      { id: 14, name: "Television" },
      { id: 12, name: "Music" },
    ],
  },
  {
    id: "science",
    name: "Science & Tech",
    categoryIds: [17, 18, 19, 27, 28], // Science & Nature, Computers, Math, Animals, Vehicles
    specifics: [
      { id: 17, name: "Science & Nature" },
      { id: 18, name: "Computers" },
      { id: 19, name: "Mathematics" },
      { id: 27, name: "Animals" },
    ],
  },
  {
    id: "history_geo",
    name: "History & Geography",
    categoryIds: [23, 22, 24], // History, Geography, Politics
    specifics: [
      { id: 23, name: "History" },
      { id: 22, name: "Geography" },
    ],
  },
  {
    id: "arts_lit",
    name: "Arts & Literature",
    categoryIds: [10, 25, 13, 29], // Books, Art, Musicals, (Comics overlap OK)
    specifics: [
      { id: 10, name: "Books / Literature" },
      { id: 25, name: "Art" },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    categoryIds: [21],
    specifics: [], // 👈 hide "More specific?" (none)
  },
  {
    id: "general",
    name: "General Knowledge",
    categoryIds: [9, 16, 20], // General, Board Games, Mythology
    specifics: [], // 👈 hide "More specific?" (none)
  },
];

export const ANY_GROUP = { id: "any", name: "Any Topic", categoryIds: [], specifics: [] };

export function listAllGroups() {
  return [ANY_GROUP, ...CATEGORY_GROUPS];
}

export function getGroupById(id) {
  if (!id || id === "any") return ANY_GROUP;
  return CATEGORY_GROUPS.find((g) => g.id === id) || ANY_GROUP;
}
