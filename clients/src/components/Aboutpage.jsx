import { useState } from 'react';
import { UserIcon, BuildingIcon, GlobeIcon } from 'lucide-react';

export default function AboutPage() {
  const [careersUrl, setCareersUrl] = useState('https://company.com/careers'); // Update this URL

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
    

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">About Flashcard Learning Tool</h2>
            <p className="text-blue-900">
              Welcome to our Flashcard Learning Tool! Our platform is designed to make learning engaging 
              and effective by using flashcards to help you review and memorize key concepts. Whether you're 
              preparing for exams, learning a new subject, or just looking to test your knowledge, our tool 
              provides an interactive and user-friendly experience.
            </p>
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Features:</h3>
            <ul className="list-disc list-inside text-blue-900">
              <li><strong>Interactive Flashcards:</strong> Flip through a set of flashcards to review terms and definitions. Each card reveals a question or term on the front and an answer or definition on the back.</li>
              <li><strong>Navigation:</strong> Easily move through flashcards using "Next" and "Previous" buttons.</li>
              <li><strong>Admin Dashboard:</strong> Manage flashcards with ease. Admins can add new flashcards, edit existing ones, and delete those no longer needed.</li>
              <li><strong>Database Integration:</strong> Our tool uses MySQL to store and manage flashcards, ensuring that your data is organized and easily retrievable.</li>
            </ul>
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Our Mission:</h3>
            <p className="text-blue-900">
              We aim to create a seamless learning experience by integrating technology with education. Our 
              tool is designed to make studying more efficient and enjoyable, helping you to achieve your learning goals.
            </p>
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Our Team:</h3>
            <p className="text-blue-900">
              Our team is dedicated to providing high-quality educational tools and resources. We are passionate 
              about leveraging technology to enhance learning and support students in their educational journeys.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md p-6 rounded-lg">
              <div className="mb-4">
                <UserIcon className="w-8 h-8 text-blue-600" />
                <h3 className="text-blue-800 text-lg font-semibold">Our Team</h3>
              </div>
              <p className="text-blue-700">Dedicated professionals committed to excellence.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <div className="mb-4">
                <BuildingIcon className="w-8 h-8 text-blue-600" />
                <h3 className="text-blue-800 text-lg font-semibold">Our Mission</h3>
              </div>
              <p className="text-blue-700">To revolutionize technology and improve lives globally.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <div className="mb-4">
                <GlobeIcon className="w-8 h-8 text-blue-600" />
                <h3 className="text-blue-800 text-lg font-semibold">Our Reach</h3>
              </div>
              <p className="text-blue-700">Serving customers in over 100 countries worldwide.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Join Our Journey</h2>
            <p className="text-blue-900 mb-4">
              We're always looking for talented individuals to join our team. If you're passionate about 
              technology and want to make a difference, we'd love to hear from you.
            </p>
            <a
              href={careersUrl}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              View Careers
            </a>
          </section>
        </div>
      </main>

      
    </div>
  );
}
