/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ClerkErrorRoot {
  status: number;
  clerkError: boolean;
  errors: Error[];
}

export interface Error {
  code: string;
  message: string;
  longMessage: string;
}

export interface Tasks {
  title: string;
  status: string;
  importance: string;
  due: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  category: CategoryResponse;
  ownerId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CategoryResponse {
  name: string;
  colorCode: string;
  id: string;
}

export interface SessionWithActivitiesResource {
  id: string;
  pathRoot: string;
  status: string;
  abandonAt: Date;
  expireAt: Date;
  lastActiveAt: Date;
  actor: any | null;
  latestActivity: SessionActivity;
}

interface SessionActivity {
  id: string;
  browserName: string | undefined;
  browserVersion: string;
  city: string;
  country: string;
  deviceType: string;
  ipAddress: string;
  isMobile: boolean;
}

export interface ClerkUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  username: string;
  imageUrl: string;
  hasImage: boolean;
  primaryEmailAddressId: string;
  primaryEmailAddress: EmailAddress;
  primaryPhoneNumberId: string | null;
  primaryPhoneNumber: PhoneNumber | null;
  primaryWeb3WalletId: string | null;
  primaryWeb3Wallet: Web3Wallet | null;
  emailAddresses: EmailAddress[];
  phoneNumbers: PhoneNumber[];
  web3Wallets: Web3Wallet[];
  externalAccounts: ExternalAccount[];
  samlAccounts: SAMLAccount[];
  passkeys: Passkey[];
  enterpriseAccounts: EnterpriseAccount[];
  organizationMemberships: OrganizationMembership[];
  externalId: string | null;
  publicMetadata: Record<string, any>;
  unsafeMetadata: Record<string, any>;
  backupCodeEnabled: boolean;
  passwordEnabled: boolean;
  totpEnabled: boolean;
  twoFactorEnabled: boolean;
  createOrganizationEnabled: boolean;
  createOrganizationsLimit: number | null;
  deleteSelfEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSignInAt: Date;
  legalAcceptedAt: Date | null;
  pathRoot: string;

  // Methods
  createBackupCode(): Promise<any>;
  createEmailAddress(params: any): any;
  createExternalAccount(params: any): Promise<any>;
  createPasskey(): any;
  createPhoneNumber(params: any): any;
  createTOTP(): Promise<any>;
  createWeb3Wallet(params: any): any;
  delete(): any;
  disableTOTP(): Promise<any>;
  getOrganizationInvitations(params: any): any;
  getOrganizationMemberships(params: any): any;
  getOrganizationSuggestions(params: any): any;
  getSessions(): Promise<SessionWithActivitiesResource[]>;
  isPrimaryIdentification(params: any): any;
  leaveOrganization(params: any): Promise<any>;
  removePassword(params: any): any;
  setProfileImage(params: any): any;
  update(params: any): any;
  updatePassword(params: any): any;
  verifyTOTP(params: any): Promise<any>;

  // Getters
  readonly hasVerifiedEmailAddress: boolean;
  readonly hasVerifiedPhoneNumber: boolean;
  readonly unverifiedExternalAccounts: ExternalAccount[];
  readonly verifiedExternalAccounts: ExternalAccount[];
  readonly verifiedWeb3Wallets: Web3Wallet[];
}

// Supporting types
interface EmailAddress {
  id: string;
  pathRoot: string;
  emailAddress: string;
  matchesSsoConnection: boolean;
  linkedTo: any[];
  verified: boolean;
  // Additional properties may exist
}

interface PhoneNumber {
  id: string;
  phoneNumber: string;
  verified: boolean;
  // Additional properties
}

interface Web3Wallet {
  id: string;
  address: string;
  verified: boolean;
  // Additional properties
}

interface ExternalAccount {
  id: string;
  provider: string;
  // Additional properties
}

interface SAMLAccount {
  id: string;
  // Additional properties
}

interface Passkey {
  id: string;
  name: string;
  // Additional properties
}

interface EnterpriseAccount {
  id: string;
  // Additional properties
}

interface OrganizationMembership {
  id: string;
  organization: {
    id: string;
    name: string;
    // Additional properties
  };
  role: string;
  // Additional properties
}
