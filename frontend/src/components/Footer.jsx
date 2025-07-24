import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFacebook,
  faXTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons"

const Footer = () => {
  return (
    <footer className="bg-darkBlue text-aliceBlue py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-base sm:text-lg font-semibold mb-2">Follow us on</p>
        <div className="flex justify-center space-x-4 sm:space-x-6">
          <a className="hover:text-blue-500 transition-colors cursor-pointer p-1">
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>

          <a className="hover:text-blue-300 transition-colors cursor-pointer p-1">
            <FontAwesomeIcon icon={faXTwitter} size="lg" />
          </a>

          <a className="hover:text-pink-500 transition-colors cursor-pointer p-1">
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>

          <a className="hover:text-blue-700 transition-colors cursor-pointer p-1">
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
        </div>

        <p className="mt-3 sm:mt-4 text-xs sm:text-sm">
          © {new Date().getFullYear()} Rojgaar केन्द्र. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
