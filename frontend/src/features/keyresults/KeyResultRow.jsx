import { useMemo, useState } from 'react';
import { Edit2, Trash2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';
import { calculateProgress } from '../../utils/calcProgress';

export const KeyResultRow = ({ keyResult, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(keyResult.current);
  const [showInsights, setShowInsights] = useState(false);

  const health = keyResult.health;

  const healthStyles = useMemo(
    () => ({
      on_track:
        'border border-green-200 bg-green-50 text-green-700 dark:border-green-800/60 dark:bg-green-900/40 dark:text-green-200',
      at_risk:
        'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-900/40 dark:text-amber-200',
      off_track:
        'border border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-900/40 dark:text-red-200',
    }),
    []
  );
  
  const progress = calculateProgress(keyResult.current, keyResult.target);
  
  const handleSave = async () => {
    await onUpdate(keyResult.id, { current: parseFloat(current) });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setCurrent(keyResult.current);
    setIsEditing(false);
  };
  
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
          {keyResult.title}
        </h4>

        {health && (
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                healthStyles[health.status] || 'border border-gray-200 bg-gray-100 text-gray-700'
              }`}
            >
              <span className="text-base">{health.emoji}</span>
              <span>{health.label}</span>
            </span>
            {health.reasons?.length ? (
              <Button
                type="button"
                size="xs"
                variant="ghost"
                onClick={() => setShowInsights((prev) => !prev)}
                className="flex items-center gap-1 text-sm"
              >
                {showInsights ? 'Hide insights' : 'View insights'}
                {showInsights ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            ) : null}
          </div>
        )}

        {showInsights && health?.reasons?.length ? (
          <ul className="mb-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
            {health.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex items-center gap-4">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                step="0.1"
                min="0"
              />
              <span className="text-gray-600 dark:text-gray-400">
                / {keyResult.target} {keyResult.unit}
              </span>
              <Button size="sm" variant="success" onClick={handleSave}>
                <Check size={16} />
              </Button>
              <Button size="sm" variant="secondary" onClick={handleCancel}>
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {keyResult.current} / {keyResult.target} {keyResult.unit}
              </span>
            </div>
          )}
          <div className="flex-1 max-w-xs">
            <Progress value={progress} showLabel={false} />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {!isEditing && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(keyResult.id)}
            >
              <Trash2 size={16} className="text-red-600" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
