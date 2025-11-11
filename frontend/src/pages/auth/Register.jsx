import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { AuthShell } from '../../components/ui/AuthShell';
import { authService } from '../../features/auth/services/auth.service';
import { useAuth } from '../../hooks/useAuth';

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { confirmPassword, ...registerData } = formData;
      const authData = await authService.register(registerData);
      login(authData.user, authData.token, authData.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const pillars = [
    {
      icon: Building,
      title: 'Launch a company OS',
      description: 'Bring objectives, rituals, and operating cadence into a single command center.',
    },
    {
      icon: Sparkles,
      title: 'Empower every squad',
      description: 'Codify ownership, automate nudges, and keep outcomes visible for every member.',
    },
    {
      icon: ShieldCheck,
      title: 'Stay compliant & secure',
      description: 'Enterprise encryption, audit logs, and role governance by default.',
    },
  ];

  return (
    <AuthShell
      badge="Scale with Aurora"
      heading="Create your leadership workspace"
      subheading="Stand up a modern OKR operating system that infuses clarity, velocity, and measurable impact into your organisation."
      highlight="Join strategy, operations, and product leaders building high-trust execution loops"
      bullets={pillars}
      footer={
        <p className="text-center text-sm">
          Already onboarded?{' '}
          <Link to="/login" className="font-semibold text-primary-600 transition hover:text-primary-500">
            Return to login
          </Link>
        </p>
      }
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
            Start free
          </p>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Set up your organisation
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Well tailor your workspace around your teams, initiatives, and governance needs.
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Alex Morgan"
              required
            />
            <Input
              label="Work email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="alex@company.com"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Create a secure password"
              required
            />
            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Repeat password"
              required
            />
          </div>

          <div className="space-y-5">
            <Button type="submit" className="w-full" loading={loading}>
              Create my workspace
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By creating an account you agree to Auroras Terms of Service and Data Processing Agreement.
            </p>
          </div>
        </form>
      </div>
    </AuthShell>
  );
};
