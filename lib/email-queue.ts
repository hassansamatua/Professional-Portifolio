// Email queue system to prevent hitting rate limits
interface EmailJob {
  id: string;
  type: 'user_confirmation' | 'admin_notification' | 'admin_reply';
  to: string;
  subject: string;
  data: any;
  priority: 'high' | 'normal' | 'low';
  attempts: number;
  nextAttempt?: Date;
  createdAt: Date;
}

class EmailQueue {
  private queue: EmailJob[] = [];
  private processing = false;
  private maxRetries = 3;
  private retryDelay = 5 * 60 * 1000; // 5 minutes in milliseconds

  add(job: Omit<EmailJob, 'id' | 'createdAt' | 'attempts'>): void {
    const emailJob: EmailJob = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date(),
      attempts: 0,
      nextAttempt: new Date()
    };

    // Add to queue based on priority
    if (job.priority === 'high') {
      this.queue.unshift(emailJob);
    } else {
      this.queue.push(emailJob);
    }
  }

  async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const jobsToProcess = this.queue.splice(0, 10); // Process max 10 at a time
    this.queue = this.queue.slice(jobsToProcess.length);

    for (const job of jobsToProcess) {
      try {
        await this.sendEmail(job);
        console.log(`Email sent successfully: ${job.type} to ${job.to}`);
      } catch (error) {
        console.error(`Failed to send email ${job.id}:`, error);
        await this.retryJob(job);
      }
    }

    this.processing = false;
  }

  private async sendEmail(job: EmailJob): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: job.type,
        to: job.to,
        subject: job.subject,
        data: job.data
      })
    });

    if (!response.ok) {
      throw new Error(`Email API failed: ${response.statusText}`);
    }
  }

  private async retryJob(job: EmailJob): Promise<void> {
    job.attempts++;
    
    if (job.attempts >= this.maxRetries) {
      console.error(`Max retries exceeded for email ${job.id}`);
      return;
    }

    job.nextAttempt = new Date(Date.now() + this.retryDelay);
    this.queue.push(job);
  }

  getStats() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      totalProcessed: this.queue.filter(job => job.attempts > 0).length
    };
  }
}

export const emailQueue = new EmailQueue();
