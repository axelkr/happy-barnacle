import { Logger } from 'sitka';
import express from 'express';

import {Database} from './Database';

export class Server {
    private logger: Logger;
    private db: Database

	constructor() {
        this.logger = Logger.getLogger({ name: this.constructor.name });
        this.db = new Database();
	}

	public start(param: any): void {
        const app = express();
        const PORT = 8000;
        app.get('/', (req, res) => res.send('Express + TypeScript Server'));
        app.listen(PORT, () => {
            this.logger.debug(`Server is running at https://localhost:${PORT}`);
        });
	}
}