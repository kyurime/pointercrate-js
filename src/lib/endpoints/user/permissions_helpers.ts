import Permissions from "./permissions";

/**
 * converts a permissions number to a list of permissions enums
 * @param user_permissions permissions of the user to convert
 */
export function permissions_list(user_permissions: number) {
	const permissions_list: Permissions[] = [];

	for (const permission in Permissions) {
		// returns both the values we want and the names of each key
		if (isNaN(Number(permission))) {
			continue;
		}

		if ((user_permissions & Number(permission)) == Number(permission)) {
			permissions_list.push(Number(permission));
		}
	}

	return permissions_list;
}

/**
 * gets list of permissions with inheritance
 * @param user_permissions permissions of user
 */
export function implied_permissions(user_permissions: number) {
	const has_permissions = permissions_list(user_permissions);

	// this is how pointercrate does it (shrug)
	if (has_permissions.includes(Permissions.Administrator)) {
		has_permissions.push(Permissions.Administrator);
	}

	if (has_permissions.includes(Permissions.ListAdministrator)) {
		has_permissions.push(Permissions.ListModerator);
	}

	if (has_permissions.includes(Permissions.ListModerator)) {
		has_permissions.push(Permissions.ListHelper);
	}

	if (has_permissions.includes(Permissions.ListHelper)) {
		has_permissions.push(Permissions.ExtendedAccess);
	}

	if (has_permissions.includes(Permissions.LeaderboardAdministrator)) {
		has_permissions.push(Permissions.LeaderboardModerator);
	}

	return has_permissions;
}