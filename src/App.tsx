import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_API_KEY,
);

export const App = () => {
  return (
    <section className="flex h-screen items-center justify-center">
      <div className="h-[32rem] w-[32rem]">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
          }}
          providers={['github']}
        />
      </div>
    </section>
  );
};
