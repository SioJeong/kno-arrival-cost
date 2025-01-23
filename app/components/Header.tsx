import Image from 'next/image';
import Logo from '../logo.webp';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="flex flex-row items-center p-4 px-8 gap-4 ">
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
