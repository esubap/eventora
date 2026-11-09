import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Copy, Check, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  eventUrl
}) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    toast.success('Event link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(`Check out ${eventTitle} on EVENTORA!`);
  const encodedUrl = encodeURIComponent(eventUrl);

  const shareLinks = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`,
      color: 'bg-emerald-600 hover:bg-emerald-500'
    },
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
      color: 'bg-sky-600 hover:bg-sky-500'
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
      color: 'bg-blue-600 hover:bg-blue-500'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-indigo-700 hover:bg-indigo-600'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share This Event" maxWidth="md">
      <div className="space-y-6">
        <p className="text-xs text-slate-400">
          Invite friends, colleagues, or your community to join you at this experience.
        </p>

        {/* Copy Link Input */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Event Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={eventUrl}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Social Platforms */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Share Directly
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {shareLinks.map(platform => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`py-2 px-3 rounded-xl text-xs font-medium text-white text-center transition-colors ${platform.color}`}
              >
                {platform.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
