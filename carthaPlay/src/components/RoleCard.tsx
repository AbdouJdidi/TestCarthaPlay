import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface RoleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  onClick: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
  iconBg,
  iconColor,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-left w-full"
    >
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
      <div className="flex items-start space-x-4">
        <div className={`p-3 ${iconBg} rounded-lg`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className={`flex items-center text-primary font-medium`}>
            <span>Commencer</span>
            <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </button>
  );
};