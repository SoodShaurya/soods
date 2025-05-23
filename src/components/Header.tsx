import Link from 'next/link';

const Header = () => (
  <header className="w-full py-4 px-8 bg-white shadow flex justify-between items-center">
    <div className="text-xl font-bold">My Portfolio</div>
    <nav className="space-x-6">
      <Link href="#home" className="hover:underline">Home</Link>
      <Link href="#about" className="hover:underline">About</Link>
      <Link href="#projects" className="hover:underline">Projects</Link>
      <Link href="#contact" className="hover:underline">Contact</Link>
    </nav>
  </header>
);

export default Header; 