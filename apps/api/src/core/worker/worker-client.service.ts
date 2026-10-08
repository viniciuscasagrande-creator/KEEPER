import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WorkerClientService {
  private readonly logger = new Logger(WorkerClientService.name);

  /**
   * Invokes the internal worker service using the Vercel internal service binding (WORKER_URL)
   */
  async triggerOutboxRelay(): Promise<{ success: boolean; message?: string }> {
    const workerBaseUrl = process.env.WORKER_URL;
    if (!workerBaseUrl) {
      this.logger.debug('WORKER_URL binding is not set in this environment. Skipping internal worker call.');
      return { success: false, message: 'WORKER_URL binding not configured' };
    }

    try {
      const endpoint = new URL('/jobs/outbox-relay', workerBaseUrl);
      this.logger.log(`Invoking internal worker service via binding: ${endpoint.toString()}`);

      const response = await fetch(endpoint.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Worker returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as Record<string, unknown>;
      return { success: true, ...data };
    } catch (error: any) {
      this.logger.error(`Failed to invoke internal worker: ${error.message}`);
      return { success: false, message: error.message };
    }
  }
}
