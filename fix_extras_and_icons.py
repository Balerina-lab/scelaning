import re

with open('src/pages/Home.tsx', 'r') as f:
    home_content = f.read()

# Add icons to Home.tsx
home_content = home_content.replace(
    "import { Phone, Mail, MapPin, Clock, Star, Shield, Sparkles, ChevronDown, Menu, X, CheckCircle, AlertCircle, Lock, UploadCloud } from 'lucide-react';",
    "import { Phone, Mail, MapPin, Clock, Star, Shield, Sparkles, ChevronDown, Menu, X, CheckCircle, AlertCircle, Lock, UploadCloud, Monitor as OvenIcon, Refrigerator, Wind } from 'lucide-react';"
)

extras_replacement = """
const EXTRAS: { id: string; label: string; price: number; icon: any }[] = [
  { id: 'pecica', label: 'Notranjost pečice', price: 20, icon: OvenIcon },
  { id: 'hladilnik', label: 'Notranjost hladilnika', price: 15, icon: Refrigerator },
  { id: 'okna', label: 'Čiščenje oken', price: 30, icon: Wind },
];
"""

home_content = re.sub(
    r"const EXTRAS: { id: string; label: string; price: number }\[\] = \[.*?\];",
    extras_replacement.strip(),
    home_content,
    flags=re.DOTALL
)

home_content = home_content.replace(
    "<span className={`text-sm font-bold ${isSelected ? 'text-teal-700' : 'text-gray-600'}`}>",
    """<div className="flex items-center gap-2">
                    <extra.icon size={16} className={isSelected ? 'text-teal-500' : 'text-gray-400'} />
                    <span className={`text-sm font-bold ${isSelected ? 'text-teal-700' : 'text-gray-600'}`}>"""
)
home_content = home_content.replace(
    "</span>\n                  <span className={`text-xs font-black ${isSelected ? 'text-teal-600' : 'text-gray-400'}`}>",
    "</span>\n                  </div>\n                  <span className={`text-xs font-black ${isSelected ? 'text-teal-600' : 'text-gray-400'}`}>"
)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(home_content)

with open('src/pages/Admin.tsx', 'r') as f:
    admin_content = f.read()

# Map extras labels in Admin.tsx
admin_extras_mapping = """
                  {Array.isArray(booking.extras) && booking.extras.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(booking.extras as string[]).map((e: string) => {
                         const label = e === 'pecica' ? 'Notranjost pečice' : e === 'hladilnik' ? 'Notranjost hladilnika' : e === 'okna' ? 'Čiščenje oken' : e;
                         return <span key={e} className="bg-teal-50 text-teal-600 text-[10px] px-2 py-0.5 rounded-full">{label}</span>;
                      })}
                    </div>
                  )}
"""

admin_content = re.sub(
    r"\{Array\.isArray\(booking\.extras\) && booking\.extras\.length > 0 && \(\s*<div className=\"flex flex-wrap gap-1 mt-1\">\s*\{\(booking\.extras as string\[\]\)\.map\(\(e: string\) => \(\s*<span key=\{e\} className=\"bg-teal-50 text-teal-600 text-\[10px\] px-2 py-0\.5 rounded-full\">\{e\}</span>\s*\)\)\}\s*</div>\s*\)\}",
    admin_extras_mapping.strip(),
    admin_content,
    flags=re.DOTALL
)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(admin_content)
