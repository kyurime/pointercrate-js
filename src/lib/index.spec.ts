import test from 'ava';

import PointercrateClient from '.';

test("getting demon by id 1", async t => {
	const client = new PointercrateClient();
	const demon = await client.demons.from_id(1);

	t.is(demon.id, 1);
})