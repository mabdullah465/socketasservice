import React, { useEffect, useState } from "react";
import { PlusCircle as LinkIcon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Createprojectform from "./Createprojectform";
import { useAuth } from "@/ContextProvider/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function DashBoard() {
  const { isLoggedIn } = useAuth();

  // State for the list of projects
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/projects/all");
      const data = await response.json();
      if (response.ok) {
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects();
    }
  }, [isLoggedIn]);

  // State for the "Create" form
  const [newProject, setNewProject] = useState({
    name: "",
    base_url: "",
    authendpoint: "",
  });

  const [open, setOpen] = useState(false);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();

      if (response.ok) {
        // 4. Refresh the list from the database to ensure sync
        await fetchProjects();

        setOpen(false);
        setNewProject({ name: "", base_url: "", authendpoint: "" });
        alert(`Project Created! API Key: ${data.project.api_key}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Failed to connect to server");
    }

    // Reset form and close modal
    setNewProject({ name: "", base_url: "", authendpoint: "" });
    setOpen(false);
  };

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your API integrations and endpoints.
          </p>
        </div>
      </div>

      {/* create project form */}
      <Createprojectform
        open={open}
        setOpen={setOpen}
        handleCreateProject={handleCreateProject}
        newProject={newProject}
        setNewProject={setNewProject}
      />

      {/* Project List Table */}
      <div className="border rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Base URL</TableHead>
              <TableHead>Auth Endpoint</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No projects created yet.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <TableCell className="font-medium">
                    <Link
                      to={`/project/${project.id}`}
                      className="block w-full"
                    >
                      {project.name}
                    </Link>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      {project.base_url}
                    </span>
                  </TableCell>

                  <TableCell>
                    <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                      {project.authendpoint}
                    </code>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
