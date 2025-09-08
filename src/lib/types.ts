export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  status: 'approved' | 'pending' | 'disapproved';
  registrationDate: string;
  approvedAt?: string; // Date when admin approved the account
  gallery: { date: string; imageUrl: string; id: number }[];
  gender?: 'male' | 'female';
  age?: number;
};
