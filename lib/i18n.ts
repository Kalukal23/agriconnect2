// Internationalization configuration for Amharic and English
export type Language = "en" | "am"

export const translations = {
  en: {
    // Navigation
    nav: {
      features: "Features",
      about: "About",
      login: "Login",
      getStarted: "Get Started",
      marketplace: "Marketplace",
      sellProducts: "Sell Products",
      dashboard: "Dashboard",
    },
    // Hero Section
    hero: {
      title: "Empowering Ethiopian Farmers with Real-Time Information",
      subtitle:
        "Access market prices, weather forecasts, and agricultural knowledge to make informed decisions and increase your farm income.",
      joinButton: "Join AgriConnect",
      learnMore: "Learn More",
    },
    // Features
    features: {
      title: "Everything You Need to Succeed",
      marketPrices: {
        title: "Real-Time Market Prices",
        description:
          "Get up-to-date crop prices from local markets and Ethiopian Commodity Exchange (ECX) to negotiate better deals.",
      },
      weather: {
        title: "Weather Forecasts",
        description: "Receive localized weather predictions and alerts for extreme conditions to protect your crops.",
      },
      knowledge: {
        title: "Knowledge Base",
        description: "Access expert agricultural advice, best practices, and solutions to common farming challenges.",
      },
      chatbot: {
        title: "AI Chatbot Assistant",
        description:
          "Get instant answers to your farming questions with our intelligent chatbot trained on local agricultural data.",
      },
      community: {
        title: "Community Forum",
        description: "Connect with fellow farmers, share experiences, and learn from each other's successes.",
      },
      sms: {
        title: "SMS Notifications",
        description: "Receive important updates via SMS even without internet access on any phone.",
      },
      marketplace: {
        title: "Marketplace",
        description: "Buy and sell agricultural products directly with other farmers in your region.",
      },
    },
    // Stats
    stats: {
      farmers: "Smallholder Farmers in Ethiopia",
      income: "Potential Income Increase",
      access: "Access to Information",
    },
    // About
    about: {
      title: "About AgriConnect",
      description1:
        "AgriConnect is designed specifically for Ethiopian smallholder farmers, addressing critical challenges like market exploitation, climate vulnerability, and limited access to agricultural extension services.",
      description2:
        "Our platform works on low-end smartphones and even feature phones through SMS integration, ensuring that every farmer can access vital information regardless of their internet connectivity or device capabilities.",
      description3:
        "By reducing information asymmetry and connecting farmers with real-time data and peer knowledge, AgriConnect aims to increase farmer incomes and contribute to Ethiopia's agricultural development goals.",
    },
    // CTA
    cta: {
      title: "Ready to Transform Your Farming?",
      subtitle:
        "Join thousands of farmers already using AgriConnect to make better decisions and increase their income.",
      button: "Sign Up Now - It's Free",
    },
    // Footer
    footer: {
      tagline: "Empowering Ethiopian farmers with technology",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
    },
    // Marketplace
    marketplace: {
      title: "Marketplace",
      buyProducts: "Buy Products",
      sellProducts: "Sell Products",
      addProduct: "Add Product",
      productName: "Product Name",
      price: "Price (ETB)",
      description: "Description",
      image: "Product Image",
      category: "Category",
      quantity: "Quantity Available",
      addToCart: "Add to Cart",
      viewDetails: "View Details",
      seller: "Seller",
      contact: "Contact Seller",
      noProducts: "No products available",
    },
    market: {
      title: "Market Prices",
      subtitle: "Real-time crop prices from Ethiopian markets and commodity exchange",
      priceAlert: "Price Alert",
      teffAlert: "Teff prices have increased by 4% in Addis Ababa. Consider selling if you have stock available.",
    },
    weather: {
      title: "Weather Forecast",
      subtitle: "Localized weather predictions for",
    },
    knowledge: {
      title: "Knowledge Base",
      subtitle: "Expert agricultural advice and best practices for Ethiopian farmers",
    },
    community: {
      title: "Community Forum",
      subtitle: "Connect with fellow farmers, ask questions, and share knowledge",
      newPost: "New Post",
    },
    dashboard: {
      welcome: "Welcome back",
      region: "Region",
      accessTools: "Access your agricultural tools and information",
      marketPrices: "Market Prices",
      viewPrices: "View current crop prices",
      weather: "Weather",
      checkForecasts: "Check forecasts and alerts",
      knowledgeBase: "Knowledge Base",
      learnTechniques: "Learn farming techniques",
      community: "Community",
      connectFarmers: "Connect with farmers",
      recentUpdates: "Recent Updates",
      teffPriceIncrease: "Teff prices increased in Addis Ababa",
      teffPrice: "Current price: 5,200 ETB/quintal (+4%)",
      hoursAgo: "hours ago",
      heavyRain: "Heavy rain expected this weekend",
      rainDescription: "Prepare your crops for rainfall in Oromia region",
      daysAgo: "days ago",
      pestControl: "New pest control guide available",
      pestDescription: "Learn how to protect your crops from fall armyworm",
    },
    seller: {
      title: "Seller Dashboard",
      myProducts: "My Products",
      addNewProduct: "Add New Product",
      productName: "Product Name",
      description: "Description",
      price: "Price (ETB)",
      quantity: "Quantity",
      category: "Category",
      imageUrl: "Image URL",
      addProduct: "Add Product",
      myListings: "My Listings",
      delete: "Delete",
      noProducts: "No products listed yet",
    },
  },
  am: {
    // Navigation
    nav: {
      features: "ባህሪያት",
      about: "ስለ ኛ",
      login: "ግባ",
      getStarted: "ጀምር",
      marketplace: "ገበያ",
      sellProducts: "ምርቶች ሽጥ",
      dashboard: "ዳሽቦርድ",
    },
    // Hero Section
    hero: {
      title: "የኢትዮጵያ ገበሬዎችን በእውነተኛ ጊዜ መረጃ ማብቃት",
      subtitle: "የገበያ ዋጋዎችን፣ የአየር ሁኔታ ትንበያዎችን እና ግብርና ዕውቀትን ይድረሱ ጥሩ ውሳኔዎችን ለመወሰን እና የእርሶ ገቢ ለመጨመር።",
      joinButton: "AgriConnect ይቀላቀሉ",
      learnMore: "ተጨማሪ ይወቁ",
    },
    // Features
    features: {
      title: "ለመሳካት የሚያስፈልግዎ ሁሉ",
      marketPrices: {
        title: "በእውነተኛ ጊዜ የገበያ ዋጋዎች",
        description: "ከአካባቢ ገበያዎች እና ከኢትዮጵያ ሸቀጦች ልውውጥ (ECX) የሚገኙ ዋጋዎችን ይወቁ ተሻላይ ስምምነት ለመወሰን።",
      },
      weather: {
        title: "የአየር ሁኔታ ትንበያዎች",
        description: "የአካባቢ የአየር ሁኔታ ትንበያዎችን እና ጥንቃቄዎችን ከባድ ሁኔታዎች ለመጠበቅ ምርቶችዎን ይቀበሉ።",
      },
      knowledge: {
        title: "የእውቀት ቤት",
        description: "ባለሙያ ግብርና ምክር፣ ምርጥ ልምዶች እና ለተለመዱ ግብርና ተግዳሮቶች መፍትሄዎችን ይድረሱ።",
      },
      chatbot: {
        title: "AI Chatbot ረዳት",
        description: "ለእርሶ ግብርና ጥያቄዎች ፈጣን መልስ ከአካባቢ ግብርና ውሂብ ጋር የሰለጠነ ሰው ሰራሽ ሞካሪ ይወቁ።",
      },
      community: {
        title: "ማህበረሰብ ፎረም",
        description: "ከሌሎች ገበሬዎች ጋር ተገናኙ፣ ልምዶችን ያካፍሉ እና ከእርስ በርስ ስኬቶች ይወቁ።",
      },
      sms: {
        title: "SMS ማሳወቂያዎች",
        description: "በማንኛውም ስልክ ላይ ኢንተርኔት ሳይኖር ወሳኝ ዝመናዎችን ይቀበሉ።",
      },
      marketplace: {
        title: "ገበያ",
        description: "ግብርና ምርቶችን በቀጥታ ከሌሎች ገበሬዎች ጋር በእርሶ ክልል ውስጥ ይግዙ እና ይሽጡ።",
      },
    },
    // Stats
    stats: {
      farmers: "በኢትዮጵያ ውስጥ ትናንሽ ገበሬዎች",
      income: "ሊሆን የሚችል ገቢ ጭማሪ",
      access: "ወደ መረጃ መዳረሻ",
    },
    // About
    about: {
      title: "AgriConnect ስለ",
      description1:
        "AgriConnect በተለይ ለኢትዮጵያ ትናንሽ ገበሬዎች ተዘጋጅቷል፣ ገበያ ዝርዝር፣ የአየር ሁኔታ ተጋላጭነት እና ወደ ግብርና ማራመጃ አገልግሎቶች ውስን መዳረሻ ያሉ ወሳኝ ተግዳሮቶችን ይፈታል።",
      description2:
        "ሥርዓታችን በዝቅተኛ-መጨረሻ ስልኮች እና በ SMS ውህደት በኩል ባህሪ ስልኮች ላይ ይሠራል፣ ሁሉም ገበሬዎች ወሳኝ መረጃ ሊደርሱ ይችላሉ ምንም ይሁን ምን የእነሱ ኢንተርኔት ግንኙነት ወይም መሳሪያ ችሎታ።",
      description3:
        "መረጃ ያልተመጣጠነ ሁኔታን በመቀነስ እና ገበሬዎችን ከእውነተኛ ጊዜ ውሂብ እና ተመሳሳይ ዕውቀት ጋር በማገናኘት፣ AgriConnect ገበሬዎች ገቢ ለመጨመር እና ለኢትዮጵያ ግብርና ልማት ግቦች ለመስተዋወቅ ይሞክራል።",
    },
    // CTA
    cta: {
      title: "ለእርሶ ግብርና ለመቀየር ዝግጁ?",
      subtitle: "ከሺዎች ��በሬዎች ጋር ይቀላቀሉ ቀድሞ AgriConnect ይጠቀማሉ ጥሩ ውሳኔዎችን ለመወሰን እና ገቢ ለመጨመር።",
      button: "አሁን ይመዝገቡ - ነፃ ነው",
    },
    // Footer
    footer: {
      tagline: "የኢትዮጵያ ገበሬዎችን በቴክኖሎጂ ማብቃት",
      privacy: "ግላዊነት",
      terms: "ውሎች",
      contact: "ያግኙ",
    },
    // Marketplace
    marketplace: {
      title: "ገበያ",
      buyProducts: "ምርቶች ይግዙ",
      sellProducts: "ምርቶች ሽጥ",
      addProduct: "ምርት ያክሉ",
      productName: "የምርት ስም",
      price: "ዋጋ (ETB)",
      description: "መግለጫ",
      image: "የምርት ምስል",
      category: "ምድብ",
      quantity: "ሊገኝ የሚችል ብዛት",
      addToCart: "ወደ ሸቀጥ ያክሉ",
      viewDetails: "ዝርዝሮችን ይመልከቱ",
      seller: "ሻጭ",
      contact: "ሻጩን ያግኙ",
      noProducts: "ምንም ምርቶች የሉም",
    },
    market: {
      title: "የገበያ ዋጋዎች",
      subtitle: "ከኢትዮጵያ ገበያዎች እና ሸቀጦች ልውውጥ ውስጥ በእውነተኛ ጊዜ የሰብል ዋጋዎች",
      priceAlert: "የዋጋ ማሳወቂያ",
      teffAlert: "የጤፍ ዋጋዎች በአዲስ አበባ 4% ጨምረዋል። ሸቀጥ ካለዎት መሸጥ ያስቡ።",
    },
    weather: {
      title: "የአየር ሁኔታ ትንበያ",
      subtitle: "ለ ተከታታይ የአየር ሁኔታ ትንበያዎች",
    },
    knowledge: {
      title: "የእውቀት ቤት",
      subtitle: "ለኢትዮጵያ ገበሬዎች ባለሙያ ግብርና ምክር እና ምርጥ ልምዶች",
    },
    community: {
      title: "ማህበረሰብ ፎረም",
      subtitle: "ከሌሎች ገበሬዎች ጋር ተገናኙ፣ ጥያቄዎችን ይጠይቁ እና ዕውቀትን ያካፍሉ",
      newPost: "አዲስ ልጥፍ",
    },
    dashboard: {
      welcome: "እንደገና ደህና መጡ",
      region: "ክልል",
      accessTools: "የእርሶ ግብርና መሳሪያዎች እና መረጃ ይድረሱ",
      marketPrices: "የገበያ ዋጋዎች",
      viewPrices: "የአሁኑን የሰብል ዋጋዎች ይመልከቱ",
      weather: "የአየር ሁኔታ",
      checkForecasts: "ትንበያዎችን እና ማሳወቂያዎችን ይመልከቱ",
      knowledgeBase: "የእውቀት ቤት",
      learnTechniques: "ግብርና ቴክኒኮችን ይወቁ",
      community: "ማህበረሰብ",
      connectFarmers: "ከገበሬዎች ጋር ተገናኙ",
      recentUpdates: "ቅርብ ዝመናዎች",
      teffPriceIncrease: "የጤፍ ዋጋዎች በአዲስ አበባ ጨምረዋል",
      teffPrice: "የአሁኑ ዋጋ: 5,200 ETB/quintal (+4%)",
      hoursAgo: "ሰዓታት በፊት",
      heavyRain: "ከባድ ዝናብ ይህ ሳምንት ወደ ሚጠበቅ ነው",
      rainDescription: "ምርቶችዎን በ Oromia ክልል ውስጥ ለዝናብ ዝግጁ ያድርጉ",
      daysAgo: "ቀናት በፊት",
      pestControl: "አዲስ የእንቁ ቁጥጥር መመሪያ ይገኛል",
      pestDescription: "ምርቶችዎን ከ fall armyworm ለመጠበቅ ይወቁ",
    },
    seller: {
      title: "ሻጭ ዳሽቦርድ",
      myProducts: "ሞያዬ ምርቶች",
      addNewProduct: "አዲስ ምርት ያክሉ",
      productName: "የምርት ስም",
      description: "መግለጫ",
      price: "ዋጋ (ETB)",
      quantity: "ብዛት",
      category: "ምድብ",
      imageUrl: "የምስል URL",
      addProduct: "ምርት ያክሉ",
      myListings: "ሞያዬ ዝርዝሮች",
      delete: "ሰርዝ",
      noProducts: "ገና ምንም ምርቶች አልተዘረዘሩም",
    },
  },
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
