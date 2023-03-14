import * as dotenv from 'dotenv';
import {AppBuilder} from '@/app';
import {Database} from '@/database';
import router from '@/router';

dotenv.config();

const database = new Database();

const app = new AppBuilder().setDatabase(database).setRouter(router).build();

app.init();
app.start();
