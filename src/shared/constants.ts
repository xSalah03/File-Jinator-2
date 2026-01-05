
export const EXTENSION_MAP: Record<string, string[]> = {
  'Documents': ['.pdf', '.docx', '.doc', '.txt', '.xlsx', '.pptx', '.csv', '.rtf', '.odt'],
  'Images': ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.tiff', '.raw'],
  'Videos': ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv'],
  'Audio': ['.mp3', '.wav', '.flac', '.m4a', '.aac', '.ogg'],
  'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz'],
  'Code': ['.js', '.ts', '.tsx', '.py', '.html', '.css', '.json', '.sh', '.cpp', '.java'],
  'Design': ['.psd', '.ai', '.fig', '.sketch', '.xd'],
  'Others': [] // Fallback category
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Documents': 'text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20',
  'Images': 'text-purple-400 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20',
  'Videos': 'text-rose-400 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20',
  'Audio': 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20',
  'Archives': 'text-orange-400 border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20',
  'Code': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20',
  'Design': 'text-pink-400 border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20',
  'Others': 'text-slate-400 border-slate-500/30 bg-slate-500/10 hover:bg-slate-500/20'
};

export const CATEGORY_DOT_COLORS: Record<string, string> = {
  'Documents': 'bg-blue-500',
  'Images': 'bg-purple-500',
  'Videos': 'bg-rose-500',
  'Audio': 'bg-emerald-500',
  'Archives': 'bg-orange-500',
  'Code': 'bg-cyan-500',
  'Design': 'bg-pink-500',
  'Others': 'bg-slate-500'
};
