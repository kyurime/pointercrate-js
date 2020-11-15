import test from 'ava';

import PointercrateClient from '.';

// global client (why not?)
const client = new PointercrateClient("http://localhost:8088/api/");

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

test("getting player with id 1", async t => {
	const player = await client.players.from_id(1);

	t.is(player.id, 1);
});

test("getting ranked players", async t => {
	const players = await client.players.by_ranking();

	t.is(players[1].rank, 2);
});

test("logging into account through password", async t => {
	await client.login("test", "testaccount");

	t.true(client.user != undefined);
});