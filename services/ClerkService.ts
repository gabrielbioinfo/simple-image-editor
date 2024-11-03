import { UserJSON, WebhookEvent } from '@clerk/nextjs/server';
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { Webhook } from 'svix';
import UsersDataService from './UsersDataService';

export default class ClerkService {

  private WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
  private svixId: string = ''
  private svixTimestamp: string = ''
  private svixSignature: string = ''
  private usersWebhook: Webhook
  private usersDataService = new UsersDataService()

  constructor(headerPayload: ReadonlyHeaders) {
    if (!this.WEBHOOK_SECRET) {
      throw new Error('[CA#001] Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }
    this.usersWebhook = new Webhook(this.WEBHOOK_SECRET!)

    this.svixId = headerPayload.get('svix-id') || ''
    this.svixTimestamp = headerPayload.get('svix-timestamp') || ''
    this.svixSignature = headerPayload.get('svix-signature') || ''
    if (!this.svixId || !this.svixTimestamp || !this.svixSignature) {
      throw new Error('[CA#002] Error occured -- no svix headers')
    }
  }

  async receiveEvent(req: Request): Promise<{ body: any, event: WebhookEvent}> {
    const payload = await req.json()
    const body = JSON.stringify(payload)
    try {
      const verifiedEvent = {
        body,
        event: this.usersWebhook.verify(body, {
          'svix-id': this.svixId,
          'svix-timestamp': this.svixTimestamp,
          'svix-signature': this.svixSignature,
        }) as WebhookEvent
      }
      await this.handleEvent(verifiedEvent.event)
      this.logEventData(verifiedEvent.event, body)
      
      return verifiedEvent
    } catch (err) {
      console.error('Error verifying webhook:', err)
      throw new Error('[CA#003] Error occured')
    }
  }

  private async handleEvent(event: WebhookEvent) {
    const tenantId = process.env.DEFAULT_TENANT ? parseInt(process.env.DEFAULT_TENANT): 0;
    switch(event.type){
      case 'user.created':
        this.handleUserCreatedEvent(tenantId, event)
        break
      case 'user.updated':
        this.handleUserUpdatedEvent(tenantId, event)
        break
      case 'user.deleted':
        this.handleUserDeletedEvent(tenantId, event)
        break
      default:
        console.log(`Event ${event.type} not supported!`)
    }
  }

  private async handleUserCreatedEvent(tenantId: number, { type, data }: WebhookEvent) {
    const { id: userId } = data as UserJSON
    console.log('handling user creation', { type, userId, data })
    await this.usersDataService.createUser(tenantId, data)
  }

  private async handleUserUpdatedEvent(tenantId: number, { type, data }: WebhookEvent) {
    const { id: userId } = data as UserJSON
    console.log('handling user updated', { type, userId, data });
    await this.usersDataService.updateUser(tenantId, userId, data)
  }

  private async handleUserDeletedEvent(tenantId: number, { type, data }: WebhookEvent) {
    const { id: userId } = data as UserJSON
    console.log('handling user deleted', { type, userId, data });
    await this.usersDataService.deleteUserByClerkId(tenantId, userId)
  }

  private logEventData(event: WebhookEvent, body: string) {
    const { id } = event.data
    const eventType = event.type
    console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
    console.log('Webhook body:', body)

  }

}