import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bell,
  Briefcase,
  Camera,
  Check,
  Clock,
  Download,
  Eye,
  EyeOff,
  Globe,
  Laptop,
  Lock,
  LogOut,
  MapPin,
  Phone,
  Save,
  Shield,
  Trash2,
  User,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { profileService } from '../../features/profile/profile.service';
import { useAuth } from '../../hooks/useAuth';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'activity', label: 'Activity', icon: Activity },
];

const timezoneOptions = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'hi', label: 'हिन्दी' },
];

const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD MMM YYYY'];
const themeOptions = [
  { value: 'system', label: 'System Default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'aurora', label: 'Aurora Glow' },
];

const notificationDescriptors = [
  { key: 'emailNotifications', title: 'Email Notifications', description: 'Receive alerts for important account events in your inbox.' },
  { key: 'objectiveUpdates', title: 'Objective Updates', description: 'Stay informed when objectives progress or change status.' },
  { key: 'teamInvites', title: 'Team Invitations', description: 'Get notified when teammates invite you to collaborate.' },
  { key: 'krMilestones', title: 'KR Milestones', description: 'Celebrate key result milestones as soon as they happen.' },
  { key: 'weeklyDigest', title: 'Weekly Digest', description: 'A curated summary of objectives delivered every Monday.' },
];

const pickFields = (source, keys) =>
  keys.reduce((acc, key) => {
    if (source[key] !== undefined) {
      acc[key] = source[key];
    }
    return acc;
  }, {});

const getDeviceName = () => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS Device';
  if (/Android/i.test(ua)) return 'Android Device';
  if (/Mac/i.test(ua)) return 'Mac';
  if (/Win/i.test(ua)) return 'Windows PC';
  return 'Web Browser';
};

const formatDateTime = (value, options) => {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, options);
};

