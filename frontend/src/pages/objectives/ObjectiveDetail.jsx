import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { AISummary } from '../../components/ui/AISummary';
import { KeyResultRow } from '../../features/keyresults/KeyResultRow';
import { objectiveService } from '../../features/objectives/objective.service';
import { keyResultService } from '../../features/keyresults/keyresult.service';
import { aiService } from '../../services/ai.service';
import { useToast } from '../../contexts/ToastContext';
import { formatDate } from '../../utils/format';
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/roles';

export const ObjectiveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [objective, setObjective] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showKRModal, setShowKRModal] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [krFormData, setKrFormData] = useState({
    title: '',
    target: '',
    current: 0,
    unit: '',
  });

  const fetchObjective = async () => {
    try {
      setLoading(true);
      const data = await objectiveService.getObjectiveById(id);
      setObjective(data);
    } catch (error) {
      console.error('Failed to load objective:', error);
      toast.error('Failed to load objective');
      navigate('/objectives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjective();
  }, [id]);

  const handleUpdateKeyResult = async (krId, updateData) => {
    try {
      await keyResultService.updateKeyResult(krId, updateData);
      toast.success('Key result updated successfully');
      fetchObjective(); // Refresh to get updated progress
    } catch (error) {
      console.error('Failed to update key result:', error);
      toast.error('Failed to update key result');
    }
  };

  const handleDeleteKeyResult = async (krId) => {
    if (!window.confirm('Are you sure you want to delete this key result?')) {
      return;
    }
    
    try {
      await keyResultService.deleteKeyResult(krId);
      toast.success('Key result deleted successfully');
      fetchObjective();
    } catch (error) {
      console.error('Failed to delete key result:', error);
      toast.error('Failed to delete key result');
    }
  };

  const handleCreateKeyResult = async (e) => {
    e.preventDefault();
    
    try {
      await keyResultService.createKeyResult(id, {
        ...krFormData,
        target: parseFloat(krFormData.target),
        current: parseFloat(krFormData.current),
      });
      toast.success('Key result created successfully');
      setShowKRModal(false);
      setKrFormData({ title: '', target: '', current: 0, unit: '' });
      fetchObjective();
    } catch (error) {
      console.error('Failed to create key result:', error);
      toast.error('Failed to create key result');
    }
  };

  const handleDeleteObjective = async () => {
    if (!window.confirm('Are you sure you want to delete this objective?')) {
      return;
    }
    
    try {
      await objectiveService.deleteObjective(id);
      toast.success('Objective deleted successfully');
      navigate('/objectives');
    } catch (error) {
      console.error('Failed to delete objective:', error);
      toast.error('Failed to delete objective');
    }
  };

  const handleGenerateAISummary = async () => {
    try {
      setAiLoading(true);
      setAiError(null);
      const response = await aiService.generateObjectiveSummary(id);
      setAiSummary(response.summary);
      toast.success('AI summary generated successfully');
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
      setAiError(error.message || 'Failed to generate summary. Please try again.');
      toast.error('Failed to generate AI summary');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!objective) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Objective not found</p>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[objective.status] || STATUS_COLORS.NOT_STARTED;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/objectives')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {objective.title}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {formatDate(objective.startDate)} - {formatDate(objective.endDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColor}>
            {STATUS_LABELS[objective.status]}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/objectives/${id}/edit`)}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteObjective}
          >
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      </div>

      {/* Description */}
      {objective.description && (
        <Card>
          <CardBody>
            <p className="text-gray-700 dark:text-gray-300">{objective.description}</p>
          </CardBody>
        </Card>
      )}

      {/* Progress */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Overall Progress</h2>
        </CardHeader>
        <CardBody>
          <Progress value={objective.progress} size="lg" />
        </CardBody>
      </Card>

      {/* AI Summary */}
      <AISummary
        summary={aiSummary}
        loading={aiLoading}
        error={aiError}
        onGenerate={handleGenerateAISummary}
      />

      {/* Key Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Key Results</h2>
            <Button
              size="sm"
              onClick={() => setShowKRModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Key Result
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {objective.keyResults && objective.keyResults.length > 0 ? (
            <div className="space-y-3">
              {objective.keyResults.map((kr) => (
                <KeyResultRow
                  key={kr.id}
                  keyResult={kr}
                  onUpdate={handleUpdateKeyResult}
                  onDelete={handleDeleteKeyResult}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No key results yet. Add your first key result to track progress.
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create Key Result Modal */}
      <Modal
        isOpen={showKRModal}
        onClose={() => setShowKRModal(false)}
        title="Add Key Result"
      >
        <form onSubmit={handleCreateKeyResult} className="space-y-4">
          <Input
            label="Title"
            value={krFormData.title}
            onChange={(e) => setKrFormData({ ...krFormData, title: e.target.value })}
            required
            placeholder="e.g., Increase user sign-ups"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target"
              type="number"
              value={krFormData.target}
              onChange={(e) => setKrFormData({ ...krFormData, target: e.target.value })}
              required
              step="0.1"
              placeholder="100"
            />
            <Input
              label="Current"
              type="number"
              value={krFormData.current}
              onChange={(e) => setKrFormData({ ...krFormData, current: e.target.value })}
              required
              step="0.1"
              placeholder="0"
            />
          </div>
          
          <Input
            label="Unit"
            value={krFormData.unit}
            onChange={(e) => setKrFormData({ ...krFormData, unit: e.target.value })}
            required
            placeholder="e.g., users, %, items"
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowKRModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Key Result
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
