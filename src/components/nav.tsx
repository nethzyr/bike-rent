import { useSession } from "next-auth/react";
import Link from "next/link";

const Nav = () => {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return <></>;
  }

  return (
    <nav className="flex gap-4 justify-center">
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/rentals">
        <a>My rentals</a>
      </Link>
      {session?.role === "MANAGER" && (
        <>
          <Link href="/admin/users">
            <a>Users</a>
          </Link>
          <Link href="/admin/rentals">
            <a>Rentals</a>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
