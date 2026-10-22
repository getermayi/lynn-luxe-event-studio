import {
  Armchair, Building2, Cake, Camera, ClipboardCheck, ConciergeBell, Crown, Flower2, Gem, Gift, Heart,
  Lightbulb, Music, PartyPopper, Sparkles, Speaker, Tent, UtensilsCrossed, type LucideProps,
} from "lucide-react";

const map = {
  Armchair, Building2, Cake, Camera, ClipboardCheck, ConciergeBell, Crown, Flower2, Gem, Gift, Heart,
  Lightbulb, Music, PartyPopper, Sparkles, Speaker, Tent, UtensilsCrossed,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = map[name as keyof typeof map] ?? Sparkles;
  return <C {...props} />;
}
