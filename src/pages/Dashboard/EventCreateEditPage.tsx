import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { storage } from '../../lib/storage';
import { EventCategory, TicketType, EventFormat } from '../../types';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

interface TicketTierDraft {
  name: string;
  price: number;
  currency: string;
  quantity: number;
  description: string;
  perks: string;
}

export const EventCreateEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const isEditMode = !!id;

  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80');
  const [eventType, setEventType] = useState<EventFormat>('physical');
  const [onlineUrl, setOnlineUrl] = useState('');
  const [venueName, setVenueName] = useState('Millennium Hall');
  const [city, setCity] = useState('Addis Ababa');
  const [address, setAddress] = useState('Bole Road, Addis Ababa, Ethiopia');
  const [startDate, setStartDate] = useState('2026-12-15');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('2026-12-16');
  const [endTime, setEndTime] = useState('18:00');
  const [capacity, setCapacity] = useState<number>(1000);
  const [terms, setTerms] = useState('Tickets are non-refundable after purchase. Government photo ID required at the gate.');

  // Ticket Tiers
  const [ticketTiers, setTicketTiers] = useState<TicketTierDraft[]>([
    {
      name: 'Regular General Pass',
      price: 500,
      currency: 'ETB',
      quantity: 500,
      description: 'Standard access to main hall and performances',
      perks: 'General Admission, Festival Wristband'
    },
    {
      name: 'VIP Front Row Experience',
      price: 2500,
      currency: 'ETB',
      quantity: 100,
      description: 'Exclusive front row seating with complimentary refreshments',
      perks: 'Front Row Seating, Welcome Drink, Express Entry'
    }
  ]);

  useEffect(() => {
    eventService.getCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id);
      }
    });

    if (isEditMode && id) {
      eventService.getEventById(id).then(found => {
        if (found) {
          setTitle(found.title);
          if (found.category_id) setCategoryId(found.category_id);
          setShortDescription(found.short_description || '');
          setDescription(found.description);
          setCoverImage(found.cover_image);
          setEventType(found.event_type);
          setOnlineUrl(found.online_url || '');
          setVenueName(found.venue_name || '');
          setCity(found.city || '');
          setAddress(found.address || '');
          setStartDate(found.start_date);
          setStartTime(found.start_time);
          if (found.end_date) setEndDate(found.end_date);
          if (found.end_time) setEndTime(found.end_time);
          setCapacity(found.capacity);
          setTerms(found.terms_and_conditions || '');

          if (found.ticket_types && found.ticket_types.length > 0) {
            setTicketTiers(
              found.ticket_types.map(t => ({
                name: t.name,
                price: t.price,
                currency: t.currency,
                quantity: t.quantity,
                description: t.description || '',
                perks: t.perks?.join(', ') || ''
              }))
            );
          }
        }
      });
    }
  }, [id, isEditMode]);

  const handleAddTicketTier = () => {
    setTicketTiers(prev => [
      ...prev,
      {
        name: 'Early Bird Pass',
        price: 300,
        currency: 'ETB',
        quantity: 100,
        description: 'Limited quantity discounted ticket',
        perks: 'Entry'
      }
    ]);
  };

  const handleRemoveTier = (index: number) => {
    if (ticketTiers.length === 1) {
      toast.warning('Event must have at least one ticket type.');
      return;
    }
    setTicketTiers(prev => prev.filter((_, i) => i !== index));
  };

  const handleTierChange = (index: number, field: keyof TicketTierDraft, value: any) => {
    setTicketTiers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to create an event.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.error('Please enter an event title and description.');
      return;
    }

    if (ticketTiers.length === 0) {
      toast.error('Please define at least one ticket tier.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedTiers = ticketTiers.map(t => ({
        name: t.name,
        price: Number(t.price),
        currency: t.currency,
        quantity: Number(t.quantity),
        remaining_quantity: Number(t.quantity),
        description: t.description,
        perks: t.perks.split(',').map(p => p.trim()).filter(Boolean)
      }));

      if (isEditMode && id) {
        await eventService.updateEvent(id, {
          title: title.trim(),
          category_id: categoryId,
          short_description: shortDescription.trim(),
          description: description.trim(),
          cover_image: coverImage.trim(),
          event_type: eventType,
          online_url: onlineUrl.trim(),
          venue_name: venueName.trim(),
          city: city.trim(),
          address: address.trim(),
          start_date: startDate,
          start_time: startTime,
          end_date: endDate,
          end_time: endTime,
          capacity: Number(capacity),
          terms_and_conditions: terms.trim()
        });
        toast.success('Event updated successfully!', 'Saved');
      } else {
        await eventService.createEvent(
          {
            organizer_id: user.id,
            category_id: categoryId,
            title: title.trim(),
            short_description: shortDescription.trim(),
            description: description.trim(),
            cover_image: coverImage.trim(),
            event_type: eventType,
            online_url: onlineUrl.trim(),
            venue_name: venueName.trim(),
            city: city.trim(),
            address: address.trim(),
            country: 'Ethiopia',
            start_date: startDate,
            start_time: startTime,
            end_date: endDate,
            end_time: endTime,
            capacity: Number(capacity),
            status: 'pending_approval',
            featured: false,
            trending: false,
            terms_and_conditions: terms.trim()
          },
          formattedTiers
        );
        toast.success('Event submitted for approval! Admins will review it shortly.', 'Event Created');
      }

      navigate('/dashboard/organizer');
    } catch (err: any) {
      toast.error(err.message || 'Error saving event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          to="/dashboard/organizer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizer Dashboard</span>
        </Link>
        <span className="text-xs text-purple-400 font-semibold">
          {isEditMode ? 'Edit Existing Event' : 'New Event Wizard'}
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          {isEditMode ? 'Edit Event Details' : 'Create & Publish an Event'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure dates, venues, ticket pricing matrix, and media assets.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. BASIC INFORMATION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white pb-2 border-b border-slate-800">
            1. Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Addis CyberSecurity Summit 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-semibold text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Format / Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="physical">Physical Venue Event</option>
                  <option value="online">Online / Virtual Stream</option>
                  <option value="hybrid">Hybrid (Both Venue & Stream)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Short Tagline
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief one-sentence pitch for event cards"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Detailed Event Description *
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe schedule, keynote speakers, topics covered, what attendees will experience..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Cover Image URL (Direct image link) *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              {coverImage && (
                <div className="mt-3 aspect-video max-w-xs rounded-xl overflow-hidden border border-slate-800">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. DATE, TIME & VENUE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white pb-2 border-b border-slate-800">
            2. Date, Time & Venue
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                required
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. Millennium Hall, Entoto Park..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Addis Ababa"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Bole Road, Next to Edna Mall, Addis Ababa"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Maximum Event Capacity *
              </label>
              <input
                type="number"
                min={1}
                required
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. TICKET TYPES & PRICING MATRIX */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">3. Ticket Types & Pricing Matrix</h2>
              <p className="text-xs text-slate-400">Add tiers such as Early Bird, Regular, VIP, or Free Passes</p>
            </div>
            <button
              type="button"
              onClick={handleAddTicketTier}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Ticket Tier</span>
            </button>
          </div>

          <div className="space-y-4">
            {ticketTiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Tier #{idx + 1}
                  </span>
                  {ticketTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove tier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Tier Name
                    </label>
                    <input
                      type="text"
                      required
                      value={tier.name}
                      onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                      placeholder="e.g. VIP Front Row"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Price (ETB, 0 for Free)
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={tier.price}
                      onChange={(e) => handleTierChange(idx, 'price', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Quantity Available
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={tier.quantity}
                      onChange={(e) => handleTierChange(idx, 'quantity', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Tier Perks (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tier.perks}
                      onChange={(e) => handleTierChange(idx, 'perks', e.target.value)}
                      placeholder="e.g. Backstage Pass, Free Cocktail, Priority Entry"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={tier.description}
                      onChange={(e) => handleTierChange(idx, 'description', e.target.value)}
                      placeholder="e.g. Open standing area"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. TERMS & CONDITIONS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white pb-2 border-b border-slate-800">
            4. Terms, Age Restrictions & Refund Rules
          </h2>

          <div>
            <textarea
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <Link
            to="/dashboard/organizer"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Saving Event...' : isEditMode ? 'Update Event' : 'Submit Event for Approval'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
