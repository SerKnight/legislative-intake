"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Trash2, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Member {
  id: string
  role: string
  isActive: boolean
  joinedAt: Date
  user: {
    id: string
    name: string | null
    email: string
    role: string
  }
}

interface SessionMembersListProps {
  sessionId: string
  members: Member[]
  currentUserId: string
  isAdmin: boolean
}

const roleDescriptions: Record<string, string> = {
  VIEWER: "Can view session and bills",
  CONTRIBUTOR: "Can add bills and manage categories",
  MANAGER: "Can manage session settings and members",
  ADMIN: "Full access to all session features",
}

export function SessionMembersList({
  sessionId,
  members,
  currentUserId,
  isAdmin,
}: SessionMembersListProps) {
  const router = useRouter()
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("VIEWER")
  const [isInviting, setIsInviting] = useState(false)

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error("Failed to update role")
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating role:", error)
      alert("Failed to update member role")
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member from the session?")) {
      return
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}/members/${memberId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove member")
      }

      router.refresh()
    } catch (error) {
      console.error("Error removing member:", error)
      alert("Failed to remove member")
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail) {
      alert("Please enter an email address")
      return
    }

    setIsInviting(true)
    try {
      const response = await fetch(`/api/sessions/${sessionId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to invite member")
      }

      setInviteEmail("")
      setInviteRole("VIEWER")
      setIsInviteOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error inviting member:", error)
      alert(error instanceof Error ? error.message : "Failed to invite member")
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Session Members</CardTitle>
            <CardDescription>
              Manage who has access to this session and their permission levels. Members can be
              assigned different roles based on their responsibilities.
            </CardDescription>
          </div>
          {isAdmin && (
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Member to Session</DialogTitle>
                  <DialogDescription>
                    Invite a user to this session by their email address. They will receive access
                    based on the role you assign.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIEWER">Viewer</SelectItem>
                        <SelectItem value="CONTRIBUTOR">Contributor</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {roleDescriptions[inviteRole]}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInvite} disabled={isInviting}>
                      {isInviting ? "Inviting..." : "Send Invite"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.user.name || member.user.email}</p>
                    {member.user.id === currentUserId && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                    {member.isActive && (
                      <Badge variant="default" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Select
                    value={member.role}
                    onValueChange={(value) => handleRoleChange(member.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                      <SelectItem value="CONTRIBUTOR">Contributor</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline">{member.role}</Badge>
                )}
                {isAdmin && member.user.id !== currentUserId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