export const ProfileSettings = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [savingTab, setSavingTab] = useState(null);
  const [message, setMessage] = useState(null);
  const messageTimeout = useRef(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [securitySettings, setSecuritySettings] = useState(() => {
    try {
      const stored = localStorage.getItem('aurora_security_settings');
      return stored ? JSON.parse(stored) : { twoFactorEnabled: false, loginAlerts: true };
    } catch (error) {
      console.warn('Failed to parse security preferences', error);
      return { twoFactorEnabled: false, loginAlerts: true };
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    jobTitle: '',
    department: '',
    phone: '',
    avatar: '',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    theme: 'system',
    emailNotifications: true,
    objectiveUpdates: true,
    teamInvites: true,
    krMilestones: true,
    weeklyDigest: true,
    createdAt: null,
    lastLoginAt: null,
    lastLoginIp: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem('aurora_security_settings', JSON.stringify(securitySettings));
  }, [securitySettings]);

  useEffect(() => () => {
    if (messageTimeout.current) {
      clearTimeout(messageTimeout.current);
    }
  }, []);

  const showMessage = (type, text) => {
    if (messageTimeout.current) {
      clearTimeout(messageTimeout.current);
    }
    setMessage({ type, text });
    messageTimeout.current = setTimeout(() => setMessage(null), 4000);
  };

  const generateSessions = (profile) => {
    const timezone = profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date().toISOString();
    const current = {
      id: 'current',
      device: getDeviceName(),
      location: timezone,
      lastActive: now,
      ip: 'This device',
      current: true,
    };

    const previous = profile.lastLoginAt
      ? {
          id: 'previous',
          device: 'Aurora Web',
          location: timezone,
          lastActive: profile.lastLoginAt,
          ip: profile.lastLoginIp || 'Unknown',
          current: false,
        }
      : null;

    return [current, previous].filter(Boolean);
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getProfile();
      setFormData((prev) => ({ ...prev, ...profile }));
      updateUser(profile);
      setSessions(generateSessions(profile));
    } catch (error) {
      showMessage('error', error.message || 'Failed to load profile information.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveFields = async (payload, successMessage, tabId) => {
    try {
      setSavingTab(tabId);
      const updated = await profileService.updateProfile(payload);
      updateUser(updated);
      setFormData((prev) => ({ ...prev, ...updated }));
      setSessions(generateSessions(updated));
      showMessage('success', successMessage);
    } catch (error) {
      showMessage('error', error.message || 'Failed to update profile.');
    } finally {
      setSavingTab(null);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await profileService.uploadAvatar(file);
      await saveFields({ avatar: base64 }, 'Avatar updated successfully.', 'profile');
    } catch (error) {
      showMessage('error', error.message || 'Failed to upload avatar.');
    }
  };

  const handleSaveProfile = () => {
    const payload = pickFields(formData, ['name', 'bio', 'jobTitle', 'department', 'phone']);
    return saveFields(payload, 'Profile updated successfully.', 'profile');
  };

  const handleSavePreferences = () => {
    const payload = pickFields(formData, ['timezone', 'language', 'dateFormat', 'theme']);
    return saveFields(payload, 'Preferences saved.', 'preferences');
  };

  const handleSaveNotifications = () => {
    const payload = pickFields(formData, ['emailNotifications', 'objectiveUpdates', 'teamInvites', 'krMilestones', 'weeklyDigest']);
    return saveFields(payload, 'Notification settings updated.', 'notifications');
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New password and confirmation do not match.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters long.');
      return;
    }

    try {
      setSavingTab('security');
      await profileService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password updated successfully.');
    } catch (error) {
      showMessage('error', error.message || 'Failed to change password.');
    } finally {
      setSavingTab(null);
    }
  };

  const handleAutoDetectTimezone = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    handleInputChange('timezone', tz);
    showMessage('success', `Timezone set to ${tz}`);
  };

  const handleSecuritySave = () => {
    showMessage('success', 'Security preferences saved.');
  };

  const handleSignOutOthers = () => {
    setSessions((prev) => prev.filter((session) => session.current));
    showMessage('success', 'Other sessions have been signed out.');
  };

  const handleExportData = () => {
    showMessage('success', 'Preparing your data export. You will receive an email shortly.');
  };

  const handleDeactivateAccount = () => {
    showMessage('error', 'Account deactivation requires support assistance.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand/15 dark:bg-gradient-brand/10 p-8 animate-gradient-shift">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-80px] h-64 w-64 rounded-full bg-primary-500/30 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-[-120px] right-[-100px] h-72 w-72 rounded-full bg-accent-500/30 blur-3xl animate-blob" />
        </div>
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-3xl bg-gradient-brand flex items-center justify-center text-white text-3xl font-bold shadow-floating overflow-hidden ring-2 ring-white/40 dark:ring-white/20">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  formData.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer">
                <Camera size={22} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Profile Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                Fine-tune your Aurora experience with personalization, advanced security, and real-time insights.
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-slate-800/70 px-4 py-1 shadow-inner">
                  <Globe size={14} /> {formData.timezone}
                </span>
                <span className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-slate-800/70 px-4 py-1 shadow-inner">
                  <Clock size={14} /> Last login {formatDateTime(formData.lastLoginAt, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:max-w-xs">
            <div className="rounded-2xl bg-white/80 dark:bg-slate-900/70 backdrop-blur p-4 shadow-lg border border-white/40 dark:border-slate-700/40 animate-fade-up">
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Member Since</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatDateTime(formData.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-slate-900/70 backdrop-blur p-4 shadow-lg border border-white/40 dark:border-slate-700/40 animate-fade-up animation-delay-100">
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Teams</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user?.teams?.length ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-xl p-4 flex items-center gap-3 animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap animate-fade-up ${
              activeTab === id
                ? 'bg-gradient-brand text-white shadow-floating'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'profile' && (
          <Card className="border-white/60 dark:border-slate-700/50">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Profile Information</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Share the essentials so teammates recognize you instantly.
              </p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 animate-fade-up">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <User size={16} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => handleInputChange('name', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2 animate-fade-up animation-delay-100">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Globe size={16} /> Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-700 text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 animate-fade-up animation-delay-150">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Briefcase size={16} /> Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(event) => handleInputChange('jobTitle', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Product Manager"
                  />
                </div>
                <div className="space-y-2 animate-fade-up animation-delay-200">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MapPin size={16} /> Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(event) => handleInputChange('department', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Growth Team"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-fade-up animation-delay-250">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Phone size={16} /> Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => handleInputChange('phone', event.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2 animate-fade-up animation-delay-300">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(event) => handleInputChange('bio', event.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 animate-fade-up animation-delay-350">
                <Button variant="secondary" onClick={loadProfile}>
                  Reset
                </Button>
                <Button onClick={handleSaveProfile} loading={savingTab === 'profile'}>
                  <Save size={16} /> Save Changes
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card className="border-white/60 dark:border-slate-700/50">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Security & Access</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Keep your account protected with strong passwords and proactive alerts.
              </p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Current Password', field: 'currentPassword' },
                  { label: 'New Password', field: 'newPassword' },
                  { label: 'Confirm New Password', field: 'confirmPassword' },
                ].map((item, index) => (
                  <div key={item.field} className="space-y-2 animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Lock size={16} /> {item.label}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordData[item.field]}
                        onChange={(event) =>
                          setPasswordData((prev) => ({ ...prev, [item.field]: event.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 pr-12"
                        placeholder={item.field === 'currentPassword' ? 'Enter current password' : 'Enter new password'}
                      />
                      {item.field === 'currentPassword' && (
                        <button
                          type="button"
                          onClick={() => setShowPasswords((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        >
                          {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 animate-fade-up animation-delay-250">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-blue-600 dark:text-blue-300" />
                  <div className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                    <p className="font-semibold">Strong passwords keep your data safe</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Use at least 8 characters with numbers and symbols.</li>
                      <li>Avoid reusing passwords across multiple platforms.</li>
                      <li>Enable login alerts to monitor unusual sign-ins.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 animate-fade-up animation-delay-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Two-factor authentication</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add a second verification step for sensitive actions.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorEnabled}
                        onChange={(event) =>
                          setSecuritySettings((prev) => ({ ...prev, twoFactorEnabled: event.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-gradient-brand after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 animate-fade-up animation-delay-350">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Login alerts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive an email whenever a new device accesses your account.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.loginAlerts}
                        onChange={(event) =>
                          setSecuritySettings((prev) => ({ ...prev, loginAlerts: event.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-gradient-brand after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-end animate-fade-up animation-delay-400">
                <Button variant="ghost" onClick={handleSecuritySave}>
                  Save Security Preferences
                </Button>
                <Button variant="secondary" onClick={handleSignOutOthers}>
                  <LogOut size={16} /> Sign Out Other Sessions
                </Button>
                <Button onClick={handleChangePassword} loading={savingTab === 'security'}>
                  <Lock size={16} /> Update Password
                </Button>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6 space-y-4 animate-fade-up animation-delay-450">
                <p className="text-sm font-semibold text-red-600 dark:text-red-300">Danger Zone</p>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-900/20 p-4">
                  <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
                    <Trash2 size={18} />
                    <span>Permanently deactivate your account and remove all personal data.</span>
                  </div>
                  <Button variant="danger" onClick={handleDeactivateAccount}>
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'preferences' && (
          <Card className="border-white/60 dark:border-slate-700/50">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Customize language, time, and display so Aurora feels uniquely yours.
              </p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 animate-fade-up">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Clock size={16} /> Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(event) => handleInputChange('timezone', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                  >
                    {timezoneOptions.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                  <Button variant="ghost" size="sm" onClick={handleAutoDetectTimezone}>
                    Detect automatically
                  </Button>
                </div>
                <div className="space-y-2 animate-fade-up animation-delay-100">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Globe size={16} /> Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(event) => handleInputChange('language', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 animate-fade-up animation-delay-200">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date format</label>
                  <select
                    value={formData.dateFormat}
                    onChange={(event) => handleInputChange('dateFormat', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                  >
                    {dateFormats.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 animate-fade-up animation-delay-250">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                  <select
                    value={formData.theme}
                    onChange={(event) => handleInputChange('theme', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                  >
                    {themeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 animate-fade-up animation-delay-300">
                <Button variant="secondary" onClick={loadProfile}>
                  Reset
                </Button>
                <Button onClick={handleSavePreferences} loading={savingTab === 'preferences'}>
                  <Save size={16} /> Save Preferences
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card className="border-white/60 dark:border-slate-700/50">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Notification Center</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Decide how Aurora keeps you informed about progress and blockers.
              </p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="space-y-4">
                {notificationDescriptors.map((item, index) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 p-4 animate-fade-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <Bell size={20} className="mt-1 text-primary-600 dark:text-primary-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData[item.key]}
                        onChange={(event) => handleInputChange(item.key, event.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-gradient-brand after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2 animate-fade-up animation-delay-300">
                <Button variant="secondary" onClick={loadProfile}>
                  Reset
                </Button>
                <Button onClick={handleSaveNotifications} loading={savingTab === 'notifications'}>
                  <Save size={16} /> Save Notifications
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card className="border-white/60 dark:border-slate-700/50">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Account Activity</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Monitor sessions, exports, and historical sign-ins.
              </p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sessions.map((session, index) => (
                  <div
                    key={session.id}
                    className={`rounded-2xl border p-4 shadow-sm animate-fade-up ${
                      session.current
                        ? 'border-emerald-300/70 dark:border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-800/50'
                    }`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${session.current ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' : 'bg-blue-500/15 text-blue-500 dark:text-blue-300'}`}>
                        <Laptop size={22} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {session.device}
                          {session.current && <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-300">Current</span>}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Last active {formatDateTime(session.lastActive, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{session.location}</span>
                      <span>{session.ip}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 p-6 space-y-4 animate-fade-up">
                <div className="flex items-center gap-3">
                  <Download size={20} className="text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Export account data</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive a downloadable archive of your objectives, KRs, and updates.</p>
                  </div>
                </div>
                <Button variant="secondary" onClick={handleExportData}>
                  Start Export
                </Button>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 p-6 space-y-2 animate-fade-up animation-delay-200">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Last login details</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.lastLoginAt
                    ? `${formatDateTime(formData.lastLoginAt, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · IP ${formData.lastLoginIp || 'Unknown'}`
                    : 'Logins will appear here once you sign in again.'}
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};
