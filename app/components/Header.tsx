import Image from 'next/image';
import Logo from '../logo.webp';

export default function Header() {
    return (
        <header>
            <Image src={Logo} alt="K&O Int. Logo" height={46} priority />
        </header>
    );
}
