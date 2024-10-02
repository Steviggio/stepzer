export type User = {
  uid: string; 
  displayName: string | null;
  email: string; 
  phone: string | null; 
  providers: string[];
  providerType: string | null;
}
