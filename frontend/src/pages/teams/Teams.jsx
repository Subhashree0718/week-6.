// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Plus, Users as UsersIcon, Sparkles, ArrowUpRight } from 'lucide-react';
// import { Button } from '../../components/ui/Button';
// import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
// import { Badge } from '../../components/ui/Badge';
// import { Spinner } from '../../components/ui/Spinner';
// import { teamService } from '../../features/teams/team.service';
// import { useToast } from '../../contexts/ToastContext';
// import { ROLES } from '../../constants/roles';

// export const Teams = () => {
//   const navigate = useNavigate();
//   const toast = useToast();
//   const [teams, setTeams] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchTeams = async () => {
//     try {
//       setLoading(true);
//       const data = await teamService.getTeams();
//       // Ensure data is always an array
//       setTeams(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Failed to load teams:', error);
//       toast.error('Failed to load teams');
//       setTeams([]); // Reset to empty array on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeams();
//   }, []);

//   const handleCreateTeam = () => {
//     const teamName = prompt('Enter team name:');
//     if (!teamName) return;

//     const teamDescription = prompt('Enter team description (optional):');

//     createTeam({ name: teamName, description: teamDescription || '' });
//   };

//   const createTeam = async (teamData) => {
//     try {
//       await teamService.createTeam(teamData);
//       toast.success('Team created successfully');
//       fetchTeams();
//     } catch (error) {
//       toast.error('Failed to create team');
//     }
//   };

//   return (
//     <div className="space-y-10">
//       <div className="relative overflow-hidden rounded-3xl bg-gradient-brand/20 dark:bg-gradient-brand/10 p-8 shadow-glow">
//         <div className="absolute inset-0 opacity-40 dark:opacity-15">
//           <div className="absolute top-[-140px] left-[-120px] h-72 w-72 rounded-full bg-accent-400/40 blur-3xl animate-blob" />
//           <div className="absolute bottom-[-160px] right-[-140px] h-80 w-80 rounded-full bg-primary-400/30 blur-3xl animate-blob-delayed" />
//         </div>
//         <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
//           <div className="space-y-4">
//             <div className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-slate-800/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-gray-600 dark:text-gray-300">
//               <Sparkles size={14} /> Team Alignment
//             </div>
//             <div>
//               <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
//                 Teams
//               </h1>
//               <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
//                 Curate vibrant squads, invite collaborators, and keep everyone aligned on your key missions.
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-3">
//               <Button size="lg" onClick={handleCreateTeam}>
//                 <Plus size={18} /> Create Team
//               </Button>
//               <Button variant="secondary" size="lg" onClick={fetchTeams} loading={loading}>
//                 <ArrowUpRight size={18} /> Refresh
//               </Button>
//             </div>
//           </div>
//           <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 p-6 text-gray-800 dark:text-gray-200 shadow-lg backdrop-blur">
//             <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Active collaborations</p>
//             <div className="mt-3 flex items-end gap-2">
//               <span className="text-4xl font-bold">{teams.length}</span>
//               <span className="text-sm text-primary-600 dark:text-primary-400">teams forming impact</span>
//             </div>
//             <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
//               Each team is a hub for OKRs, members, and shared purpose.
//             </p>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
//           {Array.from({ length: 3 }).map((_, index) => (
//             <div key={index} className="h-64 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur animate-shimmer"></div>
//           ))}
//         </div>
//       ) : teams.length === 0 ? (
//         <Card className="border border-dashed border-white/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur">
//           <CardBody>
//             <div className="flex flex-col items-center gap-4 py-12 text-center">
//               <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/15 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400">
//                 <UsersIcon size={32} />
//               </div>
//               <div className="space-y-2">
//                 <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">No teams yet</h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Create your first team to spark collaboration across objectives.
//                 </p>
//               </div>
//               <div className="flex flex-wrap justify-center gap-3">
//                 <Button onClick={handleCreateTeam}>
//                   <Plus size={16} /> Create Team
//                 </Button>
//                 <Button variant="secondary" onClick={fetchTeams}>
//                   Refresh
//                 </Button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//           {teams.map((team) => (
//             <Card key={team.id} className="glass-surface border border-white/50 dark:border-slate-700/50">
//               <CardHeader>
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="space-y-1">
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
//                       {team.name}
//                     </h3>
//                     {team.description && (
//                       <p className="text-sm text-gray-500 dark:text-gray-300">
//                         {team.description}
//                       </p>
//                     )}
//                   </div>
//                   <Badge variant="primary" className="shadow-sm">
//                     {ROLES[team.memberships?.[0]?.role]?.label || 'Member'}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardBody className="space-y-5">
//                 <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
//                   <div className="rounded-xl bg-white/70 dark:bg-slate-700/70 p-4 shadow-inner">
//                     <p className="text-xs uppercase tracking-wider text-gray-400">Members</p>
//                     <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
//                       {team.memberships?.length || 0}
//                     </p>
//                   </div>
//                   <div className="rounded-xl bg-white/70 dark:bg-slate-700/70 p-4 shadow-inner">
//                     <p className="text-xs uppercase tracking-wider text-gray-400">Objectives</p>
//                     <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
//                       {team._count?.objectives || 0}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="rounded-xl border border-white/40 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 p-4 text-sm text-gray-500 dark:text-gray-300">
//                   Connect your squad to clear initiatives, share updates, and celebrate wins together.
//                 </div>
//               </CardBody>
//               <CardFooter>
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   className="w-full"
//                   onClick={() => navigate(`/teams/${team.id}`)}
//                 >
//                   View Team
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users as UsersIcon, Sparkles, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { teamService } from '../../features/teams/team.service';
import { useToast } from '../../contexts/ToastContext';
import { ROLES } from '../../constants/roles';

