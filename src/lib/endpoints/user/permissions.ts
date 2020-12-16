export enum Permissions {
	ExtendedAccess = 1 << 0,
	ListHelper = 1 << 1,
	ListModerator = 1 << 2,
	ListAdministrator = 1 << 3,
	LeaderboardModerator = 1 << 4,
	LeaderboardAdministrator = 1 << 5,
	Moderator = 1 << 13,
	Administrator = 1 << 14,
	Impossible = 1 << 15,
}

export default Permissions;