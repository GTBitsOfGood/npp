/**
 * Stripped-down version of User for sessions
 */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string;
  familyName: string;
  roles: string[];
  isAdmin: false;
}
