import { AuthRedirectGuard } from './_components';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthRedirectGuard>{children}</AuthRedirectGuard>;
}
