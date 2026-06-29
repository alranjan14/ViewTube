import { useGoogleLogin } from '@react-oauth/google';
import { CircleUser } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login } from '@/app/slices/authSlice';
import { config } from '@/shared/config/env';
import { logger } from '@/shared/lib/logger';
import { useToast } from '@/shared/ui/Toast';

const BUTTON_CLASS =
  'flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium shadow-sm shadow-blue-600/20';

const ButtonShell = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className={BUTTON_CLASS}>
    <CircleUser size={18} />
    <span className="text-sm hidden sm:block">Sign in</span>
  </button>
);

/** Real Google login. Only mounted when a client ID is configured, so the
 *  `useGoogleLogin` hook always has its `GoogleOAuthProvider` context. */
const GoogleSignInButton = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      void (async () => {
        try {
          const res = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            }
          );
          const userInfo = (await res.json()) as {
            name?: string;
            email?: string;
            picture?: string;
          };
          if (userInfo.name && userInfo.email && userInfo.picture) {
            dispatch(
              login({
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
              })
            );
          } else {
            toast.error('Login failed. Please try again.');
          }
        } catch (error) {
          logger.error('Failed to fetch user info', { error });
          toast.error('Login failed. Please try again.');
        }
      })();
    },
    onError: (error) => logger.error('Login failed', { error }),
  });

  return <ButtonShell onClick={() => handleGoogleLogin()} />;
};

/** Fallback when no `VITE_GOOGLE_CLIENT_ID` is configured (mock/demo mode):
 *  the app stays fully usable; sign-in just explains it isn't available. */
const DisabledSignInButton = () => {
  const toast = useToast();
  return (
    <ButtonShell
      onClick={() =>
        toast.error('Google sign-in is not configured in this environment.')
      }
    />
  );
};

/**
 * Whether real Google login is wired is a build-time decision, kept in lockstep
 * with whether `App` mounts `GoogleOAuthProvider` — so `useGoogleLogin` is only
 * ever called when its provider is present.
 */
export const SignInButton = config.googleClientId
  ? GoogleSignInButton
  : DisabledSignInButton;
