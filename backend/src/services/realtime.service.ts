import { Response } from 'express';

interface SSEClient {
  id: string;
  res: Response;
}

class RealtimeService {
  private clients: SSEClient[] = [];

  public addClient(id: string, res: Response) {
    this.clients.push({ id, res });

    // Enviar primer heartbeat / handshake
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

    res.on('close', () => {
      this.removeClient(id);
    });
  }

  public removeClient(id: string) {
    this.clients = this.clients.filter(c => c.id !== id);
  }

  public broadcast(event: string, payload: any) {
    const data = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
    for (const client of this.clients) {
      client.res.write(`data: ${data}\n\n`);
    }
  }

  public getActiveClientsCount(): number {
    return this.clients.length;
  }
}

export const realtimeService = new RealtimeService();
