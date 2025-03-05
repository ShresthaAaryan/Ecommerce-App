import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-lg font-bold">E-Commerce</h1>
      <div>
        <Link href="/register" className="mr-4">Register</Link>
        <Link href="/login" className="mr-4">Login</Link>
        <Link href="/profile">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
