import { Logger } from 'sitka';
import express from 'express';

export class Server {
	private _logger: Logger;

	constructor() {
		this._logger = Logger.getLogger({ name: this.constructor.name });
	}

	public start(param: any): void {
        const app = express();
        const PORT = 8000;
        app.get('/', (req, res) => res.send('Express + TypeScript Server'));
        app.listen(PORT, () => {
            this._logger.debug(`Server is running at https://localhost:${PORT}`);
        });
	}
}