import { CategoryInfo, FeedSource, Article } from './types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    name: 'All Culinary',
    vietnameseName: 'Tất cả ẩm thực',
    description: 'Toàn cảnh thế giới ẩm thực, công thức món ngon, quán xá và xu hướng đồ uống',
    iconName: 'Flame',
    color: 'from-orange-500 to-amber-600'
  },
  {
    id: 'recipes',
    name: 'Recipes',
    vietnameseName: 'Công thức nấu ăn',
    description: 'Bí quyết nấu ăn gia đình, món tiệc, bánh ngọt và kỹ thuật chế biến chuẩn đầu bếp',
    iconName: 'ChefHat',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'places',
    name: 'Places & Spots',
    vietnameseName: 'Quán xá & Địa điểm',
    description: 'Bản đồ hàng quán ngon, ẩm thực đường phố, nhà hàng fine dining tại Hà Nội, Sài Gòn, Đà Nẵng',
    iconName: 'MapPin',
    color: 'from-rose-500 to-red-600'
  },
  {
    id: 'reviews',
    name: 'Food Reviews',
    vietnameseName: 'Đánh giá & Trải nghiệm',
    description: 'Review chân thực chất lượng món ăn, không gian, giá cả và trải nghiệm dịch vụ',
    iconName: 'Star',
    color: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'drinks',
    name: 'Coffee & Drinks',
    vietnameseName: 'Đồ uống & Cà phê',
    description: 'Văn hóa cà phê Specialty, trà sữa, cocktail pha chế và thức uống giải nhiệt sáng tạo',
    iconName: 'Coffee',
    color: 'from-amber-700 to-yellow-800'
  },
  {
    id: 'healthy',
    name: 'Healthy & Diet',
    vietnameseName: 'Ăn sạch & Dinh dưỡng',
    description: 'Thực đơn Eat Clean, Keto, ăn chay thanh đạm, dinh dưỡng khoa học và bảo vệ sức khỏe',
    iconName: 'Salad',
    color: 'from-green-500 to-lime-600'
  },
  {
    id: 'vietnam',
    name: 'Vietnamese Cuisine',
    vietnameseName: 'Ẩm thực Việt Nam',
    description: 'Tinh hoa ẩm thực 3 miền Bắc - Trung - Nam, món ăn di sản và gia vị truyền thống',
    iconName: 'Soup',
    color: 'from-red-600 to-amber-500'
  }
];

export const FEED_SOURCES: FeedSource[] = [
  // Recipes
  {
    id: 'seriouseats',
    name: 'Serious Eats',
    url: 'https://www.seriouseats.com',
    feedUrl: 'https://www.seriouseats.com/feeds/rss',
    type: 'rss',
    category: 'recipes',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    icon: 'ChefHat',
    language: 'en'
  },
  {
    id: 'thekitchn',
    name: 'The Kitchn',
    url: 'https://www.thekitchn.com',
    feedUrl: 'https://www.thekitchn.com/main.rss',
    type: 'rss',
    category: 'recipes',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    icon: 'Utensils',
    language: 'en'
  },

  // Places & Reviews
  {
    id: 'bonappetit',
    name: 'Bon Appétit',
    url: 'https://www.bonappetit.com',
    feedUrl: 'https://www.bonappetit.com/feed/rss',
    type: 'rss',
    category: 'reviews',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    icon: 'Sparkles',
    language: 'en'
  },
  {
    id: 'food52',
    name: 'Food52',
    url: 'https://food52.com',
    feedUrl: 'https://food52.com/blog.rss',
    type: 'rss',
    category: 'reviews',
    badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    icon: 'Award',
    language: 'en'
  },

  // Vietnamese Food & Places
  {
    id: 'vnexpress-amthuc',
    name: 'VnExpress Ẩm Thực',
    url: 'https://vnexpress.net/du-lich/am-thuc',
    feedUrl: 'https://vnexpress.net/rss/du-lich.rss',
    type: 'rss',
    category: 'vietnam',
    badgeColor: 'bg-red-500/10 text-red-600 border-red-500/20',
    icon: 'Soup',
    language: 'vi'
  },
  {
    id: 'vnexpress-dinhduong',
    name: 'VnExpress Dinh Dưỡng',
    url: 'https://vnexpress.net/suc-khoe/dinh-duong',
    feedUrl: 'https://vnexpress.net/rss/suc-khoe.rss',
    type: 'rss',
    category: 'healthy',
    badgeColor: 'bg-green-500/10 text-green-600 border-green-500/20',
    icon: 'Salad',
    language: 'vi'
  }
];

