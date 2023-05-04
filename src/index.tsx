/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable unicorn/no-await-expression-member */
import { Context, Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { Index } from './ui';

export type KVKeyName = 'enabledFlags' | 'disabledFlags';
export type Bindings = { KV: KVNamespace<KVKeyName> };
export type Variables = { enabledFlags: string[]; disabledFlags: string[]; flag: string };
export type Env = { Bindings: Bindings; Variables: Variables };

const app = new Hono<Env>();

app.get('/static/*', serveStatic({ root: './' }));

// Performance "optimized" routes
app.get('/flags', async (c) => {
  c.header('Content-Type', 'application/json');
  return c.body((await c.env.KV.get('enabledFlags')) || '');
});
app.get('/flag/:name', async (c) => {
  c.header('Content-Type', 'application/json');
  return c.body(
    ((await c.env.KV.get('enabledFlags', 'json')) as string[]).includes(c.req.param('name')) ? 'true' : 'false',
  );
});

app.use('*', async (c, next) => {
  c.set('enabledFlags', (await c.env.KV.get('enabledFlags', 'json')) ?? []);
  c.set('disabledFlags', (await c.env.KV.get('disabledFlags', 'json')) ?? []);
  return next();
});

app.get('/', (c) => {
  const combinedFlags = [
    ...c.get('enabledFlags').map((f) => ({ name: f, enabled: true })),
    ...c.get('disabledFlags').map((f) => ({ name: f, enabled: false })),
  ];
  return c.html(<Index flags={combinedFlags} />);
});

app.use('*', async (c, next) => {
  const { flag } = await c.req.parseBody();
  if (!(typeof flag === 'string')) return c.text('Invalid flag');
  c.set('flag', flag);
  return next();
});

const addToKVList = async (c: Context<Env, any, {}>, key: KVKeyName) =>
  c.env.KV.put(key, JSON.stringify([...c.get(key), c.get('flag')]));

const removeFromKVList = async (c: Context<Env, any, {}>, key: KVKeyName) =>
  c.env.KV.put(key, JSON.stringify(c.get(key).filter((flag) => flag !== c.get('flag'))));

app.post('/add', async (c) => {
  await addToKVList(c, 'disabledFlags');
  return c.redirect('/');
});

app.post('/remove', async (c) => {
  await removeFromKVList(c, 'disabledFlags');
  return c.redirect('/');
});

app.post('/enable', async (c) => {
  await removeFromKVList(c, 'disabledFlags');
  await addToKVList(c, 'enabledFlags');
  return c.redirect('/');
});

app.post('/disable', async (c) => {
  await removeFromKVList(c, 'enabledFlags');
  await addToKVList(c, 'disabledFlags');
  return c.redirect('/');
});

export default app;
