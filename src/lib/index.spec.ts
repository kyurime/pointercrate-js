import test from 'ava';

import PointercrateClient from '.';

// global client (why not?)
const client = new PointercrateClient();

test("getting demon by id 1", async t => {
	const demon = await client.demons.from_id(1);

	t.is(demon.id, 1);
})

test("getting demon by position 2", async t => {
	const demon = await client.demons.from_position(2);

	t.is(demon.position, 2);
})