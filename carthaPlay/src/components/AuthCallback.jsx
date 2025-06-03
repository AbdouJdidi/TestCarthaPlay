import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
useEffect(() => {
  const getUserData = async () => {
    const {
      data: { user, session },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      return;
    }

    const queryParams = new URLSearchParams(window.location.search);
    const roleFromQuery = queryParams.get('role');
    console.log("role from query:", roleFromQuery);

    // 🔎 Essaye de récupérer l'utilisateur existant (sans .single())
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .limit(1); // max 1 élément, mais pas d'erreur 406

    if (fetchError) {
      console.error("Erreur récupération user:", fetchError);
      return;
    }

    let userData = users?.[0];

    // 👇 Si on ne le trouve pas, on tente de l'insérer
    if (!userData) {
      const cleanUsername = user.email.split('@')[0];
      const cleanEmail = user.email.toLowerCase();

      const { data: inserted, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            username: cleanUsername,
            email: cleanEmail,
            role: roleFromQuery,
            auth_user_id: user.id,
          },
        ])
        .select()
        .single(); // safe ici

      if (insertError) {
        console.error("Erreur insertion user:", insertError);
        return;
      }

      userData = inserted;
    }

    // ✅ Connexion Redux
    dispatch(
      loginSuccess({
        user: {
          id: userData.id,
          role: userData.role,
          email: user.email,
        },
        token: session?.access_token || null,
      })
    );

    // ✅ Redirection
    if (userData.role === 'teacher') {
      navigate(`/teacher/dashboard/${userData.id}`);
    } else {
      navigate(`/student/dashboard/${userData.id}`);
    }
  };

  getUserData();
}, [dispatch, navigate]);

  return <div className="text-center mt-20 text-lg">Connexion en cours...</div>;
};

export default AuthCallback;
