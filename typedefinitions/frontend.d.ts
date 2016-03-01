
/// <reference path="./imd/IMD.d.ts" />
/// <reference path="./polymer/polymer.d.ts" />

// Currently handles only authentication and no authorization. Will be implemented if we need it.
// Trying to avoid it as much as possible because 'asdf'. Want to keep application simple.
interface AuthService {
	isAuthenticated: boolean;
}
