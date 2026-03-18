import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Copy, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Projectpage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showKey, setShowKey] = useState(false);

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      console.log(projectId);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/projects/${projectId}`,
      );
      const data = await res.json();
      console.log(data);
      data;
      setProjectData(data);
    } catch (err) {
      console.error("Failed to fetch project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(projectData.api_key);
    alert("API Key copied to clipboard!");
  };

  if (loading) return <div>Loading...</div>;
  if (!projectData) return <div>No data found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="gap-2 mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{projectData.name}</h1>
        <Badge variant="outline" className="text-xs">
          ID: {projectId}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* API Credentials Card */}
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-primary" />
              API Credentials
            </CardTitle>
            <CardDescription>
              Use this key to authenticate your requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Secret API Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showKey ? "text" : "password"}
                    value={projectData.api_key}
                    readOnly
                    className="font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Base URL
              </p>
              <p className="font-mono text-sm">{projectData.base_url}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Auth Path
              </p>
              <p className="font-mono text-sm">{projectData.authendpoint}</p>
            </div>
          </CardContent>
        </Card>

               <Card>
          <CardHeader>
            <CardTitle className="text-lg">Socket Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Socket URL
              </p>
              <p className="font-mono text-sm">{import.meta.env.VITE_BACKEND_URL}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Notificaion EndPoint
              </p>
              <p className="font-mono text-sm">/api/event/notification</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
