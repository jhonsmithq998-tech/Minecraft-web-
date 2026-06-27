// =============================================
// MINECRAFT STORE DATA
// Edit this file to update ranks and kits
// =============================================

const STORE_CONFIG = {
  serverName: "CraftedRealms",
  serverIP: "play.craftedrealms.net",
  upiId: "yourname@upi",          // <-- CHANGE THIS to your UPI ID
  upiName: "Your Name",           // <-- CHANGE THIS to your name
  currency: "INR",
  discordLink: "https://discord.gg/yourserver",
  bannerText: "🎮 Use code WELCOME10 for 10% off your first purchase!"
};

const RANKS = [
  {
    id: "rank_stone",
    name: "Stone",
    tier: 1,
    price: 99,
    color: "#8B8B8B",
    glowColor: "#aaaaaa",
    badge: "⬜",
    popular: false,
    perks: [
      "Stone rank prefix [Stone]",
      "Access to /kit stone (weekly)",
      "2 Home locations",
      "Chat color: Gray",
      "Join with full server",
      "Access to /nick command"
    ]
  },
  {
    id: "rank_iron",
    name: "Iron",
    tier: 2,
    price: 199,
    color: "#D4D4D4",
    glowColor: "#e8e8e8",
    badge: "⬛",
    popular: false,
    perks: [
      "Iron rank prefix [Iron]",
      "All Stone perks included",
      "Access to /kit iron (weekly)",
      "5 Home locations",
      "Chat color: White",
      "Fly in spawn area",
      "Access to /hat command",
      "Priority queue skip"
    ]
  },
  {
    id: "rank_gold",
    name: "Gold",
    tier: 3,
    price: 349,
    color: "#FFD700",
    glowColor: "#ffec6e",
    badge: "⭐",
    popular: true,
    perks: [
      "Gold rank prefix [Gold] in yellow",
      "All Iron perks included",
      "Access to /kit gold (weekly)",
      "10 Home locations",
      "Chat color: Gold",
      "Fly anywhere on survival",
      "Access to /ptime command",
      "Particle effects on join",
      "Custom join message",
      "2x McMMO XP boost"
    ]
  },
  {
    id: "rank_diamond",
    name: "Diamond",
    tier: 4,
    price: 599,
    color: "#00FFFF",
    glowColor: "#7ffeff",
    badge: "💎",
    popular: false,
    perks: [
      "Diamond rank prefix [Diamond] in aqua",
      "All Gold perks included",
      "Access to /kit diamond (weekly)",
      "25 Home locations",
      "Chat color: Aqua",
      "Creative mode in /plot world",
      "Access to /feed command",
      "Access to /heal command",
      "3x McMMO XP boost",
      "VIP Discord role",
      "Early access to new features"
    ]
  },
  {
    id: "rank_emerald",
    name: "Emerald",
    tier: 5,
    price: 999,
    color: "#00FF7F",
    glowColor: "#5dffb2",
    badge: "🟩",
    popular: false,
    perks: [
      "Emerald rank prefix [Emerald] in green",
      "All Diamond perks included",
      "Access to /kit emerald (weekly)",
      "Unlimited Home locations",
      "Chat color: Any color",
      "God mode toggle (non-PvP zones)",
      "Access to /speed command",
      "Custom player head in shop",
      "4x McMMO XP boost",
      "Monthly crate key gift",
      "Direct admin support channel"
    ]
  },
  {
    id: "rank_legend",
    name: "Legend",
    tier: 6,
    price: 1799,
    color: "#FF4500",
    glowColor: "#ff7f50",
    badge: "🔥",
    popular: false,
    perks: [
      "Legend rank prefix [LEGEND] in red fire",
      "All Emerald perks included",
      "Access to /kit legend (weekly)",
      "Unlimited homes + teleport anywhere",
      "Custom chat prefix (any text)",
      "Lightning strike on join effect",
      "Access to all cosmetic particles",
      "5x McMMO XP boost",
      "Weekly crate keys × 3",
      "Name in lobby display board",
      "Beta feature tester status",
      "Permanent 15% shop discount"
    ]
  }
];

