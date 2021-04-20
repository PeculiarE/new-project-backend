import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const salt = genSaltSync(10);

export const hashInput = (data) => hashSync(data, salt);

export const generateUUID = () => uuidv4();
