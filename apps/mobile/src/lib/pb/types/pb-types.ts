// === start of custom type ===

import { WardChangesType, WardItem } from "./extra-types";

// WardsEvents.WardsEventsOld_data.old_data
export type WardsEventsOld_data = Array<WardItem>;
// === end of custom type ===
// === start of custom type ===
// Wards.WardsData.data
export type WardsData = Array<WardItem>;
// === end of custom type ===
// === start of custom type ===
// WardsUpdates.WardsUpdatesData.data
export type WardsUpdatesData = WardChangesType;
// === end of custom type ===

/**
 * This file was @generated using typed-pocketbase
 */

// https://pocketbase.io/docs/collections/#base-collection
export interface BaseCollectionResponse {
	/**
	 * 15 characters string to store as record ID.
	 */
	id: string;
	/**
	 * Date string representation for the creation date.
	 */
	created: string;
	/**
	 * Date string representation for the creation date.
	 */
	updated: string;
	/**
	 * The collection id.
	 */
	collectionId: string;
	/**
	 * The collection name.
	 */
	collectionName: string;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface BaseCollectionCreate {
	/**
	 * 15 characters string to store as record ID.
	 * If not set, it will be auto generated.
	 */
	id?: string;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface BaseCollectionUpdate {}

// https://pocketbase.io/docs/collections/#auth-collection
export interface AuthCollectionResponse extends BaseCollectionResponse {
	/**
	 * The username of the auth record.
	 */
	username: string;
	/**
	 * Auth record email address.
	 */
	email: string;
	/**
	 * Auth record email address.
	 */
	tokenKey?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility: boolean;
	/**
	 * Indicates whether the auth record is verified or not.
	 */
	verified: boolean;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface AuthCollectionCreate extends BaseCollectionCreate {
	/**
	 * The username of the auth record.
	 * If not set, it will be auto generated.
	 */
	username?: string;
	/**
	 * Auth record email address.
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Auth record password.
	 */
	password: string;
	/**
	 * Auth record password confirmation.
	 */
	passwordConfirm: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface AuthCollectionUpdate {
	/**
	 * The username of the auth record.
	 */
	username?: string;
	/**
	 * The auth record email address.
	 * This field can be updated only by admins or auth records with "Manage" access.
	 * Regular accounts can update their email by calling "Request email change".
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Old auth record password.
	 * This field is required only when changing the record password. Admins and auth records with "Manage" access can skip this field.
	 */
	oldPassword?: string;
	/**
	 * New auth record password.
	 */
	password?: string;
	/**
	 * New auth record password confirmation.
	 */
	passwordConfirm?: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/collections/#view-collection
export interface ViewCollectionRecord {
	id: string;
}

// utilities

type MaybeArray<T> = T | T[];

// ===== _mfas =====

export interface MfasResponse extends BaseCollectionResponse {
	collectionName: '_mfas';
	id: string;
	collectionRef: string;
	recordRef: string;
	method: string;
	created: string;
	updated: string;
}

export interface MfasCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	method: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface MfasUpdate extends BaseCollectionUpdate {
	id?: string;
	collectionRef?: string;
	recordRef?: string;
	method?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface MfasCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_mfas';
	response: MfasResponse;
	create: MfasCreate;
	update: MfasUpdate;
	relations: Record<string, never>;
}

// ===== _otps =====

export interface OtpsResponse extends BaseCollectionResponse {
	collectionName: '_otps';
	id: string;
	collectionRef: string;
	recordRef: string;
	created: string;
	updated: string;
}

export interface OtpsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface OtpsUpdate extends BaseCollectionUpdate {
	id?: string;
	collectionRef?: string;
	recordRef?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface OtpsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_otps';
	response: OtpsResponse;
	create: OtpsCreate;
	update: OtpsUpdate;
	relations: Record<string, never>;
}

// ===== _externalAuths =====

export interface ExternalAuthsResponse extends BaseCollectionResponse {
	collectionName: '_externalAuths';
	id: string;
	collectionRef: string;
	recordRef: string;
	provider: string;
	providerId: string;
	created: string;
	updated: string;
}

export interface ExternalAuthsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	provider: string;
	providerId: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface ExternalAuthsUpdate extends BaseCollectionUpdate {
	id?: string;
	collectionRef?: string;
	recordRef?: string;
	provider?: string;
	providerId?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface ExternalAuthsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_externalAuths';
	response: ExternalAuthsResponse;
	create: ExternalAuthsCreate;
	update: ExternalAuthsUpdate;
	relations: Record<string, never>;
}

// ===== _authOrigins =====

export interface AuthOriginsResponse extends BaseCollectionResponse {
	collectionName: '_authOrigins';
	id: string;
	collectionRef: string;
	recordRef: string;
	fingerprint: string;
	created: string;
	updated: string;
}

export interface AuthOriginsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	fingerprint: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface AuthOriginsUpdate extends BaseCollectionUpdate {
	id?: string;
	collectionRef?: string;
	recordRef?: string;
	fingerprint?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface AuthOriginsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_authOrigins';
	response: AuthOriginsResponse;
	create: AuthOriginsCreate;
	update: AuthOriginsUpdate;
	relations: Record<string, never>;
}

// ===== _superusers =====

export interface SuperusersResponse extends AuthCollectionResponse {
	collectionName: '_superusers';
	id: string;
	tokenKey: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	created: string;
	updated: string;
}

export interface SuperusersCreate extends AuthCollectionCreate {
	id?: string;
	email: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface SuperusersUpdate extends AuthCollectionUpdate {
	id?: string;
	email?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface SuperusersCollection {
	type: 'auth';
	collectionId: string;
	collectionName: '_superusers';
	response: SuperusersResponse;
	create: SuperusersCreate;
	update: SuperusersUpdate;
	relations: Record<string, never>;
}

// ===== users =====

export interface UsersResponse extends AuthCollectionResponse {
	collectionName: 'users';
	id: string;
	tokenKey: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	name: string;
	avatar: string;
	traktAccessToken: string;
	traktRefreshToken: string;
	created: string;
	updated: string;
}

export interface UsersCreate extends AuthCollectionCreate {
	id?: string;
	email?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	name?: string;
	avatar?: File | null;
	traktAccessToken?: string;
	traktRefreshToken?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface UsersUpdate extends AuthCollectionUpdate {
	id?: string;
	email?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	name?: string;
	avatar?: File | null;
	traktAccessToken?: string;
	traktRefreshToken?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface UsersCollection {
	type: 'auth';
	collectionId: string;
	collectionName: 'users';
	response: UsersResponse;
	create: UsersCreate;
	update: UsersUpdate;
	relations: Record<string, never>;
}

// ===== watchlists =====

export interface WatchlistsResponse extends BaseCollectionResponse {
	collectionName: 'watchlists';
	id: string;
	title: string;
	created: string;
	updated: string;
}

export interface WatchlistsCreate extends BaseCollectionCreate {
	id?: string;
	title?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistsUpdate extends BaseCollectionUpdate {
	id?: string;
	title?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'watchlists';
	response: WatchlistsResponse;
	create: WatchlistsCreate;
	update: WatchlistsUpdate;
	relations: Record<string, never>;
}

// ===== _secrets =====

export interface SecretsResponse extends BaseCollectionResponse {
	collectionName: '_secrets';
	id: string;
	name: string;
	value: string;
	created: string;
	updated: string;
}

export interface SecretsCreate extends BaseCollectionCreate {
	id?: string;
	name?: string;
	value?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface SecretsUpdate extends BaseCollectionUpdate {
	id?: string;
	name?: string;
	value?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface SecretsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_secrets';
	response: SecretsResponse;
	create: SecretsCreate;
	update: SecretsUpdate;
	relations: Record<string, never>;
}

// ===== wards_admin =====

export interface WardsAdminResponse extends AuthCollectionResponse {
	collectionName: 'wards_admin';
	id: string;
	tokenKey: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	created: string;
	updated: string;
}

export interface WardsAdminCreate extends AuthCollectionCreate {
	id?: string;
	email: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface WardsAdminUpdate extends AuthCollectionUpdate {
	id?: string;
	email?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface WardsAdminCollection {
	type: 'auth';
	collectionId: string;
	collectionName: 'wards_admin';
	response: WardsAdminResponse;
	create: WardsAdminCreate;
	update: WardsAdminUpdate;
	relations: Record<string, never>;
}

// ===== wards_events =====

export interface WardsEventsResponse extends BaseCollectionResponse {
	collectionName: 'wards_events';
	id: string;
	event_type: 'INSERT' | 'UPDATE' | 'DELETE';
	ward_id: number;
	client_id: string;
	client_event_id: string;
	approved: boolean;
	old_data?: WardsEventsOld_data
	new_data: Record<string, any> | Array<any> | null;
}

export interface WardsEventsCreate extends BaseCollectionCreate {
	id?: string;
	event_type: 'INSERT' | 'UPDATE' | 'DELETE';
	ward_id?: number;
	client_id?: string;
	client_event_id?: string;
	approved?: boolean;
	old_data?: WardsEventsOld_data
	new_data?: Record<string, any> | Array<any> | null;
}

export interface WardsEventsUpdate extends BaseCollectionUpdate {
	id?: string;
	event_type?: 'INSERT' | 'UPDATE' | 'DELETE';
	ward_id?: number;
	'ward_id+'?: number;
	'ward_id-'?: number;
	client_id?: string;
	client_event_id?: string;
	approved?: boolean;
	old_data?: WardsEventsOld_data
	new_data?: Record<string, any> | Array<any> | null;
}

export interface WardsEventsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'wards_events';
	response: WardsEventsResponse;
	create: WardsEventsCreate;
	update: WardsEventsUpdate;
	relations: Record<string, never>;
}

// ===== wards_updates =====

export interface WardsUpdatesResponse extends BaseCollectionResponse {
	collectionName: 'wards_updates';
	id: string;
	version: number;
	created_by: string;
	description: string;
	ready: boolean;
	data?: WardsUpdatesData
	updated: string;
	created: string;
}

export interface WardsUpdatesCreate extends BaseCollectionCreate {
	id?: string;
	version: number;
	created_by?: string;
	description?: string;
	ready?: boolean;
	data?: WardsUpdatesData
	updated?: string | Date;
	created?: string | Date;
}

export interface WardsUpdatesUpdate extends BaseCollectionUpdate {
	id?: string;
	version?: number;
	'version+'?: number;
	'version-'?: number;
	created_by?: string;
	description?: string;
	ready?: boolean;
	data?: WardsUpdatesData
	updated?: string | Date;
	created?: string | Date;
}

export interface WardsUpdatesCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'wards_updates';
	response: WardsUpdatesResponse;
	create: WardsUpdatesCreate;
	update: WardsUpdatesUpdate;
	relations: Record<string, never>;
}

// ===== Schema =====

export type Schema = {
	_mfas: MfasCollection;
	_otps: OtpsCollection;
	_externalAuths: ExternalAuthsCollection;
	_authOrigins: AuthOriginsCollection;
	_superusers: SuperusersCollection;
	users: UsersCollection;
	watchlists: WatchlistsCollection;
	_secrets: SecretsCollection;
	wards_admin: WardsAdminCollection;
	wards_events: WardsEventsCollection;
	wards_updates: WardsUpdatesCollection;
};
