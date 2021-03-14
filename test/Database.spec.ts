import { Database } from '../src/Database';

describe('Database', () => {
	let testDB: Database;

	beforeEach(() => {
		testDB = new Database(':memory:');
	});

	test('no topics stored initially', () => {
		const initiallyStoredTopics = testDB.queryTopics();
		expect(initiallyStoredTopics.length).toBe(0);
	});
});

