import { DBMappingService } from '../src/DBMappingService';
import { ObjectEvent } from 'choicest-barnacle';

describe('DBMappingService', () => {
	it('should create an instance using its constructor', () => {
		const example = new DBMappingService();
		expect(example).toBeDefined();
	});

	it('should return input after converting back and forth', () => {
		const sampleInput: ObjectEvent = {
			topic: 'randomTopic2§',
			id: 5723,
			object: 'randonObject',
			objectType: 'objtsahik24S',
			eventType: ' hlkfaf',
			time: new Date(2021, 1, 2, 11, 13, 44),
			payload: new Map<string, string>([['a', 'bsad4'], ['b', 'adsada'], ['c', 'asd']])
		};
		const testObject = new DBMappingService();
		const returnValue = testObject.toObjectEvent(testObject.toObjectEventDB(sampleInput));
		expect(returnValue.topic).toBe(sampleInput.topic);
		expect(returnValue.id).toBe(sampleInput.id);
		expect(returnValue.object).toBe(sampleInput.object);
		expect(returnValue.objectType).toBe(sampleInput.objectType);
		expect(returnValue.eventType).toBe(sampleInput.eventType);
		expect(returnValue.time).toStrictEqual(sampleInput.time);
		expect(returnValue.payload).toStrictEqual(sampleInput.payload);
	});
});
