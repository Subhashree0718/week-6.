import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Target, Plus, Mail, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { ObjectiveCard } from '../../features/objectives/ObjectiveCard';
import { teamService } from '../../features/teams/team.service';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../constants/roles';

export const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth(); // ✅ logged-in user info

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeamById(id);
      setTeam(data);
    } catch (error) {
      console.error('Failed to load team:', error);
      toast.error('Failed to load team');
      navigate('/teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  // ✅ find current user role inside this team
  const currentMembership = team?.memberships?.find(
    (m) => m.userId === user?.id
  );
  const currentRole = currentMembership?.role;

  const handleAddMember = async () => {
    if (currentRole !== 'ADMIN') {
      toast.error("You don't have permission to add members");
      return;
    }

    const email = prompt('Enter member email:');
    if (!email) return;

    const roleChoice = prompt(
      'Select role:\n1. Admin (Owner) - Full access\n2. Manager - Can create/update objectives\n3. Viewer - Read-only access\n\nEnter 1, 2, or 3:'
    );
    
    let role;
    switch (roleChoice) {
      case '1':
        role = 'ADMIN';
        break;
      case '2':
        role = 'MEMBER';
        break;
      case '3':
        role = 'VIEWER';
        break;
      default:
        toast.error('Invalid role selection');
        return;
    }

    try {
      await teamService.addMember(id, { email, role });
      toast.success('Member added successfully');
      fetchTeam();
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error('Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (currentRole !== 'ADMIN') {
      toast.error("You don't have permission to remove members");
      return;
    }

    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      await teamService.removeMember(id, userId);
      toast.success('Member removed successfully');
      fetchTeam();
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member');
    }
  };

  const handleObjectiveClick = (objective) => {
    navigate(`/objectives/${objective.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Team not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/teams')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {team.name}
            </h1>
            {team.description && (
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {team.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {team.memberships?.length || 0}
                </p>
              </div>
              <Users size={32} className="text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Objectives</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {team.objectives?.length || 0}
                </p>
              </div>
              <Target size={32} className="text-green-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {team.objectives && team.objectives.length > 0
                    ? Math.round(
                        team.objectives.reduce(
                          (sum, obj) => sum + obj.progress,
                          0
                        ) / team.objectives.length
                      )
                    : 0}
                  %
                </p>
              </div>
              <Target size={32} className="text-purple-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Members Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users size={20} />
              Team Members
            </h2>
            {currentRole === 'ADMIN' && (
              <Button
                size="sm"
                onClick={handleAddMember}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Member
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {team.memberships && team.memberships.length > 0 ? (
            <div className="space-y-3">
              {team.memberships.map((membership) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 dark:text-primary-300 font-semibold">
                        {membership.user.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {membership.user.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail size={14} />
                        {membership.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={membership.role === 'ADMIN' ? 'success' : 'primary'}
                      className="flex items-center gap-1"
                    >
                      <Shield size={14} />
                      {ROLE_LABELS[membership.role] || membership.role}
                    </Badge>
                    {currentRole === 'ADMIN' &&
                      membership.role !== 'ADMIN' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMember(membership.userId)}
                          className="text-red-600"
                        >
                          Remove
                        </Button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No members yet
            </div>
          )}
        </CardBody>
      </Card>

      {/* Objectives Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target size={20} />
              Team Objectives
            </h2>

            {(currentRole === 'ADMIN' || currentRole === 'MEMBER') ? (
              <Button
                size="sm"
                onClick={() => navigate('/objectives')}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Create Objective
              </Button>
            ) : (
              <Button
                size="sm"
                disabled
                title="You don't have permission to create objectives"
                className="opacity-60 cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={16} />
                Create Objective
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {team.objectives && team.objectives.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {team.objectives.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  onClick={handleObjectiveClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No objectives yet. Create one to start tracking progress!
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
