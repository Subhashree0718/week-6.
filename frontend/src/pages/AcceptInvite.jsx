// import { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { teamService } from "../features/teams/team.service";
// import { Spinner } from "../components/ui/Spinner";
// import { Button } from "../components/ui/Button";
// import { useToast } from "../contexts/ToastContext";

// export const AcceptInvite = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const toast = useToast();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [accepted, setAccepted] = useState(false);
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");

//   const token = searchParams.get("token");

//   const handleAccept = async () => {
//     try {
//       if (!password || !name) {
//         toast.error("Please enter your name and password");
//         return;
//       }
//       setLoading(true);
//       await teamService.acceptInvitation({ token, name, password });
//       setAccepted(true);
//       toast.success("Invitation accepted successfully!");
//     } catch (error) {
//       console.error(error);
//       setError("Failed to accept invitation");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !accepted && !error) {
//     setTimeout(() => setLoading(false), 1000);
//   }

//   if (accepted) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-center">
//         <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Welcome!</h1>
//         <p className="mb-6 text-gray-600">
//           You’ve successfully joined the team. You can now log in and collaborate.
//         </p>
//         <Button onClick={() => navigate("/login")}>Go to Login</Button>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-center">
//         <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Oops!</h1>
//         <p className="mb-6 text-gray-600">{error}</p>
//         <Button onClick={() => navigate("/")}>Go Home</Button>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
//           Accept Team Invitation
//         </h1>
//         <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
//           Enter your details to join the team.
//         </p>
//         <input
//           type="text"
//           placeholder="Your name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full mb-3 p-2 border rounded"
//         />
//         <input
//           type="password"
//           placeholder="Create a password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-6 p-2 border rounded"
//         />
//         <Button className="w-full" onClick={handleAccept}>
//           Join Team
//         </Button>
//       </div>
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { teamService } from "../features/teams/team.service";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { useToast } from "../contexts/ToastContext";
import { storage } from "../utils/storage"; // ✅ add this import

export const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const token = searchParams.get("token");

  const handleAccept = async () => {
    if (!name || !password) {
      toast.error("Please enter your name and password");
      return;
    }

    try {
      setLoading(true);
      // ✅ receive tokens and user info
      const res = await teamService.acceptInvitation({ token, name, password });

      if (res?.token) {
        // ✅ Store the tokens locally
        storage.setToken(res.token);
        storage.setRefreshToken(res.refreshToken);
        storage.setUser(res.user);

        toast.success(`Welcome to your team, ${res.user.name || "User"}!`);
        navigate("/dashboard");
      } else {
        toast.error("Something went wrong. Please try logging in manually.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to accept invitation");
      toast.error("Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Oops!</h1>
        <p className="mb-6 text-gray-600">{error}</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800/90 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
          Accept Team Invitation
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Enter your details to join your team instantly.
        </p>

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
        />

        <Button className="w-full" onClick={handleAccept} disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Join Team"}
        </Button>
      </div>
    </div>
  );
};
