import { signIn } from '../../../auth';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white/90">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Sign in to your account to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/10">
          
          <div className="space-y-6">
            <div>
              <form
                action={async () => {
                  'use server';
                  await signIn('github', { redirectTo: '/' });
                }}
              >
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <FaGithub className="mr-2 h-5 w-5" />
                  Continue with GitHub
                </button>
              </form>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400 backdrop-blur-sm">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <form
                  action={async () => {
                    'use server';
                    await signIn('google', { redirectTo: '/' });
                  }}
                >
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <FaGoogle className="mr-2 h-5 w-5 text-red-500" />
                    Continue with Google
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
