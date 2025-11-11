import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export const ObjectiveForm = ({ objective = null, teams = [], onSubmit, onCancel, userRole = 'VIEWER' }) => {
  const [formData, setFormData] = useState({
    title: objective?.title || '',
    description: objective?.description || '',
    startDate: objective?.startDate?.split('T')[0] || '',
    endDate: objective?.endDate?.split('T')[0] || '',
    teamId: objective?.teamId || teams[0]?.id || '',
    isPersonal: objective?.isPersonal || false,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }
    
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }
    
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.teamId) newErrors.teamId = 'Team is required';
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
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
    try {
      await onSubmit(formData);
    } catch (error) {
      // Map backend validation errors to form fields
      if (error.validationErrors && Array.isArray(error.validationErrors)) {
        const backendErrors = {};
        error.validationErrors.forEach(({ field, message }) => {
          backendErrors[field] = message;
        });
        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Enter objective title"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
            errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
          }`}
          placeholder="Enter objective description (optional, max 1000 characters)"
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      
      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <input
          type="checkbox"
          id="isPersonal"
          name="isPersonal"
          checked={formData.isPersonal}
          onChange={handleChange}
          className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
        />
        <label htmlFor="isPersonal" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Personal Objective (visible only to you)
        </label>
      </div>

      <Select
        label="Team"
        name="teamId"
        value={formData.teamId}
        onChange={handleChange}
        error={errors.teamId}
        options={teams.map((team) => ({ value: team.id, label: team.name }))}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          error={errors.startDate}
        />
        
        <Input
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {objective ? 'Update' : 'Create'} Objective
        </Button>
      </div>
    </form>
  );
};
