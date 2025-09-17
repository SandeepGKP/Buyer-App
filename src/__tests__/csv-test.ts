import { csvRowSchema } from '../lib/zod';

describe('CSV Row Validator', () => {
  test('valid row', () => {
    const row = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      city: 'Chandigarh',
      propertyType: 'Apartment',
      bhk: '2',
      purpose: 'Buy',
      budgetMin: '1000000',
      budgetMax: '1500000',
      timeline: '0-3m',
      source: 'Website',
      notes: 'Interested in new projects',
      tags: 'new,urgent',
      status: 'New',
    };

    const result = csvRowSchema.safeParse(row);
    expect(result.success).toBe(true);
  });

  test('invalid phone', () => {
    const row = {
      fullName: 'Jane Doe',
      email: '',
      phone: 'invalidphone',
      city: 'Chandigarh',
      propertyType: 'Villa',
      bhk: '2',
      purpose: 'Rent',
      budgetMin: '',
      budgetMax: '',
      timeline: '3-6m',
      source: 'Referral',
      notes: '',
      tags: '',
      status: '',
    };

    const result = csvRowSchema.safeParse(row);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(e => e.message.includes('Invalid phone format'))).toBe(true);
  });

  test('required fields missing', () => {
    const row = {
      fullName: '',
      email: '',
      phone: '1234567890',
      city: 'Mohali',
      propertyType: 'Apartment',
      bhk: '',
      purpose: 'Buy',
      budgetMin: '',
      budgetMax: '',
      timeline: 'Exploring',
      source: 'Other',
      notes: '',
      tags: '',
      status: '',
    };

    const result = csvRowSchema.safeParse(row);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(e => e.code === 'too_small')).toBe(true);
  });

  test('budget max less than min', () => {
    const row = {
      fullName: 'Test User',
      email: '',
      phone: '1234567890',
      city: 'Zirakpur',
      propertyType: 'Plot',
      bhk: '',
      purpose: 'Buy',
      budgetMin: '2000000',
      budgetMax: '1000000',
      timeline: 'Exploring',
      source: 'Website',
      notes: '',
      tags: '',
      status: '',
    };

    const result = csvRowSchema.safeParse(row);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(e => e.message.includes('Max budget must be > min budget'))).toBe(true);
  });

  test('bhk required for residential', () => {
    const row = {
      fullName: 'Residential User',
      email: '',
      phone: '1234567890',
      city: 'Panchkula',
      propertyType: 'Apartment',
      bhk: '',
      purpose: 'Buy',
      budgetMin: '',
      budgetMax: '',
      timeline: 'Exploring',
      source: 'Website',
      notes: '',
      tags: '',
      status: '',
    };

    const result = csvRowSchema.safeParse(row);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(e => e.message.includes('BHK required'))).toBe(true);
  });

  test('valid row without bhk for non-residential', () => {
    const row = {
      fullName: 'Office User',
      email: '',
      phone: '1234567890',
      city: 'Chandigarh',
      propertyType: 'Office',
      bhk: '',
      purpose: 'Rent',
      budgetMin: '',
      budgetMax: '',
      timeline: '0-3m',
      source: 'Call',
      notes: '',
      tags: '',
      status: '',
    };

    const result = csvRowSchema.safeParse(row);
    expect(result.success).toBe(true);
  });
});
