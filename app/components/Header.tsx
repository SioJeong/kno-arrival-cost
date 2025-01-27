import Image from 'next/image';
import Logo from '../logo.webp';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="flex items-center gap-4 px-4 py-2 md:px-8 md:py-4">
            <Link href="https://knoint.com/" target="_black">
                <Image src={Logo} alt="K&O Int. Logo" height={46} priority />
            </Link>
            <div>
                <h1 className="text-2xl font-extrabold">K&O INTERNATIONAL</h1>
                <p>Global NO.1 | Luxury Fashion Trading Company</p>
            </div>
        </header>
    );
}
