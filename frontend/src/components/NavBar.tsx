'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <nav className="bg-primary text-black-200 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/hospitals" className="text-xl font-bold">
          Hospital Booking
        </Link>
        <div>
          <button
            onClick={handleLogout}
            className="bg-secondary px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}