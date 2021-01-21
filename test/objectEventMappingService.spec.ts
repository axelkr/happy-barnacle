'use strict';

import { expect } from 'chai';
import { ObjectEventMappingService } from '../src/objectEventMappingService';
import { ObjectEvent } from '../src/objectEvent';

describe('ObjectEventMappingService', () => {
	it('should create an instance using its constructor', () => {
		const example: ObjectEventMappingService = new ObjectEventMappingService();
		expect(example, 'example should exist').to.exist; // tslint:disable-line:no-unused-expression
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
		const testObject: ObjectEventMappingService = new ObjectEventMappingService();
		const returnValue = testObject.toObjectEvent(testObject.toObjectEventDB(sampleInput));
		expect(returnValue.topic).to.equal(sampleInput.topic);
		expect(returnValue.id).to.equal(sampleInput.id);
		expect(returnValue.object).to.equal(sampleInput.object);
		expect(returnValue.objectType).to.equal(sampleInput.objectType);
		expect(returnValue.eventType).to.equal(sampleInput.eventType);
		expect(returnValue.time).to.deep.equals(sampleInput.time);
		expect(returnValue.payload).to.deep.equal(sampleInput.payload);
	});
});
