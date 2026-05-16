import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import './ToolCard.css';

const categoryLabels = {
  youtube: 'YouTube',
  pdf: 'PDF',
  image: 'Image',
  convert: 'Convert',
  office: 'Office',
};

const categoryColors = {
  youtube: 'badge-red',
  pdf: 'badge-blue',
  image: 'badge-purple',
  convert: 'badge-green',
  office: 'badge-green',
};

export default function ToolCard({ tool, delay = 0 }) {
  const IconComponent = Icons[toPascalCase(tool.icon)] || Icons.FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      whileHover={{ y: -8 }}
    >
      <Link
        to={`/tools/${tool.id}`}
        title={`Use ${tool.name} tool`}
        className="tool-card"
        style={{ '--tool-color': tool.color }}
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
    </motion.div>
  );
}

function toPascalCase(str) {
  if (!str) return '';
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
