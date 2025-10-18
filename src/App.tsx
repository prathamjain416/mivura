import React, { useState } from 'react';
import { Mail, Instagram, Facebook, Twitter, Phone, MapPin } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const upstashUrl = import.meta.env.VITE_UPSTASH_REDIS_REST_URL;
      const upstashToken = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN;

      if (!upstashUrl || !upstashToken) {
        console.error('Missing Upstash credentials');
        setErrorMessage('Configuration error. Please try again later.');
        setTimeout(() => setErrorMessage(''), 3000);
        setIsLoading(false);
        return;
      }

      console.log('Checking email:', email);

      const checkResponse = await fetch(upstashUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['SISMEMBER', 'newsletter:emails', email]),
      });

      if (!checkResponse.ok) {
        const errorText = await checkResponse.text();
        console.error('Upstash check error:', checkResponse.status, errorText);
        throw new Error(`Failed to check email: ${checkResponse.status}`);
      }

      const checkData = await checkResponse.json();
      console.log('Check response:', checkData);

      if (checkData.result === 1) {
        setErrorMessage('Email already subscribed');
        setTimeout(() => setErrorMessage(''), 3000);
        setIsLoading(false);
        return;
      }

      console.log('Adding email to set');
      const addResponse = await fetch(upstashUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['SADD', 'newsletter:emails', email]),
      });

      if (!addResponse.ok) {
        const errorText = await addResponse.text();
        console.error('Upstash add error:', addResponse.status, errorText);
        throw new Error(`Failed to add email: ${addResponse.status}`);
      }

      const addData = await addResponse.json();
      console.log('Add response:', addData);

      const timestamp = new Date().toISOString();
      console.log('Saving email details');
      const detailsResponse = await fetch(upstashUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['HSET', `newsletter:email:${email}`, 'email', email, 'subscribedAt', timestamp]),
      });

      if (!detailsResponse.ok) {
        const errorText = await detailsResponse.text();
        console.error('Upstash details error:', detailsResponse.status, errorText);
      } else {
        const detailsData = await detailsResponse.json();
        console.log('Details response:', detailsData);
      }

      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error) {
      console.error('Error subscribing:', error);
      setErrorMessage('Failed to subscribe. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-[#faf8f5] to-[#f5f2ed] text-gray-900 relative overflow-hidden">
      {/* Subtle background image overlay */}
      <div
        className="absolute inset-0 opacity-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1927574/pexels-photo-1927574.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
        }}
      ></div>

      {/* Enhanced geometric patterns with more depth */}
      <div className="absolute inset-0 opacity-2">
        <div className="absolute top-32 right-20 w-96 h-96 border-2" style={{ borderColor: '#c2b7a5', transform: 'rotate(12deg)', borderRadius: '50%' }}></div>
        <div className="absolute bottom-40 left-16 w-64 h-64 border-2" style={{ borderColor: '#4f1615', opacity: 0.15, transform: 'rotate(45deg)' }}></div>
        <div className="absolute top-1/3 left-1/3 w-32 h-32 border-2" style={{ borderColor: '#c2b7a5', transform: 'rotate(12deg)', borderRadius: '50%' }}></div>

        {/* Additional luxury geometric elements */}
        <div className="absolute top-20 left-1/4 w-48 h-48 border" style={{ borderColor: '#c2b7a5', opacity: 0.3, transform: 'rotate(45deg)', borderRadius: '50%' }}></div>
        <div className="absolute bottom-32 right-1/3 w-40 h-40 border-2" style={{ borderColor: '#4f1615', opacity: 0.1, transform: 'rotate(12deg)' }}></div>
        <div className="absolute top-2/3 right-16 w-24 h-24 border" style={{ borderColor: '#c2b7a5', transform: 'rotate(45deg)', borderRadius: '50%' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 border" style={{ borderColor: '#c2b7a5', opacity: 0.25, transform: 'rotate(12deg)' }}></div>
        <div className="absolute top-1/2 left-12 w-20 h-20 border-2" style={{ borderColor: '#4f1615', opacity: 0.12, transform: 'rotate(45deg)', borderRadius: '50%' }}></div> 
        <div className="absolute bottom-16 right-1/4 w-36 h-36 border" style={{ borderColor: '#c2b7a5', opacity: 0.35, transform: 'rotate(12deg)' }}></div>

        {/* Subtle diamond-like shapes */}
        <div className="absolute top-1/4 right-1/2 w-16 h-16 border" style={{ borderColor: '#c2b7a5', opacity: 0.4, transform: 'rotate(45deg)' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-12 h-12 border-2" style={{ borderColor: '#4f1615', opacity: 0.15, transform: 'rotate(45deg)' }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-8 py-12 md:px-16 lg:px-24">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="text-3xl md:text-4xl font-serif tracking-[0.15em] font-medium" style={{ color: '#4f1615' }}>
              MIVURA
            </div>
            <div className="flex space-x-6">
              {/* <a href="tel:+1234567890" className="text-gray-600 hover:text-gray-900 transition-colors duration-500" aria-label="Call us">
                <Phone size={22} className="hover:scale-110 transition-transform duration-300" />
              </a> */}
              <a href="mailto:mivuraofficial@gmail.com" className="text-gray-600 hover:text-gray-900 transition-colors duration-500" aria-label="Email us">
                <Mail size={22} className="hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-8 md:px-16 lg:px-24 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="mb-24">
              <div className="mb-16">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 tracking-tight leading-[0.85] font-light">
                  <span className="block mb-4 font-medium" style={{ color: '#4f1615' }}>Luxury</span>
                  <span className="block italic font-normal mb-4 tracking-wide" style={{ color: '#c2b7a5' }}>for All</span>
                  <span className="block font-medium" style={{ color: '#4f1615' }}>Redefined</span>
                </h1>
              </div>
              
              <div className="w-32 h-px mx-auto mb-16" style={{ backgroundColor: '#c2b7a5' }}></div>
              
              <div className="space-y-12 mb-20">
                <p className="text-2xl md:text-3xl text-gray-700 font-light leading-relaxed max-w-4xl mx-auto tracking-wide line-height-[1.4]">
                  Lab-grown diamonds meet 925 sterling silver in jewelry that's affordable, ethical, and timelessly elegant
                </p>
                
                <div className="max-w-4xl mx-auto space-y-8">
                  <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed line-height-[1.6]">
                    Growing up in a family of natural diamond dealers, I witnessed the beauty of real diamonds—and their hefty price tags. That's when I envisioned creating a <em className="italic">mivura</em> (a way) to make luxury jewelry accessible to everyone.
                  </p>
                  
                  <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed line-height-[1.6]">
                    Our lab-grown diamonds offer the same brilliance and beauty as mined stones, but at a fraction of the cost. Combined with premium 925 sterling silver, each piece embodies luxury that's smart, ethical, and designed for everyday elegance.
                  </p>
                </div>
              </div>
              
              {/* Who We Design For Section */}
              <div className="mb-20">
                <div className="w-24 h-px bg-gray-300 mx-auto mb-12"></div>
                <h2 className="text-2xl md:text-3xl font-serif mb-12 font-light tracking-wide" style={{ color: '#4f1615' }}>
                  Designed for the Modern You
                </h2>
                <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f5f2ed', boxShadow: '0 4px 12px rgba(79, 22, 21, 0.08)' }}>
                      <div className="w-8 h-8 border-2 rounded-full" style={{ borderColor: '#c2b7a5' }}></div>
                    </div>
                    <h3 className="text-lg font-medium tracking-wide" style={{ color: '#4f1615' }}>The Everyday Dreamer</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Who wants to look elegant without overspending, believing that luxury should enhance your daily life.
                    </p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f5f2ed', boxShadow: '0 4px 12px rgba(79, 22, 21, 0.08)' }}>
                      <div className="w-8 h-8 border-2 rounded-full relative" style={{ borderColor: '#c2b7a5' }}>
                        <div className="w-4 h-4 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: '#c2b7a5' }}></div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium tracking-wide" style={{ color: '#4f1615' }}>The Trendsetter</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Who believes jewelry should be stylish, versatile, and wearable daily—not saved for special occasions.
                    </p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f5f2ed', boxShadow: '0 4px 12px rgba(79, 22, 21, 0.08)' }}>
                      <div className="w-8 h-8 border-2 rounded-full relative" style={{ borderColor: '#c2b7a5' }}>
                        <div className="w-2 h-2 rounded-full absolute top-2 left-2" style={{ backgroundColor: '#c2b7a5' }}></div>
                        <div className="w-2 h-2 rounded-full absolute bottom-2 right-2" style={{ backgroundColor: '#c2b7a5' }}></div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium tracking-wide" style={{ color: '#4f1615' }}>The Believer</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                      That luxury isn't about the price tag—it's about how beautiful jewelry makes you feel.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Subscription */}
            <div className="mb-24">
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="relative group mb-8">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-8 py-6 bg-white border-2 text-center text-lg font-light tracking-wide focus:outline-none transition-all duration-500"
                    style={{
                      borderColor: '#c2b7a5',
                      color: '#4f1615',
                      boxShadow: '0 2px 8px rgba(79, 22, 21, 0.06)'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 8px 24px rgba(79, 22, 21, 0.12)'}
                    onBlur={(e) => e.target.style.boxShadow = '0 2px 8px rgba(79, 22, 21, 0.06)'}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-12 py-4 text-white font-light tracking-[0.2em] uppercase text-sm transition-all duration-500 transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#4f1615',
                    boxShadow: '0 4px 16px rgba(79, 22, 21, 0.25)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = '#3a100f';
                      e.currentTarget.style.boxShadow = '0 8px 28px rgba(79, 22, 21, 0.35)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4f1615';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(79, 22, 21, 0.25)';
                  }}
                >
                  {isLoading ? 'Subscribing...' : 'Be the First to Know'}
                </button>
              </form>

              {isSubscribed && (
                <div className="mt-8 font-light text-lg animate-fadeIn" style={{ color: '#4f1615' }}>
                  Welcome to the Mivura family. Luxury awaits you.
                </div>
              )}

              {errorMessage && (
                <div className="mt-8 font-light text-lg animate-fadeIn" style={{ color: '#c2b7a5' }}>
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Coming Soon Message */}
            <div className="mb-20">
              <div className="space-y-6">
                <div className="inline-block px-12 py-4 border-2 tracking-[0.3em] uppercase text-sm font-light transition-all duration-500" style={{ borderColor: '#c2b7a5', color: '#4f1615', boxShadow: '0 2px 12px rgba(194, 183, 165, 0.2)' }}>
                  Coming Soon
                </div>
                {/* <p className="text-gray-500 text-base font-light tracking-wide">
                  Anticipated Launch: Spring 2025
                </p> */} 
                <p className="text-lg font-light italic max-w-2xl mx-auto leading-relaxed" style={{ color: '#c2b7a5' }}>
                  "From everyday essentials to statement pieces, we're crafting designs for those who want to look stylish every day and believe luxury should be smart, not overpriced."
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-16 md:px-16 lg:px-24 border-t" style={{ borderColor: '#c2b7a5', opacity: 0.3 }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-12 lg:space-y-0">
              {/* Social Media */}
              <div className="flex space-x-8">
                <a
                  href="https://www.instagram.com/mivura.official/"
                  className="transition-all duration-500 transform hover:scale-110 p-2 rounded-full"
                  style={{ color: '#4f1615' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f2ed';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(79, 22, 21, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="#"
                  className="transition-all duration-500 transform hover:scale-110 p-2 rounded-full"
                  style={{ color: '#4f1615' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f2ed';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(79, 22, 21, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="#"
                  className="transition-all duration-500 transform hover:scale-110 p-2 rounded-full"
                  style={{ color: '#4f1615' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f2ed';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(79, 22, 21, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </a>
              </div>

              {/* Contact Info */}
              <div className="text-center lg:text-right space-y-3">
                <div className="flex items-center justify-center lg:justify-end space-x-3 text-sm font-light tracking-wide font-[700]" style={{ color: '#4f1615' }}>
                  <Mail size={16} />
                  <span>mivuraofficial@gmail.com</span>
                </div>
                <div className="flex items-center justify-center lg:justify-end space-x-3 text-sm font-light tracking-wide font-[500]" style={{ color: '#4f1615' }}>
                  <MapPin size={16} />
                  <span>Crafted with Love • Delivered Worldwide</span>
                </div>
              </div>
            </div>
            
            <div className="mt-16 pt-8 border-t text-center text-sm font-light tracking-wide" style={{ borderColor: '#c2b7a5', opacity: 1 }}>
              <p style={{ color: '#4f1615' }}>&copy; 2025 Mivura. Where luxury meets accessibility.</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;