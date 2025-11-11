import { Calendar, Target, TrendingUp, Activity, Edit2, Trash2 } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/format';
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/roles';

export const ObjectiveCard = ({
  objective,
  onClick,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  className = '',
}) => {
  const statusColor = STATUS_COLORS[objective.status] || STATUS_COLORS.NOT_STARTED;
  
  const handleClick = (e) => {
    // Don't trigger onClick if clicking action buttons
    if (e.target.closest('button')) return;
    if (onClick) onClick(objective);
  };
  
  return (
    <Card
      className={`group relative cursor-pointer overflow-hidden transition-transform duration-500 hover:-translate-y-1 hover:border-primary-300/60 dark:hover:border-primary-500/40 hover:shadow-glow ${className}`}
      onClick={handleClick}
    >
      <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-gradient-brand/30 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardBody className="relative space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand/25 dark:bg-gradient-brand/30 text-primary-600 dark:text-primary-400 shadow-inner animate-scale-in">
              <Activity size={20} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {objective.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {objective.description || 'No description provided'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${statusColor} shadow-sm`}>{STATUS_LABELS[objective.status]}</Badge>
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(objective);
                }}
              >
                <Edit2 size={16} />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(objective.id);
                }}
              >
                <Trash2 size={16} className="text-red-600" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-gray-400">
            <span>Progress</span>
            <span className="font-medium text-gray-500">{Math.round(objective.progress)}%</span>
          </div>
          <Progress value={objective.progress} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 dark:bg-slate-700/70 text-primary-500 dark:text-primary-400 shadow-sm">
              <Calendar size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400">Timeline</p>
              <p className="font-medium text-gray-700 dark:text-gray-200">
                {formatDate(objective.startDate)} - {formatDate(objective.endDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 dark:bg-slate-700/70 text-emerald-500 dark:text-emerald-400 shadow-sm">
              <TrendingUp size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400">Updates</p>
              <p className="font-medium text-gray-700 dark:text-gray-200">{objective._count?.updates || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-primary-500" />
            <span>{objective.keyResults?.length || 0} Key Results</span>
          </div>
          {objective.owner && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-gray-500 dark:text-gray-300">
                Owner · {objective.owner.name}
              </span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
