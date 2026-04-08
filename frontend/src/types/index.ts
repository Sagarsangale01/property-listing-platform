/**
 * Core User Entity
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'agent' | 'seeker';
}

/**
 * Property Listing Entity
 */
export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  bhk: number;
  image_url: string;
  property_type: string;
  listing_type: string;
  construction_status: string;
  bathrooms: number;
  furnishing: string;
  area_sqft: number;
  agent_id: number;
  agent_name?: string;
  created_at: string;
}

/**
 * Enquiry / Lead Entity (including joined seeker data)
 */
export interface Enquiry {
  id: number;
  property_id: number;
  message: string;
  created_at: string;

  // Guest fields
  guest_first_name?: string;
  guest_last_name?: string;
  guest_email?: string;
  guest_phone?: string;

  // Seeker fields (from joined users table)
  seeker_id?: number | null;
  seeker_name?: string;
  seeker_email?: string;
  seeker_phone?: string;

  // Property context fields
  property_title?: string;
  property_location?: string;
  property_image?: string;
}

/**
 * Form / Request DTOs (Data Transfer Objects)
 */

export interface CreatePropertyDTO extends Omit<Property, 'id' | 'agent_id' | 'created_at'> { }

export interface UpdatePropertyDTO extends Partial<CreatePropertyDTO> { }

export interface SubmitEnquiryDTO {
  property_id: string | number;
  message: string;
  guest_first_name?: string;
  guest_last_name?: string;
  guest_email?: string;
  guest_phone?: string;
}

/**
 * API Response Interfaces
 */
export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalListings: number;
  totalEnquiries: number;
  activeLeads: number;
  totalValuation: number;
}

/**
 * Global Real-time Notification
 */
export interface Notification {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}
