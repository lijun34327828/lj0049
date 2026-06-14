import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/store';
import { ComponentConfig } from '@/types';

interface WsMessage {
  type: 'state_sync' | 'request_sync' | 'ping';
  payload?: {
    components: ComponentConfig[];
    selectedId: string | null;
  };
}

export const useWebSocket = (autoSync = true) => {
  const wsRef = useRef<WebSocket | null>(null);
  const isSyncingRef = useRef(false);

  const connect = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[WS] Connected');
      if (autoSync) {
        ws.send(JSON.stringify({ type: 'request_sync' }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const message: WsMessage = JSON.parse(event.data);

        if (message.type === 'state_sync' && message.payload && !isSyncingRef.current) {
          const { components, selectedId } = message.payload;
          useStore.setState({ components, selectedId });
        }

        if (message.type === 'request_sync') {
          const state = useStore.getState();
          ws.send(
            JSON.stringify({
              type: 'state_sync',
              payload: {
                components: state.components,
                selectedId: state.selectedId,
              },
            })
          );
        }
      } catch (e) {
        console.error('[WS] Parse error:', e);
      }
    };

    ws.onclose = () => {
      console.log('[WS] Disconnected, reconnecting in 2s...');
      setTimeout(connect, 2000);
    };

    ws.onerror = (err) => {
      console.error('[WS] Error:', err);
    };

    wsRef.current = ws;
    return ws;
  }, [autoSync]);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws.close();
    };
  }, [connect]);

  useEffect(() => {
    const unsubscribe = useStore.subscribe((state, prevState) => {
      if (
        state.components !== prevState.components ||
        state.selectedId !== prevState.selectedId
      ) {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          isSyncingRef.current = true;
          wsRef.current.send(
            JSON.stringify({
              type: 'state_sync',
              payload: {
                components: state.components,
                selectedId: state.selectedId,
              },
            })
          );
          setTimeout(() => {
            isSyncingRef.current = false;
          }, 50);
        }
      }
    });

    return unsubscribe;
  }, []);

  return wsRef;
};
