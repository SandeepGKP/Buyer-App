'use client'

import { useForm } from 'react-hook-form'
import { CreateBuyerInput } from '@/lib/zod'
import { useState } from 'react'
import Header from '@/components/Header'

const cities = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']
const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail']
const bhks = ['1', '2', '3', '4', 'Studio']
const purposes = ['Buy', 'Rent']
const timelines = ['0-3m', '3-6m', '>6m', 'Exploring']
const sources = ['Website', 'Referral', 'Walk-in', 'Call', 'Other']

export default function CreateBuyerPage() {
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<CreateBuyerInput>()

  const watchedPropertyType = watch('propertyType')

  const onSubmit = async (data: CreateBuyerInput) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (response.ok) {
        alert('Buyer created successfully!')
        // redirect or something
      } else {
        alert('Error: ' + result.error)
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Buyer Lead</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">Full Name *</label>
          <input
            {...register('fullName')}
            id="fullName"
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter full name"
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            {...register('email', { setValueAs: value => value === '' ? undefined : value })}
            id="email"
            type="email"
            className="w-full p-2 border rounded"
            placeholder="Enter email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">Phone *</label>
          <input
            {...register('phone')}
            id="phone"
            type="tel"
            className="w-full p-2 border rounded"
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium">City *</label>
          <select {...register('city')} id="city" className="w-full p-2 border rounded">
            <option value="">Select city</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium">Property Type *</label>
          <select {...register('propertyType')} id="propertyType" className="w-full p-2 border rounded">
            <option value="">Select property type</option>
            {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          {errors.propertyType && <p className="text-red-500 text-sm">{errors.propertyType.message}</p>}
        </div>

        {/* BHK - conditional */}
        {(watchedPropertyType === 'Apartment' || watchedPropertyType === 'Villa') && (
          <div>
            <label htmlFor="bhk" className="block text-sm font-medium">BHK *</label>
            <select {...register('bhk')} id="bhk" className="w-full p-2 border rounded">
              <option value="">Select BHK</option>
              {bhks.map(bhk => <option key={bhk} value={bhk}>{bhk}</option>)}
            </select>
            {errors.bhk && <p className="text-red-500 text-sm">{errors.bhk.message}</p>}
          </div>
        )}

        {/* Purpose */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium">Purpose *</label>
          <select {...register('purpose')} id="purpose" className="w-full p-2 border rounded">
            <option value="">Select purpose</option>
            {purposes.map(purpose => <option key={purpose} value={purpose}>{purpose}</option>)}
          </select>
          {errors.purpose && <p className="text-red-500 text-sm">{errors.purpose.message}</p>}
        </div>

        {/* Budget Min */}
        <div>
          <label htmlFor="budgetMin" className="block text-sm font-medium">Budget Min (INR)</label>
          <input
            {...register('budgetMin', { setValueAs: value => value === '' ? undefined : Number(value) })}
            id="budgetMin"
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Minimum budget"
          />
          {errors.budgetMin && <p className="text-red-500 text-sm">{errors.budgetMin.message}</p>}
        </div>

        {/* Budget Max */}
        <div>
          <label htmlFor="budgetMax" className="block text-sm font-medium">Budget Max (INR)</label>
          <input
            {...register('budgetMax', { valueAsNumber: true })}
            id="budgetMax"
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Maximum budget"
          />
          {errors.budgetMax && <p className="text-red-500 text-sm">{errors.budgetMax.message}</p>}
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium">Timeline *</label>
          <select {...register('timeline')} id="timeline" className="w-full p-2 border rounded">
            <option value="">Select timeline</option>
            {timelines.map(timeline => <option key={timeline} value={timeline}>{timeline}</option>)}
          </select>
          {errors.timeline && <p className="text-red-500 text-sm">{errors.timeline.message}</p>}
        </div>

        {/* Source */}
        <div>
          <label htmlFor="source" className="block text-sm font-medium">Source *</label>
          <select {...register('source')} id="source" className="w-full p-2 border rounded">
            <option value="">Select source</option>
            {sources.map(source => <option key={source} value={source}>{source}</option>)}
          </select>
          {errors.source && <p className="text-red-500 text-sm">{errors.source.message}</p>}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
          <textarea
            {...register('notes')}
            id="notes"
            className="w-full p-2 border rounded"
            placeholder="Additional notes"
            rows={4}
            maxLength={1000}
          />
          {errors.notes && <p className="text-red-500 text-sm">{errors.notes.message}</p>}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium">Tags</label>
          <input
            {...register('tags')}
            id="tags"
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Type tags separated by comma (e.g. urgent, new, vip)"
          />
          {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
          {/* Tag chips display */}
          {watch('tags') && typeof watch('tags') === 'string' && (
            <div className="mt-2 flex flex-wrap gap-1">
              {String(watch('tags')).split(',').map((tag, index) => (
                tag.trim() && (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tag.trim()}
                  </span>
                )
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Lead'}
        </button>
      </form>
      </div>
    </>
  )
}
