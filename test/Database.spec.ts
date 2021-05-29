import { ObjectEvent, Topic } from 'choicest-barnacle';
import { Database, OptionsQueryObjectEvents } from '../src/Database';

describe('Database', () => {
	let testDB: Database;

	beforeEach(() => {
		testDB = new Database(':memory:');
	});

	test('no topics stored initially', () => {
		const initiallyStoredTopics = testDB.queryTopics();
		expect(initiallyStoredTopics.length).toBe(0);
	});

	test('queryObjectEvents: setting the limit parameter leads to that at most _limit_ number results are returned.', () => {
		const limit = 5;
		const nrObjectEvents = 3 * limit;
		const aTopic = new Topic('aTopicId', 'aTopicName');
		testDB.storeTopic(aTopic);
		for (let i = 0; i < nrObjectEvents; i = i + 1) {
			testDB.storeObjectEvent(createRandomObjectEvent(aTopic, i.toString()));
		}
		const queryParameters: OptionsQueryObjectEvents = { limit: limit, start: 0 };
		expect(testDB.queryObjectEvents(aTopic.id, queryParameters)).toHaveLength(limit);
	});


	test('queryObjectEvents: result set starts with element at (optional) start parameter', () => {
		const limit = 5;
		const start = 7;
		const nrObjectEvents = 3 * limit;
		const aTopic = new Topic('aTopicId', 'aTopicName');
		testDB.storeTopic(aTopic);
		for (let i = 0; i < nrObjectEvents; i = i + 1) {
			testDB.storeObjectEvent(createRandomObjectEvent(aTopic, i.toString()));
		}
		const queryParameters: OptionsQueryObjectEvents = { limit: limit, start: start };
		expect(testDB.queryObjectEvents(aTopic.id, queryParameters)[0].object).toEqual(start.toString());
	});
});

function createRandomObjectEvent(aTopic: Topic, object: string): ObjectEvent {
	const result = new ObjectEvent();
	result.topic = aTopic.id;
	result.time = new Date();
	result.payload = new Map<string, string>();
	result.eventType = 'eventType';
	result.object = object;
	result.objectType = 'objectType';
	return result;
}

