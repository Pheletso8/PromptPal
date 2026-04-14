import { useState, useRef } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import HomeNav from '../components/HomeNav';
import { Camera, Mail, User as UserIcon, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile({ name, email, profileImage });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <HomeNav />
      
      <main className="max-w-3xl mx-auto pt-32 px-6 pb-20">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center text-brand-text/50 hover:text-brand-primary transition-colors mb-8 group font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="relative group mb-12 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-brand-primary/20 bg-white flex items-center justify-center shadow-lg shadow-brand-primary/5">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 text-brand-text/20" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-brand-primary text-white rounded-full border-2 border-brand-bg hover:opacity-90 transition-all shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
            accept="image/*"
          />
          <h1 className="mt-6 text-3xl font-black tracking-tight text-brand-text">{user?.name}</h1>
          <p className="text-brand-text/40 mt-1 font-medium">Manage your account details and appearance</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-brand-primary/10 shadow-sm backdrop-blur-sm">
          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-bold ${
              message.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-brand-text/40 uppercase tracking-[0.2em] flex items-center ml-1">
              <UserIcon className="w-3.5 h-3.5 mr-2" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-brand-secondary/5 border border-brand-primary/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-primary/40 transition-all text-brand-text font-medium"
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-brand-text/40 uppercase tracking-[0.2em] flex items-center ml-1">
              <Mail className="w-3.5 h-3.5 mr-2" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-secondary/5 border border-brand-primary/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-primary/40 transition-all text-brand-text font-medium"
              placeholder="Your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase italic tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center space-x-2 mt-4"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ProfilePage;
