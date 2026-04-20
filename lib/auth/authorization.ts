export function canManageWorkspaceMembers(role: string | null | undefined) {
  return role === 'owner' || role === 'admin';
}
