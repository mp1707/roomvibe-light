# Testing the Credits System

### Step 1: Test Credit Allocation

1. Create a new user account
2. Verify they receive 10 welcome credits
3. Check the credits display in the header

### Step 2: Test Credit Deduction

1. Upload an image (should deduct 5 credits)
2. Apply a suggestion (should deduct 5 credits)
3. Verify credits are properly deducted and transactions are recorded

### Step 3: Test Stripe Payments

Use Stripe test card numbers:

- **Successful payment**: `4242 4242 4242 4242`
- **Payment requires authentication**: `4000 0025 0000 3155`
- **Payment declined**: `4000 0000 0000 0002`

### Step 4: Test Webhook Handling

1. Make a test purchase
2. Check that credits are added to the user's account
3. Verify transaction is recorded in the database

### Step 5: Test Insufficient Credits

1. Reduce a user's credits in the database
2. Try to analyze an image or apply a suggestion
3. Verify proper error messages are shown

# Local Development with Stripe CLI

### Step 1: Install Stripe CLI

Download and install the Stripe CLI from [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

### Step 2: Login to Stripe

```bash
stripe login
```

### Step 3: Forward Webhooks to Local Development

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhooks
```

This will output a webhook signing secret. Add it to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_local_webhook_secret
```

# Production Checklist

### Before Going Live:

- [ ] Switch Stripe account to live mode
- [ ] Update environment variables with live keys
- [ ] Set up production webhook endpoint
- [ ] Configure proper error monitoring
- [ ] Test with small real payments
- [ ] Verify tax settings if applicable
- [ ] Ensure HTTPS is properly configured
- [ ] Test webhook delivery in production
- [ ] Set up Stripe email receipts
- [ ] Configure proper logging and monitoring

### Security Considerations:

- [ ] Never expose secret keys in client-side code
- [ ] Verify webhook signatures
- [ ] Use HTTPS for all webhook endpoints
- [ ] Implement rate limiting on sensitive endpoints
- [ ] Use Row Level Security (RLS) in Supabase
- [ ] Regularly rotate API keys
- [ ] Monitor for suspicious activity

# Troubleshooting

### Common Issues:

**Credits not appearing after payment:**

- Check webhook delivery in Stripe Dashboard
- Verify webhook signature validation
- Check server logs for errors

**Database permission errors:**

- Verify RLS policies are correctly set
- Check that service role key is used for admin operations

**Stripe API errors:**

- Verify API keys are correct for the environment
- Check if test/live mode keys match the Stripe account mode

**Webhook signature verification fails:**

- Ensure webhook secret matches the endpoint
- Verify raw request body is used for signature verification

# Monitoring and Analytics

### Key Metrics to Track:

- Credit purchase conversion rates
- Average credits spent per user
- Most popular credit packages
- Credit refund rates
- Failed payment rates

### Recommended Tools:

- Stripe Dashboard for payment analytics
- Supabase Dashboard for database monitoring
- Application logging for error tracking
- Custom analytics for user behavior

## Support

If you encounter any issues during setup, check:

1. Stripe Dashboard logs
2. Supabase real-time logs
3. Application console errors
4. Network tab for failed API requests

For additional help, refer to:

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