export const FALLBACK_ARTICLES: Article[] = [
  {
    id: 'food-fb-1',
    title: 'Bí quyết nấu Phở Bò truyền thống Hà Nội: Nước dùng trong veo, ngọt thanh từ xương ống và thảo mộc',
    link: 'https://vnexpress.net/bi-quyet-nau-pho-bo-ha-noi',
    pubDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    formattedDate: '30 phút trước',
    relativeTime: '30m ago',
    source: {
      id: 'vnexpress-amthuc',
      name: 'VnExpress Ẩm Thực',
      url: 'https://vnexpress.net',
      badgeColor: 'bg-red-500/10 text-red-600 border-red-500/20',
      icon: 'Soup',
      language: 'vi'
    },
    category: 'recipes',
    categoryName: 'Công thức nấu ăn',
    summary: 'Hướng dẫn chi tiết từ khâu hầm xương bò 8 tiếng không bị đục, kỹ thuật nướng gừng hành hoa hồi quế thảo quả chuẩn vị cổ truyền đất Hà thành.',
    coverImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    author: 'Đầu bếp Thanh Tùng',
    readingTime: 6,
    tags: ['Phở Bò', 'Món Hà Nội', 'Món Nước', 'Công Thức Gia Truyền'],
    prepTime: '45 phút',
    difficulty: 'Trung bình'
  },
  {
    id: 'food-fb-2',
    title: 'Khám phá 7 quán ốc đêm và hải sản đường phố trứ danh nức lòng giới sành ăn Sài Gòn',
    link: 'https://vnexpress.net/top-quan-oc-dem-sai-gon',
    pubDate: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    formattedDate: '1 giờ trước',
    relativeTime: '1h ago',
    source: {
      id: 'vnexpress-amthuc',
      name: 'VnExpress Ẩm Thực',
      url: 'https://vnexpress.net',
      badgeColor: 'bg-red-500/10 text-red-600 border-red-500/20',
      icon: 'MapPin',
      language: 'vi'
    },
    category: 'places',
    categoryName: 'Quán xá & Địa điểm',
    summary: 'Từ ốc hương xào bơ tỏi thơm lừng chấm bánh mì giòn rụm đến càng ghẹ rang muối ớt cay xè tại quận 4 và quận 10; điểm đến không thể bỏ lỡ khi đêm về.',
    coverImage: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80',
    author: 'Hương Giang Foodie',
    readingTime: 5,
    tags: ['Ốc Sài Gòn', 'Ăn Đêm', 'Quán Ngon', 'Quận 4']
  },
  {
    id: 'food-fb-3',
    title: 'Cà phê Muối xứ Huế: Nghệ thuật cân bằng vị đắng đậm đà Robusta và lớp kem mặn béo ngậy',
    link: 'https://seriouseats.com/vietnamese-salt-coffee-guide',
    pubDate: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    formattedDate: '2 giờ trước',
    relativeTime: '2h ago',
    source: {
      id: 'seriouseats',
      name: 'Serious Eats',
      url: 'https://www.seriouseats.com',
      badgeColor: 'bg-amber-700/10 text-amber-800 border-amber-700/20',
      icon: 'Coffee',
      language: 'vi'
    },
    category: 'drinks',
    categoryName: 'Đồ uống & Cà phê',
    summary: 'Công thức đánh bông lớp màng sữa muối bằng whipping cream và sữa đặc, kết hợp cốt cà phê phin truyền thống nhỏ giọt tạo nên thức uống làm xiêu lòng thực khách.',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    author: 'Barista Minh Khang',
    readingTime: 4,
    tags: ['Cà Phê Muối', 'Cà Phê Phin', 'Đồ Uống Huế', 'Pha Chế'],
    prepTime: '15 phút',
    difficulty: 'Dễ'
  },
  {
    id: 'food-fb-4',
    title: 'Đánh giá ẩm thực: Trải nghiệm ẩm thực fusion Á - Âu tại nhà hàng gắn sao Michelin ở Đà Nẵng',
    link: 'https://bonappetit.com/michelin-danang-experience',
    pubDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    formattedDate: '3 giờ trước',
    relativeTime: '3h ago',
    source: {
      id: 'bonappetit',
      name: 'Bon Appétit',
      url: 'https://www.bonappetit.com',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      icon: 'Star',
      language: 'en'
    },
    category: 'reviews',
    categoryName: 'Đánh giá & Trải nghiệm',
    summary: 'Chi tiết tasting menu 9 món kết hợp hải sản tươi sống miền Trung cùng kỹ thuật nấu sous-vide kiểu Pháp: Đỉnh cao vị giác và dịch vụ đẳng cấp quốc tế.',
    coverImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    author: 'Ẩm Thực Reviewer',
    readingTime: 7,
    tags: ['Michelin', 'Fine Dining', 'Đà Nẵng', 'Review']
  },
  {
    id: 'food-fb-5',
    title: 'Thực đơn Eat Clean 7 ngày thanh lọc cơ thể: Giàu protein, kiểm soát calo mà không lo bị ngán',
    link: 'https://vnexpress.net/thuc-don-eat-clean-7-ngay',
    pubDate: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    formattedDate: '4 giờ trước',
    relativeTime: '4h ago',
    source: {
      id: 'vnexpress-dinhduong',
      name: 'VnExpress Dinh Dưỡng',
      url: 'https://vnexpress.net',
      badgeColor: 'bg-green-500/10 text-green-600 border-green-500/20',
      icon: 'Salad',
      language: 'vi'
    },
    category: 'healthy',
    categoryName: 'Ăn sạch & Dinh dưỡng',
    summary: 'Gợi ý cách ướp ức gà mọng nước, salad sốt chanh leo chua dịu và công thức meal prep bữa trưa công sở tiện lợi, giúp giữ dáng và tăng cường năng lượng.',
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    author: 'Chuyên gia Dinh dưỡng Lan Anh',
    readingTime: 5,
    tags: ['Eat Clean', 'Healthy Food', 'Giảm Cân', 'Meal Prep']
  },
  {
    id: 'food-fb-6',
    title: 'Hành trình di sản Bánh Mì Việt Nam: Từ món ăn du nhập đến biểu tượng ẩm thực vang danh năm châu',
    link: 'https://thekitchn.com/vietnamese-banh-mi-heritage',
    pubDate: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    formattedDate: '5 giờ trước',
    relativeTime: '5h ago',
    source: {
      id: 'thekitchn',
      name: 'The Kitchn',
      url: 'https://www.thekitchn.com',
      badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
      icon: 'Utensils',
      language: 'vi'
    },
    category: 'vietnam',
    categoryName: 'Ẩm thực Việt Nam',
    summary: 'Giải mã lớp vỏ bánh mì mỏng giòn rụm đặc trưng, hòa quyện pate gan béo ngậy, chả lụa, đồ chua dưa leo và sốt bơ trứng nhà làm chinh phục thế giới.',
    coverImage: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=1200&q=80',
    author: 'Văn hóa Ẩm thực',
    readingTime: 6,
    tags: ['Bánh Mì', 'Street Food', 'Ẩm Thực Việt', 'Di Sản']
  }
];
