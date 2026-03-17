import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { PlusCircle } from 'lucide-react'
import { Label } from './ui/label'
import { Input } from './ui/input'

function Createprojectform({ open, setOpen, handleCreateProject, newProject, setNewProject }) {
  return (
    <>
    {/* Create Project Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateProject}>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>
                  Enter the API details for your new project integration.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="My SaaS App"
                    required
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="base_url">Base URL</Label>
                  <Input
                    id="base_url"
                    placeholder="https://api.example.com"
                    required
                    value={newProject.base_url}
                    onChange={(e) => setNewProject({...newProject, base_url: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="auth">Auth Endpoint</Label>
                  <Input
                    id="auth"
                    placeholder="/auth/login"
                    required
                    value={newProject.authendpoint}
                    onChange={(e) => setNewProject({...newProject, authendpoint: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </>
  )
}

export default Createprojectform