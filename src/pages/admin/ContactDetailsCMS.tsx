import React, { useState, useEffect } from 'react';
import {
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { useContactSettings } from '../../hooks/useCMSContent.ts';
import { ContactSettingsDoc, ContactSubmissionDoc } from '../../types/cms.ts';
import { CloudinaryUploadWidget } from '../../components/admin/CloudinaryUploadWidget.tsx';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Trash2,
  CheckCheck,
  Calendar,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export const ContactDetailsCMS: React.FC = () => {
  const { data: initialSettings, reload } = useContactSettings();
  const [formData, setFormData] = useState<ContactSettingsDoc>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submissions Inbox
  const [submissions, setSubmissions] = useState<ContactSubmissionDoc[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  useEffect(() => {
    setFormData(initialSettings);
  }, [initialSettings]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: ContactSubmissionDoc[] = [];
          snapshot.forEach((snap) => {
            list.push({ id: snap.id, ...snap.data() } as ContactSubmissionDoc);
          });
          setSubmissions(list);
          setLoadingSubmissions(false);
        },
        (err) => {
          console.warn('Submissions listener note (collection might be empty):', err);
          setLoadingSubmissions(false);
        }
      );
    } catch {
      setLoadingSubmissions(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleChange = (field: keyof ContactSettingsDoc, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const timestamp = new Date().toISOString();
      await setDoc(doc(db, 'siteSettings', 'contact'), {
        ...formData,
        updatedAt: timestamp,
      }, { merge: true });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      reload();
    } catch (err: any) {
      console.error('Error saving contact settings:', err);
      setErrorMessage(err.message || 'Failed to update contact settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'new' | 'reviewed' | 'archived') => {
    try {
      await updateDoc(doc(db, 'contact_submissions', id), { status });
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('Delete this inquiry message permanently?')) return;
    try {
      await deleteDoc(doc(db, 'contact_submissions', id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5decb]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#a87932]">
            Communications &amp; Queries
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#111c2a]">
            Contact Details &amp; Inquiry Messages
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure official office channels, phone numbers, map preview, and review incoming contact messages.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Contact settings successfully updated and published!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Contact Settings Card */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e5decb] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#b8863b] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#111c2a]">Public Contact Channels</h3>
            <p className="text-[11px] text-slate-400">
              Displayed in the website contact section, footer, and appointment cards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              WhatsApp Contact Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              City &amp; Country
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.cityState}
                onChange={(e) => handleChange('cityState', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Office Hours
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.officeHours}
                onChange={(e) => handleChange('officeHours', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Maps Target URL
            </label>
            <input
              type="text"
              value={formData.mapsQueryUrl}
              onChange={(e) => handleChange('mapsQueryUrl', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Office Address Note
            </label>
            <input
              type="text"
              value={formData.addressNote}
              onChange={(e) => handleChange('addressNote', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <CloudinaryUploadWidget
              subfolder="home"
              label="Map Location Snapshot Image"
              currentImageUrl={formData.mapsPreviewImage}
              onImageUploaded={(url) => handleChange('mapsPreviewImage', url)}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b8863b] hover:bg-[#a0742f] text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Contact Settings'}</span>
          </button>
        </div>
      </form>

      {/* SECTION 2: SUBMISSIONS INBOX */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e5decb] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111c2a]">
                Contact Form Submissions Inbox ({submissions.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Messages received from visitors on the website contact form
              </p>
            </div>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No contact messages received yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Any message sent through the website contact form will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className={`p-4 rounded-xl border transition-all text-xs ${
                  sub.status === 'reviewed'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-[#e8ded0] shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111c2a]">
                      {sub.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#faf6ee] text-[#a87932] border border-[#eee2d1]">
                      {sub.purpose}
                    </span>
                    {sub.referenceId && (
                      <span className="font-mono text-[10px] text-slate-400">
                        Ref: {sub.referenceId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleString()
                        : 'Recent'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-700">Email: </span>
                    <a href={`mailto:${sub.email}`} className="text-blue-600 hover:underline">
                      {sub.email}
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Mobile: </span>
                    <a href={`tel:${sub.mobile}`} className="text-slate-800">
                      {sub.mobile}
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">State: </span>
                    <span>{sub.state || 'N/A'}</span>
                  </div>
                </div>

                <div className="bg-[#faf8f5] p-3 rounded-lg border border-[#eee4d5] text-slate-800 mb-3 whitespace-pre-wrap leading-relaxed">
                  {sub.message}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      sub.status === 'reviewed'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {sub.status === 'reviewed' ? 'Reviewed' : 'New Message'}
                  </span>

                  <div className="flex items-center gap-2">
                    {sub.status !== 'reviewed' && (
                      <button
                        onClick={() => handleUpdateStatus(sub.id, 'reviewed')}
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark as Reviewed</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSubmission(sub.id)}
                      className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
