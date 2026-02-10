export interface IconValue {
  icon: string; // Format: "collection:name" (e.g., "mdi:home", "ph:user-bold")
  color?: string;
}

export interface IconCollection {
  prefix: string;
  name: string;
  total: number;
  author?: {
    name: string;
  };
  license?: {
    title: string;
  };
}

export interface BetterIconsInfo {
  prefix: string;
  total: number;
  title: string;
  category?: string;
  palette?: boolean;
  author?: {
    name: string;
  };
  license?: {
    title: string;
  };
}

// Popular icon collections available
export const POPULAR_COLLECTIONS = [
  { prefix: 'mdi', name: 'Material Design Icons', category: 'General' },
  { prefix: 'ph', name: 'Phosphor', category: 'General' },
  { prefix: 'tabler', name: 'Tabler Icons', category: 'General' },
  { prefix: 'lucide', name: 'Lucide', category: 'General' },
  { prefix: 'heroicons', name: 'Heroicons', category: 'General' },
  { prefix: 'carbon', name: 'Carbon', category: 'General' },
  { prefix: 'bi', name: 'Bootstrap Icons', category: 'General' },
  { prefix: 'ion', name: 'Ionicons', category: 'General' },
  { prefix: 'ri', name: 'Remix Icon', category: 'General' },
  { prefix: 'fa6-solid', name: 'Font Awesome Solid', category: 'General' },
  { prefix: 'fa6-regular', name: 'Font Awesome Regular', category: 'General' },
  { prefix: 'fa6-brands', name: 'Font Awesome Brands', category: 'Brands' },
  { prefix: 'simple-icons', name: 'Simple Icons (Brands)', category: 'Brands' },
  { prefix: 'logos', name: 'SVG Logos', category: 'Brands' },
  { prefix: 'skill-icons', name: 'Skill Icons', category: 'Tech' },
  { prefix: 'devicon', name: 'Devicon', category: 'Tech' },
  { prefix: 'vscode-icons', name: 'VSCode Icons', category: 'File Types' },
  { prefix: 'file-icons', name: 'File Icons', category: 'File Types' },
  { prefix: 'emojione', name: 'Emoji One', category: 'Emoji' },
  { prefix: 'noto', name: 'Noto Emoji', category: 'Emoji' },
  { prefix: 'twemoji', name: 'Twitter Emoji', category: 'Emoji' },
  { prefix: 'fluent-emoji', name: 'Fluent Emoji', category: 'Emoji' },
] as const;
