import test from 'ava';

import PointercrateClient from '.';

// global client (why not?)
const client = new PointercrateClient({ url: "http://localhost:8088/api" });

test.serial("logging into account through password", async t => {
	await client.login("test", "testaccount");

	t.true(client.user != undefined);
});

test("getting demon by id 1", async t => {
	const demon = await client.demons.from_id(1);

	t.is(demon.id, 1);
});

test("getting demon by position 2", async t => {
	const demon = await client.demons.from_position(2);

	t.is(demon.position, 2);
});

test("getting demons by position", async t => {
	const demons = await client.demons.by_position();

	// demons is array so +1 for the position we want
	t.is(demons[1].position, 2);
});

test("getting demons by id", async t => {
	const demons = await client.demons.by_id();

	t.is(demons[1].id, 2);
});

test("creating demon by position, name validation check", async t => {
	const name = Math.random().toString(36).slice(2);

	const demon = await client.demons.add({
		name,
		position: 2,
		requirement: 50,
		verifier: "a",
		publisher: "a",
		creators: ["a"],
	});

	t.is(demon.name, name);
});

test("getting player with id 1", async t => {
	const player = await client.players.from_id(1);

	t.is(player.id, 1);
});

test("getting ranked players", async t => {
	const players = await client.players.by_ranking();

	t.is(players[1].rank, 2);
});

test("record deletion", async t => {
	const records = await client.records.list();

	// this doesn't actually have an etag though, so we need to promote
	const full_test_record = await records[0].full_record();

	await full_test_record.delete();

	t.pass();
});

test("getting metadata", async t => {
	const metadata = await client.get_metadata();

	t.assert(metadata.extended_list_size >= metadata.list_size);
});