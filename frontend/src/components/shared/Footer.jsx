const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-lg font-bold">Brand</h3>
          <p>Some information about the company.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold">Quick Links</h3>
          <ul>
            <li>Free Course</li>
            <li>Live Workshop</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold">Contact Information</h3>
          <p>123 Street, City, Country</p>
          <p>Email: contact@example.com</p>
        </div>
        <div>
          <h3 className="text-lg font-bold">Company</h3>
          <ul>
            <li>About Us</li>
            <li>Refund Policy</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-6 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Brand. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
