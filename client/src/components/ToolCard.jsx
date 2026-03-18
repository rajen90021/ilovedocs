import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import './ToolCard.css';

const categoryLabels = {
  pdf: 'PDF',
  image: 'Image',
  convert: 'Convert',
  office: 'Office',
};

const categoryColors = {
  pdf: 'badge-red',
  image: 'badge-purple',
  convert: 'badge-blue',
  office: 'badge-green',
};

export default function ToolCard({ tool, delay = 0 }) {
  const IconComponent = Icons[toPascalCase(tool.icon)] || Icons.FileText;

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="tool-card animate-fade-up"
      style={{ animationDelay: `${delay}ms`, '--tool-color': tool.color }}
    >
      <div className="tool-card__icon-wrap">
        <IconComponent size={26} className="tool-card__icon" />
        <div className="tool-card__icon-glow" />
      </div>
      <div className="tool-card__content">
        <div className="tool-card__header">
          <h3 className="tool-card__name">{tool.name}</h3>
          <span className={`badge ${categoryColors[tool.category] || 'badge-purple'}`}>
            {categoryLabels[tool.category] || tool.category}
          </span>
        </div>
        <p className="tool-card__description">{tool.description}</p>
      </div>
      <div className="tool-card__arrow">→</div>
    </Link>
  );
}

function toPascalCase(str) {
  if (!str) return '';
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
