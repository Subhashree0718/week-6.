import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Target, LineChart } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { AuthShell } from '../../components/ui/AuthShell';
import { authService } from '../../features/auth/services/auth.service';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const authData = await authService.login(formData);
      login(authData.user, authData.token, authData.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const sellingPoints = [
    {
      icon: ShieldCheck,
      title: 'Enterprise-grade security',
      description: 'Two-layer authentication, granular roles, and real-time monitoring out of the box.',
    },
    {
      icon: Target,
      title: 'Outcome-first alignment',
      description: 'Keep every initiative anchored to measurable objectives and shared milestones.',
    },
    {
      icon: LineChart,
      title: 'Predictive intelligence',
      description: 'Surface momentum insights, blockers, and confidential signals before they escalate.',
    },
  ];

  const impactStats = [
    { label: 'Objectives shipped', value: '2,430+', caption: 'Tracked across product, design, and GTM squads' },
    { label: 'Engagement uplift', value: '38%', caption: 'Average increase in update cadence within 6 weeks' },
  ];

  return (
    <AuthShell
      heading="Welcome back, leader"
      subheading="Access the Aurora control center to orchestrate OKRs, pulse-check confidence, and empower every team to deliver at pace."
      highlight="Trusted by high-velocity strategy and operations teams"
      bullets={sellingPoints}
      stats={impactStats}
      footer={
        <p className="text-center text-sm">
          New to Aurora?{' '}
          <Link to="/register" className="font-semibold text-primary-600 transition hover:text-primary-500">
            Create an account
          </Link>
        </p>
      }
      topAction={
        <>
          <span className="hidden text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 sm:inline">
            First time here?
          </span>
          <Link to="/register" className="font-semibold text-primary-600 transition hover:text-primary-500">
            Start free trial
          </Link>
        </>
      }
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
                Sign in
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Enter your credentials
              </h2>
            </div>
            <div className="hidden rounded-full border border-white/60 bg-white/80 px-4 py-1 text-xs font-medium text-gray-600 shadow-sm dark:border-white/10 dark:bg-slate-800/60 dark:text-gray-300 lg:flex">
              Secure Workspace
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            You&apos;re moments away from the intelligence your teams rely on daily.
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
            className="border border-red-200/70 bg-red-50/80 text-sm dark:border-red-500/20 dark:bg-red-500/10"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Work email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
            />

            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-primary-600 transition hover:text-primary-500"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button type="submit" className="w-full" loading={loading}>
              Sign in to dashboard
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By continuing you agree to Aurora&apos;s privacy policy and data processing standards.
            </p>
          </div>
        </form>
      </div>
    </AuthShell>
  );
};
