// Mock knowledge base data
// In production, store in MongoDB

export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  publishedAt: Date
  views: number
  language: string
}

export interface ForumPost {
  id: string
  userId: string
  userName: string
  userRegion: string
  title: string
  content: string
  category: string
  images?: string[]
  likes: number
  replies: number
  createdAt: Date
  updatedAt: Date
}

export interface ForumReply {
  id: string
  postId: string
  userId: string
  userName: string
  content: string
  createdAt: Date
}

const CATEGORIES = ["Crop Management", "Pest Control", "Soil Health", "Irrigation", "Harvesting", "Marketing"]

// Mock articles
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Best Practices for Teff Cultivation in Ethiopia",
    excerpt: "Learn the optimal techniques for growing teff, Ethiopia's staple grain crop.",
    content:
      "Teff is Ethiopia's most important cereal crop. For optimal yield, plant during the main rainy season (June-September). Prepare the soil by plowing 3-4 times. Use improved seeds and apply fertilizer at planting. Teff requires well-drained soil and regular weeding...",
    category: "Crop Management",
    tags: ["teff", "cultivation", "planting"],
    author: "Dr. Alemayehu Bekele",
    publishedAt: new Date("2024-01-15"),
    views: 1250,
    language: "english",
  },
  {
    id: "2",
    title: "Identifying and Controlling Fall Armyworm",
    excerpt: "Protect your maize crops from this destructive pest with early detection and treatment.",
    content:
      "Fall armyworm is a major threat to maize production. Look for irregular holes in leaves and frass (insect droppings). Early detection is crucial. Use integrated pest management: handpick larvae in small infestations, apply biological controls like Bt, or use approved pesticides as last resort...",
    category: "Pest Control",
    tags: ["pest", "maize", "armyworm"],
    author: "Tigist Haile",
    publishedAt: new Date("2024-02-01"),
    views: 890,
    language: "english",
  },
  {
    id: "3",
    title: "Improving Soil Fertility with Organic Methods",
    excerpt: "Enhance your soil health naturally using compost and crop rotation.",
    content:
      "Healthy soil is the foundation of productive farming. Use organic matter like compost and manure to improve soil structure. Practice crop rotation to prevent nutrient depletion. Legumes like haricot beans fix nitrogen naturally. Avoid burning crop residues - incorporate them into soil instead...",
    category: "Soil Health",
    tags: ["soil", "organic", "fertility"],
    author: "Mulugeta Tadesse",
    publishedAt: new Date("2024-01-20"),
    views: 670,
    language: "english",
  },
  {
    id: "4",
    title: "Water-Efficient Irrigation Techniques",
    excerpt: "Maximize water use efficiency with drip irrigation and proper scheduling.",
    content:
      "Water scarcity is a growing challenge. Drip irrigation can reduce water use by 50% compared to flood irrigation. Install drip lines along crop rows. Water early morning or evening to reduce evaporation. Monitor soil moisture and irrigate only when needed...",
    category: "Irrigation",
    tags: ["irrigation", "water", "efficiency"],
    author: "Hanna Girma",
    publishedAt: new Date("2024-02-10"),
    views: 540,
    language: "english",
  },
]

// Mock forum posts
const mockPosts: ForumPost[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Abebe Kebede",
    userRegion: "Oromia",
    title: "What's the best time to harvest wheat?",
    content:
      "I'm growing wheat for the first time and not sure when to harvest. The grains are turning yellow but still soft. Should I wait longer?",
    category: "Harvesting",
    likes: 12,
    replies: 5,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "2",
    userId: "user2",
    userName: "Marta Tesfaye",
    userRegion: "Amhara",
    title: "Dealing with coffee berry disease",
    content:
      "My coffee plants have dark spots on the berries. I think it's coffee berry disease. Has anyone dealt with this? What treatments work?",
    category: "Pest Control",
    likes: 8,
    replies: 3,
    createdAt: new Date("2024-03-02"),
    updatedAt: new Date("2024-03-02"),
  },
  {
    id: "3",
    userId: "user3",
    userName: "Dawit Solomon",
    userRegion: "Addis Ababa",
    title: "Where to sell organic vegetables in Addis?",
    content:
      "I grow organic vegetables and looking for good markets in Addis Ababa. Any recommendations for places that pay fair prices?",
    category: "Marketing",
    likes: 15,
    replies: 7,
    createdAt: new Date("2024-03-03"),
    updatedAt: new Date("2024-03-03"),
  },
]

export async function searchArticles(query: string, category?: string): Promise<Article[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let results = [...mockArticles]

  if (category && category !== "all") {
    results = results.filter((a) => a.category === category)
  }

  if (query) {
    const queryLower = query.toLowerCase()
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(queryLower) ||
        a.content.toLowerCase().includes(queryLower) ||
        a.tags.some((tag) => tag.toLowerCase().includes(queryLower)),
    )
  }

  return results
}

export async function getArticleById(id: string): Promise<Article | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockArticles.find((a) => a.id === id) || null
}

export async function getForumPosts(category?: string): Promise<ForumPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let posts = [...mockPosts]

  if (category && category !== "all") {
    posts = posts.filter((p) => p.category === category)
  }

  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getForumPostById(id: string): Promise<ForumPost | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockPosts.find((p) => p.id === id) || null
}

export async function createForumPost(post: Omit<ForumPost, "id" | "createdAt" | "updatedAt">): Promise<ForumPost> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newPost: ForumPost = {
    ...post,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockPosts.unshift(newPost)
  return newPost
}

export { CATEGORIES }
