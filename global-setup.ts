import * as path from 'path';
// @ts-ignore
import dotenv from 'dotenv';

export default async () => {
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
};
