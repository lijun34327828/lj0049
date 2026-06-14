/**
 * local server entry file, for local development
 */
import app from './app.js';
import { WebSocketServer } from 'ws';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

let latestState: { components: unknown[]; selectedId: string | null } | null = null;

wss.on('connection', (ws) => {
  console.log('[WS] Client connected');

  if (latestState) {
    ws.send(
      JSON.stringify({
        type: 'state_sync',
        payload: latestState,
      })
    );
  }

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'state_sync' && message.payload) {
        latestState = message.payload;
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(data.toString());
          }
        });
      }

      if (message.type === 'request_sync' && latestState) {
        ws.send(
          JSON.stringify({
            type: 'state_sync',
            payload: latestState,
          })
        );
      }
    } catch (e) {
      console.error('[WS] Parse error:', e);
    }
  });

  ws.on('close', () => {
    console.log('[WS] Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('[WS] Error:', err);
  });
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  wss.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  wss.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;