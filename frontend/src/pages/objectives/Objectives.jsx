import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Target } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { ObjectiveCard } from '../../features/objectives/ObjectiveCard';
import { ObjectiveForm } from '../../features/objectives/ObjectiveForm';
import { Spinner } from '../../components/ui/Spinner';
import { Select } from '../../components/ui/Select';
import { objectiveService } from '../../features/objectives/objective.service';
import { teamService } from '../../features/teams/team.service';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../hooks/useAuth';

export const Objectives = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, hasRole } = useAuth();
  const userId = user?.id;
  const [objectives, setObjectives] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const [viewMode, setViewMode] = useState('team');
  const [selectedTeamId, setSelectedTeamId] = useState('all');

  const fetchObjectives = useCallback(async () => {
    if (viewMode === 'personal' && !userId) {
      setObjectives([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const filters = {};

      if (viewMode === 'personal') {
        filters.ownerId = userId;
      } else if (selectedTeamId && selectedTeamId !== 'all') {
        filters.teamId = selectedTeamId;
      }

      const data = await objectiveService.getObjectives(filters);
      setObjectives(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load objectives:', error);
      toast.error('Failed to load objectives');
      setObjectives([]);
    } finally {
      setLoading(false);
    }
  }, [viewMode, selectedTeamId, userId, toast]);

  const fetchTeams = useCallback(async () => {
    try {
      const data = await teamService.getTeams();
      setTeams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load teams:', error);
      toast.error('Failed to load teams');
      setTeams([]);
    }
  }, [toast]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  const isTeamView = viewMode === 'team' && selectedTeamId && selectedTeamId !== 'all';
  const canManageSelectedTeam = useMemo(() => {
    if (!isTeamView) return false;
    return hasRole(selectedTeamId, ['ADMIN', 'MEMBER']);
  }, [hasRole, isTeamView, selectedTeamId]);

  const canCreateObjective = () => {
    // Anyone can create personal objectives
    if (viewMode === 'personal') {
      return true;
    }

    // For team view, check if user has ADMIN or MEMBER role
    if (selectedTeamId === 'all') {
      return Array.isArray(user?.teams) && user.teams.some((team) => ['ADMIN', 'MEMBER'].includes(team.role));
    }

    // For specific team, only ADMIN and MEMBER can create
    return canManageSelectedTeam;
  };

  const handleCreateObjective = () => {
    if (!canCreateObjective()) {
      toast.error('You do not have permission to create objectives for this team.');
      return;
    }

    setEditingObjective(null);
    setIsModalOpen(true);
  };

  const handleEditObjective = (objective) => {
    const objectiveTeamId = objective.teamId;
    const canEdit = hasRole(objectiveTeamId, ['ADMIN', 'MEMBER']);

    if (!canEdit) {
      toast.error('You do not have permission to edit this objective.');
      return;
    }

    setEditingObjective(objective);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingObjective(null);
  };

  const handleSubmitObjective = async (formData) => {
    // If not personal, check if user has permission for team objectives
    if (!formData.isPersonal && formData.teamId && !hasRole(formData.teamId, ['ADMIN', 'MEMBER'])) {
      toast.error('You do not have permission to create team objectives. Try creating a personal objective instead.');
      return;
    }

    try {
      if (editingObjective) {
        await objectiveService.updateObjective(editingObjective.id, formData);
        toast.success('Objective updated successfully');
      } else {
        await objectiveService.createObjective(formData);
        toast.success('Objective created successfully');
      }
      handleCloseModal();
      fetchObjectives();
    } catch (error) {
      console.error('Failed to save objective:', error);
      
      // Only show toast for non-validation errors (let form handle validation errors)
      if (error.statusCode !== 400 || !error.validationErrors) {
        toast.error(editingObjective ? 'Failed to update objective' : 'Failed to create objective');
      }
      
      throw error; // Re-throw to let form handle loading state and validation errors
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this objective?')) {
      return;
    }

    try {
      const objective = objectives.find((obj) => obj.id === id);
      if (!objective || !hasRole(objective.teamId, ['ADMIN'])) {
        toast.error('You do not have permission to delete this objective.');
        return;
      }

      await objectiveService.deleteObjective(id);
      toast.success('Objective deleted successfully');
      fetchObjectives();
    } catch (error) {
      toast.error('Failed to delete objective');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Objectives
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage your OKRs and track progress
          </p>
        </div>
        <Button
          onClick={handleCreateObjective}
          className="flex items-center gap-2"
          disabled={!canCreateObjective()}
          title={!canCreateObjective() ? 'You need member or admin access to create objectives' : undefined}
        >
          <Plus size={20} />
          New Objective
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-slate-600 p-1 bg-white dark:bg-slate-800/80">
          <Button
            size="sm"
            variant={viewMode === 'personal' ? 'primary' : 'ghost'}
            className="rounded-md"
            onClick={() => setViewMode('personal')}
          >
            Personal
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'team' ? 'primary' : 'ghost'}
            className="rounded-md"
            onClick={() => setViewMode('team')}
          >
            Team
          </Button>
        </div>

        {viewMode === 'team' && teams.length > 0 && (
          <div className="min-w-[200px]">
            <Select
              label="Team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              options={[
                { value: 'all', label: 'All Teams' },
                ...teams.map((team) => ({ value: team.id, label: team.name })),
              ]}
            />
          </div>
        )}
      </div>

      {/* Objectives List */}
      {objectives.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No objectives yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Get started by creating your first objective
              </p>
              <Button onClick={handleCreateObjective} disabled={!canCreateObjective()}>
                Create Objective
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {objectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              objective={objective}
              onClick={() => navigate(`/objectives/${objective.id}`)}
              onEdit={() => handleEditObjective(objective)}
              onDelete={() => handleDelete(objective.id)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingObjective ? 'Edit Objective' : 'Create Objective'}
      >
        {teams.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You need to create a team first before creating objectives.
            </p>
            <Button onClick={() => window.location.href = '/teams'}>
              Go to Teams
            </Button>
          </div>
        ) : (
          <ObjectiveForm
            objective={editingObjective}
            teams={teams}
            onSubmit={handleSubmitObjective}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
};
