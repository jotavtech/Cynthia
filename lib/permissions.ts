export function canAccessAdmin(role: string | undefined) {
  return role === "ADMIN";
}
