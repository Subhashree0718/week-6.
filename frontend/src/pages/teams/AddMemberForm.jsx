// src/features/teams/AddMemberForm.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { teamService } from '../../features/teams/team.service';
import { useToast } from '../../contexts/ToastContext';
import { ArrowLeft, Mail, Shield } from "lucide-react";

export const AddMemberForm = () => {
  const { id } = useParams(); // team id
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      await teamService.addMember(id, { email, role });
      toast.success("Member added successfully");
      navigate(`/teams/${id}`); // go back to team details
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/teams/${id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Add Team Member
        </h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield size={18} />
            Member Details
          </h2>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="flex items-center gap-2 border p-2 rounded-md dark:border-gray-700">
                <Mail size={16} className="text-gray-500" />
                <input
                  type="email"
                  className="w-full bg-transparent outline-none"
                  placeholder="Enter member email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-md p-2 bg-transparent dark:border-gray-700"
              >
                <option value="ADMIN">Admin (Full Access)</option>
                <option value="MEMBER">Manager (Can create/update objectives)</option>
                <option value="VIEWER">Viewer (Read-only)</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
