import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient, Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { Database } from './types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_API_KEY,
);

export const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [page, setPage] = useState<
    Database['public']['Tables']['page']['Row'][]
  >([]);

  useEffect(() => {
    const fetchPagesData = async () => {
      if (session) {
        const { data } = await supabase.from('page').select('*');
        if (data) {
          setPage(data);
        }
      }
    };

    fetchPagesData();
  }, [session, page]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPagesData = async () => {
    const { data } = await supabase.from('page').select('*');
    if (data) {
      setPage(data);
    }
  };

  const createPost = async () => {
    const { data } = await supabase.from('page').insert([
      {
        title: prompt('Title?'),
        body: prompt('Body?'),
      },
    ]);

    if (data) {
      fetchPagesData();
    }
  };

  const deletePost = async (id: number) => {
    if (window.confirm('삭제하시겠습니까?')) {
      const { error } = await supabase.from('page').delete().eq('id', id);
      if (!error) {
        alert('게시물이 삭제되었습니다.');
        fetchPagesData();
      } else {
        alert('삭제 중 문제가 발생했습니다.');
      }
    }
  };

  if (!session)
    return (
      <section className="flex h-screen items-center justify-center">
        <div className="h-[32rem] w-[32rem]">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['github']}
          />
        </div>
      </section>
    );

  return (
    <div>
      <div>Logged in!</div>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      <div>
        {page.map((item) => (
          <div key={item.id}>
            <h1>{item.title}</h1>
            <p>{item.body}</p>
            <button onClick={() => deletePost(item.id)}>삭제</button>
          </div>
        ))}
      </div>
      <button onClick={createPost}>Create</button>
    </div>
  );
};
