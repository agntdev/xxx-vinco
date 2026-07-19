# XXX VINCO Video Subscriptions — Bot specification

**Archetype:** content

**Voice:** professional and friendly — write every user-facing message, button label, error, and empty state in this voice.

Telegram bot delivering curated video content with free and paid tiers. Users browse, preview, and subscribe to receive videos; admins upload content, schedule releases, and manage subscriptions. Combines Telegram Payments for in-chat purchases with external payment fallbacks.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- general public
- content subscribers
- video creators

## Success criteria

- Users can browse and access free/paid videos based on subscription status
- Admins can upload/schedule content with metadata and visibility controls
- Payment flows complete successfully for both Telegram Payments and external links
- Notification preferences respected for new content alerts

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open main menu with Browse/Subscribe options
- **Browse Videos** (button, actor: user, callback: feed:latest) — View vertical feed of latest videos
- **My Subscription** (button, actor: user, callback: account:subscription) — View subscription status and upgrade options
- **/admin_upload** (command, actor: admin, command: /admin_upload) — Open admin content upload interface
- **Help** (button, actor: user, callback: support:help) — Access bot usage instructions

## Flows

### Onboarding
_Trigger:_ /start

1. Display welcome message with bot purpose
2. Show quick buttons: Browse, My Subscription, Help
3. Prompt unauthenticated users to start browsing

_Data touched:_ User

### Video Purchase
_Trigger:_ subscription:upgrade

1. Display available plans with pricing and benefits
2. Initiate Telegram Payment or external checkout flow
3. Update User subscription status on success

_Data touched:_ User, SubscriptionPlan

### Content Upload
_Trigger:_ /admin_upload

1. Request video file/URL and metadata
2. Schedule publish time and set visibility (free/paid)
3. Confirm upload and notify admin

_Data touched:_ Video, AdminNotification

### Content Delivery
_Trigger:_ video:publish

1. Generate broadcast message with thumbnail and View button
2. Send to eligible users based on subscription status
3. Track video views in User watch history

_Data touched:_ Video, User, Notification

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **User** _(retention: persistent)_ — Telegram user profile with subscription status and preferences
  - fields: telegram_id, subscription_status, notification_preference, watch_history
- **Video** _(retention: persistent)_ — Video content metadata and delivery configuration
  - fields: title, source_url, visibility, publish_time, tags
- **SubscriptionPlan** _(retention: persistent)_ — Available subscription tiers and pricing
  - fields: name, price, billing_cycle, access_level
- **AdminNotification** _(retention: session)_ — System events sent to admin accounts
  - fields: event_type, timestamp, related_entity_id

## Integrations

- **Telegram** (required) — Bot API messaging and payments
- **Telegram Payments** (required) — In-chat subscription payments
- **External Payment Gateway** (required) — Fallback payment processing
- **Video Hosting Service** (required) — Store and stream uploaded content
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Upload and schedule video content
- Configure subscription plans
- Manage admin user access
- View subscriber analytics
- Set free content availability rules

## Notifications

- New video alerts to subscribers
- Payment confirmation messages
- Admin upload success/failure alerts
- Subscription status updates

## Permissions & privacy

- User payment data encrypted and stored securely
- Admin access restricted to pre-configured accounts
- Watch history only visible to users
- Compliance with Telegram's data storage policies

## Edge cases

- Payment failures during subscription upgrade
- Invalid video source URLs
- Users requesting access to paid content without active subscription
- Scheduled content publish time conflicts

## Required tests

- End-to-end payment flow with Telegram Payments
- Admin upload workflow with scheduled publishing
- Notification filtering by subscription status
- User watch history tracking accuracy

## Assumptions

- Telegram Payments available in all target regions
- External video hosting service scales with demand
- Admin team will manually handle content moderation
- Basic analytics sufficient for business needs
