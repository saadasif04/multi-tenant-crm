// import { AuthCard } from '@/components/auth/auth-card';
// import { useAuth } from '@/context/auth-context';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';

// export default function LoginPage() {
//    const { user, loading } = useAuth();
//    const router = useRouter();

//    useEffect(() => {
//      if (!loading && user) {
//        router.replace('/customers');
//      }
//    }, [user, loading, router]);

//    if (loading) return null;
   
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
//       <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full top-[-100px] left-[-100px]" />
//       <div className="absolute w-[500px] h-[500px] bg-purple-500/10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

//       <AuthCard />
//     </div>
//   );
// }