'use client';

interface TipBadgeProps {
  title: string;
  description: string;
}

export default function TipBadge({ title, description }: TipBadgeProps) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-300 p-4 rounded-xl mb-4">
      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">{title}</p>
      <p className="mt-1 text-sm text-blue-700">{description}</p>
    </div>
  );
}