export const Teams = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeams();
      setTeams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load teams:', error);
      toast.error('Failed to load teams');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // ✅ Create Team then navigate to Add Member form
  const handleCreateTeam = async () => {
    const teamName = prompt('Enter team name:');
    if (!teamName) return;

    const teamDescription = prompt('Enter team description (optional):');

    try {
      const createdTeam = await teamService.createTeam({
        name: teamName,
        description: teamDescription || '',
      });

      toast.success('Team created successfully');

      // Instead of manual prompts, navigate to Add Member form
      const goToAddMembers = window.confirm(
        'Team created! Do you want to add members now?'
      );
      if (goToAddMembers) {
        navigate(`/teams/${createdTeam.id}/add-member`);
      } else {
        fetchTeams();
      }
    } catch (error) {
      console.error('Failed to create team:', error);
      toast.error('Failed to create team');
    }
  };

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand/20 dark:bg-gradient-brand/10 p-8 shadow-glow">
        <div className="absolute inset-0 opacity-40 dark:opacity-15">
          <div className="absolute top-[-140px] left-[-120px] h-72 w-72 rounded-full bg-accent-400/40 blur-3xl animate-blob" />
          <div className="absolute bottom-[-160px] right-[-140px] h-80 w-80 rounded-full bg-primary-400/30 blur-3xl animate-blob-delayed" />
        </div>

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-slate-800/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-gray-600 dark:text-gray-300">
              <Sparkles size={14} /> Team Alignment
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
                Teams
              </h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
                Curate vibrant squads, invite collaborators, and keep everyone aligned on your key missions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={handleCreateTeam}>
                <Plus size={18} /> Create Team
              </Button>
              <Button variant="secondary" size="lg" onClick={fetchTeams} loading={loading}>
                <ArrowUpRight size={18} /> Refresh
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 p-6 text-gray-800 dark:text-gray-200 shadow-lg backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Active collaborations</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-bold">{teams.length}</span>
              <span className="text-sm text-primary-600 dark:text-primary-400">teams forming impact</span>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Each team is a hub for OKRs, members, and shared purpose.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-64 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur animate-shimmer"></div>
          ))}
        </div>
      ) : teams.length === 0 ? (
        <Card className="border border-dashed border-white/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur">
          <CardBody>
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/15 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400">
                <UsersIcon size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">No teams yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your first team to spark collaboration across objectives.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={handleCreateTeam}>
                  <Plus size={16} /> Create Team
                </Button>
                <Button variant="secondary" onClick={fetchTeams}>
                  Refresh
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id} className="glass-surface border border-white/50 dark:border-slate-700/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {team.name}
                    </h3>
                    {team.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {team.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="primary" className="shadow-sm">
                    {ROLES[team.memberships?.[0]?.role]?.label || 'Member'}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody className="space-y-5">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="rounded-xl bg-white/70 dark:bg-slate-700/70 p-4 shadow-inner">
                    <p className="text-xs uppercase tracking-wider text-gray-400">Members</p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {team.memberships?.length || 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/70 dark:bg-slate-700/70 p-4 shadow-inner">
                    <p className="text-xs uppercase tracking-wider text-gray-400">Objectives</p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {team._count?.objectives || 0}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/40 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 p-4 text-sm text-gray-500 dark:text-gray-300">
                  Connect your squad to clear initiatives, share updates, and celebrate wins together.
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/teams/${team.id}`)}
                >
                  View Team
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
