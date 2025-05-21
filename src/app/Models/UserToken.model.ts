export interface UserToken {
  sub: string;       // ID/email
  name?: string;     // Nombre completo
  documentId?: string;
  roles: string[];   // Roles del usuario
  exp: number;       // Fecha expiración
}