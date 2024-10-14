import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full h-auto text-gray-500 p-3 bg-black/70">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0">
        <div className="flex items-center space-x-1 text-xs">
          <Link href="#" target="_blank" className="hover:text-gray-300">
            Feito por Syntax Dev
          </Link>
          <p>•</p>
          <Image
            src="https://media.licdn.com/dms/image/v2/D4D03AQEy5KpZzp4llA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1675892844366?e=1732147200&v=beta&t=8XGaIEm372B1CN2gmpN9feMSPlI0kGPuKRkiip6EO7A"
            alt="Luc foto"
            width={24}
            height={24}
            className="w-6 h-6 rounded-full"
          />
          <p>•</p>
          <p>Me siga no</p>
          <Link
            href="https://www.linkedin.com/in/lucsyntax/"
            target="_blank"
            className="hover:text-gray-300"
          >
            <FaLinkedin />
          </Link>
        </div>

        <div className="flex space-x-1 text-xs whitespace-nowrap">
          <Link href="/terms-of-use" className="hover:text-gray-300">
            Termos de uso •
          </Link>
          <Link href="/privacy-policy" className="hover:text-gray-300">
            Termos de privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
