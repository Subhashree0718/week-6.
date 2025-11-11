import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  Flame,
  Plus,
  Sparkles,
  Target,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { ObjectiveCard } from '../../features/objectives/ObjectiveCard';
import { ObjectiveForm } from '../../features/objectives/ObjectiveForm';
import { objectiveService } from '../../features/objectives/objective.service';
import { teamService } from '../../features/teams/team.service';
import { useAuth } from '../../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [objectives, setObjectives] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); 
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    avgProgress: 0,
  });
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const [objectivesData, teamsData] = await Promise.all([
        objectiveService.getObjectives(),
        teamService.getTeams(),
      ]);
      
      // Ensure data is always an array (http interceptor already extracts .data)
      const objectives = Array.isArray(objectivesData) ? objectivesData : [];
      const teams = Array.isArray(teamsData) ? teamsData : [];
      
      setObjectives(objectives);
      setTeams(teams);
      
      // Calculate stats
      const total = objectives.length;
      const inProgress = objectives.filter((obj) => obj.status === 'IN_PROGRESS').length;
      const completed = objectives.filter((obj) => obj.status === 'COMPLETED').length;
      const avgProgress = total > 0
        ? objectives.reduce((sum, obj) => sum + obj.progress, 0) / total
        : 0;
      
      setStats({ total, inProgress, completed, avgProgress });
    } catch (error) {
      console.error('Failed to load data:', error);
      setObjectives([]);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateObjective = async (data) => {
    try {
      await objectiveService.createObjective(data);
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to create objective:', error);
    }
  };
  
  const handleObjectiveClick = (objective) => {
    navigate(`/objectives/${objective.id}`);
  };

  const getFilteredObjectives = () => {
    switch (filter) {
      case 'in_progress':
        return objectives.filter((obj) => obj.status === 'IN_PROGRESS');
      case 'completed':
        return objectives.filter((obj) => obj.status === 'COMPLETED');
      case 'all':
      default:
        return objectives;
    }
  };

  const filteredObjectives = getFilteredObjectives();
  
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-sunrise/75 dark:bg-gradient-brand/10 p-10 text-slate-900 shadow-2xl dark:text-gray-100 animate-gradient-shift animation-duration-1400">
        <div className="absolute inset-0 opacity-70 dark:opacity-20 mix-blend-screen">
          <div className="absolute top-[-160px] left-[-120px] h-72 w-72 rounded-full bg-white/25 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-[-200px] right-[-140px] h-80 w-80 rounded-full bg-accent-500/35 blur-3xl animate-blob" />
          <div className="absolute top-1/2 left-[20%] h-32 w-32 rounded-full bg-white/40 blur-2xl animate-orb-slow" />
          <div className="absolute -right-24 top-12 h-48 w-48 rounded-full border border-white/30 animate-tilt" />
        </div>
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 perspective-1200">
          <div className="space-y-4 animate-fade-up animation-duration-1000">
            <h1 className="text-5xl font-bold leading-tight text-slate-900 dark:text-gray-100">
              Welcome back, <span className="text-primary-600 dark:text-primary-400">{user?.name}</span> 👋
            </h1>
            <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400">
              Track objectives and drive results.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setShowCreateModal(true)}>
                <Plus size={18} /> Create Objective
              </Button>
              <Button variant="secondary" size="lg" onClick={loadData} loading={loading}>
                <Activity size={18} /> Refresh
              </Button>
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-4 text-gray-900 dark:text-gray-100 animate-fade-up animation-delay-300">
            <div className="rounded-2xl bg-white/85 dark:bg-slate-800/85 p-6 shadow-xl backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Progress</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-bold">{Math.round(stats.avgProgress)}%</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/75 dark:bg-slate-800/80 p-6 shadow-xl backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Teams</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-bold">{teams.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-fade-up animation-delay-200">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-gray-100">
            Overview
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter('all')}
              className={
                filter === 'all'
                  ? 'bg-primary-500/15 text-primary-600 shadow-md dark:text-primary-300'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-primary-500/10'
              }
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter('in_progress')}
              className={
                filter === 'in_progress'
                  ? 'bg-primary-500/15 text-primary-600 shadow-md dark:text-primary-300'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-primary-500/10'
              }
            >
              In Progress
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter('completed')}
              className={
                filter === 'completed'
                  ? 'bg-primary-500/15 text-primary-600 shadow-md dark:text-primary-300'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-primary-500/10'
              }
            >
              Completed
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card
            className={`cursor-pointer border border-white/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-card hover-gradient-border animate-fade-up ${
              filter === 'all' ? 'ring-2 ring-accent-400 shadow-2xl' : 'animation-delay-200'
            }`}
            onClick={() => setFilter('all')}
          >
            <CardBody className="py-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 dark:text-primary-400">
                  <Target size={24} />
                </span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card
            className={`cursor-pointer border border-white/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-card hover-gradient-border animate-fade-up animation-delay-200 ${
              filter === 'in_progress' ? 'ring-2 ring-blue-400 shadow-2xl' : ''
            }`}
            onClick={() => setFilter('in_progress')}
          >
            <CardBody className="py-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500 dark:text-blue-400">
                  <TrendingUp size={24} />
                </span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.inProgress}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card
            className={`cursor-pointer border border-white/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-card hover-gradient-border animate-fade-up animation-delay-300 ${
              filter === 'completed' ? 'ring-2 ring-emerald-400 shadow-2xl' : ''
            }`}
            onClick={() => setFilter('completed')}
          >
            <CardBody className="py-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500 dark:text-emerald-400">
                  <Flame size={24} />
                </span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.completed}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border border-white/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-card hover-gradient-border animate-fade-up animation-delay-400">
            <CardBody className="py-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-500 dark:text-purple-400">
                  <Activity size={24} />
                </span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{Math.round(stats.avgProgress)}%</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Objectives
            {filteredObjectives.length > 0 && (
              <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
                ({filteredObjectives.length})
              </span>
            )}
          </h2>
          <Button variant="secondary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Create
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-64 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur animate-shimmer"></div>
            ))}
          </div>
        ) : filteredObjectives.length === 0 ? (
          <Card className="text-center py-16">
            <CardBody className="flex flex-col items-center justify-center space-y-4">
              <Target size={48} className="text-gray-400 dark:text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                No objectives found
              </h3>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus size={16} /> Create Objective
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredObjectives.map((objective, index) => (
              <ObjectiveCard
                key={objective.id}
                objective={objective}
                onClick={() => handleObjectiveClick(objective)}
                className={`animate-fade-up animation-delay-${(index % 4 + 1) * 100}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create Objective Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Objective"
        size="lg"
      >
        <ObjectiveForm
          teams={teams}
          onSubmit={handleCreateObjective}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};