const KITS = [
  {
    id: "kit_starter",
    name: "Starter Kit",
    price: 49,
    color: "#8B8B8B",
    glowColor: "#aaaaaa",
    cooldown: "One-time",
    badge: "🎒",
    items: [
      "Stone Sword (Sharpness I)",
      "Stone Pickaxe (Efficiency I)",
      "Stone Axe",
      "Stone Shovel",
      "32x Cooked Beef",
      "16x Torches",
      "64x Stone Blocks",
      "Leather Armor Set"
    ]
  },
  {
    id: "kit_warrior",
    name: "Warrior Kit",
    price: 149,
    color: "#FF6B35",
    glowColor: "#ff9d72",
    cooldown: "Weekly",
    badge: "⚔️",
    items: [
      "Iron Sword (Sharpness II, Knockback I)",
      "Iron Pickaxe (Efficiency II, Unbreaking I)",
      "Iron Axe (Sharpness I)",
      "Full Iron Armor (Protection II)",
      "64x Steak",
      "16x Golden Apples",
      "4x TNT",
      "Bow (Power II)",
      "64x Arrows"
    ]
  },
  {
    id: "kit_miner",
    name: "Miner Kit",
    price: 129,
    color: "#B8860B",
    glowColor: "#daa520",
    cooldown: "Weekly",
    badge: "⛏️",
    items: [
      "Diamond Pickaxe (Efficiency III, Unbreaking II)",
      "Diamond Shovel (Efficiency III)",
      "32x TNT",
      "64x Torches",
      "Enchanted Golden Apple × 2",
      "Fortune III Book",
      "Silk Touch Book",
      "64x Rails",
      "16x Powered Rails"
    ]
  },
  {
    id: "kit_builder",
    name: "Builder Kit",
    price: 99,
    color: "#4169E1",
    glowColor: "#7b9dff",
    cooldown: "Weekly",
    badge: "🏗️",
    items: [
      "64x Oak Planks",
      "64x Stone Bricks",
      "64x Glass Panes",
      "64x Wool (Mixed Colors)",
      "64x Concrete (Mixed Colors)",
      "32x Doors (Oak)",
      "16x Lanterns",
      "32x Stairs (Oak)",
      "Architect's Guidebook (Custom Book)"
    ]
  },
  {
    id: "kit_hunter",
    name: "Hunter Kit",
    price: 199,
    color: "#228B22",
    glowColor: "#3cb371",
    cooldown: "Weekly",
    badge: "🏹",
    items: [
      "Diamond Bow (Power III, Flame I, Infinity)",
      "1x Arrow (Infinity)",
      "Diamond Sword (Sharpness III, Looting II)",
      "Full Chainmail Armor (Protection III)",
      "Speed II Potion × 4",
      "Strength II Potion × 4",
      "32x Cooked Beef",
      "Trident (Loyalty II)",
      "Night Vision Potion × 4"
    ]
  },
  {
    id: "kit_titan",
    name: "Titan Kit",
    price: 449,
    color: "#8B008B",
    glowColor: "#da70d6",
    cooldown: "Monthly",
    badge: "👑",
    items: [
      "Netherite Sword (Sharpness V, Fire Aspect II, Looting III)",
      "Netherite Pickaxe (Efficiency V, Fortune III, Unbreaking III)",
      "Full Netherite Armor (Protection IV, Unbreaking III)",
      "Netherite Axe (Sharpness V, Efficiency V)",
      "Enchanted Golden Apple × 16",
      "Totem of Undying × 4",
      "Elytra (Unbreaking III, Mending)",
      "64x Firework Rockets",
      "God Bow (Power V, Flame, Punch II, Infinity)",
      "$5000 in-game currency"
    ]
  }
];
